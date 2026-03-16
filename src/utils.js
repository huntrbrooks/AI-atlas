// Utility functions: cache, history, and API helpers

const CACHE_PREFIX = 'atlas_cache_v2_';
const HISTORY_KEY = 'atlas_history';
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
const MAX_HISTORY = 20;

// ============================================
// Cache Layer (localStorage with TTL)
// ============================================

export function getCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const { data, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function setCache(key, data, ttl = CACHE_TTL) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({
      data,
      expiry: Date.now() + ttl,
    }));
  } catch { /* quota exceeded — silently ignore */ }
}

export function getCacheAge() {
  try {
    const raw = localStorage.getItem('atlas_last_refresh');
    return raw ? new Date(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function setCacheRefreshTime() {
  localStorage.setItem('atlas_last_refresh', JSON.stringify(Date.now()));
}

// ============================================
// Search History
// ============================================

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addToHistory(query, categoryId = null) {
  const history = getHistory();
  // Remove duplicate if exists
  const filtered = history.filter(h => h.query.toLowerCase() !== query.toLowerCase());
  filtered.unshift({
    query,
    categoryId,
    timestamp: Date.now(),
  });
  // Keep max entries
  const trimmed = filtered.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

// ============================================
// API Layer
// ============================================

export async function fetchFromAPI(goal) {
  const res = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal }),
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

// ============================================
// Formatting Helpers
// ============================================

export function formatDate(d) {
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' at ' + d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// ============================================
// Normalize cache key from query string
// ============================================

export function cacheKey(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').slice(0, 80);
}
