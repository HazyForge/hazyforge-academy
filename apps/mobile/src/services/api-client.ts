import { Platform } from 'react-native';

import {
  ZITADEL_ISSUER,
  getStoredTokens,
  isTokenExpired,
  refreshAccessToken,
  storeTokens,
} from '@/services/auth';
import { API_BASE_URL } from '@/services/runtime-config';

let cachedTokenEndpoint: string | null = null;

export class ApiRequestError extends Error {
  status: number;
  body: string;

  constructor(message: string, status: number, body: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.body = body;
  }
}

async function getTokenEndpoint(): Promise<string | null> {
  if (cachedTokenEndpoint) return cachedTokenEndpoint;

  try {
    const response = await fetch(`${ZITADEL_ISSUER}/.well-known/openid-configuration`);
    if (!response.ok) return null;

    const data = await response.json();
    cachedTokenEndpoint = typeof data.token_endpoint === 'string' ? data.token_endpoint : null;
    return cachedTokenEndpoint;
  } catch {
    return null;
  }
}

function getBrowserCorsHint(input: RequestInfo | URL): string | null {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return null;
  }

  try {
    const requestUrl = new URL(
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url,
      window.location.href,
    );

    if (requestUrl.origin === window.location.origin) return null;

    return [
      `Browser request to ${requestUrl.origin} failed before the API responded.`,
      `Allow ${window.location.origin} in the backend CORS origin list for Expo web testing.`,
    ].join(' ');
  } catch {
    return null;
  }
}

async function getAccessToken(params?: {
  forceRefresh?: boolean;
}): Promise<{ accessToken: string; refreshed: boolean }> {
  const tokens = await getStoredTokens();
  if (!tokens.accessToken) {
    throw new Error('No access token found. User is not authenticated.');
  }

  const shouldRefresh =
    !!tokens.refreshToken && (params?.forceRefresh || isTokenExpired(tokens.expiresAt));

  if (!shouldRefresh) {
    return { accessToken: tokens.accessToken, refreshed: false };
  }

  const tokenEndpoint = await getTokenEndpoint();
  if (!tokenEndpoint || !tokens.refreshToken) {
    throw new Error('Token refresh is unavailable. User must sign in again.');
  }

  const refreshed = await refreshAccessToken(tokens.refreshToken, tokenEndpoint);
  if (!refreshed?.accessToken) {
    throw new Error('Token refresh failed. User must sign in again.');
  }

  await storeTokens(refreshed);
  return { accessToken: refreshed.accessToken, refreshed: true };
}

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const { accessToken } = await getAccessToken();
  const headers = new Headers(init.headers ?? {});
  headers.set('Authorization', `Bearer ${accessToken}`);

  let response: Response;

  try {
    response = await fetch(input, {
      ...init,
      headers,
    });
  } catch (error) {
    const corsHint = getBrowserCorsHint(input);
    if (corsHint) {
      throw new Error(corsHint, { cause: error });
    }

    throw error;
  }

  if (response.status !== 401) return response;

  const retried = await getAccessToken({ forceRefresh: true });
  if (!retried.refreshed) return response;

  const retryHeaders = new Headers(init.headers ?? {});
  retryHeaders.set('Authorization', `Bearer ${retried.accessToken}`);

  try {
    return await fetch(input, {
      ...init,
      headers: retryHeaders,
    });
  } catch (error) {
    const corsHint = getBrowserCorsHint(input);
    if (corsHint) {
      throw new Error(corsHint, { cause: error });
    }

    throw error;
  }
}

export function hasConfiguredApiBaseUrl(): boolean {
  return API_BASE_URL.length > 0;
}

export function getApiBaseUrl(): string | null {
  return hasConfiguredApiBaseUrl() ? API_BASE_URL : null;
}

export function getApiUrl(path: string): string {
  if (!hasConfiguredApiBaseUrl()) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL is not configured.');
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function authenticatedApiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  return authenticatedFetch(getApiUrl(path), init);
}

export async function authenticatedApiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await authenticatedApiFetch(path, init);

  if (!response.ok) {
    const body = await response.text();
    let message = `Request failed with status ${response.status}.`;

    try {
      const parsed = JSON.parse(body) as {
        error_message?: string;
        message?: string;
      };
      message = parsed.error_message ?? parsed.message ?? message;
    } catch {
      if (body) message = body;
    }

    throw new ApiRequestError(message, response.status, body);
  }

  return response.json() as Promise<T>;
}
