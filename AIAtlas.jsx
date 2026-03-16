import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "photo", emoji: "🖼️", label: "Photo Editing", prompt: "editing or enhancing photos, removing backgrounds, creating AI images, or image generation" },
  { id: "coding", emoji: "💻", label: "Coding & Apps", prompt: "building an app, writing code, debugging software, or creating a website" },
  { id: "video", emoji: "🎬", label: "Video Creation", prompt: "creating, editing, or generating video content, short clips, or animations" },
  { id: "writing", emoji: "✍️", label: "Writing & Content", prompt: "writing blog posts, emails, essays, scripts, social media content, or marketing copy" },
  { id: "music", emoji: "🎵", label: "Music & Audio", prompt: "generating music, creating sound effects, cloning voice, or audio editing" },
  { id: "research", emoji: "🔬", label: "Research & Learning", prompt: "researching a topic, summarising documents, fact-checking, or learning something new" },
  { id: "business", emoji: "📊", label: "Business & Productivity", prompt: "automating tasks, building spreadsheets, creating presentations, or managing workflows" },
  { id: "design", emoji: "🎨", label: "Design & 3D", prompt: "creating graphic designs, logos, UI mockups, or 3D models and renders" },
];

const LAST_UPDATED = (() => {
  const d = new Date();
  d.setHours(d.getHours() - 2);
  return d;
})();

function ToolCard({ tool, index }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 120);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "all 0.4s ease",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "12px",
      padding: "20px 22px",
      marginBottom: "14px",
    }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <div style={{
          minWidth: "42px", height: "42px",
          background: `linear-gradient(135deg, ${tool.color}33, ${tool.color}11)`,
          border: `1px solid ${tool.color}44`,
          borderRadius: "10px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "20px",
        }}>{tool.emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Crimson Text', Georgia, serif", fontSize: "18px", fontWeight: 600, color: "#f0ede6" }}>{tool.name}</span>
            {tool.model && (
              <span style={{
                fontSize: "11px", fontFamily: "monospace",
                background: `${tool.color}22`, color: tool.color,
                border: `1px solid ${tool.color}44`,
                borderRadius: "4px", padding: "2px 7px", letterSpacing: "0.05em"
              }}>{tool.model}</span>
            )}
            <span style={{
              fontSize: "11px", fontFamily: "monospace",
              background: tool.free ? "#22c55e22" : "#f59e0b22",
              color: tool.free ? "#4ade80" : "#fbbf24",
              border: `1px solid ${tool.free ? "#22c55e44" : "#f59e0b44"}`,
              borderRadius: "4px", padding: "2px 7px"
            }}>{tool.free ? "Free tier" : "Paid"}</span>
          </div>
          <p style={{ margin: "6px 0 10px", color: "#9d9b96", fontSize: "14px", lineHeight: "1.6" }}>{tool.description}</p>
          {tool.steps && (
            <div style={{ background: "rgba(0,0,0,0.25)", borderRadius: "8px", padding: "10px 14px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#6b6860", marginBottom: "6px", textTransform: "uppercase" }}>How to start</div>
              {tool.steps.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px", fontSize: "13px", color: "#c4c0b8" }}>
                  <span style={{ color: tool.color, fontFamily: "monospace", minWidth: "16px" }}>{i + 1}.</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
          {tool.url && (
            <a href={tool.url} target="_blank" rel="noreferrer" style={{
              display: "inline-block", marginTop: "10px",
              fontSize: "12px", color: tool.color,
              textDecoration: "none", fontFamily: "monospace",
              letterSpacing: "0.05em", opacity: 0.8
            }}>→ {tool.url.replace("https://", "")}</a>
          )}
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "48px 0" }}>
      <div style={{
        width: "40px", height: "40px",
        border: "2px solid rgba(255,255,255,0.08)",
        borderTop: "2px solid #c9a96e",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <span style={{ color: "#6b6860", fontSize: "13px", fontFamily: "monospace", letterSpacing: "0.1em" }}>consulting the atlas...</span>
    </div>
  );
}

async function fetchRecommendations(goal) {
  const systemPrompt = `You are an AI tool navigator for absolute beginners. Given a goal, recommend 2-4 specific AI tools.

Respond with ONLY valid JSON — no markdown, no explanation outside the JSON:
{
  "summary": "1-2 sentences explaining the approach for a total beginner",
  "tools": [
    {
      "name": "Tool Name",
      "emoji": "relevant emoji",
      "color": "#hexcolor (pick a distinctive color per tool)",
      "model": "specific model name if applicable, e.g. 'claude-opus-4-6' or 'Imagen 3' or null",
      "free": true or false,
      "description": "2-3 sentences: what it does, why it's good for beginners, what makes it special",
      "steps": ["Step 1 to get started", "Step 2", "Step 3"],
      "url": "https://official-url.com"
    }
  ]
}

Rules:
- Be specific about which model/version to use inside each tool
- Prioritise tools with free tiers for beginners
- For coding tasks: mention Cursor or VS Code + Claude claude-opus-4-6 or claude-sonnet-4-6
- For photo/image tasks: mention Google Gemini with Imagen, Adobe Firefly, or Midjourney
- For writing: mention Claude.ai, ChatGPT, or Notion AI
- Colors: use vibrant, distinct hex colors like #6ee7f7, #f97316, #a78bfa, #34d399, #fb7185
- Always include beginner-friendly steps (3 steps max)`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: `My goal: ${goal}` }],
    }),
  });
  const data = await response.json();
  const text = data.content?.find(b => b.type === "text")?.text || "{}";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export default function AIAtlas() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(LAST_UPDATED);
  const [refreshing, setRefreshing] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = async (goal) => {
    if (!goal.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await fetchRecommendations(goal);
      setResult(data);
    } catch (e) {
      setError("Couldn't reach the Atlas. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat.id);
    setQuery(cat.label);
    handleSearch(cat.prompt);
  };

  const handleSubmit = () => {
    setActiveCategory(null);
    handleSearch(query);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 1800);
  };

  const formatDate = (d) =>
    d.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" }) +
    " at " + d.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0e0c",
      color: "#f0ede6",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
        .cat-btn:hover { background: rgba(255,255,255,0.06) !important; border-color: rgba(201,169,110,0.3) !important; transform: translateY(-1px); }
        .search-btn:hover { background: #b8913a !important; }
        .refresh-btn:hover { opacity: 1 !important; }
        textarea:focus { outline: none; border-color: rgba(201,169,110,0.5) !important; }
      `}</style>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 20px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "60px 0 40px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(201,169,110,0.08)", border: "1px solid rgba(201,169,110,0.2)",
            borderRadius: "20px", padding: "5px 14px", marginBottom: "24px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "11px", color: "#c9a96e", letterSpacing: "0.15em", fontFamily: "monospace" }}>
              KNOWLEDGE BASE — {formatDate(lastUpdated)}
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Crimson Text', Georgia, serif",
            fontSize: "clamp(42px, 8vw, 64px)",
            fontWeight: 600, margin: "0 0 8px",
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, #f0ede6 30%, #c9a96e)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>The AI Atlas</h1>

          <p style={{ color: "#6b6860", fontSize: "16px", margin: "0 0 6px", fontWeight: 300 }}>
            Tell us what you're trying to do. We'll find the right AI tools for you.
          </p>
          <p style={{ color: "#4b4943", fontSize: "13px", margin: 0, fontStyle: "italic" }}>
            No technical knowledge required.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px", padding: "4px",
            display: "flex", gap: "8px", alignItems: "flex-end",
          }}>
            <textarea
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              placeholder="e.g. I want to edit photos of my kids... or build a simple app for my shop..."
              rows={2}
              style={{
                flex: 1, background: "transparent", border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "10px", padding: "14px 16px",
                color: "#f0ede6", fontSize: "15px", resize: "none",
                fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s",
              }}
            />
            <button
              className="search-btn"
              onClick={handleSubmit}
              disabled={loading || !query.trim()}
              style={{
                background: "#c9a96e", color: "#0f0e0c",
                border: "none", borderRadius: "10px",
                padding: "14px 22px", fontSize: "14px", fontWeight: 500,
                cursor: loading || !query.trim() ? "not-allowed" : "pointer",
                opacity: loading || !query.trim() ? 0.5 : 1,
                transition: "all 0.2s", whiteSpace: "nowrap",
                marginBottom: "4px",
              }}
            >Find Tools →</button>
          </div>
        </div>

        {/* Categories */}
        <div style={{ marginBottom: "36px" }}>
          <div style={{ fontSize: "11px", color: "#4b4943", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px", fontFamily: "monospace" }}>
            Or browse by category
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "8px" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className="cat-btn"
                onClick={() => handleCategory(cat)}
                style={{
                  background: activeCategory === cat.id ? "rgba(201,169,110,0.1)" : "rgba(255,255,255,0.02)",
                  border: activeCategory === cat.id ? "1px solid rgba(201,169,110,0.4)" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "10px", padding: "12px 14px",
                  color: activeCategory === cat.id ? "#c9a96e" : "#9d9b96",
                  fontSize: "13px", cursor: "pointer",
                  textAlign: "left", transition: "all 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <div style={{ fontSize: "20px", marginBottom: "4px" }}>{cat.emoji}</div>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", marginBottom: "32px" }} />

        {/* Results */}
        {loading && <Spinner />}

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "10px", padding: "16px 18px", color: "#f87171", fontSize: "14px"
          }}>{error}</div>
        )}

        {result && !loading && (
          <div>
            <div style={{
              background: "rgba(201,169,110,0.06)", border: "1px solid rgba(201,169,110,0.15)",
              borderRadius: "10px", padding: "14px 18px", marginBottom: "24px",
            }}>
              <div style={{ fontSize: "11px", color: "#c9a96e", letterSpacing: "0.12em", fontFamily: "monospace", marginBottom: "6px", textTransform: "uppercase" }}>Atlas recommends</div>
              <p style={{ margin: 0, color: "#c4c0b8", fontSize: "15px", lineHeight: "1.65", fontFamily: "'Crimson Text', serif" }}>{result.summary}</p>
            </div>

            {result.tools?.map((tool, i) => (
              <ToolCard key={i} tool={tool} index={i} />
            ))}

            <div style={{ marginTop: "28px", padding: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "12px", color: "#4b4943", fontFamily: "monospace" }}>
                Powered by Claude · Updated every 24h
              </span>
              <button
                className="refresh-btn"
                onClick={handleRefresh}
                disabled={refreshing}
                style={{
                  background: "none", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "6px", padding: "5px 12px",
                  color: "#6b6860", fontSize: "12px", cursor: "pointer",
                  fontFamily: "monospace", opacity: refreshing ? 0.5 : 0.7,
                  transition: "all 0.2s",
                }}
              >
                {refreshing ? "↻ Refreshing..." : "↻ Refresh knowledge base"}
              </button>
            </div>
          </div>
        )}

        {!result && !loading && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "12px", opacity: 0.3 }}>🧭</div>
            <p style={{ color: "#4b4943", fontSize: "14px" }}>
              Type your goal or pick a category above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
