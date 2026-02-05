import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Video, HelpCircle } from 'lucide-react';
import { useHelpCenter } from '@/context/HelpCenterContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const HelpSearchBar = ({ className }) => {
  const { searchQuery, handleSearch, suggestions, openArticle } = useHelpCenter();
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-3 h-3 text-purple-400" />;
      case 'faq': return <HelpCircle className="w-3 h-3 text-orange-400" />;
      default: return <FileText className="w-3 h-3 text-blue-400" />;
    }
  };

  return (
    <div ref={wrapperRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="How can we help? (e.g. 'Faults', 'Gridding')"
          className="pl-9 pr-8 bg-slate-900/50 border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all h-10"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        {searchQuery && (
          <button 
            onClick={() => handleSearch('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {isFocused && searchQuery && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1">
            <h4 className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested</h4>
            {suggestions.map((suggestion, idx) => (
              <div
                key={`${suggestion.type}-${suggestion.id}-${idx}`}
                className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 cursor-pointer transition-colors group"
                onClick={() => {
                  if(suggestion.type === 'article') openArticle(suggestion.id);
                  // For other types we might route differently, but for now just search or expand
                  if(suggestion.type !== 'article') handleSearch(suggestion.text);
                  setIsFocused(false);
                }}
              >
                {getIcon(suggestion.type)}
                <span className="text-sm text-slate-300 group-hover:text-white truncate flex-1">
                  {suggestion.text}
                </span>
                <Badge variant="outline" className="text-[10px] h-4 px-1 border-slate-700 text-slate-500 capitalize">
                  {suggestion.type}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSearchBar;