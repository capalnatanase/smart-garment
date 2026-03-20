interface BodyAvatarBackProps {
  onZoneClick: (slug: string) => void;
}

const ZONE_CLASS =
  'cursor-pointer fill-emerald-500/10 stroke-emerald-400/40 stroke-[1] hover:fill-emerald-500/25 hover:stroke-emerald-500/70 focus:fill-emerald-500/25 focus:stroke-emerald-500/70 focus:outline-none transition-colors';

export function BodyAvatarBack({ onZoneClick }: BodyAvatarBackProps) {
  const handle = (slug: string) => (e: React.MouseEvent | React.KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onZoneClick(slug);
  };

  return (
    <svg viewBox="0 0 180 480" className="w-full h-auto" role="group" aria-label="Back body view">
      {/* Human silhouette — back view (same outline as front) */}
      <g fill="none" stroke="#b0b0b0" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        <ellipse cx="90" cy="38" rx="22" ry="28" />
        <line x1="82" y1="66" x2="82" y2="78" />
        <line x1="98" y1="66" x2="98" y2="78" />
        <path d="M82 78 Q60 82 52 95 L48 120 L46 155 Q45 175 50 195 L55 210 Q58 220 60 230 L62 245" />
        <path d="M98 78 Q120 82 128 95 L132 120 L134 155 Q135 175 130 195 L125 210 Q122 220 120 230 L118 245" />
        <path d="M62 245 Q65 260 68 270 Q72 280 75 285" />
        <path d="M118 245 Q115 260 112 270 Q108 280 105 285" />
        <path d="M75 285 Q80 295 83 300 Q87 305 90 308" />
        <path d="M105 285 Q100 295 97 300 Q93 305 90 308" />
        <path d="M128 95 Q138 100 143 110 L148 135 Q150 150 150 165 L148 185 Q146 200 142 210" />
        <path d="M142 210 Q140 218 138 222 Q135 228 132 230" />
        <path d="M52 95 Q42 100 37 110 L32 135 Q30 150 30 165 L32 185 Q34 200 38 210" />
        <path d="M38 210 Q40 218 42 222 Q45 228 48 230" />
        <ellipse cx="45" cy="228" rx="8" ry="10" />
        <ellipse cx="135" cy="228" rx="8" ry="10" />
        <path d="M105 285 L108 320 L110 350 L112 380 L113 410 L112 435 L110 455 Q108 465 100 468 L95 468" />
        <path d="M75 285 L72 320 L70 350 L68 380 L67 410 L68 435 L70 455 Q72 465 80 468 L85 468" />
        <path d="M90 308 L88 320 L86 350 L85 380 L84 410 L85 435 L85 455 L85 468" />
        <path d="M90 308 L92 320 L94 350 L95 380 L96 410 L95 435 L95 455 L95 468" />
        <path d="M80 468 L75 472 Q70 475 72 478 L85 478 L95 478 Q98 475 95 472 L95 468" />
        <path d="M100 468 L97 472 Q94 475 96 478 L105 478 L110 478 Q112 475 108 472 L105 468" />
        {/* Spine line to distinguish back view */}
        <line x1="90" y1="78" x2="90" y2="270" stroke="#d1d5db" strokeWidth="0.8" strokeDasharray="4,4" />
      </g>

      <g stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="3,3" fill="none">
        <line x1="30" y1="78" x2="150" y2="78" />
        <line x1="45" y1="195" x2="135" y2="195" />
        <line x1="65" y1="285" x2="115" y2="285" />
        <line x1="60" y1="380" x2="120" y2="380" />
      </g>

      {/* CLICKABLE ZONES */}

      <ellipse
        cx="90" cy="38" rx="25" ry="32"
        className={ZONE_CLASS}
        role="button" tabIndex={0}
        aria-label="Back Head/Face — select to report discomfort"
        onClick={handle('back-head-face')}
        onKeyDown={handle('back-head-face')}
      />

      {/* Left shoulder (viewer's left on back = anatomical left) */}
      <rect
        x="30" y="78" width="38" height="50" rx="8"
        className={ZONE_CLASS}
        role="button" tabIndex={0}
        aria-label="Back left shoulder — select to report discomfort"
        onClick={handle('back-left-shoulder')}
        onKeyDown={handle('back-left-shoulder')}
      />

      {/* Right shoulder (viewer's right on back = anatomical right) */}
      <rect
        x="112" y="78" width="38" height="50" rx="8"
        className={ZONE_CLASS}
        role="button" tabIndex={0}
        aria-label="Back right shoulder — select to report discomfort"
        onClick={handle('back-right-shoulder')}
        onKeyDown={handle('back-right-shoulder')}
      />

      {/* Left wrist (viewer's left) */}
      <rect
        x="25" y="180" width="30" height="55" rx="8"
        className={ZONE_CLASS}
        role="button" tabIndex={0}
        aria-label="Back left wrist — select to report discomfort"
        onClick={handle('back-left-wrist')}
        onKeyDown={handle('back-left-wrist')}
      />

      {/* Right wrist (viewer's right) */}
      <rect
        x="125" y="180" width="30" height="55" rx="8"
        className={ZONE_CLASS}
        role="button" tabIndex={0}
        aria-label="Back right wrist — select to report discomfort"
        onClick={handle('back-right-wrist')}
        onKeyDown={handle('back-right-wrist')}
      />

      <rect
        x="58" y="195" width="64" height="90" rx="8"
        className={ZONE_CLASS}
        role="button" tabIndex={0}
        aria-label="Back lower torso and crotch — select to report discomfort"
        onClick={handle('back-lower-torso-crotch')}
        onKeyDown={handle('back-lower-torso-crotch')}
      />

      <rect
        x="62" y="290" width="56" height="85" rx="8"
        className={ZONE_CLASS}
        role="button" tabIndex={0}
        aria-label="Back thighs — select to report discomfort"
        onClick={handle('back-thighs')}
        onKeyDown={handle('back-thighs')}
      />

      {/* Left shin and ankle (viewer's left) */}
      <rect
        x="60" y="382" width="30" height="90" rx="8"
        className={ZONE_CLASS}
        role="button" tabIndex={0}
        aria-label="Back left shin and ankle — select to report discomfort"
        onClick={handle('back-left-shin-ankle')}
        onKeyDown={handle('back-left-shin-ankle')}
      />

      {/* Right shin and ankle (viewer's right) */}
      <rect
        x="92" y="382" width="30" height="90" rx="8"
        className={ZONE_CLASS}
        role="button" tabIndex={0}
        aria-label="Back right shin and ankle — select to report discomfort"
        onClick={handle('back-right-shin-ankle')}
        onKeyDown={handle('back-right-shin-ankle')}
      />
    </svg>
  );
}
