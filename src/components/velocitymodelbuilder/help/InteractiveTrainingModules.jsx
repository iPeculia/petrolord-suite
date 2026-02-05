import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Award, BookOpen, CheckCircle } from 'lucide-react';

const InteractiveTrainingModules = () => {
  const modules = [
    { title: "Velocity Basics 101", desc: "Understanding Time, Depth, and Velocity relationships.", progress: 100, status: "completed" },
    { title: "Building a V0+kZ Model", desc: "Step-by-step guide to linear gradient modeling.", progress: 45, status: "in-progress" },
    { title: "Anisotropy Masterclass", desc: "Handling Thomsen parameters and well misties.", progress: 0, status: "locked" },
    { title: "Geostatistical QC", desc: "Using variograms to validate velocity grids.", progress: 0, status: "locked" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-xl font-bold text-white flex items-center gap-2">
        <Award className="w-5 h-5 text-yellow-400" /> Interactive Training & Certification
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod, i) => (
            <Card key={i} className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <CardTitle className="text-base text-white">{mod.title}</CardTitle>
                        {mod.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-slate-400 mb-4">{mod.desc}</p>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Progress</span>
                            <span>{mod.progress}%</span>
                        </div>
                        <Progress value={mod.progress} className="h-2 bg-slate-800" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        size="sm" 
                        variant={mod.status === 'locked' ? 'outline' : 'default'} 
                        disabled={mod.status === 'locked'}
                        className={`w-full ${mod.status === 'locked' ? 'border-slate-700 text-slate-500' : 'bg-blue-600 hover:bg-blue-500'}`}
                    >
                        {mod.status === 'completed' ? 'Review Module' : mod.status === 'locked' ? 'Locked' : 'Continue'}
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
};

export default InteractiveTrainingModules;