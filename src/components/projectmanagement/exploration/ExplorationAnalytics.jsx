import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Users, BarChart3, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

// --- KPI DASHBOARD ---
export const ExplorationKPIDashboard = ({ kpis }) => {
  // Mock data if no real KPIs
  const data = kpis || [
      { name: 'Seismic Quality', value: 85, target: 90 },
      { name: 'Model Accuracy', value: 78, target: 85 },
      { name: 'Schedule Adherence', value: 92, target: 100 },
      { name: 'Budget Adherence', value: 95, target: 100 },
  ];

  return (
    <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-sm text-slate-300 flex items-center gap-2"><BarChart3 className="w-4 h-4"/> Performance KPIs</CardTitle></CardHeader>
        <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{left: 20}}>
                    <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} />
                    <YAxis dataKey="name" type="category" width={100} stroke="#94a3b8" fontSize={10} />
                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', color: '#fff'}} />
                    <Bar dataKey="value" fill="#3b82f6" barSize={15} radius={[0, 4, 4, 0]} name="Actual" />
                    <Bar dataKey="target" fill="#64748b" barSize={5} radius={[0, 4, 4, 0]} name="Target" />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  );
};

// --- RISK MANAGER ---
export const ExplorationRiskManager = ({ risks }) => {
  const high = risks.filter(r => r.risk_score >= 15).length;
  const med = risks.filter(r => r.risk_score >= 8 && r.risk_score < 15).length;
  const low = risks.filter(r => r.risk_score < 8).length;

  const data = [
      { name: 'High', value: high, color: '#ef4444' },
      { name: 'Medium', value: med, color: '#f97316' },
      { name: 'Low', value: low, color: '#22c55e' }
  ];

  return (
    <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-sm text-slate-300 flex items-center gap-2"><AlertTriangle className="w-4 h-4"/> Risk Profile</CardTitle></CardHeader>
        <CardContent className="h-[250px] flex flex-col">
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{backgroundColor: '#1e293b', border: 'none', color: '#fff'}} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> High ({high})</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-500 rounded-full"></div> Med ({med})</span>
                <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Low ({low})</span>
            </div>
        </CardContent>
    </Card>
  );
};

// --- RESOURCE MANAGER ---
export const ExplorationResourceManager = ({ resources }) => {
  return (
    <Card className="bg-slate-900 border-slate-800">
        <CardHeader><CardTitle className="text-sm text-slate-300 flex items-center gap-2"><Users className="w-4 h-4"/> Team Structure</CardTitle></CardHeader>
        <CardContent>
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                {resources.map((res, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-slate-800/50 rounded border border-slate-700">
                        <div>
                            <div className="text-xs font-bold text-slate-200">{res.discipline}</div>
                            <div className="text-[10px] text-slate-500">{res.type}</div>
                        </div>
                        <div className="text-xs text-slate-400">{res.name.includes('TBD') ? 'Unfilled' : 'Assigned'}</div>
                    </div>
                ))}
                {resources.length === 0 && <div className="text-center text-slate-500 text-xs py-4">No resources defined.</div>}
            </div>
        </CardContent>
    </Card>
  );
};