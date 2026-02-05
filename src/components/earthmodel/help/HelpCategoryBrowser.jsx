import React from 'react';
import { useHelpCenter } from '@/context/HelpCenterContext';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const HelpCategoryBrowser = () => {
  const { categories, goToCategory } = useHelpCenter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => goToCategory(category)}
            className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 hover:bg-slate-800/60 hover:border-blue-500/30 transition-all group text-left"
          >
            <div className="p-2.5 rounded-lg bg-slate-800 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
              <Icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-slate-200 group-hover:text-white truncate">
                  {category.name}
                </h3>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 group-hover:text-slate-400">
                {category.description}
              </p>
              <div className="mt-2 text-[10px] font-medium text-slate-600 group-hover:text-blue-500/70">
                {category.articleCount} articles
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default HelpCategoryBrowser;