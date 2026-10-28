FROM node:22-alpine AS course-builder
WORKDIR /build
RUN npm install --no-save --no-package-lock esbuild@0.25.12
COPY app/curso/route.ts app/curso/route.ts
COPY lib/curso-publico.json lib/curso-publico.json
RUN ./node_modules/.bin/esbuild app/curso/route.ts --bundle --platform=node --format=esm --target=node22 --outfile=course-renderer.mjs

FROM node:22-alpine
WORKDIR /app
COPY lib/landing.ts lib/landing.ts
COPY scripts/export-standalone.mjs scripts/export-standalone.mjs
RUN node scripts/export-standalone.mjs
COPY scripts/standalone-server.mjs scripts/standalone-server.mjs
COPY --from=course-builder /build/course-renderer.mjs scripts/course-renderer.mjs
COPY public/brand public/brand
COPY public/scrollcraft public/scrollcraft
COPY public/curso public/curso
RUN node --input-type=module -e "import('./scripts/course-renderer.mjs').then(m=>Promise.resolve(m.GET(new Request('http://localhost/curso'))).then(r=>r.text()).then(t=>{if(!t.includes('ACADEMIA'))process.exit(1)}))"
ENV NODE_ENV=production PORT=3000
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 CMD node -e "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "scripts/standalone-server.mjs"]
