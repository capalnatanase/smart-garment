import { bodyBackOverlayZones } from '../config/bodyBackOverlayZones';
import { BodyDiagramCompositeSvg } from './BodyDiagramCompositeSvg';
import type { BodyDiagramSectionStyle } from './BodyDiagramCompositeSvg';

interface BodyAvatarBackProps {
  onZoneClick: (slug: string, sectionId: string) => void;
  sectionStyles?: Record<string, BodyDiagramSectionStyle>;
}

const VB_W = 1762;
const VB_H = 3297;
const BACK_SVG = '/images/back.svg';

export function BodyAvatarBack({ onZoneClick, sectionStyles }: BodyAvatarBackProps) {
  return (
    <BodyDiagramCompositeSvg
      viewBoxWidth={VB_W}
      viewBoxHeight={VB_H}
      artworkHref={BACK_SVG}
      artworkTitle="Back view of the body"
      ariaGroupLabel="Back body view"
      zones={bodyBackOverlayZones}
      onZoneClick={onZoneClick}
      sectionStyles={sectionStyles}
    />
  );
}
