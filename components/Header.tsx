import Link from "next/link";
import { getSession, clearSession } from "@/lib/session";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import GlowButton from "@/components/ui/GlowButton";
import { LogOut, User2, Menu, Home, Send, Shield } from "lucide-react";

async function logout() {
  "use server";
  await clearSession();
  redirect("/");
}

export default async function Header() {
  const session = await getSession();
  if (!session) return null;

  // Get the actual username
  const users = await query<{ username: string }[]>(
    "SELECT username FROM users WHERE id = ? LIMIT 1",
    [session.userId]
  );
  const username = users[0]?.username || "User";
  const canModerate = session.role === "admin" || session.role === "moderator";

  return (
    <header className="fixed top-4 left-4 right-4 md:left-auto md:right-4 z-50">
      {/* Desktop header */}
      <div className="hidden md:flex justify-end">
        <div className="flex items-center gap-3 backdrop-blur-md bg-white/80 dark:bg-slate-900/70 rounded-2xl pl-4 pr-2 py-2 shadow/10 ring-1 ring-black/10 dark:ring-white/15">
          <span className="inline-flex items-center gap-2 text-sm text-base-muted dark:text-slate-200">
            <User2 className="h-4 w-4 text-indigo-600" />
            <span>
              Hallo,{" "}
              <span className="font-medium text-base-strong dark:text-white">{username}</span>!
            </span>
          </span>
          <form action={logout}>
            <GlowButton
              variant="ghost"
              className="text-sm px-3 py-2"
              iconLeft={<LogOut className="h-4 w-4" />}
            >
              Logout
            </GlowButton>
          </form>
        </div>
      </div>

      {/* Mobile header with hamburger menu */}
      <div className="md:hidden">
        <details className="relative">
          <summary className="list-none cursor-pointer">
            <div className="flex items-center justify-between rounded-2xl px-3 py-2 ring-1 ring-slate-700/90 shadow-[0_4px_14px_-6px_rgba(0,0,0,0.45)] bg-slate-900 bg-[linear-gradient(145deg,rgba(28,36,52,0.95),rgba(20,27,39,0.9))]">
              <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                <User2 className="h-4 w-4 text-indigo-300" />
                <span className="font-medium text-white">{username}</span>
              </span>
              <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-indigo-900/60 text-indigo-300 ring-1 ring-indigo-800/80">
                <Menu className="h-5 w-5" />
              </span>
            </div>
          </summary>
          <div className="absolute left-0 right-0 mt-2 rounded-2xl ring-1 ring-slate-700/90 shadow-xl p-3 bg-slate-900 bg-[linear-gradient(145deg,rgba(28,36,52,0.96),rgba(20,27,39,0.92))]">
            <div className="grid gap-2">
              <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 text-sm text-slate-200">
                <Home className="h-4 w-4 text-indigo-300" /> Startseite
              </Link>
              <Link href="/phase-1" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 text-sm text-slate-200">
                <Send className="h-4 w-4 text-indigo-300" /> Einsenden
              </Link>
              {canModerate && (
                <Link href="/admin" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-800 text-sm text-slate-200">
                  <Shield className="h-4 w-4 text-indigo-300" /> Admin
                </Link>
              )}
              <form action={logout} className="pt-1">
                <GlowButton variant="secondary" className="w-full justify-center" iconLeft={<LogOut className="h-4 w-4" />}>
                  Logout
                </GlowButton>
              </form>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
