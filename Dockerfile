## Build stage
FROM node:24-alpine AS build
WORKDIR /app
# Copy package files first for better caching
COPY package.json pnpm-lock.yaml ./
# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
# Copy rest of the code
COPY . .
# Environment variables
ARG GLD_ENVIRONMENT=stag
ENV GLD_ENVIRONMENT=${GLD_ENVIRONMENT}
# Build app
RUN pnpm build:${GLD_ENVIRONMENT}

## Runtime stage
FROM node:24-alpine AS runtime
ARG PORT=3000
ENV PORT=${PORT}
WORKDIR /app
# Copy only the compiled dist and minimal package files
COPY --from=build /app/dist/iamgld-ui /app/dist/iamgld-ui
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/pnpm-lock.yaml /app/pnpm-lock.yaml

RUN npm install -g pnpm
EXPOSE ${PORT}

# Comando para levantar el servidor Angular
CMD ["pnpm", "server:ssr"]
