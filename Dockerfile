# syntax=docker/dockerfile:1
ARG NODE_IMAGE=node:24.22.3-bookworm-slim
FROM python:3.13-slim AS web-build
WORKDIR /build
COPY build.py ./
COPY src ./src
COPY assets ./assets
COPY docs/THIRD_PARTY.md ./docs/THIRD_PARTY.md
RUN python3 build.py

FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    DB_PATH=/data/work-orders.sqlite \
    PUBLIC_DIR=/app/public
WORKDIR /app
RUN node -e "const [major,minor]=process.versions.node.split('.').map(Number); if(major!==24||minor<22)throw new Error('Node 24.22+ required'); require('node:sqlite')" \
    && apt-get update && apt-get install -y --no-install-recommends gosu \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /data && chown node:node /data && chmod 700 /data
COPY --chown=node:node package.json ./
COPY --chown=node:node server ./server
COPY --chown=node:node src/model.js src/catalog.js src/inventory-engine.js ./src/
COPY --chown=node:node scripts/create-owner.cjs scripts/backup.cjs ./scripts/
COPY --from=web-build --chown=node:node /build/public ./public
COPY --chmod=755 deploy/docker-entrypoint.sh /usr/local/bin/awamer-entrypoint
USER root
EXPOSE 3000
ENTRYPOINT ["/usr/local/bin/awamer-entrypoint"]
CMD ["node", "server/main.cjs"]
