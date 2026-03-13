/**
 * Short letter codes for body zones (e.g. front-head → FH).
 * Used for the zone selection blocks.
 */
export const zoneLetterCodes: Record<string, string> = {
  'front-head': 'FH',
  'back-head': 'BH',
  'side-head': 'SH',
  'front-right-shoulder': 'FRS',
  'front-left-shoulder': 'FLS',
  'back-right-shoulder': 'BRS',
  'back-left-shoulder': 'BLS',
  'side-shoulder': 'SS',
  'front-right-wrist': 'FRW',
  'front-left-wrist': 'FLW',
  'back-right-wrist': 'BRW',
  'back-left-wrist': 'BLW',
  'front-lower-torso-crotch': 'FLT',
  'back-lower-torso-crotch': 'BLT',
  'side-hip': 'SHP',
  'front-thighs': 'FTH',
  'back-thighs': 'BTH',
  'side-leg': 'SLG',
  'front-left-shin-ankle': 'FLSA',
  'front-right-shin-ankle': 'FRSA',
  'back-left-shin-ankle': 'BLSA',
  'back-right-shin-ankle': 'BRSA',
};

/** Background color for blocks by side (Tailwind classes or CSS). */
export const zoneBlockColorsBySide: Record<string, string> = {
  front: 'bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-200',
  back: 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200',
  side: 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200',
};
