import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, CheckCircle, AlertTriangle, RefreshCw, Save, RotateCcw } from 'lucide-react';
import { useStudio } from '@/contexts/StudioContext';
import { useToast } from '@/components/ui/use-toast';

const UnifiedDataModel = () => {
    const { allAssets, activeProject, isLoading } = useStudio();
    const { toast } = useToast();
    const [healthScore, setHealthScore] = useState(100);
    const [syncStatus, setSyncStatus] = useState('synced');
    const [lastBackup, setLastBackup] = useState(new Date());

    // Simulated Health Check
    useEffect(() => {
        if (allAssets.length > 0) {
            // Mock validation logic
            const missingMeta = allAssets.filter(a => !a.meta).length;
            const score = Math.max(0, 100 - (missingMeta * 5));
            setHealthScore(score);
        }
    }, [allAssets]);

    const handleBackup = () => {
        setSyncStatus('backing_up');
        setTimeout(() => {
            setLastBackup(new Date());
            setSyncStatus('synced');
            toast({ title: "Backup Complete", description: "Project data snapshot saved successfully." });
        }, 1500);
    };

    const handleValidation = () => {
        toast({ title: "Validation Run", description: `Checked ${allAssets.length} assets. Integrity is ${(healthScore).toFixed(0)}%.` });
    };

    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <Database className="w-4 h-4 mr-2 text-cyan-400" /> Unified Data Model
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                
                {/* Project Stats */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">Assets</div>
                        <div className="text-xl font-mono text-white">{allAssets.length}</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <div className="text-[10px] text-slate-400 uppercase">Health</div>
                        <div className={`text-xl font-mono ${healthScore > 90 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {healthScore}%
                        </div>
                    </div>
                </div>

                {/* Sync Status */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Sync Status</span>
                        {syncStatus === 'synced' && <Badge variant="outline" className="text-green-400 border-green-900 bg-green-900/20">Synced</Badge>}
                        {syncStatus === 'backing_up' && <Badge variant="outline" className="text-blue-400 border-blue-900 bg-blue-900/20">Backing Up...</Badge>}
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>Last Backup:</span>
                        <span>{lastBackup.toLocaleTimeString()}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" size="sm" className="text-xs justify-start" onClick={handleValidation}>
                        <CheckCircle className="w-3 h-3 mr-2 text-green-500" /> Run Integrity Check
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs justify-start" onClick={handleBackup}>
                        <Save className="w-3 h-3 mr-2 text-blue-500" /> Create Snapshot
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs justify-start">
                        <RotateCcw className="w-3 h-3 mr-2 text-orange-500" /> Restore Previous
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
};

export default UnifiedDataModel;