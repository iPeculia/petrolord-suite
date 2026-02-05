import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WifiOff, RefreshCw, Database } from 'lucide-react';

const OfflineSupport = () => (
    <div className="h-full p-1 space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <WifiOff className="w-5 h-5 mr-2 text-slate-400" /> Offline Sync
            </h3>
            <div className="text-xs text-green-400 flex items-center"><RefreshCw className="w-3 h-3 mr-1"/> Active</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4">
                    <div className="text-xs text-slate-500 uppercase">Local Storage</div>
                    <div className="text-lg font-bold text-white mt-1">450 MB</div>
                    <div className="text-[10px] text-slate-400 mt-1">IndexedDB Usage</div>
                </CardContent>
            </Card>
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4">
                    <div className="text-xs text-slate-500 uppercase">Sync Strategy</div>
                    <div className="text-lg font-bold text-white mt-1">Optimistic</div>
                    <div className="text-[10px] text-slate-400 mt-1">Last-Write-Wins</div>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default OfflineSupport;