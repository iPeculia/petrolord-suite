import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, FileCheck } from 'lucide-react';

const ComplianceManagement = () => {
    const frameworks = [
        { name: 'SOC 2 Type II', status: 'Compliant', score: 100, date: '2025-11-01' },
        { name: 'GDPR', status: 'Review Needed', score: 85, date: '2025-10-15' },
        { name: 'ISO 27001', status: 'Compliant', score: 98, date: '2025-09-20' },
        { name: 'HIPAA', status: 'Not Applicable', score: 0, date: '-' },
    ];

    return (
        <div className="space-y-4 h-full p-1">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <FileCheck className="w-5 h-5 mr-2 text-green-400" /> Compliance Dashboard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {frameworks.map(fw => (
                    <Card key={fw.name} className="bg-slate-950 border-slate-800">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-300 flex justify-between">
                                {fw.name}
                                {fw.status === 'Compliant' ? <CheckCircle className="w-4 h-4 text-green-500"/> : fw.status === 'Review Needed' ? <AlertTriangle className="w-4 h-4 text-yellow-500"/> : null}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-100 mb-2">{fw.score > 0 ? `${fw.score}%` : 'N/A'}</div>
                            <Progress value={fw.score} className="h-1.5 mb-2" />
                            <div className="text-[10px] text-slate-500">Last Audit: {fw.date}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ComplianceManagement;