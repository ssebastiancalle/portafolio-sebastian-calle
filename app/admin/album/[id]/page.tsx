"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { showToast } from "nextjs-toast-notify";

// ─── Confirm modal ────────────────────────────────────────────────────────────

function ConfirmModal({ title, message, confirmLabel = "Confirmar", danger = false, onConfirm, onCancel }: {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onPointerDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", padding: "28px 32px", maxWidth: 380, width: "90%", display: "flex", flexDirection: "column", gap: 12 }}>
        <p className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: "var(--text-3)" }}>{title}</p>
        <p className="font-mono text-[11px] leading-relaxed" style={{ color: "var(--text-2)" }}>{message}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
          <button
            onClick={onCancel}
            className="font-mono text-[10px] tracking-[0.25em] uppercase px-5 py-2 transition-opacity hover:opacity-70"
            style={{ border: "1px solid var(--border-2)", color: "var(--text-4)" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="font-mono text-[10px] tracking-[0.25em] uppercase px-5 py-2 transition-opacity hover:opacity-70"
            style={{ background: danger ? "#e05c5c" : "var(--text)", color: danger ? "white" : "var(--bg)", border: "none" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Rich text editor ─────────────────────────────────────────────────────────

function RichTextEditor({ defaultValue, onChange, placeholder }: {
  defaultValue: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.innerHTML = defaultValue;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (cmd: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, undefined);
    if (ref.current) onChange(ref.current.innerHTML);
  };

  return (
    <div style={{ border: "1px solid var(--border)", background: "var(--bg)" }}>
      <div style={{ display: "flex", gap: 0, padding: "3px 6px", borderBottom: "1px solid var(--border)", flexWrap: "wrap", alignItems: "center" }}>
        {[
          { label: "B", cmd: "bold",            style: { fontWeight: "bold" },          title: "Negrita" },
          { label: "I", cmd: "italic",           style: { fontStyle: "italic" },         title: "Cursiva" },
          { label: "U", cmd: "underline",        style: { textDecoration: "underline" }, title: "Subrayado" },
          { label: "S", cmd: "strikeThrough",    style: { textDecoration: "line-through" }, title: "Tachado" },
        ].map(({ label, cmd, style, title }) => (
          <button key={cmd}
            onMouseDown={e => { e.preventDefault(); exec(cmd); }}
            className="font-mono text-[11px] px-2 py-1 transition-opacity hover:opacity-70"
            style={{ color: "var(--text-2)", background: "none", border: "none", cursor: "pointer", ...style }}
            title={title}
          >{label}</button>
        ))}
        <span style={{ width: 1, height: 14, background: "var(--border)", margin: "0 4px", display: "inline-block" }} />
        {[
          { label: "≡", cmd: "justifyLeft",   title: "Alinear izquierda" },
          { label: "≡", cmd: "justifyCenter", title: "Centrar" },
          { label: "≡", cmd: "justifyRight",  title: "Alinear derecha" },
        ].map(({ label, cmd, title }, i) => (
          <button key={cmd}
            onMouseDown={e => { e.preventDefault(); exec(cmd); }}
            className="font-mono text-[13px] px-2 py-1 transition-opacity hover:opacity-70"
            style={{ color: "var(--text-2)", background: "none", border: "none", cursor: "pointer", letterSpacing: i === 1 ? "0.15em" : i === 2 ? "0.3em" : "0" }}
            title={title}
          >{label}</button>
        ))}
        <span style={{ width: 1, height: 14, background: "var(--border)", margin: "0 4px", display: "inline-block" }} />
        <button
          onMouseDown={e => { e.preventDefault(); exec("removeFormat"); }}
          className="font-mono text-[10px] px-2 py-1 transition-opacity hover:opacity-70"
          style={{ color: "var(--text-4)", background: "none", border: "none", cursor: "pointer" }}
          title="Limpiar formato"
        >Tx</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => { if (ref.current) onChange(ref.current.innerHTML); }}
        onKeyDown={e => {
          if (e.key === "Enter") {
            e.preventDefault();
            document.execCommand("insertLineBreak");
          }
        }}
        data-placeholder={placeholder}
        style={{
          minHeight: 130, padding: "8px 10px",
          fontFamily: "monospace", fontSize: 11, lineHeight: 1.7,
          color: "var(--text-2)", outline: "none", whiteSpace: "pre-wrap", wordBreak: "break-word",
        }}
      />
    </div>
  );
}

const CANVAS_W = 1200;
const CANVAS_H = 800;
const MIN_SIZE = 60;
const GRID = 20;
const SNAP_THRESHOLD = 14;
const DEFAULT_PHOTO_W = 280;

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
  description: string | null;
  cover_url: string | null;
  visibility: string;
  photos: AdminPhoto[];
};

type Guide = { axis: "x" | "y"; position: number };
type DragState = { startX: number; startY: number; cx: number; cy: number; cw: number; ch: number };

function snapGrid(v: number) { return Math.round(v / GRID) * GRID; }

function calcMoveSnap(
  id: string, x: number, y: number, w: number, h: number, allPhotos: AdminPhoto[],
): { x: number; y: number; guides: Guide[] } {
  const others = allPhotos.filter(p => p.id !== id && p.canvas_x != null);
  const guides: Guide[] = [];

  const myX = [x, x + w, x + w / 2];
  const otherX = others.flatMap(o => { const ox = o.canvas_x!; const ow = o.canvas_w ?? 200; return [ox, ox + ow, ox + ow / 2]; });
  let bestXDelta = SNAP_THRESHOLD, xShift = 0, xGuide: number | null = null;
  for (const me of myX) for (const ot of otherX) { const d = Math.abs(me - ot); if (d < bestXDelta) { bestXDelta = d; xShift = ot - me; xGuide = ot; } }
  const finalX = xGuide !== null ? x + xShift : snapGrid(x);
  if (xGuide !== null) guides.push({ axis: "x", position: xGuide });

  const myY = [y, y + h, y + h / 2];
  const otherY = others.flatMap(o => { const oy = o.canvas_y!; const oh = o.canvas_h ?? 150; return [oy, oy + oh, oy + oh / 2]; });
  let bestYDelta = SNAP_THRESHOLD, yShift = 0, yGuide: number | null = null;
  for (const me of myY) for (const ot of otherY) { const d = Math.abs(me - ot); if (d < bestYDelta) { bestYDelta = d; yShift = ot - me; yGuide = ot; } }
  const finalY = yGuide !== null ? y + yShift : snapGrid(y);
  if (yGuide !== null) guides.push({ axis: "y", position: yGuide });

  return { x: finalX, y: finalY, guides };
}

// ─── Corner handle ────────────────────────────────────────────────────────────

function CornerHandle({ corner, cx, cy, cw, ch, scale, onUpdate, onDragEnd }: {
  corner: "tl" | "tr" | "bl" | "br";
  cx: number; cy: number; cw: number; ch: number;
  scale: number;
  onUpdate: (patch: Partial<AdminPhoto>) => void;
  onDragEnd: () => void;
}) {
  const ref = useRef<DragState | null>(null);
  const cursor = corner === "tl" || corner === "br" ? "nwse-resize" : "nesw-resize";
  const pos: React.CSSProperties = corner === "tl" ? { top: -6, left: -6 } : corner === "tr" ? { top: -6, right: -6 } : corner === "bl" ? { bottom: -6, left: -6 } : { bottom: -6, right: -6 };

  function onPointerDown(e: React.PointerEvent) {
    e.stopPropagation(); e.preventDefault();
    ref.current = { startX: e.clientX, startY: e.clientY, cx, cy, cw, ch };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const s = ref.current; if (!s) return;
    const dx = (e.clientX - s.startX) / scale;
    const dy = (e.clientY - s.startY) / scale;
    let nx = s.cx, ny = s.cy, nw = s.cw, nh = s.ch;
    if (corner === "br") { nw = Math.max(MIN_SIZE, snapGrid(s.cw + dx)); nh = Math.max(MIN_SIZE, snapGrid(s.ch + dy)); }
    else if (corner === "bl") { const dw = Math.max(-(s.cw - MIN_SIZE), dx); nx = snapGrid(s.cx + dw); nw = s.cw - (nx - s.cx); nh = Math.max(MIN_SIZE, snapGrid(s.ch + dy)); }
    else if (corner === "tr") { nw = Math.max(MIN_SIZE, snapGrid(s.cw + dx)); const dh = Math.max(-(s.ch - MIN_SIZE), dy); ny = snapGrid(s.cy + dh); nh = s.ch - (ny - s.cy); }
    else { const dw = Math.max(-(s.cw - MIN_SIZE), dx); nx = snapGrid(s.cx + dw); nw = s.cw - (nx - s.cx); const dh = Math.max(-(s.ch - MIN_SIZE), dy); ny = snapGrid(s.cy + dh); nh = s.ch - (ny - s.cy); }
    onUpdate({ canvas_x: nx, canvas_y: ny, canvas_w: nw, canvas_h: nh });
  }

  function onPointerUp(e: React.PointerEvent) {
    ref.current = null; e.currentTarget.releasePointerCapture(e.pointerId); onDragEnd();
  }

  return (
    <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      style={{ position: "absolute", ...pos, width: 12, height: 12, borderRadius: "50%", background: "white", border: "2px solid rgba(0,0,0,0.35)", cursor, zIndex: 30, boxShadow: "0 1px 5px rgba(0,0,0,0.5)", touchAction: "none" }} />
  );
}

// ─── Canvas photo card ────────────────────────────────────────────────────────

function PhotoCard({ photo, scale, isLocked, onUpdate, onRemove, onToggleLock, onDragEnd }: {
  photo: AdminPhoto; scale: number; isLocked: boolean;
  onUpdate: (id: string, patch: Partial<AdminPhoto>) => void;
  onRemove: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDragEnd: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const moveRef = useRef<DragState | null>(null);
  const cx = photo.canvas_x!; const cy = photo.canvas_y!;
  const cw = photo.canvas_w ?? 200; const ch = photo.canvas_h ?? 150;

  function onPointerDown(e: React.PointerEvent) {
    if (isLocked) return;
    e.stopPropagation();
    moveRef.current = { startX: e.clientX, startY: e.clientY, cx, cy, cw, ch };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const s = moveRef.current; if (!s) return;
    const dx = (e.clientX - s.startX) / scale;
    const dy = (e.clientY - s.startY) / scale;
    onUpdate(photo.id, {
      canvas_x: Math.max(0, Math.min(CANVAS_W - cw, s.cx + dx)),
      canvas_y: Math.max(0, Math.min(CANVAS_H - ch, s.cy + dy)),
    });
  }

  function onPointerUp(e: React.PointerEvent) {
    moveRef.current = null; e.currentTarget.releasePointerCapture(e.pointerId); onDragEnd();
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
      style={{
        position: "absolute", left: cx, top: cy, width: cw, height: ch,
        cursor: isLocked ? "default" : "move",
        outline: hovered ? `2px solid ${isLocked ? "rgba(251,191,36,0.5)" : "rgba(255,255,255,0.55)"}` : "none",
        outlineOffset: 1, overflow: "visible", touchAction: "none", userSelect: "none",
      }}
    >
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
        {photo.url && <Image src={photo.url} alt={photo.alt ?? ""} fill sizes="500px" className="object-cover" style={{ pointerEvents: "none" }} draggable={false} />}
      </div>

      {/* Lock indicator — always visible when locked */}
      {isLocked && (
        <div style={{ position: "absolute", top: 6, right: 6, zIndex: 25, pointerEvents: "none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(251,191,36,0.9)" stroke="rgba(0,0,0,0.4)" strokeWidth="1">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      )}

      {/* Corner resize handles — only when not locked */}
      {hovered && !isLocked && (["tl", "tr", "bl", "br"] as const).map(corner => (
        <CornerHandle key={corner} corner={corner} cx={cx} cy={cy} cw={cw} ch={ch} scale={scale}
          onUpdate={p => onUpdate(photo.id, p)} onDragEnd={onDragEnd} />
      ))}

      {hovered && (
        <div style={{ position: "absolute", inset: "auto 0 0 0", zIndex: 20, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px", background: "rgba(0,0,0,0.78)", backdropFilter: "blur(4px)" }}
          onPointerDown={e => e.stopPropagation()}>
          <span className="font-mono select-none" style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>{Math.round(cw)}×{Math.round(ch)}</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Lock / unlock */}
            <button onClick={() => onToggleLock(photo.id)} className="transition-opacity hover:opacity-70" title={isLocked ? "Desbloquear" : "Bloquear posición"}>
              {isLocked ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
              )}
            </button>
            {/* Remove from canvas */}
            <button onClick={() => onRemove(photo.id)} className="transition-opacity hover:opacity-70" title="Quitar del canvas">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar thumbnail ────────────────────────────────────────────────────────

function SidebarPhoto({ photo, isCover, onDragStart, onSetCover }: {
  photo: AdminPhoto;
  isCover: boolean;
  onDragStart: (e: React.PointerEvent, id: string) => void;
  onSetCover: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const placed = photo.canvas_x != null;

  return (
    <div
      style={{ position: "relative", width: "100%", flexShrink: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        onPointerDown={placed ? undefined : (e) => onDragStart(e, photo.id)}
        style={{
          position: "relative", width: "100%", aspectRatio: "3/2",
          overflow: "hidden", background: "#111",
          cursor: placed ? "default" : "grab",
          opacity: placed ? 0.35 : 1,
          border: isCover ? "2px solid #fbbf24" : placed ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.15)",
          userSelect: "none", touchAction: "none",
        }}
      >
        {photo.url && <Image src={photo.url} alt={photo.alt ?? ""} fill sizes="180px" className="object-cover" draggable={false} style={{ pointerEvents: "none" }} />}
        {/* Cover badge */}
        {isCover && (
          <div style={{ position: "absolute", top: 4, left: 4, background: "#fbbf24", padding: "1px 5px" }}>
            <span className="font-mono" style={{ fontSize: 7, color: "#000", letterSpacing: "0.15em" }}>PORTADA</span>
          </div>
        )}
        {placed && !isCover && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)" }}>
            <span className="font-mono" style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em" }}>EN CANVAS</span>
          </div>
        )}
      </div>

      {/* Set as cover button — shown on hover */}
      {hovered && !isCover && (
        <button
          onClick={() => onSetCover(photo.id)}
          onPointerDown={e => e.stopPropagation()}
          className="font-mono uppercase transition-opacity hover:opacity-80"
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            fontSize: 7, letterSpacing: "0.15em",
            background: "rgba(251,191,36,0.9)", color: "#000",
            padding: "3px 0", textAlign: "center",
            border: "none", cursor: "pointer",
          }}
        >
          ★ Portada
        </button>
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
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [snapGuides, setSnapGuides] = useState<Guide[]>([]);
  const [lockedPhotos, setLockedPhotos] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<{ title: string; message: string; confirmLabel: string; danger: boolean; onConfirm: () => void } | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [localName, setLocalName] = useState("");
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);
  // Sidebar drag state
  const [ghost, setGhost] = useState<{ url: string; x: number; y: number; w: number; h: number } | null>(null);
  const placingRef = useRef<{ id: string } | null>(null);

  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<AdminPhoto[]>([]);
  photosRef.current = photos;

  useEffect(() => {
    function updateScale() {
      if (canvasRef.current) setScale(canvasRef.current.offsetWidth / CANVAS_W);
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
        setPhotos(found.photos);
        setDirty(false);
        setLocalName(found.name || found.title || "");
        setDescriptionHtml(found.description || "");
      }
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchAlbum(); }, [fetchAlbum]);

  // ── Sidebar drag handlers ──────────────────────────────────────────────────

  function onSidebarDragStart(e: React.PointerEvent, photoId: string) {
    const photo = photosRef.current.find(p => p.id === photoId);
    if (!photo) return;
    const ratio = photo.width && photo.height ? photo.width / photo.height : 3 / 2;
    const gw = 120; const gh = gw / ratio;
    placingRef.current = { id: photoId };
    setGhost({ url: photo.url, x: e.clientX - gw / 2, y: e.clientY - gh / 2, w: gw, h: gh });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function onSidebarDragMove(e: React.PointerEvent) {
    if (!placingRef.current || !ghost) return;
    setGhost(g => g ? { ...g, x: e.clientX - g.w / 2, y: e.clientY - g.h / 2 } : null);
  }

  function onSidebarDragEnd(e: React.PointerEvent) {
    const placing = placingRef.current;
    placingRef.current = null;
    setGhost(null);
    if (!placing || !canvasAreaRef.current) return;

    const rect = canvasAreaRef.current.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) return;

    const cx = (e.clientX - rect.left) / scale;
    const cy = (e.clientY - rect.top) / scale;
    const photo = photosRef.current.find(p => p.id === placing.id);
    const ratio = photo?.width && photo?.height ? photo.width / photo.height : 3 / 2;
    const w = DEFAULT_PHOTO_W; const h = w / ratio;

    handleUpdate(placing.id, {
      canvas_x: snapGrid(Math.max(0, Math.min(CANVAS_W - w, cx - w / 2))),
      canvas_y: snapGrid(Math.max(0, Math.min(CANVAS_H - h, cy - h / 2))),
      canvas_w: w,
      canvas_h: Math.round(h),
    });
  }

  // ── Canvas update + snap ──────────────────────────────────────────────────

  function handleUpdate(photoId: string, patch: Partial<AdminPhoto>) {
    const photo = photosRef.current.find(p => p.id === photoId);
    if (!photo) return;

    let finalPatch = { ...patch };

    if (snapEnabled && patch.canvas_x !== null && patch.canvas_x !== undefined) {
      const isResize = patch.canvas_w !== undefined || patch.canvas_h !== undefined;
      if (!isResize) {
        const x = patch.canvas_x ?? photo.canvas_x ?? 0;
        const y = patch.canvas_y ?? photo.canvas_y ?? 0;
        const w = photo.canvas_w ?? DEFAULT_PHOTO_W;
        const h = photo.canvas_h ?? 150;
        const { x: sx, y: sy, guides } = calcMoveSnap(photoId, x, y, w, h, photosRef.current);
        setSnapGuides(guides);
        finalPatch = { ...finalPatch, canvas_x: sx, canvas_y: sy };
      }
    }

    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, ...finalPatch } : p));
    setDirty(true);
  }

  function removeFromCanvas(photoId: string) {
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, canvas_x: null, canvas_y: null, canvas_w: null, canvas_h: null } : p));
    setDirty(true);
  }

  function toggleVisibility(photoId: string) {
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, visibility: p.visibility === "public" ? "private" : "public" } : p));
    setDirty(true);
  }

  async function saveInfo() {
    if (!album) return;
    setSavingInfo(true);
    const res = await fetch(`/api/albums/${album.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: localName, description: descriptionHtml }),
    });
    setSavingInfo(false);
    if (res.ok) {
      setAlbum(prev => prev ? { ...prev, name: localName, description: descriptionHtml } : prev);
      showToast.success("Info guardada", { duration: 3000, sound: true, position: "bottom-right" });
    } else {
      showToast.error("Error al guardar info", { duration: 4000, sound: true, position: "bottom-right" });
    }
  }

  async function setCover(photoId: string) {
    const photo = photos.find(p => p.id === photoId);
    if (!photo?.url) return;
    const res = await fetch(`/api/albums/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cover_url: photo.url }),
    });
    if (res.ok) {
      setAlbum(prev => prev ? { ...prev, cover_url: photo.url } : prev);
      showToast.success("Portada actualizada", { duration: 3000, sound: true, position: "bottom-right" });
    } else {
      showToast.error("Error al actualizar portada", { duration: 4000, sound: true, position: "bottom-right" });
    }
  }

  async function doSaveChanges() {
    setSaving(true);
    const res = await fetch(`/api/albums/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        photoPositions: photos.map(p => ({
          id: p.id,
          canvas_x: p.canvas_x ?? null,
          canvas_y: p.canvas_y ?? null,
          canvas_w: p.canvas_w ?? null,
          canvas_h: p.canvas_h ?? null,
          visibility: p.visibility ?? "public",
        })),
      }),
    });
    setSaving(false);
    if (res.ok) { showToast.success("Layout guardado", { duration: 3000, sound: true, position: "bottom-right" }); setDirty(false); }
    else showToast.error("Error al guardar", { duration: 4000, sound: true, position: "bottom-right" });
  }

  function saveChanges() {
    setModal({ title: "Guardar layout", message: "¿Guardás el layout actual? Se va a sobreescribir el diseño publicado.", confirmLabel: "Guardar", danger: false, onConfirm: () => { setModal(null); doSaveChanges(); } });
  }

  async function handleToggleAlbumVisibility() {
    if (!album) return;
    const next = album.visibility === "public" ? "private" : "public";
    await fetch(`/api/albums/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visibility: next }) });
    showToast.success(next === "public" ? "Álbum publicado" : "Álbum ocultado", { duration: 3000, sound: true, position: "bottom-right" });
    fetchAlbum();
  }

  function handleDeleteAlbum() {
    if (!album) return;
    setModal({
      title: "Borrar álbum",
      message: `¿Borrar el álbum "${album.name || album.title}"? Esta acción no se puede deshacer.`,
      confirmLabel: "Borrar",
      danger: true,
      onConfirm: async () => {
        setModal(null);
        await fetch(`/api/albums/${id}`, { method: "DELETE" });
        showToast.success("Álbum borrado", { duration: 3000, sound: true, position: "bottom-right" });
        router.push("/admin");
      },
    });
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
  const placedPhotos = photos.filter(p => p.canvas_x != null);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {modal && (
        <ConfirmModal
          title={modal.title}
          message={modal.message}
          confirmLabel={modal.confirmLabel}
          danger={modal.danger}
          onConfirm={modal.onConfirm}
          onCancel={() => setModal(null)}
        />
      )}
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-10 h-14 border-b flex-shrink-0" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
        <Link href="/admin" className="font-mono text-[10px] tracking-[0.3em] uppercase transition-opacity hover:opacity-60" style={{ color: "var(--text-3)" }}>← Admin</Link>
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase truncate max-w-[200px]" style={{ color: "var(--text-3)" }}>{label}</p>
        <div className="w-16" />
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-3 flex-wrap px-6 md:px-10 py-3 border-b flex-shrink-0" style={{ borderColor: "var(--border)" }}>
        <button onClick={handleToggleAlbumVisibility} className="font-mono text-[10px] tracking-[0.3em] uppercase px-4 py-2 transition-opacity hover:opacity-70"
          style={{ border: isPublic ? "1px solid #4ade80" : "1px solid var(--border-2)", color: isPublic ? "#4ade80" : "var(--text-4)" }}>
          {isPublic ? "Visible — Ocultar" : "Oculto — Publicar"}
        </button>
        <button onClick={handleDeleteAlbum} className="font-mono text-[10px] tracking-[0.3em] uppercase px-4 py-2 transition-opacity hover:opacity-60"
          style={{ border: "1px solid #e05c5c", color: "#e05c5c" }}>
          Borrar álbum
        </button>
        <button onClick={() => setSnapEnabled(v => !v)} className="font-mono text-[10px] tracking-[0.3em] uppercase px-4 py-2 transition-opacity hover:opacity-70"
          style={{ border: snapEnabled ? "1px solid #60a5fa" : "1px solid var(--border-2)", color: snapEnabled ? "#60a5fa" : "var(--text-4)" }}>
          {snapEnabled ? "⊡ snap on" : "⊡ snap off"}
        </button>
        <button onClick={() => setShowInfo(v => !v)} className="font-mono text-[10px] tracking-[0.3em] uppercase px-4 py-2 transition-opacity hover:opacity-70"
          style={{ border: showInfo ? "1px solid var(--text-3)" : "1px solid var(--border-2)", color: showInfo ? "var(--text-2)" : "var(--text-4)" }}>
          ✎ info
        </button>
        {dirty && (
          <button onClick={saveChanges} disabled={saving} className="font-mono text-[10px] tracking-[0.3em] uppercase px-6 py-2 transition-opacity hover:opacity-70 disabled:opacity-40 ml-auto"
            style={{ background: "var(--text)", color: "var(--bg)" }}>
            {saving ? "Guardando..." : "Guardar layout"}
          </button>
        )}
      </div>

      {/* Info panel */}
      {showInfo && (
        <div style={{ borderBottom: "1px solid var(--border)", padding: "16px 24px", background: "var(--bg-surface)", flexShrink: 0 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
            <div style={{ width: 220, flexShrink: 0 }}>
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--text-4)" }}>Nombre del álbum</p>
              <input
                value={localName}
                onChange={e => setLocalName(e.target.value)}
                className="font-mono text-[11px] w-full"
                style={{ background: "var(--bg)", border: "1px solid var(--border)", padding: "6px 10px", color: "var(--text-2)", outline: "none" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--text-4)" }}>Pie de foto (soporta <strong>negrita</strong>, <em>cursiva</em> y @handles)</p>
              <RichTextEditor
                defaultValue={descriptionHtml}
                onChange={setDescriptionHtml}
                placeholder="SILHOUETTE – COVER FEATURE&#10;SELIN MAGAZINE | Issue 65..."
              />
            </div>
            <div style={{ paddingTop: 18, flexShrink: 0 }}>
              <button
                onClick={saveInfo}
                disabled={savingInfo}
                className="font-mono text-[10px] tracking-[0.25em] uppercase px-5 py-2 transition-opacity hover:opacity-70 disabled:opacity-40"
                style={{ background: "var(--text)", color: "var(--bg)", border: "none", cursor: "pointer" }}
              >
                {savingInfo ? "..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main area: canvas + sidebar */}
      <div className="flex flex-1 overflow-hidden">

        {/* Canvas area */}
        <div ref={canvasAreaRef} className="flex-1 overflow-auto p-6">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--text-4)" }}>
            Arrastrá fotos desde la lista · mover · esquinas para redimensionar · ← quitar del canvas
          </p>
          <div style={{ position: "relative" }}>
            <div ref={canvasRef} style={{ width: "100%" }} />
            <div
              style={{
                width: CANVAS_W, height: CANVAS_H,
                transformOrigin: "top left", transform: `scale(${scale})`,
                position: "absolute", top: 0, left: 0,
                background: "#0a0a0a",
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: `${GRID * 2}px ${GRID * 2}px`,
                overflow: "hidden",
              }}
            >
              {/* Snap guides */}
              {snapGuides.map((g, i) => (
                <div key={i} style={{ position: "absolute", background: "#60a5fa", opacity: 0.8, pointerEvents: "none", zIndex: 50, ...(g.axis === "x" ? { left: g.position, top: 0, width: 1, height: CANVAS_H } : { top: g.position, left: 0, height: 1, width: CANVAS_W }) }} />
              ))}

              {/* Empty state hint */}
              {placedPhotos.length === 0 && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                  <p className="font-mono text-[11px] tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.12)" }}>Arrastrá fotos desde la lista →</p>
                </div>
              )}

              {placedPhotos.map(photo => (
                <PhotoCard key={photo.id} photo={photo} scale={scale}
                  isLocked={lockedPhotos.has(photo.id)}
                  onUpdate={handleUpdate} onRemove={removeFromCanvas}
                  onToggleLock={(pid) => setLockedPhotos(prev => {
                    const next = new Set(prev);
                    next.has(pid) ? next.delete(pid) : next.add(pid);
                    return next;
                  })}
                  onDragEnd={() => setSnapGuides([])} />
              ))}
            </div>
            <div style={{ height: CANVAS_H * scale }} />
          </div>
        </div>

        {/* Sidebar */}
        <div
          className="overflow-y-auto flex-shrink-0 border-l"
          style={{ width: 176, borderColor: "var(--border)", background: "var(--bg-surface)" }}
          onPointerMove={onSidebarDragMove}
          onPointerUp={onSidebarDragEnd}
        >
          <p className="font-mono text-[8px] tracking-[0.3em] uppercase px-3 py-3 border-b" style={{ color: "var(--text-4)", borderColor: "var(--border)" }}>
            Fotos ({photos.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "8px 10px" }}>
            {photos.map(photo => (
              <SidebarPhoto key={photo.id} photo={photo} isCover={album?.cover_url === photo.url} onDragStart={onSidebarDragStart} onSetCover={setCover} />
            ))}
          </div>
        </div>
      </div>

      {/* Drag ghost */}
      {ghost && (
        <div
          style={{
            position: "fixed", left: ghost.x, top: ghost.y, width: ghost.w, height: ghost.h,
            pointerEvents: "none", zIndex: 9999, opacity: 0.82,
            transform: "rotate(1.5deg) scale(1.05)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ghost.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
    </div>
  );
}
