import React from 'react';
import Plot from 'react-plotly.js';

const DecisionTreePlot = ({ data }) => {
  const plotData = [{
    type: 'sankey',
    orientation: 'h',
    valueformat: ".0f",
    valuesuffix: "M",
    node: {
      pad: 25,
      thickness: 20,
      line: {
        color: 'black',
        width: 0.5
      },
      label: data.nodes.map(n => n.label),
      color: data.nodes.map(n => n.color),
      customdata: data.nodes.map(n => n.emv),
      hovertemplate: '%{label}<br>EMV: $%{customdata:.2f}M<extra></extra>'
    },
    link: {
      source: data.links.map(l => l.source),
      target: data.links.map(l => l.target),
      value: data.links.map(l => Math.max(l.value, 0.1)), // Sankey requires positive values
      label: data.links.map(l => l.label),
      color: data.links.map(l => l.color),
      hovertemplate: '%{label}<extra></extra>'
    }
  }];

  const layout = {
    title: {
      text: 'Interactive Decision Tree',
      font: {
        color: '#e2e8f0'
      }
    },
    font: {
      size: 12,
      color: '#e2e8f0'
    },
    plot_bgcolor: 'transparent',
    paper_bgcolor: 'transparent',
    margin: { l: 10, r: 10, b: 40, t: 50 },
  };

  return (
    <div className="bg-white/5 p-4 rounded-lg h-[600px]">
      <Plot
        data={plotData}
        layout={layout}
        style={{ width: '100%', height: '100%' }}
        useResizeHandler={true}
        config={{ displayModeBar: false }}
      />
    </div>
  );
};

export default DecisionTreePlot;