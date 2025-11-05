/**
 * Application constants
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  RESUME_UPLOAD: '/upload-resume',
  INTERVIEW: '/interview/:sessionId',
  RECRUITER_DASHBOARD: '/recruiter',
  INTERVIEW_DETAIL: '/recruiter/interview/:id',
  ANALYTICS: '/recruiter/analytics',
};

export const USER_ROLES = {
  CANDIDATE: 'candidate',
  RECRUITER: 'recruiter',
};

export const INTERVIEW_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};
