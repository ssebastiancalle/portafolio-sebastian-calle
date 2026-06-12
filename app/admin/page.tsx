"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export default function AdminPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 md:px-10 h-14 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg-surface)" }}
      >
        <Link
          href="/"
          className="font-mono text-[10px] tracking-[0.3em] uppercase transition-opacity hover:opacity-60 flex items-center gap-2"
          style={{ color: "var(--text-3)" }}
        >
          ← Sitio
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="font-mono text-[10px] tracking-[0.3em] uppercase transition-opacity hover:opacity-60 disabled:opacity-30"
          style={{ color: "var(--text-3)" }}
        >
          {loggingOut ? "..." : "Salir"}
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] gap-6 px-6">
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase" style={{ color: "var(--text-3)" }}>
          ¿Qué querés hacer?
        </p>

        <Link
          href="/admin/upload"
          className="flex items-center gap-3 px-8 py-4 font-mono text-[11px] tracking-[0.3em] uppercase transition-opacity hover:opacity-70"
          style={{ background: "var(--text)", color: "var(--bg)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Subir álbum
        </Link>
      </div>
    </div>
  );
}
