import React, { useEffect, useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { useResizeDetector } from 'react-resize-detector';
import { Loader2 } from 'lucide-react';

const ContourMapViewer = ({ gridData, unitSystem }) => {
    const { width, height, ref } = useResizeDetector({
        refreshMode: 'debounce',
        refreshRate: 50,
    });
    
    const [plotData, setPlotData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!gridData || !gridData.z || !gridData.x || !gridData.y) {
            setPlotData(null);
            return;
        }

        try {
            // Check for valid data dimensions
            const zFlat = gridData.z.flat().filter(v => v !== null && v !== undefined && !isNaN(v));
            if (zFlat.length === 0) throw new Error("Grid contains no valid Z values");

            // Create clean contour trace
            const contourTrace = {
                z: gridData.z,
                x: gridData.x,
                y: gridData.y,
                type: 'contour',
                colorscale: 'Jet',
                autocontour: true,
                ncontours: 20,
                connectgaps: true,
                contours: {
                    coloring: 'heatmap',
                    showlabels: true,
                    labelfont: { family: 'Inter, sans-serif', size: 10, color: 'rgba(255,255,255,0.9)' }
                },
                line: { smoothing: 1, width: 0.5, color: 'rgba(255,255,255,0.2)' },
                colorbar: {
                    title: { text: `Depth (${unitSystem === 'metric' ? 'm' : 'ft'})`, font: { size: 10, color: '#94a3b8' }, side: 'right' },
                    tickfont: { size: 9, color: '#94a3b8' },
                    thickness: 10, len: 0.8, x: 1.02
                },
                hoverinfo: 'x+y+z',
                hovertemplate: '<b>X</b>: %{x:.1f}<br><b>Y</b>: %{y:.1f}<br><b>Z</b>: %{z:.1f}<extra></extra>'
            };

            setPlotData([contourTrace]);
            setError(null);
        } catch (err) {
            console.error("Contour Generation Error:", err);
            setError(err.message);
            setPlotData(null);
        }

    }, [gridData, unitSystem]);

    // Responsive Layout
    const layout = useMemo(() => ({
        width: width || undefined,
        height: height || undefined,
        autosize: true,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 20, b: 30, l: 40, r: 20 },
        xaxis: {
            title: { text: 'Easting', font: { size: 10, color: '#64748b' } },
            color: '#94a3b8', gridcolor: '#1e293b', zerolinecolor: '#334155', tickfont: { size: 9 }
        },
        yaxis: {
            title: { text: 'Northing', font: { size: 10, color: '#64748b' } },
            color: '#94a3b8', gridcolor: '#1e293b', zerolinecolor: '#334155', tickfont: { size: 9 },
            scaleanchor: "x", scaleratio: 1
        },
        showlegend: false,
        dragmode: 'pan'
    }), [width, height]);

    const config = {
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'],
        displaylogo: false,
        scrollZoom: true
    };

    if (error) {
        return <div ref={ref} className="w-full h-full flex items-center justify-center text-red-400 text-xs">{error}</div>;
    }

    if (!plotData) {
        return (
            <div ref={ref} className="w-full h-full flex items-center justify-center bg-slate-950">
               <Loader2 className="w-5 h-5 text-slate-700 animate-spin" />
            </div>
        );
    }

    return (
        <div ref={ref} className="w-full h-full bg-slate-950 relative overflow-hidden">
            <Plot
                data={plotData}
                layout={layout}
                config={config}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
                onError={(err) => console.error("Plotly Error:", err)}
            />
        </div>
    );
};

export default React.memo(ContourMapViewer);