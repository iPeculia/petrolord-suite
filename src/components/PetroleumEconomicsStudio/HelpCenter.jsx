import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Book, Video, HelpCircle, FileText, Play, ChevronRight, Download, ArrowRight, Zap, X } from 'lucide-react';
import { helpContent } from '@/pages/apps/PetroleumEconomicsStudio/data/helpContent';
import ExpandableHelpArticle from './ExpandableHelpArticle';
import GlossaryModal from './GlossaryModal';
import { cn } from '@/lib/utils';
import { jsPDF } from 'jspdf';

const HelpCenter = ({ isOpen, onClose, onReplayOnboarding }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeArticle, setActiveArticle] = useState(null);
  const [activeGlossaryTerm, setActiveGlossaryTerm] = useState(null);

  // --- Filtering Logic ---
  const filteredArticles = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.toLowerCase();
    return helpContent.articles.filter(article => 
      article.title.toLowerCase().includes(query) || 
      article.description.toLowerCase().includes(query) ||
      article.sections.some(s => s.content.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const filteredGlossary = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return helpContent.glossary.filter(item => 
      item.term.toLowerCase().includes(query) || 
      item.definition.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // --- Navigation Handlers ---
  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setActiveArticle(null);
  };

  const handleArticleClick = (article) => {
    setActiveArticle(article);
  };

  const handleBack = () => {
    if (activeArticle) {
        setActiveArticle(null);
    } else {
        setActiveCategory(null);
    }
  };

  const handleDownloadCheatSheet = () => {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Petroleum Economics Studio - Cheat Sheet", 20, 20);
      doc.setFontSize(12);
      doc.text("Quick Reference Guide", 20, 30);
      
      doc.setFontSize(14);
      doc.text("Key Shortcuts", 20, 50);
      doc.setFontSize(10);
      doc.text("? : Open Help", 20, 60);
      doc.text("Ctrl+S : Save Project", 20, 66);
      doc.text("Esc : Close Modals", 20, 72);

      doc.setFontSize(14);
      doc.text("Core Formulas", 20, 90);
      doc.setFontSize(10);
      doc.text("NPV = Sum(Cashflow / (1+r)^t)", 20, 100);
      doc.text("Payback = Time to recover initial investment", 20, 106);

      doc.save("PES_Cheat_Sheet.pdf");
  };

  // --- Icon Helper ---
  const getIcon = (iconName) => {
      switch(iconName) {
          case 'Rocket': return <Zap className="w-5 h-5 text-purple-400" />;
          case 'BookOpen': return <Book className="w-5 h-5 text-blue-400" />;
          case 'Monitor': return <FileText className="w-5 h-5 text-emerald-400" />;
          case 'Wrench': return <HelpCircle className="w-5 h-5 text-amber-400" />;
          default: return <FileText className="w-5 h-5" />;
      }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-5xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             {activeCategory || activeArticle ? (
                 <Button variant="ghost" size="icon" onClick={handleBack} className="text-slate-400 hover:text-white">
                     <ArrowRight className="w-5 h-5 rotate-180" />
                 </Button>
             ) : (
                 <div className="p-2 bg-blue-600/20 rounded-lg">
                     <HelpCircle className="w-6 h-6 text-blue-400" />
                 </div>
             )}
             <h2 className="text-lg font-semibold">
                 {activeArticle ? 'Article View' : activeCategory ? helpContent.categories.find(c => c.id === activeCategory)?.title : 'Help Center'}
             </h2>
          </div>
          
          <div className="flex items-center gap-2 w-full max-w-md mx-4">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                placeholder="Search for answers..." 
                className="pl-9 bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-blue-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-500 hover:text-white">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
          </div>

          <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onReplayOnboarding} className="hidden sm:flex border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs">
                  <Play className="w-3 h-3 mr-2" /> Tour
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
              </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
            
            {/* SEARCH RESULTS OVERLAY */}
            {searchQuery && (
                <div className="absolute inset-0 bg-slate-950 z-20 overflow-y-auto p-6 animate-in fade-in duration-200">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase mb-4">Search Results</h3>
                    {filteredArticles.length === 0 && filteredGlossary.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">No results found for "{searchQuery}"</div>
                    ) : (
                        <div className="space-y-6">
                            {filteredArticles.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-xs text-slate-500 font-bold">ARTICLES</div>
                                    {filteredArticles.map(article => (
                                        <div key={article.id} onClick={() => { setActiveArticle(article); setSearchQuery(''); }} className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:border-blue-500 cursor-pointer transition-colors group">
                                            <div className="font-medium text-blue-400 group-hover:underline">{article.title}</div>
                                            <div className="text-sm text-slate-400 line-clamp-1">{article.description}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {filteredGlossary.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-xs text-slate-500 font-bold">GLOSSARY</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {filteredGlossary.map((term, idx) => (
                                            <div key={idx} onClick={() => setActiveGlossaryTerm(term)} className="p-3 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 cursor-pointer">
                                                <div className="font-bold text-slate-200">{term.term}</div>
                                                <div className="text-xs text-slate-500 line-clamp-2">{term.simple}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* VIEW: ARTICLE */}
            {activeArticle ? (
                <ExpandableHelpArticle article={activeArticle} onBack={handleBack} />
            ) : (
                <Tabs defaultValue="browse" className="h-full flex flex-col">
                    <div className="border-b border-slate-800 bg-slate-900/50 px-6 pt-2 shrink-0">
                        <TabsList className="bg-transparent border-b border-transparent w-full justify-start h-10 p-0 space-x-6">
                            <TabsTrigger value="browse" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-blue-500 rounded-none px-0 pb-2 text-slate-400 data-[state=active]:text-blue-400">Browse Topics</TabsTrigger>
                            <TabsTrigger value="glossary" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-blue-500 rounded-none px-0 pb-2 text-slate-400 data-[state=active]:text-blue-400">Glossary</TabsTrigger>
                            <TabsTrigger value="videos" className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 border-blue-500 rounded-none px-0 pb-2 text-slate-400 data-[state=active]:text-blue-400">Video Tutorials</TabsTrigger>
                        </TabsList>
                    </div>

                    <ScrollArea className="flex-1 bg-slate-950">
                        <div className="p-6 md:p-8 max-w-5xl mx-auto">
                            
                            {/* TAB: BROWSE */}
                            <TabsContent value="browse" className="mt-0 space-y-8 outline-none">
                                {!activeCategory ? (
                                    <>
                                        {/* Home Dashboard */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {helpContent.categories.map(cat => (
                                                <div 
                                                    key={cat.id} 
                                                    onClick={() => handleCategoryClick(cat.id)}
                                                    className="group p-5 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/50 hover:bg-slate-900/80 cursor-pointer transition-all flex items-start gap-4"
                                                >
                                                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 group-hover:border-blue-500/30 transition-colors">
                                                        {getIcon(cat.icon)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{cat.title}</h3>
                                                        <p className="text-sm text-slate-400 mt-1 leading-snug">{cat.description}</p>
                                                    </div>
                                                    <ChevronRight className="w-5 h-5 text-slate-600 ml-auto self-center group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="md:col-span-2">
                                                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Most Viewed Articles</h3>
                                                <div className="space-y-3">
                                                    {helpContent.articles.slice(0, 3).map(article => (
                                                        <div key={article.id} onClick={() => handleArticleClick(article)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-900 cursor-pointer group">
                                                            <div className="text-slate-500 font-mono text-xs w-6 text-right">0{helpContent.articles.indexOf(article) + 1}</div>
                                                            <div className="flex-1">
                                                                <div className="font-medium text-slate-300 group-hover:text-blue-400 transition-colors">{article.title}</div>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div className="bg-gradient-to-br from-slate-900 to-blue-950/20 border border-slate-800 rounded-xl p-5 flex flex-col justify-center items-center text-center">
                                                <div className="p-3 bg-blue-500/10 rounded-full mb-3">
                                                    <Download className="w-6 h-6 text-blue-400" />
                                                </div>
                                                <h4 className="font-bold text-white mb-1">Quick Reference</h4>
                                                <p className="text-xs text-slate-400 mb-4">Download a PDF cheat sheet with shortcuts and key formulas.</p>
                                                <Button size="sm" onClick={handleDownloadCheatSheet} className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                                                    Download Cheat Sheet
                                                </Button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // Category View
                                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="mb-6">
                                            <h2 className="text-2xl font-bold text-white mb-2">{helpContent.categories.find(c => c.id === activeCategory)?.title}</h2>
                                            <p className="text-slate-400">Select an article to read.</p>
                                        </div>
                                        <div className="space-y-2">
                                            {helpContent.articles.filter(a => a.categoryId === activeCategory).map(article => (
                                                <div 
                                                    key={article.id} 
                                                    onClick={() => handleArticleClick(article)}
                                                    className="p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-600 cursor-pointer flex justify-between items-center group transition-all"
                                                >
                                                    <div>
                                                        <h3 className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{article.title}</h3>
                                                        <p className="text-sm text-slate-500 mt-1">{article.description}</p>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-xs text-slate-600 font-mono hidden sm:inline-block">{article.readTime} read</span>
                                                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {/* TAB: GLOSSARY */}
                            <TabsContent value="glossary" className="mt-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {helpContent.glossary.map((term, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => setActiveGlossaryTerm(term)}
                                            className="p-4 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 cursor-pointer group transition-colors"
                                        >
                                            <div className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors mb-1">{term.term}</div>
                                            <p className="text-xs text-slate-400 line-clamp-2">{term.simple}</p>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                            {/* TAB: VIDEOS */}
                            <TabsContent value="videos" className="mt-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {helpContent.videos.map((vid, idx) => (
                                        <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all cursor-pointer group">
                                            <div className={`aspect-video w-full ${vid.thumbnail} flex items-center justify-center relative`}>
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                                                    <Play className="w-5 h-5 text-white fill-current" />
                                                </div>
                                                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono text-white">
                                                    {vid.duration}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-slate-200 mb-1 group-hover:text-blue-400 transition-colors">{vid.title}</h3>
                                                <p className="text-xs text-slate-500">Video Tutorial</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>

                        </div>
                    </ScrollArea>
                </Tabs>
            )}
        </div>
      </DialogContent>

      <GlossaryModal term={activeGlossaryTerm} onClose={() => setActiveGlossaryTerm(null)} />
    </Dialog>
  );
};

export default HelpCenter;