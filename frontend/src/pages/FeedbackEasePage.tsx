import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { assessmentSessionsApi } from '../api/endpoints';
import type { AssessmentFeedback } from '../api/endpoints';
import { hasAuthToken } from '../api/client';
import { FeedbackProgressHeader } from '../components/FeedbackProgressHeader';

const EASE_OPTIONS = [
  { value: 'very_easy' as const, label: 'Very Easy' },
  { value: 'easy' as const, label: 'Easy' },
  { value: 'difficult' as const, label: 'Difficult' },
  { value: 'very_difficult' as const, label: 'Very Difficult' },
];

interface LocationState {
  feedback?: Partial<AssessmentFeedback>;
}

export function FeedbackEasePage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState | null };
  const [easeDon, setEaseDon] = useState<AssessmentFeedback['ease_don'] | null>(null);
  const [easeAdjust, setEaseAdjust] = useState<AssessmentFeedback['ease_adjust'] | null>(null);

  const { data: sessionData } = useQuery({
    queryKey: ['assessment-session-current'],
    queryFn: () => assessmentSessionsApi.current(),
    enabled: hasAuthToken(),
  });

  const session = sessionData?.data ?? null;

  if (!hasAuthToken()) {
    navigate('/login', { replace: true });
    return null;
  }
  if (!session) {
    navigate('/garment-details', { replace: true });
    return null;
  }

  const handleContinue = () => {
    if (easeDon == null || easeAdjust == null) return;
    navigate('/assessment/feedback/comfort', {
      state: {
        feedback: {
          ...state?.feedback,
          ease_don: easeDon,
          ease_adjust: easeAdjust,
        },
      },
    });
  };

  const handleBack = () => navigate('/assessment/feedback/yes-no');

  const canContinue = easeDon != null && easeAdjust != null;

  return (
    <div className="min-h-svh flex flex-col bg-white px-6 py-8 max-w-mobile mx-auto">
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900">Fit Feedback Questions</h2>
      </div>
      <p className="mb-6 text-sm text-gray-600">
        Answer these questions on a scale of Very Easy to Very Difficult.
      </p>

      <div className="space-y-8 mb-8">
        <div role="group" aria-labelledby="ease-don">
          <p id="ease-don" className="text-sm font-medium text-gray-900 mb-3">
            How easy was the clothing to don?
          </p>
          <div className="flex flex-wrap gap-2">
            {EASE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setEaseDon(opt.value)}
                aria-pressed={easeDon === opt.value}
                className={`flex-1 min-w-[calc(50%-4px)] h-12 rounded-lg font-medium border-2 text-sm ${
                  easeDon === opt.value ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div role="group" aria-labelledby="ease-adjust">
          <p id="ease-adjust" className="text-sm font-medium text-gray-900 mb-3">
            How easy was the clothing to adjust the fit?
          </p>
          <div className="flex flex-wrap gap-2">
            {EASE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setEaseAdjust(opt.value)}
                aria-pressed={easeAdjust === opt.value}
                className={`flex-1 min-w-[calc(50%-4px)] h-12 rounded-lg font-medium border-2 text-sm ${
                  easeAdjust === opt.value ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <FeedbackProgressHeader step={2} onBack={handleBack} />

      <div className="mt-6">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
