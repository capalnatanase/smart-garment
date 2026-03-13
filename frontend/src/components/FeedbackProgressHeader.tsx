const FEEDBACK_STEP_COUNT = 4;

interface FeedbackProgressHeaderProps {
  /** Current step 1–4 */
  step: number;
  onBack: () => void;
  backLabel?: string;
}

export function FeedbackProgressHeader({
  step,
  onBack,
  backLabel = 'Back to previous question',
}: FeedbackProgressHeaderProps) {
  const current = Math.min(Math.max(1, step), FEEDBACK_STEP_COUNT);
  const percent = Math.round((current / FEEDBACK_STEP_COUNT) * 100);

  return (
    <div className="mt-8">
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
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={FEEDBACK_STEP_COUNT}
          aria-label={`Question ${current} of ${FEEDBACK_STEP_COUNT}`}
        >
          <div
            className="h-full rounded-full bg-[#4E86CE] transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
      <p className="text-sm text-gray-900 font-medium mt-1.5 text-center">
        Last few questions
      </p>
    </div>
  );
}
