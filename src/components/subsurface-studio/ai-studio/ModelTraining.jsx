import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PlayCircle, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ModelTraining = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Settings2 className="w-5 h-5 mr-2 text-slate-400" /> AutoML Configuration
        </h3>
        <div className="grid grid-cols-3 gap-4">
            {['Classification', 'Regression', 'Segmentation'].map((task, i) => (
                <Card key={i} className="bg-slate-950 border-slate-800 hover:bg-slate-900 cursor-pointer group">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                        <PlayCircle className="w-10 h-10 text-slate-600 mb-3 group-hover:text-green-400 transition-colors" />
                        <div className="font-bold text-slate-200">{task}</div>
                        <div className="text-xs text-slate-500 mt-1">Start new job</div>
                    </CardContent>
                </Card>
            ))}
        </div>
        <Card className="bg-slate-950 border-slate-800 p-4">
            <div className="text-sm font-bold text-slate-300 mb-2">Active Resources</div>
            <div className="flex gap-2">
                <Badge variant="secondary">GPU: NVIDIA A100 (2)</Badge>
                <Badge variant="secondary">CPU: 64 Cores</Badge>
                <Badge variant="secondary">RAM: 256 GB</Badge>
            </div>
        </Card>
    </div>
);

export default ModelTraining;