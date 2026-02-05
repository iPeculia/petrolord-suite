import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';

const ContactHistoryPlot = () => {
  const { contactObservations, reservoirMetadata } = useMaterialBalance();

  const chartData = React.useMemo(() => {
    if (!contactObservations.dates) return [];
    return contactObservations.dates.map((date, i) => ({
      date,
      GOC: contactObservations.measuredGOC[i],
      OWC: contactObservations.measuredOWC[i],
      method: contactObservations.method[i]
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [contactObservations]);

  if (chartData.length === 0) {
    return null; // Don't show if no data
  }

  return (
    <Card className="bg-slate-900 border-slate-800 h-64 flex flex-col mt-4">
      <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
        <CardTitle className="text-xs font-bold text-slate-300 uppercase">Fluid Contact History</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-2 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" />
            <YAxis reversed tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Depth (ft)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} domain={['dataMin - 100', 'dataMax + 100']} />
            <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9'}} />
            <Legend verticalAlign="top" height={36} iconSize={8} />
            {/* Initial Contacts Reference Lines could be added here using ReferenceLine */}
            <Line type="monotone" dataKey="GOC" stroke="#ef4444" strokeDasharray="5 5" dot={{r: 4, fill: '#ef4444'}} />
            <Line type="monotone" dataKey="OWC" stroke="#3b82f6" strokeDasharray="5 5" dot={{r: 4, fill: '#3b82f6'}} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ContactHistoryPlot;