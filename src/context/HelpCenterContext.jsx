import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { searchHelpContent, getSearchSuggestions } from '@/utils/helpSearch.enhanced';
import { helpArticles } from '@/data/helpCenter/helpArticles';
import { helpCategories } from '@/data/helpCenter/helpCategories';

const HelpCenterContext = createContext(null);

export const HelpCenterProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('home'); // home, article, category, search, faq, video, resource
  const [currentArticle, setCurrentArticle] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ articles: [], faqs: [], videos: [], resources: [] });
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState([]);

  // Navigation Actions
  const toggleHelp = useCallback(() => setIsOpen(prev => !prev), []);
  
  const goHome = useCallback(() => {
    setView('home');
    setCurrentArticle(null);
    setCurrentCategory(null);
    setSearchQuery('');
  }, []);

  const goToCategory = useCallback((category) => {
    setCurrentCategory(category);
    setView('category');
  }, []);

  const openArticle = useCallback((articleId) => {
    const article = helpArticles.find(a => a.id === articleId);
    if (article) {
      setCurrentArticle(article);
      // If article has a category, set it for breadcrumbs
      if (article.category) {
        const cat = helpCategories.find(c => c.name === article.category);
        if (cat) setCurrentCategory(cat);
      }
      setView('article');
      
      // Add to history
      setHistory(prev => {
        const newHistory = [article, ...prev.filter(h => h.id !== article.id)];
        return newHistory.slice(0, 10);
      });
    }
  }, []);

  // Search Actions
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (query.trim().length > 1) {
      const results = searchHelpContent(query);
      setSearchResults(results);
      setSuggestions(getSearchSuggestions(query));
      setView('search');
    } else {
      setSearchResults({ articles: [], faqs: [], videos: [], resources: [] });
      setSuggestions([]);
      if (view === 'search') setView('home');
    }
  }, [view]);

  // Feedback Actions (Mock)
  const submitFeedback = useCallback((articleId, isHelpful) => {
    console.log(`Feedback for ${articleId}: ${isHelpful ? 'Helpful' : 'Not Helpful'}`);
    // In real app, send to API
  }, []);

  return (
    <HelpCenterContext.Provider value={{
      isOpen,
      toggleHelp,
      view,
      setView,
      currentArticle,
      openArticle,
      currentCategory,
      goToCategory,
      goHome,
      searchQuery,
      handleSearch,
      searchResults,
      suggestions,
      history,
      submitFeedback,
      categories: helpCategories
    }}>
      {children}
    </HelpCenterContext.Provider>
  );
};

export const useHelpCenter = () => {
  const context = useContext(HelpCenterContext);
  if (!context) {
    throw new Error('useHelpCenter must be used within a HelpCenterProvider');
  }
  return context;
};

export default HelpCenterContext;