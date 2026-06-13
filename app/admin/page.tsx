"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase-browser";

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

  const fetchAlbums = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/albums");
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

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Borrar el álbum "${name}"? Esto elimina todas sus fotos.`)) return;
    await fetch(`/api/albums/${id}`, { method: "DELETE" });
    fetchAlbums();
  }

  async function handleToggleVisibility(id: string, current: string) {
    const next = current === "public" ? "private" : "public";
    await fetch(`/api/albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility: next }),
    });
    fetchAlbums();
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
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: "var(--text-3)" }}>
            Álbumes {!loading && `(${albums.length})`}
          </p>

          {loading && (
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-4)" }}>Cargando...</p>
          )}

          {!loading && albums.length === 0 && (
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-4)" }}>Sin álbumes todavía</p>
          )}

          {albums.map((album) => {
            const label = album.name || album.title;
            const isPublic = album.visibility === "public";
            return (
              <div
                key={album.id}
                className="flex items-center gap-4 py-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
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
                  {/* Visibility toggle */}
                  <button
                    onClick={() => handleToggleVisibility(album.id, album.visibility)}
                    className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 transition-opacity hover:opacity-60"
                    style={{
                      border: "1px solid var(--border-2)",
                      color: isPublic ? "var(--text)" : "var(--text-4)",
                    }}
                    title={isPublic ? "Visible — clic para ocultar" : "Oculto — clic para publicar"}
                  >
                    {isPublic ? "Visible" : "Oculto"}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(album.id, label)}
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
    </div>
  );
}
