import { Phone, Mail, MessageCircle, ChevronDown, HelpCircle, Sparkles, Users, Clock } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function FAQPage() {
  const faqs = [
    {
      question: "Wie kann ich einen Beitrag einreichen?",
      answer: "Gehe auf die Seite 'Phase 1 - Einreichen' und fülle das Formular mit deinem Beitrag aus. Du kannst Fotos, Texte oder Geschichten teilen. Nach der Einreichung wird dein Beitrag von Moderatoren geprüft.",
      icon: "📝"
    },
    {
      question: "Welche Art von Beiträgen kann ich einreichen?",
      answer: "Du kannst verschiedene Kategorien auswählen: Klassenfotos, Schulveranstaltungen, Lustige Momente, Abschluss, Freundschaften, Lehrer-Momente, Sport & AGs und Sonstiges. Wichtig ist, dass die Inhalte schulbezogen und respektvoll sind.",
      icon: "📷"
    },
    {
      question: "Wie funktioniert das Abstimmen?",
      answer: "Auf der 'Browse'-Seite kannst du alle eingereichten Beiträge sehen. Du kannst für jeden Beitrag abstimmen (Upvote/Downvote) und Kommentare hinterlassen. Deine Stimme hilft dabei, die besten Beiträge für das Jahrbuch auszuwählen.",
      icon: "👍"
    },
    {
      question: "Kann ich meine Beiträge bearbeiten?",
      answer: "Aktuell können eingereichte Beiträge nicht direkt bearbeitet werden. Wenn du Änderungen vornehmen möchtest, kontaktiere bitte die SMV oder den Schülersprecher.",
      icon: "✏️"
    },
    {
      question: "Wer kann meine Beiträge sehen?",
      answer: "Alle angemeldeten Nutzer können genehmigte Beiträge sehen. Moderatoren und Admins können auch noch nicht genehmigte Beiträge sehen, um diese zu prüfen.",
      icon: "👀"
    },
    {
      question: "Was passiert mit gemeldeten Beiträgen?",
      answer: "Gemeldete Beiträge werden von Moderatoren überprüft. Wenn ein Beitrag gegen die Richtlinien verstößt, kann er entfernt werden. Bei schwerwiegenden Verstößen können weitere Maßnahmen ergriffen werden.",
      icon: "🚨"
    },
    {
      question: "Wann wird das Jahrbuch fertig sein?",
      answer: "Das Jahrbuch wird in drei Phasen erstellt: Einreichen, Abstimmen und Fertigstellen. Der genaue Zeitplan wird von der SMV und dem Jahrbuch-Team bekannt gegeben.",
      icon: "⏰"
    },
    {
      question: "Wie viel kostet das Jahrbuch?",
      answer: "Die Kosten für das Jahrbuch werden noch bekannt gegeben. Weitere Informationen erhältst du von der SMV oder dem Schülersprecher.",
      icon: "💰"
    },
    {
      question: "Kann ich anonym Beiträge einreichen?",
      answer: "Alle Beiträge sind mit deinem Benutzernamen verknüpft. Wenn du besondere Anliegen hast, kontaktiere bitte direkt die SMV oder den Schülersprecher.",
      icon: "🔒"
    },
    {
      question: "Was passiert mit meinen persönlichen Daten?",
      answer: "Deine Daten werden vertraulich behandelt und nur für die Erstellung des Jahrbuchs verwendet. Weitere Informationen findest du in unserer Datenschutzerklärung.",
      icon: "🛡️"
    }
  ];

  return (
    <div className="relative min-h-dvh bg-gradient-to-br from-[#1a1714] via-[#221e1a] to-[#1a1714] overflow-hidden">
      {/* Hintergrundeffekte */}
      <div className="hidden md:block pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-[#e89a7a]/6 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-[#8faf9d]/6 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[350px] w-[350px] rounded-full bg-[#c9a68a]/5 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#e89a7a]/10 via-[#c9a68a]/10 to-[#8faf9d]/10 border border-[#e89a7a]/20 shadow-lg shadow-[#e89a7a]/10">
            <HelpCircle className="h-4 w-4 text-[#e89a7a]" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#e89a7a]">
              Hilfe & Support
            </span>
            <Sparkles className="h-4 w-4 text-[#8faf9d]" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-br from-[#f5f1ed] via-[#b8aea5] to-[#f5f1ed] bg-clip-text text-transparent mb-6 leading-tight">
            Häufig gestellte Fragen
          </h1>
          <p className="text-xl text-[#b8aea5] max-w-2xl mx-auto leading-relaxed">
            Hier findest du Antworten auf die wichtigsten Fragen rund um das Jahrbuch-Projekt
          </p>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-3 mb-20">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{
                animationDelay: `${index * 60}ms`,
                animationFillMode: 'both'
              }}
            >
              <GlassCard delay={0} hover>
                <details className="group">
                  <summary className="flex items-start gap-4 cursor-pointer list-none hover:opacity-80 transition-opacity">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#e89a7a]/15 to-[#8faf9d]/15 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                      {faq.icon}
                    </div>
                    <div className="flex-1 pt-2">
                      <h3 className="text-lg font-bold text-[#f5f1ed] pr-4 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <ChevronDown className="flex-shrink-0 mt-3 h-6 w-6 text-[#e89a7a] transition-transform duration-300 group-open:rotate-180" />
                  </summary>
                  <div className="mt-4 ml-16 pt-4 border-t border-[#e89a7a]/10 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-base text-[#b8aea5] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Kontakt Section */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '800ms', animationFillMode: 'both' }}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-1 w-12 bg-gradient-to-r from-transparent to-[#e89a7a] rounded-full" />
              <MessageCircle className="h-6 w-6 text-[#e89a7a]" />
              <div className="h-1 w-12 bg-gradient-to-l from-transparent to-[#e89a7a] rounded-full" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#f5f1ed] mb-4">
              Weitere Fragen?
            </h2>
            <p className="text-xl text-[#b8aea5]">
              Wir sind jederzeit für dich da!
            </p>
          </div>

          {/* SMV Kontakt */}
          <GlassCard delay={0}>
            <div className="text-center space-y-5 py-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7a9b88] to-[#6a8b78] rounded-2xl blur-xl opacity-30 animate-pulse" />
                <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#7a9b88] to-[#6a8b78] flex items-center justify-center text-white shadow-2xl">
                  <Users className="h-10 w-10" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#f5f1ed]">
                SMV & Schülersprecher
              </h3>
              <p className="text-lg text-[#b8aea5] max-w-md mx-auto leading-relaxed">
                Bei allgemeinen Fragen zur SMV oder zum Schulalltag kannst du dich jederzeit an uns wenden.
              </p>
            </div>
          </GlassCard>

          {/* Direkter Kontakt - Emin */}
          <GlassCard delay={0.1}>
            <div className="text-center space-y-6 py-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-br from-[#d97757] to-[#c96846] rounded-2xl blur-xl opacity-30 animate-pulse" style={{ animationDelay: '500ms' }} />
                <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#d97757] to-[#c96846] flex items-center justify-center text-white shadow-2xl">
                  <Phone className="h-10 w-10" />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#f5f1ed] mb-3">
                  Direkter Kontakt
                </h3>
                <p className="text-lg text-[#b8aea5] mb-2">
                  Bei dringenden Fragen oder technischen Problemen:
                </p>
                <p className="text-base font-semibold text-[#e89a7a]">
                  Emin (Schülersprecher)
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
                <a
                  href="tel:+4915566595553"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#d97757] to-[#c96846] text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#c96846] to-[#d97757] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Phone className="relative h-5 w-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative">+49 155 66595553</span>
                </a>
                <a
                  href="sms:+4915566595553"
                  className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7a9b88] to-[#6a8b78] text-white font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6a8b78] to-[#7a9b88] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <MessageCircle className="relative h-5 w-5 group-hover:rotate-12 transition-transform" />
                  <span className="relative">SMS senden</span>
                </a>
              </div>

              <div className="pt-6 border-top border-[#b8aea5]/10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8faf9d]/10 border border-[#8faf9d]/20">
                  <Clock className="h-4 w-4 text-[#8faf9d]" />
                  <p className="text-sm font-medium text-[#8faf9d]">
                    Du kannst Emin jederzeit anrufen oder schreiben – er hilft dir gerne weiter!
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Email Alternative */}
          <GlassCard delay={0.2}>
            <div className="text-center space-y-5 py-4">
              <div className="relative inline-block">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#c9a68a]/20 to-[#b8957a]/20 flex items-center justify-center border border-[#c9a68a]/20">
                  <Mail className="h-8 w-8 text-[#c9a68a]" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#f5f1ed]">
                Alternative Kontaktmöglichkeiten
              </h3>
              <p className="text-base text-[#b8aea5] max-w-md mx-auto leading-relaxed">
                Du kannst auch das Kontaktformular auf unserer Website nutzen oder persönlich im SMV-Raum vorbeikommen.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
