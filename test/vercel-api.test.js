import assert from 'node:assert/strict';
import test from 'node:test';

import handler from '../api/recommend.js';

function createMockReq({
  method = 'GET',
  headers = {},
  body = undefined,
  remoteAddress = '127.0.0.1',
} = {}) {
  return {
    method,
    headers,
    body,
    socket: { remoteAddress },
  };
}

function createMockRes() {
  const headers = new Map();

  return {
    statusCode: 200,
    payload: null,
    setHeader(name, value) {
      headers.set(String(name).toLowerCase(), String(value));
      return this;
    },
    getHeader(name) {
      return headers.get(String(name).toLowerCase()) ?? null;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
    send(body) {
      this.payload = body;
      return this;
    },
  };
}

test('Vercel API handler: method, CORS, and missing-config guardrails', async () => {
  const allowedOrigin = 'http://localhost:5173';

  const getReq = createMockReq({ method: 'GET' });
  const getRes = createMockRes();
  await handler(getReq, getRes);
  assert.equal(getRes.statusCode, 405);
  assert.equal(getRes.getHeader('allow'), 'POST, OPTIONS');
  assert.equal(getRes.getHeader('x-content-type-options'), 'nosniff');

  const optionsReq = createMockReq({
    method: 'OPTIONS',
    headers: { origin: allowedOrigin },
  });
  const optionsRes = createMockRes();
  await handler(optionsReq, optionsRes);
  assert.equal(optionsRes.statusCode, 204);
  assert.equal(optionsRes.getHeader('access-control-allow-origin'), allowedOrigin);

  const blockedReq = createMockReq({
    method: 'POST',
    headers: {
      origin: 'https://malicious.example',
      'content-type': 'application/json',
    },
    body: { goal: 'Build a portfolio site' },
  });
  const blockedRes = createMockRes();
  await handler(blockedReq, blockedRes);
  assert.equal(blockedRes.statusCode, 403);
  assert.deepEqual(blockedRes.payload, { error: 'Origin not allowed' });

  const previousApiKey = process.env.ANTHROPIC_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;

  try {
    const postReq = createMockReq({
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: allowedOrigin },
      body: { goal: 'Convert blog posts into videos' },
    });
    const postRes = createMockRes();

    await handler(postReq, postRes);

    assert.equal(postRes.statusCode, 503);
    assert.deepEqual(postRes.payload, {
      error: 'Server not configured for AI recommendations',
    });
  } finally {
    if (previousApiKey) {
      process.env.ANTHROPIC_API_KEY = previousApiKey;
    } else {
      delete process.env.ANTHROPIC_API_KEY;
    }
  }
});
