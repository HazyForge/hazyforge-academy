# Hazy Sites to Primaris migration

This bundle stages `HazyForge/hazyforge-academy` on Anvil Primaris from the current
`master` deployment contract. The source Hazy Sites bundle remains available
until the migration operator verifies the target and retires the source.

## Runtime mapping

| Surface | Hazy Sites | Anvil Primaris |
| --- | --- | --- |
| Namespace | `hazyforge-academy` | `hazyforge-academy` |
| Deployment / Service / ServiceAccount | `hazyforge-academy` | `hazyforge-academy` |
| Helm release | `hazyforge-academy-chart` | `hazyforge-academy-chart` |
| HTTPRoute | `hazyforge-academy-gateway-route` | `hazyforge-academy-gateway-route` |

The target names follow the existing Primaris ApplicationSet contract:
`fullnameOverride` is the namespace and the Helm release is `<namespace>-chart`.
Service selectors match the target Deployment, and the HTTPRoute backend matches
the target Service name and port. The route uses `gateway/gateway` listeners
`https-learn`.

The image is the exact digest reported by the running Hazy Sites pod on
2026-10-04:

```
ghcr.io/hazyforge/hazyforge-academy@sha256:a03877dfe450d9db6cb92c0732096257a3f68f124bd1d1adba1f454d208f773b
```

The chart now accepts `image.digest`, which takes precedence over `image.tag`.
Existing releases with no digest keep their current tag behavior. No new image
is built or published for this migration. Target pod placement is
`hazyforge.io/site: hetzner-nbg1`.

The recorded source container and the target render have identical environment
configuration, image pull references, ports, resource requests/limits, probes,
and security configuration, apart from the immutable image reference and cloud
placement. The chart renders only a ServiceAccount, Service, and Deployment;
it adds no hooks, build jobs, data migrations, or persistent storage.

Academy keeps the existing scheduling and ZITADEL environment configuration from
its chart, including the empty `ACADEMY_AUTH_AUDIENCES` value. The source container
has no injected Secret references. Container and Service ports remain `80`.

## Secret and gateway prerequisites

`ghcr-creds` is reconciled through the existing `azurekv-cluster-secret-store`
using `secret/anvil-primaris-ghcr-read-pat`. No Secret values are committed.
The Primaris infrastructure change must permit namespace `hazyforge-academy` in that
ClusterSecretStore and install the listed Gateway listeners and certificates.

`external-dns.alpha.kubernetes.io/controller: migration-preflight` on the target
route holds DNS publication. Keep it until the operator verifies target pods,
ExternalSecrets, route acceptance, TLS, and HTTP/application behavior through
the Primaris gateway address. Then remove the annotation as the explicit DNS
promotion change, verify public traffic, and retire the old bundle. Avoid having
both clusters publish the same hostname during promotion.

## Validation and follow-up

Helm lint, source and target rendering, Kustomize rendering, client validation,
and whitespace checks pass. All resources also pass strict server dry-run on
Primaris with temporary names in its existing `default` namespace. Dry-run with
the actual target namespace fails because `hazyforge-academy` does not exist yet; this
schema check does not prove target namespace policy or live reconciliation.

A fresh source API check confirms the pinned pod imageID, live Service type and
ports, source Service-to-Deployment selectors, and ServiceAccount token-automount
settings. The target render also verifies the Service-to-Deployment selector and
HTTPRoute-to-Service backend chain. These are configuration checks; target live
application behavior still requires the rollout and public checks below.

After approval and merge, refresh Primaris repository discovery and sync both
`hazyforge-academy-chart` and `hazyforge-academy-anvil-primaris-remote-manifests`. Run the target-namespace
strict dry-run after namespace creation, and verify both applications and the
public hostnames before decommissioning the source cluster.

Normal app releases should update the Primaris `deploy.yaml` with the newly
published immutable digest (and its documentary tag), then use the same Helm
chart and target verification. Updating only `image.tag` cannot replace an
active `image.digest` pin.
