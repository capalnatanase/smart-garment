const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

function getToken(): string | null {
  return localStorage.getItem('kitfit_token');
}

/** API error with optional validation errors (422 from Laravel) */
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }

  /** First validation message for a field, or first of any */
  first(field?: string): string {
    if (this.errors) {
      if (field && this.errors[field]?.length) return this.errors[field][0];
      const firstKey = Object.keys(this.errors)[0];
      if (firstKey && this.errors[firstKey]?.length) return this.errors[firstKey][0];
    }
    return this.message;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const data = body as { message?: string; errors?: Record<string, string[]> };
    throw new ApiError(
      data.message ?? res.statusText,
      res.status,
      data.errors
    );
  }

  return body as T;
}

export function setAuthToken(token: string): void {
  localStorage.setItem('kitfit_token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('kitfit_token');
}

export function hasAuthToken(): boolean {
  return !!getToken();
}
