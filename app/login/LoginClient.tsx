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
              ? "Login fehlgeschlagen."
              : json.error || "Fehler"
          );
        } else {
          // Redirect back to /login to allow server-side role-based redirect
          window.location.href = "/login";
        }
      } catch {
        triggerError("Netzwerkfehler.");
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
      className={
        "relative z-10 px-8 pt-8 pb-6 space-y-5 " +
        (shake ? "animate-shake" : "")
      }
      noValidate
    >
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500/70 dark:text-indigo-300/70" />
        <input
          name="username"
          placeholder="Username"
          autoComplete="username"
          aria-label="Username"
          className="input-base pl-12 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          required
        />
      </div>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500/70 dark:text-indigo-300/70" />
        <input
          name="password"
          placeholder="Passwort"
          type="password"
          autoComplete="current-password"
          aria-label="Passwort"
          className="input-base pl-12 placeholder:text-slate-400 dark:placeholder:text-slate-500"
          required
        />
      </div>
      {error && (
        <div
          className="flex items-start gap-2 rounded-lg border border-red-300/60 dark:border-red-500/30 bg-red-50/90 dark:bg-red-900/20 px-3 py-2 text-xs text-red-700 dark:text-red-300 shadow-sm"
          role="alert"
          aria-live="assertive"
        >
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      <GlowButton
        className="w-full h-12 text-[0.95rem] font-medium tracking-tight"
        variant="gradient"
        loading={isPending}
        iconRight={<ArrowRight className="h-4 w-4" />}
      >
        Einloggen
      </GlowButton>
    </form>
  );
}
