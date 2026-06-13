"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

type AdminPhoto = {
  id: string;
  url: string;
  alt: string | null;
  order: number;
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

export default function AdminAlbumPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [album, setAlbum] = useState<AdminAlbum | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchAlbum = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/albums");
    if (res.ok) {
      const data = await res.json();
      const found = (data.albums as AdminAlbum[]).find((a) => a.id === id) ?? null;
      setAlbum(found);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { fetchAlbum(); }, [fetchAlbum]);

  async function handleDeletePhoto(photoId: string) {
    if (!confirm("¿Borrar esta foto?")) return;
    setDeleting(photoId);
    await fetch(`/api/photos/${photoId}`, { method: "DELETE" });
    fetchAlbum();
    setDeleting(null);
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
    await fetch(`/api/albums/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility: next }),
    });
    fetchAlbum();
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
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleVisibility}
            className="font-mono text-[10px] tracking-[0.3em] uppercase px-4 py-2 transition-opacity hover:opacity-60"
            style={{ border: "1px solid var(--border-2)", color: isPublic ? "var(--text)" : "var(--text-4)" }}
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
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: "var(--text-3)" }}>
            Fotos ({album.photos.length})
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
            {album.photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square overflow-hidden group" style={{ background: "var(--bg-surface)" }}>
                {photo.url && (
                  <Image src={photo.url} alt={photo.alt ?? ""} fill sizes="150px" className="object-cover" />
                )}
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  disabled={deleting === photo.id}
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
                  style={{ background: "rgba(0,0,0,0.6)" }}
                >
                  {deleting === photo.id ? (
                    <span className="font-mono text-[9px] text-white/50 tracking-widest">...</span>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e05c5c" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
