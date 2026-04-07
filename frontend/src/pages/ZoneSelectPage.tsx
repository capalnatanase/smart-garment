import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assessmentSessionsApi, bodyZonesApi, movementsApi } from '../api/endpoints';
import type { BodyZone } from '../api/endpoints';
import { hasAuthToken, ApiError } from '../api/client';
import { AssessmentProgressHeader } from '../components/AssessmentProgressHeader';
import { BodyAvatarZoneSelect } from '../components/BodyAvatarZoneSelect';

const MOVEMENT_COUNT = 5;

export function ZoneSelectPage() {
  const { movementIndex } = useParams<{ movementIndex: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const index = Math.max(0, parseInt(movementIndex ?? '0', 10));
  const isLast = index >= MOVEMENT_COUNT - 1;

  const [noIssues, setNoIssues] = useState(false);

  const { data: sessionData } = useQuery({
    queryKey: ['assessment-session-current'],
    queryFn: () => assessmentSessionsApi.current(),
    enabled: hasAuthToken(),
  });

  const { data: movementsData } = useQuery({
    queryKey: ['movements'],
    queryFn: () => movementsApi.list(),
    enabled: hasAuthToken(),
  });

  const { data: zonesData } = useQuery({
    queryKey: ['body-zones'],
    queryFn: () => bodyZonesApi.list(),
    enabled: hasAuthToken(),
  });

  const storeResponse = useMutation({
    mutationFn: ({
      sessionId,
      movementId,
      noIssues: nope,
      bodyZoneIds,
    }: {
      sessionId: number;
      movementId: number;
      noIssues: boolean;
      bodyZoneIds: number[];
    }) =>
      assessmentSessionsApi.storeMovementResponse(sessionId, {
        movement_id: movementId,
        no_issues: nope,
        body_zone_ids: nope ? undefined : bodyZoneIds,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-session-current'] });
      if (isLast) {
        navigate('/assessment/feedback/yes-no');
      } else {
        navigate(`/assessment/movements/${index + 1}`);
      }
    },
  });

  const session = sessionData?.data ?? null;
  const movements = movementsData?.data ?? [];
  const movement = movements[index] ?? null;
  const zones = zonesData?.data ?? [];

  const handleNoIssues = () => setNoIssues(true);

  const handleNext = () => {
    if (!session || !movement) return;
    if (noIssues) {
      storeResponse.mutate({
        sessionId: session.id,
        movementId: movement.id,
        noIssues: true,
        bodyZoneIds: [],
      });
    } else {
      // Zone data already saved from Zone detail page; go to next movement or feedback steps
      if (isLast) {
        navigate('/assessment/feedback/yes-no');
      } else {
        navigate(`/assessment/movements/${index + 1}`);
      }
    }
  };

  const loading = storeResponse.isPending;
  const error = storeResponse.isError;

  if (!hasAuthToken()) {
    navigate('/login', { replace: true });
    return null;
  }

  if (!session) {
    navigate('/garment-details', { replace: true });
    return null;
  }

  if (!movement) {
    return (
      <div className="min-h-svh flex items-center justify-center max-w-mobile mx-auto">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  const existingResponse = session.movement_responses?.find((r) => r.movement_id === movement.id);
  const hasSavedZones = (existingResponse?.body_zones?.length ?? 0) > 0;
  const canProceed = noIssues || hasSavedZones;

  const handleBack = () => navigate(`/assessment/movements/${index}`);

  const handleZoneClick = (
    zone: BodyZone,
    meta: { view: 'front' | 'back' | 'side'; sectionId: string; sectionLabel: string }
  ) => {
    navigate(`/assessment/movements/${index}/zones/${zone.id}/detail`, {
      state: {
        selectedAreaLabel: meta.sectionLabel,
        selectedAreaView: meta.view,
        selectedAreaSectionId: meta.sectionId,
      },
    });
  };

  return (
    <div className="min-h-svh flex flex-col bg-white px-6 py-8 max-w-mobile mx-auto pb-24">
      <AssessmentProgressHeader
        movementIndex={index}
        onBack={handleBack}
        backLabel="Back to movement instructions"
      />

      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900">
          Movement {index + 1}: {movement.name}
        </h2>
      </div>

      <p className="mb-4 text-sm text-gray-600">
        Select any area you experienced restriction or discomfort.
      </p>

      <BodyAvatarZoneSelect zones={zones} onZoneClick={handleZoneClick} />

      <button
        type="button"
        onClick={handleNoIssues}
        aria-pressed={noIssues}
        aria-label={noIssues ? 'No issues selected' : 'I had no issues with this movement'}
        className={`w-full h-12 rounded-lg font-medium mb-6 border-2 ${
          noIssues
            ? 'bg-indigo-100 border-indigo-600 text-indigo-800'
            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
        }`}
      >
        No issues
      </button>

      {error && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {storeResponse.error instanceof ApiError
            ? storeResponse.error.first()
            : storeResponse.error instanceof Error
              ? storeResponse.error.message
              : 'Something went wrong.'}
        </p>
      )}

      <div className="fixed bottom-0 left-0 right-0 max-w-mobile mx-auto p-6 bg-white border-t border-gray-200">
        <button
          type="button"
          onClick={handleNext}
          disabled={loading || !canProceed}
          aria-busy={loading}
          aria-label={!canProceed ? 'Select at least one area or tap No issues' : loading ? 'Saving response' : 'Next movement'}
          className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving…' : isLast ? 'Next' : 'Next'}
        </button>
      </div>
    </div>
  );
}
