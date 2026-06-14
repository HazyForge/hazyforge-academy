FROM node:24-bookworm-slim AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/mobile/package.json apps/mobile/package.json
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:24-bookworm-slim

WORKDIR /app

COPY --from=build /app/apps/web/dist /app/apps/web/dist
COPY server /app/server

EXPOSE 80

CMD ["node", "server/index.mjs"]
