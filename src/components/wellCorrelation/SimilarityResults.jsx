import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const SimilarityResults = ({ data }) => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <div className="text-3xl font-bold text-slate-200">{(data.score * 100).toFixed(0)}%</div>
        <div className="text-xs text-slate-500 uppercase tracking-wider">Correlation Score</div>
      </div>

      <div className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded border border-slate-800">
        <span className="text-slate-400">Confidence</span>
        <Badge variant={data.confidence === 'High' ? 'success' : 'warning'} className="text-[10px]">
          {data.confidence}
        </Badge>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold text-slate-300">Matched Zones</h4>
        {data.zones.map((zone, idx) => (
          <div key={idx} className="bg-slate-900/50 p-2 rounded border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Depth: {zone.start}-{zone.end}m</span>
              <span className="font-mono text-purple-400">{(zone.similarity * 100).toFixed(0)}%</span>
            </div>
            <Progress value={zone.similarity * 100} className="h-1 bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarityResults;