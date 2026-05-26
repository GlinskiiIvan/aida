FROM node:24.10.0-alpine3.22

WORKDIR /app

RUN corepack enable

ENV PNPM_ENABLE_BUILD_CHECKS=false
ENV PNPM_CONFIG_STRICT_DEP_BUILDS=false
ENV PNPM_CONFIG_IGNORE_SCRIPTS=false

COPY package*.json ./
COPY .npmrc ./

RUN pnpm fetch
RUN pnpm install --prefer-offline --no-frozen-lockfile --unsafe-perm --force

COPY . .

CMD ["pnpm", "run", "start:dev"]