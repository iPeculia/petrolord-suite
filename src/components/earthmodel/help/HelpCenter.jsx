import React, { useState } from 'react';
import { useHelp } from '@/context/HelpContext';
import { useHelpSearch } from '@/hooks/useHelpSearch';
import { helpCategories } from '@/data/helpCenter/helpCategories';
import { helpArticles } from '@/data/helpCenter/helpArticles';
import { helpFAQ } from '@/data/helpCenter/helpFAQ';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Search, Book, ChevronRight, ArrowLeft, FileText, HelpCircle, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const HelpCenter = () => {
  const { isOpen, toggleHelp } = useHelp();
  const { query, results, handleSearch, clearSearch } = useHelpSearch();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setActiveArticle(null);
    clearSearch();
  };

  const handleArticleClick = (article) => {
    setActiveArticle(article);
  };

  const handleBack = () => {
    if (activeArticle) {
      setActiveArticle(null);
    } else if (activeCategory) {
      setActiveCategory(null);
    } else {
      toggleHelp();
    }
  };

  const filteredArticles = activeCategory 
    ? helpArticles.filter(a => a.category === activeCategory.name)
    : [];

  return (
    <Sheet open={isOpen} onOpenChange={toggleHelp}>
      <SheetContent className="w-[400px] sm:w-[600px] bg-slate-950 border-l border-slate-800 text-slate-100 p-0 flex flex-col z-[100]">
        
        {/* Header */}
        <SheetHeader className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {(activeCategory || activeArticle) && (
                <Button variant="ghost" size="icon" className="h-8 w-8 mr-1 text-slate-400 hover:text-white" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <SheetTitle className="text-white flex items-center gap-2 m-0">
                {activeArticle ? (
                  <FileText className="w-5 h-5 text-blue-500" />
                ) : activeCategory ? (
                  <activeCategory.icon className="w-5 h-5 text-blue-500" />
                ) : (
                  <Book className="w-5 h-5 text-blue-500" />
                )}
                {activeArticle ? 'Article' : activeCategory ? activeCategory.name : 'Help Center'}
              </SheetTitle>
            </div>
          </div>
          
          {!activeArticle && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search articles, guides, and more..." 
                className="pl-9 bg-slate-900 border-slate-700 focus:border-blue-500 text-sm"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          )}
        </SheetHeader>

        {/* Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            
            {/* Search Results */}
            {query && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search Results</h3>
                {results.length > 0 ? (
                  results.map(article => (
                    <div 
                      key={article.id} 
                      className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
                      onClick={() => handleArticleClick(article)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-blue-400 group-hover:text-blue-300">{article.title}</h4>
                        <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500">{article.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2 mb-2">{article.content.substring(0, 150)}...</p>
                      <div className="flex items-center text-xs text-slate-500 gap-2">
                        <span>{article.category}</span>
                        <span>•</span>
                        <span>Updated {article.lastUpdated}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No results found for "{query}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Active Article View */}
            {!query && activeArticle && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{activeArticle.title}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="bg-slate-800 text-slate-300 hover:bg-slate-700">
                      {activeArticle.category}
                    </Badge>
                    {activeArticle.tags?.map(tag => (
                      <Badge key={tag} variant="outline" className="border-slate-700 text-slate-500">#{tag}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="prose prose-invert prose-sm max-w-none prose-headings:text-slate-200 prose-a:text-blue-400 prose-strong:text-white">
                  <ReactMarkdown>{activeArticle.content}</ReactMarkdown>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-800">
                  <h4 className="text-sm font-medium text-slate-400 mb-3">Was this article helpful?</h4>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 border-slate-700 hover:bg-slate-800">Yes</Button>
                    <Button variant="outline" size="sm" className="h-8 border-slate-700 hover:bg-slate-800">No</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Category Detail View */}
            {!query && !activeArticle && activeCategory && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-1">{activeCategory.name}</h2>
                  <p className="text-slate-400 text-sm">{activeCategory.description}</p>
                </div>

                <div className="space-y-2">
                  {filteredArticles.map(article => (
                    <div 
                      key={article.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 border border-slate-800/50 hover:bg-slate-900 hover:border-blue-500/30 cursor-pointer group transition-all"
                      onClick={() => handleArticleClick(article)}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-400" />
                        <span className="text-sm text-slate-300 group-hover:text-white">{article.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Main Menu (Categories) */}
            {!query && !activeArticle && !activeCategory && (
              <Tabs defaultValue="categories" className="w-full">
                <TabsList className="w-full grid grid-cols-2 bg-slate-900 mb-6">
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="space-y-6 mt-0">
                  <div className="grid grid-cols-2 gap-3">
                    {helpCategories.map(category => (
                      <div 
                        key={category.id}
                        className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:bg-slate-900 hover:border-blue-500/50 cursor-pointer transition-all group"
                        onClick={() => handleCategoryClick(category)}
                      >
                        <category.icon className="w-6 h-6 text-blue-500 mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="font-semibold text-sm text-slate-200 mb-1 group-hover:text-white">{category.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{category.description}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="faq" className="mt-0">
                  <Accordion type="single" collapsible className="w-full">
                    {helpFAQ.map(faq => (
                      <AccordionItem key={faq.id} value={faq.id} className="border-slate-800">
                        <AccordionTrigger className="text-sm text-slate-200 hover:text-blue-400">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-slate-400 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>
              </Tabs>
            )}

          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all">
            Contact Support <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
          </Button>
        </div>

      </SheetContent>
    </Sheet>
  );
};

export default HelpCenter;