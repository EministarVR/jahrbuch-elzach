// Central constants for the Jahrbuch app
// Adjust this list to match the actual school classes
export const CLASSES: string[] = [
  'W5a', 'W6a','W6b','W7a','W7b','W8a','W8b', 'W9a', 'W10', 'R5a','R5b','R6a','R6b', 'R6c', 'R7a','R7b', 'R8a', 'R8b', 'R8c', 'R9a', 'R9b', 'R9c', 'R10a', 'R10b', 'HVKL'
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