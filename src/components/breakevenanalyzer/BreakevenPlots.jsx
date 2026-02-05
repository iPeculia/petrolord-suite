import React from 'react';
import Plot from 'react-plotly.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BreakevenPlots = ({ cdfData, histogramData, tornadoData, kpis }) => {

  const cdfLayout = {
    title: { text: 'Cumulative Probability (S-Curve)', font: { color: '#333' } },
    xaxis: { title: 'Breakeven Oil Price ($/STB)', color: '#555', gridcolor: '#eee' },
    yaxis: { title: 'Cumulative Probability', color: '#555', gridcolor: '#eee' },
    plot_bgcolor: '#fff',
    paper_bgcolor: '#fff',
    legend: { font: { color: '#333' } },
    shapes: [
        {type: 'line', x0: kpis.p10, x1: kpis.p10, y0: 0, y1: 0.1, line: {color: '#f87171', width: 2, dash: 'dash'}},
        {type: 'line', x0: kpis.p50, x1: kpis.p50, y0: 0, y1: 0.5, line: {color: '#fbbf24', width: 2, dash: 'dash'}},
        {type: 'line', x0: kpis.p90, x1: kpis.p90, y0: 0, y1: 0.9, line: {color: '#4ade80', width: 2, dash: 'dash'}},
    ]
  };

  const histogramLayout = {
    title: { text: 'Frequency Distribution', font: { color: '#333' } },
    xaxis: { title: 'Breakeven Oil Price ($/STB)', color: '#555', gridcolor: '#eee' },
    yaxis: { title: 'Frequency', color: '#555', gridcolor: '#eee' },
    plot_bgcolor: '#fff',
    paper_bgcolor: '#fff',
    bargap: 0.05,
  };

  const tornadoLayout = {
    title: { text: 'Breakeven Sensitivity', font: { color: '#333' } },
    xaxis: { title: 'Impact on Breakeven Price ($/STB)', color: '#555', gridcolor: '#eee' },
    yaxis: { title: '', color: '#555', automargin: true },
    plot_bgcolor: '#fff',
    paper_bgcolor: '#fff',
    bargap: 0.4,
    barmode: 'relative',
    showlegend: false,
    shapes: [
        {type: 'line', x0: tornadoData.base[0], x1: tornadoData.base[0], y0: -1, y1: tornadoData.y.length, line: {color: '#a3e635', width: 2, dash: 'dot'}}
    ]
  };

  return (
    <div className="bg-white/5 p-4 rounded-lg">
      <Tabs defaultValue="cdf" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="cdf">S-Curve (CDF)</TabsTrigger>
          <TabsTrigger value="histogram">Histogram</TabsTrigger>
          <TabsTrigger value="tornado">Tornado Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="cdf">
          <Plot
            data={[{
              x: cdfData.x,
              y: cdfData.y,
              type: 'scatter',
              mode: 'lines',
              name: 'CDF',
              line: { color: '#a3e635', width: 3 },
            }]}
            layout={cdfLayout}
            style={{ width: '100%', height: '400px' }}
            useResizeHandler={true}
            config={{ displayModeBar: false }}
          />
        </TabsContent>
        <TabsContent value="histogram">
          <Plot
            data={[{
              x: histogramData.x,
              type: 'histogram',
              name: 'Frequency',
              marker: { color: '#fb923c' },
            }]}
            layout={histogramLayout}
            style={{ width: '100%', height: '400px' }}
            useResizeHandler={true}
            config={{ displayModeBar: false }}
          />
        </TabsContent>
        <TabsContent value="tornado">
          <Plot
            data={[{
                type: 'bar',
                y: tornadoData.y,
                x: tornadoData.x,
                base: tornadoData.base,
                orientation: 'h',
                marker: {
                    color: tornadoData.x.map(v => v > 0 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(34, 197, 94, 0.6)'),
                    line: {
                        color: tornadoData.x.map(v => v > 0 ? '#ef4444' : '#22c55e'),
                        width: 1
                    }
                },
                text: tornadoData.x.map(v => v.toFixed(2)),
                textposition: 'outside',
            }]}
            layout={tornadoLayout}
            style={{ width: '100%', height: '400px' }}
            useResizeHandler={true}
            config={{ displayModeBar: false }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BreakevenPlots;