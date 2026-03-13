import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { assessmentSessionsApi, movementsApi } from '../api/endpoints';
import { hasAuthToken } from '../api/client';
import { AssessmentProgressHeader } from '../components/AssessmentProgressHeader';

const MOVEMENT_COUNT = 5;

export function MovementInstructionPage() {
  const { movementIndex } = useParams<{ movementIndex: string }>();
  const navigate = useNavigate();
  const index = Math.max(0, parseInt(movementIndex ?? '0', 10));

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

  if (!hasAuthToken()) {
    navigate('/login', { replace: true });
    return null;
  }

  if (!session) {
    navigate('/garment-details', { replace: true });
    return null;
  }

  if (index < 0 || index >= MOVEMENT_COUNT) {
    navigate('/assessment/intro', { replace: true });
    return null;
  }

  if (!movement) {
    return (
      <div className="min-h-svh flex items-center justify-center max-w-mobile mx-auto">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  const handleSelectDiscomfort = () => {
    navigate(`/assessment/movements/${index}/zones`);
  };

  const handleBack = () => {
    if (index > 0) {
      navigate(`/assessment/movements/${index - 1}`);
    } else {
      navigate('/assessment/intro');
    }
  };

  return (
    <div className="min-h-svh flex flex-col bg-white px-6 py-8 max-w-mobile mx-auto">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900">
          Movement {index + 1}: {movement.name}
        </h2>
      </div>

      <div className="mb-6 aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-500 text-sm">Video placeholder</span>
      </div>
      <p className="mb-8 text-sm text-gray-600">
        Please perform the movement as shown in the video while wearing the selected garment.
      </p>
      <button
        type="button"
        onClick={handleSelectDiscomfort}
        className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
      >
        Select Discomfort Areas
      </button>

      <AssessmentProgressHeader
        movementIndex={index}
        onBack={handleBack}
        backLabel="Back to previous step"
      />
    </div>
  );
}
