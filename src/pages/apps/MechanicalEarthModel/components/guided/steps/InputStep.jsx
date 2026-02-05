import React, { useEffect, useContext } from 'react';
import { GuidedModeContext } from '../../../contexts/GuidedModeContext';
import MechanicalPropertiesForm from '../../../components/MechanicalPropertiesForm';
import PressureInputForm from '../../../components/PressureInputForm';
import PressureDataPlot from '../../../components/PressureDataPlot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const InputStep = () => {
    const { state, dispatch } = useContext(GuidedModeContext);

    useEffect(() => {
        // Validation for this step is met if mechanical properties have been saved at least once.
        const isValid = state.areMechanicalPropertiesSaved;
        dispatch({ type: 'SET_VALIDATION', payload: { step: 4, isValid } });
    }, [state.areMechanicalPropertiesSaved, dispatch]);

    const handlePrevious = () => {
        dispatch({ type: 'PREVIOUS_STEP' });
    };

    const handleNext = () => {
        dispatch({ type: 'NEXT_STEP' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full"
        >
            <div className="flex-grow max-w-7xl mx-auto space-y-8 w-full">
                <Card className="bg-transparent border-none shadow-none text-center">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-white">Model Inputs</CardTitle>
                        <CardDescription className="text-slate-400 text-base">
                            Define rock mechanical properties and input any known pressure data points.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" style={{minHeight: 'calc(100vh - 350px)'}}>
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-6">
                            <MechanicalPropertiesForm />
                            <PressureInputForm />
                        </div>
                    </ScrollArea>
                    <div className="h-full">
                        <PressureDataPlot pressurePoints={state.pressureData.points} />
                    </div>
                </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-700 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Button variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>
                <Button onClick={handleNext} disabled={!state.validation[4]}>
                    Next Step
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
};

export default InputStep;