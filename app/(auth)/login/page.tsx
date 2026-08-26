"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function manejarSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setCargando(false);
    if (error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={manejarSubmit}
        className="bg-surface border border-line rounded p-8 w-full max-w-sm shadow-sm"
      >
        <h1 className="font-display font-bold text-xl mb-1">Prints Lab OS</h1>
        <p className="text-ink-muted text-sm mb-6">Inicia sesión para continuar</p>

        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1">
          Correo
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line rounded px-3 py-2 mb-4 text-sm"
        />

        <label className="block text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1">
          Contraseña
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-line rounded px-3 py-2 mb-4 text-sm"
        />

        {error && <p className="text-bad text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="w-full bg-clay text-white rounded py-2 font-semibold text-sm disabled:opacity-60"
        >
          {cargando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
