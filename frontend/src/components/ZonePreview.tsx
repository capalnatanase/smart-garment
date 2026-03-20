/**
 * Renders a custom anatomical SVG preview for each body zone.
 * Each zone has a dedicated drawing showing the relevant body region
 * with clean stroke outlines, dashed guide lines, and an indigo highlight.
 */
import React from 'react';

const S = { fill: 'none', stroke: '#b0b0b0', strokeWidth: 4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const DASH = { stroke: '#b0b0b0', strokeWidth: 3, strokeDasharray: '8 8', opacity: 0.8 };
const HL = 'fill-indigo-500/15 stroke-indigo-500/40 stroke-[1]';

/* ──────────────────── HEAD / FACE ──────────────────── */

function HeadFrontPreview() {
  return (
    <svg viewBox="0 0 220 260" className="w-full h-full">
      <line x1="10" y1="200" x2="210" y2="200" {...DASH} />
      {/* Neck */}
      <path d="M85 200 L85 175 Q85 165 90 160" {...S} />
      <path d="M135 200 L135 175 Q135 165 130 160" {...S} />
      {/* Head oval */}
      <ellipse cx="110" cy="100" rx="55" ry="72" {...S} />
      {/* Eyes */}
      <ellipse cx="90" cy="90" rx="10" ry="5" fill="none" stroke="#b0b0b0" strokeWidth="2" />
      <ellipse cx="130" cy="90" rx="10" ry="5" fill="none" stroke="#b0b0b0" strokeWidth="2" />
      {/* Nose */}
      <path d="M110 100 L106 118 Q110 122 114 118 Z" fill="none" stroke="#b0b0b0" strokeWidth="2" />
      {/* Mouth */}
      <path d="M95 135 Q110 145 125 135" fill="none" stroke="#b0b0b0" strokeWidth="2" />
      {/* Ears */}
      <path d="M55 85 Q45 100 55 115" {...S} />
      <path d="M165 85 Q175 100 165 115" {...S} />
      <ellipse cx="110" cy="100" rx="55" ry="72" className={HL} />
    </svg>
  );
}

function HeadSidePreview() {
  return (
    <svg viewBox="0 0 220 260" className="w-full h-full">
      <line x1="10" y1="210" x2="210" y2="210" {...DASH} />
      {/* Neck */}
      <path d="M100 210 L100 185" {...S} />
      <path d="M140 210 L145 185" {...S} />
      {/* Head profile */}
      <path d="M100 185 Q80 180 70 160 Q55 135 55 105 Q55 60 80 35 Q100 15 130 15 Q160 20 170 45 Q180 70 175 100 L165 130 Q155 150 145 165 Q140 175 145 185" {...S} />
      {/* Eye */}
      <ellipse cx="155" cy="90" rx="8" ry="5" fill="none" stroke="#b0b0b0" strokeWidth="2" />
      {/* Nose */}
      <path d="M175 100 L180 115 L170 118" fill="none" stroke="#b0b0b0" strokeWidth="2" />
      {/* Ear */}
      <path d="M75 85 Q60 100 75 115" {...S} />
      {/* Mouth */}
      <path d="M162 130 Q170 135 165 140" fill="none" stroke="#b0b0b0" strokeWidth="2" />
      <path d="M100 185 Q80 180 70 160 Q55 135 55 105 Q55 60 80 35 Q100 15 130 15 Q160 20 170 45 Q180 70 175 100 L165 130 Q155 150 145 165 Q140 175 145 185 Z" className={HL} />
    </svg>
  );
}

/* ──────────────────── SHOULDER ──────────────────── */

function ShoulderFrontPreview({ mirror }: { mirror?: boolean }) {
  const tx = mirror ? 'translate(220, 0) scale(-1, 1)' : undefined;
  return (
    <svg viewBox="0 0 220 220" className="w-full h-full">
      <line x1="10" y1="180" x2="210" y2="180" {...DASH} />
      <g transform={tx}>
        {/* Neck to shoulder outer */}
        <path d="M80 10 Q60 10 40 30 Q20 55 15 85 C12 110 15 145 20 180" {...S} />
        {/* Neck inner / torso */}
        <path d="M80 10 L80 30 Q82 50 90 65 L95 85 Q100 110 105 145 L108 180" {...S} />
        {/* Shoulder cap */}
        <path d="M80 10 Q55 5 40 30" fill="none" stroke="#b0b0b0" strokeWidth="3" strokeLinecap="round" />
        {/* Arm detail */}
        <path d="M15 85 Q10 95 12 110" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeDasharray="4 4" />
      </g>
      <path d={mirror
        ? "M140 10 Q165 5 180 30 Q200 55 205 85 C208 110 205 145 200 180 L112 180 L115 145 Q120 110 125 85 L130 65 Q138 50 140 30 Z"
        : "M80 10 Q55 5 40 30 Q20 55 15 85 C12 110 15 145 20 180 L108 180 L105 145 Q100 110 95 85 L90 65 Q82 50 80 30 Z"
      } className={HL} />
    </svg>
  );
}

function SideShoulderTopArmPreview() {
  return (
    <svg viewBox="0 0 220 220" className="w-full h-full">
      <line x1="10" y1="120" x2="210" y2="120" {...DASH} />
      <path d="M 150 10 C 175 25, 198 50, 205 82 C 210 105, 208 138, 202 170 C 198 190, 196 205, 194 215" {...S} />
      <path d="M 95 18 C 82 30, 78 48, 84 66 C 90 84, 96 98, 100 118 C 104 138, 106 154, 114 170 C 120 182, 119 194, 108 208" {...S} />
      <path d="M 95 18 C 108 2, 138 2, 150 10" {...S} />
      <path d="M 95 18 C 108 2, 138 2, 150 10 C 175 25, 198 50, 205 82 C 210 105, 208 138, 202 170 C 198 190, 196 205, 194 215 L 108 208 C 119 194, 120 182, 114 170 C 106 154, 104 138, 100 118 C 96 98, 90 84, 84 66 C 78 48, 82 30, 95 18 Z" className={HL} />
    </svg>
  );
}

/* ──────────────────── WRIST / FOREARM ──────────────────── */

function WristPreview({ mirror }: { mirror?: boolean }) {
  const tx = mirror ? 'translate(200, 0) scale(-1, 1)' : undefined;
  return (
    <svg viewBox="0 0 200 260" className="w-full h-full">
      <line x1="10" y1="50" x2="190" y2="50" {...DASH} />
      <g transform={tx}>
        {/* Forearm outer */}
        <path d="M55 10 Q50 40 48 80 Q46 120 45 160 Q44 190 50 210" {...S} />
        {/* Forearm inner */}
        <path d="M120 10 Q115 40 110 80 Q108 120 108 160 Q108 190 112 210" {...S} />
        {/* Wrist crease */}
        <path d="M50 175 Q80 180 112 175" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeDasharray="4 4" />
        {/* Hand */}
        <path d="M50 210 Q48 225 55 240 Q70 255 90 255 Q108 255 115 240 Q120 225 112 210" {...S} />
        {/* Fingers hint */}
        <path d="M62 240 L60 252" fill="none" stroke="#b0b0b0" strokeWidth="2" />
        <path d="M75 242 L74 256" fill="none" stroke="#b0b0b0" strokeWidth="2" />
        <path d="M88 242 L89 256" fill="none" stroke="#b0b0b0" strokeWidth="2" />
        <path d="M100 240 L102 252" fill="none" stroke="#b0b0b0" strokeWidth="2" />
      </g>
      <rect x="38" y="130" width="90" height="90" rx="10" className={HL} />
    </svg>
  );
}

/* ──────────────────── LOWER TORSO / CROTCH ──────────────────── */

function LowerTorsoCrotchPreview() {
  return (
    <svg viewBox="0 0 300 400" className="w-full h-full">
      <line x1="30" y1="60" x2="270" y2="60" {...DASH} />
      <g fill="none" stroke="#b0b0b0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M90 60 C110 40, 190 40, 210 60" />
        <path d="M90 60 C70 100, 70 200, 110 300" />
        <path d="M210 60 C230 100, 230 200, 190 300" />
        <path d="M140 180 C135 230, 130 260, 120 320" />
        <path d="M160 180 C165 230, 170 260, 180 320" />
        <path d="M120 180 C140 200, 160 200, 180 180" />
      </g>
      <path d="M90 60 C110 40, 190 40, 210 60 C230 100, 230 200, 190 300 L180 320 C170 260, 165 230, 160 180 C160 200, 140 200, 140 180 C135 230, 130 260, 120 320 L110 300 C70 200, 70 100, 90 60 Z" className={HL} />
    </svg>
  );
}

/* ──────────────────── THIGHS ──────────────────── */

function ThighsPreview() {
  return (
    <svg viewBox="0 0 240 280" className="w-full h-full">
      <line x1="10" y1="40" x2="230" y2="40" {...DASH} />
      <line x1="10" y1="240" x2="230" y2="240" {...DASH} />
      <g fill="none" stroke="#b0b0b0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {/* Crotch top */}
        <path d="M70 10 Q90 40 100 50 Q110 60 120 60 Q130 60 140 50 Q150 40 170 10" />
        {/* Outer left thigh */}
        <path d="M70 10 Q55 50 50 100 Q45 150 48 200 Q50 230 55 260" />
        {/* Outer right thigh */}
        <path d="M170 10 Q185 50 190 100 Q195 150 192 200 Q190 230 185 260" />
        {/* Inner left thigh */}
        <path d="M100 50 Q95 80 92 120 Q90 160 90 200 Q90 230 92 260" />
        {/* Inner right thigh */}
        <path d="M140 50 Q145 80 148 120 Q150 160 150 200 Q150 230 148 260" />
        {/* Knee hints */}
        <path d="M52 210 Q70 220 90 210" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeDasharray="4 4" />
        <path d="M148 210 Q168 220 188 210" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeDasharray="4 4" />
      </g>
      <path d="M70 10 Q55 50 50 100 Q45 150 48 200 Q50 230 55 260 L92 260 Q90 230 90 200 Q90 160 92 120 Q95 80 100 50 Q110 60 120 60 Q130 60 140 50 Q145 80 148 120 Q150 160 150 200 Q150 230 148 260 L185 260 Q190 230 192 200 Q195 150 190 100 Q185 50 170 10 Q150 40 140 50 Q130 60 120 60 Q110 60 100 50 Q90 40 70 10 Z" className={HL} />
    </svg>
  );
}

/* ──────────────────── SHIN AND ANKLE ──────────────────── */

function ShinAnklePreview({ mirror }: { mirror?: boolean }) {
  const tx = mirror ? 'translate(180, 0) scale(-1, 1)' : undefined;
  return (
    <svg viewBox="0 0 180 320" className="w-full h-full">
      <line x1="10" y1="40" x2="170" y2="40" {...DASH} />
      <g transform={tx}>
        <g fill="none" stroke="#b0b0b0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          {/* Outer shin */}
          <path d="M45 10 Q40 50 38 100 Q36 150 38 200 Q40 240 42 265 Q44 280 50 290" />
          {/* Inner shin */}
          <path d="M120 10 Q115 50 112 100 Q110 150 112 200 Q114 240 115 265 Q116 280 118 290" />
          {/* Knee cap */}
          <path d="M50 20 Q80 35 115 20" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeDasharray="4 4" />
          {/* Ankle */}
          <path d="M50 290 Q48 295 50 300 Q55 308 70 310 Q90 312 105 310 Q115 308 118 300 Q120 295 118 290" />
          {/* Calf muscle hint */}
          <path d="M55 100 Q75 115 108 100" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeDasharray="4 4" />
        </g>
      </g>
      <path d={mirror
        ? "M135 10 Q140 50 142 100 Q144 150 142 200 Q140 240 138 265 Q136 280 130 290 Q132 295 130 300 Q125 308 110 310 Q90 312 75 310 Q65 308 62 300 Q60 295 62 290 Q64 280 65 265 Q66 240 68 200 Q70 150 68 100 Q65 50 60 10 Z"
        : "M45 10 Q40 50 38 100 Q36 150 38 200 Q40 240 42 265 Q44 280 50 290 Q48 295 50 300 Q55 308 70 310 Q90 312 105 310 Q115 308 118 300 Q120 295 118 290 Q116 280 115 265 Q114 240 112 200 Q110 150 112 100 Q115 50 120 10 Z"
      } className={HL} />
    </svg>
  );
}

/* ──────────────────── SIDE HIPS & WRIST ──────────────────── */

function SideHipsWristPreview() {
  return (
    <svg viewBox="0 0 220 240" className="w-full h-full">
      <line x1="10" y1="30" x2="210" y2="30" {...DASH} />
      <line x1="10" y1="200" x2="210" y2="200" {...DASH} />
      <g fill="none" stroke="#b0b0b0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {/* Back contour */}
        <path d="M60 10 Q50 30 48 60 Q45 100 50 140 Q55 170 60 200 L62 230" />
        {/* Front contour */}
        <path d="M150 10 Q160 30 165 60 Q168 100 162 140 Q155 170 148 200 L145 230" />
        {/* Waist crease */}
        <path d="M55 50 Q100 55 160 50" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeDasharray="4 4" />
        {/* Hip bone hint */}
        <path d="M155 85 Q145 95 140 110" fill="none" stroke="#b0b0b0" strokeWidth="2" />
        {/* Arm / wrist hanging */}
        <path d="M148 30 Q152 60 155 90 Q158 120 155 150 Q150 170 145 185" />
        <ellipse cx="142" cy="192" rx="10" ry="12" fill="none" stroke="#b0b0b0" strokeWidth="3" />
      </g>
      <path d="M60 10 Q50 30 48 60 Q45 100 50 140 Q55 170 60 200 L62 230 L145 230 L148 200 Q155 170 162 140 Q168 100 165 60 Q160 30 150 10 Z" className={HL} />
    </svg>
  );
}

/* ──────────────────── SIDE LOWER LEGS ──────────────────── */

function SideLowerLegsPreview() {
  return (
    <svg viewBox="0 0 200 300" className="w-full h-full">
      <line x1="10" y1="40" x2="190" y2="40" {...DASH} />
      <g fill="none" stroke="#b0b0b0" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        {/* Front shin */}
        <path d="M120 10 Q125 40 128 80 Q130 120 128 160 Q125 200 120 230 Q115 255 105 270" />
        {/* Back calf */}
        <path d="M65 10 Q55 40 50 80 Q48 120 52 160 Q58 200 65 230 Q70 255 75 270" />
        {/* Knee area */}
        <path d="M65 10 Q90 25 120 10" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeDasharray="4 4" />
        {/* Calf muscle */}
        <path d="M52 80 Q45 110 50 140" fill="none" stroke="#b0b0b0" strokeWidth="2" strokeDasharray="4 4" />
        {/* Ankle */}
        <path d="M75 270 Q72 278 75 283 Q82 290 92 290 Q102 290 105 283 Q108 278 105 270" />
        {/* Foot */}
        <path d="M75 283 Q70 288 65 290 Q60 292 58 288 Q55 282 60 278" fill="none" stroke="#b0b0b0" strokeWidth="3" />
        <path d="M105 283 L115 285 Q125 286 128 282 Q130 278 125 275" fill="none" stroke="#b0b0b0" strokeWidth="3" />
      </g>
      <path d="M65 10 Q55 40 50 80 Q48 120 52 160 Q58 200 65 230 Q70 255 75 270 Q72 278 75 283 Q82 290 92 290 Q102 290 105 283 Q108 278 105 270 Q115 255 120 230 Q125 200 128 160 Q130 120 128 80 Q125 40 120 10 Z" className={HL} />
    </svg>
  );
}

/* ──────────────────── SLUG → PREVIEW MAP ──────────────────── */

const ZONE_PREVIEWS: Record<string, () => React.ReactNode> = {
  'front-head-face': () => <HeadFrontPreview />,
  'back-head-face': () => <HeadFrontPreview />,
  'front-right-shoulder': () => <ShoulderFrontPreview />,
  'front-left-shoulder': () => <ShoulderFrontPreview mirror />,
  'back-left-shoulder': () => <ShoulderFrontPreview />,
  'back-right-shoulder': () => <ShoulderFrontPreview mirror />,
  'front-right-wrist': () => <WristPreview />,
  'front-left-wrist': () => <WristPreview mirror />,
  'back-left-wrist': () => <WristPreview />,
  'back-right-wrist': () => <WristPreview mirror />,
  'front-lower-torso-crotch': () => <LowerTorsoCrotchPreview />,
  'back-lower-torso-crotch': () => <LowerTorsoCrotchPreview />,
  'front-thighs': () => <ThighsPreview />,
  'back-thighs': () => <ThighsPreview />,
  'front-right-shin-ankle': () => <ShinAnklePreview />,
  'front-left-shin-ankle': () => <ShinAnklePreview mirror />,
  'back-left-shin-ankle': () => <ShinAnklePreview />,
  'back-right-shin-ankle': () => <ShinAnklePreview mirror />,
  'side-head': () => <HeadSidePreview />,
  'side-shoulder-top-arm': () => <SideShoulderTopArmPreview />,
  'side-hips-wrist': () => <SideHipsWristPreview />,
  'side-lower-legs': () => <SideLowerLegsPreview />,
};

/* ──────────────────── MAIN COMPONENT ──────────────────── */

interface ZonePreviewProps {
  slug: string;
  zoneName: string;
}

export function ZonePreview({ slug, zoneName }: ZonePreviewProps) {
  const renderPreview = ZONE_PREVIEWS[slug];

  if (!renderPreview) {
    return (
      <div className="w-36 h-36 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
        <span className="text-xs text-gray-500">{zoneName}</span>
      </div>
    );
  }

  return (
    <div
      className="w-36 h-36 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden"
      role="img"
      aria-label={`Zoomed view of ${zoneName}`}
    >
      {renderPreview()}
    </div>
  );
}
