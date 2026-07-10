FROM node:24-slim

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@9.12.0 --activate

ENV PNPM_FETCH_TIMEOUT=600000
ENV PNPM_FETCH_RETRIES=10

COPY package.json pnpm-lock.yaml ./
COPY .npmrc ./

RUN pnpm install --no-frozen-lockfile

COPY . .

CMD ["pnpm", "run", "dev"]