import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { query } from "@/lib/db";
import FancyHeading from "@/components/ui/FancyHeading";
import GlassCard from "@/components/ui/GlassCard";
import TiltCard from "@/components/ui/TiltCard";
import GlowButton from "@/components/ui/GlowButton";
import LoginLinkClient from "./LoginLinkClient";
import { createUserAction, deleteUserAction, updateUserPasswordAction, updateUserRoleAction, banUserAction, unbanUserAction, banIpAction, unbanIpAction } from "../actions";
import { Users, Shield, KeyRound, UserPlus, Trash2, QrCode, Ban } from "lucide-react";

export const dynamic = "force-dynamic";

type UserRow = { id: number; username: string; role: "user" | "moderator" | "admin" };

export default async function AdminUserPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const users = await query<UserRow[]>(
    "SELECT id, username, role FROM users ORDER BY id DESC"
  );

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    moderators: users.filter((u) => u.role === 'moderator').length,
    users: users.filter((u) => u.role === 'user').length,
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-indigo-50/70 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-indigo-400/25 via-indigo-500/15 to-sky-400/25 blur-3xl opacity-70 dark:opacity-40" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-sky-400/30 via-indigo-400/20 to-fuchsia-400/25 blur-3xl opacity-75 dark:opacity-40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[80%] bg-gradient-to-t from-indigo-100/70 via-transparent to-transparent dark:from-indigo-900/30" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
        <FancyHeading center subtitle="Alle Account-Werkzeuge an einem Ort – schön, klar, schnell.">
          Benutzerverwaltung
        </FancyHeading>

        {/* Quick stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[{label:'Gesamt',value:stats.total,icon:<Users className='h-5 w-5'/>},{label:'Admins',value:stats.admins,icon:<Shield className='h-5 w-5'/>},{label:'Moderatoren',value:stats.moderators,icon:<KeyRound className='h-5 w-5'/>},{label:'Users',value:stats.users,icon:<Users className='h-5 w-5'/>}].map((s,i)=> (
            <GlassCard key={s.label} delay={i*0.05}>
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/30 flex items-center justify-center">{s.icon}</div>
                <div>
                  <div className="text-sm text-base-muted">{s.label}</div>
                  <div className="text-xl font-semibold text-base-strong">{s.value}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Users list */}
          <div className="lg:col-span-2 space-y-8">
            <TiltCard>
              <GlassCard
                header={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20"><Users className="h-5 w-5"/></span>
                      <div>
                        <h3 className="text-lg font-semibold text-base-strong">Benutzer</h3>
                        <p className="text-sm text-base-muted">Rollen, Passwörter und Login-Links verwalten.</p>
                      </div>
                    </div>
                    <a href="/admin" className="text-sm text-indigo-600 hover:underline">Zurück zum Admin</a>
                  </div>
                }
              >
                <div className="divide-y divide-black/5 dark:divide-white/10">
                  {users.map((u) => (
                    <div key={u.id} className="py-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="text-sm text-base-strong flex items-center gap-2">
                            <span className="font-medium">{u.username}</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20 text-xs">{u.role}</span>
                          </div>
                        </div>
                        <form action={deleteUserAction}>
                          <input type="hidden" name="id" value={u.id} />
                          <GlowButton variant="secondary" className="px-3 py-2 text-sm" iconLeft={<Trash2 className="h-4 w-4" />}>Löschen</GlowButton>
                        </form>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <form action={updateUserRoleAction} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={u.id} />
                          <select name="role" defaultValue={u.role} className="px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10 text-sm">
                            <option value="user">user</option>
                            <option value="moderator">moderator</option>
                            <option value="admin">admin</option>
                          </select>
                          <GlowButton variant="primary" className="px-3 py-2 text-sm">Rolle</GlowButton>
                        </form>
                        <form action={updateUserPasswordAction} className="flex items-center gap-2">
                          <input type="hidden" name="id" value={u.id} />
                          <input name="password" type="password" placeholder="Neues Passwort" className="px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10 text-sm" />
                          <GlowButton variant="secondary" className="px-3 py-2 text-sm">Passwort</GlowButton>
                        </form>
                        <div className="inline-flex items-center gap-2 text-sm text-base-muted">
                          <QrCode className="h-4 w-4 text-indigo-600" />
                          <span>Login-Link erstellen:</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <LoginLinkClient userId={u.id} username={u.username} />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </TiltCard>
          </div>

          {/* Right: Create + Ban */}
          <div className="lg:col-span-1 space-y-8">
            <GlassCard
              header={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20"><UserPlus className="h-5 w-5"/></span>
                  <div>
                    <h3 className="text-lg font-semibold text-base-strong">Benutzer anlegen</h3>
                    <p className="text-sm text-base-muted">Schnell einen Zugang erstellen.</p>
                  </div>
                </div>
              }
            >
              <form action={createUserAction} className="grid grid-cols-1 gap-3">
                <input name="username" placeholder="Username" className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 shadow-inner outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 ring-1 ring-black/5 dark:ring-white/10" />
                <input name="password" placeholder="Passwort" type="password" className="px-4 py-3 rounded-2xl bg-white/70 dark:bg-slate-800/60 shadow-inner outline-none focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500 ring-1 ring-black/5 dark:ring-white/10" />
                <GlowButton variant="primary" className="h-[42px]">Erstellen</GlowButton>
              </form>
            </GlassCard>

            <GlassCard
              header={<div className="flex items-center gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20"><Ban className="h-5 w-5"/></span><div><h3 className="text-lg font-semibold text-base-strong">Sperren</h3><p className="text-sm text-base-muted">User- und IP-Sperren verwalten.</p></div></div>}
            >
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2 text-base-strong">Benutzer sperren</div>
                  <form action={banUserAction} className="grid grid-cols-1 gap-3">
                    <input name="user_id" placeholder="User ID" className="px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10 text-sm" />
                    <input name="reason" placeholder="Grund (optional)" className="px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10 text-sm" />
                    <input name="expires_at" type="datetime-local" className="px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10 text-sm" />
                    <GlowButton variant="primary" className="h-[38px]">Sperren</GlowButton>
                  </form>
                  <form action={unbanUserAction} className="flex items-center gap-3 mt-3">
                    <input name="user_id" placeholder="User ID" className="px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10 text-sm" />
                    <GlowButton variant="secondary" className="h-[38px]">Entsperren</GlowButton>
                  </form>
                </div>
                <div className="pt-2">
                  <div className="text-sm font-medium mb-2 text-base-strong">IP sperren</div>
                  <form action={banIpAction} className="grid grid-cols-1 gap-3">
                    <input name="ip" placeholder="IP-Adresse" className="px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10 text-sm" />
                    <input name="reason" placeholder="Grund (optional)" className="px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10 text-sm" />
                    <input name="expires_at" type="datetime-local" className="px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10 text-sm" />
                    <GlowButton variant="primary" className="h-[38px]">Sperren</GlowButton>
                  </form>
                  <form action={unbanIpAction} className="flex items-center gap-3 mt-3">
                    <input name="ip" placeholder="IP-Adresse" className="px-4 py-2 rounded-xl bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10 text-sm" />
                    <GlowButton variant="secondary" className="h-[38px]">Entsperren</GlowButton>
                  </form>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
