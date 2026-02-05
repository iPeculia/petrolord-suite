import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const LogCanvas = ({ 
    data, 
    tracks, 
    depthRange, 
    height = 800,
    onDepthSelect,
    activeTool,
    interpretations = [],
    showGrid = true
}) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height });

    // Resize observer
    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                setDimensions({ width: entry.contentRect.width, height: entry.contentRect.height });
            }
        });
        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // Draw Loop
    useEffect(() => {
        if (!data || !data.length || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        const { width, height } = dimensions;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#0f172a'; // Slate-900
        ctx.fillRect(0, 0, width, height);

        // Scales
        const depthScale = d3.scaleLinear()
            .domain(depthRange)
            .range([0, height]);

        // Layout Config
        const visibleTracks = tracks.filter(t => t.visible);
        const depthTrackWidth = 60;
        const trackWidth = (width - depthTrackWidth) / visibleTracks.length;
        
        // --- Draw Depth Track ---
        ctx.fillStyle = '#1e293b'; // Slate-800
        ctx.fillRect(0, 0, depthTrackWidth, height);
        
        ctx.strokeStyle = '#334155'; // Slate-700
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(depthTrackWidth, 0);
        ctx.lineTo(depthTrackWidth, height);
        ctx.stroke();

        // Depth Ticks & Labels
        const ticks = depthScale.ticks(Math.floor(height / 50));
        ctx.fillStyle = '#94a3b8'; // Slate-400
        ctx.font = '10px monospace';
        ctx.textAlign = 'right';
        
        ticks.forEach(d => {
            const y = depthScale(d);
            if (y >= 0 && y <= height) {
                ctx.fillText(d.toString(), depthTrackWidth - 5, y + 3);
                ctx.beginPath();
                ctx.moveTo(depthTrackWidth - 3, y);
                ctx.lineTo(depthTrackWidth, y);
                ctx.stroke();
                
                // Horizontal grid across whole canvas
                if (showGrid) {
                    ctx.save();
                    ctx.strokeStyle = '#1e293b';
                    ctx.setLineDash([2, 4]);
                    ctx.beginPath();
                    ctx.moveTo(depthTrackWidth, y);
                    ctx.lineTo(width, y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        });

        // --- Draw Data Tracks ---
        visibleTracks.forEach((track, i) => {
            const xStart = depthTrackWidth + (i * trackWidth);
            const xEnd = xStart + trackWidth;

            // Track Background
            // ctx.strokeStyle = '#334155';
            // ctx.beginPath();
            // ctx.moveTo(xEnd, 0);
            // ctx.lineTo(xEnd, height);
            // ctx.stroke();
            
            // Vertical Grid Lines inside track
            if (showGrid) {
                const vTicks = 4;
                for(let j=1; j<vTicks; j++) {
                    const vx = xStart + (trackWidth * (j/vTicks));
                    ctx.strokeStyle = '#1e293b';
                    ctx.beginPath();
                    ctx.moveTo(vx, 0);
                    ctx.lineTo(vx, height);
                    ctx.stroke();
                }
            }

            // Draw Curves
            track.curves.forEach(curveConfig => {
                if (!data[0].hasOwnProperty(curveConfig.name)) return;
                
                const xRange = [xStart, xEnd];
                let xScale;
                
                if (curveConfig.scale === 'log') {
                    xScale = d3.scaleLog()
                        .domain([curveConfig.min, curveConfig.max])
                        .range(xRange)
                        .clamp(true);
                } else {
                    xScale = d3.scaleLinear()
                        .domain([curveConfig.min, curveConfig.max])
                        .range(xRange);
                }

                // Path Generator
                ctx.beginPath();
                ctx.strokeStyle = curveConfig.color;
                ctx.lineWidth = 1.5;
                
                let hasStarted = false;
                
                // Optimized draw loop
                // We can skip points outside depth range for performance
                for(let k=0; k < data.length; k++) {
                    const d = data[k];
                    if (d.depth < depthRange[0]) continue;
                    if (d.depth > depthRange[1]) break;
                    
                    const val = d[curveConfig.name];
                    if (val === null || isNaN(val)) {
                        hasStarted = false;
                        continue;
                    }
                    
                    const x = xScale(val);
                    const y = depthScale(d.depth);
                    
                    if (!hasStarted) {
                        ctx.moveTo(x, y);
                        hasStarted = true;
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
                
                // Draw Curve Header
                const headerY = 20 + (track.curves.indexOf(curveConfig) * 12);
                ctx.fillStyle = curveConfig.color;
                ctx.font = 'bold 10px sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(`${curveConfig.name} (${curveConfig.min}-${curveConfig.max})`, xStart + 5, headerY);
            });
            
            // Separator
            ctx.strokeStyle = '#475569';
            ctx.beginPath();
            ctx.moveTo(xEnd, 0);
            ctx.lineTo(xEnd, height);
            ctx.stroke();
        });
        
        // --- Draw Interpretations (Horizons) ---
        interpretations.filter(i => i.type === 'horizon').forEach(interp => {
             const y = depthScale(interp.depth);
             if (y < 0 || y > height) return;
             
             ctx.strokeStyle = interp.color;
             ctx.lineWidth = 2;
             // ctx.setLineDash([5, 3]);
             ctx.beginPath();
             ctx.moveTo(depthTrackWidth, y);
             ctx.lineTo(width, y);
             ctx.stroke();
             ctx.setLineDash([]);
             
             ctx.fillStyle = interp.color;
             ctx.textAlign = 'right';
             ctx.font = 'bold 11px sans-serif';
             ctx.fillText(interp.name, width - 10, y - 4);
        });

    }, [data, tracks, depthRange, dimensions, interpretations, showGrid]);

    const handleCanvasClick = (e) => {
        if (activeTool !== 'picker') return;
        const rect = canvasRef.current.getBoundingClientRect();
        const y = e.clientY - rect.top;
        
        // Inverse scale to get depth
        const depthScale = d3.scaleLinear()
            .domain([0, dimensions.height])
            .range(depthRange);
            
        const depth = depthScale(y);
        onDepthSelect && onDepthSelect(depth);
    };

    return (
        <div ref={containerRef} className="w-full h-full relative bg-slate-950 overflow-hidden">
            <canvas
                ref={canvasRef}
                width={dimensions.width}
                height={dimensions.height}
                className={`block ${activeTool === 'picker' ? 'cursor-crosshair' : 'cursor-default'}`}
                onClick={handleCanvasClick}
            />
        </div>
    );
};

export default LogCanvas;