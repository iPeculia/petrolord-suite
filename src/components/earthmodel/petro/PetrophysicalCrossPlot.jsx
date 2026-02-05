import React from 'react';
import Plot from 'react-plotly.js';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useResizeDetector } from 'react-resize-detector';

const PetrophysicalCrossPlot = () => {
  const { width, ref } = useResizeDetector();

  // Mock data
  const xData = Array.from({length: 50}, () => Math.random() * 0.3); // Porosity
  const yData = xData.map(x => Math.pow(10, (x * 10) + Math.random())); // Permeability (log-linear relationshipish)
  const colorData = xData.map(x => x > 0.15 ? 1 : 2); // Facies code

  return (
    <Card className="h-full bg-slate-900 border-slate-800 flex flex-col" ref={ref}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white text-sm">Cross-Plot Analysis</CardTitle>
        <div className="flex gap-2">
          <Select defaultValue="phi">
            <SelectTrigger className="w-[100px] h-8 text-xs bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="phi">Porosity</SelectItem>
              <SelectItem value="den">Density</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-slate-500 self-center">vs</span>
          <Select defaultValue="perm">
            <SelectTrigger className="w-[100px] h-8 text-xs bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="perm">Permeability</SelectItem>
              <SelectItem value="sw">Saturation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <Plot
          data={[
            {
              x: xData,
              y: yData,
              mode: 'markers',
              type: 'scatter',
              marker: {
                color: colorData,
                colorscale: 'Viridis',
                size: 8,
                line: { color: 'white', width: 0.5 }
              },
              text: colorData.map(c => `Facies ${c}`),
            }
          ]}
          layout={{
            width: width || 400,
            height: 350,
            margin: { t: 10, r: 10, b: 40, l: 50 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#94a3b8' },
            xaxis: { title: 'Porosity (v/v)', gridcolor: '#1e293b', zerolinecolor: '#334155' },
            yaxis: { title: 'Permeability (mD)', type: 'log', gridcolor: '#1e293b', zerolinecolor: '#334155' },
            showlegend: false,
            hovermode: 'closest'
          }}
          config={{ responsive: true, displayModeBar: true, displaylogo: false }}
          className="w-full h-full"
        />
      </CardContent>
    </Card>
  );
};

export default PetrophysicalCrossPlot;