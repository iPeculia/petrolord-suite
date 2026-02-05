import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Check, ArrowRight, ArrowLeft, Database, 
  Activity, Layers, Save, FileOutput 
} from 'lucide-react';

const steps = [
  { id: 1, title: "Select Well", icon: Database },
  { id: 2, title: "Log Prep", icon: Layers },
  { id: 3, title: "Wavelet", icon: Activity },
  { id: 4, title: "Review & Export", icon: FileOutput },
];

const QuickTieWorkflow = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  const handleNext = () => {
    if (currentStep < steps.length) {
      if (currentStep === 3) {
        setProcessing(true);
        // Simulate auto-tie calculation
        setTimeout(() => {
          setProcessing(false);
          setCurrentStep(prev => prev + 1);
        }, 2000);
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } else {
      onComplete();
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 max-w-4xl mx-auto">
      {/* Stepper Header */}
      <div className="w-full mb-12">
        <div className="flex justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -z-10" />
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-slate-950 px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                step.id === currentStep ? 'border-blue-500 bg-blue-950 text-blue-400' :
                step.id < currentStep ? 'border-emerald-500 bg-emerald-950 text-emerald-400' :
                'border-slate-700 bg-slate-900 text-slate-500'
              }`}>
                {step.id < currentStep ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
              </div>
              <span className={`text-xs font-medium ${
                step.id === currentStep ? 'text-blue-400' : 'text-slate-500'
              }`}>{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Card */}
      <Card className="w-full bg-slate-900 border-slate-800 min-h-[400px] flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl text-white">
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center text-center">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="w-full max-w-lg"
            >
              {currentStep === 1 && (
                <div className="space-y-4">
                  <p className="text-slate-400">Select a well from the database to begin the tie process.</p>
                  <div className="bg-slate-950 p-4 rounded border border-slate-800 text-left cursor-pointer hover:border-blue-500 transition-colors">
                    <div className="font-medium text-white">15/9-F-12</div>
                    <div className="text-xs text-slate-500">North Sea Volve • Total Depth: 3200m</div>
                  </div>
                  <div className="bg-slate-950 p-4 rounded border border-slate-800 text-left opacity-50">
                    <div className="font-medium text-white">15/9-F-14</div>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-4">
                  <p className="text-slate-400">Reviewing log availability and quality.</p>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-300">Gamma Ray (GR)</span>
                      <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Present</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-300">Density (RHOB)</span>
                      <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Present</span>
                    </div>
                    <div className="flex justify-between p-3 bg-slate-950 rounded border border-slate-800">
                      <span className="text-slate-300">Sonic (DT)</span>
                      <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3 h-3" /> Present</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  {processing ? (
                    <div className="flex flex-col items-center gap-4">
                       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                       <span className="text-slate-300">Extracting statistical wavelet and calculating synthetic...</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-slate-400">Choose wavelet extraction method.</p>
                      <div className="grid grid-cols-2 gap-4">
                         <Button variant="outline" className="h-24 flex flex-col gap-2 border-blue-500 bg-blue-900/20 text-blue-300">
                            <Activity className="w-8 h-8" />
                            Statistical
                         </Button>
                         <Button variant="outline" className="h-24 flex flex-col gap-2 border-slate-800 hover:border-slate-700 text-slate-400">
                            <Database className="w-8 h-8" />
                            From Library
                         </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-emerald-950/30 border border-emerald-900 p-6 rounded-lg">
                    <Check className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-1">Auto-Tie Successful</h3>
                    <p className="text-emerald-400">Correlation: 0.82 (Excellent)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-left">
                     <div className="p-3 bg-slate-950 rounded">
                        <div className="text-xs text-slate-500">Time Shift</div>
                        <div className="text-white font-mono">-4ms</div>
                     </div>
                     <div className="p-3 bg-slate-950 rounded">
                        <div className="text-xs text-slate-500">Phase Rotation</div>
                        <div className="text-white font-mono">+12°</div>
                     </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        
        <div className="p-6 border-t border-slate-800 flex justify-between">
          <Button variant="ghost" onClick={currentStep === 1 ? onCancel : () => setCurrentStep(p => p - 1)} className="text-slate-400 hover:text-white">
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>
          <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 w-32">
             {currentStep === 4 ? 'Finish' : 'Next'} {currentStep !== 4 && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default QuickTieWorkflow;