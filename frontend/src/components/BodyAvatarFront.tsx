import { bodyFrontOverlayZones } from '../config/bodyFrontOverlayZones';
import { BodyDiagramCompositeSvg } from './BodyDiagramCompositeSvg';
import type { BodyDiagramSectionStyle } from './BodyDiagramCompositeSvg';

interface BodyAvatarFrontProps {
  onZoneClick: (slug: string, sectionId: string) => void;
  sectionStyles?: Record<string, BodyDiagramSectionStyle>;
}

const VB_W = 1754;
const VB_H = 3266;
const FRONT_SVG = '/images/front.svg';

export function BodyAvatarFront({ onZoneClick, sectionStyles }: BodyAvatarFrontProps) {
  return (
    <BodyDiagramCompositeSvg
      viewBoxWidth={VB_W}
      viewBoxHeight={VB_H}
      artworkHref={FRONT_SVG}
      artworkTitle="Front view of the body"
      ariaGroupLabel="Front body view"
      zones={bodyFrontOverlayZones}
      onZoneClick={onZoneClick}
      sectionStyles={sectionStyles}
    />
  );
}
