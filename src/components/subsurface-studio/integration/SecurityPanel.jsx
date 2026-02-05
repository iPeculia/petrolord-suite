import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Lock } from 'lucide-react';

const SecurityPanel = () => {
    return (
        <Card className="bg-slate-900 border-slate-800 h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center text-slate-200">
                    <Shield className="w-4 h-4 mr-2 text-emerald-400" /> Security & Access
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-xs text-slate-200">Project Encryption</Label>
                        <div className="text-[10px] text-slate-500">Encrypt data at rest</div>
                    </div>
                    <Switch checked={true} className="scale-75" disabled />
                </div>
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-xs text-slate-200">Audit Logging</Label>
                        <div className="text-[10px] text-slate-500">Track all changes</div>
                    </div>
                    <Switch checked={true} className="scale-75 data-[state=checked]:bg-emerald-500" />
                </div>
                 <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-xs text-slate-200">Read-Only Mode</Label>
                        <div className="text-[10px] text-slate-500">Prevent accidental edits</div>
                    </div>
                    <Switch className="scale-75" />
                </div>
                
                <div className="p-2 bg-slate-950/50 border border-slate-800 rounded flex items-center gap-2 text-xs text-slate-400">
                    <Lock className="w-3 h-3" />
                    Your access level: <span className="text-emerald-400 font-bold">Owner</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default SecurityPanel;