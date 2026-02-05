import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, RefreshCw, Server } from 'lucide-react';

const DataEncryption = () => {
    return (
        <div className="space-y-6 h-full p-1">
            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-lg text-slate-200 flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-emerald-400" /> Encryption Status
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center text-center">
                            <Server className="w-8 h-8 text-slate-500 mb-2" />
                            <div className="text-sm font-bold text-slate-200">Data at Rest</div>
                            <div className="text-xs text-emerald-400 mt-1">AES-256 (Active)</div>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center text-center">
                            <RefreshCw className="w-8 h-8 text-slate-500 mb-2" />
                            <div className="text-sm font-bold text-slate-200">Data in Transit</div>
                            <div className="text-xs text-emerald-400 mt-1">TLS 1.3 (Enforced)</div>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col items-center text-center">
                            <Lock className="w-8 h-8 text-slate-500 mb-2" />
                            <div className="text-sm font-bold text-slate-200">Key Management</div>
                            <div className="text-xs text-emerald-400 mt-1">AWS KMS / HSM</div>
                        </div>
                    </div>

                    <div className="bg-yellow-900/10 border border-yellow-900/30 p-4 rounded-lg flex justify-between items-center">
                        <div>
                            <h4 className="text-sm font-bold text-yellow-500">Master Key Rotation</h4>
                            <p className="text-xs text-slate-400">Last rotation: 145 days ago. Recommended every 90 days.</p>
                        </div>
                        <Button size="sm" variant="secondary" className="bg-yellow-900/20 text-yellow-500 hover:bg-yellow-900/40 border-yellow-900/50">Rotate Keys Now</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DataEncryption;