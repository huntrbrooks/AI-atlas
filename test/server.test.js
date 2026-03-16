import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (!address || typeof address === 'string') {
        reject(new Error('Failed to resolve free port'));
        return;
      }
      const { port } = address;
      server.close((err) => (err ? reject(err) : resolve(port)));
    });
  });
}

async function waitForHealthcheck(baseUrl, timeoutMs = 6000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(`${baseUrl}/healthz`);
      if (res.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Server did not become healthy in time');
}

async function startServer(envOverrides = {}) {
  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const proc = spawn('node', ['server.js'], {
    cwd: projectRoot,
    env: {
      ...process.env,
      PORT: String(port),
      ...envOverrides,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stderr = '';
  proc.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForHealthcheck(baseUrl);
  } catch (err) {
    proc.kill('SIGKILL');
    throw new Error(`${err.message}\n${stderr}`);
  }

  return { proc, baseUrl };
}

async function stopServer(proc) {
  if (proc.killed) return;
  proc.kill('SIGTERM');
  await new Promise((resolve) => {
    const timeout = setTimeout(() => {
      proc.kill('SIGKILL');
      resolve();
    }, 2000);
    proc.once('exit', () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

async function createStaticFixture() {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'ai-atlas-static-'));
  const indexHtml = '<!doctype html><html><body><div id="root">AI Atlas</div></body></html>';
  await writeFile(path.join(tmpDir, 'index.html'), indexHtml, 'utf8');
  await writeFile(path.join(tmpDir, 'app.js'), 'console.log("hello");', 'utf8');
  return tmpDir;
}

test('GET /healthz returns 200 with security headers', async (t) => {
  const { proc, baseUrl } = await startServer();
  t.after(() => stopServer(proc));

  const res = await fetch(`${baseUrl}/healthz`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(res.headers.get('x-frame-options'), 'DENY');
  assert.equal(res.headers.get('referrer-policy'), 'no-referrer');
});

test('GET / serves built static index when STATIC_DIR is configured', async (t) => {
  const staticDir = await createStaticFixture();
  t.after(() => rm(staticDir, { recursive: true, force: true }));

  const { proc, baseUrl } = await startServer({ STATIC_DIR: staticDir });
  t.after(() => stopServer(proc));

  const res = await fetch(`${baseUrl}/`);
  const body = await res.text();
  assert.equal(res.status, 200);
  assert.match(body, /AI Atlas/);
  assert.equal(res.headers.get('content-type'), 'text/html; charset=utf-8');
  assert.equal(res.headers.get('cache-control'), 'no-cache');
});

test('GET unknown route falls back to index for SPA navigation', async (t) => {
  const staticDir = await createStaticFixture();
  t.after(() => rm(staticDir, { recursive: true, force: true }));

  const { proc, baseUrl } = await startServer({ STATIC_DIR: staticDir });
  t.after(() => stopServer(proc));

  const res = await fetch(`${baseUrl}/dashboard/settings`, {
    headers: { Accept: 'text/html' },
  });
  const body = await res.text();
  assert.equal(res.status, 200);
  assert.match(body, /AI Atlas/);
  assert.equal(res.headers.get('cache-control'), 'no-cache');
});

test('GET static asset returns immutable cache headers', async (t) => {
  const staticDir = await createStaticFixture();
  t.after(() => rm(staticDir, { recursive: true, force: true }));

  const { proc, baseUrl } = await startServer({ STATIC_DIR: staticDir });
  t.after(() => stopServer(proc));

  const res = await fetch(`${baseUrl}/app.js`);
  const body = await res.text();
  assert.equal(res.status, 200);
  assert.match(body, /console\.log/);
  assert.equal(res.headers.get('cache-control'), 'public, max-age=31536000, immutable');
});

test('GET blocks path traversal outside static root', async (t) => {
  const staticDir = await createStaticFixture();
  t.after(() => rm(staticDir, { recursive: true, force: true }));

  const { proc, baseUrl } = await startServer({ STATIC_DIR: staticDir });
  t.after(() => stopServer(proc));

  const res = await fetch(`${baseUrl}/..%2Fpackage.json`, {
    headers: { Accept: 'application/json' },
  });

  assert.equal(res.status, 404);
});

test('OPTIONS /api/recommend allows configured origin', async (t) => {
  const { proc, baseUrl } = await startServer();
  t.after(() => stopServer(proc));

  const res = await fetch(`${baseUrl}/api/recommend`, {
    method: 'OPTIONS',
    headers: { Origin: 'http://localhost:5173' },
  });

  assert.equal(res.status, 204);
  assert.equal(res.headers.get('access-control-allow-origin'), 'http://localhost:5173');
});

test('POST /api/recommend rejects invalid content type and invalid JSON', async (t) => {
  const { proc, baseUrl } = await startServer();
  t.after(() => stopServer(proc));

  const wrongContentType = await fetch(`${baseUrl}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: 'x',
  });
  assert.equal(wrongContentType.status, 415);

  const invalidJson = await fetch(`${baseUrl}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'not-json',
  });
  assert.equal(invalidJson.status, 400);
});

test('POST /api/recommend enforces max body size', async (t) => {
  const { proc, baseUrl } = await startServer({ MAX_BODY_BYTES: '1024' });
  t.after(() => stopServer(proc));

  const body = JSON.stringify({ goal: 'a'.repeat(2048) });
  const res = await fetch(`${baseUrl}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });

  assert.equal(res.status, 413);
});

test('POST /api/recommend applies rate limiting', async (t) => {
  const { proc, baseUrl } = await startServer({
    RATE_LIMIT_MAX_REQUESTS: '2',
    RATE_LIMIT_WINDOW_MS: '60000',
  });
  t.after(() => stopServer(proc));

  const doRequest = () => fetch(`${baseUrl}/api/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: 'x',
  });

  const first = await doRequest();
  const second = await doRequest();
  const third = await doRequest();

  assert.equal(first.status, 415);
  assert.equal(second.status, 415);
  assert.equal(third.status, 429);
});
