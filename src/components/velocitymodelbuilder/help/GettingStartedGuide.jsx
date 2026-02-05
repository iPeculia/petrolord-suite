import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, ArrowRight, Layers, Database, CheckCircle2 } from 'lucide-react';

const GettingStartedGuide = () => {
  const steps = [
    { 
      title: "1. Project Setup", 
      desc: "Define your project CRS, units, and extent. Load your well headers and basic metadata.",
      icon: Database,
      color: "text-blue-400"
    },
    { 
      title: "2. Data Ingestion", 
      desc: "Import checkshots, sonic logs, and markers. The system auto-detects formats like LAS and CSV.",
      icon: Layers,
      color: "text-purple-400"
    },
    { 
      title: "3. Build Model", 
      desc: "Define velocity layers (e.g., V0 + kZ) and calibrate against well data using the interactive tools.",
      icon: Rocket,
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-bold text-white">Welcome to Velocity Model Builder</h2>
        <p className="text-slate-400">Your journey to accurate depth conversion starts here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1 duration-300">
                <CardHeader className="pb-2">
                    <div className={`w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center mb-3 ${step.color}`}>
                        <step.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg text-slate-200">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-400 mb-4">{step.desc}</p>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-blue-400 hover:text-blue-300 text-xs hover:bg-transparent">
                        Read detailed guide <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                </CardContent>
            </Card>
        ))}
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Quick Start Checklist
                </h3>
                <p className="text-sm text-slate-400">Ready to create your first model? Follow our interactive tutorial.</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-500">
                Launch Interactive Tour
            </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GettingStartedGuide;