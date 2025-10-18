"use client";

import { useState, useTransition } from "react";
import GlowButton from "@/components/ui/GlowButton";
import { Copy, Download, ExternalLink, QrCode, CheckCircle2, RefreshCw, Share2, Mail, MessageCircle, Printer } from "lucide-react";

export default function LoginLinkClient({ userId }: { userId: number; username: string }) {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<{ link: string; username: string; password: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Auto-generiere ein starkes Passwort
  const generateStrongPassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars[Math.floor(Math.random() * chars.length)];
    }
    setPassword(pwd);
  };

  const generate = () => {
    setError(null);
    if (!password) {
      setError("Passwort eingeben");
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/generate-login-link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, password }),
        });
        const json = await res.json();
        if (!json.success) {
          setError(json.error || "Fehler");
          setResult(null);
          return;
        }
        setResult({ link: json.link, username: json.username, password: json.password });
        setPassword("");
      } catch {
        setError("Netzwerkfehler");
      }
    });
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      alert("Kopieren fehlgeschlagen");
    }
  };

  const copyAll = async () => {
    if (!result) return;
    const text = `Login-Daten für ${result.username}\n\nLogin-Link: ${result.link}\n\nUsername: ${result.username}\nPasswort: ${result.password}\n\nEinfach den Link öffnen oder QR-Code scannen!`;
    await copyToClipboard(text, 'all');
  };

  const downloadQR = () => {
    if (!result) return;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=800x800&data=${encodeURIComponent(result.link)}`;
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `login-qr-${result.username}.png`;
    link.click();
  };

  const openInNewTab = () => {
    if (!result) return;
    window.open(result.link, '_blank');
  };

  const shareViaEmail = () => {
    if (!result) return;
    const subject = encodeURIComponent(`Login-Zugang für ${result.username}`);
    const body = encodeURIComponent(`Hallo,\n\nhier sind deine Login-Daten:\n\nLogin-Link: ${result.link}\n\nUsername: ${result.username}\nPasswort: ${result.password}\n\nEinfach den Link öffnen oder QR-Code scannen!\n\nViel Erfolg!`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaWhatsApp = () => {
    if (!result) return;
    const text = encodeURIComponent(`Hier sind deine Login-Daten:\n\n🔗 ${result.link}\n\n👤 Username: ${result.username}\n🔑 Passwort: ${result.password}\n\nEinfach Link öffnen! 🚀`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const print = () => {
    if (!result) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(result.link)}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="de">
        <head>
          <meta charSet="utf-8" />
          <title>Login-Daten - ${result.username}</title>
          <style>
            body { 
              font-family: system-ui, -apple-system, sans-serif; 
              max-width: 600px; 
              margin: 40px auto; 
              padding: 20px;
              line-height: 1.6;
            }
            h1 { color: #d97757; margin-bottom: 30px; }
            .box { 
              border: 2px solid #d97757; 
              border-radius: 12px; 
              padding: 20px; 
              margin: 20px 0;
              background: #faf8f5;
            }
            .label { 
              font-weight: bold; 
              color: #6b635a; 
              font-size: 12px;
              text-transform: uppercase;
              margin-bottom: 8px;
            }
            .value { 
              font-size: 16px; 
              color: #2a2520;
              padding: 12px;
              background: white;
              border-radius: 8px;
              margin-bottom: 16px;
              word-break: break-all;
            }
            .qr { 
              text-align: center; 
              margin: 30px 0;
            }
            .qr img { 
              max-width: 300px; 
              border: 2px solid #d97757;
              border-radius: 12px;
              padding: 20px;
              background: white;
            }
            .footer { 
              margin-top: 40px; 
              padding-top: 20px; 
              border-top: 2px solid #e5e5e5;
              color: #6b635a; 
              font-size: 14px;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <h1>🎓 Jahrbuch Login-Daten</h1>
          
          <div class="qr">
            <img src="${qrUrl}" alt="QR Code" />
            <p style="margin-top: 12px; color: #6b635a;">QR-Code scannen für direkten Login</p>
          </div>
          
          <div class="box">
            <div class="label">Login-Link</div>
            <div class="value">${result.link}</div>
            
            <div class="label">Username</div>
            <div class="value">${result.username}</div>
            
            <div class="label">Passwort</div>
            <div class="value">${result.password}</div>
          </div>
          
          <div class="footer">
            <strong>💡 So funktioniert's:</strong>
            <ul>
              <li>Scanne den QR-Code mit deinem Smartphone</li>
              <li>Oder öffne den Login-Link im Browser</li>
              <li>Die Zugangsdaten werden automatisch ausgefüllt</li>
            </ul>
          </div>
          
          <script>
            window.onload = () => {
              setTimeout(() => window.print(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const qrUrl = result ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(result.link)}` : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex gap-2">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && generate()}
            placeholder="Passwort für Link"
            type="text"
            className="input-base flex-1 text-sm"
          />
          <GlowButton
            onClick={generateStrongPassword}
            variant="ghost"
            className="px-3 py-2 text-xs shrink-0"
            title="Zufälliges Passwort generieren"
          >
            🎲
          </GlowButton>
        </div>
        <GlowButton
          onClick={generate}
          loading={isPending}
          variant="primary"
          className="px-5 py-2.5 text-sm whitespace-nowrap"
          iconLeft={<QrCode className="h-4 w-4" />}
        >
          Link erzeugen
        </GlowButton>
      </div>

      {error && (
        <div className="rounded-xl bg-[#d97757]/10 border border-[#d97757]/30 px-4 py-3">
          <div className="text-sm text-[#d97757] font-medium">{error}</div>
        </div>
      )}

      {result && (
        <div className="rounded-2xl bg-gradient-to-br from-[#2a2520]/80 to-[#2a2520]/60 backdrop-blur-sm border border-[#e89a7a]/20 p-6 space-y-5 shadow-lg shadow-[#d97757]/10">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#7a9b88] to-[#6a8b78] flex items-center justify-center text-white shadow-md">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#f5f1ed]">Login-Link erstellt</div>
                <div className="text-xs text-[#b8aea5]">Für {result.username}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <GlowButton
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  variant="secondary"
                  className="px-3 py-2 text-xs"
                  iconLeft={<Share2 className="h-3.5 w-3.5" />}
                >
                  Teilen
                </GlowButton>
                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-xl bg-[#2a2520] border border-[#e89a7a]/20 shadow-xl z-50 overflow-hidden">
                    <button
                      onClick={() => { shareViaEmail(); setShowShareMenu(false); }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-[#e89a7a]/10 flex items-center gap-3 text-[#f5f1ed] transition-colors"
                    >
                      <Mail className="h-4 w-4 text-[#7a9b88]" />
                      Per E-Mail
                    </button>
                    <button
                      onClick={() => { shareViaWhatsApp(); setShowShareMenu(false); }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-[#e89a7a]/10 flex items-center gap-3 text-[#f5f1ed] transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 text-[#7a9b88]" />
                      Per WhatsApp
                    </button>
                    <button
                      onClick={() => { copyAll(); setShowShareMenu(false); }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-[#e89a7a]/10 flex items-center gap-3 text-[#f5f1ed] transition-colors"
                    >
                      <Copy className="h-4 w-4 text-[#7a9b88]" />
                      Alles kopieren
                    </button>
                    <button
                      onClick={() => { print(); setShowShareMenu(false); }}
                      className="w-full px-4 py-3 text-left text-sm hover:bg-[#e89a7a]/10 flex items-center gap-3 text-[#f5f1ed] transition-colors"
                    >
                      <Printer className="h-4 w-4 text-[#7a9b88]" />
                      Drucken
                    </button>
                  </div>
                )}
              </div>
              <GlowButton
                onClick={() => setResult(null)}
                variant="ghost"
                className="px-3 py-2 text-xs"
                iconLeft={<RefreshCw className="h-3.5 w-3.5" />}
              >
                Neu
              </GlowButton>
            </div>
          </div>

          <div className="grid md:grid-cols-[auto,1fr] gap-6 items-start">
            {qrUrl && (
              <div className="flex flex-col items-center gap-3">
                <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-[#e89a7a]/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrUrl}
                    alt="Login QR Code"
                    className="w-[280px] h-[280px] rounded-xl"
                  />
                </div>
                <GlowButton
                  onClick={downloadQR}
                  variant="secondary"
                  className="px-4 py-2 text-xs w-full"
                  iconLeft={<Download className="h-3.5 w-3.5" />}
                >
                  QR-Code laden
                </GlowButton>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-medium text-[#b8aea5] uppercase tracking-wide">Login-Link</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-xl bg-[#8faf9d]/5 border border-[#8faf9d]/20 px-4 py-3">
                    <a
                      href={result!.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#8faf9d] hover:text-[#7a9b88] break-all font-medium hover:underline"
                    >
                      {result!.link}
                    </a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <GlowButton
                    onClick={() => copyToClipboard(result!.link, 'link')}
                    variant={copied === 'link' ? 'primary' : 'secondary'}
                    className="px-3 py-2 text-xs flex-1"
                    iconLeft={copied === 'link' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  >
                    {copied === 'link' ? 'Kopiert!' : 'Link kopieren'}
                  </GlowButton>
                  <GlowButton
                    onClick={openInNewTab}
                    variant="ghost"
                    className="px-3 py-2 text-xs"
                    iconLeft={<ExternalLink className="h-3.5 w-3.5" />}
                  >
                    Öffnen
                  </GlowButton>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="text-xs font-medium text-[#b8aea5] uppercase tracking-wide">Username</div>
                  <div className="rounded-xl bg-[#1a1714]/60 border border-[#e89a7a]/15 px-3 py-2.5">
                    <div className="text-sm font-semibold text-[#f5f1ed]">{result!.username}</div>
                  </div>
                  <GlowButton
                    onClick={() => copyToClipboard(result!.username, 'username')}
                    variant="ghost"
                    className="px-2 py-1.5 text-xs w-full"
                    iconLeft={copied === 'username' ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  >
                    {copied === 'username' ? 'Kopiert!' : 'Kopieren'}
                  </GlowButton>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-medium text-[#b8aea5] uppercase tracking-wide">Passwort</div>
                  <div className="rounded-xl bg-[#1a1714]/60 border border-[#e89a7a]/15 px-3 py-2.5">
                    <div className="text-sm font-mono font-semibold text-[#f5f1ed]">{result!.password}</div>
                  </div>
                  <GlowButton
                    onClick={() => copyToClipboard(result!.password, 'password')}
                    variant="ghost"
                    className="px-2 py-1.5 text-xs w-full"
                    iconLeft={copied === 'password' ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  >
                    {copied === 'password' ? 'Kopiert!' : 'Kopieren'}
                  </GlowButton>
                </div>
              </div>

              <div className="rounded-xl bg-[#e89a7a]/5 border border-[#e89a7a]/20 px-4 py-3">
                <div className="text-xs text-[#b8aea5] space-y-1">
                  <div className="font-medium text-[#f5f1ed]">💡 Hinweise:</div>
                  <div>• QR-Code scannen für sofortigen Login</div>
                  <div>• Link funktioniert auf allen Geräten</div>
                  <div>• Login-Daten können mehrfach genutzt werden</div>
                  <div>• Über &quot;Teilen&quot; Button versenden oder drucken</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click außerhalb schließt Share-Menü */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
}
