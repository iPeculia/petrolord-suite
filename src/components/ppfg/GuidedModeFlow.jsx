import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, ArrowRight, Globe, AlertTriangle } from 'lucide-react';

const steps = [
  { id: 1, title: 'Select Region', desc: 'Choose geology type to set defaults' },
  { id: 2, title: 'Input Data', desc: 'Upload logs and check data quality' },
  { id: 3, title: 'Risk Assessment', desc: 'Identify potential overpressure zones' },
  { id: 4, title: 'Results', desc: 'View mud weight window' }
];

const GuidedModeFlow = ({ onComplete, setConfig }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [region, setRegion] = useState('delta');

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(c => c + 1);
    else onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-950 p-8">
      <div className="w-full max-w-2xl">
        
        {/* Progress Stepper */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
          {steps.map((s) => (
            <div key={s.id} className={`flex flex-col items-center z-10 bg-slate-950 px-2 ${currentStep >= s.id ? 'text-blue-400' : 'text-slate-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 text-xs font-bold mb-2 transition-colors ${currentStep >= s.id ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900'}`}>
                {currentStep > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
              </div>
              <span className="text-xs font-medium">{s.title}</span>
            </div>
          ))}
        </div>

        <Card className="bg-slate-900 border-slate-800 min-h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-xl text-white">{steps[currentStep-1].title}</CardTitle>
            <CardDescription>{steps[currentStep-1].desc}</CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col items-center justify-center">
            {currentStep === 1 && (
              <RadioGroup value={region} onValueChange={(v) => { setRegion(v); setConfig && setConfig('region', v); }} className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <div className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 cursor-pointer hover:bg-slate-800/50 transition-all ${region==='delta' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700'}`} onClick={()=>setRegion('delta')}>
                  <Globe className="w-8 h-8 text-blue-400 mb-3" />
                  <span className="font-bold text-slate-200">Deltaic Clastics</span>
                  <span className="text-xs text-slate-500 mt-1">Normal compaction dominance</span>
                </div>
                <div className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 cursor-pointer hover:bg-slate-800/50 transition-all ${region==='deepwater' ? 'border-purple-500 bg-purple-500/10' : 'border-slate-700'}`} onClick={()=>setRegion('deepwater')}>
                  <Globe className="w-8 h-8 text-purple-400 mb-3" />
                  <span className="font-bold text-slate-200">Deepwater</span>
                  <span className="text-xs text-slate-500 mt-1">Rapid deposition, disequilibrium</span>
                </div>
                <div className={`flex flex-col items-center justify-center p-6 rounded-lg border-2 cursor-pointer hover:bg-slate-800/50 transition-all ${region==='carbonate' ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700'}`} onClick={()=>setRegion('carbonate')}>
                  <Globe className="w-8 h-8 text-emerald-400 mb-3" />
                  <span className="font-bold text-slate-200">Carbonates</span>
                  <span className="text-xs text-slate-500 mt-1">Chemical compaction focus</span>
                </div>
              </RadioGroup>
            )}

            {currentStep === 2 && (
               <div className="text-center space-y-4">
                  <div className="p-12 border-2 border-dashed border-slate-700 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                     <p className="text-slate-400">Drag & Drop LAS Files Here</p>
                     <Button variant="link" className="text-blue-400">or Browse Computer</Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 p-2 rounded">
                     <CheckCircle2 className="w-4 h-4" /> Auto-detected: Gamma Ray, Sonic, Resistivity
                  </div>
               </div>
            )}

            {currentStep === 3 && (
               <div className="w-full space-y-4">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg flex items-start gap-3">
                     <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                     <div>
                        <h4 className="font-bold text-yellow-400 text-sm">Potential Overpressure Zone Detected</h4>
                        <p className="text-xs text-slate-300 mt-1">Sonic reversal observed at 8,500 ft. Recommended method: Eaton (Sonic) with N=3.0.</p>
                     </div>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg">
                     <h4 className="text-sm font-bold text-white mb-2">Select Calculation Strategy</h4>
                     <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                           <input type="radio" checked readOnly className="accent-blue-500" />
                           <label className="text-sm text-slate-300">Standard (Use Regional Defaults)</label>
                        </div>
                        <div className="flex items-center space-x-2">
                           <input type="radio" className="accent-blue-500" />
                           <label className="text-sm text-slate-300">Conservative (Higher Safety Margin)</label>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {currentStep === 4 && (
               <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Ready to Analyze</h3>
                  <p className="text-slate-400 mb-6">Configuration complete. Click below to generate the full PP-FG model.</p>
                  <Button onClick={handleNext} size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white">
                     Launch Visualization
                  </Button>
               </div>
            )}
          </CardContent>

          {currentStep < 4 && (
            <div className="p-6 border-t border-slate-800 flex justify-between">
               <Button variant="ghost" onClick={()=>setCurrentStep(c => Math.max(1, c-1))} disabled={currentStep===1}>Back</Button>
               <Button onClick={handleNext} className="bg-blue-600 text-white">Next Step <ArrowRight className="w-4 h-4 ml-2"/></Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default GuidedModeFlow;