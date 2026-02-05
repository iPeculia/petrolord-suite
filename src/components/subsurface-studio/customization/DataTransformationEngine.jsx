import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, PlayCircle } from 'lucide-react';

const DataTransformationEngine = () => {
    return (
        <div className="h-full p-1 space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-200 flex items-center">
                    <ArrowRightLeft className="w-5 h-5 mr-2 text-indigo-400" /> ETL & Transformation
                </h3>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-xs">
                    <PlayCircle className="w-4 h-4 mr-2" /> New Pipeline
                </Button>
            </div>
            <div className="grid grid-cols-1 gap-3">
                {[
                    { name: 'LAS to JSON Normalizer', source: 'S3 Bucket', target: 'PostgreSQL', lastRun: 'Success (5m ago)' },
                    { name: 'Seismic Header Scraper', source: 'SEG-Y', target: 'Metadata Index', lastRun: 'Running...' },
                    { name: 'Production Daily Rollup', source: 'SCADA API', target: 'Dashboard DB', lastRun: 'Failed (1h ago)' }
                ].map((job, i) => (
                    <Card key={i} className="bg-slate-950 border-slate-800">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div>
                                <div className="font-bold text-slate-200 text-sm">{job.name}</div>
                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                    <span>{job.source}</span>
                                    <ArrowRightLeft className="w-3 h-3" />
                                    <span>{job.target}</span>
                                </div>
                            </div>
                            <div className={`text-xs px-2 py-1 rounded ${
                                job.lastRun.includes('Success') ? 'bg-green-900/20 text-green-400' : 
                                job.lastRun.includes('Running') ? 'bg-blue-900/20 text-blue-400' : 
                                'bg-red-900/20 text-red-400'
                            }`}>
                                {job.lastRun}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default DataTransformationEngine;