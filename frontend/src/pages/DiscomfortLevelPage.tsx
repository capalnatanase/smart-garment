import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assessmentSessionsApi, movementsApi } from '../api/endpoints';
import type { BodyZone } from '../api/endpoints';
import { hasAuthToken, ApiError } from '../api/client';
import { AssessmentProgressHeader } from '../components/AssessmentProgressHeader';

const SEVERITY_OPTIONS = [
  { value: 'mild', label: 'Mild' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'severe', label: 'Severe' },
] as const;

type Severity = (typeof SEVERITY_OPTIONS)[number]['value'];

interface LocationState {
  zoneIds: number[];
  zones: BodyZone[];
}

const MOVEMENT_COUNT = 5;

export function DiscomfortLevelPage() {
  const { movementIndex } = useParams<{ movementIndex: string }>();
  const { state } = useLocation() as { state: LocationState | null };
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const index = Math.max(0, parseInt(movementIndex ?? '0', 10));
  const isLast = index >= MOVEMENT_COUNT - 1;

  const [severityByZoneId, setSeverityByZoneId] = useState<Record<number, Severity>>({});
  const [error, setError] = useState('');

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

  const session = sessionData?.data ?? null;
  const movements = movementsData?.data ?? [];
  const movement = movements[index] ?? null;

  const storeResponse = useMutation({
    mutationFn: ({
      sessionId,
      movementId,
      bodyZones,
    }: {
      sessionId: number;
      movementId: number;
      bodyZones: { id: number; severity: string }[];
    }) =>
      assessmentSessionsApi.storeMovementResponse(sessionId, {
        movement_id: movementId,
        no_issues: false,
        body_zones: bodyZones,
      }),
    onSuccess: (_, { sessionId }) => {
      queryClient.invalidateQueries({ queryKey: ['assessment-session-current'] });
      if (isLast) {
        completeSession.mutate(sessionId);
      } else {
        navigate(`/assessment/movements/${index + 1}`);
      }
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.first() : 'Failed to save.');
    },
  });

  const completeSession = useMutation({
    mutationFn: (sessionId: number) => assessmentSessionsApi.complete(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-session-current'] });
      navigate('/assessment/complete');
    },
  });

  if (!hasAuthToken()) {
    navigate('/login', { replace: true });
    return null;
  }

  if (!state?.zones?.length) {
    navigate(`/assessment/movements/${index}/zones`, { replace: true });
    return null;
  }

  const { zones } = state;

  const handleNext = () => {
    if (!session || !movement) {
      setError('Session expired. Please go back and try again.');
      return;
    }
    const bodyZones = zones.map((z) => ({
      id: z.id,
      severity: severityByZoneId[z.id] ?? 'moderate',
    }));
    storeResponse.mutate({
      sessionId: session.id,
      movementId: movement.id,
      bodyZones,
    });
  };

  const handleBack = () => navigate(`/assessment/movements/${index}/zones`);

  return (
    <div className="min-h-svh flex flex-col bg-white px-6 py-8 max-w-mobile mx-auto pb-24">
      <AssessmentProgressHeader
        movementIndex={index}
        onBack={handleBack}
        backLabel="Back to zone selection"
      />

      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900">How much discomfort?</h2>
      </div>
      <p className="mb-6 text-sm text-gray-600">
        Select the level of discomfort for each area you selected.
      </p>

      <div className="space-y-4 mb-8">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="flex flex-col gap-2 p-4 border border-gray-200 rounded-lg"
          >
            <span className="text-sm font-medium text-gray-900">{zone.name}</span>
            <select
              id={`severity-${zone.id}`}
              value={severityByZoneId[zone.id] ?? ''}
              onChange={(e) =>
                setSeverityByZoneId((prev) => ({
                  ...prev,
                  [zone.id]: e.target.value as Severity,
                }))
              }
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              aria-label={`Discomfort level for ${zone.name}`}
            >
              <option value="">Choose level…</option>
              {SEVERITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="fixed bottom-0 left-0 right-0 max-w-mobile mx-auto p-6 bg-white border-t border-gray-200">
        <button
          type="button"
          onClick={handleNext}
          disabled={storeResponse.isPending || completeSession.isPending}
          aria-busy={storeResponse.isPending || completeSession.isPending}
          className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {storeResponse.isPending || completeSession.isPending
            ? 'Saving…'
            : isLast
              ? 'Complete Assessment'
              : 'Next'}
        </button>
      </div>
    </div>
  );
}
