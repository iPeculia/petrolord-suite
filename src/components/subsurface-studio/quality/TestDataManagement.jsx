import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Database } from 'lucide-react';

const TestDataManagement = () => (
    <div className="h-full p-1 space-y-4">
        <h3 className="text-lg font-bold text-slate-200 flex items-center">
            <Database className="w-5 h-5 mr-2 text-indigo-400" /> Test Data Fixtures
        </h3>
        <Card className="bg-slate-950 border-slate-800">
            <CardContent className="p-4 space-y-2">
                {['Seismic Volume (Small)', 'Well Logs (Golden Set)', 'Fault Network (Complex)'].map((item, i) => (
                    <div key={i} className="p-2 bg-slate-900 rounded border border-slate-800 flex justify-between">
                        <span className="text-sm text-slate-300">{item}</span>
                        <span className="text-xs text-slate-500">Loaded</span>
                    </div>
                ))}
            </CardContent>
        </Card>
    </div>
);

export default TestDataManagement;