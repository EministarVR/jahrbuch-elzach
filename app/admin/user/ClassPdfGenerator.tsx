"use client";

import { useState } from "react";
import GlowButton from "@/components/ui/GlowButton";
import { FileDown, Download } from "lucide-react";
import { CLASSES } from "@/lib/constants";

export default function ClassPdfGenerator() {
  const [selectedClass, setSelectedClass] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedClass) {
      alert("Bitte wähle zuerst eine Klasse aus!");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`/api/admin/generate-class-pdf?class=${encodeURIComponent(selectedClass)}`);

      if (!response.ok) {
        throw new Error("PDF-Generierung fehlgeschlagen");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Login-Daten-${selectedClass}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Fehler beim Generieren:", error);
      alert("Fehler beim Generieren der PDF!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="input-base flex-1"
        >
          <option value="">Klasse auswählen...</option>
          {CLASSES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <GlowButton
          variant="gradient"
          onClick={handleGenerate}
          disabled={!selectedClass || isGenerating}
          className="px-6"
          iconLeft={isGenerating ? <Download className="h-4 w-4 animate-bounce" /> : <FileDown className="h-4 w-4" />}
        >
          {isGenerating ? "Erstelle PDF..." : "PDF erstellen"}
        </GlowButton>
      </div>
      <p className="text-xs text-[#b8aea5]">
        Das PDF enthält Username, Passwort, Login-Link und QR-Code für alle Schüler der gewählten Klasse.
      </p>
    </div>
  );
}

