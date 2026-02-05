import { helpArticles } from '@/data/helpArticles';

export const helpService = {
  getArticle: async (id) => {
    return new Promise(resolve => {
      setTimeout(() => resolve(helpArticles.find(a => a.id === id)), 100);
    });
  },
  
  searchArticles: async (query) => {
    return new Promise(resolve => {
      const lowerQuery = query.toLowerCase();
      const results = helpArticles.filter(a => 
        a.title.toLowerCase().includes(lowerQuery) || 
        a.content.toLowerCase().includes(lowerQuery) ||
        a.tags.some(t => t.toLowerCase().includes(lowerQuery))
      );
      setTimeout(() => resolve(results), 200);
    });
  },

  getCategories: async () => {
    return ['Getting Started', 'Features', 'Workflows', 'Troubleshooting', 'FAQ'];
  }
};