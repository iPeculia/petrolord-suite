import React, { useEffect, useState } from 'react';
import { useGuidedMode } from '../../../contexts/GuidedModeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Check, Loader2, BarChart, SlidersHorizontal, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { runCalculation } from '../../../services/CalculationService';
import { motion, AnimatePresence } from 'framer-motion';

const CalculationStep = () => {
    const { state, dispatch } = useGuidedMode();
    const { toast } = useToast();
    const [status, setStatus] = useState('idle'); // idle, running, completed, error
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [calculationSummary, setCalculationSummary] = useState(null);
    const [error, setError] = useState(null);

    const handleProgress = ({ percentage, message }) => {
        setProgress(percentage);
        setProgressMessage(message);
    };

    const handleRunCalculation = async () => {
        setStatus('running');
        setError(null);
        setCalculationSummary(null);
        toast({ title: 'Calculation Started', description: 'Running 1D MEM analysis...' });

        try {
            // A more realistic log data structure
            const logDataForCalc = {
                depth: state.logData.data.map(row => row[state.curveMap.DEPTH]),
                curves: Object.keys(state.curveMap)
                    .filter(key => key !== 'DEPTH')
                    .map(key => ({
                        name: state.curveMap[key],
                        values: state.logData.data.map(row => row[state.curveMap[key]])
                    }))
            };

            const inputs = {
                logData: logDataForCalc,
                mechanicalProperties: state.mechanicalProperties,
                pressureData: state.pressureData
            };
            
            const calculationResult = await runCalculation(inputs, handleProgress);
            
            if (calculationResult.success) {
                dispatch({ type: 'SET_RESULTS', payload: calculationResult });
                setCalculationSummary(calculationResult.summary);
                setStatus('completed');
                toast({ title: 'Calculation Complete!', description: '1D MEM analysis finished successfully.' });
                dispatch({ type: 'SET_VALIDATION', payload: { step: 5, isValid: true } });
                dispatch({ type: 'SET_VALIDATION', payload: { step: 6, isValid: true } });
            } else {
                throw new Error(calculationResult.error || "An unknown calculation error occurred.");
            }
        } catch (e) {
            console.error("Calculation failed in component:", e);
            setError(e.message);
            setStatus('error');
            toast({
                variant: "destructive",
                title: 'Calculation Failed',
                description: e.message,
            });
            dispatch({ type: 'SET_VALIDATION', payload: { step: 5, isValid: false } });
            dispatch({ type: 'SET_VALIDATION', payload: { step: 6, isValid: false } });
        }
    };

    useEffect(() => {
        // Set validation to false when first entering the step
        dispatch({ type: 'SET_VALIDATION', payload: { step: 5, isValid: false } });
        dispatch({ type: 'SET_VALIDATION', payload: { step: 6, isValid: false } });
    }, [dispatch]);

    const renderIdleState = () => (
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="text-slate-300">
                <p>All input data and parameters are set.</p>
                <p className="text-sm text-slate-400">Ready to compute the full 1D Mechanical Earth Model.</p>
            </div>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500" onClick={handleRunCalculation}>
                <Play className="mr-2 h-5 w-5" /> Run Full Calculation
            </Button>
        </div>
    );

    const renderRunningState = () => (
        <div className="w-full text-center space-y-4">
            <Loader2 className="h-10 w-10 text-blue-400 animate-spin mx-auto" />
            <p className="text-slate-300 text-lg">{progressMessage}</p>
            <Progress value={progress} className="w-3/4 mx-auto" />
            <p className="text-xs text-slate-500">{progress}% complete</p>
        </div>
    );
    
    const renderErrorState = () => (
        <div className="text-center space-y-4 p-4 bg-red-900/20 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto"/>
            <p className="text-xl font-semibold text-red-300">Calculation Failed</p>
            <p className="text-sm text-red-200">{error}</p>
            <Button variant="outline" onClick={handleRunCalculation}>
                <Play className="mr-2 h-4 w-4" /> Try Again
            </Button>
        </div>
    );

    const renderCompletedState = () => (
        <div className="text-center space-y-4">
            <Check className="h-12 w-12 text-green-400 mx-auto bg-green-500/20 p-2 rounded-full"/>
            <p className="text-xl font-semibold text-green-300">Calculation Successful!</p>
            <Tabs defaultValue="summary" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-3 bg-slate-900">
                    <TabsTrigger value="summary"><BarChart className="w-4 h-4 mr-2"/>Summary</TabsTrigger>
                    <TabsTrigger value="methods"><SlidersHorizontal className="w-4 h-4 mr-2"/>Methods</TabsTrigger>
                    <TabsTrigger value="quality"><ShieldCheck className="w-4 h-4 mr-2"/>Quality</TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="mt-4 text-slate-300 bg-slate-800/50 p-4 rounded-lg text-left">
                    <h3 className="font-semibold text-lg mb-2 text-white">Calculation Summary</h3>
                    {calculationSummary && (
                        <ul className="space-y-1 text-sm">
                            <li><span className="font-medium text-slate-400">Avg. Overburden Gradient:</span> {state.results?.summary?.Sv_gradient.toFixed(2)} psi/ft</li>
                            <li><span className="font-medium text-slate-400">Avg. Pore Pressure Gradient:</span> {state.results?.summary?.Pp_gradient.toFixed(2)} psi/ft</li>
                            <li><span className="font-medium text-slate-400">Avg. Fracture Gradient:</span> {state.results?.summary?.Fg_gradient.toFixed(2)} psi/ft</li>
                        </ul>
                    )}
                </TabsContent>
                <TabsContent value="methods" className="mt-4 text-slate-300 bg-slate-800/50 p-4 rounded-lg text-left">
                    <h3 className="font-semibold text-lg mb-2 text-white">Methods Used</h3>
                    <ul className="space-y-1 text-sm">
                        <li><span className="font-medium text-slate-400">Pore Pressure:</span> {state.pressureData.porePressureMethod}</li>
                        <li><span className="font-medium text-slate-400">Fracture Gradient:</span> {state.pressureData.fractureGradientMethod}</li>
                        <li><span className="font-medium text-slate-400">Stress Regime:</span> {state.mechanicalProperties.stressRegime}</li>
                    </ul>
                </TabsContent>
                <TabsContent value="quality" className="mt-4 text-slate-300 bg-slate-800/50 p-4 rounded-lg text-left">
                    <h3 className="font-semibold text-lg mb-2 text-white">Quality Assessment</h3>
                     {state.results?.qualityReport && (
                        <>
                            <p className="text-sm">Overall Quality Score: <span className="font-bold text-white">{state.results.qualityReport.score}/100</span></p>
                            {state.results.qualityReport.warnings.length > 0 ? (
                                <div className="mt-2 space-y-2">
                                    <h4 className="font-semibold text-amber-400">Warnings:</h4>
                                    <ul className="list-disc list-inside text-sm text-amber-300">
                                        {state.results.qualityReport.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                    </ul>
                                </div>
                            ) : (
                                <p className="text-sm mt-2 text-green-400">No quality issues detected.</p>
                            )}
                        </>
                     )}
                </TabsContent>
            </Tabs>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
        >
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-white">Run Calculation</CardTitle>
                    <CardDescription className="text-slate-400">
                        Execute the 1D MEM analysis and review the quality summary.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 pb-8 min-h-[250px] flex items-center justify-center">
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={status}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                        >
                            {status === 'idle' && renderIdleState()}
                            {status === 'running' && renderRunningState()}
                            {status === 'completed' && renderCompletedState()}
                            {status === 'error' && renderErrorState()}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default CalculationStep;