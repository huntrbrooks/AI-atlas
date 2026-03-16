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
const ANTHROPIC_MAX_TOKENS = getIntEnv('ANTHROPIC_MAX_TOKENS', 1200, 256, 1400);
const WEB_SEARCH_MAX_TOKENS = getIntEnv('WEB_SEARCH_MAX_TOKENS', 600, 256, 1000);
const FALLBACK_MAX_TOKENS = getIntEnv('FALLBACK_MAX_TOKENS', 800, 256, 1200);
const PRIMARY_SEARCH_TIMEOUT_MS = getIntEnv('PRIMARY_SEARCH_TIMEOUT_MS', 18_000, 2_000, 90_000);
const FALLBACK_TIMEOUT_MS = getIntEnv('FALLBACK_TIMEOUT_MS', 12_000, 2_000, 60_000);
const NON_SEARCH_TIMEOUT_MS = getIntEnv('NON_SEARCH_TIMEOUT_MS', 18_000, 2_000, 60_000);

const DEFAULT_ALLOWED_ORIGINS = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const ALLOWED_ORIGINS = new Set(
  (process.env.ALLOWED_ORIGINS ?? DEFAULT_ALLOWED_ORIGINS.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const SYSTEM_PROMPT = `You are an expert AI tool advisor helping absolute beginners achieve specific goals. Your job is NOT to generically list AI tools — it is to deeply understand the user's EXACT goal, figure out the simplest way to achieve it, and then recommend the best tools RANKED from most optimal to least optimal.

## Your Process:
1. UNDERSTAND the user's specific goal (e.g., "turn my book into an audiobook" means they need text-to-speech narration with natural voices, NOT music generation)
2. Select tools that best solve this specific problem and explain practical trade-offs
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
- Prefer official product URLs; if pricing is uncertain, say so briefly instead of guessing
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

function isWebSearchEnabled() {
  return process.env.ENABLE_WEB_SEARCH === 'true';
}

function isRetriableWebSearchFailure(err) {
  if (err?.name === 'AbortError') return true;
  if (!(err instanceof HttpError)) return false;
  return [
    'upstream_error',
    'invalid_upstream_json',
    'invalid_upstream_payload',
    'malformed_model_json',
    'invalid_model_schema',
  ].includes(err.code);
}

const EMERGENCY_TOOLKITS = [
  {
    id: 'video',
    keywords: ['video', 'youtube', 'tiktok', 'reel', 'shorts', 'edit', 'editing'],
    summary: 'video content',
    tools: [
      { name: 'CapCut', emoji: '🎬', color: '#6ee7f7', model: null, free: true, why_best: 'Fast templates and exports for beginners.', description: 'Best all-around beginner editor for short-form social content with templates and auto-captions.', steps: ['Import clips', 'Apply a template', 'Add captions and export'], url: 'https://www.capcut.com' },
      { name: 'Canva', emoji: '🧩', color: '#f97316', model: null, free: true, why_best: 'Great for branded overlays and simple edits.', description: 'Excellent for polished social videos, brand kits, and reusable layouts.', steps: ['Choose a video template', 'Swap in your footage', 'Export in social format'], url: 'https://www.canva.com' },
      { name: 'Descript', emoji: '🎙️', color: '#a78bfa', model: null, free: false, why_best: 'Easy voice cleanup and subtitle workflow.', description: 'Useful when your videos need narration cleanup, text-based editing, and accurate captions.', steps: ['Upload your video', 'Edit by transcript', 'Polish audio and publish'], url: 'https://www.descript.com' },
      { name: 'Runway', emoji: '✨', color: '#34d399', model: null, free: false, why_best: 'Adds advanced AI effects when needed.', description: 'Adds AI-powered background cleanup, generative fills, and style effects for premium-looking output.', steps: ['Import your clip', 'Apply AI effects', 'Render final version'], url: 'https://runwayml.com' },
    ],
  },
  {
    id: 'audio',
    keywords: ['audio', 'voice', 'podcast', 'audiobook', 'narration', 'speech', 'tts'],
    summary: 'audio production',
    tools: [
      { name: 'ElevenLabs', emoji: '🔊', color: '#6ee7f7', model: null, free: false, why_best: 'Most natural AI voices for long narration.', description: 'High-quality voice generation for narrations, audiobooks, and polished spoken content.', steps: ['Paste or upload script', 'Pick voice style', 'Generate and download audio'], url: 'https://elevenlabs.io' },
      { name: 'Murf', emoji: '🎤', color: '#f97316', model: null, free: false, why_best: 'Beginner-friendly studio controls.', description: 'Strong voiceover workflow with pacing controls and easy project organization.', steps: ['Create new narration project', 'Add script sections', 'Export final audio'], url: 'https://murf.ai' },
      { name: 'Descript', emoji: '📝', color: '#a78bfa', model: null, free: false, why_best: 'Best editing workflow for spoken content.', description: 'Ideal when you need to edit spoken audio by editing text and clean background noise.', steps: ['Import recording', 'Edit transcript text', 'Export mastered audio'], url: 'https://www.descript.com' },
      { name: 'Speechify', emoji: '📚', color: '#34d399', model: null, free: true, why_best: 'Quick start and simple interface.', description: 'Easy text-to-speech option for fast conversions with minimal setup.', steps: ['Upload text', 'Select voice', 'Generate and save output'], url: 'https://speechify.com' },
    ],
  },
  {
    id: 'image',
    keywords: ['image', 'photo', 'thumbnail', 'picture', 'background', 'product photo', 'design'],
    summary: 'image and design work',
    tools: [
      { name: 'Canva', emoji: '🎨', color: '#6ee7f7', model: null, free: true, why_best: 'Fastest path to polished visuals.', description: 'Great for thumbnails, social posts, and quick design edits with templates.', steps: ['Select template', 'Upload your photos', 'Adjust and export'], url: 'https://www.canva.com' },
      { name: 'Adobe Express', emoji: '🖼️', color: '#f97316', model: null, free: true, why_best: 'Strong quick-edit tools with reliable quality.', description: 'Useful for background removal, sizing, and branded social graphics.', steps: ['Import image', 'Use quick actions', 'Export for target platform'], url: 'https://www.adobe.com/express' },
      { name: 'remove.bg', emoji: '✂️', color: '#a78bfa', model: null, free: true, why_best: 'Best single-purpose background remover.', description: 'Excellent one-click background removal for product and profile images.', steps: ['Upload image', 'Download transparent output', 'Place in your design'], url: 'https://www.remove.bg' },
      { name: 'Pixlr', emoji: '🛠️', color: '#34d399', model: null, free: true, why_best: 'Lightweight browser editor for quick touchups.', description: 'Simple online editor for retouching, filters, and resizing without heavy software.', steps: ['Open image in editor', 'Apply touchups', 'Export final file'], url: 'https://pixlr.com' },
    ],
  },
  {
    id: 'build',
    keywords: ['app', 'website', 'code', 'software', 'saas', 'tool', 'build'],
    summary: 'app and product building',
    tools: [
      { name: 'Replit', emoji: '🧪', color: '#6ee7f7', model: null, free: true, why_best: 'Fastest no-setup coding environment.', description: 'Good for quickly prototyping ideas in-browser without local setup.', steps: ['Start a new project', 'Build MVP features', 'Share test link'], url: 'https://replit.com' },
      { name: 'Cursor', emoji: '💻', color: '#f97316', model: null, free: false, why_best: 'Strong AI-assisted coding workflow.', description: 'Excellent for shipping features quickly with AI pair-programming assistance.', steps: ['Open project codebase', 'Generate and refine features', 'Run and test changes'], url: 'https://www.cursor.com' },
      { name: 'Vercel', emoji: '🚀', color: '#a78bfa', model: null, free: true, why_best: 'Simple deployment workflow for web apps.', description: 'Best for instant previews and stable production deploys for frontend projects.', steps: ['Connect repository', 'Deploy preview', 'Promote to production'], url: 'https://vercel.com' },
      { name: 'Supabase', emoji: '🗄️', color: '#34d399', model: null, free: true, why_best: 'Quick backend for auth and database.', description: 'Provides managed database, auth, and APIs so you can move faster on app features.', steps: ['Create project', 'Define tables/auth', 'Connect app to backend'], url: 'https://supabase.com' },
    ],
  },
];

function buildEmergencyRecommendation(goal) {
  const normalizedGoal = goal.toLowerCase();
  const toolkit = EMERGENCY_TOOLKITS.find((candidate) => (
    candidate.keywords.some((keyword) => normalizedGoal.includes(keyword))
  )) ?? EMERGENCY_TOOLKITS[0];

  return {
    summary: `Live web search took too long, so here is a fast goal-specific starter stack for ${toolkit.summary}. Start with ${toolkit.tools[0].name} first, then use the alternatives if you need extra control or lower cost.`,
    tools: toolkit.tools.map((tool, index) => ({
      ...tool,
      rank: index + 1,
    })),
  };
}

async function fetchRecommendations(goal, apiKey, signal, { useWebSearch, maxTokens }) {
  const requestBody = {
    model: 'claude-sonnet-4-20250514',
    max_tokens: maxTokens,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: `My goal: ${goal}` }],
  };

  if (useWebSearch) {
    requestBody.tools = [{
      type: 'web_search_20250305',
      name: 'web_search',
      max_uses: 2,
    }];
  }

  const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(requestBody),
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

async function runFetchAttempt(goal, apiKey, options, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetchRecommendations(goal, apiKey, controller.signal, options);
  } finally {
    clearTimeout(timeout);
  }
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
    const deadline = Date.now() + REQUEST_TIMEOUT_MS;
    const remainingTime = () => Math.max(0, deadline - Date.now());

    let result;
    if (isWebSearchEnabled()) {
      const firstBudget = Math.min(PRIMARY_SEARCH_TIMEOUT_MS, remainingTime());
      try {
        result = await runFetchAttempt(goal, apiKey, {
          useWebSearch: true,
          maxTokens: Math.min(ANTHROPIC_MAX_TOKENS, WEB_SEARCH_MAX_TOKENS),
        }, firstBudget);
      } catch (err) {
        if (!isRetriableWebSearchFailure(err)) throw err;

        const secondBudget = Math.min(FALLBACK_TIMEOUT_MS, remainingTime());
        try {
          if (secondBudget < 2_000) throw err;

          console.warn(`[${requestId}] web_search_retry: retrying without web search`);
          result = await runFetchAttempt(goal, apiKey, {
            useWebSearch: false,
            maxTokens: Math.min(ANTHROPIC_MAX_TOKENS, FALLBACK_MAX_TOKENS),
          }, secondBudget);
          res.setHeader('X-Recommendation-Mode', 'fallback-no-web-search');
        } catch (fallbackErr) {
          if (!isRetriableWebSearchFailure(fallbackErr)) throw fallbackErr;

          console.error(`[${requestId}] emergency_local_fallback after upstream timeouts`);
          result = buildEmergencyRecommendation(goal);
          res.setHeader('X-Recommendation-Mode', 'emergency-local-fallback');
        }
      }
    } else {
      const budget = Math.min(NON_SEARCH_TIMEOUT_MS, remainingTime());
      try {
        result = await runFetchAttempt(goal, apiKey, {
          useWebSearch: false,
          maxTokens: ANTHROPIC_MAX_TOKENS,
        }, budget);
      } catch (err) {
        if (!isRetriableWebSearchFailure(err)) throw err;

        console.error(`[${requestId}] emergency_local_fallback after upstream timeout`);
        result = buildEmergencyRecommendation(goal);
        res.setHeader('X-Recommendation-Mode', 'emergency-local-fallback');
      }
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
      sizeLimit: '16kb',
    },
  },
};
