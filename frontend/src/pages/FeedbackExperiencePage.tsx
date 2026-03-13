import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { assessmentSessionsApi } from '../api/endpoints';
import type { AssessmentFeedback } from '../api/endpoints';
import { hasAuthToken } from '../api/client';
import { FeedbackProgressHeader } from '../components/FeedbackProgressHeader';

const STAR_COUNT = 5;

interface LocationState {
  feedback?: Partial<AssessmentFeedback>;
}

export function FeedbackExperiencePage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState | null };
  const [rating, setRating] = useState<number | null>(null);

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
    if (rating == null) return;
    navigate('/assessment/complete', {
      state: {
        feedback: {
          ...state?.feedback,
          experience_rating: rating,
        },
      },
    });
  };

  const handleBack = () => navigate('/assessment/feedback/comfort');

  return (
    <div className="min-h-svh flex flex-col bg-white px-6 py-8 max-w-mobile mx-auto pb-24">
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900">Fit Assessment</h2>
      </div>
      <p className="mb-6 text-sm text-gray-600">
        Rate your experience completing this feedback form.
      </p>

      <div className="mb-8 flex gap-2 justify-center" role="group" aria-label="Star rating 1 to 5">
        {Array.from({ length: STAR_COUNT }, (_, i) => i + 1).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            aria-pressed={rating === value}
            aria-label={`${value} star${value === 1 ? '' : 's'}`}
            className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          >
            {rating != null && value <= rating ? (
              <svg className="w-10 h-10 text-indigo-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            )}
          </button>
        ))}
      </div>

      <FeedbackProgressHeader step={4} onBack={handleBack} />

      <div className="fixed bottom-0 left-0 right-0 max-w-mobile mx-auto p-6 bg-white border-t border-gray-200">
        <button
          type="button"
          onClick={handleContinue}
          disabled={rating == null}
          className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
