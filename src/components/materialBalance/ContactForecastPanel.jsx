import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';

const ContactForecastPanel = () => {
  const { contactForecast, reservoirMetadata } = useMaterialBalance();

  // Combine historical and forecast data if available
  const chartData = contactForecast || [];

  if (chartData.length === 0) {
    return (
      <Card className="bg-slate-900 border-slate-800 h-full flex flex-col justify-center items-center text-slate-500 text-xs p-4">
        No contact forecast generated yet. Run a forecast in the Scenarios tab.
      </Card>
    );
  }

  const grossTop = 0; // Relative depth
  const grossBottom = reservoirMetadata.thickness || 100;

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="p-3 border-b border-slate-800 bg-slate-900/50">
        <CardTitle className="text-xs font-bold text-slate-300 uppercase">Fluid Contacts Forecast</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-2 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="date" tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" minTickGap={30} />
            {/* Reversed Y axis for depth */}
            <YAxis reversed tick={{fill: '#94a3b8', fontSize: 10}} stroke="#475569" label={{ value: 'Depth (ft)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }} domain={['dataMin - 50', 'dataMax + 50']} />
            <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f1f5f9', fontSize: '11px'}} />
            <Legend verticalAlign="top" height={36} iconSize={8} />
            
            <ReferenceLine y={reservoirMetadata.GOC0} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Init GOC', fill: '#ef4444', fontSize: 9, position: 'right' }} />
            <ReferenceLine y={reservoirMetadata.OWC0} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: 'Init OWC', fill: '#3b82f6', fontSize: 9, position: 'right' }} />

            <Line type="monotone" dataKey="GOC" stroke="#ef4444" strokeWidth={2} dot={false} name="GOC" />
            <Line type="monotone" dataKey="OWC" stroke="#3b82f6" strokeWidth={2} dot={false} name="OWC" />
            
            {/* Shade zones if needed, but LineChart doesn't support Area easily without ComposedChart. 
                Using Lines is sufficient for Phase 4. */}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ContactForecastPanel;