import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
    generateDepthTicks, 
    generateDistanceTicks, 
    getCatmullRomPoints, 
    getPropertyColor 
} from '@/utils/crossSectionUtils';

const CrossSectionCanvas = ({ 
    width, 
    height, 
    projectionData,
    layers, 
    viewSettings, 
    activeTool,
    onSelectionChange,
    setMeasurementResult,
    colorSettings
}) => {
    const canvasRef = useRef(null);
    const bgCanvasRef = useRef(null); 
    const [transform, setTransform] = useState({ x: 50, y: 50, k: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const lastPos = useRef({ x: 0, y: 0 });
    
    // Measurement State
    const [measureStart, setMeasureStart] = useState(null);
    const [tempMeasureEnd, setTempMeasureEnd] = useState(null);

    // Background Rendering (Grid & Properties)
    useEffect(() => {
        const canvas = bgCanvasRef.current;
        if (!canvas || !projectionData) return;
        const ctx = canvas.getContext('2d');
        
        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.k, transform.k * viewSettings.verticalExaggeration);

        // Property Coloring (Heatmap style)
        if (layers.coloring?.visible && colorSettings.mode === 'property' && colorSettings.property) {
            const { min, max, scale } = colorSettings;
            projectionData.wells.forEach(w => {
                const logData = w.log_data?.[colorSettings.property] || [];
                if (logData.length === 0) return;

                const barWidth = 40 / transform.k; // Fixed visual width
                
                // Draw strip log
                logData.forEach((pt, i) => {
                    if (i === 0) return;
                    const prev = logData[i-1];
                    const height = pt.depth - prev.depth;
                    if (height > 5) return; // Skip gaps

                    ctx.fillStyle = getPropertyColor(pt.value, min, max, scale);
                    ctx.fillRect(w.projection.distance - barWidth/2, prev.depth, barWidth, height);
                });
            });
        }

        // Grid
        if (layers.grid?.visible) {
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1 / transform.k;
            ctx.beginPath();
            
            const distTicks = generateDistanceTicks(projectionData.length, 500);
            distTicks.forEach(d => { ctx.moveTo(d, 0); ctx.lineTo(d, 10000); });

            const depthTicks = generateDepthTicks(0, 10000, 500);
            depthTicks.forEach(d => { ctx.moveTo(0, d); ctx.lineTo(projectionData.length, d); });
            
            ctx.stroke();
        }

        ctx.restore();
    }, [width, height, transform, layers, viewSettings, projectionData, colorSettings]);

    // Foreground Rendering (Wells, Horizons, Interaction)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !projectionData) return;
        const ctx = canvas.getContext('2d');
        
        const dpr = window.devicePixelRatio || 1;
        if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
        }

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(transform.x, transform.y);
        ctx.scale(transform.k, transform.k * viewSettings.verticalExaggeration);

        // Horizons
        if (layers.horizons?.visible) {
            Object.entries(projectionData.horizons).forEach(([name, points], i) => {
                if (points.length < 2) return;
                
                ctx.strokeStyle = `hsl(${i * 60}, 70%, 50%)`;
                ctx.lineWidth = 3 / transform.k;
                ctx.beginPath();
                
                const spline = getCatmullRomPoints(points);
                spline.forEach((p, idx) => {
                    if(idx===0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
                ctx.stroke();

                // Label
                ctx.save();
                ctx.scale(1, 1 / viewSettings.verticalExaggeration); 
                const mid = spline[Math.floor(spline.length/2)];
                if (mid) {
                    ctx.fillStyle = ctx.strokeStyle;
                    ctx.font = '12px sans-serif';
                    ctx.fillText(name, mid.x, mid.y * viewSettings.verticalExaggeration - 5);
                }
                ctx.restore();
            });
        }

        // Wells
        if (layers.wells?.visible) {
            projectionData.wells.forEach(well => {
                const x = well.projection.distance;
                const topZ = well.meta.kb || 0; 
                const bottomZ = well.meta.md_max || 3000;

                // Wellbore stick
                ctx.strokeStyle = well.meta.well_color || '#ffffff';
                ctx.lineWidth = 2 / transform.k;
                ctx.beginPath();
                ctx.moveTo(x, -topZ); 
                ctx.lineTo(x, bottomZ);
                ctx.stroke();

                // Tops markers
                if (well.meta.tops) {
                    well.meta.tops.forEach(top => {
                        ctx.beginPath();
                        ctx.moveTo(x - 10, top.md);
                        ctx.lineTo(x + 10, top.md);
                        ctx.lineWidth = 2 / transform.k;
                        ctx.strokeStyle = 'yellow';
                        ctx.stroke();
                    });
                }

                // Name Label
                ctx.save();
                ctx.translate(x, -topZ - 20);
                ctx.scale(1, 1 / viewSettings.verticalExaggeration); 
                ctx.fillStyle = '#e2e8f0';
                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(well.name, 0, 0);
                ctx.restore();
            });
        }

        // Measurement Tool Overlay
        if (measureStart && tempMeasureEnd) {
            ctx.strokeStyle = '#facc15'; 
            ctx.lineWidth = 2 / transform.k;
            ctx.setLineDash([5/transform.k, 5/transform.k]);
            ctx.beginPath();
            ctx.moveTo(measureStart.x, measureStart.y);
            ctx.lineTo(tempMeasureEnd.x, tempMeasureEnd.y);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(measureStart.x, measureStart.y, 4/transform.k, 0, Math.PI*2);
            ctx.arc(tempMeasureEnd.x, tempMeasureEnd.y, 4/transform.k, 0, Math.PI*2);
            ctx.fill();
        }

        ctx.restore();
    }, [width, height, transform, layers, viewSettings, projectionData, measureStart, tempMeasureEnd]);

    // Interaction Handlers
    const screenToWorld = (sx, sy) => {
        const wx = (sx - transform.x) / transform.k;
        const wy = (sy - transform.y) / (transform.k * viewSettings.verticalExaggeration);
        return { x: wx, y: wy };
    };

    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (activeTool === 'pan') {
            setIsDragging(true);
            lastPos.current = { x: e.clientX, y: e.clientY };
        } else if (activeTool === 'measure_dist' || activeTool === 'measure_dip') {
            const worldPos = screenToWorld(mx, my);
            setMeasureStart(worldPos);
            setTempMeasureEnd(worldPos);
        } else if (activeTool === 'select') {
            const worldPos = screenToWorld(mx, my);
            const hitWell = projectionData?.wells.find(w => Math.abs(w.projection.distance - worldPos.x) < 50);
            if (hitWell) {
                onSelectionChange({ type: 'well', data: hitWell, projection: hitWell.projection });
            } else {
                onSelectionChange(null);
            }
        }
    };

    const handleMouseMove = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        if (isDragging && activeTool === 'pan') {
            const dx = e.clientX - lastPos.current.x;
            const dy = e.clientY - lastPos.current.y;
            lastPos.current = { x: e.clientX, y: e.clientY };
            setTransform(p => ({ ...p, x: p.x + dx, y: p.y + dy }));
        } else if (measureStart && (activeTool === 'measure_dist' || activeTool === 'measure_dip')) {
            const worldPos = screenToWorld(mx, my);
            setTempMeasureEnd(worldPos);
            
            const dx = Math.abs(worldPos.x - measureStart.x);
            const dy = Math.abs(worldPos.y - measureStart.y);
            const dist = Math.sqrt(dx*dx + dy*dy);
            const angle = Math.atan2(dy, dx) * (180/Math.PI);
            
            setMeasurementResult({ dx, dy, dist, angle });
        }
    };

    const handleMouseUp = () => {
        if (activeTool === 'pan') setIsDragging(false);
        if (measureStart) {
            setMeasureStart(null);
            setTempMeasureEnd(null);
        }
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const rect = canvasRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        
        setTransform(p => ({
            k: p.k * scaleFactor,
            x: mx - (mx - p.x) * scaleFactor,
            y: my - (my - p.y) * scaleFactor
        }));
    };

    return (
        <div className="w-full h-full bg-slate-950 overflow-hidden cursor-crosshair relative border border-slate-800">
            <canvas ref={bgCanvasRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />
            <canvas 
                ref={canvasRef}
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 10 }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            />
        </div>
    );
};

export default CrossSectionCanvas;