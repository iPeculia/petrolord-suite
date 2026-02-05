import React, { createContext, useContext, useState } from 'react';
import { helpService } from '@/services/help/helpService';

const HelpContext = createContext();

export const useHelp = () => useContext(HelpContext);

export const HelpProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const toggleHelp = () => setIsOpen(!isOpen);

  const openArticle = async (articleId) => {
    const article = await helpService.getArticle(articleId);
    setCurrentArticle(article);
    setIsOpen(true);
  };

  const searchHelp = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = await helpService.searchArticles(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <HelpContext.Provider value={{ 
      isOpen, 
      toggleHelp, 
      currentArticle, 
      setCurrentArticle, 
      openArticle,
      searchQuery,
      searchHelp,
      searchResults 
    }}>
      {children}
    </HelpContext.Provider>
  );
};