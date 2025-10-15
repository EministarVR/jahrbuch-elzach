export const CATEGORIES = [
  'Allgemein',
  'Klassen',
  'Lehrer',
  'AGs',
  'Sport',
  'Musik',
  'Kunst',
  'Events',
] as const;

export type Category = typeof CATEGORIES[number];
