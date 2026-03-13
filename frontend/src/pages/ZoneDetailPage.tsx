import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { assessmentSessionsApi, bodyZonesApi, movementsApi } from '../api/endpoints';
import { hasAuthToken, ApiError } from '../api/client';
import { AssessmentProgressHeader } from '../components/AssessmentProgressHeader';

export function ZoneDetailPage() {
  const { movementIndex, zoneId } = useParams<{ movementIndex: string; zoneId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const index = Math.max(0, parseInt(movementIndex ?? '0', 10));
  const zoneIdNum = parseInt(zoneId ?? '0', 10);

  const [restriction, setRestriction] = useState<number | ''>('');
  const [discomfort, setDiscomfort] = useState<number | ''>('');
  const [comments, setComments] = useState('');
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
  const { data: zonesData } = useQuery({
    queryKey: ['body-zones'],
    queryFn: () => bodyZonesApi.list(),
    enabled: hasAuthToken(),
  });

  const session = sessionData?.data ?? null;
  const movements = movementsData?.data ?? [];
  const movement = movements[index] ?? null;
  const zones = zonesData?.data ?? [];
  const zone = zones.find((z) => z.id === zoneIdNum) ?? null;

  const storeResponse = useMutation({
    mutationFn: ({
      sessionId,
      movementId,
      bodyZones,
    }: {
      sessionId: number;
      movementId: number;
      bodyZones: { id: number; restriction?: number; discomfort?: number; comments?: string }[];
    }) =>
      assessmentSessionsApi.storeMovementResponse(sessionId, {
        movement_id: movementId,
        no_issues: false,
        body_zones: bodyZones,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-session-current'] });
      navigate(`/assessment/movements/${index}/zones`);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.first() : 'Failed to save.');
    },
  });

  if (!hasAuthToken()) {
    navigate('/login', { replace: true });
    return null;
  }

  if (!session) {
    navigate('/garment-details', { replace: true });
    return null;
  }

  if (!movement || !zone) {
    return (
      <div className="min-h-svh flex items-center justify-center max-w-mobile mx-auto">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  const existingResponse = session.movement_responses?.find((r) => r.movement_id === movement.id);
  const existingZones = existingResponse?.body_zones ?? [];
  const existingZoneData = existingZones.find((z) => z.id === zone.id);

  useEffect(() => {
    if (existingZoneData) {
      if (existingZoneData.restriction != null) setRestriction(existingZoneData.restriction);
      if (existingZoneData.discomfort != null) setDiscomfort(existingZoneData.discomfort);
      if (existingZoneData.comments) setComments(existingZoneData.comments);
    }
  }, [existingZoneData?.id, existingZoneData?.restriction, existingZoneData?.discomfort, existingZoneData?.comments]);

  const handleContinue = () => {
    const restrictionNum = restriction === '' ? undefined : Number(restriction);
    const discomfortNum = discomfort === '' ? undefined : Number(discomfort);

    const otherZones = existingZones.filter((z) => z.id !== zone.id);
    const bodyZones = [
      ...otherZones.map((z) => ({
        id: z.id,
        restriction: z.restriction ?? undefined,
        discomfort: z.discomfort ?? undefined,
        comments: z.comments ?? undefined,
      })),
      {
        id: zone.id,
        restriction: restrictionNum,
        discomfort: discomfortNum,
        comments: comments.trim() || undefined,
      },
    ];

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
        <h2 className="text-xl font-semibold text-gray-900">
          Movement {index + 1}: {movement.name}
        </h2>
      </div>

      <p className="text-sm font-medium text-gray-900 mb-1">Selected Area:</p>
      <p className="text-base text-gray-700 mb-4">{zone.name}</p>

      <div className="mb-6 w-32 h-32 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
        <span className="text-xs text-gray-500">Zone detail</span>
      </div>

      <div className="space-y-6 mb-6">
        <div role="group" aria-labelledby="restriction-label">
          <p id="restriction-label" className="text-sm font-medium text-gray-900 mb-2">
            The garment restricted my movement in this area:
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRestriction(n)}
                aria-pressed={restriction === n}
                aria-label={`${n}, ${n === 1 ? 'Strongly Disagree' : n === 5 ? 'Strongly Agree' : n}`}
                className={`w-10 h-10 rounded-lg border-2 font-medium text-sm ${
                  restriction === n
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Strongly Disagree</span>
            <span>Strongly Agree</span>
          </div>
        </div>

        <div role="group" aria-labelledby="discomfort-label">
          <p id="discomfort-label" className="text-sm font-medium text-gray-900 mb-2">
            I experienced physical discomfort in this area:
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setDiscomfort(n)}
                aria-pressed={discomfort === n}
                aria-label={`${n}, ${n === 1 ? 'Strongly Disagree' : n === 5 ? 'Strongly Agree' : n}`}
                className={`w-10 h-10 rounded-lg border-2 font-medium text-sm ${
                  discomfort === n
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-400'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Strongly Disagree</span>
            <span>Strongly Agree</span>
          </div>
        </div>

        <div>
          <label htmlFor="zone-comments" className="block text-sm font-medium text-gray-900 mb-2">
            Comments
          </label>
          <textarea
            id="zone-comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Optional additional feedback…"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white resize-none"
            aria-label="Comments for this area"
          />
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="fixed bottom-0 left-0 right-0 max-w-mobile mx-auto p-6 bg-white border-t border-gray-200">
        <button
          type="button"
          onClick={handleContinue}
          disabled={storeResponse.isPending}
          aria-busy={storeResponse.isPending}
          className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {storeResponse.isPending ? 'Saving…' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
