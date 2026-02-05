import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, GitBranch, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const DeploymentOrchestration = () => (
    <div className="h-full p-1 space-y-6">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Rocket className="w-5 h-5 mr-2 text-purple-400" /> Deployment Pipeline
        </h3>
        
        <Card className="bg-slate-950 border-slate-800 p-6">
            <div className="flex items-center justify-between mb-8">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-900/20 border border-green-500 text-green-500 flex items-center justify-center mb-2 mx-auto">
                        <GitBranch className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-white">Build</div>
                    <div className="text-[10px] text-slate-500">v2.4.0-rc1</div>
                </div>
                <div className="h-1 flex-grow bg-green-900 mx-4 rounded relative">
                     <div className="absolute inset-0 bg-green-500 rounded" style={{width: '100%'}}></div>
                </div>
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-900/20 border border-green-500 text-green-500 flex items-center justify-center mb-2 mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-white">Test</div>
                    <div className="text-[10px] text-slate-500">Passed (412/412)</div>
                </div>
                <div className="h-1 flex-grow bg-slate-800 mx-4 rounded relative overflow-hidden">
                     <div className="absolute inset-0 bg-blue-500 rounded animate-pulse" style={{width: '60%'}}></div>
                </div>
                <div className="text-center opacity-50">
                    <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 text-slate-500 flex items-center justify-center mb-2 mx-auto">
                        <Rocket className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-bold text-white">Deploy</div>
                    <div className="text-[10px] text-slate-500">Pending Approval</div>
                </div>
            </div>
            
            <div className="bg-slate-900 rounded p-4 border border-slate-800">
                <div className="text-xs font-mono text-slate-400 mb-2">$ deployment logs -f</div>
                <div className="space-y-1 font-mono text-[10px] text-slate-300">
                    <div>[10:42:15] Starting build process for commit a7b2c9...</div>
                    <div>[10:42:18] Running lint checks... OK</div>
                    <div>[10:42:45] Running unit tests... OK</div>
                    <div>[10:43:12] Building Docker image registry.petrolord.com/studio:v2.4.0...</div>
                    <div className="text-blue-400">[10:44:00] Pushing to staging environment...</div>
                </div>
            </div>
        </Card>
    </div>
);

export default DeploymentOrchestration;