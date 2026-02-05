import React from 'react';
import { useHelpCenter } from '@/context/HelpCenterContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, ExternalLink, Book, MessageSquare, Video, FileText } from 'lucide-react';

import HelpSearchBar from './HelpSearchBar';
import HelpCategoryBrowser from './HelpCategoryBrowser';
import HelpArticleViewer from './HelpArticleViewer';
import { faqDetailed } from '@/data/helpCenter/faqDetailed'; // Import directly or via context
import { videosDetailed } from '@/data/helpCenter/videosDetailed';

const HelpCenterEnhanced = () => {
  const { isOpen, toggleHelp, view, goHome, currentArticle, searchResults, suggestions } = useHelpCenter();

  return (
    <Sheet open={isOpen} onOpenChange={toggleHelp}>
      <SheetContent 
        side="right" 
        className="w-full sm:w-[500px] md:w-[600px] lg:w-[700px] bg-slate-950 border-l border-slate-800 text-slate-100 p-0 flex flex-col shadow-2xl z-[100]"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {view !== 'home' && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 -ml-2 mr-1 text-slate-400 hover:text-white hover:bg-slate-800" 
                  onClick={goHome}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <SheetTitle className="text-white flex items-center gap-2 m-0 text-lg">
                <div className="p-1 rounded bg-blue-500/10">
                  <Book className="w-4 h-4 text-blue-500" />
                </div>
                Help Center
              </SheetTitle>
            </div>
          </div>
          
          <HelpSearchBar />
        </div>

        {/* Main Content Area */}
        <ScrollArea className="flex-1">
          <div className="p-6 min-h-[calc(100vh-140px)]">
            
            {/* VIEW: HOME */}
            {view === 'home' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-300">
                
                <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">
                    Browse by Category
                  </h3>
                  <HelpCategoryBrowser />
                </section>

                <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">
                    Quick Links
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start h-auto py-3 border-slate-800 bg-slate-900/30 hover:bg-slate-800 text-slate-300 hover:text-white">
                      <Video className="w-4 h-4 mr-3 text-purple-500" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Video Tutorials</span>
                        <span className="text-[10px] text-slate-500 font-normal">Watch & Learn</span>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-3 border-slate-800 bg-slate-900/30 hover:bg-slate-800 text-slate-300 hover:text-white">
                      <FileText className="w-4 h-4 mr-3 text-emerald-500" />
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium">Documentation</span>
                        <span className="text-[10px] text-slate-500 font-normal">Full Guides</span>
                      </div>
                    </Button>
                  </div>
                </section>

                <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">
                    Common Questions
                  </h3>
                  <div className="space-y-2">
                    {faqDetailed.slice(0, 3).map(faq => (
                      <div key={faq.id} className="p-3 rounded-lg bg-slate-900/50 border border-slate-800/50 text-sm text-slate-300">
                        <p className="font-medium mb-1 text-blue-400">{faq.question}</p>
                        <p className="text-slate-500 text-xs line-clamp-2">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* VIEW: ARTICLE */}
            {view === 'article' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <HelpArticleViewer />
              </div>
            )}

            {/* VIEW: CATEGORY */}
            {view === 'category' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Using Category Browser filtered logic internally or separate component */}
                <div className="text-center py-10 text-slate-500">
                  <p>Category View Implementation Placeholder</p>
                  <Button variant="link" onClick={goHome}>Go Back</Button>
                </div>
              </div>
            )}

            {/* VIEW: SEARCH RESULTS */}
            {view === 'search' && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-sm font-medium text-slate-400">
                  Search Results
                </h3>
                
                {searchResults.articles.length > 0 && (
                  <section className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Articles</h4>
                    {searchResults.articles.map(article => (
                      <div 
                        key={article.id} 
                        className="p-4 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer hover:border-blue-500/50 transition-all group"
                      >
                        <h5 className="text-sm font-medium text-blue-400 group-hover:text-blue-300 mb-1">{article.title}</h5>
                        <p className="text-xs text-slate-500 line-clamp-2">{article.content}</p>
                      </div>
                    ))}
                  </section>
                )}

                {searchResults.faqs.length > 0 && (
                  <section className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">FAQs</h4>
                    {searchResults.faqs.map(faq => (
                      <div key={faq.id} className="p-3 rounded-lg bg-slate-900/50 border border-slate-800">
                        <p className="text-sm font-medium text-slate-300">{faq.question}</p>
                      </div>
                    ))}
                  </section>
                )}

                {searchResults.total === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-slate-900 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Home className="w-6 h-6 text-slate-600" />
                    </div>
                    <h3 className="text-slate-300 font-medium mb-1">No results found</h3>
                    <p className="text-sm text-slate-500">Try adjusting your search terms or browse by category.</p>
                    <Button variant="outline" onClick={goHome} className="mt-4 border-slate-700">
                      Browse Categories
                    </Button>
                  </div>
                )}
              </div>
            )}

          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 z-10">
          <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 transition-all group">
            <MessageSquare className="w-4 h-4 mr-2 opacity-80" />
            Contact Support Team
            <ExternalLink className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HelpCenterEnhanced;