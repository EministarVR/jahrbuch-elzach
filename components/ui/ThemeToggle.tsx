"use client";
import { useTheme } from '@/components/ThemeProvider';
import { Moon, Sun, MonitorSmartphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import GlowButton from './GlowButton';

export default function ThemeToggle() {
  const { theme, toggle, set } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(()=>{ setMounted(true); },[]);
  if (!mounted) return null;
  return (
    <div className="flex items-center gap-1">
      <GlowButton as="button" variant="ghost" className="px-3 py-2" onClick={toggle}
        iconLeft={theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        aria-label="Theme wechseln">
        {theme === 'dark' ? 'Light' : 'Dark'}
      </GlowButton>
      <GlowButton as="button" variant="ghost" className="px-3 py-2" onClick={()=>{
        const sys = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' as const : 'light' as const;
        set(sys);
      }} iconLeft={<MonitorSmartphone className="h-4 w-4" />} aria-label="System Theme">
        Sys
      </GlowButton>
    </div>
  );
}
