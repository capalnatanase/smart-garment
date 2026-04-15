import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { assessmentSessionsApi } from '../api/endpoints';
import type { AssessmentFeedback } from '../api/endpoints';
import { hasAuthToken } from '../api/client';
import { FeedbackProgressHeader } from '../components/FeedbackProgressHeader';

interface LocationState {
  feedback?: Partial<AssessmentFeedback>;
}

export function FeedbackYesNoPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: LocationState | null };
  const [fitYesNo, setFitYesNo] = useState<boolean | null>(null);
  const [reAdjustYesNo, setReAdjustYesNo] = useState<boolean | null>(null);

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
    if (fitYesNo === null || reAdjustYesNo === null) return;
    navigate('/assessment/feedback/ease', {
      state: {
        feedback: {
          ...state?.feedback,
          fit_yes_no: fitYesNo,
          re_adjust_yes_no: reAdjustYesNo,
        },
      },
    });
  };

  const handleBack = () => navigate('/assessment/movements/4/zones');

  const canContinue = fitYesNo !== null && reAdjustYesNo !== null;

  return (
    <div className="min-h-svh flex flex-col bg-white px-6 py-8 max-w-mobile mx-auto">
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900">Fit Feedback Questions</h2>
      </div>
      <p className="mb-6 text-sm text-gray-600">
        Answer the following questions Yes or No.
      </p>

      <div className="space-y-8 mb-8">
        <div role="group" aria-labelledby="q1">
          <p id="q1" className="text-sm font-medium text-gray-900 mb-3">
            Did the clothing fit you?
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFitYesNo(true)}
              aria-pressed={fitYesNo === true}
              className={`flex-1 h-12 rounded-lg font-medium border-2 ${
                fitYesNo === true ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setFitYesNo(false)}
              aria-pressed={fitYesNo === false}
              className={`flex-1 h-12 rounded-lg font-medium border-2 ${
                fitYesNo === false ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
              }`}
            >
              No
            </button>
          </div>
        </div>

        <div role="group" aria-labelledby="q2">
          <p id="q2" className="text-sm font-medium text-gray-900 mb-3">
            Did you have to re-adjust the garment during movements to keep it in the correct position?
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setReAdjustYesNo(true)}
              aria-pressed={reAdjustYesNo === true}
              className={`flex-1 h-12 rounded-lg font-medium border-2 ${
                reAdjustYesNo === true ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
              }`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setReAdjustYesNo(false)}
              aria-pressed={reAdjustYesNo === false}
              className={`flex-1 h-12 rounded-lg font-medium border-2 ${
                reAdjustYesNo === false ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
              }`}
            >
              No
            </button>
          </div>
        </div>
      </div>

      <FeedbackProgressHeader step={1} onBack={handleBack} />

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
