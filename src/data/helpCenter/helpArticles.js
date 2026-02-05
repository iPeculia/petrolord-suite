import { basicArticles } from './articles/basics';
import { modelingArticles } from './articles/modeling';
import { analysisArticles } from './articles/analysis';
import { supportArticles } from './articles/support';

// Combine all articles into a single array
export const helpArticles = [
  ...basicArticles,
  ...modelingArticles,
  ...analysisArticles,
  ...supportArticles
];

// Helper to get articles by category
export const getArticlesByCategory = (categoryId) => {
  return helpArticles.filter(article => 
    article.category.toLowerCase().replace(/\s+/g, '-') === categoryId ||
    article.category === categoryId // Handle exact matches if IDs differ from names
  );
};

export default helpArticles;