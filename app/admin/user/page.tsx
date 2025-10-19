import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { query } from "@/lib/db";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import LoginLinkClient from "./LoginLinkClient";
import ResetPollClient from "./ResetPollClient";
import { createUserAction, deleteUserAction, updateUserPasswordAction, updateUserRoleAction, banUserAction, unbanUserAction, banIpAction, unbanIpAction } from "../actions";
import { Users, Shield, KeyRound, UserPlus, Trash2, QrCode, Ban, ArrowLeft, CheckCircle2 } from "lucide-react";
import { ensureUserClassColumn, ensurePollSubmissionsTable } from "@/lib/migrations";
import { CLASSES } from "@/lib/constants";

export const dynamic = "force-dynamic";

type UserRow = { id: number; username: string; role: "user" | "moderator" | "admin"; class: string | null; has_voted: number };

export default async function AdminUserPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/zugriff-verweigert");

  await ensureUserClassColumn();
  await ensurePollSubmissionsTable();

  const sp = await searchParams;
  const q = typeof sp?.q === "string" ? sp.q.trim() : "";
  const classFilter = typeof sp?.class === "string" ? sp.class.trim() : "";

  const where: string[] = [];
  const params: string[] = [];
  if (q) { where.push("u.username LIKE ?"); params.push(`%${q}%`); }
  if (classFilter === "none") { where.push("u.class IS NULL"); }
  else if (classFilter) { where.push("u.class = ?"); params.push(classFilter); }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

  const users = await query<UserRow[]>(
    `SELECT u.id, u.username, u.role, u.class, 
     COALESCE((SELECT 1 FROM poll_submissions ps WHERE ps.user_id = u.id LIMIT 1), 0) as has_voted
     FROM users u ${whereSql} ORDER BY u.id DESC`,
    params
  );

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'admin').length,
    moderators: users.filter((u) => u.role === 'moderator').length,
    users: users.filter((u) => u.role === 'user').length,
  };

  const groups = [
    { label: 'Ohne Klasse', items: users.filter((u) => !u.class) },
    ...CLASSES.map((c) => ({ label: c, items: users.filter((u) => u.class === c) })),
  ];

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#1a1714] via-[#221e1a] to-[#1a1714]">
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#e89a7a]/6 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[#8faf9d]/6 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#e89a7a]/10 border border-[#e89a7a]/20">
            <Shield className="h-4 w-4 text-[#e89a7a]" />
            <span className="text-xs font-medium tracking-wide uppercase text-[#e89a7a]">
              Nur für Admins
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#f5f1ed] mb-4">
            Benutzerverwaltung
          </h1>
          <p className="text-lg text-[#b8aea5] max-w-2xl mx-auto">
            Alle Account-Werkzeuge an einem Ort – schön, klar, schnell.
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {label:'Gesamt',value:stats.total,icon:<Users className='h-5 w-5'/>, color: "from-[#d97757] to-[#c96846]"},
            {label:'Admins',value:stats.admins,icon:<Shield className='h-5 w-5'/>, color: "from-[#c96846] to-[#b85836]"},
            {label:'Moderatoren',value:stats.moderators,icon:<KeyRound className='h-5 w-5'/>, color: "from-[#7a9b88] to-[#6a8b78]"},
            {label:'Users',value:stats.users,icon:<Users className='h-5 w-5'/>, color: "from-[#b8957a] to-[#a88568]"}
          ].map((s,i)=> (
            <GlassCard key={s.label} delay={i*0.05}>
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg`}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-sm text-[#b8aea5]">{s.label}</div>
                  <div className="text-2xl font-bold text-[#f5f1ed]">{s.value}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Users list */}
          <div className="lg:col-span-2 space-y-8">
            <GlassCard
              header={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e89a7a]/10 text-[#e89a7a]">
                      <Users className="h-5 w-5"/>
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-[#f5f1ed]">Benutzer</h3>
                      <p className="text-sm text-[#b8aea5]">Rollen, Passwörter und Login-Links verwalten.</p>
                    </div>
                  </div>
                  <a href="/admin" className="text-sm text-[#e89a7a] hover:underline inline-flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" />
                    Zurück
                  </a>
                </div>
              }
            >
              <form method="GET" className="mb-6 flex flex-wrap items-center gap-3">
                <input type="text" name="q" defaultValue={q} placeholder="Suche Username" className="input-base flex-1 min-w-[200px]" />
                <select name="class" defaultValue={classFilter} className="input-base min-w-[160px]">
                  <option value="">Alle Klassen</option>
                  <option value="none">Ohne Klasse</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <GlowButton variant="primary" className="px-5">Filtern</GlowButton>
                <a href="/admin/user" className="text-sm text-[#e89a7a] hover:underline">Zurücksetzen</a>
              </form>
              <div className="space-y-4">
                {users.map((u) => (
                  <div key={u.id} className="rounded-xl border border-[#e89a7a]/15 bg-[#2a2520]/60 p-4 hover:border-[#e89a7a]/25 transition-all">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div>
                        <div className="text-sm flex items-center gap-2">
                          <span className="font-semibold text-[#f5f1ed]">{u.username}</span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#e89a7a]/10 text-[#e89a7a] border border-[#e89a7a]/20 text-xs font-medium">
                            {u.role}
                          </span>
                          {u.class && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#8faf9d]/10 text-[#8faf9d] border border-[#8faf9d]/20 text-xs font-medium">
                              {u.class}
                            </span>
                          )}
                        </div>
                      </div>
                      <form action={deleteUserAction}>
                        <input type="hidden" name="id" value={u.id} />
                        <GlowButton variant="secondary" className="px-3 py-2 text-sm" iconLeft={<Trash2 className="h-4 w-4" />}>Löschen</GlowButton>
                      </form>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <form action={updateUserRoleAction} className="flex items-center gap-2">
                        <input type="hidden" name="id" value={u.id} />
                        <select name="role" defaultValue={u.role} className="input-base text-sm">
                          <option value="user">user</option>
                          <option value="moderator">moderator</option>
                          <option value="admin">admin</option>
                        </select>
                        <GlowButton variant="primary" className="px-3 py-2 text-sm">Rolle</GlowButton>
                      </form>
                      <form action={updateUserPasswordAction} className="flex items-center gap-2 flex-1">
                        <input type="hidden" name="id" value={u.id} />
                        <input name="password" type="password" placeholder="Neues Passwort" className="input-base text-sm flex-1 min-w-[120px]" />
                        <GlowButton variant="secondary" className="px-3 py-2 text-sm">Passwort</GlowButton>
                      </form>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#e89a7a]/10">
                      <div className="inline-flex items-center gap-2 text-xs text-[#b8aea5] mb-2">
                        <QrCode className="h-3.5 w-3.5 text-[#e89a7a]" />
                        <span>Login-Link erstellen:</span>
                      </div>
                      <LoginLinkClient userId={u.id} username={u.username} />
                    </div>

                    {/* Poll status */}
                    <div className="mt-4 pt-4 border-t border-[#e89a7a]/10">
                      <div className="inline-flex items-center gap-2 text-xs text-[#b8aea5] mb-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#8faf9d]" />
                        <span>Umfrage-Status:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${u.has_voted ? 'bg-[#8faf9d]/10 text-[#8faf9d]' : 'bg-[#d97757]/10 text-[#d97757]'}`}>
                          {u.has_voted ? 'Hat abgestimmt' : 'Nicht abgestimmt'}
                        </span>
                        <ResetPollClient userId={u.id} username={u.username} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right: Create + Ban */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard
              header={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#8faf9d]/10 text-[#8faf9d]">
                    <Users className="h-5 w-5"/>
                  </span>
                  <h3 className="text-lg font-semibold text-[#f5f1ed]">Nach Klassen</h3>
                </div>
              }
            >
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {groups.map((g) => (
                  <details key={g.label} className="rounded-xl border border-[#e89a7a]/10 bg-[#2a2520]/40 p-3 hover:border-[#e89a7a]/20 transition-all">
                    <summary className="cursor-pointer select-none text-sm text-[#f5f1ed] flex items-center justify-between font-medium">
                      <span>{g.label}</span>
                      <span className="text-xs text-[#b8aea5]">{g.items.length}</span>
                    </summary>
                    {g.items.length === 0 ? (
                      <div className="mt-2 text-xs text-[#b8aea5]">Keine Nutzer</div>
                    ) : (
                      <ul className="mt-3 space-y-2 text-sm">
                        {g.items.map((u) => (
                          <li key={u.id} className="flex items-center justify-between text-[#f5f1ed]">
                            <span>{u.username}</span>
                            <span className="text-xs text-[#b8aea5]">{u.role}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </details>
                ))}
              </div>
            </GlassCard>

            <GlassCard
              header={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e89a7a]/10 text-[#e89a7a]">
                    <UserPlus className="h-5 w-5"/>
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f1ed]">Benutzer anlegen</h3>
                    <p className="text-sm text-[#b8aea5]">Schnell einen Zugang erstellen.</p>
                  </div>
                </div>
              }
            >
              <form action={createUserAction} className="space-y-3">
                <input name="username" placeholder="Username" className="input-base" />
                <input name="password" placeholder="Passwort" type="password" className="input-base" />
                <select name="class" defaultValue="" className="input-base">
                  <option value="">Klasse (optional)</option>
                  {CLASSES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <GlowButton variant="gradient" className="w-full" iconLeft={<UserPlus className="h-4 w-4" />}>
                  Benutzer erstellen
                </GlowButton>
              </form>
            </GlassCard>

            <GlassCard
              header={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#d97757]/10 text-[#d97757]">
                    <Ban className="h-5 w-5"/>
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#f5f1ed]">Sperren</h3>
                    <p className="text-sm text-[#b8aea5]">User- und IP-Sperren verwalten.</p>
                  </div>
                </div>
              }
            >
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-semibold mb-3 text-[#f5f1ed]">Benutzer sperren</div>
                  <form action={banUserAction} className="space-y-3">
                    <input name="user_id" placeholder="User ID" className="input-base" />
                    <input name="reason" placeholder="Grund (optional)" className="input-base" />
                    <input name="expires_at" type="datetime-local" className="input-base" />
                    <GlowButton variant="primary" className="w-full">Sperren</GlowButton>
                  </form>
                  <form action={unbanUserAction} className="flex items-center gap-2 mt-3">
                    <input name="user_id" placeholder="User ID" className="input-base flex-1" />
                    <GlowButton variant="secondary" className="px-4">Entsperren</GlowButton>
                  </form>
                </div>
                <div className="pt-3 border-t border-[#e89a7a]/10">
                  <div className="text-sm font-semibold mb-3 text-[#f5f1ed]">IP sperren</div>
                  <form action={banIpAction} className="space-y-3">
                    <input name="ip" placeholder="IP-Adresse" className="input-base" />
                    <input name="reason" placeholder="Grund (optional)" className="input-base" />
                    <input name="expires_at" type="datetime-local" className="input-base" />
                    <GlowButton variant="primary" className="w-full">Sperren</GlowButton>
                  </form>
                  <form action={unbanIpAction} className="flex items-center gap-2 mt-3">
                    <input name="ip" placeholder="IP-Adresse" className="input-base flex-1" />
                    <GlowButton variant="secondary" className="px-4">Entsperren</GlowButton>
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
