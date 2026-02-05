import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Printer, Share2, ThumbsUp, ChevronRight, FileText, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const ExpandableHelpArticle = ({ article, onBack, onRelatedClick }) => {
  const { toast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    // In a real app, this would be a deep link. Using placeholder for now.
    const url = window.location.href + `?article=${article.id}`;
    navigator.clipboard.writeText(url);
    toast({ title: "Link Copied", description: "Article link copied to clipboard." });
  };

  const handleHelpful = () => {
    toast({ title: "Feedback Sent", description: "Thanks for your feedback!" });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 animate-in slide-in-from-right-4 duration-300">
      {/* Header / Nav */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-10 print:hidden">
        <div className="flex items-center gap-2 text-sm text-slate-400">
            <Button variant="ghost" size="sm" onClick={onBack} className="hover:text-white pl-0 gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="truncate max-w-[200px]">{article.title}</span>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleCopyLink} title="Copy Link">
                <Share2 className="w-4 h-4 text-slate-400 hover:text-white" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handlePrint} title="Print Article">
                <Printer className="w-4 h-4 text-slate-400 hover:text-white" />
            </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full">
        <div className="space-y-8 pb-20 print:p-0">
            
            {/* Article Title Block */}
            <div className="space-y-4 border-b border-slate-800 pb-6">
                <h1 className="text-3xl font-bold text-white tracking-tight">{article.title}</h1>
                <p className="text-lg text-slate-400 leading-relaxed">{article.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1.5"><FileText className="w-3 h-3" /> {article.readTime} read</span>
                    <span>•</span>
                    <span>Updated recently</span>
                </div>
            </div>

            {/* Sections */}
            <div className="space-y-10">
                {article.sections.map((section, idx) => (
                    <div key={idx} className="space-y-3 group">
                        <h2 className="text-xl font-semibold text-slate-200 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                            <span className="text-blue-500/50 text-sm font-mono">0{idx + 1}.</span> 
                            {section.heading}
                        </h2>
                        <div className="text-slate-300 leading-7 text-base whitespace-pre-line pl-8 border-l-2 border-slate-800/50 hover:border-slate-700 transition-colors">
                            {section.content}
                        </div>
                        {section.image && (
                            <div className="mt-4 pl-8">
                                <div className="aspect-video bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-slate-600">
                                    <ImageIcon className="w-8 h-8 mr-2" />
                                    <span className="text-sm">Diagram: {section.heading}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Feedback & Footer */}
            <div className="pt-10 mt-10 border-t border-slate-800 print:hidden">
                <div className="flex flex-col items-center gap-4 text-center">
                    <p className="text-slate-400 text-sm">Was this article helpful?</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleHelpful} className="border-slate-700 hover:bg-slate-800 text-slate-300">
                            <ThumbsUp className="w-4 h-4 mr-2" /> Yes, thanks!
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800 text-slate-300">
                            No, improve it
                        </Button>
                    </div>
                </div>
            </div>

            {/* Related Articles */}
            {article.relatedLinks && article.relatedLinks.length > 0 && (
                <div className="pt-8 print:hidden">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Related Articles</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Mock mapping since we don't have the full list in props usually, 
                            in a real app we'd lookup ID. For now just generic buttons */}
                        <Button variant="secondary" className="justify-start h-auto py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300">
                            <FileText className="w-4 h-4 mr-3 text-blue-500" />
                            <span className="truncate">Advanced Configuration Guide</span>
                        </Button>
                        <Button variant="secondary" className="justify-start h-auto py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300">
                            <FileText className="w-4 h-4 mr-3 text-blue-500" />
                            <span className="truncate">Exporting Data Formats</span>
                        </Button>
                    </div>
                </div>
            )}

        </div>
      </ScrollArea>
    </div>
  );
};

export default ExpandableHelpArticle;