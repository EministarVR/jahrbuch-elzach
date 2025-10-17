'use server';

import { query } from './db';
import { unstable_noStore as noStore } from 'next/cache';

export type PhaseStatus = 'active' | 'development' | 'disabled';

export type PhaseSetting = {
  id: number;
  phase_key: string;
  enabled: boolean;
  title: string;
  description: string | null;
  status: PhaseStatus;
  updated_at: string;
  updated_by: number | null;
};

export async function getPhaseSettings(): Promise<PhaseSetting[]> {
  noStore(); // Verhindert Caching - immer frische Daten aus der DB
  return await query<PhaseSetting[]>(
    'SELECT * FROM phase_settings ORDER BY phase_key'
  );
}

export async function getPhaseByKey(phaseKey: string): Promise<PhaseSetting | null> {
  noStore(); // Verhindert Caching - immer frische Daten aus der DB
  const [phase] = await query<PhaseSetting[]>(
    'SELECT * FROM phase_settings WHERE phase_key = ? LIMIT 1',
    [phaseKey]
  );
  return phase || null;
}

export async function isPhaseEnabled(phaseKey: string): Promise<boolean> {
  noStore(); // Verhindert Caching - immer frische Daten aus der DB
  const phase = await getPhaseByKey(phaseKey);
  return phase?.enabled ?? false;
}

export async function canAccessPhase(phaseKey: string, userRole: string): Promise<boolean> {
  noStore(); // Verhindert Caching - immer frische Daten aus der DB
  // Admins können immer auf alle Phasen zugreifen (für Testzwecke)
  if (userRole === 'admin') return true;

  // Für alle anderen: Phase muss enabled sein
  return await isPhaseEnabled(phaseKey);
}
