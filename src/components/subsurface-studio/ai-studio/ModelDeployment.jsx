import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, Globe } from 'lucide-react';

const ModelDeployment = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Rocket className="w-5 h-5 mr-2 text-blue-400" /> Serving Endpoints
        </h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-0 divide-y divide-slate-800">
                {[
                    { name: 'seismic-inference-prod', url: 'https://api.ems.ai/v1/seismic', rps: 450 },
                    { name: 'well-log-classifier-prod', url: 'https://api.ems.ai/v1/logs', rps: 120 },
                    { name: 'nlp-doc-search-dev', url: 'https://dev-api.ems.ai/v1/nlp', rps: 5 },
                ].map((ep, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-900/50">
                        <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-slate-500" />
                            <div>
                                <div className="text-sm font-bold text-slate-200">{ep.name}</div>
                                <div className="text-xs font-mono text-slate-500">{ep.url}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-bold text-green-400">Healthy</div>
                            <div className="text-[10px] text-slate-500">{ep.rps} RPS</div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
);

export default ModelDeployment;