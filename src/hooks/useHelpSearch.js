import { useState, useEffect, useCallback } from 'react';
import { searchHelpArticles, getSearchSuggestions } from '@/utils/helpSearch';

export const useHelpSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback((searchQuery) => {
    setQuery(searchQuery);
    setIsSearching(true);
    
    if (searchQuery.trim()) {
      const searchResults = searchHelpArticles(searchQuery);
      setResults(searchResults);
      
      const searchSuggestions = getSearchSuggestions(searchQuery);
      setSuggestions(searchSuggestions);
    } else {
      setResults([]);
      setSuggestions([]);
    }
    
    setIsSearching(false);
  }, []);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
  };

  return {
    query,
    results,
    suggestions,
    isSearching,
    handleSearch,
    clearSearch
  };
};