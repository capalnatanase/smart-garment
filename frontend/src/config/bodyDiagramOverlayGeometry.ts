/**
 * When front/back use full container width, scale side width by this fraction so the
 * figure height matches (front viewBox height/width vs side viewBox aspect).
 */
export const SIDE_DIAGRAM_WIDTH_RATIO = (3266 * 630) / (1754 * 3297);

/** Convert percentage rect (0–100 of viewBox) to SVG user units. */
export function pctToSvgRect(
  vbW: number,
  vbH: number,
  xPct: number,
  yPct: number,
  wPct: number,
  hPct: number,
) {
  return {
    x: (xPct / 100) * vbW,
    y: (yPct / 100) * vbH,
    width: (wPct / 100) * vbW,
    height: (hPct / 100) * vbH,
  };
}

export function diagramOverlayRx(vbW: number): number {
  return Math.min(20, vbW * 0.006);
}
