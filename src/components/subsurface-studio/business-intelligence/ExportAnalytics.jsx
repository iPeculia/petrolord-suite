import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Download } from 'lucide-react';

const ExportAnalytics = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Download className="w-12 h-12 mx-auto text-slate-600 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Data Export Hub</h3>
            <p className="text-sm text-slate-500 mt-2">Schedule automated exports to S3 or download snapshots.</p>
        </CardContent>
    </Card>
);
export default ExportAnalytics;