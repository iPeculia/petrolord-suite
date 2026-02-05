import React, { useState, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, BookOpen, ChevronRight, ArrowLeft, Rocket, GraduationCap, Grid, Shield, Code, ExternalLink, Mail } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { helpContent } from '../../data/helpContent';

// Map string icon names to components
const IconMap = {
    'Rocket': Rocket,
    'GraduationCap': GraduationCap,
    'Grid': Grid,
    'BookOpen': BookOpen,
    'Shield': Shield,
    'Code': Code
};

const HelpCenter = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState(null); // null = home
    const [activeArticle, setActiveArticle] = useState(null);

    // Filter content based on search
    const filteredContent = useMemo(() => {
        if (!searchQuery) return null;
        
        const results = [];
        Object.entries(helpContent.articles).forEach(([key, article]) => {
            if (
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.content.toLowerCase().includes(searchQuery.toLowerCase())
            ) {
                results.push({ key, ...article });
            }
        });
        return results;
    }, [searchQuery]);

    const handleArticleClick = (key) => {
        setActiveArticle(helpContent.articles[key]);
    };

    const resetView = () => {
        setActiveCategory(null);
        setActiveArticle(null);
        setSearchQuery('');
    };

    const renderHome = () => (
        <div className="space-y-6 animate-in slide-in-from-left-4">
            <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Browse by Category</h3>
                <div className="grid grid-cols-2 gap-3">
                    {helpContent.categories.map(cat => {
                        const Icon = IconMap[cat.icon] || BookOpen;
                        return (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className="flex flex-col items-center justify-center p-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors gap-2 group"
                            >
                                <div className="p-2 rounded-full bg-slate-950 group-hover:bg-indigo-900/20 transition-colors">
                                    <Icon className="w-6 h-6 text-slate-400 group-hover:text-indigo-400" />
                                </div>
                                <span className="text-xs font-medium text-slate-300 group-hover:text-white">{cat.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-400">Popular Articles</h3>
                <div className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2 text-slate-300" onClick={() => handleArticleClick('quick-start')}>
                        <Rocket className="w-4 h-4 mr-2 text-emerald-500" /> Quick Start Guide
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2 text-slate-300" onClick={() => handleArticleClick('calibration')}>
                        <Grid className="w-4 h-4 mr-2 text-indigo-500" /> How to Calibrate Models
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm h-auto py-2 text-slate-300" onClick={() => handleArticleClick('glossary')}>
                        <BookOpen className="w-4 h-4 mr-2 text-amber-500" /> Glossary of Terms
                    </Button>
                </div>
            </div>

            <Separator className="bg-slate-800" />

            <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                <h3 className="text-sm font-medium text-white mb-2">Need more help?</h3>
                <p className="text-xs text-slate-400 mb-3">
                    Can't find what you're looking for? Contact our support team directly.
                </p>
                <Button size="sm" variant="outline" className="w-full gap-2">
                    <Mail className="w-4 h-4" /> Contact Support
                </Button>
            </div>
        </div>
    );

    const renderCategory = () => {
        const category = helpContent.categories.find(c => c.id === activeCategory);
        const articles = Object.entries(helpContent.articles)
            .filter(([_, art]) => art.category === activeCategory)
            .map(([key, art]) => ({ key, ...art }));

        return (
            <div className="animate-in slide-in-from-right-4">
                <Button variant="ghost" size="sm" onClick={() => setActiveCategory(null)} className="mb-4 -ml-2 text-slate-400">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Categories
                </Button>
                
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                        {category && React.createElement(IconMap[category.icon], { className: "w-6 h-6 text-white" })}
                    </div>
                    <h2 className="text-xl font-bold text-white">{category?.label}</h2>
                </div>

                <div className="space-y-2">
                    {articles.length > 0 ? articles.map(article => (
                        <div 
                            key={article.key}
                            onClick={() => handleArticleClick(article.key)}
                            className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-all flex items-center justify-between group"
                        >
                            <span className="text-sm font-medium text-slate-200 group-hover:text-white">{article.title}</span>
                            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                        </div>
                    )) : (
                        <div className="text-center py-8 text-slate-500 text-sm">
                            No articles found in this category yet.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderArticle = () => (
        <div className="animate-in slide-in-from-right-4 h-full flex flex-col">
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setActiveArticle(null)} 
                className="mb-2 -ml-2 text-slate-400 shrink-0 self-start"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <ScrollArea className="flex-1 pr-4 -mr-4">
                <article className="prose prose-invert prose-sm max-w-none pb-8">
                    <ReactMarkdown>{activeArticle.content}</ReactMarkdown>
                </article>
                
                <div className="mt-8 pt-6 border-t border-slate-800">
                    <p className="text-xs text-slate-500 mb-2">Was this article helpful?</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-8">Yes</Button>
                        <Button variant="outline" size="sm" className="h-8">No</Button>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );

    const renderSearchResults = () => (
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-400 mb-3">
                Search Results ({filteredContent.length})
            </h3>
            {filteredContent.map(article => (
                <div 
                    key={article.key}
                    onClick={() => { handleArticleClick(article.key); setSearchQuery(''); }}
                    className="p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 cursor-pointer transition-all"
                >
                    <div className="text-sm font-medium text-white mb-1">{article.title}</div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] h-5 px-1 border-slate-700 text-slate-400">
                            {helpContent.categories.find(c => c.id === article.category)?.label}
                        </Badge>
                    </div>
                </div>
            ))}
            {filteredContent.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                    No results found for "{searchQuery}"
                </div>
            )}
        </div>
    );

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[540px] bg-slate-950 border-l border-slate-800 text-slate-200 p-0 flex flex-col">
                <SheetHeader className="p-6 border-b border-slate-800 bg-slate-950 shrink-0 z-10">
                    <SheetTitle className="text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-500" /> Help Center
                    </SheetTitle>
                    <div className="relative mt-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input 
                            placeholder="Search documentation..." 
                            className="pl-9 bg-slate-900 border-slate-800 focus-visible:ring-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </SheetHeader>
                
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {searchQuery ? renderSearchResults() : 
                     activeArticle ? renderArticle() :
                     activeCategory ? renderCategory() : 
                     renderHome()}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default HelpCenter;