import React from 'react';
import { ChevronRight, Home, HelpCircle } from 'lucide-react';
import { useCasingTubingDesign } from '../contexts/CasingTubingDesignContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TopBanner = () => {
    const { selectedWell, selectedDesignCase, toggleHelp } = useCasingTubingDesign();

    return (
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-3 shrink-0 shadow-sm z-20">
            <div className="flex flex-col space-y-2">
                {/* Breadcrumbs */}
                <nav className="flex items-center text-xs text-slate-500 justify-between">
                    <div className="flex items-center">
                        <Link to="/dashboard" className="hover:text-slate-300 transition-colors flex items-center">
                            <Home className="w-3 h-3 mr-1" /> Dashboard
                        </Link>
                        <ChevronRight className="w-3 h-3 mx-1 opacity-50" />
                        <Link to="/dashboard/drilling" className="hover:text-slate-300 transition-colors">
                            Drilling & Completions
                        </Link>
                        <ChevronRight className="w-3 h-3 mx-1 opacity-50" />
                        <span className="text-lime-400 font-medium">Casing & Tubing Design Pro</span>
                    </div>
                    
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                        onClick={toggleHelp}
                        title="Help & Shortcuts (Ctrl+H)"
                    >
                        <HelpCircle className="w-4 h-4" />
                    </Button>
                </nav>

                {/* Context Info */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <div>
                            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Field</span>
                            <div className="text-slate-300 font-medium text-sm">
                                {selectedWell?.field || 'Unknown Field'}
                            </div>
                        </div>
                        <div className="h-8 w-px bg-slate-800"></div>
                        <div>
                            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Well</span>
                            <div className="text-white font-bold text-lg leading-tight">
                                {selectedWell ? selectedWell.name : <span className="text-slate-600 italic">Select a well</span>}
                            </div>
                        </div>
                        <div className="h-8 w-px bg-slate-800"></div>
                        <div>
                            <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Design Case</span>
                            <div className="flex items-center space-x-2">
                                <span className="text-white font-semibold text-sm">
                                    {selectedDesignCase ? selectedDesignCase.scheme_name : <span className="text-slate-600 italic">No Active Design</span>}
                                </span>
                                {selectedDesignCase && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-lime-500/10 text-lime-400 border border-lime-500/20 font-mono">
                                        ACTIVE
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <span className="text-[10px] text-slate-500 block">System Status</span>
                            <span className="flex items-center text-xs text-emerald-400 font-medium justify-end">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                                Online
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBanner;