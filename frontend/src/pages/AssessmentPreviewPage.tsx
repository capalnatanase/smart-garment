import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { assessmentSessionsApi } from '../api/endpoints';
import type { AssessmentFeedback, MovementResponseBodyZone, MovementResponseItem } from '../api/endpoints';
import { hasAuthToken } from '../api/client';

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function humanize(val: string): string {
  return val.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function ScaleDisplay({ label, value }: { label: string; value: number | null | undefined }) {
  if (value == null) return null;
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`w-6 h-6 rounded text-xs font-medium flex items-center justify-center ${
              n === value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400'
            }`}
          >
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? 'text-indigo-500' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  );
}

function ZoneCard({ zone }: { zone: MovementResponseBodyZone }) {
  return (
    <div className="ml-4 p-3 rounded-lg border border-gray-100 bg-gray-50 space-y-2">
      <p className="text-sm font-medium text-gray-900">{zone.name}</p>
      <ScaleDisplay label="Restriction" value={zone.restriction} />
      <ScaleDisplay label="Discomfort" value={zone.discomfort} />
      {zone.comments && (
        <p className="text-xs text-gray-600 italic">"{zone.comments}"</p>
      )}
    </div>
  );
}

function MovementSection({ response }: { response: MovementResponseItem }) {
  const zones = response.body_zones ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">
          {response.movement?.name ?? `Movement ${response.movement_id}`}
        </h3>
        {response.no_issues ? (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            No issues
          </span>
        ) : (
          <span className="text-xs text-gray-500">
            {zones.length} area{zones.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      {zones.length > 0 && (
        <div className="space-y-2">
          {zones.map((z) => (
            <ZoneCard key={z.id} zone={z} />
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackSection({ feedback }: { feedback: AssessmentFeedback }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Overall Feedback</h3>

      <div className="grid grid-cols-2 gap-3">
        {feedback.fit_yes_no != null && (
          <div>
            <p className="text-xs text-gray-500">Clothing fit?</p>
            <p className="text-sm font-medium text-gray-900">{feedback.fit_yes_no ? 'Yes' : 'No'}</p>
          </div>
        )}
        {feedback.re_adjust_yes_no != null && (
          <div>
            <p className="text-xs text-gray-500">Re-adjusted?</p>
            <p className="text-sm font-medium text-gray-900">{feedback.re_adjust_yes_no ? 'Yes' : 'No'}</p>
          </div>
        )}
        {feedback.ease_don && (
          <div>
            <p className="text-xs text-gray-500">Ease to don</p>
            <p className="text-sm font-medium text-gray-900">{humanize(feedback.ease_don)}</p>
          </div>
        )}
        {feedback.ease_adjust && (
          <div>
            <p className="text-xs text-gray-500">Ease to adjust</p>
            <p className="text-sm font-medium text-gray-900">{humanize(feedback.ease_adjust)}</p>
          </div>
        )}
        {feedback.comfort && (
          <div>
            <p className="text-xs text-gray-500">Comfort</p>
            <p className="text-sm font-medium text-gray-900">{humanize(feedback.comfort)}</p>
          </div>
        )}
        {feedback.experience_rating != null && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Experience</p>
            <StarDisplay rating={feedback.experience_rating} />
          </div>
        )}
      </div>
    </div>
  );
}

export function AssessmentPreviewPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const id = parseInt(sessionId ?? '0', 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['assessment-session', id],
    queryFn: () => assessmentSessionsApi.get(id),
    enabled: hasAuthToken() && id > 0,
  });

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

  if (isError || !data?.data) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center max-w-mobile mx-auto px-6">
        <p className="text-gray-600 mb-4">Assessment not found.</p>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="text-indigo-600 font-medium hover:underline"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  const session = data.data;
  const responses = session.movement_responses ?? [];
  const feedback = session.feedback;

  return (
    <div className="min-h-svh flex flex-col bg-white max-w-mobile mx-auto">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="p-2 -ml-2 text-gray-900 hover:text-gray-600"
            aria-label="Back to dashboard"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {session.garment?.name ?? 'Assessment'}
            </h1>
            <p className="text-xs text-gray-500">
              Size {session.size?.name} — {formatDate(session.completed_at ?? session.started_at)}
            </p>
          </div>
          {session.completed_at ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
              Completed
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 flex-shrink-0">
              In Progress
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 px-6 py-6 space-y-6">
        {responses.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-gray-700">
              Movement Responses ({responses.length})
            </h2>
            {responses.map((r) => (
              <MovementSection key={r.id} response={r} />
            ))}
          </div>
        )}

        {responses.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">No movement responses recorded.</p>
        )}

        {feedback && Object.keys(feedback).length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <FeedbackSection feedback={feedback} />
          </div>
        )}
      </div>
    </div>
  );
}
