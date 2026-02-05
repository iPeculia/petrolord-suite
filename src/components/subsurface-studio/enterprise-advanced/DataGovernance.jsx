import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollText, Archive, Trash2 } from 'lucide-react';

const DataGovernance = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <ScrollText className="w-5 h-5 mr-2 text-orange-400" /> Data Lifecycle
        </h3>
        <div className="grid grid-cols-3 gap-4">
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4 text-center">
                    <div className="text-xs text-slate-500 uppercase mb-2">Retention Period</div>
                    <div className="text-3xl font-bold text-white">7 Yrs</div>
                    <div className="text-[10px] text-slate-400 mt-1">Compliance Default</div>
                </CardContent>
            </Card>
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4 text-center">
                    <div className="text-xs text-slate-500 uppercase mb-2">Cold Storage</div>
                    <div className="text-3xl font-bold text-white">1.2 PB</div>
                    <div className="text-[10px] text-slate-400 mt-1">Archived Data <Archive className="inline w-3 h-3"/></div>
                </CardContent>
            </Card>
            <Card className="bg-slate-950 border-slate-800">
                <CardContent className="p-4 text-center">
                    <div className="text-xs text-slate-500 uppercase mb-2">Purged (30d)</div>
                    <div className="text-3xl font-bold text-white">45 TB</div>
                    <div className="text-[10px] text-slate-400 mt-1">Securely Deleted <Trash2 className="inline w-3 h-3"/></div>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default DataGovernance;