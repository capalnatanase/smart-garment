/**
 * Zone selection as colored blocks with letter codes (e.g. FH for front-head).
 * Clicking a block navigates to the Zone detail page for that zone.
 */
import type { BodyZone } from '../api/endpoints';
import { zoneLetterCodes, zoneBlockColorsBySide } from '../config/zoneLetterCodes';

const SIDE_ORDER = ['front', 'back', 'side'] as const;
const SIDE_LABELS: Record<string, string> = { front: 'Front', back: 'Back', side: 'Side' };

interface ZoneBlocksProps {
  zones: BodyZone[];
  onZoneClick: (zone: BodyZone) => void;
}

function groupBySide(zones: BodyZone[]): Record<string, BodyZone[]> {
  const groups: Record<string, BodyZone[]> = { front: [], back: [], side: [] };
  zones.forEach((z) => {
    if (groups[z.side]) groups[z.side].push(z);
  });
  return groups;
}

export function ZoneBlocks({ zones, onZoneClick }: ZoneBlocksProps) {
  const bySide = groupBySide(zones);

  return (
    <div className="space-y-4 mb-6" role="group" aria-label="Select a body area where you felt discomfort">
      {SIDE_ORDER.map((side) => {
        const sideZones = bySide[side];
        if (!sideZones?.length) return null;
        return (
          <div key={side}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {SIDE_LABELS[side]}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {sideZones.map((zone) => {
                const code = zoneLetterCodes[zone.slug] ?? zone.slug.slice(0, 3).toUpperCase();
                const colorClass =
                  zoneBlockColorsBySide[zone.side] ??
                  'bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200';
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => onZoneClick(zone)}
                    className={`min-h-[52px] rounded-lg border-2 font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${colorClass}`}
                    aria-label={`${zone.name}, code ${code}. Select to report discomfort.`}
                  >
                    {code}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
