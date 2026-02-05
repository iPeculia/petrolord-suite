import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, XCircle, AlertCircle, Layers, Loader2 } from 'lucide-react';
import { useMultiWell } from '../../contexts/MultiWellContext';
import { BatchEngine } from '../../services/BatchEngine';
import { useToast } from '@/components/ui/use-toast';

const BatchProcessor = () => {
    const { state: mwState } = useMultiWell();
    const { toast } = useToast();
    
    const [selectedWells, setSelectedWells] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [progress, setProgress] = useState({ completed: 0, total: 0, current: '' });
    const [results, setResults] = useState(null);

    const handleToggleWell = (id) => {
        setSelectedWells(prev => 
            prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedWells.length === mwState.wells.length) {
            setSelectedWells([]);
        } else {
            setSelectedWells(mwState.wells.map(w => w.id));
        }
    };

    const handleRunBatch = async () => {
        if (selectedWells.length === 0) return;
        
        setIsRunning(true);
        setResults(null);
        setProgress({ completed: 0, total: selectedWells.length, current: 'Starting...' });

        try {
            // Filter full well objects using the map
            const wellsToRun = selectedWells.map(id => mwState.wellDataMap[id]).filter(Boolean);
            
            const batchResults = await BatchEngine.runBatch(wellsToRun, (completed, total, current) => {
                setProgress({ completed, total, current });
            });

            setResults(batchResults);
            toast({ title: "Batch Complete", description: `Processed ${batchResults.length} wells.` });
        } catch (e) {
            toast({ variant: "destructive", title: "Batch Failed", description: e.message });
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-slate-950 overflow-y-auto">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Batch Simulation</h2>
                    <Button variant="outline" size="sm" onClick={handleSelectAll} className="text-xs">
                        {selectedWells.length === mwState.wells.length ? "Deselect All" : "Select All"}
                    </Button>
                </div>

                <Card className="bg-slate-900 border-slate-800 flex-1">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-400">Available Wells ({mwState.wells.length})</CardTitle>
                    </CardHeader>
                    <ScrollArea className="h-[400px]">
                        <div className="p-2 space-y-1">
                            {mwState.wells.map(well => (
                                <div 
                                    key={well.id} 
                                    className={`flex items-center space-x-3 p-3 rounded border transition-colors cursor-pointer ${selectedWells.includes(well.id) ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                                    onClick={() => handleToggleWell(well.id)}
                                >
                                    <Checkbox checked={selectedWells.includes(well.id)} />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white">{well.name}</div>
                                        <div className="text-xs text-slate-500 flex gap-2">
                                            <span className={`capitalize ${well.status === 'calibrated' ? 'text-emerald-500' : ''}`}>{well.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>

                <Button 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 text-lg"
                    onClick={handleRunBatch}
                    disabled={isRunning || selectedWells.length === 0}
                >
                    {isRunning ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Play className="w-5 h-5 mr-2" />}
                    Run Batch ({selectedWells.length})
                </Button>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">Results</h2>
                    {isRunning && (
                        <div className="space-y-2 bg-slate-900 p-4 rounded border border-slate-800">
                            <div className="flex justify-between text-sm text-slate-300">
                                <span>Processing: {progress.current || '...'}</span>
                                <span>{progress.completed}/{progress.total}</span>
                            </div>
                            <Progress value={(progress.completed / progress.total) * 100} className="h-2" />
                        </div>
                    )}
                </div>

                {results && (
                    <Card className="bg-slate-900 border-slate-800">
                        <ScrollArea className="h-[500px]">
                            <div className="p-4 space-y-2">
                                {results.map((res, i) => {
                                    const wellName = mwState.wellDataMap[res.wellId]?.name || 'Unknown Well';
                                    return (
                                        <div key={i} className="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                {res.status === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-500"/> : <XCircle className="w-5 h-5 text-red-500"/>}
                                                <div>
                                                    <div className="text-sm font-medium text-white">{wellName}</div>
                                                    {res.status === 'success' ? (
                                                        <div className="text-xs text-slate-500">Max Ro: {res.maxRo.toFixed(2)}% | Max Temp: {res.maxTemp.toFixed(0)}°C</div>
                                                    ) : (
                                                        <div className="text-xs text-red-400">{res.error}</div>
                                                    )}
                                                </div>
                                            </div>
                                            {res.status === 'success' && <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">Success</Badge>}
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    </Card>
                )}
                
                {!results && !isRunning && (
                    <div className="h-[400px] flex flex-col items-center justify-center text-slate-600 border-2 border-dashed border-slate-800 rounded-lg">
                        <Layers className="w-12 h-12 mb-4 opacity-20" />
                        <p>Run a batch to view results summary here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BatchProcessor;