import { useState, useEffect, useRef, useCallback } from 'react';
import { KNOWLEDGE_BASE, SUB_CATEGORIES, FALLBACK_RESULT } from './knowledgeBase';
import {
  getCache, setCache, getCacheAge, setCacheRefreshTime,
  getHistory, addToHistory, clearHistory,
  fetchFromAPI, formatDate, timeAgo, cacheKey,
} from './utils';

// ============================================
// Categories
// ============================================

const CATEGORIES = [
  { id: 'photo', emoji: '🖼️', label: 'Photo Editing', prompt: 'editing or enhancing photos, removing backgrounds, creating AI images, or image generation' },
  { id: 'coding', emoji: '💻', label: 'Coding & Apps', prompt: 'building an app, writing code, debugging software, or creating a website' },
  { id: 'video', emoji: '🎬', label: 'Video Creation', prompt: 'creating, editing, or generating video content, short clips, or animations' },
  { id: 'writing', emoji: '✍️', label: 'Writing & Content', prompt: 'writing blog posts, emails, essays, scripts, social media content, or marketing copy' },
  { id: 'music', emoji: '🎵', label: 'Music & Audio', prompt: 'generating music, creating sound effects, cloning voice, or audio editing' },
  { id: 'research', emoji: '🔬', label: 'Research & Learning', prompt: 'researching a topic, summarising documents, fact-checking, or learning something new' },
  { id: 'business', emoji: '📊', label: 'Business & Productivity', prompt: 'automating tasks, building spreadsheets, creating presentations, or managing workflows' },
  { id: 'design', emoji: '🎨', label: 'Design & 3D', prompt: 'creating graphic designs, logos, UI mockups, or 3D models and renders' },
];

// ============================================
// ToolCard Component
// ============================================

function ToolCard({ tool, index }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 140);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className="tool-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.05}s`,
        '--tool-color': tool.color,
      }}
    >
      <div className="tool-card-header">
        <div
          className="tool-icon"
          style={{
            background: `linear-gradient(135deg, ${tool.color}28, ${tool.color}0a)`,
            border: `1px solid ${tool.color}40`,
          }}
        >
          {tool.emoji}
        </div>
        <div className="tool-content">
          <div className="tool-meta">
            <span className="tool-name">{tool.name}</span>
            {tool.model && (
              <span
                className="tool-model-badge"
                style={{
                  background: `${tool.color}18`,
                  color: tool.color,
                  border: `1px solid ${tool.color}35`,
                }}
              >
                {tool.model}
              </span>
            )}
            <span className={`tool-free-badge ${tool.free ? 'free' : 'paid'}`}>
              {tool.free ? '✓ Free tier' : '$ Paid'}
            </span>
          </div>
          <p className="tool-description">{tool.description}</p>
          {tool.steps && (
            <div className="tool-steps">
              <div className="tool-steps-label">How to start</div>
              {tool.steps.map((s, i) => (
                <div key={i} className="tool-step">
                  <span className="tool-step-num" style={{ color: tool.color }}>{i + 1}.</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          )}
          {tool.url && (
            <a
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className="tool-link"
              style={{ color: tool.color }}
            >
              → {tool.url.replace('https://', '').replace('www.', '')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Spinner Component
// ============================================

function Spinner() {
  return (
    <div className="spinner-container">
      <div className="spinner-ring" />
      <span className="spinner-text">consulting the atlas…</span>
    </div>
  );
}

// ============================================
// Main AIAtlas Component
// ============================================

export default function AIAtlas() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(() => getCacheAge() || new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [history, setHistory] = useState(() => getHistory());
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef(null);

  // Simulated cron: refresh knowledge base timestamp every 24h
  useEffect(() => {
    const interval = setInterval(() => {
      setCacheRefreshTime();
      setLastUpdated(new Date());
    }, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Core search function
  const handleSearch = useCallback(async (goal, catId = null) => {
    if (!goal.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    // 1. Check cache
    const key = cacheKey(catId || goal);
    const cached = getCache(key);
    if (cached) {
      setResult(cached);
      setLoading(false);
      const updated = addToHistory(goal, catId);
      setHistory(updated);
      return;
    }

    // 2. Check pre-built knowledge base
    const kbKey = catId || key;
    if (KNOWLEDGE_BASE[kbKey]) {
      const kbResult = KNOWLEDGE_BASE[kbKey];
      setResult(kbResult);
      setCache(key, kbResult);
      setLoading(false);
      const updated = addToHistory(goal, catId);
      setHistory(updated);
      return;
    }

    // 3. Try live API
    try {
      const data = await fetchFromAPI(goal);
      setResult(data);
      setCache(key, data);
    } catch {
      // 4. Fallback to knowledge base or generic result
      const fallback = findBestMatch(goal);
      if (fallback) {
        setResult(fallback);
        setCache(key, fallback);
      } else {
        setResult(FALLBACK_RESULT);
      }
    }

    setLoading(false);
    const updated = addToHistory(goal, catId);
    setHistory(updated);
  }, []);

  // Find best matching knowledge base entry for a query
  function findBestMatch(query) {
    const q = query.toLowerCase();
    const keywords = {
      photo: ['photo', 'image', 'picture', 'edit', 'background', 'retouch'],
      coding: ['code', 'coding', 'app', 'website', 'program', 'develop', 'build', 'debug', 'software'],
      video: ['video', 'clip', 'film', 'animation', 'movie', 'edit video'],
      writing: ['write', 'writing', 'blog', 'article', 'essay', 'content', 'copy', 'email', 'script'],
      music: ['music', 'song', 'audio', 'sound', 'voice', 'beat', 'track'],
      research: ['research', 'learn', 'study', 'summarize', 'summarise', 'search', 'fact'],
      business: ['business', 'automate', 'spreadsheet', 'presentation', 'workflow', 'productivity'],
      design: ['design', 'logo', 'graphic', 'ui', 'mockup', '3d', 'model'],
    };

    let bestCategory = null;
    let bestScore = 0;

    for (const [cat, words] of Object.entries(keywords)) {
      const score = words.filter(w => q.includes(w)).length;
      if (score > bestScore) {
        bestScore = score;
        bestCategory = cat;
      }
    }

    return bestCategory ? KNOWLEDGE_BASE[bestCategory] || null : null;
  }

  // Category click handler
  const handleCategory = (cat) => {
    setActiveCategory(cat.id);
    setActiveSubCategory(null);
    setQuery(cat.label);

    // If this category has sub-categories, show them instead of searching immediately
    if (SUB_CATEGORIES[cat.id]) {
      setResult(null);
      setError(null);
      return;
    }

    handleSearch(cat.prompt, cat.id);
  };

  // Sub-category click handler
  const handleSubCategory = (sub) => {
    setActiveSubCategory(sub.id);
    setQuery(sub.label.replace(/^[^\s]+\s/, '')); // Remove emoji prefix
    handleSearch(sub.prompt, sub.id);
  };

  // Free-text submit
  const handleSubmit = () => {
    setActiveCategory(null);
    setActiveSubCategory(null);
    handleSearch(query);
  };

  // History replay
  const handleHistoryClick = (item) => {
    setQuery(item.query);
    setShowHistory(false);
    if (item.categoryId) {
      setActiveCategory(item.categoryId.split('_')[0]);
      setActiveSubCategory(item.categoryId.includes('_') ? item.categoryId : null);
      handleSearch(item.query, item.categoryId);
    } else {
      setActiveCategory(null);
      setActiveSubCategory(null);
      handleSearch(item.query);
    }
  };

  // Refresh knowledge base
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setCacheRefreshTime();
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 1800);
  };

  // Clear history
  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  const showSubCategories = activeCategory && SUB_CATEGORIES[activeCategory] && !result && !loading;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <div className="atlas-bg" />

      <div className="atlas-container">
        {/* Header */}
        <header className="atlas-header">
          <div className="atlas-badge">
            <div className="atlas-badge-dot" />
            <span className="atlas-badge-text">
              KNOWLEDGE BASE — {formatDate(lastUpdated)}
            </span>
          </div>

          <h1 className="atlas-title">The AI Atlas</h1>

          <p className="atlas-subtitle">
            Tell us what you're trying to do. We'll find the right AI tools for you.
          </p>
          <p className="atlas-hint">
            No technical knowledge required.
          </p>
        </header>

        {/* Search Bar */}
        <div className="search-container">
          <div className="search-box">
            <textarea
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="e.g. I want to edit photos of my kids… or build a simple app for my shop…"
              rows={2}
              className="search-textarea"
            />
            <button
              className="search-btn"
              onClick={handleSubmit}
              disabled={loading || !query.trim()}
            >
              Find Tools →
            </button>
          </div>
        </div>

        {/* Search History */}
        {history.length > 0 && (
          <div className="history-section">
            <button
              className="history-toggle"
              onClick={() => setShowHistory(!showHistory)}
            >
              <span>{showHistory ? '▾' : '▸'}</span>
              <span>Recent searches ({history.length})</span>
            </button>
            {showHistory && (
              <div className="history-list">
                {history.map((item, i) => (
                  <div
                    key={i}
                    className="history-item"
                    onClick={() => handleHistoryClick(item)}
                  >
                    <span className="history-query">{item.query}</span>
                    <span className="history-time">{timeAgo(item.timestamp)}</span>
                  </div>
                ))}
                <button className="history-clear" onClick={handleClearHistory}>
                  Clear history
                </button>
              </div>
            )}
          </div>
        )}

        {/* Categories */}
        <div className="categories-section">
          <div className="section-label">Or browse by category</div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => handleCategory(cat)}
              >
                <div className="cat-emoji">{cat.emoji}</div>
                <div className="cat-label">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Categories (Branching) */}
        {showSubCategories && (
          <div className="sub-categories">
            <div className="sub-categories-label">
              {SUB_CATEGORIES[activeCategory].question}
            </div>
            <div className="sub-categories-grid">
              {SUB_CATEGORIES[activeCategory].options.map(sub => (
                <button
                  key={sub.id}
                  className={`sub-btn ${activeSubCategory === sub.id ? 'active' : ''}`}
                  onClick={() => handleSubCategory(sub)}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Divider */}
        <hr className="atlas-divider" />

        {/* Loading */}
        {loading && <Spinner />}

        {/* Error */}
        {error && <div className="error-box">{error}</div>}

        {/* Results */}
        {result && !loading && (
          <div>
            <div className="results-summary">
              <div className="results-summary-label">Atlas recommends</div>
              <p className="results-summary-text">{result.summary}</p>
            </div>

            {result.tools?.map((tool, i) => (
              <ToolCard key={`${tool.name}-${i}`} tool={tool} index={i} />
            ))}

            <div className="atlas-footer">
              <span className="footer-info">
                Powered by Claude · Updated every 24h
              </span>
              <button
                className="refresh-btn"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? '↻ Refreshing…' : '↻ Refresh knowledge base'}
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && !showSubCategories && (
          <div className="empty-state">
            <div className="empty-icon">🧭</div>
            <p className="empty-text">
              Type your goal or pick a category above to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
