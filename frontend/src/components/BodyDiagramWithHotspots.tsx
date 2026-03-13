/**
 * One composite body diagram image (Front | Back | Side) with clickable zone hotspots.
 * Clicking a zone navigates to the Zone detail page for that zone.
 */
import type { BodyZone } from '../api/endpoints';
import { bodyDiagramHotspots } from '../config/bodyDiagramHotspots';

const BODY_DIAGRAM_IMAGE = '/body-diagram.png';

interface BodyDiagramWithHotspotsProps {
  zones: BodyZone[];
  onZoneClick: (zone: BodyZone) => void;
}

export function BodyDiagramWithHotspots({ zones, onZoneClick }: BodyDiagramWithHotspotsProps) {
  const zonesWithHotspots = zones.filter((z) => bodyDiagramHotspots[z.slug]);

  return (
    <div className="relative w-full mb-6" style={{ aspectRatio: '350/309' }}>
      <img
        src={BODY_DIAGRAM_IMAGE}
        alt="Body views: Front, Back, Side. Select an area where you felt restriction or discomfort."
        className="w-full h-full object-contain bg-gray-100 rounded-lg border border-gray-200"
      />
      {zonesWithHotspots.map((zone) => {
        const rect = bodyDiagramHotspots[zone.slug];
        if (!rect) return null;
        return (
          <button
            key={zone.id}
            type="button"
            onClick={() => onZoneClick(zone)}
            className="absolute border-2 border-transparent hover:border-indigo-500 hover:bg-indigo-500/10 focus:border-indigo-600 focus:bg-indigo-500/15 focus:outline-none rounded transition-colors"
            style={{
              left: `${rect.x}%`,
              top: `${rect.y}%`,
              width: `${rect.w}%`,
              height: `${rect.h}%`,
            }}
            aria-label={`Select ${zone.name} to report discomfort`}
          />
        );
      })}
    </div>
  );
}
