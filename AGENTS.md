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
- The GitHub workflow `.github/workflows/publish-image.yml` publishes `ghcr.io/hazyforge/hazyforge-academy` on pushes to `master` with `master` and short immutable `sha-<7>` tags from `docker/metadata-action`.
- The live image tag is pinned in `.hazyforge/clusters/hazy-sites/namespace/hazyforge-academy/deploy.yaml`.
- For app changes, publish the source change first, wait for the short `sha-<7>` image to exist, then update the deploy pin to that immutable tag and publish the deploy-pin change.
- Verify rollout through Anvil's service-account kubeconfig at `CodingFiles/HAZYFORGE/anvil-primaris/secrets/argocd-access-hazy-sites-kubeconfig.yaml`, namespace `hazyforge-academy`, and then smoke check `https://learn.hazyforge.io/healthz`.

## Academy Product And Theme Workflow

- Before changing either `apps/web` or `apps/mobile` UI, use the repo-local skill at `.agents/skills/hazyforge-academy-product-split/SKILL.md`.
- Maintain one recognizable Hazy Forge Academy theme across the browser site and Expo app: ink/ice foundations, hunter-green primary signals, restrained cyan and amber accents, Barlow-like uppercase display rhythm, 8px technical panels, grid/workbench motifs, real-machine/project language, and practical AI judgment.
- Treat `apps/web` as the public-facing Academy surface. At this moment it primarily explains the offer, builds trust, and gets a visitor to scheduling or sign-in.
- Treat `apps/mobile` as the subscribed/authenticated Academy surface. It is for people already in the system: scheduling, class tracking, reminders, notes, progress, and account context.
- Do not let the two surfaces drift into unrelated brands. They can differ in density and intent, but they should share tokens, typography logic, motifs, motion discipline, and copy tone.
- For any meaningful web redesign, also consider the mobile app impact. For any meaningful mobile redesign, consider how the public web entry point sets the same expectations.
- Prefer extracting shared theme constants, copy primitives, icons, and layout decisions into workspace packages when duplication becomes painful. Do not collapse the browser site and native app into one app unless the product surface and release workflow actually benefit.

## Repo Context

- Runtime namespace: `hazyforge-academy`
- Helm chart: `charts/hazyforge-academy`
- Repo-local deploy contract: `.hazyforge/clusters/hazy-sites/namespace/hazyforge-academy/deploy.yaml`
- Public health check: `https://learn.hazyforge.io/healthz`
- Public browser app: `apps/web`
- Authenticated Expo app: `apps/mobile`
