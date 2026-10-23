FROM node:22-alpine
WORKDIR /app
COPY lib/landing.ts lib/landing.ts
COPY scripts/export-standalone.mjs scripts/export-standalone.mjs
RUN node scripts/export-standalone.mjs
COPY scripts/standalone-server.mjs scripts/standalone-server.mjs
COPY public/brand public/brand
ENV NODE_ENV=production PORT=3000
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "scripts/standalone-server.mjs"]
