import Link from "next/link";
import { getSession, clearSession } from "@/lib/session";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import GlowButton from "@/components/ui/GlowButton";
import { LogOut, Menu, Home, Send, Shield, BookOpen } from "lucide-react";

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
    <header className="fixed top-6 left-6 right-6 md:left-auto md:right-6 z-50">
      {/* Desktop header */}
      <div className="hidden md:flex justify-end">
        <div className="flex items-center gap-4 backdrop-blur-xl bg-[#fffcf8]/95 dark:bg-[#2a2520]/95 rounded-2xl pl-6 pr-3 py-3 shadow-lg border border-[#d97757]/10 dark:border-[#e89a7a]/10">
          <span className="inline-flex items-center gap-3 text-sm text-[#6b635a] dark:text-[#b8aea5]">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#d97757] to-[#c96846] text-white shadow-md">
              <BookOpen className="h-4 w-4" />
            </div>
            <span>
              Willkommen,{" "}
              <span className="font-semibold text-[#2a2520] dark:text-[#f5f1ed]">{username}</span>
            </span>
          </span>
          <form action={logout}>
            <GlowButton
              variant="ghost"
              className="text-sm px-4 py-2 hover:bg-[#faf4ed] dark:hover:bg-[#38302b] rounded-xl transition-all"
              iconLeft={<LogOut className="h-4 w-4" />}
            >
              Abmelden
            </GlowButton>
          </form>
        </div>
      </div>

      {/* Mobile header with hamburger menu */}
      <div className="md:hidden">
        <div className="flex items-center justify-between backdrop-blur-xl bg-[#fffcf8]/95 dark:bg-[#2a2520]/95 rounded-2xl px-5 py-3 shadow-lg border border-[#d97757]/10 dark:border-[#e89a7a]/10">
          <span className="inline-flex items-center gap-2.5 text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#d97757] to-[#c96846] text-white shadow-md">
              <BookOpen className="h-4 w-4" />
            </div>
            <span className="font-medium text-[#2a2520] dark:text-[#f5f1ed]">{username}</span>
          </span>

          <details className="relative">
            <summary className="list-none cursor-pointer p-2 rounded-lg hover:bg-[#faf4ed] dark:hover:bg-[#38302b] transition-colors">
              <Menu className="h-5 w-5 text-[#6b635a] dark:text-[#b8aea5]" />
            </summary>

            <div className="absolute right-0 top-12 min-w-48 backdrop-blur-xl bg-[#fffcf8]/98 dark:bg-[#2a2520]/98 rounded-2xl shadow-xl border border-[#d97757]/10 dark:border-[#e89a7a]/10 overflow-hidden">
              <div className="py-2">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-[#6b635a] dark:text-[#b8aea5] hover:bg-[#faf4ed] dark:hover:bg-[#38302b] hover:text-[#d97757] dark:hover:text-[#e89a7a] transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Startseite
                </Link>
                <Link
                  href="/phase-1"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-[#6b635a] dark:text-[#b8aea5] hover:bg-[#faf4ed] dark:hover:bg-[#38302b] hover:text-[#d97757] dark:hover:text-[#e89a7a] transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Beitrag einreichen
                </Link>
                {canModerate && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#6b635a] dark:text-[#b8aea5] hover:bg-[#faf4ed] dark:hover:bg-[#38302b] hover:text-[#d97757] dark:hover:text-[#e89a7a] transition-colors"
                  >
                    <Shield className="h-4 w-4" />
                    Admin-Bereich
                  </Link>
                )}
                <div className="border-t border-[#d97757]/10 dark:border-[#e89a7a]/10 my-2" />
                <form action={logout} className="w-full">
                  <button
                    type="submit"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-[#6b635a] dark:text-[#b8aea5] hover:bg-[#faf4ed] dark:hover:bg-[#38302b] hover:text-[#c96846] transition-colors w-full text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Abmelden
                  </button>
                </form>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
