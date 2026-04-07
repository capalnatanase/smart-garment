import type { BodyDiagramPalette } from './bodyDiagramOverlayPalette';

/**
 * Front (`/images/front.svg`) — regions and colors:
 * 1 violet upper torso (below shoulder, includes chest) · 2 sky bicep/shoulder extended toward hand ·
 * 3 teal forearm · 4 emerald lower torso to top of thighs · 5 amber thighs · 6 orange knees ·
 * 7 rose ankles · 8 red head.
 * Image left = subject’s right → `front-right-*`; image right → `front-left-*`.
 */
export interface FrontOverlayZone {
  slug: string;
  sectionId: string;
  ariaLabel: string;
  x: number;
  y: number;
  w: number;
  h: number;
  palette: BodyDiagramPalette;
}

export const bodyFrontOverlayZones: FrontOverlayZone[] = [
  // 1 — upper torso: chest only (starts below shoulder; no shoulder coverage)
  {
    slug: 'front-right-shoulder',
    sectionId: '1',
    ariaLabel: 'Front upper torso and chest (right side of body) — select to report discomfort',
    x: 31,
    y: 15,
    w: 19,
    h: 15,
    palette: 'violet',
  },
  {
    slug: 'front-left-shoulder',
    sectionId: '1',
    ariaLabel: 'Front upper torso and chest (left side of body) — select to report discomfort',
    x: 50,
    y: 15,
    w: 19,
    h: 15,
    palette: 'violet',
  },
  // 2 — bicep & shoulder together (includes shoulder caps + upper arms)
  {
    slug: 'front-right-shoulder',
    sectionId: '2',
    ariaLabel: 'Front right shoulder and bicep — select to report discomfort',
    x: 0,
    y: 9.5,
    w: 31,
    h: 26.5,
    palette: 'sky',
  },
  {
    slug: 'front-left-shoulder',
    sectionId: '2',
    ariaLabel: 'Front left shoulder and bicep — select to report discomfort',
    x: 69,
    y: 9.5,
    w: 31,
    h: 26.5,
    palette: 'sky',
  },
  // 3 — forearm + elbow: starts at elbow line and extends toward wrist/hand
  {
    slug: 'front-right-wrist',
    sectionId: '3',
    ariaLabel: 'Front right forearm — select to report discomfort',
    x: 0,
    y: 36,
    w: 31,
    h: 19,
    palette: 'teal',
  },
  {
    slug: 'front-left-wrist',
    sectionId: '3',
    ariaLabel: 'Front left forearm — select to report discomfort',
    x: 69,
    y: 36,
    w: 31,
    h: 19,
    palette: 'teal',
  },
  // 4 — lower torso through waist / hips to leg crease
  {
    slug: 'front-lower-torso-crotch',
    sectionId: '4',
    ariaLabel: 'Front lower torso and waist — select to report discomfort',
    x: 27,
    y: 30,
    w: 46,
    h: 17,
    palette: 'emerald',
  },
  // 5 — thighs / upper legs (starts where section 4 ends)
  {
    slug: 'front-thighs',
    sectionId: '5',
    ariaLabel: 'Front thighs — select to report discomfort',
    x: 27,
    y: 47,
    w: 46,
    h: 22,
    palette: 'amber',
  },
  // 6 — knees (L + R)
  {
    slug: 'front-right-shin-ankle',
    sectionId: '6',
    ariaLabel: 'Front right knee — select to report discomfort',
    x: 27,
    y: 60,
    w: 23,
    h: 9,
    palette: 'orange',
  },
  {
    slug: 'front-left-shin-ankle',
    sectionId: '6',
    ariaLabel: 'Front left knee — select to report discomfort',
    x: 50,
    y: 60,
    w: 23,
    h: 9,
    palette: 'orange',
  },
  // 7 — ankles / lower shin to feet (L + R)
  {
    slug: 'front-right-shin-ankle',
    sectionId: '7',
    ariaLabel: 'Front right ankle — select to report discomfort',
    x: 29.5,
    y: 69,
    w: 20.5,
    h: 22,
    palette: 'rose',
  },
  {
    slug: 'front-left-shin-ankle',
    sectionId: '7',
    ariaLabel: 'Front left ankle — select to report discomfort',
    x: 50,
    y: 69,
    w: 20.5,
    h: 22,
    palette: 'rose',
  },
  // 8 — head (drawn last for hit-testing)
  {
    slug: 'front-head-face',
    sectionId: '8',
    ariaLabel: 'Front head and neck — select to report discomfort',
    x: 31.5,
    y: 0.5,
    w: 37,
    h: 14.5,
    palette: 'red',
  },
];
