"use client";
import { useState, useTransition, useEffect } from "react";
import GlowButton from "@/components/ui/GlowButton";
import { User, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function LoginClient() {
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");
    if (!username || !password) {
      triggerError("Bitte Username & Passwort eingeben.");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const json = await res
          .json()
          .catch(() => ({ success: false, error: "Fehler" }));
        if (!json.success) {
          triggerError(
            json.error === "Invalid credentials"
              ? "Login fehlgeschlagen. Bitte überprüfe deine Daten."
              : json.error || "Ein Fehler ist aufgetreten"
          );
        } else {
          // Redirect back to /login to allow server-side role-based redirect
          window.location.href = "/login";
        }
      } catch {
        triggerError("Netzwerkfehler. Bitte versuche es erneut.");
      }
    });
  };

  function triggerError(msg: string) {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 650);
  }

  useEffect(() => {
    if (error) {
      const id = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(id);
    }
  }, [error]);

  return (
    <form
      onSubmit={handleSubmit}
      className={shake ? "animate-shake" : ""}
      noValidate
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-semibold mb-3 text-[#f5f1ed]"
          >
            Username
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#e89a7a]/60 pointer-events-none transition-colors" />
            <input
              id="username"
              name="username"
              type="text"
              placeholder="vorname.nachname"
              autoComplete="username"
              aria-label="Username"
              className="input-base pl-12"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold mb-3 text-[#f5f1ed]"
          >
            Passwort
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#e89a7a]/60 pointer-events-none transition-colors" />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              aria-label="Passwort"
              className="input-base pl-12"
              required
            />
          </div>
        </div>

        {error && (
          <div
            className="flex items-start gap-3 rounded-xl border border-[#d97757]/40 bg-[#d97757]/10 px-4 py-3 text-sm text-[#e89a7a] shadow-lg animate-[fade-in_0.3s_ease-out]"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <div className="pt-2">
          <GlowButton
            type="submit"
            variant="gradient"
            className="w-full justify-center"
            loading={isPending}
            iconRight={<ArrowRight className="h-5 w-5" />}
          >
            {isPending ? "Anmeldung läuft..." : "Jetzt anmelden"}
          </GlowButton>
        </div>
      </div>
    </form>
  );
}
