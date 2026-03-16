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

const SYSTEM_PROMPT = `You are an AI tool navigator for absolute beginners. Given a goal, recommend 2-4 specific AI tools.

IMPORTANT: Use your web search tool to look up the latest AI tools, their current pricing, and available models/versions BEFORE responding. This ensures your recommendations are accurate and up-to-date.

After searching, respond with ONLY valid JSON — no markdown, no explanation outside the JSON:
{
  "summary": "1-2 sentences explaining the approach for a total beginner",
  "tools": [
    {
      "name": "Tool Name",
      "emoji": "relevant emoji",
      "color": "#hexcolor (pick a distinctive vibrant color per tool, e.g. #6ee7f7, #f97316, #a78bfa, #34d399, #fb7185)",
      "model": "specific model name if applicable, e.g. 'claude-opus-4-6' or 'Imagen 3' or null",
      "free": true or false,
      "description": "2-3 sentences: what it does, why it's good for beginners, what makes it special",
      "steps": ["Step 1 to get started", "Step 2", "Step 3"],
      "url": "https://official-url.com"
    }
  ]
}

Rules:
- ALWAYS search the web first to verify current tool availability, pricing, and latest model versions
- Be specific about which model/version to use inside each tool
- Prioritise tools with free tiers for beginners
- For coding tasks: mention Cursor or VS Code + Claude claude-opus-4-6 or claude-sonnet-4-6
- For photo/image tasks: mention Google Gemini with Imagen, Adobe Firefly, or Midjourney
- For writing: mention Claude.ai, ChatGPT, or Notion AI
- Colors: use vibrant, distinct hex colors like #6ee7f7, #f97316, #a78bfa, #34d399, #fb7185
- Always include beginner-friendly steps (3 steps max)
- Verify URLs are correct and currently accessible`;

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
