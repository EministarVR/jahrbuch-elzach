import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession, setSession } from "@/lib/session";
import GlassCard from "@/components/ui/GlassCard";
import FancyHeading from "@/components/ui/FancyHeading";
import MotionFade from "@/components/ui/MotionFade";
import TiltCard from "@/components/ui/TiltCard";
import { Sparkles, Lock, Info, Shield } from "lucide-react";
import LoginClient from "./LoginClient";
import { findUserByUsername, verifyPassword } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[]>>;
}) {
  const session = await getSession();
  if (session) redirect(session.role === "user" ? "/phase-1" : "/admin");

  // Login via link: /login?user=NAME&pass=PASSWORD or user=NAME,pass=PASSWORD
  const sp = searchParams ? await searchParams : undefined;
  let userParam = sp?.user as string | undefined;
  let passParam = (sp?.pass as string | undefined) || (sp?.password as string | undefined);

  if (userParam && !passParam && userParam.includes(",pass=")) {
    const [u, p] = userParam.split(",pass=");
    userParam = u;
    passParam = p;
  }

  if (userParam && passParam) {
    try {
      const user = await findUserByUsername(userParam);
      if (user) {
        const userBanRows = await query<{ c: number }[]>(
          "SELECT COUNT(*) AS c FROM banned_users WHERE user_id = ? AND (expires_at IS NULL OR expires_at > NOW())",
          [user.id]
        );
        if ((userBanRows[0]?.c ?? 0) === 0) {
          const ok = await verifyPassword(passParam, user.password_hash);
          if (ok) {
            await setSession(user.id, user.role);
            redirect(user.role === "user" ? "/phase-1" : "/admin");
          }
        }
      }
    } catch {
      // ignore and show normal login UI
    }
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-indigo-50/70 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Ambient background gradients */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-indigo-400/25 via-indigo-500/15 to-sky-400/25 blur-3xl opacity-70 dark:opacity-40" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-sky-400/30 via-indigo-400/20 to-fuchsia-400/25 blur-3xl opacity-75 dark:opacity-40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[80%] bg-gradient-to-t from-indigo-100/70 via-transparent to-transparent dark:from-indigo-900/30" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <FancyHeading
          center
          subtitle="Melde dich an und reiche deine Inhalte für das Jahrbuch ein. Sicher, schnell und unkompliziert."
        >
          Login
        </FancyHeading>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Formular */}
          <div className="lg:col-span-2">
            <GlassCard
              header={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20">
                    <Lock className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-base-strong">
                      Anmeldung
                    </h3>
                    <p className="text-sm text-base-muted">
                      Gib deinen Username und dein Passwort ein.
                    </p>
                  </div>
                </div>
              }
              footer={
                <div className="flex items-center justify-between flex-wrap gap-3 text-sm text-base-muted">
                  <div className="inline-flex items-center gap-2">
                    <Shield className="h-4 w-4 text-indigo-600" />
                    <span>Deine Sitzung ist geschützt.</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    <span>Willkommen zurück!</span>
                  </div>
                </div>
              }
            >
              {/* Login-Formular */}
              <LoginClient />
              <div className="px-8 pb-7 pt-1">
                <p className="text-center text-xs text-base-muted">
                  Zurück zur{" "}
                  <Link
                    href="/"
                    className="font-medium text-indigo-600 dark:text-indigo-300 hover:text-indigo-500 dark:hover:text-indigo-200 transition"
                  >
                    Startseite
                  </Link>
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Hinweise */}
          <div className="lg:col-span-1">
            <TiltCard>
              <GlassCard
                className="bg-[linear-gradient(180deg,rgba(99,102,241,0.08),rgba(99,102,241,0.02))]"
                header={
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20">
                      <Info className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-base-strong">
                      Hinweise
                    </h3>
                  </div>
                }
                hover
              >
                <ul className="space-y-3 text-sm text-base-muted">
                  <li className="flex gap-3">
                    <span className="mt-0.5 text-indigo-600">•</span>
                    Zugangsdaten bekommst du vom Jahrbuch-Team.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 text-indigo-600">•</span>
                    Probleme beim Login? Wende dich an die SMV.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 text-indigo-600">•</span>
                    Nach dem Login kannst du sofort Inhalte einreichen.
                  </li>
                </ul>

                <MotionFade delay={0.08} className="mt-6">
                  <div className="rounded-2xl p-4 bg-white/60 dark:bg-slate-800/60 ring-1 ring-black/5 dark:ring-white/10">
                    <p className="text-sm text-base-strong mb-1">Datenschutz</p>
                    <p className="text-sm text-base-muted">
                      Deine Daten werden nur für die Authentifizierung genutzt und
                      nicht weitergegeben.
                    </p>
                  </div>
                </MotionFade>
              </GlassCard>
            </TiltCard>
          </div>
        </div>
      </div>
    </div>
  );
}
