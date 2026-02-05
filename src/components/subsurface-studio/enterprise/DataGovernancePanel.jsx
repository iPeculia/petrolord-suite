import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Archive, Database, ShieldAlert } from 'lucide-react';

const DataGovernancePanel = () => {
    return (
        <div className="space-y-6 h-full overflow-y-auto p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center text-slate-200 text-sm">
                            <Archive className="w-4 h-4 mr-2 text-orange-400" /> Data Retention Policies
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <Label>Raw Seismic Data</Label>
                                <span>10 Years</span>
                            </div>
                            <Slider defaultValue={[10]} max={20} step={1} className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <Label>Interpretation Projects</Label>
                                <span>Indefinite</span>
                            </div>
                            <Slider defaultValue={[100]} max={100} disabled className="w-full opacity-50" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-400">
                                <Label>User Audit Logs</Label>
                                <span>365 Days</span>
                            </div>
                            <Slider defaultValue={[365]} max={730} step={30} className="w-full" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="flex items-center text-slate-200 text-sm">
                            <ShieldAlert className="w-4 h-4 mr-2 text-red-400" /> Classification Rules
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-3 bg-red-950/20 border border-red-900/50 rounded">
                            <div className="text-xs font-bold text-red-400 mb-1">Strict Confidential</div>
                            <p className="text-[10px] text-slate-400">Files tagged 'Confidential' or 'Exploration' are restricted to Project Managers and above. External sharing disabled.</p>
                        </div>
                        <div className="p-3 bg-blue-950/20 border border-blue-900/50 rounded">
                            <div className="text-xs font-bold text-blue-400 mb-1">Internal Use</div>
                            <p className="text-[10px] text-slate-400">Default classification for all new well logs. Accessible to all org members.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DataGovernancePanel;