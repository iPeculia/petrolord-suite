import React from 'react';
import { AlertTriangle, AlertCircle, Info, X, CheckCircle2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const DataQCBanner = ({ issues, onFix, onDismiss }) => {
  if (!issues || issues.length === 0) return null;

  const criticalCount = issues.filter(i => i.type === 'critical').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const infoCount = issues.filter(i => i.type === 'info').length;

  const getIcon = (type) => {
    switch (type) {
      case 'critical': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-950/30 border-red-900/50';
      case 'warning': return 'bg-yellow-950/30 border-yellow-900/50';
      default: return 'bg-blue-950/30 border-blue-900/50';
    }
  };

  return (
    <div className="w-full bg-slate-950 border-b border-slate-800">
      <div className="px-4 py-2 flex items-center justify-between bg-slate-900/50 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate-300">Data Quality Check:</span>
          {criticalCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-950/50 px-2 py-0.5 rounded-full border border-red-900/50">
              <AlertCircle className="w-3 h-3" /> {criticalCount} Critical
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-yellow-400 bg-yellow-950/50 px-2 py-0.5 rounded-full border border-yellow-900/50">
              <AlertTriangle className="w-3 h-3" /> {warningCount} Warning
            </span>
          )}
          {infoCount > 0 && (
            <span className="flex items-center gap-1.5 text-xs font-medium text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-900/50">
              <Info className="w-3 h-3" /> {infoCount} Info
            </span>
          )}
        </div>
        {/* Only show 'Fix All' if there are fixable issues */}
        {issues.some(i => i.fixAction) && (
             <Button variant="ghost" size="sm" onClick={() => onFix('all')} className="h-7 text-xs text-blue-400 hover:text-blue-300 hover:bg-blue-950/50">
                <Wrench className="w-3 h-3 mr-1.5" /> Fix All Auto-Fixable
             </Button>
        )}
      </div>

      <div className="max-h-48 overflow-y-auto">
        <AnimatePresence>
          {issues.map((issue) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn("flex items-center justify-between px-4 py-2 border-b border-slate-800/50 last:border-0", getBgColor(issue.type))}
            >
              <div className="flex items-center gap-3">
                {getIcon(issue.type)}
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase mr-2 tracking-wide">{issue.location}</span>
                  <span className="text-sm text-slate-200">{issue.description}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {issue.fixAction && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-6 text-xs bg-slate-800 border-slate-700 hover:bg-slate-700"
                    onClick={() => onFix(issue)}
                  >
                    Quick Fix
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-slate-300" onClick={() => onDismiss(issue.id)}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DataQCBanner;