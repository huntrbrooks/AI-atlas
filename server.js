import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3001;

// Load .env file manually (no dotenv dependency)
function loadEnv() {
  const envPath = join(__dirname, '.env');
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIndex = trimmed.indexOf('=');
        if (eqIndex > 0) {
          const key = trimmed.slice(0, eqIndex).trim();
          const val = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

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

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

const server = createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  if (req.method === 'POST' && req.url === '/api/recommend') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set. Create a .env file with your key.' }));
    }

    try {
      const { goal } = await parseBody(req);

      const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 16000,
          system: SYSTEM_PROMPT,
          tools: [{
            type: 'web_search_20250305',
            name: 'web_search',
            max_uses: 5,
          }],
          messages: [{ role: 'user', content: `My goal: ${goal}` }],
        }),
      });

      const data = await apiRes.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '{}';
      const clean = text.replace(/```json|```/g, '').trim();
      const result = JSON.parse(clean);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (err) {
      console.error('API Error:', err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Failed to get recommendations from Claude API.' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`\n  🧭 AI Atlas API Server`);
  console.log(`  ━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  Running on http://localhost:${PORT}`);
  console.log(`  Web Search: ✓ Enabled (Claude searches the web for up-to-date results)`);
  console.log(`  API Key: ${process.env.ANTHROPIC_API_KEY ? '✓ Loaded' : '✗ Missing — create .env file'}\n`);
});
