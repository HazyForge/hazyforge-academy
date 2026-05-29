import { makeRedirectUri, useAutoDiscovery } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import {
  ZITADEL_CLIENT_ID,
  ZITADEL_ISSUER,
  ZITADEL_SCOPES,
} from '@/services/runtime-config';

export { ZITADEL_CLIENT_ID, ZITADEL_ISSUER, ZITADEL_SCOPES };

export const AUTH_IS_CONFIGURED = ZITADEL_CLIENT_ID.length > 0;

export const REDIRECT_URI = makeRedirectUri({
  scheme: 'hazyforgeacademy',
  path: 'auth/callback',
});

export const POST_LOGOUT_REDIRECT_URI = makeRedirectUri({
  scheme: 'hazyforgeacademy',
  path: 'auth/logout',
});

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'academy_auth_access_token',
  REFRESH_TOKEN: 'academy_auth_refresh_token',
  ID_TOKEN: 'academy_auth_id_token',
  EXPIRY: 'academy_auth_token_expiry',
} as const;

async function setStoredValue(key: string, value: string) {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
}

async function getStoredValue(key: string) {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    return localStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key);
}

async function removeStoredValue(key: string) {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    localStorage.removeItem(key);
    return;
  }

  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    await SecureStore.setItemAsync(key, '');
  }
}

export async function storeTokens(params: {
  accessToken: string;
  refreshToken?: string | null;
  idToken?: string | null;
  expiresIn?: number | null;
}) {
  await setStoredValue(STORAGE_KEYS.ACCESS_TOKEN, params.accessToken);

  if (params.refreshToken) {
    await setStoredValue(STORAGE_KEYS.REFRESH_TOKEN, params.refreshToken);
  } else {
    await removeStoredValue(STORAGE_KEYS.REFRESH_TOKEN);
  }

  if (params.idToken) {
    await setStoredValue(STORAGE_KEYS.ID_TOKEN, params.idToken);
  } else {
    await removeStoredValue(STORAGE_KEYS.ID_TOKEN);
  }

  if (params.expiresIn) {
    await setStoredValue(STORAGE_KEYS.EXPIRY, `${Date.now() + params.expiresIn * 1000}`);
  } else {
    await removeStoredValue(STORAGE_KEYS.EXPIRY);
  }
}

export async function getStoredTokens() {
  const [accessToken, refreshToken, idToken, expiry] = await Promise.all([
    getStoredValue(STORAGE_KEYS.ACCESS_TOKEN),
    getStoredValue(STORAGE_KEYS.REFRESH_TOKEN),
    getStoredValue(STORAGE_KEYS.ID_TOKEN),
    getStoredValue(STORAGE_KEYS.EXPIRY),
  ]);

  return {
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
    idToken: idToken || null,
    expiresAt: expiry ? Number.parseInt(expiry, 10) : null,
  };
}

export async function clearStoredTokens() {
  await Promise.all([
    removeStoredValue(STORAGE_KEYS.ACCESS_TOKEN),
    removeStoredValue(STORAGE_KEYS.REFRESH_TOKEN),
    removeStoredValue(STORAGE_KEYS.ID_TOKEN),
    removeStoredValue(STORAGE_KEYS.EXPIRY),
  ]);
}

export function isTokenExpired(expiresAt: number | null): boolean {
  if (!expiresAt) return true;
  return Date.now() >= expiresAt - 60_000;
}

export async function refreshAccessToken(
  refreshToken: string,
  tokenEndpoint: string,
): Promise<{
  accessToken: string;
  refreshToken: string | null;
  idToken: string | null;
  expiresIn: number | null;
} | null> {
  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: ZITADEL_CLIENT_ID,
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? null,
      idToken: data.id_token ?? null,
      expiresIn: data.expires_in ?? null,
    };
  } catch {
    return null;
  }
}

export type AuthUser = {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
};

export function parseIdToken(idToken: string): AuthUser | null {
  try {
    const payload = idToken.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return {
      sub: decoded.sub,
      email: decoded.email,
      name: decoded.name ?? decoded.preferred_username,
      picture: decoded.picture,
    };
  } catch {
    return null;
  }
}

export { useAutoDiscovery };
