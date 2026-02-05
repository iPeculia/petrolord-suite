import React, { useState, useEffect, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, ZoomIn, ZoomOut, Palette, Settings } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BG_THEMES = {
  'dark': { name: 'Dark Gray', paper: '#0f172a', plot: '#0f172a', text: '#94a3b8', grid: '#334155', axis: '#94a3b8' },
  'black': { name: 'Black', paper: '#000000', plot: '#000000', text: '#a3a3a3', grid: '#262626', axis: '#a3a3a3' },
  'white': { name: 'White', paper: '#ffffff', plot: '#ffffff', text: '#475569', grid: '#e2e8f0', axis: '#1e293b' },
  'light': { name: 'Light Gray', paper: '#f8fafc', plot: '#f8fafc', text: '#64748b', grid: '#cbd5e1', axis: '#334155' },
};

const DEFAULT_CURVE_ALIASES = {
    depth: ['DEPTH', 'DEPT', 'MD', 'TVD', 'M', 'FT'],
    gr: ['GR', 'GAMMA', 'GAPI', 'CGR', 'SGR', 'GR_FINAL'],
    res: ['RT', 'RES', 'RDEP', 'ILD', 'LLD', 'AT90', 'RDEEP'],
    den: ['RHOB', 'DEN', 'ZDEN', 'DENSITY', 'BDEN'],
    neu: ['NPHI', 'NEUT', 'TNPH', 'CNPOR', 'NPOR'],
    dt: ['DT', 'DTC', 'DTCO', 'SONIC', 'AC']
};

const findCurveKey = (availableKeys, type) => {
    const aliases = DEFAULT_CURVE_ALIASES[type] || [];
    // Try exact match first, then case-insensitive, then partial match
    for (const alias of aliases) {
        if (availableKeys.includes(alias)) return alias;
    }
    for (const alias of aliases) {
        const match = availableKeys.find(k => k.toUpperCase() === alias);
        if (match) return match;
    }
    for (const alias of aliases) {
        const match = availableKeys.find(k => k.toUpperCase().includes(alias));
        if (match) return match;
    }
    return null;
};

const AdvancedWellLogViewer = ({ data, faciesColors }) => {
    const [viewMode, setViewMode] = useState('MD'); 
    const [interactionMode, setInteractionMode] = useState('zoom');
    const [bgTheme, setBgTheme] = useState('dark');
    
    // Load saved theme preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('logViewerTheme');
        if (savedTheme && BG_THEMES[savedTheme]) {
            setBgTheme(savedTheme);
        }
    }, []);

    const handleThemeChange = (themeKey) => {
        setBgTheme(themeKey);
        localStorage.setItem('logViewerTheme', themeKey);
    };

    const mappedData = useMemo(() => {
        if (!data || data.length === 0) return null;

        const keys = Object.keys(data[0]);
        
        const depthKey = findCurveKey(keys, 'depth');
        const grKey = findCurveKey(keys, 'gr');
        const resKey = findCurveKey(keys, 'res');
        const denKey = findCurveKey(keys, 'den');
        const neuKey = findCurveKey(keys, 'neu');
        
        // Filter out rows with invalid depth
        const validData = data.filter(d => d[depthKey] !== null && d[depthKey] !== undefined && !isNaN(d[depthKey]));
        
        if (validData.length === 0) return null;

        // Extract arrays using found keys
        return {
            depth: validData.map(d => d[depthKey]),
            gr: grKey ? validData.map(d => d[grKey]) : null,
            res: resKey ? validData.map(d => d[resKey]) : null,
            den: denKey ? validData.map(d => d[denKey]) : null,
            neu: neuKey ? validData.map(d => d[neuKey]) : null,
            facies: validData.map(d => d.Facies || 'Unknown'),
            keys: { depth: depthKey, gr: grKey, res: resKey, den: denKey, neu: neuKey }
        };

    }, [data]);

    if (!mappedData) return (
        <div className="flex items-center justify-center h-full text-slate-500 bg-slate-900 border border-slate-800 rounded-lg">
            <div className="text-center">
                <p className="mb-2">No compatible log data found.</p>
                <p className="text-xs">Upload a LAS file containing Depth, GR, Resistivity, Density, or Neutron curves.</p>
            </div>
        </div>
    );

    const { depth, gr, res, den, neu, facies, keys } = mappedData;
    const theme = BG_THEMES[bgTheme];

    // Generate Facies Rectangles
    const shapes = [];
    if (faciesColors) {
        let currentFacies = facies[0];
        let startDepth = depth[0];
        
        for(let i=1; i<depth.length; i++) {
            if (facies[i] !== currentFacies || i === depth.length - 1) {
                if (faciesColors[currentFacies]) {
                    shapes.push({
                        type: 'rect',
                        xref: 'x4 domain',
                        yref: 'y',
                        x0: 0, x1: 1,
                        y0: startDepth, y1: depth[i],
                        fillcolor: faciesColors[currentFacies],
                        line: { width: 0 },
                        layer: 'below'
                    });
                }
                currentFacies = facies[i];
                startDepth = depth[i];
            }
        }
    }

    const layout = {
        grid: { rows: 1, columns: 4, pattern: 'independent', subplots: [['xy', 'x2y', 'x3y', 'x4y']] },
        yaxis: { 
            title: `${viewMode} Depth`, 
            autorange: 'reversed', 
            gridcolor: theme.grid,
            zerolinecolor: theme.grid,
            titlefont: { color: theme.axis },
            tickfont: { color: theme.axis }
        },
        
        // Track 1: Gamma Ray
        xaxis: { 
            title: `GR (${keys.gr || 'N/A'})`, range: [0, 150], side: 'top', position: 1, 
            titlefont: { color: '#22c55e', size: 11, family: 'Inter, sans-serif' }, 
            tickfont: { color: '#22c55e', size: 10 }, 
            gridcolor: theme.grid, domain: [0, 0.2],
            zeroline: false
        },
        
        // Track 2: Resistivity (Log)
        xaxis2: { 
            title: `RES (${keys.res || 'N/A'})`, type: 'log', range: [-1, 4], side: 'top', position: 1,
            titlefont: { color: '#ef4444', size: 11, family: 'Inter, sans-serif' }, 
            tickfont: { color: '#ef4444', size: 10 }, 
            gridcolor: theme.grid, domain: [0.22, 0.42],
            zeroline: false
        },
        
        // Track 3: Neutron/Density
        xaxis3: { 
            title: 'NPHI / RHOB', range: [-0.15, 0.45], side: 'top', position: 1,
            titlefont: { color: '#3b82f6', size: 11, family: 'Inter, sans-serif' }, 
            tickfont: { color: '#3b82f6', size: 10 }, 
            gridcolor: theme.grid, domain: [0.44, 0.8],
            zeroline: false
        },
        
        // Track 4: Facies
        xaxis4: { 
            title: 'Facies', side: 'top', position: 1, 
            titlefont: { color: theme.axis, size: 11 },
            showticklabels: false, domain: [0.82, 1],
            gridcolor: theme.grid,
            zeroline: false
        },

        margin: { l: 60, r: 20, t: 80, b: 40 },
        paper_bgcolor: theme.paper,
        plot_bgcolor: theme.plot,
        font: { color: theme.text, family: 'Inter, sans-serif' },
        showlegend: false,
        shapes: shapes,
        dragmode: interactionMode === 'lasso' ? 'lasso' : 'pan',
        selectdirection: 'v',
        height: 700,
        hovermode: 'y unified',
    };

    const traces = [
        gr && { 
            x: gr, y: depth, xaxis: 'x', yaxis: 'y', 
            type: 'scatter', mode: 'lines', 
            line: { color: '#22c55e', width: 1 }, 
            fill: 'tozerox', fillcolor: 'rgba(34,197,94,0.1)', 
            name: 'GR',
            hovertemplate: '%{x:.1f} API'
        },
        res && { 
            x: res, y: depth, xaxis: 'x2', yaxis: 'y', 
            type: 'scatter', mode: 'lines', 
            line: { color: '#ef4444', width: 1.5 }, 
            name: 'RES',
            hovertemplate: '%{x:.2f} ohm.m'
        },
        neu && { 
            x: neu, y: depth, xaxis: 'x3', yaxis: 'y', 
            type: 'scatter', mode: 'lines', 
            line: { color: '#3b82f6', width: 1, dash: 'dash' }, 
            name: 'NPHI',
            hovertemplate: '%{x:.3f} v/v'
        },
        den && { 
            x: den, y: depth, xaxis: 'x3', yaxis: 'y', 
            type: 'scatter', mode: 'lines', 
            line: { color: '#f59e0b', width: 1.5 }, 
            name: 'RHOB',
            hovertemplate: '%{x:.2f} g/cc'
        }
    ].filter(Boolean);

    return (
        <Card className="bg-slate-900 border-slate-800 h-full flex flex-col shadow-lg">
            <CardHeader className="py-2 px-4 border-b border-slate-800 flex flex-row items-center justify-between space-y-0 bg-slate-950/50">
                <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-medium text-white">Advanced Well Log Viewer</CardTitle>
                    <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-400 px-1.5 py-0">Professional</Badge>
                </div>
                <div className="flex items-center gap-2">
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                             <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-800" title="Change Background">
                                <Palette className="w-4 h-4 text-slate-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                            {Object.entries(BG_THEMES).map(([key, theme]) => (
                                <DropdownMenuItem 
                                    key={key} 
                                    onClick={() => handleThemeChange(key)}
                                    className={`text-slate-200 hover:bg-slate-800 cursor-pointer ${bgTheme === key ? 'bg-slate-800' : ''}`}
                                >
                                    <div className="w-3 h-3 rounded-full mr-2 border border-slate-600" style={{background: theme.paper}}></div>
                                    {theme.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>

                    <div className="flex bg-slate-950 p-0.5 rounded-md border border-slate-700">
                        <Toggle size="sm" pressed={viewMode === 'MD'} onPressedChange={() => setViewMode('MD')} className="h-6 px-2 text-[10px] data-[state=on]:bg-slate-800 data-[state=on]:text-white text-slate-400">MD</Toggle>
                        <Toggle size="sm" pressed={viewMode === 'TVD'} onPressedChange={() => setViewMode('TVD')} className="h-6 px-2 text-[10px] data-[state=on]:bg-slate-800 data-[state=on]:text-white text-slate-400">TVD</Toggle>
                    </div>
                    
                    <div className="w-[1px] h-4 bg-slate-700 mx-1"></div>
                    
                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-800"><ZoomIn className="w-4 h-4 text-slate-400" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-800"><ZoomOut className="w-4 h-4 text-slate-400" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-slate-800"><Maximize2 className="w-4 h-4 text-slate-400" /></Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative min-h-0 overflow-hidden">
                <Plot
                    data={traces}
                    layout={layout}
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%' }}
                    config={{ 
                        displayModeBar: true, 
                        responsive: true, 
                        displaylogo: false,
                        modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d'] 
                    }}
                />
            </CardContent>
        </Card>
    );
};

export default AdvancedWellLogViewer;