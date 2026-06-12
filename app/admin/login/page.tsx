"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message);
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
      <div className="w-full max-w-sm px-8 py-12" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
        <p className="font-mono text-[10px] tracking-[0.4em] uppercase mb-8" style={{ color: "var(--text-3)" }}>
          Sebastian Calle · Admin
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-3)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              className="w-full px-4 py-3 font-mono text-sm outline-none"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border-2)",
                color: "var(--text)",
              }}
              placeholder="admin@ejemplo.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--text-3)" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 font-mono text-sm outline-none"
              style={{
                background: "var(--bg)",
                border: "1px solid var(--border-2)",
                color: "var(--text)",
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="font-mono text-[11px] tracking-wide" style={{ color: "#e05c5c" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="w-full py-3 font-mono text-[11px] tracking-[0.3em] uppercase transition-opacity disabled:opacity-40"
            style={{ background: "var(--text)", color: "var(--bg)" }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
