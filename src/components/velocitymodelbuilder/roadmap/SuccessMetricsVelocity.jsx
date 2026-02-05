import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, Clock, Users } from 'lucide-react';

const SuccessMetricsVelocity = () => {
  return (
    <div className="p-4 h-full bg-slate-950 overflow-y-auto">
      <h2 className="text-xl font-bold text-white mb-6">Key Performance Indicators</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-900/20 rounded-lg">
                        <BarChart3 className="w-6 h-6 text-blue-400" />
                    </div>
                    <span className="text-2xl font-bold text-white">98.5%</span>
                </div>
                <h3 className="text-sm font-medium text-slate-300">Model Accuracy</h3>
                <p className="text-xs text-slate-500 mt-1">Target: &lt; 2% depth error in blind well tests.</p>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-900/20 rounded-lg">
                        <Clock className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="text-2xl font-bold text-white">&lt; 2s</span>
                </div>
                <h3 className="text-sm font-medium text-slate-300">Processing Speed</h3>
                <p className="text-xs text-slate-500 mt-1">Time to convert 1M cell grid on standard hardware.</p>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-900/20 rounded-lg">
                        <Users className="w-6 h-6 text-purple-400" />
                    </div>
                    <span className="text-2xl font-bold text-white">85%</span>
                </div>
                <h3 className="text-sm font-medium text-slate-300">User Adoption</h3>
                <p className="text-xs text-slate-500 mt-1">% of Geoscience team using tool weekly.</p>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-orange-900/20 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-orange-400" />
                    </div>
                    <span className="text-2xl font-bold text-white">100%</span>
                </div>
                <h3 className="text-sm font-medium text-slate-300">Audit Compliance</h3>
                <p className="text-xs text-slate-500 mt-1">Models versioned and traceable to raw inputs.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessMetricsVelocity;