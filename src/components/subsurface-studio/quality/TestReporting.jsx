import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileBarChart } from 'lucide-react';

const TestReporting = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <FileBarChart className="w-5 h-5 mr-2 text-teal-400" /> QA Reports
        </h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-4">
                <p className="text-sm text-slate-400 mb-4">Download consolidated PDF reports for compliance.</p>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded mb-2 text-xs text-slate-200 cursor-pointer hover:bg-slate-800">
                    QA_Release_Candidate_v1.0.pdf
                </div>
            </CardContent>
        </Card>
    </div>
);

export default TestReporting;