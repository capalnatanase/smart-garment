import { useState } from 'react';
import type { BodyZone } from '../api/endpoints';
import { BodyAvatarFront } from './BodyAvatarFront';
import { BodyAvatarBack } from './BodyAvatarBack';
import { BodyAvatarSide } from './BodyAvatarSide';
import type { BodyDiagramSectionStyle } from './BodyDiagramCompositeSvg';

const BODY_VIEWS = ['front', 'back', 'side'] as const;
type BodyView = (typeof BODY_VIEWS)[number];

const VIEW_LABELS: Record<BodyView, string> = {
  front: 'Front',
  back: 'Back',
  side: 'Side',
};

interface BodyAvatarZoneSelectProps {
  zones: BodyZone[];
  markedSlugs?: string[];
  onZoneClick: (
    zone: BodyZone,
    meta: { view: BodyView; sectionId: string; sectionLabel: string }
  ) => void;
}

type SectionStyleMap = Record<string, BodyDiagramSectionStyle>;

const VIEW_SECTIONS: Record<BodyView, Record<string, string>> = {
  front: {
    '1': 'Upper Torso',
    '2': 'Bicep/Shoulder',
    '3': 'Forearm',
    '4': 'Lower Torso',
    '5': 'Thighs',
    '6': 'Knees',
    '7': 'Ankles',
    '8': 'Head',
  },
  back: {
    '1': 'Upper Torso',
    '2': 'Bicep/Shoulder',
    '3': 'Forearm',
    '4': 'Lower Torso',
    '5': 'Seat/Thighs',
    '6': 'Knees',
    '7': 'Ankles',
    '8': 'Head',
  },
  side: {
    '1': 'Head',
    '2': 'Upper Torso',
    '3': 'Lower Torso',
    '4': 'Thighs',
    '5': 'Knees',
    '6': 'Ankles',
  },
};

const DEFAULT_SECTION_STYLES: Record<BodyView, SectionStyleMap> = {
  front: {
    '1': { color: '#9469DD', size: 100, opacity: 35 }, // Upper torso
    '2': { color: '#FDF50D', size: 100, opacity: 35 }, // Bicep / Shoulder
    '3': { color: '#14F0DE', size: 100, opacity: 35 }, // Forearm
    '4': { color: '#43F94F', size: 100, opacity: 35 }, // Lower torso
    '5': { color: '#FF941A', size: 100, opacity: 35 }, // Thighs
    '6': { color: '#2BDABC', size: 100, opacity: 70 }, // Knees
    '7': { color: '#FB0E81', size: 100, opacity: 45 }, // Ankles
    '8': { color: '#DC2626', size: 100, opacity: 35 }, // Head
  },
  back: {
    '1': { color: '#9469DD', size: 100, opacity: 35 }, // Upper torso
    '2': { color: '#FDF50D', size: 100, opacity: 35 }, // Bicep / Shoulder
    '3': { color: '#14F0DE', size: 100, opacity: 35 }, // Forearm
    '4': { color: '#43F94F', size: 100, opacity: 35 }, // Lower torso
    '5': { color: '#FF941A', size: 100, opacity: 35 }, // Thighs
    '6': { color: '#2BDABC', size: 100, opacity: 70 }, // Knees
    '7': { color: '#FB0E81', size: 100, opacity: 45 }, // Ankles
    '8': { color: '#DC2626', size: 100, opacity: 35 }, // Head
  },
  side: {
    '1': { color: '#DC2626', size: 100, opacity: 35 }, // Head
    '2': { color: '#9469DD', size: 100, opacity: 35 }, // Upper torso
    '3': { color: '#43F94F', size: 100, opacity: 35 }, // Lower torso
    '4': { color: '#FF941A', size: 100, opacity: 35 }, // Thighs
    '5': { color: '#2BDABC', size: 100, opacity: 70 }, // Knees
    '6': { color: '#FB0E81', size: 100, opacity: 45 }, // Ankles
  },
};

export function BodyAvatarZoneSelect({ zones, markedSlugs = [], onZoneClick }: BodyAvatarZoneSelectProps) {
  const [view, setView] = useState<BodyView>('front');
  const zoneBySlug = new Map(zones.map((z) => [z.slug, z]));

  const handleSlugClick = (slug: string, sectionId: string) => {
    const zone = zoneBySlug.get(slug);
    if (!zone) return;
    const sectionLabel = VIEW_SECTIONS[view][sectionId] ?? zone.name;
    onZoneClick(zone, { view, sectionId, sectionLabel });
  };

  return (
    <div className="mb-6">
      <div
        className="flex rounded-lg border border-gray-200 bg-gray-50 p-1 mb-4"
        role="tablist"
        aria-label="Body view"
      >
        {BODY_VIEWS.map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            aria-controls={`body-view-panel-${v}`}
            id={`body-view-tab-${v}`}
            onClick={() => setView(v)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-md transition-colors ${
              view === v
                ? 'bg-white text-indigo-700 shadow-sm border border-gray-200/80'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {VIEW_LABELS[v]}
          </button>
        ))}
      </div>

      <div
        id={`body-view-panel-${view}`}
        role="tabpanel"
        aria-labelledby={`body-view-tab-${view}`}
        className="flex justify-center"
      >
        <div className="w-full max-w-[220px]" role="group" aria-label="Select a body area where you felt discomfort">
          {view === 'front' && (
            <BodyAvatarFront
              onZoneClick={handleSlugClick}
              sectionStyles={DEFAULT_SECTION_STYLES.front}
              markedSlugs={markedSlugs}
            />
          )}
          {view === 'back' && (
            <BodyAvatarBack
              onZoneClick={handleSlugClick}
              sectionStyles={DEFAULT_SECTION_STYLES.back}
              markedSlugs={markedSlugs}
            />
          )}
          {view === 'side' && (
            <BodyAvatarSide
              onZoneClick={handleSlugClick}
              sectionStyles={DEFAULT_SECTION_STYLES.side}
              markedSlugs={markedSlugs}
            />
          )}
        </div>
      </div>
    </div>
  );
}
