import type { BodyZone } from '../api/endpoints';
import { BodyAvatarFront } from './BodyAvatarFront';
import { BodyAvatarBack } from './BodyAvatarBack';
import { BodyAvatarSide } from './BodyAvatarSide';

interface BodyAvatarZoneSelectProps {
  zones: BodyZone[];
  onZoneClick: (zone: BodyZone) => void;
}

export function BodyAvatarZoneSelect({ zones, onZoneClick }: BodyAvatarZoneSelectProps) {
  const zoneBySlug = new Map(zones.map((z) => [z.slug, z]));

  const handleSlugClick = (slug: string) => {
    const zone = zoneBySlug.get(slug);
    if (zone) onZoneClick(zone);
  };

  return (
    <div
      className="grid grid-cols-3 gap-1 mb-6"
      role="group"
      aria-label="Select a body area where you felt discomfort"
    >
      <div className="flex flex-col items-center">
        <BodyAvatarFront onZoneClick={handleSlugClick} />
        <p className="mt-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Front</p>
      </div>
      <div className="flex flex-col items-center">
        <BodyAvatarBack onZoneClick={handleSlugClick} />
        <p className="mt-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Back</p>
      </div>
      <div className="flex flex-col items-center">
        <BodyAvatarSide onZoneClick={handleSlugClick} />
        <p className="mt-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">Side</p>
      </div>
    </div>
  );
}
