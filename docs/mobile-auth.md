# Mobile Auth

Hazy Forge Academy uses native OIDC with authorization code flow and PKCE.
The app scheme is:

```text
hazyforgeacademy
```

Register the ZITADEL native/mobile client with:

```text
hazyforgeacademy://auth/callback
hazyforgeacademy://auth/logout
```

Runtime configuration is injected with public Expo environment variables:

```sh
EXPO_PUBLIC_ZITADEL_CLIENT_ID=...
EXPO_PUBLIC_ZITADEL_ISSUER=https://hazyforge1-azsbgb.us1.zitadel.cloud
EXPO_PUBLIC_ZITADEL_AUDIENCE_SCOPE=...
EXPO_PUBLIC_API_BASE_URL=...
```

Only `EXPO_PUBLIC_ZITADEL_CLIENT_ID` is required for login. Audience and API
base URL are used when Academy adds protected backend routes.

Tokens are stored through `expo-secure-store` on native platforms. Web
development falls back to `localStorage`.
