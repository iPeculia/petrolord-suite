import React from 'react';
import { GuidedModeProvider } from './contexts/GuidedModeContext';
import GuidedModeWorkflow from './components/guided/GuidedModeWorkflow';
import { Toaster } from "@/components/ui/toaster";

const GuidedMode = () => {
    return (
        <GuidedModeProvider>
            <div className="flex flex-col flex-grow bg-slate-950">
                <GuidedModeWorkflow />
            </div>
            <Toaster />
        </GuidedModeProvider>
    );
};

export default GuidedMode;