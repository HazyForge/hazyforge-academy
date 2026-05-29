# Repository Agent Instructions

## Default Edit Workflow

This is a fast-moving project. When asked to make edits, assume the expected outcome is a live deployment, not just a local patch.

- Go ahead and implement requested edits without asking for separate deployment approval.
- Carry app-facing changes through build, publish, deploy pin, rollout verification, and public smoke check when credentials and repo state allow it.
- Stop short of deployment only when the user explicitly says not to deploy, the change is clearly exploratory or docs-only, verification fails, secrets or credentials are missing, or deploying would require destructive data or infrastructure changes that were not requested.
- If deployment is blocked, leave the repo in the best verified state you can and report the exact blocker plus the next command or action needed.

## Deployment Flow

The live site is `https://learn.hazyforge.io`.

- Build locally with `pnpm build` before shipping app changes.
- The GitHub workflow `.github/workflows/publish-image.yml` publishes `ghcr.io/hazyforge/hazyforge-academy` on pushes to `master` with `master` and `sha-<commit>` tags.
- The live image tag is pinned in `.hazyforge/clusters/hazy-sites/namespace/hazyforge-academy/deploy.yaml`.
- For app changes, publish the source change first, wait for the `sha-<commit>` image to exist, then update the deploy pin to that immutable tag and publish the deploy-pin change.
- Verify rollout in Kubernetes with context `hazyforge-hazy-sites`, namespace `hazyforge-academy`, and then smoke check `https://learn.hazyforge.io/healthz`.

## Repo Context

- Runtime namespace: `hazyforge-academy`
- Helm chart: `charts/hazyforge-academy`
- Repo-local deploy contract: `.hazyforge/clusters/hazy-sites/namespace/hazyforge-academy/deploy.yaml`
- Public health check: `https://learn.hazyforge.io/healthz`
