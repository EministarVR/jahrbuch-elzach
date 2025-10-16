import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { query } from "@/lib/db";
import { ensureModerationSchema } from "@/lib/migrations";
import FancyHeading from "@/components/ui/FancyHeading";
import GlassCard from "@/components/ui/GlassCard";
import GlowButton from "@/components/ui/GlowButton";
import TiltCard from "@/components/ui/TiltCard";
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
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-indigo-50 to-white md:from-indigo-50/70 dark:from-slate-950 dark:to-slate-900">
      {/* Ambient background gradients */}
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-indigo-400/25 via-indigo-500/15 to-sky-400/25 blur-3xl opacity-70 dark:opacity-40" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-sky-400/30 via-indigo-400/20 to-fuchsia-400/25 blur-3xl opacity-75 dark:opacity-40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[80%] bg-gradient-to-t from-indigo-100/70 via-transparent to-transparent dark:from-indigo-900/30" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <FancyHeading center subtitle="Moderiere Einsendungen, verwalte Accounts und behalte den Überblick.">
          Admin-Dashboard
        </FancyHeading>

        {/* Statistiken */}
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { label: "Gesamt", value: stats?.total || 0, icon: <Users className="h-5 w-5" /> },
            { label: "Ausstehend", value: stats?.pending || 0, icon: <Clock className="h-5 w-5" /> },
            { label: "Genehmigt", value: stats?.approved || 0, icon: <CheckCircle2 className="h-5 w-5" /> },
            { label: "Gelöscht", value: stats?.deleted || 0, icon: <Trash2 className="h-5 w-5" /> },
          ].map((s, i) => (
            <GlassCard key={s.label} delay={i * 0.06}>
              <div className="flex items-center gap-4">
                <div className="h-11 w-11 rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/30 flex items-center justify-center">
                  {s.icon}
                </div>
                <div>
                  <div className="text-sm text-base-muted">{s.label}</div>
                  <div className="text-xl font-semibold text-base-strong">{s.value}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Moderationsliste */}
          <div className="lg:col-span-2 space-y-8">
            <TiltCard>
              <GlassCard
                header={
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20">
                      <FileText className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-base-strong">Ausstehende Einsendungen</h3>
                      <p className="text-sm text-base-muted">Prüfen, genehmigen oder löschen.</p>
                    </div>
                  </div>
                }
              >
                {/* Filter */}
                <form method="GET" className="mb-4 flex flex-wrap items-center gap-2">
                  <input type="text" name="q" defaultValue={q} placeholder="Suche Text/Autor/Name" className="px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10 text-sm" />
                  <select name="category" defaultValue={category} className="px-3 py-2 rounded-xl bg-white/70 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10 text-sm">
                    <option value="">Alle Kategorien</option>
                    {categories.map((c) => (
                      <option key={c.category} value={c.category}>{c.category}</option>
                    ))}
                  </select>
                  <GlowButton variant="primary" className="h-[38px] px-4">Filtern</GlowButton>
                  <a href="/admin" className="text-sm text-indigo-600 hover:underline ml-1">Zurücksetzen</a>
                </form>
                {pending.length === 0 ? (
                  <p className="text-sm text-base-muted">Keine ausstehenden Einsendungen.</p>
                ) : (
                  <form>
                    <div className="mb-3 flex items-center justify-end gap-2">
                      <GlowButton formAction={approveManySubmissionsAction} variant="primary" className="px-3 py-2 text-sm" iconLeft={<CheckCircle2 className="h-4 w-4" />}>Auswahl genehmigen</GlowButton>
                      <GlowButton formAction={deleteManySubmissionsAction} variant="secondary" className="px-3 py-2 text-sm" iconLeft={<XCircle className="h-4 w-4" />}>Auswahl löschen</GlowButton>
                    </div>
                    <div className="space-y-4">
                      {pending.map((p) => (
                        <div key={p.id} className="rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 md:ring-black/5 md:dark:ring-white/10 md:bg-white/60 md:dark:bg-slate-800/60 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3">
                              <input type="checkbox" name="ids" value={p.id} className="mt-1 h-4 w-4" />
                              <div>
                                <div className="text-sm text-base-muted flex items-center gap-2">
                                  <User2 className="h-4 w-4 text-indigo-600" />
                                  <span>{p.author}</span>
                                  <span className="opacity-60">•</span>
                                  <span>{new Date(p.created_at).toLocaleString("de-DE")}</span>
                                  <span className="opacity-60">•</span>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-500/20">
                                    {p.category}
                                  </span>
                                </div>
                                <div className="mt-2 text-sm text-base-strong whitespace-pre-wrap">
                                  {p.text}
                                </div>
                                {(p.name || p.phone) && (
                                  <div className="mt-2 text-xs text-base-muted">{[p.name, p.phone].filter(Boolean).join(" · ")}</div>
                                )}
                              </div>
                            </div>
                            <div className="shrink-0 flex flex-col gap-2">
                              <form action={approveSubmissionAction}>
                                <input type="hidden" name="id" value={p.id} />
                                <GlowButton variant="primary" className="px-3 py-2 text-sm" iconLeft={<CheckCircle2 className="h-4 w-4" />}>Genehmigen</GlowButton>
                              </form>
                              <form action={deleteSubmissionAction}>
                                <input type="hidden" name="id" value={p.id} />
                                <GlowButton variant="secondary" className="px-3 py-2 text-sm" iconLeft={<XCircle className="h-4 w-4" />}>Löschen</GlowButton>
                              </form>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    </form>
                )}
              </GlassCard>
            </TiltCard>

            <GlassCard
              header={<div className="text-lg font-semibold text-base-strong">Genehmigt (zuletzt)</div>}
            >
              {approved.length === 0 ? (
                <p className="text-sm text-base-muted">Noch nichts genehmigt.</p>
              ) : (
                <div className="space-y-3">
                  {approved.map((a) => (
                    <div key={a.id} className="flex items-start justify-between gap-4 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 md:ring-black/5 md:dark:ring-white/10 md:bg-white/60 md:dark:bg-slate-800/60 p-4">
                      <div>
                        <div className="text-xs text-base-muted">
                          Von {a.author} • {a.category} • genehmigt von {a.approver || "—"} am {a.approved_at ? new Date(a.approved_at).toLocaleString("de-DE") : "—"}
                        </div>
                        <div className="mt-1 text-sm text-base-strong line-clamp-3 whitespace-pre-wrap">{a.text}</div>
                      </div>
                      <form action={deleteSubmissionAction}>
                        <input type="hidden" name="id" value={a.id} />
                        <GlowButton variant="secondary" className="px-3 py-2 text-sm" iconLeft={<Trash2 className="h-4 w-4" />}>Löschen</GlowButton>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            <GlassCard
              header={<div className="text-lg font-semibold text-base-strong">Gelöscht (zuletzt)</div>}
            >
              {deleted.length === 0 ? (
                <p className="text-sm text-base-muted">Keine gelöschten Beiträge.</p>
              ) : (
                <div className="space-y-3">
                  {deleted.map((d) => (
                    <div key={d.id} className="flex items-start justify-between gap-4 rounded-2xl ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 md:ring-black/5 md:dark:ring-white/10 md:bg-white/60 md:dark:bg-slate-800/60 p-4">
                      <div>
                        <div className="text-xs text-base-muted">
                          Von {d.author} • {d.category} • gelöscht von {d.deleter || "—"} am {d.deleted_at ? new Date(d.deleted_at).toLocaleString("de-DE") : "—"}
                        </div>
                        <div className="mt-1 text-sm text-base-strong line-clamp-3 whitespace-pre-wrap">{d.text}</div>
                      </div>
                      <form action={restoreSubmissionAction}>
                        <input type="hidden" name="id" value={d.id} />
                        <GlowButton variant="primary" className="px-3 py-2 text-sm" iconLeft={<RotateCcw className="h-4 w-4" />}>Wiederherstellen</GlowButton>
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Audit + Benutzer */}
          <div className="lg:col-span-1 space-y-8">
            <TiltCard>
              <GlassCard
                header={<div className="text-lg font-semibold text-base-strong">Aktivität</div>}
              >
                {audit.length === 0 ? (
                  <p className="text-sm text-base-muted">Noch keine Aktivitäten.</p>
                ) : (
                  <div className="space-y-3">
                    {audit.map((e) => (
                      <div key={e.id} className="rounded-xl p-3 ring-1 ring-slate-200 dark:ring-slate-700 bg-white dark:bg-slate-800 md:ring-black/5 md:dark:ring-white/10 md:bg-white/60 md:dark:bg-slate-800/60">
                        <div className="text-xs text-base-muted flex items-center justify-between gap-2">
                          <span>
                            <span className="font-medium text-base-strong">{e.actor}</span> – {e.action}
                          </span>
                          <span>{new Date(e.created_at).toLocaleString("de-DE")}</span>
                        </div>
                        <div className="mt-1 text-xs text-base-strong line-clamp-2">{e.preview}</div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </TiltCard>


          </div>
        </div>
      </div>
    </div>
  );
}
