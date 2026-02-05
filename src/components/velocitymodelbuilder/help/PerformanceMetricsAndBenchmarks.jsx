import React from 'react';
import { BarChart3 } from 'lucide-react';

const PerformanceMetricsAndBenchmarks = () => {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-bold text-white">System Benchmarks</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <div className="text-2xl font-bold text-white mb-1">500+</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Wells per Project</div>
            </div>
            <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <div className="text-2xl font-bold text-white mb-1">2GB</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Max Grid Size (Browser)</div>
            </div>
            <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <div className="text-2xl font-bold text-white mb-1">&lt;2s</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Re-gridding Time (GPU)</div>
            </div>
            <div className="p-4 bg-slate-950 rounded border border-slate-800">
                <div className="text-2xl font-bold text-white mb-1">99.9%</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Uptime SLA</div>
            </div>
        </div>
    </div>
  );
};

export default PerformanceMetricsAndBenchmarks;