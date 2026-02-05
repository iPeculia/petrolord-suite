import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ResultsViewer = ({ results }) => {
    return (
        <div className="h-full p-4 overflow-y-auto">
            <Card className="h-full bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle>Tabular Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-400">Calculation results will be displayed in a table here.</p>
                    {/* Placeholder for table */}
                </CardContent>
            </Card>
        </div>
    );
};

export default ResultsViewer;