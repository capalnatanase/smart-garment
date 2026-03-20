/**
 * Short letter codes for body zones.
 * Used for the zone selection blocks.
 */
export const zoneLetterCodes: Record<string, string> = {
  // Front
  'front-head-face': 'FHF',
  'front-right-shoulder': 'FRS',
  'front-left-shoulder': 'FLS',
  'front-right-wrist': 'FRW',
  'front-lower-torso-crotch': 'FLT',
  'front-left-wrist': 'FLW',
  'front-thighs': 'FTH',
  'front-right-shin-ankle': 'FRSA',
  'front-left-shin-ankle': 'FLSA',
  // Back
  'back-head-face': 'BHF',
  'back-left-shoulder': 'BLS',
  'back-right-shoulder': 'BRS',
  'back-left-wrist': 'BLW',
  'back-lower-torso-crotch': 'BLT',
  'back-right-wrist': 'BRW',
  'back-thighs': 'BTH',
  'back-left-shin-ankle': 'BLSA',
  'back-right-shin-ankle': 'BRSA',
  // Side
  'side-head': 'SH',
  'side-shoulder-top-arm': 'SSTA',
  'side-hips-wrist': 'SHW',
  'side-lower-legs': 'SLL',
};

/** Background color for blocks by side (Tailwind classes or CSS). */
export const zoneBlockColorsBySide: Record<string, string> = {
  front: 'bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-200',
  back: 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200',
  side: 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200',
};
