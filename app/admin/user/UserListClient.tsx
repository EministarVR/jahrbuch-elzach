"use client";

import { useState } from "react";
import GlowButton from "@/components/ui/GlowButton";
import LoginLinkClient from "./LoginLinkClient";
import ResetPollClient from "./ResetPollClient";
import { deleteUserAction, updateUserPasswordAction, updateUserRoleAction } from "../actions";
import { Trash2, QrCode, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";

type UserRow = {
  id: number;
  username: string;
  role: "user" | "moderator" | "admin";
  class: string | null;
  has_voted: number;
};

export default function UserListClient({ users }: { users: UserRow[] }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {users.length === 0 ? (
        <div className="text-center py-12 text-[#b8aea5]">
          Keine Benutzer gefunden. Passe deine Filter an.
        </div>
      ) : (
        users.map((u) => {
          const isExpanded = expandedId === u.id;
          return (
            <div
              key={u.id}
              className="rounded-xl border border-[#e89a7a]/15 bg-[#2a2520]/60 hover:border-[#e89a7a]/25 transition-all overflow-hidden"
            >
              {/* Compact header - always visible */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : u.id)}
                className="w-full px-4 py-3 flex items-center justify-between gap-4 text-left hover:bg-[#38302b]/30 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="font-semibold text-[#f5f1ed] truncate">{u.username}</span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#e89a7a]/10 text-[#e89a7a] border border-[#e89a7a]/20 text-xs font-medium shrink-0">
                    {u.role}
                  </span>
                  {u.class && (
                    <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full bg-[#8faf9d]/10 text-[#8faf9d] border border-[#8faf9d]/20 text-xs font-medium shrink-0">
                      {u.class}
                    </span>
                  )}
                  <span
                    className={`hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
                      u.has_voted
                        ? "bg-[#8faf9d]/10 text-[#8faf9d]"
                        : "bg-[#d97757]/10 text-[#d97757]"
                    }`}
                  >
                    {u.has_voted ? "✓ Abgestimmt" : "○ Nicht abgestimmt"}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-[#b8aea5]">ID: {u.id}</span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-[#e89a7a]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[#b8aea5]" />
                  )}
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 border-t border-[#e89a7a]/10">
                  {/* Mobile: show class and vote status if hidden above */}
                  <div className="sm:hidden flex flex-wrap gap-2 pt-3">
                    {u.class && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#8faf9d]/10 text-[#8faf9d] border border-[#8faf9d]/20 text-xs font-medium">
                        {u.class}
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.has_voted
                          ? "bg-[#8faf9d]/10 text-[#8faf9d]"
                          : "bg-[#d97757]/10 text-[#d97757]"
                      }`}
                    >
                      {u.has_voted ? "✓ Abgestimmt" : "○ Nicht abgestimmt"}
                    </span>
                  </div>

                  {/* Role & Password */}
                  <div className="pt-3 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <form action={updateUserRoleAction} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={u.id} />
                        <select name="role" defaultValue={u.role} className="input-base text-sm">
                          <option value="user">user</option>
                          <option value="moderator">moderator</option>
                          <option value="admin">admin</option>
                        </select>
                        <GlowButton variant="primary" className="px-3 py-2 text-sm">
                          Rolle ändern
                        </GlowButton>
                      </form>
                      <form action={deleteUserAction}>
                        <input type="hidden" name="id" value={u.id} />
                        <GlowButton
                          variant="secondary"
                          className="px-3 py-2 text-sm"
                          iconLeft={<Trash2 className="h-4 w-4" />}
                        >
                          Löschen
                        </GlowButton>
                      </form>
                    </div>

                    <form action={updateUserPasswordAction} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={u.id} />
                      <input
                        name="password"
                        type="password"
                        placeholder="Neues Passwort"
                        className="input-base text-sm flex-1"
                      />
                      <GlowButton variant="secondary" className="px-3 py-2 text-sm">
                        Passwort ändern
                      </GlowButton>
                    </form>
                  </div>

                  {/* Login Link */}
                  <div className="pt-3 border-t border-[#e89a7a]/10">
                    <div className="inline-flex items-center gap-2 text-xs text-[#b8aea5] mb-2">
                      <QrCode className="h-3.5 w-3.5 text-[#e89a7a]" />
                      <span>Login-Link erstellen:</span>
                    </div>
                    <LoginLinkClient userId={u.id} username={u.username} />
                  </div>

                  {/* Poll status */}
                  <div className="pt-3 border-t border-[#e89a7a]/10">
                    <div className="inline-flex items-center gap-2 text-xs text-[#b8aea5] mb-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#8faf9d]" />
                      <span>Umfrage-Status:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          u.has_voted
                            ? "bg-[#8faf9d]/10 text-[#8faf9d]"
                            : "bg-[#d97757]/10 text-[#d97757]"
                        }`}
                      >
                        {u.has_voted ? "Hat abgestimmt" : "Nicht abgestimmt"}
                      </span>
                      <ResetPollClient userId={u.id} username={u.username} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

