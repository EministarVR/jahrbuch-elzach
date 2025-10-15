import FancyHeading from "@/components/ui/FancyHeading";
import GlassCard from "@/components/ui/GlassCard";
import TiltCard from "@/components/ui/TiltCard";
import MotionFade from "@/components/ui/MotionFade";
import GlowButton from "@/components/ui/GlowButton";
import { Shield, Cookie, Database, Lock, Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default function DatenschutzPage() {
  const lastUpdate = new Date().toLocaleDateString("de-DE", { year: "numeric", month: "2-digit", day: "2-digit" });
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-indigo-50/70 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-indigo-400/25 via-indigo-500/15 to-sky-400/25 blur-3xl opacity-70 dark:opacity-40" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-gradient-to-tr from-sky-400/30 via-indigo-400/20 to-fuchsia-400/25 blur-3xl opacity-75 dark:opacity-40" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-64 w-[80%] bg-gradient-to-t from-indigo-100/70 via-transparent to-transparent dark:from-indigo-900/30" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <FancyHeading center subtitle="Wie wir mit deinen Daten umgehen – klar, knapp und transparent.">
          Datenschutz
        </FancyHeading>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <TiltCard>
              <GlassCard
                className="bg-[linear-gradient(180deg,rgba(99,102,241,0.08),rgba(99,102,241,0.02))]"
                header={
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20">
                      <Shield className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-base-strong">Kurzfassung</h3>
                      <p className="text-sm text-base-muted">Keine Werbung, kein Tracking, nur das Nötigste fürs Jahrbuch.</p>
                    </div>
                  </div>
                }
              >
                <ul className="space-y-3 text-sm text-base-muted">
                  <li className="flex gap-3"><span className="mt-0.5 text-indigo-600">•</span>Wir speichern deinen <span className="font-medium text-base-strong">Username</span> und ein <span className="font-medium text-base-strong">gehashtes Passwort</span> (kein Klartext).</li>
                  <li className="flex gap-3"><span className="mt-0.5 text-indigo-600">•</span>Deine <span className="font-medium text-base-strong">Einsendungen</span> (Text, Kategorie, optional Name/Telefon) werden in unserer internen MySQL‑Datenbank gespeichert.</li>
                  <li className="flex gap-3"><span className="mt-0.5 text-indigo-600">•</span>Es gibt <span className="font-medium text-base-strong">kein Analytics/Tracking</span>, keine Werbe‑Cookies.</li>
                  <li className="flex gap-3"><span className="mt-0.5 text-indigo-600">•</span>Wir verwenden ein <span className="font-medium text-base-strong">Session‑Cookie</span> zur Anmeldung (technisch erforderlich).</li>
                </ul>
              </GlassCard>
            </TiltCard>

            <GlassCard
              header={<div className="flex items-center gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20"><Database className="h-5 w-5" /></span><h3 className="text-lg font-semibold text-base-strong">Welche Daten wir verarbeiten</h3></div>}
            >
              <div className="space-y-4 text-sm text-base-muted">
                <p><span className="font-medium text-base-strong">Accountdaten:</span> Username, Passwort-Hash, Rolle (user/moderator/admin), Erstellungsdatum.</p>
                <p><span className="font-medium text-base-strong">Einsendungen:</span> Text (max. 2000 Zeichen), Kategorie, optional Name/Telefon, Zeitstempel, sowie Moderationsstatus (pending/approved/deleted).</p>
                <p><span className="font-medium text-base-strong">Moderationsprotokoll:</span> Für Transparenz speichern wir im Audit‑Log, wer Beiträge erstellt, genehmigt, gelöscht oder wiederhergestellt hat.</p>
                <p><span className="font-medium text-base-strong">Sperren (nur falls genutzt):</span> Gesperrte User‑IDs bzw. IPs mit Grund und optionalem Ablaufdatum. Wir führen <span className="font-medium text-base-strong">keine allgemeinen IP‑Protokolle</span>.</p>
              </div>
            </GlassCard>

            <GlassCard
              header={<div className="flex items-center gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20"><Cookie className="h-5 w-5" /></span><h3 className="text-lg font-semibold text-base-strong">Cookies & Sitzungen</h3></div>}
            >
              <div className="space-y-4 text-sm text-base-muted">
                <p>Wir setzen ein <span className="font-medium text-base-strong">technisch notwendiges Cookie</span> (jb_session), um dich nach dem Login wiederzuerkennen. Es enthält eine signierte Sitzungskennung, aber <span className="font-medium text-base-strong">keine sensiblen Klartextdaten</span>.</p>
                <p>Das Cookie wird nicht für Tracking oder Werbung verwendet.</p>
              </div>
            </GlassCard>

            <GlassCard
              header={<div className="flex items-center gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20"><Lock className="h-5 w-5" /></span><h3 className="text-lg font-semibold text-base-strong">Sicherheit</h3></div>}
            >
              <div className="space-y-4 text-sm text-base-muted">
                <p>Passwörter werden mit einem <span className="font-medium text-base-strong">starken Hash‑Verfahren</span> gespeichert (kein Klartext). Verbindungen werden nach Möglichkeit über HTTPS bereitgestellt.</p>
                <p>Admins/Moderatoren prüfen Beiträge nur zur Qualitätssicherung (Rechtsverstöße, Sprache). Keine Weitergabe deiner Daten an Dritte.</p>
              </div>
            </GlassCard>

            <GlassCard
              header={<div className="flex items-center gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/20"><Info className="h-5 w-5" /></span><h3 className="text-lg font-semibold text-base-strong">Deine Rechte</h3></div>}
            >
              <div className="space-y-4 text-sm text-base-muted">
                <p>Du hast nach geltendem Recht Auskunfts‑, Berichtigungs‑ und Löschrechte bezüglich deiner personenbezogenen Daten. Wende dich dafür an das Jahrbuch‑Team bzw. die Schulverwaltung.</p>
                <p>Wenn du Fragen zum Datenschutz hast, melde dich bitte bei der Schulleitung oder dem Jahrbuch‑Team.</p>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-1">
            <MotionFade>
              <GlassCard
                className="bg-[linear-gradient(180deg,rgba(99,102,241,0.08),rgba(99,102,241,0.02))]"
                header={<div className="text-lg font-semibold text-base-strong">Kurzinfo</div>}
                hover
              >
                <ul className="space-y-2 text-sm text-base-muted">
                  <li>Keine Analytics, keine Werbe‑Cookies.</li>
                  <li>Session‑Cookie für Login (7 Tage Gültigkeit).</li>
                  <li>MySQL‑Datenbank in der Schule/Hosting‑Umgebung.</li>
                  <li>Nur Admin/Moderator sehen Einsendungen zur Prüfung.</li>
                </ul>
                <div className="mt-4 text-xs text-base-muted">Letzte Aktualisierung: {lastUpdate}</div>
                <div className="mt-4">
                  <GlowButton as="a" href="/" variant="secondary" className="w-full h-10">Zur Startseite</GlowButton>
                </div>
              </GlassCard>
            </MotionFade>
          </div>
        </div>
      </div>
    </div>
  );
}
