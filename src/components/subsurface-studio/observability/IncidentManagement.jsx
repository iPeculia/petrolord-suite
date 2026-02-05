import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldAlert, Clock } from 'lucide-react';

const IncidentManagement = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <ShieldAlert className="w-5 h-5 mr-2 text-red-400" /> Incident Response
        </h3>
        <div className="grid grid-cols-3 gap-4">
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-3">
                    <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Open</div>
                    <div className="p-3 bg-red-900/20 border border-red-900/50 rounded mb-2">
                        <div className="text-sm font-bold text-white">INC-234: Search Outage</div>
                        <div className="text-[10px] text-red-400 mt-1 flex items-center"><Clock className="w-3 h-3 mr-1" /> 45m elapsed</div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-3">
                    <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Investigating</div>
                    <div className="p-3 bg-yellow-900/20 border border-yellow-900/50 rounded mb-2">
                        <div className="text-sm font-bold text-white">INC-233: Slow Exports</div>
                        <div className="text-[10px] text-yellow-400 mt-1">Assigned: John D.</div>
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-3">
                    <div className="text-xs font-bold text-slate-400 mb-2 uppercase">Resolved</div>
                    <div className="p-3 bg-green-900/20 border border-green-900/50 rounded mb-2 opacity-60">
                        <div className="text-sm font-bold text-white">INC-232: Login Failure</div>
                        <div className="text-[10px] text-green-400 mt-1">Fixed in 12m</div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
);

export default IncidentManagement;