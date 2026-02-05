import React from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResizeDetector } from 'react-resize-detector';

const TornadoChart = () => {
  const { width, ref } = useResizeDetector();

  const parameters = ['OWC Depth', 'Porosity', 'Net-to-Gross', 'Formation Vol Factor', 'Gas-Oil Ratio'];
  const lowValues = [-15, -12, -8, -5, -2]; // % change in STOIIP
  const highValues = [18, 14, 9, 6, 3];

  return (
    <Card className="h-full bg-slate-900 border-slate-800" ref={ref}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-200">Sensitivity Analysis (STOIIP Impact)</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-3rem)]">
        <Plot
          data={[
            {
              y: parameters,
              x: lowValues,
              type: 'bar',
              orientation: 'h',
              name: 'Low Case (P90)',
              marker: { color: '#ef4444' }
            },
            {
              y: parameters,
              x: highValues,
              type: 'bar',
              orientation: 'h',
              name: 'High Case (P10)',
              marker: { color: '#22c55e' }
            }
          ]}
          layout={{
            width: width || 400,
            height: 300,
            margin: { t: 10, b: 40, l: 120, r: 10 },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#94a3b8' },
            xaxis: { title: '% Change in STOIIP', gridcolor: '#1e293b' },
            barmode: 'relative',
            showlegend: true,
            legend: { orientation: 'h', y: -0.2 }
          }}
          config={{ responsive: true, displayModeBar: false }}
        />
      </CardContent>
    </Card>
  );
};

export default TornadoChart;