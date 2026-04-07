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
    '1': { color: '#7c3aed', size: 100, opacity: 50 },
    '2': { color: '#0284c7', size: 100, opacity: 50 },
    '3': { color: '#0d9488', size: 100, opacity: 50 },
    '4': { color: '#059669', size: 100, opacity: 50 },
    '5': { color: '#d97706', size: 100, opacity: 50 },
    '6': { color: '#ea580c', size: 100, opacity: 50 },
    '7': { color: '#e11d48', size: 100, opacity: 50 },
    '8': { color: '#dc2626', size: 100, opacity: 50 },
  },
  back: {
    '1': { color: '#7c3aed', size: 100, opacity: 50 },
    '2': { color: '#0284c7', size: 100, opacity: 50 },
    '3': { color: '#0d9488', size: 100, opacity: 50 },
    '4': { color: '#059669', size: 100, opacity: 50 },
    '5': { color: '#d97706', size: 100, opacity: 50 },
    '6': { color: '#ea580c', size: 100, opacity: 50 },
    '7': { color: '#e11d48', size: 100, opacity: 50 },
    '8': { color: '#dc2626', size: 100, opacity: 50 },
  },
  side: {
    '1': { color: '#dc2626', size: 100, opacity: 50 },
    '2': { color: '#0284c7', size: 100, opacity: 50 },
    '3': { color: '#0d9488', size: 100, opacity: 50 },
    '4': { color: '#059669', size: 100, opacity: 50 },
    '5': { color: '#d97706', size: 100, opacity: 50 },
    '6': { color: '#ea580c', size: 100, opacity: 50 },
  },
};

const DEFAULT_SELECTED_SECTION: Record<BodyView, string> = {
  front: '1',
  back: '1',
  side: '1',
};

export function BodyAvatarZoneSelect({ zones, onZoneClick }: BodyAvatarZoneSelectProps) {
  const [view, setView] = useState<BodyView>('front');
  const [showCustomizer, setShowCustomizer] = useState(false);
  const [sectionStylesByView, setSectionStylesByView] =
    useState<Record<BodyView, SectionStyleMap>>(DEFAULT_SECTION_STYLES);
  const [selectedSectionByView, setSelectedSectionByView] =
    useState<Record<BodyView, string>>(DEFAULT_SELECTED_SECTION);
  const zoneBySlug = new Map(zones.map((z) => [z.slug, z]));

  const handleSlugClick = (slug: string, sectionId: string) => {
    const zone = zoneBySlug.get(slug);
    if (!zone) return;
    const sectionLabel = VIEW_SECTIONS[view][sectionId] ?? zone.name;
    onZoneClick(zone, { view, sectionId, sectionLabel });
  };

  const activeSectionId = selectedSectionByView[view];
  const activeSectionStyle = sectionStylesByView[view][activeSectionId];

  const updateSectionStyle = (patch: Partial<BodyDiagramSectionStyle>) => {
    setSectionStylesByView((prev) => ({
      ...prev,
      [view]: {
        ...prev[view],
        [activeSectionId]: {
          ...prev[view][activeSectionId],
          ...patch,
        },
      },
    }));
  };

  const resetCurrentViewStyles = () => {
    setSectionStylesByView((prev) => ({
      ...prev,
      [view]: DEFAULT_SECTION_STYLES[view],
    }));
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
        className="flex flex-col gap-3"
      >
        <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Section Customizer</p>
            <button
              type="button"
              onClick={() => setShowCustomizer((v) => !v)}
              className="text-xs font-medium text-indigo-700 hover:text-indigo-900"
            >
              {showCustomizer ? 'Hide' : 'Show'}
            </button>
          </div>

          {showCustomizer && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs text-gray-600 flex flex-col gap-1">
                  Section
                  <select
                    value={activeSectionId}
                    onChange={(e) =>
                      setSelectedSectionByView((prev) => ({ ...prev, [view]: e.target.value }))
                    }
                    className="h-9 rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-800"
                  >
                    {Object.entries(VIEW_SECTIONS[view]).map(([id, label]) => (
                      <option key={id} value={id}>
                        {id}. {label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-xs text-gray-600 flex flex-col gap-1">
                  Color
                  <input
                    type="color"
                    value={activeSectionStyle.color}
                    onChange={(e) => updateSectionStyle({ color: e.target.value })}
                    className="h-9 w-full rounded-md border border-gray-300 bg-white p-1"
                  />
                </label>
              </div>

              <label className="text-xs text-gray-600 flex flex-col gap-1">
                Size: {activeSectionStyle.size}%
                <input
                  type="range"
                  min={70}
                  max={165}
                  step={1}
                  value={activeSectionStyle.size}
                  onChange={(e) => updateSectionStyle({ size: Number(e.target.value) })}
                />
              </label>

              <label className="text-xs text-gray-600 flex flex-col gap-1">
                Opacity: {activeSectionStyle.opacity}%
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={1}
                  value={activeSectionStyle.opacity}
                  onChange={(e) => updateSectionStyle({ opacity: Number(e.target.value) })}
                />
              </label>

              <button
                type="button"
                onClick={resetCurrentViewStyles}
                className="h-8 px-3 rounded-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:border-gray-400"
              >
                Reset {VIEW_LABELS[view]} Defaults
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-[220px]" role="group" aria-label="Select a body area where you felt discomfort">
            {view === 'front' && (
              <BodyAvatarFront onZoneClick={handleSlugClick} sectionStyles={sectionStylesByView.front} />
            )}
            {view === 'back' && (
              <BodyAvatarBack onZoneClick={handleSlugClick} sectionStyles={sectionStylesByView.back} />
            )}
            {view === 'side' && (
              <BodyAvatarSide onZoneClick={handleSlugClick} sectionStyles={sectionStylesByView.side} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
