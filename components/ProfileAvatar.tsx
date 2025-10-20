"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, Shield } from "lucide-react";

export type PublicUser = {
  id: number;
  username: string;
  class: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: 'user' | 'moderator' | 'admin';
};

type Props = {
  userId: number;
  username?: string;
  avatarUrl?: string | null;
  size?: number; // px
  className?: string;
};

export default function ProfileAvatar({ userId, username, avatarUrl, size = 28, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<PublicUser | null>(
    username || avatarUrl ? { id: userId, username: username || "", class: null, bio: null, avatar_url: avatarUrl ?? null, role: 'user' } : null
  );
  const btnRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (btnRef.current && btnRef.current.contains(t)) return;
      if (popRef.current && popRef.current.contains(t)) return;
      setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  // Eagerly load avatar/public info so the profile image is visible without clicking
  useEffect(() => {
    // If avatar is already known via props or state, skip fetching
    if (user?.avatar_url || avatarUrl) return;
    let active = true;
    fetch(`/api/users/public?userId=${userId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("load failed");
        const data = await r.json();
        if (!active) return;
        setUser(data.user as PublicUser);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [userId]);

  useEffect(() => {
    if (!open) return;
    if (user && user.bio !== null) return; // already fetched full
    setLoading(true);
    fetch(`/api/users/public?userId=${userId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("load failed");
        const data = await r.json();
        setUser(data.user as PublicUser);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, userId]);

  const avatar = user?.avatar_url ?? avatarUrl ?? null;
  const label = user?.username || username || "User";

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div
        ref={btnRef}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            setOpen((v) => !v);
          }
        }}
        className="rounded-full border border-[#e89a7a]/20 overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#e89a7a]/40"
        style={{ width: size, height: size }}
        title={label}
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#d97757] to-[#c96846] text-white">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {open && (
        <div
          ref={popRef}
          role="dialog"
          aria-label={`Profil von ${label}`}
          className="absolute z-40 top-[calc(100%+8px)] left-0 min-w-[240px] max-w-[320px] p-4 rounded-2xl border border-[#e89a7a]/20 bg-[#2a2520]/98 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#e89a7a]/20">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt={label} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#d97757] to-[#c96846] text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-[#f5f1ed] flex items-center gap-2">{label}{user?.role === 'admin' && (
                <span title="Administrator" aria-label="Administrator" className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
                  <Shield className="w-3.5 h-3.5" />
                </span>
              )}</div>
              {user?.class && (
                <div className="text-xs text-[#b8aea5]">Klasse {user.class}</div>
              )}
            </div>
          </div>

          {user?.role === 'admin' && (
            <div className="mb-2 inline-flex items-center gap-2 px-2 py-1 rounded-md bg-red-500/10 text-red-300 border border-red-500/20 text-xs" title="Administrator">
              <Shield className="w-3 h-3" aria-label="Administrator" />
              <span>Administrator – Mitglied des Admin-Teams</span>
            </div>
          )}
          <div className="text-sm text-[#b8aea5] whitespace-pre-wrap">
            {loading && <span className="opacity-70">Lädt…</span>}
            {!loading && (user?.bio ? user.bio : <span className="opacity-70">Keine Bio vorhanden.</span>)}
          </div>
        </div>
      )}
    </div>
  );
}
