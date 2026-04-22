import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { subjectsApi } from '../api/endpoints';
import { setAuthToken, ApiError } from '../api/client';

export function SignUpPage() {
  const navigate = useNavigate();
  const [subjectId, setSubjectId] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedId = subjectId.trim();
    if (!trimmedId) {
      setError('Please enter your Subject ID.');
      return;
    }
    if (!jobRole.trim()) {
      setError('Please enter your Job Role.');
      return;
    }
    setLoading(true);
    try {
      const res = await subjectsApi.signup({
        subject_id: trimmedId,
        organisation: organisation.trim() || undefined,
        job_role: jobRole.trim(),
      });
      setAuthToken(res.token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.first() : err instanceof Error ? err.message : 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh flex flex-col bg-white px-6 py-8 max-w-mobile mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Kit and Fit</h1>
      <h2 className="text-lg text-gray-700 mb-8">Sign Up</h2>
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
            placeholder="Choose a Subject ID"
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            autoComplete="off"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="organisation" className="block text-sm font-medium text-gray-700 mb-2">
            Organisation (optional)
          </label>
          <input
            id="organisation"
            type="text"
            value={organisation}
            onChange={(e) => setOrganisation(e.target.value)}
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            autoComplete="organization"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="job-role" className="block text-sm font-medium text-gray-700 mb-2">
            Job Role
          </label>
          <input
            id="job-role"
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            autoComplete="organization-title"
            disabled={loading}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Signing up…' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-8 text-sm text-gray-600">
        Already have a Subject ID?{' '}
        <Link to="/login" className="text-indigo-600 font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
