import React from 'react';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';
import { AlertTriangle, CheckCircle, Calendar, Hash } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const DCADataQuality = () => {
  const { dataQuality, currentWell } = useDeclineCurve();
  
  if (!currentWell || !dataQuality.summary) return null;

  const { score, totalRecords, issues, dateRange } = dataQuality;

  const getScoreColor = (s) => {
    if (s >= 90) return 'text-green-500';
    if (s >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-300">Data Quality</h3>
        <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}%</span>
      </div>
      
      <Progress value={score} className="h-2" />

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-800 p-2 rounded">
          <span className="text-slate-500 block">Records</span>
          <span className="font-mono text-slate-200">{totalRecords}</span>
        </div>
        <div className="bg-slate-800 p-2 rounded">
          <span className="text-slate-500 block">Missing</span>
          <span className="font-mono text-slate-200">{issues.missing}</span>
        </div>
      </div>

      <div className="space-y-2">
        {issues.zeros > 0 && (
          <div className="flex items-center gap-2 text-xs text-yellow-400">
            <AlertTriangle size={12} />
            <span>{issues.zeros} zero-rate periods detected</span>
          </div>
        )}
        {issues.negatives > 0 && (
          <div className="flex items-center gap-2 text-xs text-red-400">
            <AlertTriangle size={12} />
            <span>{issues.negatives} negative rates found</span>
          </div>
        )}
        {issues.duplicates > 0 && (
          <div className="flex items-center gap-2 text-xs text-orange-400">
            <AlertTriangle size={12} />
            <span>{issues.duplicates} duplicate dates</span>
          </div>
        )}
        {score === 100 && (
          <div className="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle size={12} />
            <span>Data looks good</span>
          </div>
        )}
      </div>
      
      {dateRange && (
        <div className="text-xs text-slate-500 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1 mb-1">
            <Calendar size={10} />
            <span>Range:</span>
          </div>
          <div>{new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}</div>
        </div>
      )}
    </div>
  );
};

export default DCADataQuality;