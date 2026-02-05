import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useHelpCenter } from '@/context/HelpCenterContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, User, ThumbsUp, ThumbsDown, Share2, Printer, 
  Flag, Bookmark, ChevronLeft, ExternalLink 
} from 'lucide-react';

const HelpArticleViewer = () => {
  const { currentArticle, goHome, submitFeedback, goToCategory, categories } = useHelpCenter();

  if (!currentArticle) return null;

  const category = categories.find(c => c.name === currentArticle.category);

  const handlePrint = () => {
    const printContent = document.getElementById('help-article-content');
    const win = window.open('', '', 'height=700,width=900');
    win.document.write('<html><head><title>Print Article</title>');
    win.document.write('</head><body >');
    win.document.write(printContent.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Navigation Header */}
      <div className="flex items-center gap-2 mb-6 text-sm text-slate-500">
        <button onClick={goHome} className="hover:text-blue-400 transition-colors">Home</button>
        <span>/</span>
        {category && (
          <>
            <button onClick={() => goToCategory(category)} className="hover:text-blue-400 transition-colors">
              {category.name}
            </button>
            <span>/</span>
          </>
        )}
        <span className="text-slate-300 truncate max-w-[200px]">{currentArticle.title}</span>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex gap-2 mb-3">
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-0">
            {currentArticle.category}
          </Badge>
          {currentArticle.difficulty && (
            <Badge variant="outline" className="border-slate-700 text-slate-400">
              {currentArticle.difficulty}
            </Badge>
          )}
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
          {currentArticle.title}
        </h1>

        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>Petrolord Support</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Updated {currentArticle.lastUpdated || 'Recently'}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div id="help-article-content" className="prose prose-invert prose-slate max-w-none prose-headings:text-slate-200 prose-p:text-slate-400 prose-a:text-blue-400 prose-code:bg-slate-800 prose-code:text-blue-300 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 mb-12">
        <ReactMarkdown>{currentArticle.content}</ReactMarkdown>
      </div>

      <Separator className="bg-slate-800 my-6" />

      {/* Feedback & Actions */}
      <div className="flex flex-col gap-6 pb-12">
        <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-800">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-300">Was this article helpful?</span>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-400"
                onClick={() => submitFeedback(currentArticle.id, true)}
              >
                <ThumbsUp className="w-4 h-4 mr-2" /> Yes
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-3 hover:bg-red-500/10 hover:text-red-400 text-slate-400"
                onClick={() => submitFeedback(currentArticle.id, false)}
              >
                <ThumbsDown className="w-4 h-4 mr-2" /> No
              </Button>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-600 px-2">
          <button className="hover:text-slate-400 flex items-center gap-1">
            <Flag className="w-3 h-3" /> Report an issue with this article
          </button>
          <span>Article ID: {currentArticle.id}</span>
        </div>
      </div>
    </div>
  );
};

export default HelpArticleViewer;