"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { showToast } from "nextjs-toast-notify";

const CANVAS_W = 1200;
const CANVAS_H = 800;
const MIN_SIZE = 60;

type AdminPhoto = {
  id: string;
  url: string;
  alt: string | null;
  visibility?: string;
  width?: number;
  height?: number;
  canvas_x?: number | null;
  canvas_y?: number | null;
  canvas_w?: number | null;
  canvas_h?: number | null;
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

function autoLayout(photos: AdminPhoto[]): AdminPhoto[] {
  const n = photos.length;
  if (n === 0) return photos;
  const cols = Math.ceil(Math.sqrt(n * 1.6));
  const rows = Math.ceil(n / cols);
  const cellW = CANVAS_W / cols;
  const cellH = CANVAS_H / rows;
  const GAP = 10;

  return photos.map((p, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const ratio = p.width && p.height ? p.width / p.height : 3 / 2;
    let w = cellW - GAP;
    let h = w / ratio;
    if (h > cellH - GAP) {
      h = cellH - GAP;
      w = h * ratio;
    }
    return {
      ...p,
      canvas_x: col * cellW + (cellW - w) / 2,
      canvas_y: row * cellH + (cellH - h) / 2,
      canvas_w: w,
      canvas_h: h,
    };
  });
}

type DragState = { startX: number; startY: number; cx: number; cy: number; cw: number; ch: number };

// ─── Corner resize handle (fully self-contained) ─────────────────────────────
function CornerHandle({
  corner, cx, cy, cw, ch, scale, onUpdate,
}: {
  corner: "tl" | "tr" | "bl" | "br";
  cx: number; cy: number; cw: number; ch: number;
  scale: number;
  onUpdate: (patch: Partial<AdminPhoto>) => void;
}) {
  const ref = useRef<DragState | null>(null);

  const cursor =
    corner === "tl" || corner === "br" ? "nwse-resize" : "nesw-resize";

  const pos: React.CSSProperties =
    corner === "tl" ? { top: -6, left: -6 }
    : corner === "tr" ? { top: -6, right: -6 }
    : corner === "bl" ? { bottom: -6, left: -6 }
    : { bottom: -6, right: -6 };

  function onPointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    e.preventDefault();
    ref.current = { startX: e.clientX, startY: e.clientY, cx, cy, cw, ch };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const s = ref.current;
    if (!s) return;
    const dx = (e.clientX - s.startX) / scale;
    const dy = (e.clientY - s.startY) / scale;

    let nx = s.cx, ny = s.cy, nw = s.cw, nh = s.ch;

    if (corner === "br") {
      nw = Math.max(MIN_SIZE, s.cw + dx);
      nh = Math.max(MIN_SIZE, s.ch + dy);
    } else if (corner === "bl") {
      const dw = Math.max(-(s.cw - MIN_SIZE), dx);
      nx = s.cx + dw; nw = s.cw - dw;
      nh = Math.max(MIN_SIZE, s.ch + dy);
    } else if (corner === "tr") {
      nw = Math.max(MIN_SIZE, s.cw + dx);
      const dh = Math.max(-(s.ch - MIN_SIZE), dy);
      ny = s.cy + dh; nh = s.ch - dh;
    } else {
      const dw = Math.max(-(s.cw - MIN_SIZE), dx);
      nx = s.cx + dw; nw = s.cw - dw;
      const dh = Math.max(-(s.ch - MIN_SIZE), dy);
      ny = s.cy + dh; nh = s.ch - dh;
    }

    onUpdate({ canvas_x: nx, canvas_y: ny, canvas_w: nw, canvas_h: nh });
  }

  function onPointerUp(e: React.PointerEvent) {
    ref.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
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
        border: "2px solid rgba(0,0,0,0.35)",
        cursor,
        zIndex: 30,
        boxShadow: "0 1px 5px rgba(0,0,0,0.5)",
        touchAction: "none",
      }}
    />
  );
}

// ─── Photo card on canvas ─────────────────────────────────────────────────────
function PhotoCard({
  photo, scale, onUpdate, onDelete, onToggleVisibility,
}: {
  photo: AdminPhoto;
  scale: number;
  onUpdate: (id: string, patch: Partial<AdminPhoto>) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const moveRef = useRef<DragState | null>(null);

  const cx = photo.canvas_x ?? 0;
  const cy = photo.canvas_y ?? 0;
  const cw = photo.canvas_w ?? 200;
  const ch = photo.canvas_h ?? 150;
  const isPublic = photo.visibility !== "private";

  function onPointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    moveRef.current = { startX: e.clientX, startY: e.clientY, cx, cy, cw, ch };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const s = moveRef.current;
    if (!s) return;
    const dx = (e.clientX - s.startX) / scale;
    const dy = (e.clientY - s.startY) / scale;
    onUpdate(photo.id, {
      canvas_x: Math.max(0, Math.min(CANVAS_W - cw, s.cx + dx)),
      canvas_y: Math.max(0, Math.min(CANVAS_H - ch, s.cy + dy)),
    });
  }

  function onPointerUp(e: React.PointerEvent) {
    moveRef.current = null;
    e.currentTarget.releasePointerCapture(e.pointerId);
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: "absolute",
        left: cx, top: cy, width: cw, height: ch,
        cursor: "move",
        outline: hovered ? "2px solid rgba(255,255,255,0.55)" : "none",
        outlineOffset: 1,
        opacity: isPublic ? 1 : 0.4,
        overflow: "visible",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      {/* Image clipped to its own box */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {photo.url && (
          <Image
            src={photo.url}
            alt={photo.alt ?? ""}
            fill
            sizes="600px"
            className="object-cover"
            style={{ pointerEvents: "none" }}
            draggable={false}
          />
        )}
      </div>

      {/* Corner handles */}
      {hovered && (
        <>
          {(["tl", "tr", "bl", "br"] as const).map((corner) => (
            <CornerHandle
              key={corner}
              corner={corner}
              cx={cx} cy={cy} cw={cw} ch={ch}
              scale={scale}
              onUpdate={(p) => onUpdate(photo.id, p)}
            />
          ))}
        </>
      )}

      {/* Bottom bar */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            inset: "auto 0 0 0",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 8px",
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
          }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <span
            className="font-mono select-none"
            style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}
          >
            {Math.round(cw)}×{Math.round(ch)}
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => onToggleVisibility(photo.id)}
              className="font-mono uppercase transition-opacity hover:opacity-70"
              style={{
                fontSize: 8, letterSpacing: "0.1em",
                border: isPublic ? "1px solid #4ade80" : "1px solid #555",
                color: isPublic ? "#4ade80" : "#555",
                padding: "1px 5px",
              }}
            >
              {isPublic ? "✓" : "○"}
            </button>
            <button onClick={() => onDelete(photo.id)} className="transition-opacity hover:opacity-70">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#e05c5c" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminAlbumPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [album, setAlbum] = useState<AdminAlbum | null>(null);
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [scale, setScale] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateScale() {
      if (canvasRef.current) {
        setScale(canvasRef.current.offsetWidth / CANVAS_W);
      }
    }
    if (!loading) {
      updateScale();
      const ro = new ResizeObserver(updateScale);
      if (canvasRef.current) ro.observe(canvasRef.current);
      return () => ro.disconnect();
    }
  }, [loading]);

  const fetchAlbum = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/albums", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const found = (data.albums as AdminAlbum[]).find((a) => a.id === id) ?? null;
      setAlbum(found);
      if (found) {
        const needsLayout = found.photos.some((p) => p.canvas_x == null);
        setPhotos(needsLayout ? autoLayout(found.photos) : found.photos);
        setDirty(needsLayout);
      }
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchAlbum(); }, [fetchAlbum]);

  function handleUpdate(photoId: string, patch: Partial<AdminPhoto>) {
    setPhotos((prev) => prev.map((p) => p.id === photoId ? { ...p, ...patch } : p));
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
        photoPositions: photos.map((p) => ({
          id: p.id,
          canvas_x: p.canvas_x ?? 0,
          canvas_y: p.canvas_y ?? 0,
          canvas_w: p.canvas_w ?? 200,
          canvas_h: p.canvas_h ?? 150,
          visibility: p.visibility ?? "public",
        })),
      }),
    });
    setSaving(false);
    if (res.ok) {
      showToast.success("Layout guardado", { duration: 3000, sound: true, position: "bottom-right" });
      setDirty(false);
    } else {
      showToast.error("Error al guardar", { duration: 4000, sound: true, position: "bottom-right" });
    }
  }

  async function handleToggleAlbumVisibility() {
    if (!album) return;
    const next = album.visibility === "public" ? "private" : "public";
    await fetch(`/api/albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility: next }),
    });
    showToast.success(next === "public" ? "Álbum publicado" : "Álbum ocultado", { duration: 3000, sound: true, position: "bottom-right" });
    fetchAlbum();
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
            {saving ? "Guardando..." : "Guardar layout"}
          </button>
        )}
      </div>

      {/* Canvas editor */}
      <div className="px-6 md:px-10 py-6">
        <p
          className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3"
          style={{ color: "var(--text-4)" }}
        >
          Arrastrá para mover · esquinas para redimensionar
        </p>

        {/* Outer wrapper — gives the container the right height after scale */}
        <div style={{ position: "relative" }}>
          <div ref={canvasRef} style={{ width: "100%" }} />
          <div
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              transformOrigin: "top left",
              transform: `scale(${scale})`,
              position: "absolute",
              top: 0,
              left: 0,
              background: "#0a0a0a",
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              overflow: "visible",
            }}
          >
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                scale={scale}
                onUpdate={handleUpdate}
                onDelete={deletePhoto}
                onToggleVisibility={toggleVisibility}
              />
            ))}
          </div>
          {/* Height spacer */}
          <div style={{ height: CANVAS_H * scale }} />
        </div>
      </div>
    </div>
  );
}
