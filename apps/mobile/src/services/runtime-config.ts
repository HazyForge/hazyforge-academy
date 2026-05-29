const DEFAULT_APP_ENV = __DEV__ ? 'development' : 'production';
const DEFAULT_ZITADEL_ISSUER = 'https://hazyforge1-azsbgb.us1.zitadel.cloud';

function normalizeEnvValue(value: string | undefined): string {
  return value?.trim() ?? '';
}

function normalizeBaseUrl(value: string | undefined): string {
  return normalizeEnvValue(value).replace(/\/+$/, '');
}

export const APP_ENV =
  normalizeEnvValue(process.env.EXPO_PUBLIC_APP_ENV).toLowerCase() || DEFAULT_APP_ENV;

export const REQUIRES_EXPLICIT_API_BASE_URL = APP_ENV !== 'production';

export const API_BASE_URL = normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL);

export const ZITADEL_ISSUER =
  normalizeEnvValue(process.env.EXPO_PUBLIC_ZITADEL_ISSUER) || DEFAULT_ZITADEL_ISSUER;

export const ZITADEL_CLIENT_ID = normalizeEnvValue(process.env.EXPO_PUBLIC_ZITADEL_CLIENT_ID);

export const ZITADEL_AUDIENCE_SCOPE = normalizeEnvValue(
  process.env.EXPO_PUBLIC_ZITADEL_AUDIENCE_SCOPE,
);

export const ZITADEL_SCOPES = [
  'openid',
  'profile',
  'email',
  'offline_access',
  ZITADEL_AUDIENCE_SCOPE,
].filter(Boolean);
