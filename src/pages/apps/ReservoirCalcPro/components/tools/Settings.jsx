import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const Settings = () => {
    return (
        <div className="max-w-4xl mx-auto w-full space-y-6">
             <h2 className="text-2xl font-bold text-white">Settings</h2>
             
             <Card className="bg-slate-900 border-slate-800">
                <CardHeader><CardTitle className="text-white text-base">General</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Default Unit System</Label>
                        <Select defaultValue="field">
                            <SelectTrigger className="w-[180px] bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="field">Field (Oilfield)</SelectItem>
                                <SelectItem value="metric">Metric (SI)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Theme Mode</Label>
                        <Select defaultValue="dark">
                            <SelectTrigger className="w-[180px] bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="dark">Dark (Default)</SelectItem>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
             </Card>

             <Card className="bg-slate-900 border-slate-800">
                <CardHeader><CardTitle className="text-white text-base">Calculations</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-slate-300">Auto-save Projects</Label>
                            <p className="text-xs text-slate-500">Automatically save project after run</p>
                        </div>
                        <Switch checked={true} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-slate-300">Advanced Validation</Label>
                            <p className="text-xs text-slate-500">Perform extra sanity checks on inputs</p>
                        </div>
                        <Switch checked={false} />
                    </div>
                </CardContent>
             </Card>

             <div className="flex justify-end">
                <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
             </div>
        </div>
    );
};

export default Settings;