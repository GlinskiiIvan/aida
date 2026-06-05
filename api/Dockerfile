FROM node:24-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

COPY src/scripts/requirements.txt ./requirements.txt

RUN pip3 install --break-system-packages -r requirements.txt

RUN corepack enable
RUN corepack prepare pnpm@9.12.0 --activate

ENV PNPM_FETCH_TIMEOUT=600000
ENV PNPM_FETCH_RETRIES=10

COPY package.json pnpm-lock.yaml ./
COPY .npmrc ./

RUN pnpm install --no-frozen-lockfile

COPY . .

CMD ["pnpm", "run", "dev"]