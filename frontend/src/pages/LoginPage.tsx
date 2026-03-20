import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { subjectsApi } from '../api/endpoints';
import { setAuthToken, ApiError } from '../api/client';

const SUBJECT_ID_PATTERN = /^SUB-\d{4}-\d+$/;

export function LoginPage() {
  const navigate = useNavigate();
  const [subjectId, setSubjectId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmed = subjectId.trim();
    if (!trimmed) {
      setError('Please enter your Subject ID.');
      return;
    }
    if (!SUBJECT_ID_PATTERN.test(trimmed)) {
      setError('Subject ID must be in the format SUB-YYYY-NNNNNN (e.g. SUB-2026-000041).');
      return;
    }
    setLoading(true);
    try {
      const res = await subjectsApi.login(trimmed);
      setAuthToken(res.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.first() : err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh flex flex-col bg-white px-6 py-8 max-w-mobile mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Kit and Fit</h1>
      <h2 className="text-lg text-gray-700 mb-6">Enter Subject ID</h2>
      <p className="text-sm text-gray-600 mb-8">
        Please enter your assigned Subject ID to begin the assessment. All responses are anonymous.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label htmlFor="subject-id" className="block text-sm font-medium text-gray-700 mb-2">
            Subject ID
          </label>
          <input
            id="subject-id"
            type="text"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            placeholder="SUB-2026-000041"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            autoComplete="off"
            disabled={loading}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Continue'}
        </button>
      </form>
      <p className="mt-8 text-sm text-gray-600">
        New participant?{' '}
        <Link to="/signup" className="text-indigo-600 font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
