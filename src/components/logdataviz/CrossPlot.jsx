import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { Label } from '@/components/ui/label';

const CrossPlot = ({ logData }) => {
  const [xAxis, setXAxis] = useState('NPHI');
  const [yAxis, setYAxis] = useState('RHOB');

  const availableCurves = Object.keys(logData);

  const plotData = [{
    x: logData[xAxis],
    y: logData[yAxis],
    mode: 'markers',
    type: 'scattergl',
    marker: { 
      color: logData['GR'],
      colorscale: 'Viridis',
      showscale: true,
      colorbar: {
        title: 'Gamma Ray',
        font: { color: '#333' }
      }
    }
  }];

  const layout = {
    title: { text: `${yAxis} vs ${xAxis}`, font: { color: '#333' } },
    xaxis: { title: xAxis, autorange: 'reversed', color: '#555', gridcolor: '#eee' },
    yaxis: { title: yAxis, autorange: 'reversed', color: '#555', gridcolor: '#eee' },
    paper_bgcolor: '#fff',
    plot_bgcolor: '#fff',
    font: { color: '#333' },
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow">
        <Plot
          data={plotData}
          layout={layout}
          useResizeHandler={true}
          className="w-full h-full"
        />
      </div>
      <div className="flex-shrink-0 p-2 flex items-center justify-center space-x-4">
        <div>
          <Label className="text-white">X-Axis:</Label>
          <select value={xAxis} onChange={(e) => setXAxis(e.target.value)} className="bg-slate-700 text-white p-1 rounded">
            {availableCurves.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <Label className="text-white">Y-Axis:</Label>
          <select value={yAxis} onChange={(e) => setYAxis(e.target.value)} className="bg-slate-700 text-white p-1 rounded">
            {availableCurves.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CrossPlot;