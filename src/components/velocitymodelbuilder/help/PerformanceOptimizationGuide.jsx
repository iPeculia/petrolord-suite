import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cpu, Zap, Database, Server } from 'lucide-react';

const PerformanceOptimizationGuide = () => {
  const tips = [
    {
        title: "Grid Resolution",
        icon: Database,
        text: "Avoid over-sampling. For regional models, a 50m or 100m bin size is usually sufficient. Only use 12.5m or 25m grids for detailed field-level conversion."
    },
    {
        title: "GPU Acceleration",
        icon: Zap,
        text: "Enable WebGL compute shaders in settings. This offloads heavy interpolation (Kriging/RBF) to your graphics card, speeding up model building by 10-50x."
    },
    {
        title: "Cloud Batching",
        icon: Server,
        text: "For models with >500 wells or probabilistic runs (P10/P50/P90 with 1000 iterations), use the 'Cloud Runner' to process in the background without freezing your browser."
    },
    {
        title: "Browser Memory",
        icon: Cpu,
        text: "Large SEGY volumes (>2GB) should be pre-processed or streamed. If the browser crashes, try downsampling the input horizons or closing unused browser tabs."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-white">Performance Optimization</h2>
      <p className="text-slate-400 text-sm mb-4">
        Ensure smooth operation when handling basin-scale datasets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
                <CardContent className="p-4 flex gap-4">
                    <div className="p-3 bg-slate-800 rounded-lg h-fit">
                        <tip.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h4 className="text-white font-medium mb-1">{tip.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{tip.text}</p>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
};

export default PerformanceOptimizationGuide;