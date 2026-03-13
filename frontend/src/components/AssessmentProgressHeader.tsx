const MOVEMENT_COUNT = 5;

interface AssessmentProgressHeaderProps {
  /** Current movement index (0-based) */
  movementIndex: number;
  onBack: () => void;
  backLabel?: string;
}

export function AssessmentProgressHeader({
  movementIndex,
  onBack,
  backLabel = 'Back to previous step',
}: AssessmentProgressHeaderProps) {
  const current = Math.min(Math.max(0, movementIndex), MOVEMENT_COUNT - 1);
  const progress = (current + 1) / MOVEMENT_COUNT;
  const percent = Math.round(progress * 100);

  return (
    <div className="mt-8">
      {/* Arrow and progress bar on the same line */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 text-gray-900 hover:text-gray-600 flex-shrink-0 self-center"
          aria-label={backLabel}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div
          className="flex-1 min-w-0 h-2 rounded-full bg-gray-200 overflow-hidden"
          role="progressbar"
          aria-valuenow={current + 1}
          aria-valuemin={1}
          aria-valuemax={MOVEMENT_COUNT}
          aria-label={`Movement ${current + 1} of ${MOVEMENT_COUNT}`}
        >
          <div
            className="h-full rounded-full bg-[#4E86CE] transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <p className="text-sm text-gray-900 font-medium mt-1.5 text-center">
        Movement {current + 1} of {MOVEMENT_COUNT}
      </p>
    </div>
  );
}
