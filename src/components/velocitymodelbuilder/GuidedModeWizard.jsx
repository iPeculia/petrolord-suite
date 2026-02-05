import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowRight, CheckCircle2, HelpCircle, Wand2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const WIZARD_STEPS = {
    'convert_horizon': [
        { id: 1, title: 'Select Time Horizon', desc: 'Choose the grid file containing TWT interpretation.' },
        { id: 2, title: 'Choose Velocity Model', desc: 'Select an existing velocity model or create a quick gradient.' },
        { id: 3, title: 'QC & Validate', desc: 'Check generated depth map against well tops.' },
        { id: 4, title: 'Export', desc: 'Save the resulting Depth Grid.' }
    ],
    'build_td': [
        { id: 1, title: 'Load Well Data', desc: 'Import Checkshots and optional Sonic/Density logs.' },
        { id: 2, title: 'QC Checkshots', desc: 'Identify and remove outliers or bad picks.' },
        { id: 3, title: 'Fit Model', desc: 'Auto-fit a V0+kZ or polynomial function to the points.' },
        { id: 4, title: 'Export Curve', desc: 'Save as T-D relationship for the well.' }
    ]
};

const GuidedModeWizard = () => {
  const [activeTask, setActiveTask] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const startTask = (task) => {
    setActiveTask(task);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS[activeTask].length) {
        setCurrentStep(c => c + 1);
    } else {
        // Finish
        setActiveTask(null);
        setCurrentStep(0);
    }
  };

  if (!activeTask) {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Wand2 className="w-6 h-6 text-purple-500" /> What would you like to do?
            </h2>
            <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" className="h-auto p-4 justify-start border-slate-700 hover:bg-slate-800 hover:border-purple-500 group" onClick={() => startTask('convert_horizon')}>
                    <div className="text-left">
                        <div className="font-bold text-white group-hover:text-purple-400">Convert Horizon to Depth</div>
                        <div className="text-xs text-slate-400 font-normal">Transform a Seismic Time Map using a velocity model.</div>
                    </div>
                    <ArrowRight className="ml-auto w-5 h-5 text-slate-600 group-hover:text-purple-500" />
                </Button>

                <Button variant="outline" className="h-auto p-4 justify-start border-slate-700 hover:bg-slate-800 hover:border-blue-500 group" onClick={() => startTask('build_td')}>
                    <div className="text-left">
                        <div className="font-bold text-white group-hover:text-blue-400">Build Well TD Curve</div>
                        <div className="text-xs text-slate-400 font-normal">Create a Time-Depth relationship from Checkshots.</div>
                    </div>
                    <ArrowRight className="ml-auto w-5 h-5 text-slate-600 group-hover:text-blue-500" />
                </Button>
            </div>
        </Card>
    );
  }

  const steps = WIZARD_STEPS[activeTask];
  const progress = (currentStep / steps.length) * 100;
  const currentStepData = steps[currentStep - 1];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
        <div className="p-6 border-b border-slate-800">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white text-lg">{activeTask === 'convert_horizon' ? 'Horizon Conversion Wizard' : 'TD Curve Wizard'}</h3>
                <span className="text-xs text-slate-500">Step {currentStep} of {steps.length}</span>
            </div>
            <Progress value={progress} className="h-2 bg-slate-800" indicatorClassName="bg-purple-500" />
        </div>
        
        <CardContent className="flex-1 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6 border border-slate-700">
                <span className="text-2xl font-bold text-purple-500">{currentStep}</span>
            </div>
            <h4 className="text-2xl font-bold text-white mb-2">{currentStepData.title}</h4>
            <p className="text-slate-400 max-w-md">{currentStepData.desc}</p>
            
            {/* Placeholder for Step Content */}
            <div className="mt-8 p-6 bg-slate-950/50 border border-slate-800 border-dashed rounded-lg w-full max-w-lg flex items-center justify-center text-slate-600 text-sm">
                [ Interactive Tools for "{currentStepData.title}" would load here ]
            </div>
        </CardContent>

        <CardFooter className="p-6 border-t border-slate-800 flex justify-between">
            <Button variant="ghost" onClick={() => setActiveTask(null)} className="text-slate-400">Cancel</Button>
            <Button onClick={nextStep} className="bg-purple-600 hover:bg-purple-500 text-white">
                {currentStep === steps.length ? 'Finish' : 'Next Step'} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
        </CardFooter>
    </Card>
  );
};

export default GuidedModeWizard;