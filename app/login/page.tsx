"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = isSupabaseConfigured();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError("Forkert e-mail eller adgangskode.");
      setLoading(false);
      return;
    }
    // Full navigation so the new session cookie is picked up server-side.
    window.location.href = "/vaerktoej";
  }

  return (
    <>
      <header className="site-header">
        <Link href="/" className="logo">
          <span className="logo-mark">Årsplanen</span>
          <span className="logo-tag">for lærere</span>
        </Link>
      </header>

      <main className="login-wrap">
        <div className="login-card">
          <Link href="/" className="login-back">
            ← Tilbage til forsiden
          </Link>
          <h1>Log ind</h1>
          <p className="login-sub">
            Log ind for at åbne dine årsplaner og forløbsbibliotek.
          </p>

          {!configured && (
            <p
              className="login-sub"
              style={{ color: "var(--rust)", fontWeight: 500 }}
            >
              Login er ikke konfigureret endnu (mangler Supabase-nøgler).
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="navn@skole.dk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="login-field">
              <label htmlFor="password">Adgangskode</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p
                style={{
                  color: "var(--rust)",
                  fontSize: "13px",
                  marginBottom: "12px",
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary login-submit"
              disabled={loading || !configured}
            >
              {loading ? "Logger ind…" : "Log ind"}
            </button>
          </form>

          <p className="login-meta">
            Har du ikke en konto? Kontakt din administrator.
          </p>
        </div>
      </main>
    </>
  );
}
