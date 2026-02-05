import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { supabase } from '@/lib/customSupabaseClient';
import { format } from 'date-fns';

const ProgressAnalytics = ({ projectId, updates }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (updates && updates.length > 0) {
        // Transform updates for charts, sorting by date
        const data = [...updates]
            .sort((a, b) => new Date(a.report_date) - new Date(b.report_date))
            .map(u => ({
                date: format(new Date(u.report_date), 'MMM dd'),
                percent: u.percent_complete,
                spi: u.spi,
                cpi: u.cpi,
                ev: u.earned_value || 0,
                pv: u.planned_value || 0,
                ac: u.actual_cost || 0
            }));
        setChartData(data);
    }
  }, [updates]);

  if (!updates || updates.length === 0) {
      return (
          <div className="flex items-center justify-center h-64 border border-dashed border-slate-700 rounded-lg bg-slate-900/50 text-slate-500">
            No progress history available. Submit your first weekly update to see trends.
          </div>
      );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Progress Burn-up Chart */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-300">Progress Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                    <Legend />
                    <Line type="monotone" dataKey="percent" name="% Complete" stroke="#84cc16" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* EVM Trends (Earned Value vs Planned Value) */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-300">Earned Value Analysis</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                    <Legend />
                    <Line type="monotone" dataKey="ev" name="Earned Value (EV)" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="pv" name="Planned Value (PV)" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                    <Line type="monotone" dataKey="ac" name="Actual Cost (AC)" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Indices */}
       <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-300">Performance Efficiency (SPI & CPI)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="spi" name="Schedule (SPI)" fill="#3b82f6" />
                    <Bar dataKey="cpi" name="Cost (CPI)" fill="#a855f7" />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* History Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-300">Update History</CardTitle>
        </CardHeader>
        <CardContent className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs text-slate-500 uppercase bg-slate-950 sticky top-0">
                    <tr>
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">%</th>
                        <th className="px-4 py-2">Narrative</th>
                    </tr>
                </thead>
                <tbody>
                    {updates.slice().reverse().map((u, i) => (
                        <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50">
                            <td className="px-4 py-2 font-mono">{format(new Date(u.report_date), 'MMM dd')}</td>
                            <td className="px-4 py-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    u.status === 'Green' ? 'bg-green-900/30 text-green-400' :
                                    u.status === 'Amber' ? 'bg-amber-900/30 text-amber-400' : 'bg-red-900/30 text-red-400'
                                }`}>{u.status}</span>
                            </td>
                            <td className="px-4 py-2">{u.percent_complete}%</td>
                            <td className="px-4 py-2 truncate max-w-[200px]" title={u.narrative}>{u.narrative}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressAnalytics;