import { env } from '../config/env';
import type {
  BackendAiAssistantRequest,
  BackendAiAssistantResponse,
  BackendRetrievalResponse,
  IndianHotelsApiResponse,
  HotelListingsApiResponse,
} from '../types';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * Base HTTP client for backend integration.
 * Connects through the Vite dev proxy to Django on http://localhost:8000.
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
      let errorBody = '';
      try {
        const jsonError = await response.json();
        errorBody = jsonError.error || jsonError.detail || JSON.stringify(jsonError);
      } catch {
        errorBody = await response.text();
      }
      return {
        error: errorBody || `HTTP ${response.status}: ${response.statusText}`,
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

/**
 * Performs a lightweight health probe to verify if Ranveer's Django backend is responding.
 * Uses a 2000ms abort timeout against the actual GET /api/indian-hotels/?limit=1 endpoint.
 */
export async function checkBackendHealth(): Promise<{ isConnected: boolean; message: string }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${env.apiBaseUrl.replace(/\/$/, '')}/indian-hotels/?limit=1`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return { isConnected: true, message: 'Connected (Django / Local SQLite)' };
    }
    return { isConnected: false, message: `HTTP ${res.status}: Backend unreachable` };
  } catch {
    return { isConnected: false, message: 'Offline / Standby (Demo fixtures active)' };
  }
}

/**
 * Query Ranveer's verified POST /api/ai-assistant/ endpoint.
 * Supports string message or full structured request (guest details, booking parameters).
 */
export async function queryAiAssistant(
  input: string | BackendAiAssistantRequest
): Promise<ApiResponse<BackendAiAssistantResponse>> {
  const payload: BackendAiAssistantRequest =
    typeof input === 'string' ? { message: input } : input;
  return apiRequest<BackendAiAssistantResponse>('ai-assistant/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Query Ranveer's verified GET /api/test-retrieval/?q= endpoint.
 */
export async function queryKnowledgeRetrieval(question: string): Promise<ApiResponse<BackendRetrievalResponse>> {
  return apiRequest<BackendRetrievalResponse>(`test-retrieval/?q=${encodeURIComponent(question)}`, {
    method: 'GET',
  });
}

/**
 * Query Ranveer's verified GET /api/indian-hotels/ endpoint.
 * Supports q, city, state, and limit.
 */
export async function searchIndianHotels(params: {
  q?: string;
  city?: string;
  state?: string;
  limit?: number;
}): Promise<ApiResponse<IndianHotelsApiResponse>> {
  const queryParts: string[] = [];
  if (params.q) queryParts.push(`q=${encodeURIComponent(params.q)}`);
  if (params.city) queryParts.push(`city=${encodeURIComponent(params.city)}`);
  if (params.state) queryParts.push(`state=${encodeURIComponent(params.state)}`);
  if (params.limit) queryParts.push(`limit=${encodeURIComponent(params.limit.toString())}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return apiRequest<IndianHotelsApiResponse>(`indian-hotels/${queryString}`, {
    method: 'GET',
  });
}

/**
 * Query Ranveer's verified GET /api/hotels/ endpoint.
 */
export async function searchHotels(params: {
  q?: string;
  location?: string;
  room_type?: string;
  limit?: number;
}): Promise<ApiResponse<HotelListingsApiResponse>> {
  const queryParts: string[] = [];
  if (params.q) queryParts.push(`q=${encodeURIComponent(params.q)}`);
  if (params.location) queryParts.push(`location=${encodeURIComponent(params.location)}`);
  if (params.room_type) queryParts.push(`room_type=${encodeURIComponent(params.room_type)}`);
  if (params.limit) queryParts.push(`limit=${encodeURIComponent(params.limit.toString())}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return apiRequest<HotelListingsApiResponse>(`hotels/${queryString}`, {
    method: 'GET',
  });
}
