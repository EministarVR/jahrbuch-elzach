import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession, setSession } from "@/lib/session";
import GlassCard from "@/components/ui/GlassCard";
import MotionFade from "@/components/ui/MotionFade";
import TiltCard from "@/components/ui/TiltCard";
import { BookOpen, Lock, Info, Shield } from "lucide-react";
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
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#faf8f5] via-[#faf4ed] to-[#f5ede3] dark:from-[#1a1714] dark:via-[#221e1a] dark:to-[#1a1714]">
      {/* Subtile Hintergrundeffekte */}
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#d97757]/8 dark:bg-[#e89a7a]/6 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[#7a9b88]/8 dark:bg-[#8faf9d]/6 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#d97757]/10 dark:bg-[#e89a7a]/10 border border-[#d97757]/20 dark:border-[#e89a7a]/20">
            <BookOpen className="h-4 w-4 text-[#d97757] dark:text-[#e89a7a]" />
            <span className="text-xs font-medium tracking-wide uppercase text-[#d97757] dark:text-[#e89a7a]">
              Jahrbuch-Login
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2a2520] dark:text-[#f5f1ed] mb-4">
            Willkommen zurück
          </h1>
          <p className="text-lg text-[#6b635a] dark:text-[#b8aea5] max-w-2xl mx-auto">
            Melde dich an und reiche deine Inhalte für das Jahrbuch ein. Sicher, schnell und unkompliziert.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Formular */}
          <div className="lg:col-span-2">
            <GlassCard
              header={
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#d97757]/10 dark:bg-[#e89a7a]/10 text-[#d97757] dark:text-[#e89a7a]">
                    <Lock className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-[#2a2520] dark:text-[#f5f1ed]">
                      Anmeldung
                    </h3>
                    <p className="text-sm text-[#6b635a] dark:text-[#b8aea5]">
                      Gib deinen Username und dein Passwort ein.
                    </p>
                  </div>
                </div>
              }
              footer={
                <div className="flex items-center justify-between flex-wrap gap-3 text-sm text-[#6b635a] dark:text-[#b8aea5]">
                  <div className="inline-flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[#7a9b88] dark:text-[#8faf9d]" />
                    <span>Deine Sitzung ist geschützt.</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#d97757] dark:text-[#e89a7a]" />
                    <span>Willkommen zurück!</span>
                  </div>
                </div>
              }
            >
              {/* Login-Formular */}
              <LoginClient />
            </GlassCard>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <TiltCard>
              <GlassCard hover>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#7a9b88]/10 dark:bg-[#8faf9d]/10 flex items-center justify-center">
                      <Info className="h-5 w-5 text-[#7a9b88] dark:text-[#8faf9d]" />
                    </div>
                    <h3 className="font-semibold text-[#2a2520] dark:text-[#f5f1ed]">Hinweise</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-[#6b635a] dark:text-[#b8aea5]">
                    <li className="flex gap-2">
                      <span className="text-[#d97757] dark:text-[#e89a7a]">•</span>
                      <span>Username ist dein Schullogin (z.B. vorname.nachname)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#d97757] dark:text-[#e89a7a]">•</span>
                      <span>Das Passwort wurde dir vom Admin-Team zugewiesen</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#d97757] dark:text-[#e89a7a]">•</span>
                      <span>Bei Problemen wende dich an die SMV</span>
                    </li>
                  </ul>
                </div>
              </GlassCard>
            </TiltCard>

            <MotionFade delay={0.1}>
              <GlassCard hover>
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#2a2520] dark:text-[#f5f1ed]">Datenschutz</h3>
                  <p className="text-sm text-[#6b635a] dark:text-[#b8aea5]">
                    Deine Daten sind sicher. Wir verwenden keine Tracking-Cookies.
                  </p>
                  <Link
                    href="/datenschutz"
                    className="inline-flex items-center gap-1 text-sm text-[#d97757] dark:text-[#e89a7a] hover:underline"
                  >
                    Mehr erfahren →
                  </Link>
                </div>
              </GlassCard>
            </MotionFade>
          </div>
        </div>
      </div>
    </div>
  );
}
