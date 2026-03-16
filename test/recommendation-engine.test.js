import assert from 'node:assert/strict';
import test from 'node:test';
import { KNOWLEDGE_BASE } from '../src/knowledgeBase.js';
import {
  findBestKnowledgeBaseMatch,
  getParentCategoryId,
  resolveKnowledgeBaseKey,
} from '../src/domain/recommendationEngine.js';

test('getParentCategoryId resolves subcategory IDs', () => {
  assert.equal(getParentCategoryId('coding_debug'), 'coding');
  assert.equal(getParentCategoryId('coding'), 'coding');
  assert.equal(getParentCategoryId(null), null);
});

test('resolveKnowledgeBaseKey prefers exact key, then parent category', () => {
  assert.equal(
    resolveKnowledgeBaseKey({
      categoryId: 'coding_debug',
      queryKey: 'unused_query',
      knowledgeBase: KNOWLEDGE_BASE,
    }),
    'coding_debug'
  );

  assert.equal(
    resolveKnowledgeBaseKey({
      categoryId: 'marketing_social',
      queryKey: 'unused_query',
      knowledgeBase: KNOWLEDGE_BASE,
    }),
    'marketing'
  );
});

test('findBestKnowledgeBaseMatch covers newly added top-level categories', () => {
  const translationMatch = findBestKnowledgeBaseMatch('I need to translate a document', KNOWLEDGE_BASE);
  const legalMatch = findBestKnowledgeBaseMatch('help me understand a contract clause', KNOWLEDGE_BASE);
  const financeMatch = findBestKnowledgeBaseMatch('I need help with tax and bookkeeping', KNOWLEDGE_BASE);

  assert.equal(translationMatch, KNOWLEDGE_BASE.translation);
  assert.equal(legalMatch, KNOWLEDGE_BASE.legal);
  assert.equal(financeMatch, KNOWLEDGE_BASE.finance);
});
