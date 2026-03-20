import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { assessmentSessionsApi } from '../api/endpoints';
import type { AssessmentSession } from '../api/endpoints';
import { hasAuthToken, clearAuthToken } from '../api/client';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function StatusBadge({ session }: { session: AssessmentSession }) {
  if (session.completed_at) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Completed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
      In Progress
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? 'text-indigo-500' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function SessionCard({ session, onClick }: { session: AssessmentSession; onClick: () => void }) {
  const movementCount = session.movement_responses?.length ?? 0;
  const issueCount = session.movement_responses?.filter((r) => !r.no_issues).length ?? 0;
  const feedback = session.feedback;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-lg border border-gray-200 bg-white p-4 space-y-3 hover:border-indigo-300 hover:shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {session.garment?.name ?? 'Unknown garment'}
          </p>
          <p className="text-xs text-gray-500">
            Size: {session.size?.name ?? '—'}
          </p>
        </div>
        <StatusBadge session={session} />
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{formatDate(session.started_at)}</span>
        {session.started_at && <span>{formatTime(session.started_at)}</span>}
      </div>

      {session.completed_at && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Movements</p>
            <p className="text-sm font-medium text-gray-900">{movementCount} / 5</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Areas with issues</p>
            <p className="text-sm font-medium text-gray-900">{issueCount}</p>
          </div>
          {feedback?.comfort && (
            <div>
              <p className="text-xs text-gray-500">Comfort</p>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {feedback.comfort.replace(/_/g, ' ')}
              </p>
            </div>
          )}
          {feedback?.experience_rating != null && (
            <div>
              <p className="text-xs text-gray-500">Experience</p>
              <StarRating rating={feedback.experience_rating} />
            </div>
          )}
        </div>
      )}
    </button>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['assessment-sessions-all'],
    queryFn: () => assessmentSessionsApi.list(),
    enabled: hasAuthToken(),
  });

  if (!hasAuthToken()) {
    navigate('/login', { replace: true });
    return null;
  }

  const sessions = data?.data ?? [];
  const completed = sessions.filter((s) => s.completed_at);
  const inProgress = sessions.find((s) => !s.completed_at);

  const handleNewAssessment = () => {
    navigate('/garment-details');
  };

  const handleResume = () => {
    navigate('/assessment/intro');
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-svh flex flex-col bg-gray-50 max-w-mobile mx-auto">
      <div className="bg-white px-6 pt-8 pb-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Kit and Fit</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Log out
          </button>
        </div>
        <p className="text-sm text-gray-600">Your assessment dashboard</p>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6">
        {inProgress && (
          <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-900">Assessment in progress</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  {inProgress.garment?.name} — Size {inProgress.size?.name}
                </p>
              </div>
              <button
                type="button"
                onClick={handleResume}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700"
              >
                Resume
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleNewAssessment}
          className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700"
        >
          New Assessment
        </button>

        {isLoading && (
          <p className="text-sm text-gray-500 text-center py-8">Loading…</p>
        )}

        {!isLoading && completed.length === 0 && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="mt-3 text-sm text-gray-500">No completed assessments yet</p>
            <p className="text-xs text-gray-400 mt-1">Start a new assessment to see your results here</p>
          </div>
        )}

        {completed.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
              Previous Assessments ({completed.length})
            </h2>
            <div className="space-y-3">
              {completed.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onClick={() => navigate(`/assessment/${session.id}/preview`)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
