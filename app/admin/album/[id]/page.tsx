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
  horizontalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { showToast } from "nextjs-toast-notify";

const ROW_HEIGHT = 260;
const GAP = 4;
const SCALE_STEPS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3];

type AdminPhoto = {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  visibility?: string;
  width?: number;
  height?: number;
  scale?: number;
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
  onScaleUp,
  onScaleDown,
  onDelete,
  onToggleVisibility,
}: {
  photo: AdminPhoto;
  onScaleUp: () => void;
  onScaleDown: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: photo.id });

  const ratio = photo.width && photo.height ? photo.width / photo.height : 3 / 2;
  const scale = photo.scale ?? 1;
  const photoPublic = photo.visibility !== "private";

  const scaleIdx = SCALE_STEPS.indexOf(scale);
  const canScaleUp = scaleIdx < SCALE_STEPS.length - 1;
  const canScaleDown = scaleIdx > 0;

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: `${ratio * scale} 1 ${ROW_HEIGHT * ratio * scale}px`,
        height: ROW_HEIGHT,
        minWidth: 100,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : photoPublic ? 1 : 0.4,
        position: "relative",
        flexShrink: 0,
        overflow: "hidden",
        background: "var(--bg-surface)",
      }}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-x-0 top-0 z-20 flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ height: 24, background: "rgba(0,0,0,0.6)" }}
        title="Arrastrá para mover"
      >
        <svg width="20" height="6" viewBox="0 0 20 6" fill="none">
          <rect width="20" height="2" rx="1" fill="rgba(255,255,255,0.6)" />
          <rect y="4" width="20" height="2" rx="1" fill="rgba(255,255,255,0.6)" />
        </svg>
      </div>

      {photo.url && (
        <Image
          src={photo.url}
          alt={photo.alt ?? ""}
          fill
          sizes="300px"
          className="object-cover"
          style={{ pointerEvents: "none" }}
          draggable={false}
        />
      )}

      {/* Bottom controls */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-1.5 py-1"
        style={{ background: "rgba(0,0,0,0.65)" }}
      >
        {/* Scale controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onScaleDown}
            disabled={!canScaleDown}
            className="w-5 h-5 flex items-center justify-center font-mono text-xs transition-opacity hover:opacity-80 disabled:opacity-20"
            style={{ color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
            title="Achicar"
          >
            −
          </button>
          <span className="font-mono text-[9px] text-white/50 w-6 text-center">
            {scale}x
          </span>
          <button
            onClick={onScaleUp}
            disabled={!canScaleUp}
            className="w-5 h-5 flex items-center justify-center font-mono text-xs transition-opacity hover:opacity-80 disabled:opacity-20"
            style={{ color: "white", border: "1px solid rgba(255,255,255,0.3)" }}
            title="Agrandar"
          >
            +
          </button>
        </div>

        {/* Visibility + delete */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleVisibility}
            className="font-mono text-[8px] tracking-wide uppercase px-1.5 py-0.5"
            style={{
              border: photoPublic ? "1px solid #4ade80" : "1px solid #555",
              color: photoPublic ? "#4ade80" : "#555",
            }}
          >
            {photoPublic ? "✓" : "○"}
          </button>
          <button onClick={onDelete}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e05c5c" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
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

  function adjustScale(photoId: string, direction: 1 | -1) {
    setPhotos((prev) => prev.map((p) => {
      if (p.id !== photoId) return p;
      const current = p.scale ?? 1;
      const idx = SCALE_STEPS.indexOf(current);
      const next = SCALE_STEPS[idx + direction];
      return next !== undefined ? { ...p, scale: next } : p;
    }));
    setDirty(true);
  }

  function toggleVisibility(photoId: string) {
    setPhotos((prev) => prev.map((p) => {
      if (p.id !== photoId) return p;
      return { ...p, visibility: p.visibility === "public" ? "private" : "public" };
    }));
    setDirty(true);
  }

  async function deletePhoto(photoId: string) {
    if (!confirm("¿Borrar esta foto?")) return;
    await fetch(`/api/photos/${photoId}`, { method: "DELETE" });
    fetchAlbum();
  }

  async function saveChanges() {
    setSaving(true);
    const res = await fetch(`/api/albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        photoOrder: photos.map((p) => p.id),
        photoScales: photos.map((p) => ({ id: p.id, scale: p.scale ?? 1, visibility: p.visibility ?? "public" })),
      }),
    });
    setSaving(false);
    if (res.ok) {
      showToast.success("Cambios guardados", { duration: 3000, sound: true, position: "bottom-right" });
      setDirty(false);
    } else {
      showToast.error("Error al guardar", { duration: 4000, sound: true, position: "bottom-right" });
    }
  }

  async function handleToggleAlbumVisibility() {
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

  async function handleDeleteAlbum() {
    if (!album) return;
    const label = album.name || album.title;
    if (!confirm(`¿Borrar el álbum "${label}"?`)) return;
    await fetch(`/api/albums/${id}`, { method: "DELETE" });
    router.push("/admin");
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
      <div className="flex items-center justify-between px-6 md:px-10 h-14 border-b flex-shrink-0" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
        <Link href="/admin" className="font-mono text-[10px] tracking-[0.3em] uppercase transition-opacity hover:opacity-60" style={{ color: "var(--text-3)" }}>
          ← Admin
        </Link>
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase truncate max-w-[200px]" style={{ color: "var(--text-3)" }}>{label}</p>
        <div className="w-16" />
      </div>

      {/* Album actions */}
      <div className="flex items-center gap-3 flex-wrap px-6 md:px-10 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={handleToggleAlbumVisibility}
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

        {dirty && (
          <button
            onClick={saveChanges}
            disabled={saving}
            className="font-mono text-[10px] tracking-[0.3em] uppercase px-6 py-2 transition-opacity hover:opacity-70 disabled:opacity-40 ml-auto"
            style={{ background: "var(--text)", color: "var(--bg)" }}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        )}
      </div>

      {/* WYSIWYG gallery editor */}
      <div className="px-6 md:px-10 py-6">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "var(--text-4)" }}>
          Arrastrá para reordenar · + / − para cambiar el tamaño
        </p>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={photos.map((p) => p.id)} strategy={horizontalListSortingStrategy}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: GAP }}>
              {photos.map((photo) => (
                <SortablePhoto
                  key={photo.id}
                  photo={photo}
                  onScaleUp={() => adjustScale(photo.id, 1)}
                  onScaleDown={() => adjustScale(photo.id, -1)}
                  onDelete={() => deletePhoto(photo.id)}
                  onToggleVisibility={() => toggleVisibility(photo.id)}
                />
              ))}
              <div style={{ flex: "9999 1 0px", height: ROW_HEIGHT, maxHeight: ROW_HEIGHT }} />
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
