import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Shield, Lock, Globe, AlertOctagon } from 'lucide-react';

const SecurityHardening = () => {
    return (
        <div className="h-full p-1 space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-400" /> Security Posture
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-300 flex items-center">
                            <Globe className="w-4 h-4 mr-2" /> Content Security Policy (CSP)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-400">Block Inline Scripts</div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-400">Restrict Object Sources</div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-400">Upgrade Insecure Requests</div>
                            <Switch defaultChecked />
                        </div>
                        <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[10px] font-mono text-slate-500 break-all">
                            default-src 'self'; script-src 'self' https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:;
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-950 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-300 flex items-center">
                            <Lock className="w-4 h-4 mr-2" /> Transport Security
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-400">Strict-Transport-Security (HSTS)</div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-green-400">Max-Age: 1 Year</span>
                                <Switch defaultChecked />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-400">X-Frame-Options</div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-yellow-400">DENY</span>
                                <Switch defaultChecked />
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-xs text-slate-400">X-Content-Type-Options</div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-green-400">nosniff</span>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SecurityHardening;