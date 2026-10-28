import { env } from '../config/env';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Base HTTP client for backend integration.
 * Respects env.apiBaseUrl and handles simulated mock fallbacks.
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${env.apiBaseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      return {
        error: errorBody || response.statusText,
        status: response.status,
      };
    }

    const data = (await response.json()) as T;
    return { data, status: response.status };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network request failed';
    return {
      error: message,
      status: 0,
    };
  }
}

