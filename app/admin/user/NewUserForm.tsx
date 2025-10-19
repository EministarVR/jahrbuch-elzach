"use client";
import { useState, useTransition, useRef } from "react";
import { createUserAction } from "../actions";
import { UserPlus, RefreshCw } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import { CLASSES } from "@/lib/constants";

export default function NewUserForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const passwordRef = useRef<HTMLInputElement>(null);

  function generatePassword(length = 12) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    let pwd = "";
    for (let i = 0; i < length; ++i) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    return pwd;
  }

  function handleRandomPassword(e: React.MouseEvent) {
    e.preventDefault();
    const pwd = generatePassword();
    if (passwordRef.current) {
      passwordRef.current.value = pwd;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createUserAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        e.currentTarget.reset();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="rounded bg-red-100 text-red-800 px-3 py-2 text-sm">{error}</div>
      )}
      {success && (
        <div className="rounded bg-green-100 text-green-800 px-3 py-2 text-sm">Benutzer erfolgreich erstellt!</div>
      )}
      <input name="username" placeholder="Username" className="input-base" autoComplete="off" />
      <div className="relative">
        <input
          ref={passwordRef}
          name="password"
          placeholder="Passwort"
          type="password"
          className="input-base pr-10"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={handleRandomPassword}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#b8aea5] hover:text-[#e89a7a]"
          title="Zufallspasswort generieren"
          tabIndex={-1}
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>
      <select name="class" defaultValue="" className="input-base">
        <option value="">Klasse (optional)</option>
        {CLASSES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <GlowButton variant="gradient" className="w-full" iconLeft={<UserPlus className="h-4 w-4" />} disabled={isPending}>
        {isPending ? "Wird erstellt..." : "Benutzer erstellen"}
      </GlowButton>
    </form>
  );
}
