import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Serif_Display } from "next/font/google";
import { cookies } from "next/headers";
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
  const jar = await cookies();
  const themeCookie = jar.get("jahrbuch-theme")?.value as
    | "light"
    | "dark"
    | undefined;
  const initialHtmlClass =
    themeCookie === "dark" ? "scroll-smooth noise dark" : "scroll-smooth noise";
  return (
    <html lang="de" className={initialHtmlClass} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} antialiased min-h-dvh text-black dark:text-slate-100`}
      >
        {/* Pre-hydration theme bootstrap (also sync cookie if missing) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{try{const K='jahrbuch-theme';const d=document.documentElement;let t=localStorage.getItem(K);if(!t){t=document.cookie.split('; ').find(r=>r.startsWith(K+'='))?.split('=')[1];}
if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.cookie=K+'='+t+';path=/;max-age=31536000';}
if(t==='dark')d.classList.add('dark');else d.classList.remove('dark');}catch(e){}})();`,
          }}
        />
        <Aurora />
          <Header />
          <div className="relative">{children}</div>
          <Footer />
      </body>
    </html>
  );
}
