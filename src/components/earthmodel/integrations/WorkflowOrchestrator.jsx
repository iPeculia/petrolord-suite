import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlayCircle, Clock, CheckCircle2, AlertTriangle, BarChart2, FileText } from 'lucide-react';
import WorkflowBuilder from './WorkflowBuilder';

const ExecutionLog = () => (
  <ScrollArea className="h-[400px] w-full rounded-md border border-slate-800 bg-slate-950 p-4">
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3 text-sm">
          <span className="text-slate-500 font-mono text-xs w-20">10:42:{10 + i}</span>
          <div className="flex-1">
            <p className="text-slate-300">Executing step: Data Transformation {i}</p>
            {i === 3 && <p className="text-yellow-500 text-xs mt-1">Warning: Minor data inconsistency detected in well W-02</p>}
          </div>
          {i < 5 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          )}
        </div>
      ))}
    </div>
  </ScrollArea>
);

const WorkflowOrchestrator = () => {
  const [activeTab, setActiveTab] = useState('builder');

  return (
    <div className="h-full flex flex-col bg-slate-950 overflow-hidden">
      <div className="p-6 pb-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Workflow Orchestrator</h1>
            <p className="text-slate-400">Design, execute, and monitor cross-application workflows.</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
              Engine: Active
            </Badge>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
              3 Workflows Running
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
            <TabsTrigger value="monitor">Monitor & Logs</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex-1 overflow-hidden mt-4">
        {activeTab === 'builder' && <WorkflowBuilder />}
        
        {activeTab === 'monitor' && (
          <div className="p-6 h-full overflow-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Live Execution Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExecutionLog />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-base">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Avg. Execution Time</span>
                    <span className="text-white font-mono">4.2s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Success Rate</span>
                    <span className="text-emerald-400 font-mono">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-sm">Data Throughput</span>
                    <span className="text-blue-400 font-mono">125 MB/s</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-base">Active Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-green-500" /> Log Facies Agent
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-green-500" /> NPV Calculator Agent
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" /> PPFG Sync Agent (Busy)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-6 h-full overflow-auto">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Execution History</CardTitle>
                <CardDescription>Past 30 days of automated workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700 cursor-pointer group">
                      <div className="flex items-center gap-4">
                        {i % 4 === 0 ? (
                          <AlertTriangle className="w-5 h-5 text-yellow-500" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-white">Workflow_Update_Reservoir_{100-i}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-2">
                            <Clock className="w-3 h-3" /> {i * 2} hours ago • Duration: {15 + i}s
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowOrchestrator;