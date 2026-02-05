import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Link, Database, Shield, RefreshCw, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IntegrationDashboard = () => {
  const navigate = useNavigate();

  const apps = [
    { id: 'log_facies', name: 'Log Facies Analysis', status: 'connected', sync: '2 mins ago', volume: '1.2 GB', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'ppfg', name: 'PPFG Analyzer', status: 'connected', sync: '5 mins ago', volume: '850 MB', color: 'text-red-400', bg: 'bg-red-500/10' },
    { id: 'npv', name: 'NPV Scenario Builder', status: 'syncing', sync: 'Now', volume: '45 MB', color: 'text-green-400', bg: 'bg-green-500/10' },
    { id: 'fdp', name: 'FDP Accelerator', status: 'error', sync: '2 days ago', volume: '2.1 GB', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="h-full p-6 bg-slate-950 overflow-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Integration Hub</h1>
          <p className="text-slate-400 mt-1">Manage ecosystem connections and data flow.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300" onClick={() => navigate('/dashboard/geoscience/earth-model-pro/orchestrator')}>
            <Activity className="w-4 h-4 mr-2" /> Orchestrator
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-500">
            <RefreshCw className="w-4 h-4 mr-2" /> Sync All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Total Data Flow</p>
              <h3 className="text-2xl font-bold text-white mt-1">4.2 TB</h3>
              <p className="text-emerald-400 text-xs flex items-center mt-1"><ArrowUpRight className="w-3 h-3 mr-1" /> +12% this week</p>
            </div>
            <div className="p-3 rounded-full bg-slate-800 text-slate-400"><Database className="w-6 h-6" /></div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Active Links</p>
              <h3 className="text-2xl font-bold text-white mt-1">8/12</h3>
              <p className="text-slate-400 text-xs mt-1">Apps Connected</p>
            </div>
            <div className="p-3 rounded-full bg-slate-800 text-slate-400"><Link className="w-6 h-6" /></div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">API Health</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">99.9%</h3>
              <p className="text-slate-400 text-xs mt-1">Uptime</p>
            </div>
            <div className="p-3 rounded-full bg-slate-800 text-slate-400"><Activity className="w-6 h-6" /></div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Security</p>
              <h3 className="text-2xl font-bold text-white mt-1">Encrypted</h3>
              <p className="text-slate-400 text-xs mt-1">End-to-End</p>
            </div>
            <div className="p-3 rounded-full bg-slate-800 text-slate-400"><Shield className="w-6 h-6" /></div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold text-white mb-4">Connected Applications</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {apps.map((app) => (
          <Card key={app.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${app.bg} ${app.color}`}>
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{app.name}</h3>
                    <p className="text-sm text-slate-500">ID: {app.id}</p>
                  </div>
                </div>
                {app.status === 'connected' && <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Connected</Badge>}
                {app.status === 'syncing' && <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse">Syncing</Badge>}
                {app.status === 'error' && <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Error</Badge>}
              </div>
              
              <div className="flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-800">
                <span>Last Sync: {app.sync}</span>
                <span>Data Volume: {app.volume}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800">View Logs</Button>
                <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800">Configure</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationDashboard;