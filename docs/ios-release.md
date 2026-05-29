# iOS Release

Hazy Forge Academy owns its generated native iOS project under `apps/mobile/ios`.
Fastlane lives at the repository root and targets that workspace directly.

## Required Inputs

- `EXPO_PUBLIC_ZITADEL_CLIENT_ID`: ZITADEL native OIDC client for Academy.
- `APP_STORE_CONNECT_KEY_ID`
- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_KEY_PATH` or `APP_STORE_CONNECT_KEY_CONTENT`

Optional SSH/UserMac signing keychain inputs can live in:

```sh
~/.config/hazyforge-academy/ios-build-keychain.env
```

The expected keys are:

```sh
HAZY_IOS_BUILD_KEYCHAIN_PATH=/absolute/path/to/build.keychain-db
HAZY_IOS_BUILD_KEYCHAIN_PASSWORD=...
```

## TestFlight

```sh
bundle exec fastlane ios testflight version:1.0.0
```

The lane increments the Xcode build number, archives `HazyForgeAcademy`, exports
`apps/mobile/ios/build/export/hazyforge-academy.ipa`, and uploads it to
TestFlight.

If the lane fails after mutating local release metadata, it restores the local
metadata files it touched before re-raising the failure.
