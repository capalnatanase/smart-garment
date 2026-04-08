import type { BodyDiagramPalette } from './bodyDiagramOverlayPalette';

/**
 * Side (`/images/side.svg`) — six regions, six colors:
 * 1 red head · 2 sky upper torso · 3 teal lower torso · 4 emerald thighs · 5 amber knees · 6 orange ankles.
 * API: only four slugs — thighs/knees/ankles share `side-lower-legs` where needed.
 */
export interface SideOverlayZone {
  slug: string;
  sectionId: string;
  ariaLabel: string;
  x: number;
  y: number;
  w: number;
  h: number;
  palette: BodyDiagramPalette;
}

export const bodySideOverlayZones: SideOverlayZone[] = [
  {
    slug: 'side-head',
    sectionId: '1',
    ariaLabel: 'Side head — select to report discomfort',
    x: 19,
    y: 0,
    w: 68,
    h: 13.5,
    palette: 'red',
  },
  {
    slug: 'side-shoulder-top-arm',
    sectionId: '2',
    ariaLabel: 'Side upper torso — select to report discomfort',
    x: 14,
    y: 13.5,
    w: 84,
    h: 16.5,
    palette: 'sky',
  },
  {
    slug: 'side-hips-wrist',
    sectionId: '3',
    ariaLabel: 'Side lower torso — select to report discomfort',
    x: 13,
    y: 30,
    w: 84,
    h: 15,
    palette: 'teal',
  },
  {
    slug: 'side-lower-legs',
    sectionId: '4',
    ariaLabel: 'Side thighs — select to report discomfort',
    x: 19,
    y: 45,
    w: 80,
    h: 29,
    palette: 'emerald',
  },
  {
    slug: 'side-lower-legs',
    sectionId: '5',
    ariaLabel: 'Side knees — select to report discomfort',
    x: 12,
    y: 63,
    w: 76,
    h: 13,
    palette: 'amber',
  },
  {
    slug: 'side-lower-legs',
    sectionId: '6',
    ariaLabel: 'Side ankles — select to report discomfort',
    x: 14,
    y: 76,
    w: 72,
    h: 16,
    palette: 'orange',
  },
];
