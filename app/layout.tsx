import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import Aurora from "@/components/Aurora";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = DM_Serif_Display({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jahrbuch – Schulzentrum Oberes Elztal",
  description: "Gemacht vom Jahrbuch-Team der SMV",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Theme wird global auf dark erzwungen
  const initialHtmlClass = "scroll-smooth noise dark";
  return (
    <html lang="de" className={initialHtmlClass} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased min-h-dvh text-black dark:text-slate-100`}
      >
        {/* Pre-hydration theme bootstrap: force dark globally */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const K='jahrbuch-theme';const d=document.documentElement;const t='dark';localStorage.setItem(K,t);document.cookie=K+'='+t+';path=/;max-age=31536000';d.classList.add('dark');}catch(e){}})();`,
          }}
        />
        <Aurora />
          <Header />
          {/* Mobile spacer so the fixed header doesn't cover content */}
          <div className="h-16 md:hidden" aria-hidden />
          <div className="relative">{children}</div>
          <Footer />
      </body>
    </html>
  );
}
