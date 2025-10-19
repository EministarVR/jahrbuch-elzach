"use client";

import { useState } from "react";
import GlowButton from "@/components/ui/GlowButton";
import { RotateCcw, Loader2, AlertTriangle, X } from "lucide-react";

export default function ResetPollClient({ userId, username }: { userId: number; username: string }) {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleReset = async () => {
    setShowDialog(false);
    setLoading(true);
    try {
      const response = await fetch("/api/admin/reset-poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        alert("Abstimmung erfolgreich zurückgesetzt!");
        window.location.reload();
      } else {
        alert("Fehler beim Zurücksetzen. Bitte versuche es erneut.");
      }
    } catch (error) {
      console.error(error);
      alert("Netzwerkfehler. Bitte versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlowButton
        onClick={() => setShowDialog(true)}
        disabled={loading}
        variant="secondary"
        className="px-3 py-2 text-sm"
        iconLeft={loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
      >
        {loading ? "Wird zurückgesetzt..." : "Poll zurücksetzen"}
      </GlowButton>

      {/* Custom Bestätigungs-Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-[#e89a7a]/20 bg-[#2a2520]/95 backdrop-blur-xl shadow-2xl shadow-[#e89a7a]/10 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[#e89a7a]/10 transition-colors text-[#b8aea5] hover:text-[#f5f1ed]"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-[#e89a7a]/10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d97757]/10">
                  <AlertTriangle className="h-6 w-6 text-[#d97757]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#f5f1ed]">
                    Poll zurücksetzen?
                  </h3>
                  <p className="text-sm text-[#b8aea5]">Diese Aktion kann nicht rückgängig gemacht werden</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="text-[#d4cdc5] leading-relaxed">
                Möchtest du wirklich die Abstimmung von <span className="font-semibold text-[#f5f1ed]">{username}</span> zurücksetzen?
              </p>
              <div className="mt-4 p-3 rounded-lg bg-[#d97757]/5 border border-[#d97757]/10">
                <p className="text-sm text-[#b8aea5]">
                  ⚠️ Alle Antworten werden gelöscht und der User kann erneut abstimmen.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex items-center gap-3">
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#e89a7a]/15 bg-[#2a2520]/60 text-[#f5f1ed] font-medium hover:border-[#e89a7a]/30 hover:bg-[#2a2520]/80 transition-all"
              >
                Abbrechen
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-br from-[#d97757] to-[#c96846] text-white font-medium hover:from-[#e89a7a] hover:to-[#d97757] transition-all shadow-lg shadow-[#d97757]/20"
              >
                Zurücksetzen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
