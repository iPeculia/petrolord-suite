import React, { useState } from 'react';
import { Search, ArrowRight, FileText, BookOpen, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const HelpSearchEngine = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  
  // Mock Search Index
  const searchIndex = [
    { id: 1, title: 'Importing Checkshots', category: 'Workflow', type: 'guide', relevance: 'high' },
    { id: 2, title: 'Velocity Inversion QC', category: 'Best Practices', type: 'article', relevance: 'medium' },
    { id: 3, title: 'Export to Petrel', category: 'Integration', type: 'guide', relevance: 'high' },
    { id: 4, title: 'Anisotropy Parameters (VTI)', category: 'Reference', type: 'def', relevance: 'low' },
    { id: 5, title: 'Time-Depth Conversion Basics', category: 'Getting Started', type: 'video', relevance: 'high' },
  ];

  const results = query 
    ? searchIndex.filter(item => item.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative z-10">
        <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input 
                placeholder="Search help articles, tutorials, and definitions..." 
                className="pl-10 h-10 bg-slate-900 border-slate-700 focus:border-blue-500 text-slate-200"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </div>
        {query && (
            <div className="absolute top-12 left-0 right-0 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden max-h-64">
                <ScrollArea className="h-full">
                    {results.length > 0 ? (
                        <div className="py-2">
                            {results.map(res => (
                                <div 
                                    key={res.id} 
                                    className="px-4 py-2 hover:bg-slate-800 cursor-pointer flex items-center justify-between group"
                                    onClick={() => onNavigate && onNavigate(res.category)}
                                >
                                    <div className="flex items-center gap-3">
                                        {res.type === 'video' ? <BookOpen className="w-4 h-4 text-purple-400" /> : <FileText className="w-4 h-4 text-blue-400" />}
                                        <div>
                                            <div className="text-sm text-slate-200 font-medium">{res.title}</div>
                                            <div className="text-[10px] text-slate-500">{res.category}</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-slate-500">
                            No results found for "{query}"
                        </div>
                    )}
                </ScrollArea>
            </div>
        )}
    </div>
  );
};

export default HelpSearchEngine;