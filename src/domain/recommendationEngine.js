const KEYWORDS_BY_CATEGORY = {
  photo: ['photo', 'image', 'picture', 'edit', 'background', 'retouch'],
  coding: ['code', 'coding', 'app', 'website', 'program', 'develop', 'build', 'debug', 'software'],
  video: ['video', 'clip', 'film', 'animation', 'movie', 'subtitle', 'caption'],
  writing: ['write', 'writing', 'blog', 'article', 'essay', 'content', 'copy', 'email', 'script'],
  music: ['music', 'song', 'audio', 'sound', 'voice', 'beat', 'track', 'podcast', 'audiobook'],
  research: ['research', 'learn', 'study', 'summarize', 'summarise', 'search', 'fact'],
  business: ['business', 'automate', 'spreadsheet', 'presentation', 'workflow', 'productivity'],
  design: ['design', 'logo', 'graphic', 'ui', 'mockup', '3d', 'model', 'brand'],
  legal: ['legal', 'law', 'contract', 'policy', 'compliance', 'regulation'],
  companion: ['companion', 'coach', 'chat', 'emotional', 'storytelling', 'language practice'],
  marketing: ['marketing', 'seo', 'campaign', 'social media', 'ads', 'newsletter'],
  education: ['education', 'tutor', 'study', 'exam', 'homework', 'course'],
  health: ['health', 'fitness', 'nutrition', 'symptom', 'wellness', 'sleep'],
  finance: ['finance', 'tax', 'budget', 'bookkeeping', 'invoice', 'investment'],
  data: ['data', 'analytics', 'dashboard', 'visualize', 'machine learning', 'web scraping'],
  translation: ['translate', 'translation', 'language', 'localise', 'localize', 'interpretation'],
};

export function getParentCategoryId(categoryId) {
  if (!categoryId || typeof categoryId !== 'string') return null;
  return categoryId.includes('_') ? categoryId.split('_')[0] : categoryId;
}

export function resolveKnowledgeBaseKey({ categoryId, queryKey, knowledgeBase }) {
  if (!knowledgeBase || typeof knowledgeBase !== 'object') return null;

  if (categoryId && knowledgeBase[categoryId]) return categoryId;

  if (categoryId) {
    const parentCategoryId = getParentCategoryId(categoryId);
    if (parentCategoryId && knowledgeBase[parentCategoryId]) {
      return parentCategoryId;
    }
  }

  if (queryKey && knowledgeBase[queryKey]) return queryKey;
  return null;
}

export function findBestKnowledgeBaseMatch(query, knowledgeBase) {
  const q = query.toLowerCase();
  let bestCategory = null;
  let bestScore = 0;

  for (const [category, words] of Object.entries(KEYWORDS_BY_CATEGORY)) {
    const score = words.filter((word) => q.includes(word)).length;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory && knowledgeBase?.[bestCategory] ? knowledgeBase[bestCategory] : null;
}
