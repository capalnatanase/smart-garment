import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assessmentSessionsApi } from '../api/endpoints';
import type { AssessmentFeedback } from '../api/endpoints';
import { hasAuthToken } from '../api/client';

const STAR_COUNT = 5;

interface LocationState {
  feedback?: AssessmentFeedback;
}

export function AssessmentCompletePage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState | null };
  const queryClient = useQueryClient();
  const feedback = state?.feedback;
  const experienceRating = feedback?.experience_rating ?? 0;

  const { data: sessionData } = useQuery({
    queryKey: ['assessment-session-current'],
    queryFn: () => assessmentSessionsApi.current(),
    enabled: hasAuthToken(),
  });

  const completeSession = useMutation({
    mutationFn: ({ sessionId, feedback: fb }: { sessionId: number; feedback?: AssessmentFeedback }) =>
      assessmentSessionsApi.complete(sessionId, fb),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-session-current'] });
      navigate('/garment-details', { replace: true });
    },
  });

  const session = sessionData?.data ?? null;

  if (!hasAuthToken()) {
    navigate('/login', { replace: true });
    return null;
  }

  const handleFinish = () => {
    if (!session) {
      navigate('/garment-details', { replace: true });
      return;
    }
    completeSession.mutate({ sessionId: session.id, feedback: feedback ?? undefined });
  };

  return (
    <div className="min-h-svh flex flex-col bg-white px-6 py-8 max-w-mobile mx-auto justify-center pb-24">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Thank you for completing this fit feedback!
        </h1>

        {experienceRating > 0 && (
          <div className="flex gap-2 justify-center" role="img" aria-label={`${experienceRating} out of ${STAR_COUNT} stars`}>
            {Array.from({ length: STAR_COUNT }, (_, i) => i + 1).map((value) => (
              <span key={value} className="text-indigo-600">
                {value <= experienceRating ? (
                  <svg className="w-10 h-10 inline-block" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 inline-block text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
              </span>
            ))}
          </div>
        )}

        {experienceRating > 0 && (
          <p className="text-sm text-gray-500">Rate your experience completing this feedback form</p>
        )}
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={handleFinish}
          disabled={completeSession.isPending}
          className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {completeSession.isPending ? 'Saving…' : 'Finish'}
        </button>
      </div>
    </div>
  );
}
