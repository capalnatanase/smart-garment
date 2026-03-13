/**
 * Hotspot positions for the composite body diagram (Front | Back | Side).
 * Each value is in percentage (0–100) of the full image width/height.
 * Image layout: left third = front, middle = back, right third = side.
 */
export interface HotspotRect {
  x: number; // left, % of image width
  y: number; // top, % of image height
  w: number; // width, % of image width
  h: number; // height, % of image height
}

export const bodyDiagramHotspots: Record<string, HotspotRect> = {
  // Front (left third, 0–33.33%)
  'front-head': { x: 8, y: 0, w: 17, h: 15 },
  'front-left-shoulder': { x: 0, y: 8, w: 11, h: 18 },
  'front-right-shoulder': { x: 22, y: 8, w: 11, h: 18 },
  'front-left-wrist': { x: 0, y: 28, w: 11, h: 14 },
  'front-right-wrist': { x: 22, y: 28, w: 11, h: 14 },
  'front-lower-torso-crotch': { x: 6, y: 42, w: 21, h: 22 },
  'front-thighs': { x: 6, y: 62, w: 21, h: 18 },
  'front-left-shin-ankle': { x: 0, y: 78, w: 16, h: 22 },
  'front-right-shin-ankle': { x: 17, y: 78, w: 16, h: 22 },
  // Back (middle third, 33.33–66.66%)
  'back-head': { x: 41, y: 0, w: 17, h: 15 },
  'back-left-shoulder': { x: 33, y: 8, w: 11, h: 18 },
  'back-right-shoulder': { x: 55, y: 8, w: 11, h: 18 },
  'back-left-wrist': { x: 33, y: 28, w: 11, h: 14 },
  'back-right-wrist': { x: 55, y: 28, w: 11, h: 14 },
  'back-lower-torso-crotch': { x: 39, y: 42, w: 21, h: 22 },
  'back-thighs': { x: 39, y: 62, w: 21, h: 18 },
  'back-left-shin-ankle': { x: 33, y: 78, w: 16, h: 22 },
  'back-right-shin-ankle': { x: 50, y: 78, w: 16, h: 22 },
  // Side (right third, 66.66–100%)
  'side-head': { x: 72, y: 0, w: 18, h: 15 },
  'side-shoulder': { x: 68, y: 12, w: 26, h: 20 },
  'side-hip': { x: 70, y: 42, w: 22, h: 22 },
  'side-leg': { x: 70, y: 62, w: 24, h: 38 },
};
