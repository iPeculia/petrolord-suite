import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mlService } from '@/services/ml/mlService';
import { 
  BrainCircuit, 
  Activity, 
  Zap, 
  Database, 
  Server, 
  AlertTriangle, 
  CheckCircle2,
  PlayCircle
} from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, trend, color = "text-blue-400" }) => (
  <Card className="bg-slate-900 border-slate-800">
    <CardContent className="p-6 flex items-center justify-between">
      <div>
        <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        {trend && <p className={`text-xs mt-1 ${trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{trend} vs last month</p>}
      </div>
      <div className={`p-3 rounded-full bg-slate-800 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </CardContent>
  </Card>
);

const ModelRow = ({ model }) => (
  <div className="flex items-center justify-between p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors last:border-0">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-slate-800 rounded text-indigo-400">
        <BrainCircuit className="w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-white">{model.name}</h4>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>ID: {model.id}</span>
          <span>•</span>
          <span>{model.type}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-xs text-slate-400">Accuracy</p>
        <p className="text-sm font-mono text-emerald-400">{(model.accuracy * 100).toFixed(1)}%</p>
      </div>
      <Badge variant={model.status === 'ready' ? 'default' : 'secondary'} className={model.status === 'ready' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'}>
        {model.status}
      </Badge>
      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
        <PlayCircle className="w-4 h-4" />
      </Button>
    </div>
  </div>
);

const MLHub = () => {
  const [models, setModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      const data = await mlService.listModels();
      setModels(data);
      setIsLoading(false);
    };
    fetchModels();
  }, []);

  return (
    <div className="h-full p-6 bg-slate-950 overflow-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-purple-500" />
          Machine Learning Hub
        </h1>
        <p className="text-slate-400 mt-2">Monitor model performance, manage training jobs, and deploy inference pipelines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Active Models" value={models.length} icon={Database} trend="+2" color="text-purple-400" />
        <MetricCard title="Predictions (24h)" value="14.2k" icon={Activity} trend="+12%" color="text-blue-400" />
        <MetricCard title="Avg Accuracy" value="91.4%" icon={CheckCircle2} trend="+0.8%" color="text-emerald-400" />
        <MetricCard title="GPU Usage" value="45%" icon={Zap} color="text-yellow-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2 flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Model Registry</CardTitle>
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">New Model</Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full">
              {isLoading ? (
                <div className="p-8 text-center text-slate-500">Loading models...</div>
              ) : (
                models.map(model => <ModelRow key={model.id} model={model} />)
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-base">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Training Queue</span>
                  <span className="text-white">2 jobs</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-1/3 animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Inference API</span>
                  <span className="text-emerald-400">Operational</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-400">Storage</span>
                  <span className="text-white">85%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[85%]"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-base">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-3 items-start">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-200">High latency in Facies Model v1</p>
                    <p className="text-xs text-slate-500">10 minutes ago</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <Server className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-200">Training job completed</p>
                    <p className="text-xs text-slate-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MLHub;