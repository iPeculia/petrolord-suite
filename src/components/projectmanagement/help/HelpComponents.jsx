import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlayCircle, FileText, ChevronRight } from 'lucide-react';

export const CategoryCard = ({ category, onClick }) => {
  const Icon = category.icon;
  return (
    <Card 
      className="bg-slate-800 border-slate-700 hover:border-blue-500 hover:bg-slate-750 cursor-pointer transition-all group"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
        <div className="p-3 rounded-full bg-slate-900 group-hover:bg-blue-900/30 transition-colors">
          <Icon className="w-8 h-8 text-blue-400" />
        </div>
        <div>
          <h3 className="font-bold text-white mb-1">{category.title}</h3>
          <p className="text-sm text-slate-400 line-clamp-2">{category.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const ArticleViewer = ({ article, onBack }) => {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-2 cursor-pointer hover:text-white" onClick={onBack}>
        <span>&larr; Back to Categories</span>
      </div>
      <div className="flex-1 overflow-y-auto pr-4">
        <h1 className="text-3xl font-bold text-white mb-6">{article.title}</h1>
        <div 
          className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
};

export const FAQSection = ({ faqs }) => (
  <ScrollArea className="h-full pr-4">
    <div className="space-y-4">
      {faqs.map((item, index) => (
        <div key={index} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
          <h4 className="font-bold text-white mb-2 flex items-start gap-2">
            <span className="text-blue-400">Q:</span> {item.q}
          </h4>
          <p className="text-slate-300 text-sm pl-6">{item.a}</p>
        </div>
      ))}
    </div>
  </ScrollArea>
);

export const GlossarySection = ({ terms }) => (
  <ScrollArea className="h-full pr-4">
    <div className="grid grid-cols-1 gap-4">
      {terms.map((item, index) => (
        <div key={index} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
          <span className="font-mono font-bold text-lime-400 min-w-[100px]">{item.term}</span>
          <span className="text-slate-300 text-sm">{item.def}</span>
        </div>
      ))}
    </div>
  </ScrollArea>
);

export const TutorialCard = ({ tutorial }) => (
  <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden group cursor-pointer hover:border-blue-500 transition-all">
    <div className={`h-32 ${tutorial.thumbnail} relative flex items-center justify-center`}>
      <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
      <Badge className="absolute bottom-2 right-2 bg-black/70 hover:bg-black/70">{tutorial.duration}</Badge>
    </div>
    <div className="p-3">
      <h4 className="font-semibold text-white text-sm group-hover:text-blue-400 transition-colors">{tutorial.title}</h4>
    </div>
  </div>
);