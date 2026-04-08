import type { BodyDiagramPalette } from './bodyDiagramOverlayPalette';

/**
 * Back (`/images/back.svg`) — same layout intent as front:
 * 1 violet upper torso (below shoulder, includes upper back) · 2 sky bicep/shoulder extended toward hand ·
 * 3 teal forearm · 4 emerald lower torso to leg crease · 5 amber thighs/seat · 6 orange knees ·
 * 7 rose ankles · 8 red head.
 */
export interface BackOverlayZone {
  slug: string;
  sectionId: string;
  ariaLabel: string;
  x: number;
  y: number;
  w: number;
  h: number;
  palette: BodyDiagramPalette;
}

export const bodyBackOverlayZones: BackOverlayZone[] = [
  // 1 — upper torso: chest/back panel only (starts below shoulder)
  {
    slug: 'back-left-shoulder',
    sectionId: '1',
    ariaLabel: 'Back upper torso (left side of body) — select to report discomfort',
    x: 31,
    y: 15,
    w: 19,
    h: 15,
    palette: 'violet',
  },
  {
    slug: 'back-right-shoulder',
    sectionId: '1',
    ariaLabel: 'Back upper torso (right side of body) — select to report discomfort',
    x: 50,
    y: 15,
    w: 19,
    h: 15,
    palette: 'violet',
  },
  // 2 — bicep & shoulder together (includes shoulder caps + upper arms)
  {
    slug: 'back-left-shoulder',
    sectionId: '2',
    ariaLabel: 'Back left shoulder and bicep — select to report discomfort',
    x: 0,
    y: 9.5,
    w: 31,
    h: 26.5,
    palette: 'sky',
  },
  {
    slug: 'back-right-shoulder',
    sectionId: '2',
    ariaLabel: 'Back right shoulder and bicep — select to report discomfort',
    x: 69,
    y: 9.5,
    w: 31,
    h: 26.5,
    palette: 'sky',
  },
  // 3 — forearm + elbow: starts at elbow line and extends toward wrist/hand
  {
    slug: 'back-left-wrist',
    sectionId: '3',
    ariaLabel: 'Back left forearm — select to report discomfort',
    x: 0,
    y: 36,
    w: 31,
    h: 19,
    palette: 'teal',
  },
  {
    slug: 'back-right-wrist',
    sectionId: '3',
    ariaLabel: 'Back right forearm — select to report discomfort',
    x: 69,
    y: 36,
    w: 31,
    h: 19,
    palette: 'teal',
  },
  // 4 — lower torso through waist / hips to leg crease
  {
    slug: 'back-lower-torso-crotch',
    sectionId: '4',
    ariaLabel: 'Back lower torso and waist — select to report discomfort',
    x: 31,
    y: 30,
    w: 39,
    h: 17,
    palette: 'emerald',
  },
  // 5 — thighs / seat / upper legs (starts where section 4 ends)
  {
    slug: 'back-thighs',
    sectionId: '5',
    ariaLabel: 'Back thighs — select to report discomfort',
    x: 27,
    y: 47,
    w: 46,
    h: 22,
    palette: 'amber',
  },
  // 6 — knees (L + R)
  {
    slug: 'back-left-shin-ankle',
    sectionId: '6',
    ariaLabel: 'Back left knee — select to report discomfort',
    x: 27,
    y: 69,
    w: 23,
    h: 7,
    palette: 'orange',
  },
  {
    slug: 'back-right-shin-ankle',
    sectionId: '6',
    ariaLabel: 'Back right knee — select to report discomfort',
    x: 50,
    y: 69,
    w: 23,
    h: 7,
    palette: 'orange',
  },
  // 7 — ankles / lower shin to feet (L + R)
  {
    slug: 'back-left-shin-ankle',
    sectionId: '7',
    ariaLabel: 'Back left ankle — select to report discomfort',
    x: 29.5,
    y: 76,
    w: 20.5,
    h: 15,
    palette: 'rose',
  },
  {
    slug: 'back-right-shin-ankle',
    sectionId: '7',
    ariaLabel: 'Back right ankle — select to report discomfort',
    x: 50,
    y: 76,
    w: 20.5,
    h: 15,
    palette: 'rose',
  },
  // 8 — head
  {
    slug: 'back-head-face',
    sectionId: '8',
    ariaLabel: 'Back head and neck — select to report discomfort',
    x: 31.5,
    y: 0.5,
    w: 37,
    h: 14.5,
    palette: 'red',
  },
];
