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

test('Vercel API handler retries without web search after timeout', async () => {
  const previousApiKey = process.env.ANTHROPIC_API_KEY;
  const previousEnableWebSearch = process.env.ENABLE_WEB_SEARCH;
  const originalFetch = global.fetch;
  const fetchCalls = [];

  process.env.ANTHROPIC_API_KEY = 'test-key';
  process.env.ENABLE_WEB_SEARCH = 'true';

  global.fetch = async (_url, init) => {
    fetchCalls.push(init);

    if (fetchCalls.length === 1) {
      const err = new Error('aborted');
      err.name = 'AbortError';
      throw err;
    }

    return new Response(JSON.stringify({
      content: [{
        type: 'text',
        text: JSON.stringify({
          summary: 'Fallback request succeeded.',
          tools: [{
            name: 'CapCut',
            emoji: '🎬',
            color: '#6ee7f7',
            model: null,
            free: true,
            rank: 1,
            why_best: 'Fast and simple for beginners.',
            description: 'Easy short-form video editing and templates.',
            steps: ['Upload clips', 'Pick a template', 'Export'],
            url: 'https://www.capcut.com',
          }],
        }),
      }],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  try {
    const req = createMockReq({
      method: 'POST',
      headers: {
        origin: 'http://localhost:5173',
        'content-type': 'application/json',
      },
      body: { goal: 'Make product reels quickly' },
    });
    const res = createMockRes();

    await handler(req, res);

    assert.equal(res.statusCode, 200);
    assert.equal(res.getHeader('x-recommendation-mode'), 'fallback-no-web-search');
    assert.equal(fetchCalls.length, 2);

    const firstRequestBody = JSON.parse(fetchCalls[0].body);
    const secondRequestBody = JSON.parse(fetchCalls[1].body);
    assert.ok(Array.isArray(firstRequestBody.tools));
    assert.equal(secondRequestBody.tools, undefined);
  } finally {
    global.fetch = originalFetch;
    if (previousApiKey) {
      process.env.ANTHROPIC_API_KEY = previousApiKey;
    } else {
      delete process.env.ANTHROPIC_API_KEY;
    }
    if (previousEnableWebSearch !== undefined) {
      process.env.ENABLE_WEB_SEARCH = previousEnableWebSearch;
    } else {
      delete process.env.ENABLE_WEB_SEARCH;
    }
  }
});
