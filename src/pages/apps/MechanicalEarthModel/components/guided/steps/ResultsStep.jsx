import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGuidedMode } from '../../../contexts/GuidedModeContext';
import ResultsSummary from '../ResultsSummary';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import VisualizationPanel from '../../../components/VisualizationPanel';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';

const ResultsStep = () => {
    const { state, dispatch } = useGuidedMode();
    const navigate = useNavigate();

    useEffect(() => {
        // Validation for this step depends on successful calculation
        dispatch({ type: 'SET_VALIDATION', payload: { step: 6, isValid: state.results?.success === true } });
    }, [dispatch, state.results]);

    const handlePrevious = () => {
        dispatch({ type: 'PREVIOUS_STEP' });
    };
    
    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    const goToAnalytics = () => {
        navigate('/dashboard/apps/geoscience/mechanical-earth-model/analytics', { state: { results: state.results } });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full"
        >
            <div className="flex-grow max-w-7xl mx-auto w-full space-y-8">
                <Card className="bg-transparent border-none shadow-none text-center">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-white">Calculation Results</CardTitle>
                        <CardDescription className="text-slate-400 text-base">
                            Here is a summary of your 1D Mechanical Earth Model. Explore the plots below or dive into detailed analytics.
                        </CardDescription>
                    </CardHeader>
                </Card>
                
                <div className="grid grid-cols-1 gap-6">
                    <ResultsSummary />
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-full"
                    >
                        <VisualizationPanel results={state.results} />
                    </motion.div>
                </div>
            </div>
            
             <div className="mt-8 pt-4 border-t border-slate-700 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Button variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>
                <div className="flex items-center gap-4">
                     <Button variant="outline" className="bg-slate-700" onClick={goToAnalytics}>
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Go to Full Analytics
                    </Button>
                    <Button onClick={handleNext}>
                        Next Step
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default ResultsStep;