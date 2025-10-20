"use client";

import { useState } from 'react';
import Image from 'next/image';
import GlowButton from '@/components/ui/GlowButton';

export default function AccountFormClient({ initialBio, initialAvatarUrl }: { initialBio: string | null; initialAvatarUrl: string | null; }) {
  const [bio, setBio] = useState(initialBio || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialAvatarUrl || null);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage(null);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/account/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Upload fehlgeschlagen');
      setAvatarUrl(data.url);
      setMessage('Profilbild aktualisiert. Nicht vergessen zu speichern.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload fehlgeschlagen';
      setMessage(msg);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, avatar_url: avatarUrl })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Speichern fehlgeschlagen');
      setMessage('Profil gespeichert.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Speichern fehlgeschlagen';
      setMessage(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    if (!avatarUrl) return;
    setRemoving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, avatar_url: null })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Entfernen fehlgeschlagen');
      setAvatarUrl(null);
      setMessage('Profilbild entfernt.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Entfernen fehlgeschlagen';
      setMessage(msg);
    } finally {
      setRemoving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#38302b] flex items-center justify-center border border-[#e89a7a]/20">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#b8aea5] text-sm">Kein Bild</span>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-[#f5f1ed] mb-2">Profilbild</label>
          <input type="file" accept="image/*" onChange={handleUpload} className="block text-sm text-[#b8aea5] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#e89a7a]/20 file:text-[#e89a7a] hover:file:bg-[#e89a7a]/30" />
          <p className="text-xs text-[#8faf9d] mt-2">Erlaubte Formate: JPG, PNG, WEBP, GIF. Max 5MB.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#f5f1ed] mb-2">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          className="w-full rounded-lg bg-[#2a2520] border border-[#e89a7a]/20 p-3 text-sm text-[#f5f1ed] placeholder-[#b8aea5] focus:outline-none focus:ring-2 focus:ring-[#e89a7a]/40"
          placeholder="Erzähle kurz etwas über dich..."
        />
        <div className="text-xs text-[#b8aea5] mt-1">{bio.length}/2000</div>
      </div>

      {message && <div className="text-sm text-[#e89a7a]">{message}</div>}

      <div className="flex gap-3">
        <GlowButton type="submit" loading={saving}>
          Speichern
        </GlowButton>
        {avatarUrl && (
          <GlowButton type="button" variant="secondary" onClick={handleRemove} loading={removing}>
            Bild entfernen
          </GlowButton>
        )}
      </div>
    </form>
  );
}
