import { getSession, clearSession } from "@/lib/session";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import GlowButton from "@/components/ui/GlowButton";
import { LogOut, User2 } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";

export const dynamic = "force-dynamic";

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

  return (
    <header className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-3 backdrop-blur-md bg-white/70 dark:bg-slate-900/60 rounded-2xl pl-4 pr-2 py-2 shadow/10 ring-1 ring-black/5">
        <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-base-muted dark:text-slate-200">
          <User2 className="h-4 w-4 text-indigo-600" />
          <span>
            Hallo,{" "}
            <span className="font-medium text-base-strong dark:text-white">
              {username}
            </span>
            !
          </span>
        </span>
        <form action={logout}>
          <GlowButton
            variant="ghost"
            className="text-xs sm:text-sm px-3 py-2"
            iconLeft={<LogOut className="h-4 w-4" />}
          >
            Logout
          </GlowButton>
        </form>
        <ThemeToggle />
      </div>
    </header>
  );
}
