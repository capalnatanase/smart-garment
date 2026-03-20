import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { garmentsApi, assessmentSessionsApi } from '../api/endpoints';
import type { GarmentWithSizes } from '../api/endpoints';
import { hasAuthToken, ApiError } from '../api/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function GarmentDetailsPage() {
  const navigate = useNavigate();
  const [garments, setGarments] = useState<GarmentWithSizes[]>([]);
  const [garmentId, setGarmentId] = useState<number | ''>('');
  const [sizeId, setSizeId] = useState<number | ''>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  const { data: sessionData } = useQuery({
    queryKey: ['assessment-session-current'],
    queryFn: () => assessmentSessionsApi.current(),
    enabled: hasAuthToken(),
  });
  const currentSession = sessionData?.data ?? null;

  useEffect(() => {
    if (!hasAuthToken()) {
      navigate('/login', { replace: true });
      return;
    }
    garmentsApi
      .list()
      .then((res) => {
        setGarments(res.data);
      })
      .catch(() => setError('Failed to load garments.'))
      .finally(() => setLoadingData(false));
  }, [navigate]);

  useEffect(() => {
    if (!garmentId) return;
    const g = garments.find((x) => x.id === garmentId);
    if (g?.sizes.length) {
      setSizeId(g.sizes[0].id);
    } else {
      setSizeId('');
    }
  }, [garmentId, garments]);

  const currentGarment = garments.find((g) => g.id === garmentId);
  const sizes = currentGarment?.sizes ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (garmentId === '' || sizeId === '') {
      setError('Please select a garment and size.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await assessmentSessionsApi.create(garmentId, sizeId as number);
      navigate('/assessment/intro', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.first() : err instanceof Error ? err.message : 'Failed to start assessment.');
    } finally {
      setLoading(false);
    }
  };

  if (!hasAuthToken()) return null;
  if (loadingData) {
    return (
      <div className="min-h-svh flex items-center justify-center max-w-mobile mx-auto">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-svh flex flex-col bg-white px-6 py-8 max-w-mobile mx-auto">
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="mb-4 p-2 -ml-2 self-start text-gray-900 hover:text-gray-600"
        aria-label="Back to dashboard"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-lg font-medium text-gray-700 mb-1">Fit Assessment</h1>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Garment Details</h2>
      <p className="text-sm text-gray-600 mb-4">
        Select the garment and size you are currently wearing.
      </p>
      {currentSession && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm font-medium text-amber-900">You have an assessment in progress.</p>
          <Link
            to="/assessment/intro"
            className="text-sm text-amber-700 underline font-medium mt-1 inline-block"
          >
            Resume assessment
          </Link>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Garment
          </label>
          <Select
            value={garmentId === '' ? undefined : String(garmentId)}
            onValueChange={(val) => setGarmentId(Number(val))}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Garment" />
            </SelectTrigger>
            <SelectContent>
              {garments.map((g) => (
                <SelectItem key={g.id} value={String(g.id)}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size Worn
          </label>
          <Select
            value={sizeId === '' ? undefined : String(sizeId)}
            onValueChange={(val) => setSizeId(Number(val))}
            disabled={loading || !currentGarment}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading || garmentId === '' || sizeId === ''}
          className="w-full h-12 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Starting…' : 'Continue'}
        </button>
      </form>
    </div>
  );
}
