import React from 'react';
import Plot from 'react-plotly.js';
import { useTheme } from 'next-themes';

const PlotlyChartFactory = ({ 
    data = [], // Default to empty array
    layout = {}, 
    config = {}, 
    style = {}, 
    onHover, 
    onClick, 
    onSelected 
}) => {
    const { theme } = useTheme() || { theme: 'dark' }; // Safe access to theme
    const isDark = theme === 'dark' || true; // Default to dark mode styles

    const defaultLayout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: {
            color: isDark ? '#94a3b8' : '#1e293b',
            family: 'Inter, sans-serif'
        },
        xaxis: {
            gridcolor: isDark ? '#334155' : '#e2e8f0',
            zerolinecolor: isDark ? '#475569' : '#cbd5e1',
            tickfont: { size: 10 },
            automargin: true
        },
        yaxis: {
            gridcolor: isDark ? '#334155' : '#e2e8f0',
            zerolinecolor: isDark ? '#475569' : '#cbd5e1',
            tickfont: { size: 10 },
            automargin: true
        },
        margin: { l: 50, r: 20, t: 30, b: 40 },
        autosize: true,
        hovermode: 'closest',
        showlegend: true,
        legend: {
            orientation: 'h',
            y: 1.1,
            x: 0.5,
            xanchor: 'center',
            font: { size: 10 }
        }
    };

    const defaultConfig = {
        displayModeBar: true,
        responsive: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'hoverClosestCartesian', 'hoverCompareCartesian'],
        toImageButtonOptions: {
            format: 'png',
            filename: 'earthmodel_plot',
            height: 800,
            width: 1200,
            scale: 2
        }
    };

    // Defensive check: If data is somehow null/undefined after default, make it empty array
    const safeData = Array.isArray(data) ? data : [];

    return (
        <div className="w-full h-full min-h-[300px]" style={style}>
            <Plot
                data={safeData}
                layout={{ ...defaultLayout, ...layout }}
                config={{ ...defaultConfig, ...config }}
                useResizeHandler={true}
                style={{ width: '100%', height: '100%' }}
                onHover={onHover}
                onClick={onClick}
                onSelected={onSelected}
                onError={(err) => console.error("Plotly Error:", err)}
            />
        </div>
    );
};

export default PlotlyChartFactory;