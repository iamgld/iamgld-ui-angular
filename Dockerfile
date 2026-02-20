## Base stage
FROM node:24.13.0-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate
WORKDIR /app

## Builder stage
FROM base AS builder
WORKDIR /app
# Copy package files first for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Install pnpm and dependencies
RUN pnpm install
# Copy rest of the code
COPY . .
# Environment variables
ARG GLD_ENVIRONMENT=stag
ENV GLD_ENVIRONMENT=${GLD_ENVIRONMENT}
# Build app
RUN pnpm build:${GLD_ENVIRONMENT}
RUN pnpm prune --prod

## Runner stage
FROM base AS runner
WORKDIR /app

# Copy only the compiled dist and minimal package files
COPY --from=builder /app/dist/iamgld-ui /app/dist/iamgld-ui
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml

ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}

# Comando para levantar el servidor
CMD ["pnpm", "server:ssr"]
