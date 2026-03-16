import { useState, useEffect, useRef, useCallback } from 'react';
import { KNOWLEDGE_BASE, SUB_CATEGORIES, FALLBACK_RESULT } from './knowledgeBase';
import { CATEGORIES } from './domain/categories';
import {
  findBestKnowledgeBaseMatch,
  getParentCategoryId,
  resolveKnowledgeBaseKey,
} from './domain/recommendationEngine';
import ToolCard from './components/ToolCard';
import Spinner from './components/Spinner';
import {
  getCache, setCache, getCacheAge, setCacheRefreshTime,
  getHistory, addToHistory, clearHistory,
  fetchFromAPI, formatDate, timeAgo, cacheKey,
} from './utils';

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

  const appendHistory = useCallback((goal, categoryId) => {
    const updated = addToHistory(goal, categoryId);
    setHistory(updated);
  }, []);

  // Core search function
  const handleSearch = useCallback(async (goal, categoryId = null) => {
    if (!goal.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    // 1. Check cache
    const queryKey = cacheKey(categoryId || goal);
    const cached = getCache(queryKey);
    if (cached) {
      setResult(cached);
      setLoading(false);
      appendHistory(goal, categoryId);
      return;
    }

    // 2. Category/sub-category picks can use prebuilt knowledge base directly.
    if (categoryId) {
      const knowledgeBaseKey = resolveKnowledgeBaseKey({
        categoryId,
        queryKey,
        knowledgeBase: KNOWLEDGE_BASE,
      });
      if (knowledgeBaseKey) {
        const kbResult = KNOWLEDGE_BASE[knowledgeBaseKey];
        setResult(kbResult);
        setCache(queryKey, kbResult);
        setLoading(false);
        appendHistory(goal, categoryId);
        return;
      }
    }

    // 3. Try live API
    try {
      const data = await fetchFromAPI(goal);
      setResult(data);
      setCache(queryKey, data);
    } catch {
      setError('Live recommendations timed out. Showing fallback suggestions.');

      // 4. Fallback to knowledge base or generic result
      const fallback = findBestKnowledgeBaseMatch(goal, KNOWLEDGE_BASE);
      if (fallback) {
        setResult(fallback);
      } else {
        setResult(FALLBACK_RESULT);
      }
    }

    setLoading(false);
    appendHistory(goal, categoryId);
  }, [appendHistory]);

  // Category click handler
  const handleCategory = (category) => {
    setActiveCategory(category.id);
    setActiveSubCategory(null);
    setQuery(category.label);

    // If this category has sub-categories, show them instead of searching immediately
    if (SUB_CATEGORIES[category.id]) {
      setResult(null);
      setError(null);
      return;
    }

    handleSearch(category.prompt, category.id);
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
      setActiveCategory(getParentCategoryId(item.categoryId));
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
