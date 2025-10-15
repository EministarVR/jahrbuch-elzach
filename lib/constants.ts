// Central constants for the Jahrbuch app
// Adjust this list to match the actual school classes
export const CLASSES: string[] = [
  '5a','5b','6a','6b','7a','7b','8a','8b','9a','9b','10a','10b','11','12','13'
];

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