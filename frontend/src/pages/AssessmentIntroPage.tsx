import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { assessmentSessionsApi, movementsApi } from '../api/endpoints';
import { hasAuthToken } from '../api/client';

export function AssessmentIntroPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cancelling, setCancelling] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assessment-session-current'],
    queryFn: () => assessmentSessionsApi.current(),
    enabled: hasAuthToken(),
  });

  const { data: movementsData } = useQuery({
    queryKey: ['movements'],
    queryFn: () => movementsApi.list(),
    enabled: hasAuthToken() && !!data?.data,
  });

  const session = data?.data ?? null;
  const movements = movementsData?.data ?? [];
  const respondedMovementIds = new Set(session?.movement_responses?.map((r) => r.movement_id) ?? []);
  const firstIncompleteIndex = movements.findIndex((m) => !respondedMovementIds.has(m.id));
  const resumeIndex = firstIncompleteIndex >= 0 ? firstIncompleteIndex : 0;
  const isResume = (session?.movement_responses?.length ?? 0) > 0;

  if (!hasAuthToken()) {
    navigate('/login', { replace: true });
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-svh flex items-center justify-center max-w-mobile mx-auto">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (isError || !session) {
    navigate('/garment-details', { replace: true });
    return null;
  }

  const garmentName = session.garment?.name ?? '—';
  const sizeName = session.size?.name ?? '—';

  const handleStart = () => {
    navigate(`/assessment/movements/${resumeIndex}`);
  };

  return (
    <div className="min-h-svh flex flex-col bg-white px-6 py-8 max-w-mobile mx-auto">
      <button
        type="button"
        disabled={cancelling}
        onClick={async () => {
          if (!session) return;
          setCancelling(true);
          try {
            await assessmentSessionsApi.cancel(session.id);
            queryClient.invalidateQueries({ queryKey: ['assessment-session-current'] });
          } catch { /* proceed even if delete fails */ }
          navigate('/garment-details', { replace: true });
        }}
        className="mb-4 p-2 -ml-2 self-start text-gray-900 hover:text-gray-600 disabled:opacity-50"
        aria-label="Cancel assessment and go back"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-lg font-medium text-gray-700 mb-4">Fit Assessment</h1>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900">Functional Fit Assessment</h2>
      </div>
      <div className="mb-6 space-y-4 text-sm text-gray-600">
        <p>You are about to begin the functional fit assessment.</p>
        <p>
          You will be asked to follow a series of movements while wearing your garment and provide
          feedback on the fit.
        </p>
        <p>Please complete each movement as instructed and respond based on your experience.</p>
      </div>
      <div className="mb-8 p-4 border border-gray-200 rounded-lg space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Garment Under Review</h3>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Garment:</span> {garmentName}
        </p>
        <p className="text-sm text-gray-700">
          <span className="font-medium">Size:</span> {sizeName}
        </p>
      </div>
      <button
        type="button"
        onClick={handleStart}
        className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
      >
        {isResume ? 'Resume assessment' : 'Start Assessment'}
      </button>
    </div>
  );
}
