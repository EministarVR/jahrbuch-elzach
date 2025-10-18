'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import GlowButton from '@/components/ui/GlowButton';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Report {
  id: number;
  submission_id: number;
  reporter: string;
  reason: string;
  created_at: string;
  submission_text: string;
  submission_author: string;
}

export default function ReportsList({ reports }: { reports: Report[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleReview = async (reportId: number, action: 'reviewed' | 'dismissed') => {
    try {
      const response = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action }),
      });

      if (response.ok) {
        startTransition(() => {
          router.refresh();
        });
      }
    } catch (error) {
      console.error('Review error:', error);
      alert('Fehler beim Bearbeiten der Meldung.');
    }
  };

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#7a9b88]/10 dark:bg-[#8faf9d]/10 text-[#7a9b88] dark:text-[#8faf9d] mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <p className="text-sm text-[#6b635a] dark:text-[#b8aea5]">Keine offenen Meldungen. Alles sauber! ✨</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="rounded-2xl border border-red-500/20 dark:border-red-400/20 bg-red-50/50 dark:bg-red-900/10 p-5 hover:border-red-500/30 dark:hover:border-red-400/30 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="text-xs text-[#6b635a] dark:text-[#b8aea5] mb-3">
                  Gemeldet von <strong className="text-[#2a2520] dark:text-[#f5f1ed]">{report.reporter}</strong> am {new Date(report.created_at).toLocaleString('de-DE')}
                </div>

                <div className="mb-4">
                  <div className="text-xs font-semibold text-[#2a2520] dark:text-[#f5f1ed] mb-1">Grund:</div>
                  <div className="text-sm text-red-700 dark:text-red-300 bg-white/50 dark:bg-[#2a2520]/50 rounded-lg p-3 border border-red-200 dark:border-red-800">
                    {report.reason}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-[#2a2520] dark:text-[#f5f1ed] mb-1">
                    Beitrag von <strong>{report.submission_author}</strong>:
                  </div>
                  <div className="text-sm text-[#2a2520] dark:text-[#f5f1ed] bg-white/50 dark:bg-[#2a2520]/50 rounded-lg p-3 border border-[#d97757]/20 dark:border-[#e89a7a]/20">
                    {report.submission_text}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex flex-col gap-2">
                <GlowButton
                  onClick={() => handleReview(report.id, 'reviewed')}
                  variant="primary"
                  className="px-4 py-2 text-sm whitespace-nowrap"
                  iconLeft={<CheckCircle2 className="h-4 w-4" />}
                  disabled={isPending}
                >
                  Geprüft
                </GlowButton>
                <GlowButton
                  onClick={() => handleReview(report.id, 'dismissed')}
                  variant="secondary"
                  className="px-4 py-2 text-sm whitespace-nowrap"
                  iconLeft={<XCircle className="h-4 w-4" />}
                  disabled={isPending}
                >
                  Abweisen
                </GlowButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isPending && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#2a2520] rounded-2xl p-6 shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d97757] dark:border-[#e89a7a]"></div>
          </div>
        </div>
      )}
    </>
  );
}
