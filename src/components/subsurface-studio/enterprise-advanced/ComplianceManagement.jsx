import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, FileCheck } from 'lucide-react';

const ComplianceManagement = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <ShieldCheck className="w-5 h-5 mr-2 text-green-400" /> Compliance Status
        </h3>
        <div className="grid grid-cols-2 gap-4">
            {['SOC 2 Type II', 'GDPR', 'ISO 27001', 'HIPAA'].map((std, i) => (
                <Card key={i} className="bg-slate-950 border-slate-800">
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="font-bold text-slate-200 flex items-center">
                                <FileCheck className="w-4 h-4 mr-2 text-slate-500" /> {std}
                            </div>
                            <span className="text-xs text-green-400">Compliant</span>
                        </div>
                        <Progress value={90 + Math.random() * 10} className="h-2" />
                        <div className="mt-2 text-[10px] text-slate-500 flex justify-between">
                            <span>Last Audit: 2 months ago</span>
                            <span>Controls: 142/142</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
);

export default ComplianceManagement;