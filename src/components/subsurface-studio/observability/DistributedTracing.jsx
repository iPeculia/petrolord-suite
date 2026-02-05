import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Network } from 'lucide-react';

const DistributedTracing = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Network className="w-5 h-5 mr-2 text-orange-400" /> Trace Analysis
        </h3>
        <Card className="bg-slate-950 border-slate-800 p-4">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="font-bold text-white">Trace ID:</span> 8a2b9c4d-1e3f
                    <span className="ml-4 font-bold text-white">Duration:</span> 245ms
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-24 text-[10px] text-right text-slate-500">Client</div>
                        <div className="flex-grow h-6 bg-slate-900 rounded relative">
                            <div className="absolute left-0 top-1 h-4 bg-blue-500 rounded" style={{width: '100%'}}></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-24 text-[10px] text-right text-slate-500">API Gateway</div>
                        <div className="flex-grow h-6 bg-slate-900 rounded relative">
                            <div className="absolute left-[10%] top-1 h-4 bg-purple-500 rounded" style={{width: '80%'}}></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-24 text-[10px] text-right text-slate-500">Auth Service</div>
                        <div className="flex-grow h-6 bg-slate-900 rounded relative">
                            <div className="absolute left-[15%] top-1 h-4 bg-green-500 rounded" style={{width: '20%'}}></div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-24 text-[10px] text-right text-slate-500">Database</div>
                        <div className="flex-grow h-6 bg-slate-900 rounded relative">
                            <div className="absolute left-[40%] top-1 h-4 bg-yellow-500 rounded" style={{width: '40%'}}></div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    </div>
);

export default DistributedTracing;