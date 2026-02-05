import React, { useEffect, useRef, useState } from 'react';
import Plot from 'react-plotly.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { v4 as uuidv4 } from 'uuid';

const ViewerPanel = ({ seismicData, onSaveInterpretation, interpretations, highlightedInterpretation }) => {
    const [plotRevision, setPlotRevision] = useState(0);
    const [pickingMode, setPickingMode] = useState(null); // 'horizon', 'fault'
    const [currentPick, setCurrentPick] = useState([]);
    const [pickName, setPickName] = useState('');
    const plotRef = useRef(null);

    const handlePickClick = (data) => {
        if (!pickingMode) return;
        const point = data.points[0];
        setCurrentPick(prev => [...prev, [point.x, point.y]]);
    };

    const startPicking = (mode) => {
        const name = prompt(`Enter name for new ${mode}:`);
        if (name) {
            setPickingMode(mode);
            setPickName(name);
            setCurrentPick([]);
        }
    };

    const savePick = () => {
        if (currentPick.length < 2) {
            alert('Need at least 2 points to save.');
            return;
        }
        const geojson = {
            type: 'Feature',
            geometry: {
                type: 'LineString',
                coordinates: currentPick,
            },
            properties: { name: pickName }
        };
        onSaveInterpretation({ name: pickName, kind: pickingMode, geojson });
        cancelPick();
    };

    const cancelPick = () => {
        setPickingMode(null);
        setCurrentPick([]);
        setPickName('');
    };

    useEffect(() => {
        setPlotRevision(p => p + 1);
    }, [seismicData, interpretations, highlightedInterpretation, currentPick]);

    if (!seismicData) {
        return <div className="flex items-center justify-center h-full bg-gray-800 text-gray-400">No seismic data loaded.</div>;
    }

    const traces = [
        {
            z: seismicData.traces,
            x: seismicData.headers.map(h => h.inline),
            y: seismicData.samples,
            type: 'heatmap',
            colorscale: 'Greys',
            reversescale: true,
            zmin: seismicData.percentiles.p1,
            zmax: seismicData.percentiles.p99,
            name: 'Seismic',
            colorbar: {
                title: 'Amplitude',
                titleside: 'right'
            }
        }
    ];

    const shapes = [];

    interpretations.forEach(interp => {
        if (interp.geojson?.geometry?.type === 'LineString') {
            shapes.push({
                type: 'path',
                path: interp.geojson.geometry.coordinates.map(p => `M ${p[0]},${p[1]}`).join(' L ').replace('M', 'M'),
                line: {
                    color: highlightedInterpretation?.id === interp.id ? 'cyan' : (interp.kind === 'fault' ? 'red' : 'yellow'),
                    width: highlightedInterpretation?.id === interp.id ? 4 : 2,
                    dash: interp.kind === 'fault' ? 'dash' : 'solid',
                }
            });
        }
    });

    if (currentPick.length > 0) {
        shapes.push({
            type: 'path',
            path: currentPick.map(p => `M ${p[0]},${p[1]}`).join(' L ').replace('M', 'M'),
            line: { color: 'lime', width: 3, dash: 'dot' }
        });
    }

    return (
        <div className="h-full flex flex-col">
            <div className="p-2 bg-gray-900 border-b border-gray-700 flex items-center space-x-2">
                <Button onClick={() => startPicking('horizon')} disabled={!!pickingMode}>Pick Horizon</Button>
                <Button onClick={() => startPicking('fault')} disabled={!!pickingMode}>Pick Fault</Button>
                {pickingMode && (
                    <>
                        <Input value={pickName} readOnly className="bg-gray-700 w-48" />
                        <Button onClick={savePick} variant="secondary">Save</Button>
                        <Button onClick={cancelPick} variant="destructive">Cancel</Button>
                    </>
                )}
            </div>
            <div className="flex-grow">
                <Plot
                    ref={plotRef}
                    data={traces}
                    layout={{
                        title: 'Seismic Section',
                        autosize: true,
                        yaxis: { autorange: 'reversed', title: 'Time (ms)' },
                        xaxis: { title: 'Inline' },
                        template: 'plotly_dark',
                        shapes: shapes,
                        datarevision: plotRevision,
                    }}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    onClick={handlePickClick}
                />
            </div>
        </div>
    );
};

export default ViewerPanel;