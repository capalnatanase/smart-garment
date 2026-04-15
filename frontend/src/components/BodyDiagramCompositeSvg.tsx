import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import { useId } from 'react';
import { useState } from 'react';
import { bodyDiagramOverlayZoneClass } from '../config/bodyDiagramOverlayPalette';
import type { BodyDiagramPalette } from '../config/bodyDiagramOverlayPalette';
import { diagramOverlayRx, pctToSvgRect } from '../config/bodyDiagramOverlayGeometry';
import { cn } from '../lib/utils';

/**
 * Single SVG document: line art from `public/images/*.svg` as `<image>`, plus native
 * `<rect>` zones (same geometry as before). This keeps everything in SVG instead of
 * HTML `<img>` + absolutely positioned overlay SVG.
 *
 * The artwork files are dense exports; splitting every path by body region inside those
 * files would require a layered source from design. Here, zones are proper SVG children.
 */
export interface BodyDiagramZone {
  slug: string;
  sectionId: string;
  ariaLabel: string;
  x: number;
  y: number;
  w: number;
  h: number;
  palette: BodyDiagramPalette;
}

export interface BodyDiagramSectionStyle {
  color: string;
  /** 100 = original size; applies to both width and height from center */
  size: number;
  /** 0..100 */
  opacity: number;
}

interface BodyDiagramCompositeSvgProps {
  viewBoxWidth: number;
  viewBoxHeight: number;
  artworkHref: string;
  artworkTitle: string;
  ariaGroupLabel: string;
  zones: BodyDiagramZone[];
  onZoneClick: (slug: string, sectionId: string) => void;
  sectionStyles?: Record<string, BodyDiagramSectionStyle>;
  markedSlugs?: string[];
  className?: string;
  style?: CSSProperties;
}

export function BodyDiagramCompositeSvg({
  viewBoxWidth,
  viewBoxHeight,
  artworkHref,
  artworkTitle,
  ariaGroupLabel,
  zones,
  onZoneClick,
  sectionStyles,
  markedSlugs = [],
  className = 'w-full h-auto block max-w-full',
  style,
}: BodyDiagramCompositeSvgProps) {
  const maskId = useId().replace(/:/g, '-');
  const [activeZoneKey, setActiveZoneKey] = useState<string | null>(null);
  const markedSlugSet = new Set(markedSlugs);
  const markedSectionIds = new Set(
    zones.filter((z) => markedSlugSet.has(z.slug)).map((z) => z.sectionId),
  );

  const handle =
    (slug: string, sectionId: string) =>
    (e: MouseEvent<SVGRectElement> | KeyboardEvent<SVGRectElement>) => {
      if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      onZoneClick(slug, sectionId);
    };

  const rx = diagramOverlayRx(viewBoxWidth);

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      className={cn('isolate max-w-full', className)}
      role="group"
      aria-label={ariaGroupLabel}
      style={style}
    >
      <title>{artworkTitle}</title>
      <defs>
        {/* Use the artwork luminance as a mask: dark background is excluded, body remains tintable. */}
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={viewBoxWidth}
          height={viewBoxHeight}
          style={{ maskType: 'luminance' }}
        >
          <image
            href={artworkHref}
            x={0}
            y={0}
            width={viewBoxWidth}
            height={viewBoxHeight}
            preserveAspectRatio="xMidYMid meet"
          />
        </mask>
      </defs>
      <image
        href={artworkHref}
        x={0}
        y={0}
        width={viewBoxWidth}
        height={viewBoxHeight}
        preserveAspectRatio="xMidYMid meet"
        pointerEvents="none"
      />
      <g mask={`url(#${maskId})`}>
        {zones.map((zone, i) => {
          const zoneKey = `${zone.slug}-${i}`;
          const { x, y, width, height } = pctToSvgRect(
            viewBoxWidth,
            viewBoxHeight,
            zone.x,
            zone.y,
            zone.w,
            zone.h,
          );
          const sectionStyle = sectionStyles?.[zone.sectionId];
          const scale = Math.max(0.5, Math.min(2, (sectionStyle?.size ?? 100) / 100));
          const scaledWidth = width * scale;
          const scaledHeight = height * scale;
          const scaledX = x + (width - scaledWidth) / 2;
          const scaledY = y + (height - scaledHeight) / 2;
          const usesCustomStyle = Boolean(sectionStyle);
          const isMarked = markedSectionIds.has(zone.sectionId);
          const baseOpacity = Math.max(0, Math.min(1, (sectionStyle?.opacity ?? 50) / 100));
          const isActive = activeZoneKey === zoneKey;
          const visualOpacity = isMarked ? 0 : isActive ? 0.8 : baseOpacity;
          return (
            <rect
              key={zoneKey}
              x={scaledX}
              y={scaledY}
              width={scaledWidth}
              height={scaledHeight}
              rx={rx}
              className={
                usesCustomStyle
                  ? 'cursor-pointer pointer-events-auto transition-opacity duration-150 focus:outline-none'
                  : bodyDiagramOverlayZoneClass(zone.palette)
              }
              style={
                usesCustomStyle
                  ? {
                      fill: sectionStyle!.color,
                      stroke: sectionStyle!.color,
                      fillOpacity: visualOpacity,
                      strokeOpacity: isMarked ? 0 : Math.min(1, visualOpacity + 0.2),
                      strokeWidth: 2,
                      filter: 'none',
                    }
                  : {
                      opacity: visualOpacity,
                    }
              }
              role="button"
              tabIndex={0}
              aria-label={zone.ariaLabel}
              onClick={handle(zone.slug, zone.sectionId)}
              onKeyDown={handle(zone.slug, zone.sectionId)}
              onMouseEnter={() => setActiveZoneKey(zoneKey)}
              onMouseLeave={() => setActiveZoneKey(null)}
              onFocus={() => setActiveZoneKey(zoneKey)}
              onBlur={() => setActiveZoneKey(null)}
            />
          );
        })}
      </g>
    </svg>
  );
}
