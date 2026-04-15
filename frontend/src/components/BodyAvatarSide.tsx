import { bodySideOverlayZones } from '../config/bodySideOverlayZones';
import { SIDE_DIAGRAM_WIDTH_RATIO } from '../config/bodyDiagramOverlayGeometry';
import { BodyDiagramCompositeSvg } from './BodyDiagramCompositeSvg';
import type { BodyDiagramSectionStyle } from './BodyDiagramCompositeSvg';

interface BodyAvatarSideProps {
  onZoneClick: (slug: string, sectionId: string) => void;
  sectionStyles?: Record<string, BodyDiagramSectionStyle>;
  markedSlugs?: string[];
}

const VB_W = 630;
const VB_H = 3297;
const SIDE_SVG = '/images/side.svg';

export function BodyAvatarSide({ onZoneClick, sectionStyles, markedSlugs }: BodyAvatarSideProps) {
  return (
    <BodyDiagramCompositeSvg
      viewBoxWidth={VB_W}
      viewBoxHeight={VB_H}
      artworkHref={SIDE_SVG}
      artworkTitle="Side view of the body"
      ariaGroupLabel="Side body view"
      zones={bodySideOverlayZones}
      onZoneClick={onZoneClick}
      sectionStyles={sectionStyles}
      markedSlugs={markedSlugs}
      className="mx-auto block h-auto max-w-full"
      style={{ width: `${SIDE_DIAGRAM_WIDTH_RATIO * 100}%` }}
    />
  );
}
