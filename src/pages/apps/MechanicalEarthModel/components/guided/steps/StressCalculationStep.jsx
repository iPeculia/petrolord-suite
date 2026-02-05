import React, { useEffect, useState } from 'react';
import { useGuidedMode } from '../../../contexts/GuidedModeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Check, Loader2, BarChart, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const StressCalculationStep = () => {
    const { state, dispatch } = useGuidedMode();
    const { toast } = useToast();
    const [status, setStatus] = useState('idle'); // idle, running, completed
    const [progress, setProgress] = useState(0);

    const handleRunCalculation = () => {
        setStatus('running');
        toast({ title: 'Calculation Started', description: 'Stresses are being calculated.' });

        // Simulate calculation progress
        const interval = setInterval(() => {
            setProgress(prev => {
                const newValue = prev + Math.floor(Math.random() * 10) + 5;
                if (newValue >= 100) {
                    clearInterval(interval);
                    setStatus('completed');
                    
                    // Dummy results for now
                    const dummyResults = { success: true, message: "Stress calculation finished." };
                    dispatch({ type: 'SET_RESULTS', payload: {...state.results, stresses: dummyResults} }); 
                    
                    toast({ title: 'Calculation Complete!', description: 'Stress profiles have been generated.' });
                    dispatch({ type: 'SET_VALIDATION', payload: { step: 5, isValid: true } });
                    return 100;
                }
                return newValue;
            });
        }, 400);
    };

    useEffect(() => {
        // Automatically set validation to false when entering the step
        // It will be set to true upon successful calculation
        dispatch({ type: 'SET_VALIDATION', payload: { step: 5, isValid: false } });
    }, [dispatch]);
    

    return (
        <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-white">Stress Calculation</CardTitle>
                    <CardDescription className="text-slate-400">
                        Calculate vertical and horizontal stresses based on your input data.
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 pb-8">
                     {status === 'idle' && (
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <div className="text-center text-slate-300">
                                <p>All prerequisites are met. Ready to compute stress profiles.</p>
                                <p className="text-sm text-slate-400">This will calculate Sv, Shmin, and SHmax.</p>
                            </div>
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-500" onClick={handleRunCalculation}>
                                <Play className="mr-2 h-5 w-5" /> Run Stress Calculation
                            </Button>
                        </div>
                    )}

                    {status === 'running' && (
                        <div className="w-full text-center space-y-4">
                            <Loader2 className="h-10 w-10 text-blue-400 animate-spin mx-auto" />
                            <p className="text-slate-300 text-lg">Calculating stress profiles...</p>
                            <Progress value={progress} className="w-3/4 mx-auto" />
                            <p className="text-xs text-slate-500">{progress}% complete</p>
                        </div>
                    )}
                    
                    {status === 'completed' && (
                         <div className="text-center space-y-4">
                            <Check className="h-12 w-12 text-green-400 mx-auto bg-green-500/20 p-2 rounded-full"/>
                            <p className="text-xl font-semibold text-green-300">Stress Calculation Successful!</p>
                            <Tabs defaultValue="summary" className="w-full mt-4">
                                <TabsList className="grid w-full grid-cols-3 bg-slate-900">
                                    <TabsTrigger value="summary"><BarChart className="w-4 h-4 mr-2"/>Summary</TabsTrigger>
                                    <TabsTrigger value="methods"><SlidersHorizontal className="w-4 h-4 mr-2"/>Methods</TabsTrigger>
                                    <TabsTrigger value="quality"><ShieldCheck className="w-4 h-4 mr-2"/>Quality</TabsTrigger>
                                </TabsList>
                                <TabsContent value="summary" className="mt-4 text-slate-300 bg-slate-800/50 p-4 rounded-lg">
                                    <p>Stress profiles have been generated. You can now proceed to view the detailed results.</p>
                                </TabsContent>
                                <TabsContent value="methods" className="mt-4 text-slate-300 bg-slate-800/50 p-4 rounded-lg">
                                    <p>This panel will show calculation methods (e.g., Eaton, Zoback) and allow adjustments. This feature is not yet implemented.</p>
                                </TabsContent>
                                <TabsContent value="quality" className="mt-4 text-slate-300 bg-slate-800/50 p-tranrounded-lg">
                                    <p>This panel will display calibration quality and allow for manual stress inputs. This feature is not yet implemented.</p>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StressCalculationStep;