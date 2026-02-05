import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, Database, Server, Layout, Cpu } from 'lucide-react';

const TechStackVelocity = () => {
  return (
    <div className="p-4 h-full overflow-y-auto bg-slate-950 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Technology Stack</h2>
        <p className="text-slate-400">Architecture and libraries powering the Velocity Model Builder.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-400">
                    <Layout className="w-4 h-4"/> Frontend Core
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">React 18.2</Badge>
                    <Badge variant="secondary">Vite</Badge>
                    <Badge variant="secondary">TailwindCSS 3.3</Badge>
                    <Badge variant="secondary">Framer Motion</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    Responsive SPA architecture using React router for navigation and Framer Motion for smooth transitions.
                </p>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-emerald-400">
                    <Database className="w-4 h-4"/> Backend & Data
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Supabase</Badge>
                    <Badge variant="secondary">PostgreSQL</Badge>
                    <Badge variant="secondary">Edge Functions</Badge>
                    <Badge variant="secondary">Row Level Security</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    Serverless backend handles auth, persistence, and heavy computational tasks via Edge Functions.
                </p>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-400">
                    <Cpu className="w-4 h-4"/> Visualization & Math
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Recharts</Badge>
                    <Badge variant="secondary">Plotly.js</Badge>
                    <Badge variant="secondary">Proj4</Badge>
                    <Badge variant="secondary">Simple-Statistics</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    Advanced plotting for TD curves and crossplots. Proj4 handles coordinate transformations.
                </p>
            </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-400">
                    <Server className="w-4 h-4"/> Enterprise Features
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Web Workers</Badge>
                    <Badge variant="secondary">Service Workers</Badge>
                    <Badge variant="secondary">IndexedDB</Badge>
                    <Badge variant="secondary">WebSocket</Badge>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                    Off-main-thread processing for grid operations and real-time collaboration features.
                </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechStackVelocity;