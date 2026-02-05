import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { useReservoirCalc } from '../contexts/ReservoirCalcContext';
import { VolumeCalculationEngine } from '../services/VolumeCalculationEngine';

// Steps
import Step1 from './guided/Step1_MethodSelection';
// Simplified inline for brevity where possible, but user asked for files.
// I will create the files to respect the prompt structure.

const Step2_InputMethodSelection = ({ data, updateData }) => (
    <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold text-white">Input Method</h3>
        <p className="text-slate-400">How will you provide the data?</p>
        <div className="grid grid-cols-2 gap-4">
            <Button variant={data.inputMethod === 'manual' ? 'default' : 'outline'} onClick={() => updateData({ inputMethod: 'manual' })} className="h-24 flex-col gap-2">
                <span>Manual Entry</span> <span className="text-xs font-normal text-slate-400">Type values directly</span>
            </Button>
            <Button variant={data.inputMethod === 'import' ? 'default' : 'outline'} onClick={() => updateData({ inputMethod: 'import' })} className="h-24 flex-col gap-2">
                <span>Import File</span> <span className="text-xs font-normal text-slate-400">CSV / Excel Upload</span>
            </Button>
        </div>
    </div>
);

const Step3_UnitSelection = ({ data, updateData }) => (
    <div className="space-y-6 text-center">
        <h3 className="text-xl font-bold text-white">Unit System</h3>
        <div className="flex justify-center gap-4">
            <Button variant={data.unitSystem === 'field' ? 'default' : 'outline'} onClick={() => updateData({ unitSystem: 'field' })}>Field (Acres, ft, bbl)</Button>
            <Button variant={data.unitSystem === 'metric' ? 'default' : 'outline'} onClick={() => updateData({ unitSystem: 'metric' })}>Metric (km², m, m³)</Button>
        </div>
    </div>
);

const Step4_DataEntry = ({ data, updateData }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Reservoir Geometry</h3>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm text-slate-400">Area ({data.unitSystem === 'field' ? 'Acres' : 'km²'})</label>
                <input type="number" className="w-full p-2 bg-slate-900 border border-slate-700 rounded" value={data.area} onChange={e => updateData({ area: parseFloat(e.target.value) })} />
            </div>
            <div>
                <label className="text-sm text-slate-400">Net Thickness ({data.unitSystem === 'field' ? 'ft' : 'm'})</label>
                <input type="number" className="w-full p-2 bg-slate-900 border border-slate-700 rounded" value={data.thickness} onChange={e => updateData({ thickness: parseFloat(e.target.value) })} />
            </div>
        </div>
    </div>
);

const Step5_ParameterConfig = ({ data, updateData }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Petrophysics & Fluids</h3>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-sm text-slate-400">Porosity (dec)</label>
                <input type="number" className="w-full p-2 bg-slate-900 border border-slate-700 rounded" value={data.porosity} onChange={e => updateData({ porosity: parseFloat(e.target.value) })} />
            </div>
            <div>
                <label className="text-sm text-slate-400">Water Saturation (dec)</label>
                <input type="number" className="w-full p-2 bg-slate-900 border border-slate-700 rounded" value={data.sw} onChange={e => updateData({ sw: parseFloat(e.target.value) })} />
            </div>
            <div>
                <label className="text-sm text-slate-400">Formation Vol Factor</label>
                <input type="number" className="w-full p-2 bg-slate-900 border border-slate-700 rounded" value={data.fvf} onChange={e => updateData({ fvf: parseFloat(e.target.value) })} />
            </div>
            <div>
                <label className="text-sm text-slate-400">Recovery Factor</label>
                <input type="number" className="w-full p-2 bg-slate-900 border border-slate-700 rounded" value={data.recovery} onChange={e => updateData({ recovery: parseFloat(e.target.value) })} />
            </div>
        </div>
    </div>
);

const GuidedModeWizard = () => {
    const { setMode, setResults } = useReservoirCalc();
    const [step, setStep] = useState(1);
    const [wizardData, setWizardData] = useState({
        method: 'deterministic',
        inputMethod: 'manual',
        unitSystem: 'field',
        area: 1000,
        thickness: 50,
        porosity: 0.2,
        sw: 0.3,
        fvf: 1.2,
        recovery: 0.35,
        ntg: 1
    });

    const updateData = (updates) => setWizardData(prev => ({ ...prev, ...updates }));

    const handleNext = () => {
        if (step === 5) {
            // Calculate
            const res = VolumeCalculationEngine.calculateDeterministic(wizardData, wizardData.unitSystem);
            setResults(res);
            setStep(6); // Results step
        } else {
            setStep(s => s + 1);
        }
    };

    const handleBack = () => setStep(s => s - 1);

    const renderStep = () => {
        switch(step) {
            case 1: return <Step1 data={wizardData} updateData={updateData} />;
            case 2: return <Step2_InputMethodSelection data={wizardData} updateData={updateData} />;
            case 3: return <Step3_UnitSelection data={wizardData} updateData={updateData} />;
            case 4: return <Step4_DataEntry data={wizardData} updateData={updateData} />;
            case 5: return <Step5_ParameterConfig data={wizardData} updateData={updateData} />;
            case 6: return (
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                        <Play className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Calculation Complete!</h3>
                    <p className="text-slate-400">Your volumetric results are ready.</p>
                    <Button onClick={() => setMode('expert')} className="bg-emerald-600 hover:bg-emerald-700">
                        View Detailed Results in Expert Mode
                    </Button>
                </div>
            );
            default: return null;
        }
    };

    return (
        <div className="flex items-center justify-center h-full p-8 bg-slate-950">
            <Card className="w-full max-w-2xl bg-slate-900 border-slate-800 shadow-2xl">
                <CardHeader>
                    <div className="flex justify-between items-center mb-2">
                        <CardTitle className="text-white">Guided Workflow</CardTitle>
                        <span className="text-sm text-slate-500">Step {step} of 5</span>
                    </div>
                    <Progress value={(step / 6) * 100} className="h-2 bg-slate-800" indicatorClassName="bg-emerald-500" />
                </CardHeader>
                <CardContent className="py-8 min-h-[300px]">
                    {renderStep()}
                </CardContent>
                <CardFooter className="flex justify-between border-t border-slate-800 pt-6">
                    <Button variant="ghost" onClick={handleBack} disabled={step === 1} className="text-slate-400 hover:text-white">
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    {step < 6 && (
                        <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                            {step === 5 ? 'Calculate' : 'Next'} <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
};

export default GuidedModeWizard;