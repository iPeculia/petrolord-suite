import { useHelpCenter } from '@/context/HelpCenterContext';

// Re-exporting the hook from context for easier imports
// Also adding some derived state logic if needed in the future

export { useHelpCenter };

export const useHelpNavigation = () => {
  const { goHome, goToCategory, openArticle, toggleHelp } = useHelpCenter();
  return { goHome, goToCategory, openArticle, toggleHelp };
};

export const useHelpSearch = () => {
  const { searchQuery, handleSearch, searchResults, suggestions } = useHelpCenter();
  return { searchQuery, handleSearch, searchResults, suggestions };
};