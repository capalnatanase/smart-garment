import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { assessmentSessionsApi } from '../api/endpoints';
import type { AssessmentFeedback } from '../api/endpoints';
import { hasAuthToken } from '../api/client';
import { FeedbackProgressHeader } from '../components/FeedbackProgressHeader';

const COMFORT_OPTIONS = [
  { value: 'very_comfortable' as const, label: 'Very Comfortable' },
  { value: 'comfortable' as const, label: 'Comfortable' },
  { value: 'uncomfortable' as const, label: 'Uncomfortable' },
  { value: 'very_uncomfortable' as const, label: 'Very Uncomfortable' },
];

interface LocationState {
  feedback?: Partial<AssessmentFeedback>;
}

export function FeedbackComfortPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState | null };
  const [comfort, setComfort] = useState<AssessmentFeedback['comfort'] | null>(null);

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

  const handleNext = () => {
    if (comfort == null) return;
    navigate('/assessment/feedback/experience', {
      state: {
        feedback: {
          ...state?.feedback,
          comfort,
        },
      },
    });
  };

  const handleBack = () => navigate('/assessment/feedback/ease');

  return (
    <div className="min-h-svh flex flex-col bg-white px-6 py-8 max-w-mobile mx-auto pb-24">
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900">Fit Assessment</h2>
      </div>
      <p className="mb-6 text-sm text-gray-600">
        Answer this question on a scale of Very Comfortable to Very Uncomfortable.
      </p>

      <div className="mb-8" role="group" aria-labelledby="comfort-q">
        <p id="comfort-q" className="text-sm font-medium text-gray-900 mb-3">
          How comfortable was the clothing during the functional assessment?
        </p>
        <div className="flex flex-wrap gap-2">
          {COMFORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setComfort(opt.value)}
              aria-pressed={comfort === opt.value}
              className={`flex-1 min-w-[calc(50%-4px)] h-12 rounded-lg font-medium border-2 text-sm ${
                comfort === opt.value ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <FeedbackProgressHeader step={3} onBack={handleBack} />

      <div className="fixed bottom-0 left-0 right-0 max-w-mobile mx-auto p-6 bg-white border-t border-gray-200">
        <button
          type="button"
          onClick={handleNext}
          disabled={comfort == null}
          className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
