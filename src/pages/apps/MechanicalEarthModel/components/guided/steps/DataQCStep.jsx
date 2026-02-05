import React, { useEffect } from 'react';
import { useGuidedMode } from '../../../contexts/GuidedModeContext';
import DataQC from '../../DataQC';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const DataQCStep = () => {
    const { state, dispatch } = useGuidedMode();
    const { lasData } = state;

    useEffect(() => {
        // Validation is true if user has seen this step with data.
        // Data QC is informational, so the "Next" button should always be enabled if there's data.
        const isValid = lasData !== null;
        dispatch({ type: 'SET_VALIDATION', payload: { step: 3, isValid } });
    }, [lasData, dispatch]);

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
            <div className="flex-grow max-w-4xl mx-auto w-full">
                <Card className="bg-transparent border-none shadow-none text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-white">Data Quality Control</CardTitle>
                        <CardDescription className="text-slate-400">
                            Review the quality and completeness of your uploaded data. Address any significant issues before proceeding.
                        </CardDescription>
                    </CardHeader>
                </Card>
                <DataQC logs={lasData} />
            </div>

            <div className="mt-8 pt-4 border-t border-slate-700 flex justify-between items-center max-w-4xl mx-auto w-full">
                <Button variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>
                <Button onClick={handleNext} disabled={!state.validation[3]}>
                    Next Step
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
};

export default DataQCStep;