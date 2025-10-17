import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { query } from "@/lib/db";
import { ensureModerationSchema } from "@/lib/migrations";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import {
  approveSubmissionAction,
  deleteSubmissionAction,
  restoreSubmissionAction,
  approveManySubmissionsAction,
  deleteManySubmissionsAction,
} from "./actions";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  User2,
  FileText,
  Users,
  Trash2,
  Clock,
  Shield,
  Activity,
} from "lucide-react";

export const dynamic = "force-dynamic";

type SubmissionRow = {
  id: number;
  user_id: number;
  text: string;
  category: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  status: "pending" | "approved" | "deleted";
  approved_by: number | null;
  approved_at: string | null;
  deleted_by: number | null;
  deleted_at: string | null;
  author: string;
  approver: string | null;
  deleter: string | null;
};

type AuditRow = {
  id: number;
  submission_id: number;
  action: "create" | "approve" | "delete" | "restore";
  actor_user_id: number;
  created_at: string;
  actor: string;
  preview: string;
};

type UserRow = { id: number; username: string; role: "user" | "moderator" | "admin" };

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "moderator" && session.role !== "admin") redirect("/zugriff-verweigert");
  const isAdmin = session.role === "admin";

  // Ensure schema is ready (adds status columns + audit table if missing)
  await ensureModerationSchema();

  const [stats] = (await query<
    { pending: number; approved: number; deleted: number; total: number }[]
  >(
    "SELECT SUM(status='pending') AS pending, SUM(status='approved') AS approved, SUM(status='deleted') AS deleted, COUNT(*) AS total FROM submissions"
  )) || [{ pending: 0, approved: 0, deleted: 0, total: 0 }];

  const sp = await searchParams;
  const q = typeof sp?.q === "string" ? sp.q.trim() : "";
  const category = typeof sp?.category === "string" ? sp.category.trim() : "";
  const wherePendingParts: string[] = ["s.status = 'pending'"];
  const pendingParams: string[] = [];
  if (category) { wherePendingParts.push("s.category = ?"); pendingParams.push(category); }
  if (q) {
    wherePendingParts.push("(s.text LIKE ? OR au.username LIKE ? OR COALESCE(s.name,'') LIKE ? OR COALESCE(s.phone,'') LIKE ?)");
    const like = `%${q}%`;
    pendingParams.push(like, like, like, like);
  }
  const pending = await query<SubmissionRow[]>(
    `SELECT s.*, au.username AS author,
            ap.username AS approver, de.username AS deleter
     FROM submissions s
     JOIN users au ON au.id = s.user_id
     LEFT JOIN users ap ON ap.id = s.approved_by
     LEFT JOIN users de ON de.id = s.deleted_by
     WHERE ${wherePendingParts.join(" AND ")}
     ORDER BY s.created_at DESC`,
    pendingParams
  );

  const approved = await query<SubmissionRow[]>(
    `SELECT s.*, au.username AS author,
            ap.username AS approver, de.username AS deleter
     FROM submissions s
     JOIN users au ON au.id = s.user_id
     LEFT JOIN users ap ON ap.id = s.approved_by
     LEFT JOIN users de ON de.id = s.deleted_by
     WHERE s.status = 'approved'
     ORDER BY s.approved_at DESC
     LIMIT 50`
  );

  const deleted = await query<SubmissionRow[]>(
    `SELECT s.*, au.username AS author,
            ap.username AS approver, de.username AS deleter
     FROM submissions s
     JOIN users au ON au.id = s.user_id
     LEFT JOIN users ap ON ap.id = s.approved_by
     LEFT JOIN users de ON de.id = s.deleted_by
     WHERE s.status = 'deleted'
     ORDER BY s.deleted_at DESC
     LIMIT 50`
  );

  const audit = await query<AuditRow[]>(
    `SELECT a.*, u.username AS actor, LEFT(s.text, 80) AS preview
     FROM submission_audit a
     JOIN users u ON u.id = a.actor_user_id
     JOIN submissions s ON s.id = a.submission_id
     ORDER BY a.created_at DESC
     LIMIT 60`
  );

  const users = await query<UserRow[]>(
    "SELECT id, username, role FROM users ORDER BY id DESC"
  );

  const categories = await query<{ category: string }[]>(
    "SELECT DISTINCT category FROM submissions ORDER BY category"
  );

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#faf8f5] via-[#faf4ed] to-[#f5ede3] dark:from-[#1a1714] dark:via-[#221e1a] dark:to-[#1a1714]">
      {/* Subtile Hintergrundeffekte */}
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#d97757]/8 dark:bg-[#e89a7a]/6 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[#7a9b88]/8 dark:bg-[#8faf9d]/6 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#7a9b88]/10 dark:bg-[#8faf9d]/10 border border-[#7a9b88]/20 dark:border-[#8faf9d]/20">
            <Shield className="h-4 w-4 text-[#7a9b88] dark:text-[#8faf9d]" />
            <span className="text-xs font-medium tracking-wide uppercase text-[#7a9b88] dark:text-[#8faf9d]">
              Admin-Bereich
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2a2520] dark:text-[#f5f1ed] mb-4">
            Dashboard
          </h1>
          <p className="text-lg text-[#6b635a] dark:text-[#b8aea5] max-w-2xl mx-auto">
            Moderiere Einsendungen, verwalte Accounts und behalte den Überblick.
          </p>
        </div>

        {/* Statistiken */}
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { label: "Gesamt", value: stats?.total || 0, icon: <Users className="h-5 w-5" />, color: "from-[#d97757] to-[#c96846]" },
            { label: "Ausstehend", value: stats?.pending || 0, icon: <Clock className="h-5 w-5" />, color: "from-[#b8957a] to-[#a88568]" },
            { label: "Genehmigt", value: stats?.approved || 0, icon: <CheckCircle2 className="h-5 w-5" />, color: "from-[#7a9b88] to-[#6a8b78]" },
            { label: "Gelöscht", value: stats?.deleted || 0, icon: <Trash2 className="h-5 w-5" />, color: "from-[#c96846] to-[#b85836]" },
          ].map((s, i) => (
            <GlassCard key={s.label} delay={i * 0.06}>
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg`}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-sm text-[#6b635a] dark:text-[#b8aea5]">{s.label}</div>
                  <div className="text-2xl font-bold text-[#2a2520] dark:text-[#f5f1ed]">{s.value}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Moderationsliste */}
          <div className="lg:col-span-2 space-y-8">
            <GlassCard
              header={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#d97757]/10 dark:bg-[#e89a7a]/10 text-[#d97757] dark:text-[#e89a7a]">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2a2520] dark:text-[#f5f1ed]">Ausstehende Einsendungen</h3>
                    <p className="text-sm text-[#6b635a] dark:text-[#b8aea5]">Prüfen, genehmigen oder löschen.</p>
                  </div>
                </div>
              }
            >
              {/* Filter */}
              <form method="GET" className="mb-6 flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Suche Text/Autor/Name"
                  className="input-base flex-1 min-w-[200px]"
                />
                <select
                  name="category"
                  defaultValue={category}
                  className="input-base min-w-[160px]"
                >
                  <option value="">Alle Kategorien</option>
                  {categories.map((c) => (
                    <option key={c.category} value={c.category}>{c.category}</option>
                  ))}
                </select>
                <GlowButton variant="primary" className="px-5">Filtern</GlowButton>
                <a href="/admin" className="text-sm text-[#d97757] dark:text-[#e89a7a] hover:underline">Zurücksetzen</a>
              </form>

              {pending.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7a9b88]/10 dark:bg-[#8faf9d]/10 text-[#7a9b88] dark:text-[#8faf9d] mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <p className="text-sm text-[#6b635a] dark:text-[#b8aea5]">Keine ausstehenden Einsendungen. Alles erledigt! ✨</p>
                </div>
              ) : (
                <form>
                  <div className="mb-4 flex items-center justify-end gap-3">
                    <GlowButton
                      formAction={approveManySubmissionsAction}
                      variant="primary"
                      className="px-4 py-2 text-sm"
                      iconLeft={<CheckCircle2 className="h-4 w-4" />}
                    >
                      Auswahl genehmigen
                    </GlowButton>
                    <GlowButton
                      formAction={deleteManySubmissionsAction}
                      variant="secondary"
                      className="px-4 py-2 text-sm"
                      iconLeft={<XCircle className="h-4 w-4" />}
                    >
                      Auswahl löschen
                    </GlowButton>
                  </div>
                  <div className="space-y-4">
                    {pending.map((p) => (
                      <div key={p.id} className="rounded-2xl border border-[#d97757]/15 dark:border-[#e89a7a]/15 bg-white/80 dark:bg-[#2a2520]/80 p-5 hover:border-[#d97757]/25 dark:hover:border-[#e89a7a]/25 transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <input
                              type="checkbox"
                              name="ids"
                              value={p.id}
                              className="mt-1.5 h-5 w-5 rounded border-[#d97757]/30 dark:border-[#e89a7a]/30 text-[#d97757] dark:text-[#e89a7a] focus:ring-[#d97757]/50"
                            />
                            <div className="flex-1">
                              <div className="text-xs text-[#6b635a] dark:text-[#b8aea5] flex flex-wrap items-center gap-2 mb-3">
                                <span className="inline-flex items-center gap-1.5">
                                  <User2 className="h-3.5 w-3.5 text-[#7a9b88] dark:text-[#8faf9d]" />
                                  <strong className="text-[#2a2520] dark:text-[#f5f1ed]">{p.author}</strong>
                                </span>
                                <span>•</span>
                                <span>{new Date(p.created_at).toLocaleString("de-DE")}</span>
                                <span>•</span>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#d97757]/10 dark:bg-[#e89a7a]/10 text-[#d97757] dark:text-[#e89a7a] text-xs font-medium border border-[#d97757]/20 dark:border-[#e89a7a]/20">
                                  {p.category}
                                </span>
                              </div>
                              <div className="text-sm text-[#2a2520] dark:text-[#f5f1ed] leading-relaxed whitespace-pre-wrap">
                                {p.text}
                              </div>
                              {(p.name || p.phone) && (
                                <div className="mt-3 pt-3 border-t border-[#d97757]/10 dark:border-[#e89a7a]/10 text-xs text-[#6b635a] dark:text-[#b8aea5]">
                                  {[p.name, p.phone].filter(Boolean).join(" · ")}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="shrink-0 flex flex-col gap-2">
                            <form action={approveSubmissionAction}>
                              <input type="hidden" name="id" value={p.id} />
                              <GlowButton
                                variant="primary"
                                className="px-4 py-2 text-sm whitespace-nowrap"
                                iconLeft={<CheckCircle2 className="h-4 w-4" />}
                              >
                                Genehmigen
                              </GlowButton>
                            </form>
                            <form action={deleteSubmissionAction}>
                              <input type="hidden" name="id" value={p.id} />
                              <GlowButton
                                variant="secondary"
                                className="px-4 py-2 text-sm whitespace-nowrap"
                                iconLeft={<XCircle className="h-4 w-4" />}
                              >
                                Löschen
                              </GlowButton>
                            </form>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </form>
              )}
            </GlassCard>

            <GlassCard
              header={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a9b88]/10 dark:bg-[#8faf9d]/10 text-[#7a9b88] dark:text-[#8faf9d]">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-[#2a2520] dark:text-[#f5f1ed]">Genehmigt (zuletzt 50)</h3>
                </div>
              }
            >
              {approved.length === 0 ? (
                <p className="text-sm text-[#6b635a] dark:text-[#b8aea5]">Noch nichts genehmigt.</p>
              ) : (
                <div className="space-y-3">
                  {approved.map((a) => (
                    <div key={a.id} className="flex items-start justify-between gap-4 rounded-xl border border-[#7a9b88]/15 dark:border-[#8faf9d]/15 bg-[#7a9b88]/5 dark:bg-[#8faf9d]/5 p-4 hover:border-[#7a9b88]/25 dark:hover:border-[#8faf9d]/25 transition-all">
                      <div className="flex-1">
                        <div className="text-xs text-[#6b635a] dark:text-[#b8aea5] mb-2">
                          Von <strong>{a.author}</strong> • {a.category} • genehmigt von <strong>{a.approver || "—"}</strong> am {a.approved_at ? new Date(a.approved_at).toLocaleString("de-DE") : "—"}
                        </div>
                        <div className="text-sm text-[#2a2520] dark:text-[#f5f1ed] line-clamp-3 whitespace-pre-wrap">{a.text}</div>
                      </div>
                      <form action={deleteSubmissionAction}>
                        <input type="hidden" name="id" value={a.id} />
                        <GlowButton
                          variant="secondary"
                          className="px-3 py-2 text-sm"
                          iconLeft={<Trash2 className="h-4 w-4" />}
                        >
                          Löschen
                        </GlowButton>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            <GlassCard
              header={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#c96846]/10 dark:bg-[#d97757]/10 text-[#c96846] dark:text-[#d97757]">
                    <Trash2 className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-[#2a2520] dark:text-[#f5f1ed]">Gelöscht (zuletzt 50)</h3>
                </div>
              }
            >
              {deleted.length === 0 ? (
                <p className="text-sm text-[#6b635a] dark:text-[#b8aea5]">Keine gelöschten Beiträge.</p>
              ) : (
                <div className="space-y-3">
                  {deleted.map((d) => (
                    <div key={d.id} className="flex items-start justify-between gap-4 rounded-xl border border-[#c96846]/15 dark:border-[#d97757]/15 bg-[#c96846]/5 dark:bg-[#d97757]/5 p-4 hover:border-[#c96846]/25 dark:hover:border-[#d97757]/25 transition-all">
                      <div className="flex-1">
                        <div className="text-xs text-[#6b635a] dark:text-[#b8aea5] mb-2">
                          Von <strong>{d.author}</strong> • {d.category} • gelöscht von <strong>{d.deleter || "—"}</strong> am {d.deleted_at ? new Date(d.deleted_at).toLocaleString("de-DE") : "—"}
                        </div>
                        <div className="text-sm text-[#2a2520] dark:text-[#f5f1ed] line-clamp-3 whitespace-pre-wrap opacity-75">{d.text}</div>
                      </div>
                      <form action={restoreSubmissionAction}>
                        <input type="hidden" name="id" value={d.id} />
                        <GlowButton
                          variant="primary"
                          className="px-3 py-2 text-sm"
                          iconLeft={<RotateCcw className="h-4 w-4" />}
                        >
                          Wiederherstellen
                        </GlowButton>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <GlassCard
              header={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#7a9b88]/10 dark:bg-[#8faf9d]/10 text-[#7a9b88] dark:text-[#8faf9d]">
                    <Shield className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-[#2a2520] dark:text-[#f5f1ed]">Schnellzugriff</h3>
                </div>
              }
            >
              <div className="space-y-3">
                <GlowButton
                  as="a"
                  href="/"
                  variant="secondary"
                  className="w-full justify-start"
                >
                  Zur Startseite
                </GlowButton>
                <GlowButton
                  as="a"
                  href="/phase-1"
                  variant="secondary"
                  className="w-full justify-start"
                >
                  Beitrag einreichen
                </GlowButton>
                {isAdmin && (
                  <GlowButton
                    as="a"
                    href="/admin/user"
                    variant="primary"
                    className="w-full justify-start"
                    iconLeft={<Users className="h-4 w-4" />}
                  >
                    Benutzerverwaltung
                  </GlowButton>
                )}
              </div>
            </GlassCard>

            <GlassCard
              header={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#d97757]/10 dark:bg-[#e89a7a]/10 text-[#d97757] dark:text-[#e89a7a]">
                    <Activity className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-[#2a2520] dark:text-[#f5f1ed]">Aktivitätsprotokoll</h3>
                </div>
              }
            >
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {audit.slice(0, 20).map((log) => (
                  <div key={log.id} className="text-xs">
                    <div className="flex items-center gap-2 text-[#6b635a] dark:text-[#b8aea5]">
                      <span className={`inline-flex h-2 w-2 rounded-full ${
                        log.action === 'create' ? 'bg-[#7a9b88]' :
                        log.action === 'approve' ? 'bg-[#7a9b88]' :
                        log.action === 'delete' ? 'bg-[#c96846]' :
                        'bg-[#d97757]'
                      }`} />
                      <strong className="text-[#2a2520] dark:text-[#f5f1ed]">{log.actor}</strong>
                      <span>•</span>
                      <span>{log.action === 'create' ? 'erstellt' : log.action === 'approve' ? 'genehmigt' : log.action === 'delete' ? 'gelöscht' : 'wiederhergestellt'}</span>
                    </div>
                    <div className="mt-1 text-[#6b635a] dark:text-[#b8aea5] line-clamp-2 pl-4">
                      {log.preview}...
                    </div>
                    <div className="text-[#6b635a] dark:text-[#b8aea5] opacity-60 pl-4 mt-0.5">
                      {new Date(log.created_at).toLocaleString("de-DE")}
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
