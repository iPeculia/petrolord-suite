import { helpArticles } from '@/data/helpCenter/helpArticles';

/**
 * Simple full-text search implementation for Help Center
 */
export const searchHelpArticles = (query) => {
  if (!query) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return helpArticles.filter(article => {
    const inTitle = article.title.toLowerCase().includes(lowerQuery);
    const inContent = article.content.toLowerCase().includes(lowerQuery);
    const inTags = article.tags && article.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
    
    return inTitle || inContent || inTags;
  }).map(article => {
    // Calculate relevance score
    let score = 0;
    if (article.title.toLowerCase().includes(lowerQuery)) score += 10;
    if (article.tags && article.tags.some(t => t.toLowerCase().includes(lowerQuery))) score += 5;
    if (article.content.toLowerCase().includes(lowerQuery)) score += 1;
    
    return { ...article, score };
  }).sort((a, b) => b.score - a.score);
};

export const getSearchSuggestions = (query) => {
  if (!query || query.length < 2) return [];
  
  const results = searchHelpArticles(query);
  return results.slice(0, 5).map(r => r.title);
};