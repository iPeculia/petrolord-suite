import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Database } from 'lucide-react';

const VelocityTrendLearningModule = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" /> Regional Trend Learning
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-3 p-3 bg-blue-900/10 border border-blue-900/30 rounded-lg">
            <Database className="w-5 h-5 text-blue-400 mt-1" />
            <div>
                <h4 className="text-xs font-bold text-blue-200">Knowledge Base Active</h4>
                <p className="text-[10px] text-blue-300/70 mt-1">
                    Model is learning from 1,240 regional wells in the Gulf of Mexico basin. 
                    Recent updates found new compaction trends in the Miocene section.
                </p>
            </div>
        </div>

        <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400">Analog Detection</h4>
            <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-slate-950 rounded border border-slate-800 text-center">
                    <div className="text-xs text-slate-500">Offset Wells</div>
                    <div className="text-sm font-bold text-white">15</div>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 text-center">
                    <div className="text-xs text-slate-500">Similar Fields</div>
                    <div className="text-sm font-bold text-white">3</div>
                </div>
            </div>
        </div>
        
        <div className="h-32 bg-slate-950 rounded border border-slate-800 flex items-center justify-center text-[10px] text-slate-600">
            [Map Visualization: Regional Trends Heatmap]
        </div>
      </CardContent>
    </Card>
  );
};

export default VelocityTrendLearningModule;