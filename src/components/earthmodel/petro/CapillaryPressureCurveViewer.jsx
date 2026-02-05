import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useResizeDetector } from 'react-resize-detector';

const CapillaryPressureCurveViewer = () => {
  const { width, ref } = useResizeDetector();
  const [entryPressure, setEntryPressure] = useState(2);
  const [lambda, setLambda] = useState(1.5);

  // Brooks-Corey Model: Sw = (Pd / Pc) ^ lambda
  // Inverted: Pc = Pd * (Sw) ^ (-1/lambda)  (simplified for viewer)
  const swPoints = Array.from({length: 50}, (_, i) => 0.01 + (i/50) * 0.99);
  const pcPoints = swPoints.map(sw => {
    // Simplified effective saturation calc
    const swe = (sw - 0.1) / (1 - 0.1); 
    if (swe <= 0) return 1000; 
    return entryPressure * Math.pow(swe, -1/lambda);
  }).map(p => Math.min(p, 1000)); // Clamp max Pc

  return (
    <Card className="h-full bg-slate-900 border-slate-800" ref={ref}>
      <CardHeader className="py-3">
        <CardTitle className="text-sm text-white">Capillary Pressure (Brooks-Corey)</CardTitle>
      </CardHeader>
      <CardContent className="h-full flex flex-col gap-4">
        <div className="flex-1 min-h-[250px]">
          <Plot
            data={[
              {
                x: swPoints,
                y: pcPoints,
                type: 'scatter',
                mode: 'lines',
                line: { color: '#ec4899', width: 3 },
                name: 'Drainage'
              }
            ]}
            layout={{
              width: width || 400,
              height: 250,
              margin: { t: 10, r: 10, b: 40, l: 50 },
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)',
              font: { color: '#94a3b8' },
              xaxis: { title: 'Water Saturation (Sw)', range: [0, 1], gridcolor: '#1e293b' },
              yaxis: { title: 'Capillary Pressure (psi)', type: 'log', range: [0, 3], gridcolor: '#1e293b' },
              showlegend: true,
              legend: { x: 0.7, y: 0.9 }
            }}
            config={{ responsive: true, displayModeBar: false }}
            className="w-full h-full"
          />
        </div>
        
        <div className="space-y-4 bg-slate-950 p-3 rounded border border-slate-800">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-slate-400">Entry Pressure (Pd)</Label>
              <span className="text-xs font-mono text-slate-200">{entryPressure} psi</span>
            </div>
            <Slider value={[entryPressure]} min={0.5} max={10} step={0.1} onValueChange={([v]) => setEntryPressure(v)} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-slate-400">Pore Size Dist. (Lambda)</Label>
              <span className="text-xs font-mono text-slate-200">{lambda}</span>
            </div>
            <Slider value={[lambda]} min={0.5} max={5} step={0.1} onValueChange={([v]) => setLambda(v)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapillaryPressureCurveViewer;