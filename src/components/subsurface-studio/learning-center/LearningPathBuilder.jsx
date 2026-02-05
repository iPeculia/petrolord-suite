import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Map, ArrowRight } from 'lucide-react';

const LearningPathBuilder = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Map className="w-5 h-5 mr-2 text-orange-400" /> Path Builder
        </h3>
        <Card className="bg-slate-950 border-slate-800 h-64 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-50">
                 <div className="p-4 bg-slate-900 border border-slate-700 rounded">Basics</div>
                 <ArrowRight className="text-slate-600" />
                 <div className="p-4 bg-slate-900 border border-slate-700 rounded">Intermediate</div>
                 <ArrowRight className="text-slate-600" />
                 <div className="p-4 bg-slate-900 border border-slate-700 rounded">Advanced</div>
             </div>
             <div className="z-10 text-sm text-slate-200 bg-black/50 px-4 py-2 rounded backdrop-blur-sm">
                 Drag modules here to construct a learning sequence.
             </div>
        </Card>
    </div>
);
export default LearningPathBuilder;