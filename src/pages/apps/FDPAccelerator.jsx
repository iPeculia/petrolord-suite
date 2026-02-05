import React from 'react';
import { FDPProvider, useFDP } from '@/contexts/FDPContext';
import MainLayout from '@/components/fdp/layout/MainLayout';
import { Helmet } from 'react-helmet';
import ExpertMode from '@/components/fdp/modes/ExpertMode';
import GuidedMode from '@/components/fdp/modes/GuidedMode';

const ContentRouter = () => {
    const { state } = useFDP();
    const { mode } = state.meta;
    
    // Switch based on current mode (Expert vs Guided)
    if (mode === 'guided') {
        return <GuidedMode />;
    } else {
        return <ExpertMode />;
    }
};

const FDPAccelerator = () => {
    return (
        <FDPProvider>
            <Helmet>
                <title>FDP Accelerator - Petrolord</title>
                <meta name="theme-color" content="#0f172a" />
            </Helmet>
            <MainLayout>
                <ContentRouter />
            </MainLayout>
        </FDPProvider>
    );
};

export default FDPAccelerator;