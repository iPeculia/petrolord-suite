import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, Key, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdvancedEncryption = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-yellow-400" /> Encryption Keys (KMS)
                </h3>
                <Button size="sm" variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Rotate Keys</Button>
            </div>
            <div className="space-y-3">
                {[
                    { id: 'key-db-prod-001', type: 'AES-256', status: 'Active', age: '45 days' },
                    { id: 'key-storage-prod-002', type: 'AES-256', status: 'Active', age: '12 days' },
                    { id: 'key-logs-prod-003', type: 'RSA-4096', status: 'Active', age: '88 days' },
                ].map((key, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800">
                        <div className="flex items-center gap-3">
                            <Key className="w-4 h-4 text-slate-500" />
                            <div>
                                <div className="text-xs font-mono text-slate-300">{key.id}</div>
                                <div className="text-[10px] text-slate-500">{key.type}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-green-400 font-bold">{key.status}</div>
                            <div className="text-[10px] text-slate-500">Age: {key.age}</div>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
);

export default AdvancedEncryption;