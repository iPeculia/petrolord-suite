import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CustomReportBuilder = () => (
    <div className="h-full p-1 flex flex-col space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-200 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-cyan-400" /> Custom Reports
            </h3>
            <div className="flex gap-2">
                <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-2"/> Export</Button>
                <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700"><Plus className="w-4 h-4 mr-2"/> New Report</Button>
            </div>
        </div>
        <div className="flex-grow bg-slate-950 border border-slate-800 rounded-lg p-8 flex flex-col items-center justify-center text-slate-500 border-dashed">
            <FileText className="w-16 h-16 mb-4 text-slate-700" />
            <p>Drag and drop metrics here to build your report layout.</p>
            <Button variant="link" className="text-cyan-400">Browse Template Library</Button>
        </div>
    </div>
);

export default CustomReportBuilder;