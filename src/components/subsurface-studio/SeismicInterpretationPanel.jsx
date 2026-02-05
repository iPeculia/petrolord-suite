import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PenTool, BrainCircuit, Save, Plus, Trash2, Layers, MousePointer, EyeOff, Eye } from 'lucide-react';

const SeismicInterpretationPanel = ({ session, actions, onSave }) => {
    const { toast } = useToast();
    const [newInterpretationName, setNewInterpretationName] = useState("New Horizon");
    
    // Derived state
    const jobInProgress = session.isLoading;
    const activeTool = session.activeTool;

    const handleAutoPick = async () => {
        // For now, assume we auto-pick from the last point added
        const lastPick = session.currentPicks[session.currentPicks.length - 1];
        if (!lastPick) {
            toast({ variant: 'default', title: 'Seed Point Required', description: 'Please pick a starting point on the seismic section first.' });
            actions.setTool('manual');
            return;
        }

        try {
            await actions.autoPickAI(lastPick, 'horizon');
            toast({ title: '🤖 AI Auto-trace Started', description: 'The AI is tracing the horizon...' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'AI Task Failed', description: error.message });
        }
    };
    
    const handleSave = () => {
        const activeInterpretation = session.interpretations.find(i => i.id === session.activeInterpretationId);
        const name = activeInterpretation ? activeInterpretation.name : newInterpretationName;
        const idToUpdate = activeInterpretation ? activeInterpretation.id : null;
        const version = activeInterpretation ? activeInterpretation.rev : 0;
        
        onSave({ idToUpdate, version, name, kind: 'horizon', points: session.currentPicks });
    };

    const handleNew = () => {
        actions.newInterpretation();
        setNewInterpretationName(`New Horizon ${session.interpretations.length + 1}`);
        actions.setTool('manual');
    };

    return (
        <div className="h-full bg-slate-900 text-white flex flex-col p-4 space-y-4 overflow-hidden">
            <h2 className="text-xl font-bold shrink-0">Interpretation Tools</h2>

            <Card className="bg-slate-800/50 shrink-0">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Picking Mode</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-2">
                    <Button 
                        variant={activeTool === 'pointer' ? 'default' : 'outline'} 
                        onClick={() => actions.setTool('pointer')}
                        disabled={jobInProgress}
                        size="sm"
                    >
                        <MousePointer className="w-4 h-4 mr-2" /> Navigate
                    </Button>
                    <Button 
                        variant={activeTool === 'manual' ? 'default' : 'outline'} 
                        onClick={() => actions.setTool('manual')}
                        disabled={jobInProgress}
                        size="sm"
                        className={activeTool === 'manual' ? 'bg-cyan-600 hover:bg-cyan-700' : ''}
                    >
                        <PenTool className="w-4 h-4 mr-2" /> Pick
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-slate-800/50 shrink-0">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">AI Assistance</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={handleAutoPick} disabled={jobInProgress} size="sm">
                        <BrainCircuit className="w-4 h-4 mr-2" /> Auto-trace from seed
                    </Button>
                    <p className="text-[10px] text-slate-400 mt-2">1. Select 'Pick' mode. 2. Click a point on section. 3. Click Auto-trace.</p>
                </CardContent>
            </Card>

            <Card className="bg-slate-800/50 shrink-0">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Current Session</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-1">
                        <Label htmlFor="interp-name" className="text-xs">Interpretation Name</Label>
                        <Input id="interp-name" value={newInterpretationName} onChange={(e) => setNewInterpretationName(e.target.value)} disabled={jobInProgress} className="h-8" />
                    </div>
                     <div className="flex space-x-2">
                        <Button onClick={handleNew} variant="secondary" className="w-full h-8 text-xs" disabled={jobInProgress}>
                            <Plus className="w-3 h-3 mr-1" /> New
                        </Button>
                        <Button onClick={actions.clearPicks} variant="ghost" className="w-full h-8 text-xs text-red-400 hover:text-red-300" disabled={jobInProgress || session.currentPicks.length === 0}>
                            <Trash2 className="w-3 h-3 mr-1" /> Clear
                        </Button>
                    </div>
                     <Button onClick={handleSave} className="w-full bg-cyan-600 hover:bg-cyan-700" disabled={jobInProgress || session.currentPicks.length === 0}>
                        <Save className="w-4 h-4 mr-2" /> Save Horizon
                    </Button>
                </CardContent>
            </Card>
            
            <Card className="bg-slate-800/50 flex-grow flex flex-col min-h-0 border-slate-700">
                <CardHeader className="pb-2 pt-3">
                    <CardTitle className="text-sm">Saved Horizons</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0">
                    <ScrollArea className="h-full w-full px-4 pb-4">
                        <div className="space-y-1">
                            {session.interpretations.length === 0 && <p className="text-xs text-slate-500 text-center py-4">No saved horizons yet.</p>}
                            
                            {session.interpretations.map((interp) => (
                                <div key={interp.id} 
                                    className={`flex justify-between items-center p-2 rounded-md cursor-pointer text-sm transition-colors ${session.activeInterpretationId === interp.id ? 'bg-cyan-900/30 border border-cyan-800' : 'hover:bg-slate-700 border border-transparent'}`}
                                    onClick={() => {
                                        actions.selectInterpretation(interp.id);
                                        setNewInterpretationName(interp.name);
                                    }}
                                >
                                    <div className="flex items-center overflow-hidden">
                                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: interp.style?.color || '#06b6d4' }}></div>
                                        <span className="truncate">{interp.name}</span>
                                    </div>
                                    <div className="flex shrink-0">
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-white"><Eye className="w-3 h-3" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

        </div>
    );
};

export default SeismicInterpretationPanel;