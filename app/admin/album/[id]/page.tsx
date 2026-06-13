"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { showToast } from "nextjs-toast-notify";

type AdminPhoto = {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  visibility?: string;
};

type AdminAlbum = {
  id: string;
  name: string | null;
  title: string;
  slug: string;
  cover_url: string | null;
  visibility: string;
  photos: AdminPhoto[];
};

function SortablePhoto({
  photo,
  onDelete,
  onToggleVisibility,
  deleting,
  toggling,
}: {
  photo: AdminPhoto;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, current: string | undefined) => void;
  deleting: boolean;
  toggling: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: photo.id });

  const photoPublic = photo.visibility !== "private";

  return (
    <div
      ref={setNodeRef}
      style={{
        background: "var(--bg-surface)",
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : undefined,
      }}
      className="relative aspect-square overflow-hidden group"
    >
      {/* Drag handle — top area */}
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-x-0 top-0 h-8 z-10 cursor-grab active:cursor-grabbing flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "rgba(0,0,0,0.4)" }}
      >
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <rect y="0" width="16" height="2" rx="1" fill="rgba(255,255,255,0.5)" />
          <rect y="4" width="16" height="2" rx="1" fill="rgba(255,255,255,0.5)" />
          <rect y="8" width="16" height="2" rx="1" fill="rgba(255,255,255,0.5)" />
        </svg>
      </div>

      {photo.url && (
        <Image
          src={photo.url}
          alt={photo.alt ?? ""}
          fill
          sizes="150px"
          className="object-cover transition-opacity duration-200"
          style={{ opacity: photoPublic ? 1 : 0.35, pointerEvents: "none" }}
          draggable={false}
        />
      )}

      {/* Hover overlay — bottom buttons */}
      <div
        className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 py-2"
        style={{ background: "rgba(0,0,0,0.65)" }}
      >
        <button
          onClick={() => onToggleVisibility(photo.id, photo.visibility)}
          disabled={toggling}
          className="font-mono text-[8px] tracking-[0.15em] uppercase px-2 py-1 transition-opacity hover:opacity-80 disabled:opacity-30"
          style={{
            border: photoPublic ? "1px solid #4ade80" : "1px solid #888",
            color: photoPublic ? "#4ade80" : "#888",
          }}
        >
          {toggling ? "..." : photoPublic ? "Visible" : "Oculta"}
        </button>

        <button
          onClick={() => onDelete(photo.id)}
          disabled={deleting}
          className="transition-opacity hover:opacity-80 disabled:opacity-30"
        >
          {deleting ? (
            <span className="font-mono text-[8px] text-white/40">...</span>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e05c5c" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export default function AdminAlbumPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [album, setAlbum] = useState<AdminAlbum | null>(null);
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [togglingPhoto, setTogglingPhoto] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const fetchAlbum = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/albums", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const found = (data.albums as AdminAlbum[]).find((a) => a.id === id) ?? null;
      setAlbum(found);
      setPhotos(found?.photos ?? []);
      setDirty(false);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchAlbum(); }, [fetchAlbum]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setPhotos((prev) => {
      const oldIdx = prev.findIndex((p) => p.id === active.id);
      const newIdx = prev.findIndex((p) => p.id === over.id);
      return arrayMove(prev, oldIdx, newIdx);
    });
    setDirty(true);
  }

  async function saveOrder() {
    setSaving(true);
    const res = await fetch(`/api/albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photoOrder: photos.map((p) => p.id) }),
    });
    setSaving(false);
    if (res.ok) {
      showToast.success("Orden guardado", { duration: 3000, sound: true, position: "bottom-right" });
      setDirty(false);
    } else {
      showToast.error("Error al guardar el orden", { duration: 4000, sound: true, position: "bottom-right" });
    }
  }

  async function handleDeletePhoto(photoId: string) {
    if (!confirm("¿Borrar esta foto?")) return;
    setDeleting(photoId);
    await fetch(`/api/photos/${photoId}`, { method: "DELETE" });
    fetchAlbum();
    setDeleting(null);
  }

  async function handleTogglePhoto(photoId: string, current: string | undefined) {
    const next = current === "public" ? "private" : "public";
    setTogglingPhoto(photoId);
    await fetch(`/api/photos/${photoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility: next }),
    });
    fetchAlbum();
    setTogglingPhoto(null);
  }

  async function handleDeleteAlbum() {
    if (!album) return;
    const label = album.name || album.title;
    if (!confirm(`¿Borrar el álbum "${label}"? Esto elimina todas sus fotos.`)) return;
    await fetch(`/api/albums/${id}`, { method: "DELETE" });
    router.push("/admin");
  }

  async function handleToggleVisibility() {
    if (!album) return;
    const next = album.visibility === "public" ? "private" : "public";
    const res = await fetch(`/api/albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility: next }),
    });
    if (res.ok) {
      showToast.success(next === "public" ? "Álbum publicado" : "Álbum ocultado", { duration: 3000, sound: true, position: "bottom-right" });
      fetchAlbum();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-4)" }}>Cargando...</p>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-4)" }}>Álbum no encontrado</p>
      </div>
    );
  }

  const label = album.name || album.title;
  const isPublic = album.visibility === "public";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-10 h-14 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
        <Link href="/admin" className="font-mono text-[10px] tracking-[0.3em] uppercase transition-opacity hover:opacity-60 flex items-center gap-2" style={{ color: "var(--text-3)" }}>
          ← Admin
        </Link>
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase truncate max-w-[200px]" style={{ color: "var(--text-3)" }}>{label}</p>
        <div className="w-16" />
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 flex flex-col gap-8">
        {/* Album actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleToggleVisibility}
            className="font-mono text-[10px] tracking-[0.3em] uppercase px-4 py-2 transition-opacity hover:opacity-70"
            style={{
              border: isPublic ? "1px solid #4ade80" : "1px solid var(--border-2)",
              color: isPublic ? "#4ade80" : "var(--text-4)",
            }}
          >
            {isPublic ? "Visible" : "Oculto"} — {isPublic ? "Ocultar" : "Publicar"}
          </button>
          <button
            onClick={handleDeleteAlbum}
            className="font-mono text-[10px] tracking-[0.3em] uppercase px-4 py-2 transition-opacity hover:opacity-60"
            style={{ border: "1px solid #e05c5c", color: "#e05c5c" }}
          >
            Borrar álbum
          </button>
          <Link
            href="/admin/upload"
            className="font-mono text-[10px] tracking-[0.3em] uppercase px-4 py-2 transition-opacity hover:opacity-70 ml-auto"
            style={{ background: "var(--text)", color: "var(--bg)" }}
          >
            + Nuevo álbum
          </Link>
        </div>

        {/* Photos grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-3)" }}>
              Fotos ({photos.length}) — arrastrá para reordenar
            </p>
            {dirty && (
              <button
                onClick={saveOrder}
                disabled={saving}
                className="font-mono text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 transition-opacity hover:opacity-70 disabled:opacity-40"
                style={{ background: "var(--text)", color: "var(--bg)" }}
              >
                {saving ? "Guardando..." : "Guardar orden"}
              </button>
            )}
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {photos.map((photo) => (
                  <SortablePhoto
                    key={photo.id}
                    photo={photo}
                    onDelete={handleDeletePhoto}
                    onToggleVisibility={handleTogglePhoto}
                    deleting={deleting === photo.id}
                    toggling={togglingPhoto === photo.id}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
