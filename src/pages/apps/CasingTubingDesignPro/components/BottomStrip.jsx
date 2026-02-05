import React, { useState } from 'react';
import { useCasingTubingDesign } from '../contexts/CasingTubingDesignContext';
import { ChevronUp, ChevronDown, AlertTriangle, ScrollText, BookOpen, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

const BottomStrip = () => {
    const { logs, warnings } = useCasingTubingDesign();
    const [isOpen, setIsOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('logs');

    return (
        <div className={`bg-slate-900 border-t border-slate-800 flex flex-col transition-all duration-300 ${isOpen ? 'h-48' : 'h-9'}`}>
            {/* Header / Tabs */}
            <div className="h-9 flex items-center justify-between px-2 bg-slate-900 border-b border-slate-800 shrink-0 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`h-7 text-xs rounded-none border-b-2 ${activeTab === 'logs' ? 'border-lime-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        onClick={() => { setActiveTab('logs'); setIsOpen(true); }}
                    >
                        <ScrollText className="w-3.5 h-3.5 mr-1.5" /> Calculation Log
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`h-7 text-xs rounded-none border-b-2 ${activeTab === 'warnings' ? 'border-yellow-400 text-yellow-100' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        onClick={() => { setActiveTab('warnings'); setIsOpen(true); }}
                    >
                        <AlertTriangle className="w-3.5 h-3.5 mr-1.5" /> 
                        Warnings {warnings.length > 0 && `(${warnings.length})`}
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`h-7 text-xs rounded-none border-b-2 ${activeTab === 'refs' ? 'border-blue-400 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                        onClick={() => { setActiveTab('refs'); setIsOpen(true); }}
                    >
                        <BookOpen className="w-3.5 h-3.5 mr-1.5" /> API References
                    </Button>
                </div>
                
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500">
                    {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </Button>
            </div>

            {/* Content */}
            {isOpen && (
                <div className="flex-1 overflow-hidden bg-slate-950">
                    {activeTab === 'logs' && (
                        <ScrollArea className="h-full">
                            <div className="p-2 space-y-1 font-mono text-xs">
                                {logs.length === 0 && <p className="text-slate-600 italic px-2">No activity logged yet.</p>}
                                {logs.map((log, i) => (
                                    <div key={i} className="flex space-x-3 text-slate-300 hover:bg-slate-900 p-1 rounded">
                                        <span className="text-slate-500 shrink-0">{format(log.timestamp, 'HH:mm:ss')}</span>
                                        <span className={log.type === 'error' ? 'text-red-400' : 'text-slate-300'}>{log.message}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                    
                    {activeTab === 'warnings' && (
                        <ScrollArea className="h-full">
                            <div className="p-2 space-y-1">
                                {warnings.length === 0 && <p className="text-slate-600 italic px-2 flex items-center"><ShieldCheck className="w-3 h-3 mr-2"/> No active warnings. Design is compliant.</p>}
                                {warnings.map((w, i) => (
                                    <div key={i} className="flex items-start space-x-2 text-yellow-200 bg-yellow-900/10 p-2 rounded border border-yellow-900/30">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span className="text-xs">{w.message}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}

                    {activeTab === 'refs' && (
                        <div className="p-4 text-xs text-slate-400 space-y-2">
                            <p><strong>API 5C3:</strong> Calculating Performance Properties of Pipe Used as Casing or Tubing.</p>
                            <p><strong>API TR 5C3:</strong> Technical Report on Equations and Calculations.</p>
                            <p><strong>ISO 10400:</strong> Petroleum and natural gas industries — Equations and calculations for the properties of casing, tubing, drill pipe and line pipe used as casing or tubing.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BottomStrip;