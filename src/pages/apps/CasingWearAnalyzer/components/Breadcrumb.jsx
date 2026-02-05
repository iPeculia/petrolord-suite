import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = () => {
  return (
    <nav className="bg-[#1a1a2e] border-b border-slate-800 px-6 py-2 flex items-center gap-2 text-xs font-medium shrink-0">
      <Link 
        to="/" 
        className="text-slate-400 hover:text-[#FFC107] flex items-center gap-1 transition-colors"
      >
        <Home className="w-3 h-3" />
        Home
      </Link>
      
      <ChevronRight className="w-3 h-3 text-slate-600" />
      
      <Link 
        to="/dashboard/apps/drilling" 
        className="text-slate-400 hover:text-[#FFC107] transition-colors"
      >
        Drilling & Completions
      </Link>
      
      <ChevronRight className="w-3 h-3 text-slate-600" />
      
      <span className="text-slate-200">Casing Wear Analyzer</span>
    </nav>
  );
};

export default Breadcrumb;