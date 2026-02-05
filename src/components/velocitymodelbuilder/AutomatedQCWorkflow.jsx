import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const AutomatedQCWorkflow = () => {
  const checks = [
    { id: 1, name: 'Velocity Inversions', status: 'pass', msg: 'No physical inversions detected.' },
    { id: 2, name: 'Well Top Misfits', status: 'warn', msg: 'Well-04 has 12m residual > tolerance.' },
    { id: 3, name: 'Gradient Consistency', status: 'pass', msg: 'All gradients within regional bounds.' },
    { id: 4, name: 'Water Velocity Check', status: 'fail', msg: 'Vw inconsistent in 2 blocks.' },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader className="pb-3 border-b border-slate-800">
        <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-400" /> Automated QC
            </CardTitle>
            <span className="text-xs font-mono text-slate-500">Score: 85/100</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
                <span>QC Progress</span>
                <span>Completed</span>
            </div>
            <Progress value={100} className="h-1.5 bg-slate-800" indicatorClassName="bg-emerald-500" />
        </div>

        <div className="space-y-2">
            {checks.map(check => (
                <div key={check.id} className="flex items-start gap-3 p-2 rounded hover:bg-slate-800/50 transition-colors">
                    <div className="mt-0.5">
                        {check.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {check.status === 'warn' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                        {check.status === 'fail' && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="flex-1">
                        <h5 className={`text-xs font-medium ${
                            check.status === 'pass' ? 'text-slate-300' : 
                            check.status === 'warn' ? 'text-yellow-200' : 'text-red-200'
                        }`}>
                            {check.name}
                        </h5>
                        <p className="text-[10px] text-slate-500">{check.msg}</p>
                    </div>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AutomatedQCWorkflow;