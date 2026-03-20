interface BodyAvatarSideProps {
  onZoneClick: (slug: string) => void;
}

const ZONE_CLASS =
  'cursor-pointer fill-amber-500/10 stroke-amber-400/40 stroke-[1] hover:fill-amber-500/25 hover:stroke-amber-500/70 focus:fill-amber-500/25 focus:stroke-amber-500/70 focus:outline-none transition-colors';

export function BodyAvatarSide({ onZoneClick }: BodyAvatarSideProps) {
  const handle = (slug: string) => (e: React.MouseEvent | React.KeyboardEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    onZoneClick(slug);
  };

  return (
    <svg viewBox="0 0 180 480" className="w-full h-auto" role="group" aria-label="Side body view">
      {/* Human silhouette — side profile facing right */}
      <g fill="none" stroke="#b0b0b0" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
        {/* Head profile */}
        <path d="M75 8 Q90 5 95 15 Q100 25 98 38 Q95 50 90 58 Q85 65 78 66 L72 66 Q60 62 55 50 Q50 38 52 25 Q55 12 65 8 Z" />
        {/* Neck */}
        <path d="M78 66 L78 78" />
        <path d="M88 60 L88 78" />
        {/* Torso front line */}
        <path d="M88 78 Q95 82 100 95 L102 120 Q104 145 102 170 L98 195 Q95 210 92 230 L88 250" />
        {/* Torso back line */}
        <path d="M78 78 Q68 82 62 95 L58 120 Q55 145 56 170 L58 195 Q60 210 62 230 L65 250" />
        {/* Hip to crotch */}
        <path d="M88 250 Q90 260 90 270 Q88 280 85 285" />
        <path d="M65 250 Q63 260 63 270 Q65 280 68 285" />
        {/* Front arm */}
        <path d="M100 95 Q108 100 112 110 L116 135 Q118 155 116 175 L112 200 Q108 215 105 225" />
        <ellipse cx="104" cy="228" rx="7" ry="9" />
        {/* Back of arm (slightly behind body) */}
        <path d="M62 95 Q55 98 50 105 L46 125 Q44 140 44 155 L45 175 Q47 190 50 200" />
        <ellipse cx="50" cy="204" rx="6" ry="8" />
        {/* Front leg */}
        <path d="M85 285 Q88 300 90 320 L92 350 Q93 370 92 390 L90 420 Q88 440 86 455 Q84 465 80 468" />
        {/* Back leg */}
        <path d="M68 285 Q65 300 63 320 L62 350 Q60 370 60 390 L60 420 Q62 440 64 455 Q66 465 70 468" />
        {/* Foot */}
        <path d="M70 468 L65 472 Q60 476 65 478 L80 478 Q85 476 82 472 L80 468" />
        {/* Calf separation hint */}
        <path d="M76 308 Q77 330 78 360 Q78 390 77 420 Q76 440 75 460" stroke="#d1d5db" strokeWidth="0.6" strokeDasharray="3,3" />
      </g>

      <g stroke="#d1d5db" strokeWidth="0.5" strokeDasharray="3,3" fill="none">
        <line x1="40" y1="78" x2="120" y2="78" />
        <line x1="40" y1="195" x2="120" y2="195" />
        <line x1="55" y1="380" x2="100" y2="380" />
      </g>

      {/* CLICKABLE ZONES */}

      {/* Head */}
      <ellipse
        cx="76" cy="38" rx="28" ry="35"
        className={ZONE_CLASS}
        role="button" tabIndex={0}
        aria-label="Side head — select to report discomfort"
        onClick={handle('side-head')}
        onKeyDown={handle('side-head')}
      />

      {/* Shoulder and top arm */}
      <rect
        x="42" y="78" width="75" height="110" rx="8"
        className={ZONE_CLASS}
        role="button" tabIndex={0}
        aria-label="Side shoulder and top arm — select to report discomfort"
        onClick={handle('side-shoulder-top-arm')}
        onKeyDown={handle('side-shoulder-top-arm')}
      />

      {/* Hips and wrist */}
      <rect
        x="42" y="195" width="65" height="90" rx="8"
        className={ZONE_CLASS}
        role="button" tabIndex={0}
        aria-label="Side hips and wrist — select to report discomfort"
        onClick={handle('side-hips-wrist')}
        onKeyDown={handle('side-hips-wrist')}
      />

      {/* Lower legs */}
      <rect
        x="52" y="382" width="45" height="92" rx="8"
        className={ZONE_CLASS}
        role="button" tabIndex={0}
        aria-label="Side lower legs — select to report discomfort"
        onClick={handle('side-lower-legs')}
        onKeyDown={handle('side-lower-legs')}
      />
    </svg>
  );
}
