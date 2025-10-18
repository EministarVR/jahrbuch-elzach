import GlassCard from "@/components/ui/GlassCard";
import TiltCard from "@/components/ui/TiltCard";
import MotionFade from "@/components/ui/MotionFade";
import GlowButton from "@/components/ui/GlowButton";
import { Shield, Cookie, Database, Lock, Info, Home } from "lucide-react";

export const dynamic = "force-dynamic";

export default function DatenschutzPage() {
  const lastUpdate = new Date().toLocaleDateString("de-DE", { year: "numeric", month: "2-digit", day: "2-digit" });
  return (
    <div className="relative min-h-dvh overflow-hidden bg-gradient-to-br from-[#1a1714] via-[#221e1a] to-[#1a1714]">
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#e89a7a]/6 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[#8faf9d]/6 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-[#8faf9d]/10 border border-[#8faf9d]/20">
            <Shield className="h-4 w-4 text-[#8faf9d]" />
            <span className="text-xs font-medium tracking-wide uppercase text-[#8faf9d]">
              DSGVO-konform
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#f5f1ed] mb-4">
            Datenschutz
          </h1>
          <p className="text-lg text-[#b8aea5] max-w-2xl mx-auto">
            Wie wir mit deinen Daten umgehen – klar, knapp und transparent.
          </p>
        </div>

        {/* Mobile: schnelles Inhaltsverzeichnis */}
        <nav aria-label="Inhaltsverzeichnis" className="md:hidden sticky top-16 z-10 -mt-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 pr-1">
            {[
              { href: "#kurzfassung", label: "Kurzfassung" },
              { href: "#daten", label: "Daten" },
              { href: "#cookies", label: "Cookies" },
              { href: "#sicherheit", label: "Sicherheit" },
              { href: "#rechte", label: "Rechte" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex items-center px-3 py-2 rounded-xl bg-[#2a2520]/80 text-[#f5f1ed] border border-[#d97757]/10 whitespace-nowrap text-sm shadow-lg"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div id="kurzfassung" className="scroll-mt-20">
              <TiltCard>
                <GlassCard
                  header={
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#8faf9d]/10 text-[#8faf9d]">
                        <Shield className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold text-[#f5f1ed]">Kurzfassung</h3>
                        <p className="text-sm text-[#b8aea5]">Keine Werbung, kein Tracking, nur das Nötigste fürs Jahrbuch.</p>
                      </div>
                    </div>
                  }
                >
                  <ul className="space-y-3 text-sm text-[#b8aea5]">
                    <li className="flex gap-3"><span className="mt-0.5 text-[#8faf9d]">•</span>Wir speichern deinen <span className="font-medium text-[#f5f1ed]">Username</span> und ein <span className="font-medium text-[#f5f1ed]">gehashtes Passwort</span> (kein Klartext).</li>
                    <li className="flex gap-3"><span className="mt-0.5 text-[#8faf9d]">•</span>Deine <span className="font-medium text-[#f5f1ed]">Einsendungen</span> (Text, Kategorie, optional Name/Telefon) werden in unserer internen MySQL‑Datenbank gespeichert.</li>
                    <li className="flex gap-3"><span className="mt-0.5 text-[#8faf9d]">•</span>Es gibt <span className="font-medium text-[#f5f1ed]">kein Analytics/Tracking</span>, keine Werbe‑Cookies.</li>
                    <li className="flex gap-3"><span className="mt-0.5 text-[#8faf9d]">•</span>Wir verwenden ein <span className="font-medium text-[#f5f1ed]">Session‑Cookie</span> zur Anmeldung (technisch erforderlich).</li>
                  </ul>
                </GlassCard>
              </TiltCard>
            </div>

            <div id="daten" className="scroll-mt-20">
              <GlassCard
                header={<div className="flex items-center gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e89a7a]/10 text-[#e89a7a]"><Database className="h-5 w-5" /></span><h3 className="text-lg font-semibold text-[#f5f1ed]">Welche Daten wir verarbeiten</h3></div>}
              >
                <div className="space-y-4 text-sm text-[#b8aea5] leading-relaxed">
                  <p><span className="font-medium text-[#f5f1ed]">Accountdaten:</span> Username, Passwort-Hash, Rolle (user/moderator/admin), Erstellungsdatum.</p>
                  <p><span className="font-medium text-[#f5f1ed]">Einsendungen:</span> Text (max. 2000 Zeichen), Kategorie, optional Name/Telefon, Zeitstempel, sowie Moderationsstatus (pending/approved/deleted).</p>
                  <p><span className="font-medium text-[#f5f1ed]">Moderationsprotokoll:</span> Für Transparenz speichern wir im Audit‑Log, wer Beiträge erstellt, genehmigt, gelöscht oder wiederhergestellt hat.</p>
                  <p><span className="font-medium text-[#f5f1ed]">Sperren (nur falls genutzt):</span> Gesperrte User‑IDs bzw. IPs mit Grund und optionalem Ablaufdatum. Wir führen <span className="font-medium text-[#f5f1ed]">keine allgemeinen IP‑Protokolle</span>.</p>
                </div>
              </GlassCard>
            </div>

            <div id="cookies" className="scroll-mt-20">
              <GlassCard
                header={<div className="flex items-center gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#d97757]/10 text-[#d97757]"><Cookie className="h-5 w-5" /></span><h3 className="text-lg font-semibold text-[#f5f1ed]">Cookies & Sitzungen</h3></div>}
              >
                <div className="space-y-4 text-sm text-[#b8aea5] leading-relaxed">
                  <p>Wir setzen ein <span className="font-medium text-[#f5f1ed]">technisch notwendiges Cookie</span> (jb_session), um dich nach dem Login wiederzuerkennen. Es enthält eine signierte Sitzungskennung, aber <span className="font-medium text-[#f5f1ed]">keine sensiblen Klartextdaten</span>.</p>
                  <p>Das Cookie wird nicht für Tracking oder Werbung verwendet.</p>
                </div>
              </GlassCard>
            </div>

            <div id="sicherheit" className="scroll-mt-20">
              <GlassCard
                header={<div className="flex items-center gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#8faf9d]/10 text-[#8faf9d]"><Lock className="h-5 w-5" /></span><h3 className="text-lg font-semibold text-[#f5f1ed]">Sicherheit</h3></div>}
              >
                <div className="space-y-4 text-sm text-[#b8aea5] leading-relaxed">
                  <p>Passwörter werden mit einem <span className="font-medium text-[#f5f1ed]">starken Hash‑Verfahren</span> gespeichert (kein Klartext). Verbindungen werden nach Möglichkeit über HTTPS bereitgestellt.</p>
                  <p>Admins/Moderatoren prüfen Beiträge nur zur Qualitätssicherung (Rechtsverstöße, Sprache). Keine Weitergabe deiner Daten an Dritte.</p>
                </div>
              </GlassCard>
            </div>

            <div id="rechte" className="scroll-mt-20">
              <GlassCard
                header={<div className="flex items-center gap-3"><span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e89a7a]/10 text-[#e89a7a]"><Info className="h-5 w-5" /></span><h3 className="text-lg font-semibold text-[#f5f1ed]">Deine Rechte</h3></div>}
              >
                <div className="space-y-4 text-sm text-[#b8aea5] leading-relaxed">
                  <p>Du hast nach geltendem Recht Auskunfts‑, Berichtigungs‑ und Löschrechte bezüglich deiner personenbezogenen Daten. Wende dich dafür an das Jahrbuch‑Team bzw. die Schulverwaltung.</p>
                  <p>Wenn du Fragen zum Datenschutz hast, melde dich bitte bei den Schülersprechern (Nael‑Emin, Kalina).</p>
                </div>
              </GlassCard>
            </div>
          </div>

          <div className="lg:col-span-1">
            <MotionFade>
              <GlassCard
                header={<div className="text-lg font-semibold text-[#f5f1ed]">Kurzinfo</div>}
                hover
              >
                <ul className="space-y-2 text-sm text-[#b8aea5]">
                  <li>Keine Analytics, keine Werbe‑Cookies.</li>
                  <li>Session‑Cookie für Login (7 Tage Gültigkeit).</li>
                  <li>MySQL‑Datenbank in der Schule/Hosting‑Umgebung.</li>
                  <li>Nur Admin/Moderator sehen Einsendungen zur Prüfung.</li>
                </ul>
                <div className="mt-4 text-xs text-[#b8aea5]">Letzte Aktualisierung: {lastUpdate}</div>
                <div className="mt-4">
                  <GlowButton
                    as="a"
                    href="/"
                    variant="gradient"
                    className="w-full"
                    iconLeft={<Home className="h-4 w-4" />}
                  >
                    Zur Startseite
                  </GlowButton>
                </div>
              </GlassCard>
            </MotionFade>
          </div>
        </div>
      </div>
    </div>
  );
}
