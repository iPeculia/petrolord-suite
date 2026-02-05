import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

const steps = [
  { id: 1, title: "Select Location", desc: "Choose well and offset data" },
  { id: 2, title: "Data Check", desc: "Confirm log availability" },
  { id: 3, title: "Basin Model", desc: "Apply regional template" },
  { id: 4, title: "Run Workflow", desc: "Execute engine" }
];

const GuidedModeWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNext = () => {
    if (step < 4) {
      setStep(s => s + 1);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onComplete();
      }, 1500);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-slate-950 p-8">
      <div className="w-full max-w-3xl">
        {/* Stepper */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10" />
          {steps.map((s) => (
            <div key={s.id} className={`flex flex-col items-center bg-slate-950 px-2 ${step >= s.id ? 'text-emerald-400' : 'text-slate-600'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 font-bold ${step >= s.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900'}`}>
                {step > s.id ? <CheckCircle2 className="w-6 h-6" /> : s.id}
              </div>
              <span className="text-xs font-medium">{s.title}</span>
            </div>
          ))}
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl text-slate-100">{steps[step-1].title}</CardTitle>
            <CardDescription className="text-slate-400">{steps[step-1].desc}</CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] flex flex-col">
            
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Target Well</label>
                  <Select defaultValue="demo">
                    <SelectTrigger className="bg-slate-950 border-slate-700 text-slate-200"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
                      <SelectItem value="demo">Demo Well 01</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-2">
                {['Gamma Ray', 'Resistivity (Deep)', 'Sonic (DT)', 'Density (RHOB)'].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-300">{log}</span>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Available
                    </span>
                  </div>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-2 gap-4">
                <button className="p-6 rounded border-2 border-slate-700 hover:border-emerald-500 bg-slate-950 text-left transition-colors">
                  <div className="font-bold text-slate-200 mb-1">Clastic (Standard)</div>
                  <p className="text-xs text-slate-500">Normal compaction trend. Eaton method.</p>
                </button>
                <button className="p-6 rounded border-2 border-slate-700 hover:border-emerald-500 bg-slate-950 text-left transition-colors">
                  <div className="font-bold text-slate-200 mb-1">Deepwater</div>
                  <p className="text-xs text-slate-500">Disequilibrium compaction. Bowers unloading.</p>
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col items-center justify-center flex-1">
                {isProcessing ? (
                  <div className="text-center">
                    <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4 mx-auto" />
                    <p className="text-slate-300">Calculating Overburden...</p>
                    <p className="text-slate-500 text-sm">Fitting Trends...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-slate-300 mb-4">Ready to process 15,000 ft of data.</p>
                    <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8">
                      Start Calculation
                    </Button>
                  </div>
                )}
              </div>
            )}

            {step < 4 && (
              <div className="mt-auto pt-6 flex justify-end">
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Next Step <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GuidedModeWizard;