import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GitMerge, Play, Plus, Save, GripVertical, ArrowRight, Settings } from 'lucide-react'; // Moved import to top

const CustomWorkflowBuilder = () => {
    const [steps, setSteps] = useState([
        { id: 1, type: 'trigger', name: 'On File Upload (LAS)', config: {} },
        { id: 2, type: 'action', name: 'Validate Headers', config: {} },
        { id: 3, type: 'action', name: 'Normalize Curves', config: {} },
        { id: 4, type: 'action', name: 'Save to Database', config: {} },
    ]);

    return (
        <div className="h-full flex flex-col p-1">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-200 flex items-center">
                        <GitMerge className="w-5 h-5 mr-2 text-orange-400" /> Workflow Studio
                    </h3>
                    <p className="text-xs text-slate-400">Automate repetitive subsurface tasks.</p>
                </div>
                <div className="flex gap-2">
                    <Button size="sm" variant="outline"><Play className="w-4 h-4 mr-2" /> Test Run</Button>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700"><Save className="w-4 h-4 mr-2" /> Save Workflow</Button>
                </div>
            </div>

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 h-0">
                {/* Canvas */}
                <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-lg p-6 relative overflow-y-auto">
                    <div className="absolute top-0 left-0 right-0 h-full w-full opacity-5 pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>
                    
                    <div className="space-y-4 relative z-10 max-w-xl mx-auto">
                        {steps.map((step, index) => (
                            <div key={step.id} className="relative">
                                <Card className="bg-slate-900 border-slate-700 hover:border-orange-500/50 transition-colors cursor-pointer group">
                                    <CardContent className="p-4 flex items-center gap-3">
                                        <GripVertical className="text-slate-600 group-hover:text-slate-400" />
                                        <div className={`p-2 rounded-md ${step.type === 'trigger' ? 'bg-blue-900/30 text-blue-400' : 'bg-orange-900/30 text-orange-400'}`}>
                                            {step.type === 'trigger' ? <Play className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="text-sm font-bold text-slate-200">{step.name}</div>
                                            <div className="text-[10px] text-slate-500 uppercase">{step.type}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                                {index < steps.length - 1 && (
                                    <div className="flex justify-center py-2">
                                        <ArrowRight className="w-5 h-5 text-slate-600 rotate-90" />
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        <Button variant="ghost" className="w-full border-2 border-dashed border-slate-800 text-slate-500 hover:text-orange-400 hover:border-orange-500/30 h-16">
                            <Plus className="w-5 h-5 mr-2" /> Add Step
                        </Button>
                    </div>
                </div>

                {/* Sidebar */}
                <Card className="bg-slate-900 border-slate-800 flex flex-col h-full">
                    <CardContent className="p-4 space-y-6">
                        <div>
                            <h4 className="font-bold text-slate-300 mb-2 text-sm">Available Actions</h4>
                            <ScrollArea className="h-[200px] pr-2">
                                <div className="space-y-2">
                                    {['Send Email', 'Calculate Porosity', 'Run Python Script', 'HTTP Request', 'Update Project Status', 'Generate PDF'].map(action => (
                                        <div key={action} className="p-2 bg-slate-950 border border-slate-800 rounded text-xs text-slate-400 hover:text-white hover:border-slate-600 cursor-grab">
                                            {action}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-300 mb-2 text-sm">Configuration</h4>
                            <div className="p-4 bg-slate-950 rounded border border-slate-800 text-center text-slate-500 text-xs">
                                Select a step to configure parameters.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CustomWorkflowBuilder;