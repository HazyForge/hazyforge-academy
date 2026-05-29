import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

import {
  AUTH_IS_CONFIGURED,
  AuthUser,
  POST_LOGOUT_REDIRECT_URI,
  REDIRECT_URI,
  ZITADEL_CLIENT_ID,
  ZITADEL_ISSUER,
  ZITADEL_SCOPES,
  clearStoredTokens,
  getStoredTokens,
  isTokenExpired,
  parseIdToken,
  refreshAccessToken,
  storeTokens,
  useAutoDiscovery,
} from '@/services/auth';

WebBrowser.maybeCompleteAuthSession();

type AuthState = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const discovery = useAutoDiscovery(ZITADEL_ISSUER);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: ZITADEL_CLIENT_ID,
      scopes: ZITADEL_SCOPES,
      redirectUri: REDIRECT_URI,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
    },
    discovery,
  );

  useEffect(() => {
    (async () => {
      if (!AUTH_IS_CONFIGURED) {
        await clearStoredTokens();
        setUser(null);
        setHasSession(false);
        setIsLoading(false);
        return;
      }

      try {
        const tokens = await getStoredTokens();
        if (!tokens.accessToken) {
          setHasSession(false);
          return;
        }

        if (!isTokenExpired(tokens.expiresAt)) {
          setHasSession(true);

          if (tokens.idToken) {
            const parsed = parseIdToken(tokens.idToken);
            if (parsed) setUser(parsed);
          }

          return;
        }

        if (tokens.refreshToken && discovery?.tokenEndpoint) {
          const refreshed = await refreshAccessToken(tokens.refreshToken, discovery.tokenEndpoint);
          if (refreshed) {
            await storeTokens(refreshed);
            setHasSession(true);

            if (refreshed.idToken) {
              const parsed = parseIdToken(refreshed.idToken);
              if (parsed) setUser(parsed);
            }
            return;
          }
        }

        await clearStoredTokens();
        setUser(null);
        setHasSession(false);
      } catch {
        await clearStoredTokens();
        setUser(null);
        setHasSession(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [discovery]);

  useEffect(() => {
    if (response?.type !== 'success' || !discovery?.tokenEndpoint) return;

    (async () => {
      try {
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: ZITADEL_CLIENT_ID,
            code: response.params.code,
            redirectUri: REDIRECT_URI,
            extraParams: request?.codeVerifier
              ? { code_verifier: request.codeVerifier }
              : undefined,
          },
          discovery,
        );

        await storeTokens({
          accessToken: tokenResult.accessToken,
          refreshToken: tokenResult.refreshToken ?? null,
          idToken: tokenResult.idToken ?? null,
          expiresIn: tokenResult.expiresIn ?? null,
        });
        setHasSession(true);

        if (tokenResult.idToken) {
          const parsed = parseIdToken(tokenResult.idToken);
          if (parsed) setUser(parsed);
        }
      } catch (error) {
        console.error('Token exchange failed:', error);
      }
    })();
  }, [discovery, request?.codeVerifier, response]);

  const login = useCallback(async () => {
    if (!AUTH_IS_CONFIGURED || !request) return;
    await promptAsync();
  }, [promptAsync, request]);

  const logout = useCallback(async () => {
    const tokens = await getStoredTokens();
    await clearStoredTokens();
    setUser(null);
    setHasSession(false);

    if (discovery?.endSessionEndpoint && tokens.idToken) {
      const endSessionUrl =
        `${discovery.endSessionEndpoint}?` +
        `id_token_hint=${encodeURIComponent(tokens.idToken)}&` +
        `post_logout_redirect_uri=${encodeURIComponent(POST_LOGOUT_REDIRECT_URI)}`;
      await WebBrowser.openAuthSessionAsync(endSessionUrl, POST_LOGOUT_REDIRECT_URI);
    }
  }, [discovery]);

  const value = useMemo<AuthState>(
    () => ({
      user,
      isLoading,
      isAuthenticated: hasSession,
      login,
      logout,
    }),
    [hasSession, isLoading, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
