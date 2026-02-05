import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ComplianceDocumentation = () => {
    const docs = [
        'Information Security Policy v4.2',
        'Data Handling Procedures',
        'Incident Response Plan',
        'Employee Acceptable Use Policy'
    ];

    return (
        <div className="space-y-4 h-full p-1">
            <Card className="bg-slate-950 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center text-slate-200"><FileText className="w-4 h-4 mr-2 text-slate-400"/> Policy Library</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {docs.map((doc, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800">
                                <span className="text-xs text-slate-300">{doc}</span>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-500 hover:text-slate-200">
                                    <Download className="w-3 h-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ComplianceDocumentation;