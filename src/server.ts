import { readFileSync } from 'node:fs';
import { createSecureServer } from 'node:http2';

import { serve } from '@hono/node-server';

import { env } from './config/env.ts';
import { app } from './http/app.ts';

const server = serve({
  fetch: app.fetch,
  port: env.port,
  createServer: createSecureServer,
  serverOptions: {
    key: readFileSync(env.tlsKey),
    cert: readFileSync(env.tlsCert),
    allowHTTP1: true,
    ALPNProtocols: ['h2', 'http/1.1'],
  },
});

const shutdown = (): void => {
  server.close((error) => {
    process.exit(error === undefined ? 0 : 1);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log(`Server laeuft auf https://localhost:${env.port}`);
