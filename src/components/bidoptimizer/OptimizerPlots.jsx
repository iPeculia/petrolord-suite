import React from 'react';
import Plot from 'react-plotly.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OptimizerPlots = ({ portfolioData }) => {

  const scatterLayout = {
    title: { text: 'Bid Round Portfolio View', font: { color: '#333' } },
    xaxis: { title: 'Risked EMV ($MM)', color: '#555', gridcolor: '#eee' },
    yaxis: { title: 'Required Bid Amount ($MM)', color: '#555', gridcolor: '#eee' },
    plot_bgcolor: '#fff',
    paper_bgcolor: '#fff',
    legend: { font: { color: '#333' } },
  };

  const tornadoLayout = {
    title: { text: 'EMV Sensitivity', font: { color: '#333' } },
    xaxis: { title: 'Impact on EMV ($MM)', color: '#555', gridcolor: '#eee' },
    yaxis: { title: '', color: '#555', automargin: true },
    plot_bgcolor: '#fff',
    paper_bgcolor: '#fff',
    bargap: 0.4,
    showlegend: false,
  };

  return (
    <div className="bg-white/5 p-4 rounded-lg">
      <Tabs defaultValue="scatter" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="scatter">Portfolio Scatter Plot</TabsTrigger>
          <TabsTrigger value="tornado">Sensitivity Tornado</TabsTrigger>
        </TabsList>
        <TabsContent value="scatter">
          <Plot
            data={[
                {
                    x: portfolioData.scatter.x,
                    y: portfolioData.scatter.y,
                    text: portfolioData.scatter.text,
                    mode: 'markers+text',
                    type: 'scatter',
                    textposition: 'top center',
                    marker: { 
                        size: portfolioData.scatter.size,
                        color: portfolioData.scatter.color,
                        showscale: true,
                        colorscale: 'Viridis',
                        colorbar: { title: 'POSc (%)', font: { color: '#333' } }
                    },
                    name: 'Blocks'
                }
            ]}
            layout={scatterLayout}
            style={{ width: '100%', height: '400px' }}
            useResizeHandler={true}
            config={{ displayModeBar: false }}
          />
        </TabsContent>
        <TabsContent value="tornado">
          <Plot
            data={[{
                type: 'bar',
                y: portfolioData.tornado.y,
                x: portfolioData.tornado.x,
                base: portfolioData.tornado.base,
                orientation: 'h',
                marker: {
                    color: portfolioData.tornado.x.map(v => v > 0 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)'),
                    line: {
                        color: portfolioData.tornado.x.map(v => v > 0 ? '#22c55e' : '#ef4444'),
                        width: 1
                    }
                },
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

export default OptimizerPlots;