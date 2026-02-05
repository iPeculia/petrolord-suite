import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, FileText, Globe, Droplet, Flame, Layers, Users } from 'lucide-react';

const templates = [
    { title: "Onshore Oil Field", type: "Model", icon: Droplet, description: "Standard template for onshore development with royalty/tax regime." },
    { title: "Offshore Gas", type: "Model", icon: Flame, description: "Deepwater gas project with complex CAPEX schedule and PSC terms." },
    { title: "Unconventional Tight Oil", type: "Model", icon: Layers, description: "Multi-well pad drilling model with rapid decline curves." },
    { title: "Standard PSC", type: "Fiscal", icon: FileText, description: "Generic Production Sharing Contract with cost recovery and profit oil split." },
    { title: "Concession / Royalty", type: "Fiscal", icon: FileText, description: "Simple royalty and tax regime template." },
    { title: "JV Structure", type: "Fiscal", icon: Users, description: "Joint Venture waterfall with partner carry options." },
];

const TemplatesLibrary = () => {
  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100">
      <Helmet>
        <title>Templates Library - Petroleum Economics Studio</title>
      </Helmet>

      <div className="flex items-center gap-4 mb-8">
        <Link to="/dashboard/apps/petroleum-economics-studio/projects">
            <Button variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800 text-slate-300">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
            </Button>
        </Link>
        <div>
            <h1 className="text-2xl font-bold text-white">Templates Library</h1>
            <p className="text-slate-400 text-sm">Jumpstart your analysis with industry standard templates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, idx) => (
            <Card key={idx} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <template.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400">{template.type}</span>
                    </div>
                    <CardTitle className="text-lg text-white">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Button variant="secondary" className="w-full bg-slate-800 hover:bg-slate-700 text-white">Use Template</Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
};

export default TemplatesLibrary;