"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";
import { showToast } from "nextjs-toast-notify";

type AdminAlbum = {
  id: string;
  name: string | null;
  title: string;
  slug: string;
  cover_url: string | null;
  visibility: string;
  created_at: string;
  photos: { id: string }[];
};

export default function AdminPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [albums, setAlbums] = useState<AdminAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/albums", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setAlbums(data.albums ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAlbums(); }, [fetchAlbums]);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch(`/api/albums/${deleteTarget.id}`, { method: "DELETE" });
    const name = deleteTarget.name;
    setDeleteTarget(null);
    setDeleting(false);
    if (res.ok) {
      showToast.success(`Álbum "${name}" eliminado`, { duration: 4000, sound: true, position: "bottom-right" });
      fetchAlbums();
    } else {
      showToast.error("No se pudo eliminar el álbum", { duration: 5000, sound: true, position: "bottom-right" });
    }
  }

  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggingId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== draggingId) setDragOverId(id);
  }

  function handleDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;
    const from = albums.findIndex(a => a.id === draggingId);
    const to   = albums.findIndex(a => a.id === targetId);
    if (from === -1 || to === -1) return;
    const next = [...albums];
    next.splice(to, 0, next.splice(from, 1)[0]);
    setAlbums(next);
    setDraggingId(null);
    setDragOverId(null);
    saveOrder(next);
  }

  async function saveOrder(ordered: AdminAlbum[]) {
    setSavingOrder(true);
    const res = await fetch("/api/albums", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ albumOrder: ordered.map(a => a.id) }),
    });
    setSavingOrder(false);
    if (res.ok) {
      showToast.success("Orden guardado", { duration: 2000, sound: true, position: "bottom-right" });
    } else {
      showToast.error("Error al guardar orden", { duration: 3000, sound: true, position: "bottom-right" });
    }
  }

  async function handleToggleVisibility(id: string, current: string) {
    const next = current === "public" ? "private" : "public";
    const res = await fetch(`/api/albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility: next }),
    });
    if (res.ok) {
      showToast.success(next === "public" ? "Álbum publicado" : "Álbum ocultado", { duration: 3000, sound: true, position: "bottom-right" });
      fetchAlbums();
    } else {
      showToast.error("No se pudo cambiar la visibilidad", { duration: 4000, sound: true, position: "bottom-right" });
    }
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 md:px-10 h-14 border-b" style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}>
        <Link href="/" className="font-mono text-[10px] tracking-[0.3em] uppercase transition-opacity hover:opacity-60 flex items-center gap-2" style={{ color: "var(--text-3)" }}>
          ← Sitio
        </Link>
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: "var(--text-3)" }}>Admin</p>
        <button onClick={handleLogout} disabled={loggingOut} className="font-mono text-[10px] tracking-[0.3em] uppercase transition-opacity hover:opacity-60 disabled:opacity-30" style={{ color: "var(--text-3)" }}>
          {loggingOut ? "..." : "Salir"}
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 flex flex-col gap-8">
        {/* Upload button */}
        <Link
          href="/admin/upload"
          className="self-start flex items-center gap-3 px-8 py-4 font-mono text-[11px] tracking-[0.3em] uppercase transition-opacity hover:opacity-70"
          style={{ background: "var(--text)", color: "var(--bg)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Subir álbum
        </Link>

        {/* Albums list */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3 mb-3">
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-3)" }}>
              Álbumes {!loading && `(${albums.length})`}
            </p>
            {savingOrder && (
              <span className="font-mono text-[9px] tracking-[0.2em] uppercase" style={{ color: "var(--text-4)" }}>
                guardando orden...
              </span>
            )}
          </div>

          {loading && (
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-4)" }}>Cargando...</p>
          )}

          {!loading && albums.length === 0 && (
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-4)" }}>Sin álbumes todavía</p>
          )}

          {albums.map((album) => {
            const label = album.name || album.title;
            const isPublic = album.visibility === "public";
            const isDragging = draggingId === album.id;
            const isOver = dragOverId === album.id;
            return (
              <div
                key={album.id}
                draggable
                onDragStart={e => handleDragStart(e, album.id)}
                onDragOver={e => handleDragOver(e, album.id)}
                onDrop={e => handleDrop(e, album.id)}
                onDragEnd={() => { setDraggingId(null); setDragOverId(null); }}
                className="flex items-center gap-4 py-3 border-b"
                style={{
                  borderColor: "var(--border)",
                  opacity: isDragging ? 0.35 : 1,
                  background: isOver ? "rgba(255,255,255,0.03)" : "transparent",
                  boxShadow: isOver ? "inset 2px 0 0 var(--text)" : "none",
                  transition: "opacity 0.15s, background 0.15s, box-shadow 0.15s",
                  cursor: "grab",
                }}
              >
                {/* Drag handle */}
                <div className="flex-shrink-0" style={{ color: "var(--text-4)", paddingLeft: 2 }}>
                  <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
                    <circle cx="3" cy="3"  r="1.5" /><circle cx="7" cy="3"  r="1.5" />
                    <circle cx="3" cy="8"  r="1.5" /><circle cx="7" cy="8"  r="1.5" />
                    <circle cx="3" cy="13" r="1.5" /><circle cx="7" cy="13" r="1.5" />
                  </svg>
                </div>

                {/* Cover thumb */}
                <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden" style={{ background: "var(--bg-surface)" }}>
                  {album.cover_url && (
                    <Image src={album.cover_url} alt={label} fill sizes="48px" className="object-cover" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/album/${album.id}`}
                    className="font-mono text-[11px] tracking-[0.2em] uppercase transition-opacity hover:opacity-60 block truncate"
                    style={{ color: "var(--text)" }}
                  >
                    {label}
                  </Link>
                  <p className="font-mono text-[9px] tracking-[0.2em] uppercase mt-0.5" style={{ color: "var(--text-4)" }}>
                    {album.photos?.length ?? 0} fotos
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => handleToggleVisibility(album.id, album.visibility)}
                    className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 transition-opacity hover:opacity-70"
                    style={{
                      border: isPublic ? "1px solid #4ade80" : "1px solid var(--border-2)",
                      color: isPublic ? "#4ade80" : "var(--text-4)",
                    }}
                    title={isPublic ? "Visible — clic para ocultar" : "Oculto — clic para publicar"}
                  >
                    {isPublic ? "Visible" : "Oculto"}
                  </button>

                  <button
                    onClick={() => setDeleteTarget({ id: album.id, name: label })}
                    className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 transition-opacity hover:opacity-60"
                    style={{ border: "1px solid #e05c5c", color: "#e05c5c" }}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}
        >
          <div
            className="w-full max-w-sm p-8 flex flex-col gap-6"
            style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
          >
            <div className="flex flex-col gap-2">
              <p className="font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: "var(--text)" }}>
                Borrar álbum
              </p>
              <p className="font-mono text-[10px] tracking-[0.15em]" style={{ color: "var(--text-3)" }}>
                ¿Eliminar &ldquo;{deleteTarget.name}&rdquo;? Esta acción borra todas sus fotos y no se puede deshacer.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 py-3 font-mono text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-60 disabled:opacity-30"
                style={{ border: "1px solid var(--border)", color: "var(--text-3)" }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 py-3 font-mono text-[10px] tracking-[0.2em] uppercase transition-opacity hover:opacity-70 disabled:opacity-40"
                style={{ background: "#e05c5c", color: "#fff", border: "1px solid #e05c5c" }}
              >
                {deleting ? "Borrando..." : "Borrar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
