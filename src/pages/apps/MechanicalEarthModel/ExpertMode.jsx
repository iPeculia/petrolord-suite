import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExpertModeProvider, useExpertMode } from './contexts/ExpertModeContext';
import { useBasinFlow, BasinFlowProvider } from '../BasinFlowGenesis/contexts/BasinFlowContext';
import StratigraphyPanel from '../BasinFlowGenesis/components/StratigraphyPanel';
import VisualizationPanel from '../BasinFlowGenesis/components/VisualizationPanel';
import AdvancedControlsPanel from './components/expert/AdvancedControlsPanel';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, Save, Settings, Download, Menu, PanelRight, PanelLeft } from 'lucide-react';

const ExpertModeContent = () => {
    // Integration with BasinFlow Context
    const { state: basinState, dispatch: basinDispatch } = useBasinFlow();
    const { stratigraphy, project, selectedLayerId } = basinState;
    
    // Expert Mode Context
    const { setActiveLayer } = useExpertMode();

    const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

    // Sync selected layer between BasinFlow and Expert Mode
    useEffect(() => {
        if (selectedLayerId) {
            setActiveLayer(selectedLayerId);
        }
    }, [selectedLayerId, setActiveLayer]);

    const handleUpdateLayer = (updatedLayer) => {
        basinDispatch({ type: 'UPDATE_LAYER', payload: updatedLayer });
    };

    return (
        <div className="h-screen flex flex-col bg-slate-950 overflow-hidden text-slate-200">
            {/* Expert Header */}
            <header className="h-14 bg-slate-950 border-b border-slate-800 flex justify-between items-center px-4 shrink-0">
                <div className="flex items-center gap-4">
                    <Link to="/apps/geoscience/basinflow-genesis">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="hidden md:block">
                        <h1 className="text-sm font-bold text-white flex items-center gap-2">
                            BasinFlow <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] uppercase rounded border border-indigo-500/30">Expert</span>
                        </h1>
                        <p className="text-[10px] text-slate-500">{project?.name || 'Untitled Project'} / Advanced Modeling</p>
                    </div>
                    <div className="md:hidden text-sm font-bold text-white">Expert Mode</div>
                </div>
                
                <div className="flex items-center gap-2">
                     {/* Panel Toggles for Desktop */}
                    <div className="hidden lg:flex items-center border-r border-slate-800 pr-2 mr-2 gap-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-8 w-8 ${isLeftPanelOpen ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500'}`}
                            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
                            title="Toggle Stratigraphy Panel"
                        >
                            <PanelLeft className="w-4 h-4" />
                        </Button>
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className={`h-8 w-8 ${isRightPanelOpen ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-500'}`}
                            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                            title="Toggle Controls Panel"
                        >
                            <PanelRight className="w-4 h-4" />
                        </Button>
                    </div>

                     <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs hidden sm:flex">
                        <Settings className="w-4 h-4 mr-2" /> <span className="hidden md:inline">Settings</span>
                    </Button>
                    <Button variant="outline" size="sm" className="text-slate-300 border-slate-700 hover:bg-slate-800 text-xs hidden sm:flex">
                        <Download className="w-4 h-4 mr-2" /> <span className="hidden md:inline">Export</span>
                    </Button>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
                        <Save className="w-4 h-4 md:mr-2" /> <span className="hidden md:inline">Save</span>
                    </Button>
                    
                    {/* Mobile Menu Trigger */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden text-slate-400">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[85vw] bg-slate-950 border-slate-800 p-0">
                             <AdvancedControlsPanel 
                                stratigraphy={stratigraphy} 
                                onUpdateLayer={handleUpdateLayer} 
                            />
                        </SheetContent>
                    </Sheet>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left: Stratigraphy Selection (Collapsible) */}
                <div className={`
                    ${isLeftPanelOpen ? 'w-64 border-r' : 'w-0 opacity-0'} 
                    transition-all duration-300 ease-in-out
                    border-slate-800 bg-slate-950 flex flex-col z-10 overflow-hidden shrink-0
                    hidden lg:flex
                `}>
                    <div className="p-3 border-b border-slate-800 bg-slate-900/50 text-xs font-bold text-slate-400 uppercase whitespace-nowrap">
                        Stratigraphy
                    </div>
                    <div className="flex-1 overflow-hidden relative">
                        <StratigraphyPanel isExpertMode={true} /> 
                    </div>
                </div>

                {/* Center: Visualization */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-900 relative">
                    <VisualizationPanel />
                </div>

                {/* Right: Advanced Controls (Collapsible) */}
                <div className={`
                    ${isRightPanelOpen ? 'w-[450px] border-l' : 'w-0 opacity-0'} 
                    transition-all duration-300 ease-in-out
                    bg-slate-950 z-20 shadow-xl shadow-black/50 shrink-0 overflow-hidden
                    border-slate-800
                    hidden lg:block
                `}>
                    <AdvancedControlsPanel 
                        stratigraphy={stratigraphy} 
                        onUpdateLayer={handleUpdateLayer} 
                    />
                </div>
            </div>
        </div>
    );
};

const ExpertMode = () => {
    return (
        // Wrapping in both providers to ensure context availability
        <BasinFlowProvider>
            <ExpertModeProvider>
                <ExpertModeContent />
            </ExpertModeProvider>
        </BasinFlowProvider>
    );
};

export default ExpertMode;