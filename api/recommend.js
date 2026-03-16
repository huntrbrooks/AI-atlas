import { randomUUID } from 'node:crypto';
import { z } from 'zod';

function getIntEnv(name, fallback, min = 1, max = Number.MAX_SAFE_INTEGER) {
  const raw = process.env[name];
  const value = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(value) || Number.isNaN(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

const REQUEST_TIMEOUT_MS = getIntEnv('REQUEST_TIMEOUT_MS', 25_000, 1_000, 120_000);
const RATE_LIMIT_WINDOW_MS = getIntEnv('RATE_LIMIT_WINDOW_MS', 60_000, 1_000, 600_000);
const RATE_LIMIT_MAX_REQUESTS = getIntEnv('RATE_LIMIT_MAX_REQUESTS', 40, 1, 500);
const MAX_BODY_BYTES = getIntEnv('MAX_BODY_BYTES', 16 * 1024, 1_024, 5 * 1024 * 1024);
const ANTHROPIC_MAX_TOKENS = getIntEnv('ANTHROPIC_MAX_TOKENS', 2500, 256, 8000);
const MAX_BODY_KB = Math.max(1, Math.ceil(MAX_BODY_BYTES / 1024));

const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const ALLOWED_ORIGINS = new Set(
  (process.env.ALLOWED_ORIGINS ?? DEFAULT_ALLOWED_ORIGINS.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const SYSTEM_PROMPT = `You are an expert AI tool advisor helping absolute beginners achieve specific goals. Your job is NOT to generically list AI tools — it is to deeply understand the user's EXACT goal, figure out the simplest way to achieve it, and then recommend the best tools RANKED from most optimal to least optimal.

IMPORTANT: Use your web search tool to research the latest AI tools for the user's specific goal. Search for current pricing, features, and user reviews. This ensures recommendations are accurate and up-to-date.

## Your Process:
1. UNDERSTAND the user's specific goal (e.g., "turn my book into an audiobook" means they need text-to-speech narration with natural voices, NOT music generation)
2. SEARCH the web for the best current tools that solve this specific problem
3. EXPLAIN the simplest approach in plain English — what they need to do, step by step
4. RANK tools from most optimal (best fit, easiest, best value) to least optimal

## Response Format:
Respond with ONLY valid JSON — no markdown, no explanation outside the JSON:
{
  "summary": "3-5 sentences explaining: (1) what the user is trying to achieve in simple terms, (2) the simplest approach to get it done, (3) which tool they should start with and why. Write this as if explaining to someone who has never used AI before.",
  "tools": [
    {
      "name": "Tool Name",
      "emoji": "relevant emoji",
      "color": "#hexcolor (vibrant, distinct per tool: #6ee7f7, #f97316, #a78bfa, #34d399, #fb7185, #facc15, #38bdf8, #e879f9)",
      "model": "specific model/version if applicable, or null",
      "free": true or false,
      "rank": 1,
      "why_best": "1 sentence: why THIS tool is the best fit for THIS specific goal",
      "description": "2-3 sentences: what it does specifically for the user's goal, not generic marketing speak. Explain how it solves THEIR problem.",
      "steps": ["Specific step 1 for their goal", "Step 2", "Step 3"],
      "url": "https://official-url.com"
    }
  ]
}

## Critical Rules:
- THINK about what the user ACTUALLY needs. "Turn my book into an audiobook" = text-to-speech, NOT music generation. "Edit photos of my kids" = photo editing, NOT image generation.
- The FIRST tool (rank 1) should be the single best, simplest option for a beginner to achieve their exact goal
- Rank 2-4 tools as alternatives, explaining the trade-offs (e.g., "more voices but costs more", "free but lower quality")
- Each tool's description and steps must be specific to the user's goal, not generic
- The summary should read like friendly advice from a knowledgeable friend, not a product listing
- Always verify URLs and current pricing via web search
- Include 3-4 tools ordered from most to least optimal
- Steps should be specific to the user's goal (e.g., for audiobooks: "Upload your manuscript text" not "Upload your content")
- Colors: use vibrant, distinct hex colors — never repeat a color across tools`;

const recommendRequestSchema = z.object({
  goal: z.string().trim().min(3).max(500),
});

const toolResponseSchema = z.object({
  name: z.string().min(1).max(120),
  emoji: z.string().min(1).max(10),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  model: z.string().max(120).nullable(),
  free: z.boolean(),
  rank: z.number().int().min(1).max(10).optional(),
  why_best: z.string().max(500).optional(),
  description: z.string().min(1).max(2000),
  steps: z.array(z.string().min(1).max(300)).min(1).max(5),
  url: z.string().url().max(2048),
});

const recommendResponseSchema = z.object({
  summary: z.string().min(1).max(4000),
  tools: z.array(toolResponseSchema).min(1).max(6),
});

class HttpError extends Error {
  constructor(status, message, code = 'request_error') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const rateLimitStore = new Map();

function getClientIp(req) {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const existing = rateLimitStore.get(ip);

  if (!existing || now - existing.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now });
    return { allowed: true, retryAfterMs: 0 };
  }

  existing.count += 1;
  if (existing.count <= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: true, retryAfterMs: 0 };
  }

  const retryAfterMs = Math.max(0, RATE_LIMIT_WINDOW_MS - (now - existing.windowStart));
  return { allowed: false, retryAfterMs };
}

function applySecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
}

function applyCors(req, res) {
  const origin = req.headers.origin;
  if (!origin) return;

  if (!ALLOWED_ORIGINS.has(origin)) {
    throw new HttpError(403, 'Origin not allowed', 'origin_not_allowed');
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, status, body) {
  return res.status(status).json(body);
}

function parseBody(req) {
  const contentLength = Number.parseInt(req.headers['content-length'] ?? '', 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new HttpError(413, 'Request body too large', 'payload_too_large');
  }

  const contentType = req.headers['content-type'] ?? '';
  if (!String(contentType).toLowerCase().includes('application/json')) {
    throw new HttpError(415, 'Content-Type must be application/json', 'unsupported_content_type');
  }

  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      throw new HttpError(400, 'Invalid JSON body', 'invalid_json');
    }
  }

  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  throw new HttpError(400, 'Request body is required', 'body_required');
}

function getTextBlock(contentBlocks) {
  if (!Array.isArray(contentBlocks)) return null;
  const textBlock = contentBlocks.find((block) => block?.type === 'text');
  return typeof textBlock?.text === 'string' ? textBlock.text : null;
}

async function fetchRecommendations(goal, apiKey, signal) {
  const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: ANTHROPIC_MAX_TOKENS,
      system: SYSTEM_PROMPT,
      tools: [{
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: 5,
      }],
      messages: [{ role: 'user', content: `My goal: ${goal}` }],
    }),
    signal,
  });

  const upstreamRaw = await apiRes.text();
  let upstream;
  try {
    upstream = JSON.parse(upstreamRaw);
  } catch {
    throw new HttpError(502, 'Invalid response from upstream model provider', 'invalid_upstream_json');
  }

  if (!apiRes.ok) {
    const upstreamError = typeof upstream?.error?.message === 'string'
      ? upstream.error.message
      : `Anthropic request failed (${apiRes.status})`;
    throw new HttpError(502, upstreamError, 'upstream_error');
  }

  const rawText = getTextBlock(upstream.content);
  if (!rawText) {
    throw new HttpError(502, 'Model did not return a text payload', 'invalid_upstream_payload');
  }

  const cleanText = rawText.replace(/```json|```/g, '').trim();
  let parsed;
  try {
    parsed = JSON.parse(cleanText);
  } catch {
    throw new HttpError(502, 'Model returned malformed JSON', 'malformed_model_json');
  }

  const validated = recommendResponseSchema.safeParse(parsed);
  if (!validated.success) {
    throw new HttpError(502, 'Model response failed schema validation', 'invalid_model_schema');
  }

  return validated.data;
}

export default async function handler(req, res) {
  const requestId = randomUUID();
  res.setHeader('X-Request-Id', requestId);
  applySecurityHeaders(res);

  try {
    applyCors(req, res);

    if (req.method === 'OPTIONS') {
      return res.status(204).send('');
    }

    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST, OPTIONS');
      return sendJson(res, 405, { error: 'Method not allowed' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return sendJson(res, 503, { error: 'Server not configured for AI recommendations' });
    }

    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      res.setHeader('Retry-After', Math.ceil(rateLimit.retryAfterMs / 1000));
      return sendJson(res, 429, { error: 'Rate limit exceeded. Please try again shortly.' });
    }

    const rawBody = parseBody(req);
    const parsedBody = recommendRequestSchema.safeParse(rawBody);
    if (!parsedBody.success) {
      throw new HttpError(400, 'Invalid request payload', 'invalid_payload');
    }

    const goal = parsedBody.data.goal.replace(/\s+/g, ' ').trim();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let result;
    try {
      result = await fetchRecommendations(goal, apiKey, controller.signal);
    } finally {
      clearTimeout(timeout);
    }

    return sendJson(res, 200, result);
  } catch (err) {
    if (err?.name === 'AbortError') {
      console.error(`[${requestId}] upstream timeout after ${REQUEST_TIMEOUT_MS}ms`);
      return sendJson(res, 504, { error: 'Recommendation request timed out. Please retry.' });
    }

    if (err instanceof HttpError) {
      console.error(`[${requestId}] ${err.code}: ${err.message}`);
      return sendJson(res, err.status, { error: err.message });
    }

    console.error(`[${requestId}] internal_error`);
    return sendJson(res, 500, { error: 'Internal server error' });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: `${MAX_BODY_KB}kb`,
    },
  },
};
