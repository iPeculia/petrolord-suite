import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertCircle, CheckCircle2, TrendingDown, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const data = [
  { range: '-50 to -40', count: 2 },
  { range: '-40 to -30', count: 5 },
  { range: '-30 to -20', count: 12 },
  { range: '-20 to -10', count: 25 },
  { range: '-10 to 0', count: 45 },
  { range: '0 to 10', count: 42 },
  { range: '10 to 20', count: 28 },
  { range: '20 to 30', count: 15 },
  { range: '30 to 40', count: 6 },
  { range: '40 to 50', count: 3 },
];

const outliers = [
  { id: 1, well: 'Well-04', depth: 2450, residual: 145, status: 'Critical' },
  { id: 2, well: 'Well-09', depth: 3100, residual: -89, status: 'Warning' },
  { id: 3, well: 'Well-12', depth: 1850, residual: 56, status: 'Warning' },
];

const MisfitAnalysisDashboard = () => {
  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Global RMS Error</p>
              <h3 className="text-2xl font-bold text-white">12.4 m</h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-full">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Mean Residual</p>
              <h3 className="text-2xl font-bold text-white">-1.2 m</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-full">
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Std Deviation</p>
              <h3 className="text-2xl font-bold text-white">8.5 m</h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-full">
              <TrendingDown className="w-5 h-5 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Outliers Detected</p>
              <h3 className="text-2xl font-bold text-red-400">3</h3>
            </div>
            <div className="p-2 bg-red-500/10 rounded-full">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2 flex flex-col">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-slate-200">Residual Distribution (Histogram)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="range" stroke="#94a3b8" tick={{fontSize: 10}} />
                <YAxis stroke="#94a3b8" tick={{fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  cursor={{ fill: '#334155', opacity: 0.4 }}
                />
                <ReferenceLine x="0 to 10" stroke="#ef4444" label="Bias" />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" /> Outlier Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
             <table className="w-full text-left text-xs">
               <thead className="bg-slate-950 text-slate-400 sticky top-0">
                 <tr>
                   <th className="p-3">Well</th>
                   <th className="p-3">Depth</th>
                   <th className="p-3">Resid (m)</th>
                   <th className="p-3">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-800">
                 {outliers.map((outlier) => (
                   <tr key={outlier.id} className="hover:bg-slate-800/50">
                     <td className="p-3 font-medium text-slate-300">{outlier.well}</td>
                     <td className="p-3 text-slate-400">{outlier.depth}m</td>
                     <td className="p-3 text-red-400 font-bold">{outlier.residual > 0 ? '+' : ''}{outlier.residual}</td>
                     <td className="p-3">
                       <Badge variant="outline" className={
                         outlier.status === 'Critical' ? 'text-red-400 border-red-900 bg-red-900/10' : 'text-yellow-400 border-yellow-900 bg-yellow-900/10'
                       }>
                         {outlier.status}
                       </Badge>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MisfitAnalysisDashboard;