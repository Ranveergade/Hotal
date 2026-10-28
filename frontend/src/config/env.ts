/**
 * Application environment configuration
 * Ensures all environment variables are accessed in a single type-safe place.
 */
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true' || true,
} as const;

