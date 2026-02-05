import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Lightbulb, FileText, ArrowRight } from 'lucide-react';

const GlossaryModal = ({ term, onClose }) => {
  if (!term) return null;

  return (
    <Dialog open={!!term} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-900/30 rounded-lg border border-blue-800/50">
                <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <div>
                <DialogTitle className="text-2xl font-bold">{term.term}</DialogTitle>
                <DialogDescription className="text-slate-400">Petroleum Economics Glossary</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
            
            {/* Simple Definition */}
            <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                <div className="flex items-center gap-2 mb-2 text-emerald-400 font-semibold text-sm uppercase tracking-wide">
                    <Lightbulb className="w-4 h-4" /> In Simple Terms
                </div>
                <p className="text-lg text-slate-200 leading-relaxed font-medium">
                    "{term.simple}"
                </p>
            </div>

            {/* Technical Definition */}
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-400 font-semibold text-sm uppercase tracking-wide">
                    <FileText className="w-4 h-4" /> Technical Definition
                </div>
                <p className="text-slate-300 leading-relaxed border-l-2 border-slate-700 pl-4">
                    {term.definition}
                </p>
            </div>

            {/* Example / Usage */}
            {term.example && (
                <div className="bg-blue-950/10 rounded-lg p-4 border border-blue-900/20">
                    <div className="text-xs font-bold text-blue-400 uppercase mb-1">Example Usage</div>
                    <p className="text-sm text-blue-200 italic">
                        "{term.example}"
                    </p>
                </div>
            )}

            {/* Related (Mock) */}
            <div className="pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 mb-2">Related Concepts</p>
                <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 cursor-pointer hover:bg-slate-700 hover:text-white transition-colors">Cash Flow</span>
                    <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 cursor-pointer hover:bg-slate-700 hover:text-white transition-colors">Economics</span>
                </div>
            </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlossaryModal;