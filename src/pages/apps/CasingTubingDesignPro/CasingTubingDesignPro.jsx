import React from 'react';
import { CasingTubingDesignProvider } from './contexts/CasingTubingDesignContext';
import TopBanner from './components/TopBanner';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import CenterContent from './components/CenterContent';
import BottomStrip from './components/BottomStrip';
import HelpPanel from './components/help/HelpPanel';
import KeyboardShortcuts from './components/common/KeyboardShortcuts';
import { Helmet } from 'react-helmet';

const CasingTubingDesignProContent = () => {
    return (
        <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
            <Helmet>
                <title>Casing & Tubing Design Pro | Petrolord</title>
            </Helmet>
            
            <KeyboardShortcuts />
            <TopBanner />
            
            <div className="flex flex-1 overflow-hidden">
                <LeftPanel />
                
                <div className="flex flex-1 flex-col overflow-hidden relative">
                    <div className="flex flex-1 overflow-hidden">
                        <CenterContent />
                        <RightPanel />
                    </div>
                    <BottomStrip />
                </div>
            </div>
            
            <HelpPanel />
        </div>
    );
};

const CasingTubingDesignPro = () => (
    <CasingTubingDesignProvider>
        <CasingTubingDesignProContent />
    </CasingTubingDesignProvider>
);

export default CasingTubingDesignPro;