"use client";

import { useState, useTransition } from "react";
import GlowButton from "@/components/ui/GlowButton";

export default function LoginLinkClient({ userId, username }: { userId: number; username: string }) {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<{ link: string; username: string; password: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const generate = () => {
    setError(null);
    if (!password) {
      setError("Passwort eingeben");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/generate-login-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, password }),
        });
        const json = await res.json();
        if (!json.success) {
          setError(json.error || "Fehler");
          setResult(null);
          return;
        }
        setResult({ link: json.link, username: json.username, password: json.password });
      } catch (e) {
        setError("Netzwerkfehler");
      }
    });
  };

  const qrUrl = result ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(result.link)}` : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Neues Passwort für Link"
          type="text"
          className="px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10 text-sm w-full sm:w-72"
        />
        <GlowButton onClick={generate} loading={isPending} className="px-4 py-2 text-sm">
          Login-Link erzeugen
        </GlowButton>
      </div>
      {error && (
        <div className="text-xs text-red-600 dark:text-red-400">{error}</div>
      )}
      {result && (
        <div className="mt-2 rounded-2xl p-4 bg-white/60 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10">
          <div className="text-sm font-medium text-base-strong mb-2">Zugangsdaten</div>
          <div className="grid sm:grid-cols-[220px,1fr] gap-4 items-start">
            {qrUrl && (
              <a href={qrUrl} download={`login-${result.username}.png`} title="QR-Code herunterladen">
                <img src={qrUrl} alt="Login QR Code" className="rounded-lg ring-1 ring-black/5 dark:ring-white/10" />
              </a>
            )}
            <div className="space-y-2 text-sm">
              <div><span className="text-base-muted">Link:</span> <a className="text-indigo-600 break-all" href={result.link}>{result.link}</a></div>
              <div><span className="text-base-muted">Username:</span> <span className="font-medium">{result.username}</span></div>
              <div><span className="text-base-muted">Passwort:</span> <span className="font-mono">{result.password}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
