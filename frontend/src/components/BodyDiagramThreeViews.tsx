/**
 * Renders the M1 Zone select body diagram as 3 separate images: Front, Back, Side.
 * Uses one composite image (same as Figma "Front Back Side 1") and splits it
 * into three panels via CSS background-position.
 *
 * Add the asset: export the "Front Back Side 1" frame from Figma (M1 - Zone select,
 * node 1-205) as PNG and save as frontend/public/body-diagram.png.
 */
const BODY_DIAGRAM_IMAGE = '/body-diagram.png';

const SIDES = ['front', 'back', 'side'] as const;
const SIDE_LABELS: Record<(typeof SIDES)[number], string> = {
  front: 'FRONT',
  back: 'BACK',
  side: 'SIDE',
};

export function BodyDiagramThreeViews() {
  return (
    <div className="grid grid-cols-3 gap-2 mb-6" role="img" aria-label="Body views: Front, Back, Side">
      {SIDES.map((side, i) => (
        <div
          key={side}
          className="flex flex-col items-center rounded-lg border border-gray-200 overflow-hidden bg-gray-50"
        >
          <div
            className="w-full aspect-[116/309] bg-gray-200 bg-no-repeat"
            style={{
              backgroundImage: `url(${BODY_DIAGRAM_IMAGE})`,
              backgroundSize: '300% 100%',
              backgroundPosition: `${i * 50}% 0`,
            }}
            role="presentation"
          />
          <span className="py-2 text-xs font-semibold text-gray-700 uppercase tracking-wide">
            {SIDE_LABELS[side]}
          </span>
        </div>
      ))}
    </div>
  );
}
