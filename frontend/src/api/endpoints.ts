import { api } from './client';

export interface Subject {
  id: number;
  subject_id: string;
  organisation: string | null;
  job_role: string | null;
}

export interface LoginResponse {
  token: string;
  token_type: string;
  subject: Subject;
}

export interface GarmentWithSizes {
  id: number;
  name: string;
  sizes: { id: number; name: string }[];
}

export interface Movement {
  id: number;
  name: string;
  order: number;
  video_url: string | null;
}

export interface BodyZone {
  id: number;
  name: string;
  slug: string;
  side: string;
}

export interface MovementResponseBodyZone {
  id: number;
  name: string;
  slug: string;
  side: string;
  severity?: string | null;
  restriction?: number | null;
  discomfort?: number | null;
  comments?: string | null;
}

export interface MovementResponseItem {
  id: number;
  movement_id: number;
  movement: { id: number; name: string } | null;
  no_issues: boolean;
  body_zone_ids: number[];
  body_zones?: MovementResponseBodyZone[];
}

export interface AssessmentFeedback {
  fit_yes_no?: boolean;
  re_adjust_yes_no?: boolean;
  ease_don?: 'very_easy' | 'easy' | 'difficult' | 'very_difficult';
  ease_adjust?: 'very_easy' | 'easy' | 'difficult' | 'very_difficult';
  comfort?: 'very_comfortable' | 'comfortable' | 'uncomfortable' | 'very_uncomfortable';
  experience_rating?: number;
}

export interface AssessmentSession {
  id: number;
  garment_id: number;
  size_id: number;
  garment: { id: number; name: string } | null;
  size: { id: number; name: string } | null;
  started_at: string | null;
  completed_at: string | null;
  feedback?: AssessmentFeedback | null;
  movement_responses?: MovementResponseItem[];
}

export const subjectsApi = {
  login: (subjectId: string) =>
    api<LoginResponse>('/subjects/login', {
      method: 'POST',
      body: JSON.stringify({ subject_id: subjectId }),
    }),

  signup: (data: { subject_id: string; organisation: string; job_role?: string }) =>
    api<LoginResponse>('/subjects/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

export const garmentsApi = {
  list: () => api<{ data: GarmentWithSizes[] }>('/garments'),
};

export const movementsApi = {
  list: () => api<{ data: Movement[] }>('/movements'),
};

export const bodyZonesApi = {
  list: () => api<{ data: BodyZone[] }>('/body-zones'),
};

export const assessmentSessionsApi = {
  current: () => api<{ data: AssessmentSession | null }>('/assessment-sessions/current'),
  get: (sessionId: number) =>
    api<{ data: AssessmentSession }>(`/assessment-sessions/${sessionId}`),
  create: (garmentId: number, sizeId: number) =>
    api<{ data: AssessmentSession }>('/assessment-sessions', {
      method: 'POST',
      body: JSON.stringify({ garment_id: garmentId, size_id: sizeId }),
    }),
  storeMovementResponse: (
    sessionId: number,
    payload: {
      movement_id: number;
      no_issues?: boolean;
      body_zone_ids?: number[];
      body_zones?: {
        id: number;
        severity?: string;
        restriction?: number;
        discomfort?: number;
        comments?: string;
      }[];
    }
  ) =>
    api<{ data: { movement_response_id: number; movement_id: number; no_issues: boolean } }>(
      `/assessment-sessions/${sessionId}/movement-responses`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    ),
  cancel: (sessionId: number) =>
    api<{ message: string }>(`/assessment-sessions/${sessionId}`, {
      method: 'DELETE',
    }),
  complete: (sessionId: number, feedback?: AssessmentFeedback) =>
    api<{ data: AssessmentSession }>(`/assessment-sessions/${sessionId}/complete`, {
      method: 'POST',
      body: feedback ? JSON.stringify({ feedback }) : undefined,
    }),
};
