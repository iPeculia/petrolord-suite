import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Filter, RefreshCw } from 'lucide-react';

const DataPreprocessing = () => (
    <Card className="bg-slate-950 border-slate-800 m-1">
        <CardContent className="p-6 text-center">
            <Filter className="w-12 h-12 mx-auto text-orange-400 mb-4" />
            <h3 className="text-lg font-bold text-slate-200">Data Pipeline</h3>
            <p className="text-sm text-slate-500 mt-2">ETL jobs for cleaning and normalization.</p>
            <div className="mt-4 flex justify-center gap-4 text-xs text-slate-400">
                <div className="flex items-center"><RefreshCw className="w-3 h-3 mr-1 animate-spin"/> Null Imputation</div>
                <div>•</div>
                <div>Outlier Removal</div>
                <div>•</div>
                <div>Scaling</div>
            </div>
        </CardContent>
    </Card>
);

export default DataPreprocessing;