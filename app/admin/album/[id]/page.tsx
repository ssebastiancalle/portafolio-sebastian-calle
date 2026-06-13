"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
const MIN_SCALE = 0.25;
const MAX_SCALE = 4;

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

function ResizeHandle({
  corner,
  scale,
  onScaleChange,
}: {
  corner: "tl" | "tr" | "bl" | "br";
  scale: number;
  onScaleChange: (s: number) => void;
}) {
  const startRef = useRef<{ x: number; scale: number } | null>(null);

  const pos: React.CSSProperties =
    corner === "tl" ? { top: 6, left: 6 }
    : corner === "tr" ? { top: 6, right: 6 }
    : corner === "bl" ? { bottom: 6, left: 6 }
    : { bottom: 6, right: 6 };

  const dir = corner === "br" || corner === "tr" ? 1 : -1;

  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    startRef.current = { x: e.clientX, scale };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!startRef.current) return;
    const dx = e.clientX - startRef.current.x;
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, startRef.current.scale + (dx * dir) / 300));
    onScaleChange(Math.round(next * 4) / 4);
  }

  function onPointerUp() {
    startRef.current = null;
  }

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "absolute",
        ...pos,
        width: 12,
        height: 12,
        borderRadius: "50%",
        background: "white",
        border: "2px solid rgba(0,0,0,0.4)",
        cursor: "ew-resize",
        zIndex: 40,
        boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
        touchAction: "none",
      }}
    />
  );
}

function SortablePhoto({
  photo,
  onScaleChange,
  onDelete,
  onToggleVisibility,
}: {
  photo: AdminPhoto;
  onScaleChange: (id: string, scale: number) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: photo.id });

  const [hovered, setHovered] = useState(false);

  const ratio = photo.width && photo.height ? photo.width / photo.height : 3 / 2;
  const scale = photo.scale ?? 1;
  const photoPublic = photo.visibility !== "private";

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: `${ratio * scale} 1 ${ROW_HEIGHT * ratio * scale}px`,
        height: ROW_HEIGHT,
        minWidth: 80,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.35 : photoPublic ? 1 : 0.45,
        position: "relative",
        overflow: "hidden",
        background: "#111",
        outline: hovered && !isDragging ? "2px solid rgba(255,255,255,0.3)" : "none",
        cursor: isDragging ? "grabbing" : "grab",
        flexShrink: 0,
        touchAction: "none",
      }}
    >
      {photo.url && (
        <Image
          src={photo.url}
          alt={photo.alt ?? ""}
          fill
          sizes="400px"
          className="object-cover"
          style={{ pointerEvents: "none" }}
          draggable={false}
        />
      )}

      {/* Resize corner handles — shown on hover */}
      {hovered && !isDragging && (
        <>
          <ResizeHandle corner="tl" scale={scale} onScaleChange={(s) => onScaleChange(photo.id, s)} />
          <ResizeHandle corner="tr" scale={scale} onScaleChange={(s) => onScaleChange(photo.id, s)} />
          <ResizeHandle corner="bl" scale={scale} onScaleChange={(s) => onScaleChange(photo.id, s)} />
          <ResizeHandle corner="br" scale={scale} onScaleChange={(s) => onScaleChange(photo.id, s)} />
        </>
      )}

      {/* Bottom action bar */}
      {hovered && !isDragging && (
        <div
          style={{
            position: "absolute",
            inset: "auto 0 0 0",
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "5px 10px",
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span className="font-mono text-[9px] select-none" style={{ color: "rgba(255,255,255,0.35)" }}>
            {scale}×
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onToggleVisibility(photo.id); }}
              className="font-mono text-[8px] tracking-wide uppercase px-1.5 py-0.5 transition-opacity hover:opacity-70"
              style={{
                border: photoPublic ? "1px solid #4ade80" : "1px solid #555",
                color: photoPublic ? "#4ade80" : "#555",
              }}
            >
              {photoPublic ? "✓ visible" : "○ oculta"}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(photo.id); }}
              className="transition-opacity hover:opacity-70"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e05c5c" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
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

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

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

  function handleScaleChange(photoId: string, scale: number) {
    setPhotos((prev) => prev.map((p) => p.id === photoId ? { ...p, scale } : p));
    setDirty(true);
  }

  function toggleVisibility(photoId: string) {
    setPhotos((prev) => prev.map((p) =>
      p.id === photoId ? { ...p, visibility: p.visibility === "public" ? "private" : "public" } : p
    ));
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
    if (!confirm(`¿Borrar el álbum "${album.name || album.title}"?`)) return;
    await fetch(`/api/albums/${id}`, { method: "DELETE" });
    router.push("/admin");
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-4)" }}>Cargando...</p>
    </div>
  );

  if (!album) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-4)" }}>Álbum no encontrado</p>
    </div>
  );

  const label = album.name || album.title;
  const isPublic = album.visibility === "public";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 md:px-10 h-14 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
      >
        <Link
          href="/admin"
          className="font-mono text-[10px] tracking-[0.3em] uppercase transition-opacity hover:opacity-60"
          style={{ color: "var(--text-3)" }}
        >
          ← Admin
        </Link>
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase truncate max-w-[200px]" style={{ color: "var(--text-3)" }}>
          {label}
        </p>
        <div className="w-16" />
      </div>

      {/* Album actions */}
      <div
        className="flex items-center gap-3 flex-wrap px-6 md:px-10 py-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <button
          onClick={handleToggleAlbumVisibility}
          className="font-mono text-[10px] tracking-[0.3em] uppercase px-4 py-2 transition-opacity hover:opacity-70"
          style={{
            border: isPublic ? "1px solid #4ade80" : "1px solid var(--border-2)",
            color: isPublic ? "#4ade80" : "var(--text-4)",
          }}
        >
          {isPublic ? "Visible — Ocultar" : "Oculto — Publicar"}
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

      {/* Gallery editor */}
      <div className="px-6 md:px-10 py-6">
        <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "var(--text-4)" }}>
          Arrastrá para reordenar · hover + esquinas para redimensionar
        </p>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={photos.map((p) => p.id)} strategy={horizontalListSortingStrategy}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: GAP }}>
              {photos.map((photo) => (
                <SortablePhoto
                  key={photo.id}
                  photo={photo}
                  onScaleChange={handleScaleChange}
                  onDelete={deletePhoto}
                  onToggleVisibility={toggleVisibility}
                />
              ))}
              {/* Flex spacer to fill last row */}
              <div style={{ flex: "9999 1 0px", height: ROW_HEIGHT, maxHeight: ROW_HEIGHT }} />
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
