"use client";

import Link from "next/link";
import { useState } from "react";

// Hvor "værktøjet" lever. Pt. den eksisterende statiske demo i public/.
// Skift denne sti, når værktøjet flyttes ind i appen (f.eks. "/planlaegger").
const TOOL_URL = "/aarsplan-demo.html";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Ingen rigtig authentication endnu — før brugeren direkte ind i værktøjet.
    window.location.href = TOOL_URL;
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
            <button type="submit" className="btn btn-primary login-submit">
              Log ind
            </button>
          </form>

          <p className="login-meta">
            Har du ikke en konto? <Link href="/login">Opret dig her</Link>
          </p>
        </div>
      </main>
    </>
  );
}
