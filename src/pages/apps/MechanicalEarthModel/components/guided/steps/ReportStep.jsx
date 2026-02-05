import React from 'react';
import { useGuidedMode } from '../../../contexts/GuidedModeContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import ExportStep from './ExportStep'; // Re-using the ExportStep component for UI

const ReportStep = () => {
    const { dispatch } = useGuidedMode();
    
    const handlePrevious = () => {
        dispatch({ type: 'PREVIOUS_STEP' });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full"
        >
            <div className="flex-grow">
                <ExportStep />
            </div>

            <div className="mt-8 pt-4 border-t border-slate-700 flex justify-between items-center max-w-7xl mx-auto w-full">
                <Button variant="outline" onClick={handlePrevious}>
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                </Button>
                <Button disabled>Finish (No Next Step)</Button>
            </div>
        </motion.div>
    );
};

export default ReportStep;