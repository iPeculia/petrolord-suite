import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { History, GitCommit, Clock, ArrowRight, Check } from 'lucide-react';
import { useBasinFlow } from '@/pages/apps/BasinFlowGenesis/contexts/BasinFlowContext';
import { useMultiWell } from '@/pages/apps/BasinFlowGenesis/contexts/MultiWellContext';
import { useToast } from '@/components/ui/use-toast';

const VersionControlPanel = () => {
    const { state } = useBasinFlow();
    const { updateWell, state: mwState } = useMultiWell();
    const { toast } = useToast();
    
    const [message, setMessage] = useState('');
    const [selectedVersion, setSelectedVersion] = useState(null);

    // Simulate real version history if available in the active well, else mock
    const activeWell = mwState.wellDataMap[mwState.activeWellId];
    const history = activeWell?.history || [
        { id: 'v1.1', timestamp: new Date(Date.now() - 3600000).toISOString(), message: 'Updated heat flow model', user: 'Current User', changes: { heatFlow: { old: 55, new: 60 } } },
        { id: 'v1.0', timestamp: new Date(Date.now() - 86400000).toISOString(), message: 'Initial basin setup', user: 'Current User', changes: { layers: 'Created 3 layers' } }
    ];

    const handleSaveVersion = async () => {
        if (!message.trim()) {
            toast({ variant: "destructive", title: "Error", description: "Please enter a commit message." });
            return;
        }

        const newVersion = {
            id: `v1.${history.length}`,
            timestamp: new Date().toISOString(),
            message,
            user: 'Current User',
            changes: { heatFlow: { old: 60, new: state.heatFlow.value } } // Mock diff logic for demo
        };

        const newHistory = [newVersion, ...history];

        if (mwState.activeWellId) {
            await updateWell(mwState.activeWellId, { history: newHistory });
            toast({ title: "Snapshot Created", description: `Version saved: ${message}` });
            setMessage('');
        }
    };

    const VersionDiffViewer = ({ version }) => {
        if (!version) return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 border-2 border-dashed border-slate-800 rounded-lg">
                <History className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">Select a version to see details and changes.</p>
            </div>
        );

        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="p-4 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-center gap-2 text-white font-semibold text-base mb-2">
                        <GitCommit className="w-5 h-5 text-purple-400" />
                        {version.message}
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 border-t border-slate-800 pt-2 mt-2">
                        <span>{new Date(version.timestamp).toLocaleString()}</span>
                        <span className="font-mono">{version.id}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                        Committed by <span className="text-slate-300">{version.user}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Check className="w-3 h-3" />
                        Parameter Changes
                    </h4>
                    
                    {version.changes?.heatFlow ? (
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-slate-200">Heat Flow (mW/m²)</span>
                                <Badge variant="outline" className="text-[10px] border-blue-500/50 text-blue-400">Modified</Badge>
                            </div>
                            <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded">
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-slate-500 uppercase">Before</span>
                                    <span className="text-red-400 font-mono font-bold">{version.changes.heatFlow.old}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-600" />
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] text-slate-500 uppercase">After</span>
                                    <span className="text-emerald-400 font-mono font-bold">{version.changes.heatFlow.new}</span>
                                </div>
                            </div>
                        </div>
                    ) : null}
                    
                    {version.changes?.layers ? (
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-slate-200">Stratigraphy</span>
                                <Badge variant="outline" className="text-[10px] border-emerald-500/50 text-emerald-400">Structure</Badge>
                            </div>
                            <p className="text-xs text-slate-400">{version.changes.layers}</p>
                        </div>
                    ) : null}

                    {!version.changes && (
                        <div className="text-sm text-slate-500 italic p-4 text-center">No parameter diff details available for this version.</div>
                    )}
                </div>
                
                <div className="pt-4 border-t border-slate-800">
                    <Button variant="outline" className="w-full" disabled>
                        <History className="w-4 h-4 mr-2" /> Restore this Version
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full grid grid-cols-12 gap-4 p-4 bg-slate-950 overflow-y-auto">
            <div className="col-span-12 lg:col-span-4 space-y-4 flex flex-col h-full">
                <Card className="bg-slate-900 border-slate-800 shrink-0">
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-white">Create Snapshot</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1">
                            <Label className="text-xs text-slate-400">Commit Message</Label>
                            <Textarea 
                                placeholder="Describe your changes..." 
                                className="bg-slate-950 border-slate-700 h-20 text-xs resize-none"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </div>
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" size="sm" onClick={handleSaveVersion}>
                            <SaveIcon className="w-3 h-3 mr-2" /> Save Version
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800 flex-1 flex flex-col min-h-0">
                    <CardHeader className="pb-2 shrink-0"><CardTitle className="text-sm text-white flex items-center gap-2"><History className="w-4 h-4" /> History</CardTitle></CardHeader>
                    <CardContent className="p-0 flex-1 min-h-0">
                        <ScrollArea className="h-full">
                            <div className="flex flex-col">
                                {history.map((v, i) => (
                                    <div 
                                        key={i} 
                                        className={`p-3 border-b border-slate-800 cursor-pointer hover:bg-slate-800 transition-colors ${selectedVersion?.id === v.id ? 'bg-slate-800 border-l-2 border-l-indigo-500' : ''}`}
                                        onClick={() => setSelectedVersion(v)}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400">{v.id}</Badge>
                                            <span className="text-[10px] text-slate-500">{new Date(v.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                        </div>
                                        <p className="text-xs text-slate-300 font-medium truncate">{v.message}</p>
                                        {i === 0 && <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1"> <Clock className="w-3 h-3" /> Current</div>}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>

            <div className="col-span-12 lg:col-span-8 h-full">
                <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
                    <CardHeader className="pb-2 border-b border-slate-800 shrink-0">
                        <CardTitle className="text-sm text-white">Version Details</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 flex-1 overflow-y-auto">
                        <VersionDiffViewer version={selectedVersion} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Icon component helper
const SaveIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
);

export default VersionControlPanel;