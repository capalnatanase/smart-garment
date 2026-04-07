import { bodyBackOverlayZones } from '../config/bodyBackOverlayZones';
import { bodyFrontOverlayZones } from '../config/bodyFrontOverlayZones';
import { bodySideOverlayZones } from '../config/bodySideOverlayZones';
import { pctToSvgRect } from '../config/bodyDiagramOverlayGeometry';

type BodyView = 'front' | 'back' | 'side';

interface ZoneZoomPreviewProps {
  view: BodyView;
  sectionId: string;
  zoneName: string;
}

const VIEW_CONFIG: Record<BodyView, { vbW: number; vbH: number; href: string }> = {
  front: { vbW: 1754, vbH: 3266, href: '/images/front.svg' },
  back: { vbW: 1762, vbH: 3297, href: '/images/back.svg' },
  side: { vbW: 630, vbH: 3297, href: '/images/side.svg' },
};

const PAD_X = 0.08;
const PAD_Y = 0.08;

export function ZoneZoomPreview({ view, sectionId, zoneName }: ZoneZoomPreviewProps) {
  const { vbW, vbH, href } = VIEW_CONFIG[view];
  const sourceZones =
    view === 'front' ? bodyFrontOverlayZones : view === 'back' ? bodyBackOverlayZones : bodySideOverlayZones;
  const sectionZones = sourceZones.filter((z) => z.sectionId === sectionId);

  if (sectionZones.length === 0) {
    return (
      <div className="w-36 h-36 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
        <span className="text-xs text-gray-500">{zoneName}</span>
      </div>
    );
  }

  const rects = sectionZones.map((z) => pctToSvgRect(vbW, vbH, z.x, z.y, z.w, z.h));
  const minX = Math.min(...rects.map((r) => r.x));
  const minY = Math.min(...rects.map((r) => r.y));
  const maxX = Math.max(...rects.map((r) => r.x + r.width));
  const maxY = Math.max(...rects.map((r) => r.y + r.height));
  const w = maxX - minX;
  const h = maxY - minY;
  const padX = w * PAD_X;
  const padY = h * PAD_Y;
  const cropX = Math.max(0, minX - padX);
  const cropY = Math.max(0, minY - padY);
  const cropW = Math.min(vbW - cropX, w + padX * 2);
  const cropH = Math.min(vbH - cropY, h + padY * 2);

  return (
    <div
      className="w-36 h-36 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden"
      role="img"
      aria-label={`Zoomed view of ${zoneName}`}
    >
      <svg viewBox={`${cropX} ${cropY} ${cropW} ${cropH}`} className="w-full h-full">
        <image href={href} x={0} y={0} width={vbW} height={vbH} preserveAspectRatio="xMidYMid meet" />
        {sectionZones.map((z, i) => {
          const r = pctToSvgRect(vbW, vbH, z.x, z.y, z.w, z.h);
          return (
            <rect
              key={`${z.slug}-${z.sectionId}-${i}`}
              x={r.x}
              y={r.y}
              width={r.width}
              height={r.height}
              fill="#4f46e5"
              fillOpacity={0.18}
              stroke="#4338ca"
              strokeWidth={Math.max(1, vbW * 0.0012)}
            />
          );
        })}
      </svg>
    </div>
  );
}
