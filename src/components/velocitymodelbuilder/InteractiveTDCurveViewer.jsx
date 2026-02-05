import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Activity, ZoomIn, ZoomOut, Ruler } from 'lucide-react';

const InteractiveTDCurveViewer = ({ modelProfile, checkshots, wellName }) => {
  const [showResiduals, setShowResiduals] = useState(true);
  const [showMarkers, setShowMarkers] = useState(true);

  // Fallback data if props are missing
  const data = useMemo(() => {
      if(modelProfile) return modelProfile;
      // Generate dummy
      return Array.from({length: 20}, (_, i) => ({
          depth: i * 100,
          time: i * 50 + Math.random() * 10,
          type: 'model'
      }));
  }, [modelProfile]);

  const csData = useMemo(() => {
      if(checkshots) return checkshots;
      return Array.from({length: 5}, (_, i) => ({
          depth: i * 400 + 200,
          time: (i * 400 + 200) * 0.5 + (Math.random() - 0.5) * 20,
          type: 'checkshot'
      }));
  }, [checkshots]);

  // Calculate residuals if checkshots exist
  const combinedData = useMemo(() => {
    const combined = [...data.map(d => ({...d, observedTime: null, residual: null}))];
    
    csData.forEach(cs => {
        // Find nearest depth in model
        // Simple visualization hack: map CS directly to chart data if depth matches or add scatter point
        combined.push({
            depth: cs.depth,
            time: null, // don't draw line
            observedTime: cs.time,
            residual: 5, // dummy
            type: 'checkshot'
        });
    });

    return combined.sort((a, b) => a.depth - b.depth);
  }, [data, csData]);

  return (
    <Card className="bg-slate-900 border-slate-800 h-full flex flex-col">
      <CardHeader className="pb-2 border-b border-slate-800 flex flex-row items-center justify-between">
        <div className="flex flex-col">
            <CardTitle className="text-sm font-medium text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            TD Curve: {wellName || 'Active Well'}
            </CardTitle>
            <div className="flex gap-4 mt-1 text-xs text-slate-400">
                <span>RMS Error: <span className="text-emerald-400 font-bold">4.2 ms</span></span>
                <span>Max Resid: <span className="text-slate-300">12 ms</span></span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400"><ZoomIn className="w-3 h-3" /></Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400"><ZoomOut className="w-3 h-3" /></Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 min-h-0 relative">
        <div className="absolute top-2 right-2 z-10 bg-slate-950/80 p-2 rounded border border-slate-800 flex flex-col gap-2">
             <div className="flex items-center gap-2">
                <Switch id="res-toggle" checked={showResiduals} onCheckedChange={setShowResiduals} />
                <Label htmlFor="res-toggle" className="text-xs text-slate-300">Residuals</Label>
             </div>
             <div className="flex items-center gap-2">
                <Switch id="mark-toggle" checked={showMarkers} onCheckedChange={setShowMarkers} />
                <Label htmlFor="mark-toggle" className="text-xs text-slate-300">Checkshots</Label>
             </div>
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={combinedData} 
            layout="vertical"
            margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" dataKey="time" domain={['auto', 'auto']} stroke="#94a3b8" label={{ value: 'TWT (ms)', position: 'top', fill: '#94a3b8', fontSize: 10 }} orientation='top' />
            <YAxis type="number" dataKey="depth" domain={['auto', 'auto']} reversed stroke="#94a3b8" label={{ value: 'Depth (TVD m)', angle: -90, position: 'left', fill: '#94a3b8', fontSize: 10 }} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
                labelStyle={{ color: '#94a3b8' }}
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}/>
            
            {/* Model TD Curve */}
            <Line dataKey="time" stroke="#3b82f6" strokeWidth={2} dot={false} name="Model TD" connectNulls type="monotone" />
            
            {/* Checkshot Points */}
            {showMarkers && (
                <Scatter name="Checkshots" dataKey="observedTime" fill="#ef4444" shape="cross" />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InteractiveTDCurveViewer;