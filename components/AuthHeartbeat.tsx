"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthHeartbeat() {
  const [banned, setBanned] = useState<{ banned: boolean; reason?: string | null } | null>(null);
  const router = useRouter();

  useEffect(() => {
    let stop = false;
    let controller: AbortController | null = null;

    async function ping() {
      try {
        controller?.abort();
        controller = new AbortController();
        const res = await fetch('/api/auth/ping', { cache: 'no-store', signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (stop) return;
        if (data.logout) {
          // User deleted -> redirect to login
          router.push('/login');
          return;
        }
        if (data.banned) {
          setBanned({ banned: true, reason: data.reason ?? null });
        } else {
          setBanned(null);
        }
      } catch {
        // ignore
      }
    }

    // initial and interval
    ping();
    const id = setInterval(ping, 8000);

    return () => {
      stop = true;
      controller?.abort();
      clearInterval(id);
    };
  }, [router]);

  if (!banned?.banned) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[1100]">
      <div className="mx-auto max-w-5xl mt-2 px-4">
        <div className="rounded-xl border border-red-500/20 bg-red-600/15 backdrop-blur-md text-red-200 px-4 py-3 shadow-lg">
          <div className="text-sm font-medium">
            Dein Account ist aktuell gesperrt. {banned.reason ? `Grund: ${banned.reason}` : ''}
          </div>
          <div className="text-xs opacity-80">Interaktionen (Einsenden, Kommentieren, Voten) sind deaktiviert.</div>
        </div>
      </div>
    </div>
  );
}
