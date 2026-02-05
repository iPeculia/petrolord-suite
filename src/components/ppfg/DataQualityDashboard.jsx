import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { generateValidationReport } from '@/utils/dataValidation';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const DataQualityDashboard = ({ data, mapping }) => {
  
  const report = useMemo(() => generateValidationReport(data, mapping), [data, mapping]);
  
  const getScoreColor = (status) => {
      if (status === 'Good') return 'text-emerald-500';
      if (status === 'Warning') return 'text-yellow-500';
      return 'text-red-500';
  };

  const getIcon = (status) => {
      if (status === 'Good') return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      if (status === 'Warning') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="p-6 h-full overflow-hidden flex flex-col">
        <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-100">Data Quality Control</h3>
            <p className="text-sm text-slate-400">Automated health check of imported log curves.</p>
        </div>

        <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(report).map(([curve, result]) => (
                    <Card key={curve} className="bg-slate-900 border-slate-800">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-bold text-slate-200">{curve}</CardTitle>
                            {getIcon(result.status)}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs text-slate-400 mb-1">
                                    <span>Completeness</span>
                                    <span>{((result.stats.count / (result.stats.count + result.stats.missing)) * 100).toFixed(1)}%</span>
                                </div>
                                <Progress value={(result.stats.count / (result.stats.count + result.stats.missing)) * 100} className="h-1" />
                                
                                <div className="grid grid-cols-2 gap-2 text-xs mt-4">
                                    <div className="bg-slate-950 p-2 rounded">
                                        <span className="text-slate-500">Min:</span> <span className="text-slate-200 font-mono ml-2">{result.stats.min?.toFixed(2)}</span>
                                    </div>
                                    <div className="bg-slate-950 p-2 rounded">
                                        <span className="text-slate-500">Max:</span> <span className="text-slate-200 font-mono ml-2">{result.stats.max?.toFixed(2)}</span>
                                    </div>
                                    <div className="bg-slate-950 p-2 rounded">
                                        <span className="text-slate-500">Mean:</span> <span className="text-slate-200 font-mono ml-2">{result.stats.mean?.toFixed(2)}</span>
                                    </div>
                                    <div className="bg-slate-950 p-2 rounded">
                                        <span className="text-slate-500">Std:</span> <span className="text-slate-200 font-mono ml-2">{result.stats.std?.toFixed(2)}</span>
                                    </div>
                                </div>

                                {result.issues.length > 0 && (
                                    <div className="mt-4 p-3 bg-red-950/20 border border-red-900/50 rounded text-xs text-red-300">
                                        <ul className="list-disc list-inside space-y-1">
                                            {result.issues.map((issue, i) => <li key={i}>{issue}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    </div>
  );
};

export default DataQualityDashboard;