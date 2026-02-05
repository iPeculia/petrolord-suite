import React, { useMemo, useState } from 'react';
import Plot from 'react-plotly.js';
import { useDeclineCurve } from '@/contexts/DeclineCurveContext';
import { Button } from '@/components/ui/button';
import { exportChartAsImage } from '@/utils/declineCurve/dcaExport';
import { Camera } from 'lucide-react';

const DCABasePlots = () => {
  const { currentData, selectedStream, streamState, scenarios, selectedScenarios } = useDeclineCurve();
  const [logScale, setLogScale] = useState(true);
  
  const fitResults = streamState[selectedStream].fitResults;
  const forecastResults = streamState[selectedStream].forecastResults;
  const econLimit = streamState[selectedStream].forecastConfig.economicLimit;

  const plotData = useMemo(() => {
    const traces = [];

    // 1. History Data
    if (currentData && currentData.length > 0) {
      const historyX = currentData.map(d => new Date(d.date));
      const historyY = currentData.map(d => {
         if (selectedStream === 'oil') return d.rate;
         if (selectedStream === 'gas') return d.gasRate || d.rate;
         return d.waterRate || d.rate;
      });

      traces.push({
        x: historyX,
        y: historyY,
        type: 'scatter',
        mode: 'markers',
        name: 'History',
        marker: { color: '#64748b', size: 3, opacity: 0.6 }
      });
    }

    // 2. Active Forecast (includes fit usually)
    if (forecastResults) {
      traces.push({
        x: forecastResults.data.map(d => d.date),
        y: forecastResults.data.map(d => d.rate),
        type: 'scatter',
        mode: 'lines',
        name: `Active Forecast`,
        line: { color: '#10b981', width: 2, dash: 'solid' }
      });
    }

    // 3. Scenarios
    const activeScenarios = scenarios.filter(s => selectedScenarios.includes(s.id) && s.stream === selectedStream);
    activeScenarios.forEach((scenario, idx) => {
        const color = idx === 0 ? '#f59e0b' : (idx === 1 ? '#ec4899' : '#6366f1');
        traces.push({
            x: scenario.forecastResults.data.map(d => d.date),
            y: scenario.forecastResults.data.map(d => d.rate),
            type: 'scatter',
            mode: 'lines',
            name: scenario.name,
            line: { color, width: 1.5, dash: 'dot' }
        });
    });

    // 4. Econ Limit Line
    if (currentData.length > 0 && econLimit > 0) {
        const start = new Date(currentData[0].date);
        const end = forecastResults 
            ? new Date(forecastResults.data[forecastResults.data.length-1].date) 
            : new Date(currentData[currentData.length-1].date);
        
        traces.push({
            x: [start, end],
            y: [econLimit, econLimit],
            type: 'scatter',
            mode: 'lines',
            name: 'Econ Limit',
            line: { color: '#ef4444', width: 1, dash: 'dash' },
            hoverinfo: 'skip'
        });
    }

    return traces;
  }, [currentData, forecastResults, selectedStream, scenarios, selectedScenarios, econLimit]);

  return (
    <div id="dca-main-plot" className="h-full flex flex-col bg-slate-900 rounded-lg border border-slate-800 overflow-hidden shadow-inner">
        <div className="p-2 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="flex gap-2">
              <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`text-xs h-7 ${logScale ? 'bg-blue-900/30 text-blue-400 border border-blue-900' : 'text-slate-400'}`}
                  onClick={() => setLogScale(!logScale)}
              >
                  {logScale ? 'Log Scale' : 'Linear Scale'}
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => exportChartAsImage('dca-main-plot', 'dca_plot')}>
                <Camera size={14} className="text-slate-400" />
            </Button>
        </div>
        <div className="flex-1 relative min-h-[400px] w-full">
            {currentData.length > 0 ? (
                <Plot
                    data={plotData}
                    layout={{
                        autosize: true,
                        margin: { l: 50, r: 20, t: 30, b: 40 },
                        paper_bgcolor: 'rgba(0,0,0,0)',
                        plot_bgcolor: 'rgba(0,0,0,0)',
                        font: { color: '#94a3b8', family: 'Inter, sans-serif' },
                        xaxis: { 
                            title: 'Date', 
                            gridcolor: '#1e293b',
                            zerolinecolor: '#334155',
                            type: 'date'
                        },
                        yaxis: { 
                            title: 'Rate', 
                            type: logScale ? 'log' : 'linear',
                            gridcolor: '#1e293b',
                            zerolinecolor: '#334155'
                        },
                        showlegend: true,
                        legend: { x: 1, xanchor: 'right', y: 1, bgcolor: 'rgba(15,23,42,0.8)', bordercolor: '#334155', borderwidth: 1 }
                    }}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%', position: 'absolute' }}
                    config={{ responsive: true, displayModeBar: false }}
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-600 flex-col gap-2">
                    <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                    No data loaded
                </div>
            )}
        </div>
    </div>
  );
};

export default DCABasePlots;