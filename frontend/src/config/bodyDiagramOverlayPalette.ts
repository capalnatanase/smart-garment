/**
 * Zone tints: CSS `filter` + blend. Tuned for a light 3D figure on dark BG — overlay blend
 * and higher saturation/contrast read stronger than soft-light on white highlights.
 */
export type BodyDiagramPalette =
  | 'violet'
  | 'sky'
  | 'teal'
  | 'emerald'
  | 'amber'
  | 'orange'
  | 'rose'
  | 'indigo'
  | 'red';

const zoneBase =
  'cursor-pointer pointer-events-auto mix-blend-overlay fill-white/55 stroke-white/80 stroke-[1.5] transition-[filter] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1';

export const bodyDiagramPaletteClass: Record<BodyDiagramPalette, string> = {
  violet: `${zoneBase} [filter:sepia(0.78)_hue-rotate(252deg)_saturate(2.5)_contrast(1.15)] hover:[filter:sepia(0.85)_hue-rotate(252deg)_saturate(3.1)_contrast(1.2)_brightness(1.06)] focus-visible:[filter:sepia(0.85)_hue-rotate(252deg)_saturate(3.1)_contrast(1.2)_brightness(1.06)]`,
  sky: `${zoneBase} [filter:sepia(0.72)_hue-rotate(198deg)_saturate(2.45)_contrast(1.14)] hover:[filter:sepia(0.8)_hue-rotate(198deg)_saturate(3)_contrast(1.18)_brightness(1.05)] focus-visible:[filter:sepia(0.8)_hue-rotate(198deg)_saturate(3)_contrast(1.18)_brightness(1.05)]`,
  teal: `${zoneBase} [filter:sepia(0.68)_hue-rotate(168deg)_saturate(2.4)_contrast(1.14)] hover:[filter:sepia(0.76)_hue-rotate(168deg)_saturate(2.95)_contrast(1.18)_brightness(1.05)] focus-visible:[filter:sepia(0.76)_hue-rotate(168deg)_saturate(2.95)_contrast(1.18)_brightness(1.05)]`,
  emerald: `${zoneBase} [filter:sepia(0.65)_hue-rotate(132deg)_saturate(2.35)_contrast(1.13)] hover:[filter:sepia(0.74)_hue-rotate(132deg)_saturate(2.9)_contrast(1.17)_brightness(1.05)] focus-visible:[filter:sepia(0.74)_hue-rotate(132deg)_saturate(2.9)_contrast(1.17)_brightness(1.05)]`,
  amber: `${zoneBase} [filter:sepia(0.82)_hue-rotate(32deg)_saturate(2.55)_contrast(1.15)] hover:[filter:sepia(0.88)_hue-rotate(32deg)_saturate(3.1)_contrast(1.2)_brightness(1.06)] focus-visible:[filter:sepia(0.88)_hue-rotate(32deg)_saturate(3.1)_contrast(1.2)_brightness(1.06)]`,
  orange: `${zoneBase} [filter:sepia(0.85)_hue-rotate(8deg)_saturate(2.6)_contrast(1.15)] hover:[filter:sepia(0.9)_hue-rotate(8deg)_saturate(3.15)_contrast(1.2)_brightness(1.05)] focus-visible:[filter:sepia(0.9)_hue-rotate(8deg)_saturate(3.15)_contrast(1.2)_brightness(1.05)]`,
  rose: `${zoneBase} [filter:sepia(0.74)_hue-rotate(325deg)_saturate(2.45)_contrast(1.14)] hover:[filter:sepia(0.82)_hue-rotate(325deg)_saturate(3)_contrast(1.18)_brightness(1.05)] focus-visible:[filter:sepia(0.82)_hue-rotate(325deg)_saturate(3)_contrast(1.18)_brightness(1.05)]`,
  indigo: `${zoneBase} [filter:sepia(0.76)_hue-rotate(262deg)_saturate(2.35)_contrast(1.14)_brightness(1.02)] hover:[filter:sepia(0.84)_hue-rotate(262deg)_saturate(2.95)_contrast(1.18)_brightness(1.08)] focus-visible:[filter:sepia(0.84)_hue-rotate(262deg)_saturate(2.95)_contrast(1.18)_brightness(1.08)]`,
  /** Head — strong red (explicit fills; sepia filter would muddy hue) */
  red: 'cursor-pointer pointer-events-auto mix-blend-overlay fill-red-600/90 stroke-red-950 stroke-[2] transition-[fill,stroke] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-1 hover:fill-red-500 hover:stroke-red-950 focus-visible:fill-red-500',
};

export function bodyDiagramOverlayZoneClass(palette: BodyDiagramPalette): string {
  return bodyDiagramPaletteClass[palette];
}
