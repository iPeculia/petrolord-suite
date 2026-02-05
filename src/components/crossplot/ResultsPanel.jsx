import React from 'react';
import Plot from 'react-plotly.js';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const ResultsPanel = ({ results, onDownload, loading }) => {
  const { plot_data, layout, point_count, applied_filters } = results;

  const plotLayout = {
    ...layout,
    paper_bgcolor: 'transparent',
    plot_bgcolor: '#1f2937',
    font: { color: '#e5e7eb' },
    xaxis: { ...layout.xaxis, gridcolor: '#374151', title: { ...layout.xaxis.title, font: { color: '#9ca3af' } }, tickfont: { color: '#9ca3af' } },
    yaxis: { ...layout.yaxis, gridcolor: '#374151', title: { ...layout.yaxis.title, font: { color: '#9ca3af' } }, tickfont: { color: '#9ca3af' } },
    legend: { bgcolor: 'rgba(31, 41, 55, 0.7)', bordercolor: 'rgba(156, 163, 175, 0.2)', font: { color: '#e5e7eb' } },
    coloraxis: { colorbar: { tickfont: { color: '#e5e7eb' }, title: { font: { color: '#e5e7eb' } } } },
  };
  
  if (plot_data[0]?.marker?.colorbar) {
    plot_data[0].marker.colorbar.tickfont = { color: '#e5e7eb' };
    plot_data[0].marker.colorbar.title.font = { color: '#e5e7eb' };
  }


  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          <p>Points Plotted: <span className="font-bold text-lime-300">{point_count}</span></p>
          <p>Filters: <span className="font-mono text-gray-300">{applied_filters}</span></p>
        </div>
        <Button onClick={onDownload} disabled={loading} variant="outline" className="border-lime-400 text-lime-400 hover:bg-lime-400/10">
          <Download className="w-4 h-4 mr-2" />
          Download Filtered CSV
        </Button>
      </div>
      <div className="flex-grow bg-gray-800/50 rounded-lg p-2">
        <Plot
          data={plot_data}
          layout={plotLayout}
          useResizeHandler={true}
          className="w-full h-full"
          config={{ displaylogo: false, responsive: true }}
        />
      </div>
    </div>
  );
};

export default ResultsPanel;