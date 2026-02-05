import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useStudio } from '@/contexts/StudioContext';
import { Loader2, ImageOff, MousePointer2 } from 'lucide-react';
import { COLOR_MAPS } from '@/utils/colorMaps';

const SeismicDataDisplay = ({ asset, parentSeismic, session, onPick, layers, displaySettings }) => {
    const { seismicState, setSeismicState, setSeismicTransform } = useStudio();
    const { seismicData, viewParams, transform, isLoading } = seismicState;
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const tempCanvasRef = useRef(document.createElement('canvas'));
    const overlayCanvasRef = useRef(null);

    const isDragging = useRef(false);
    const lastPosition = useRef({ x: 0, y: 0 });
    const requestRef = useRef();
    const [cursorInfo, setCursorInfo] = useState(null);

    // === RENDERING LOOP ===
    const render = useCallback(() => {
        const canvas = canvasRef.current;
        const overlayCanvas = overlayCanvasRef.current;
        
        if (!canvas || !overlayCanvas) return;
        
        const ctx = canvas.getContext('2d', { alpha: false });
        const overlayCtx = overlayCanvas.getContext('2d');

        const dpr = window.devicePixelRatio || 1;
        const rect = containerRef.current.getBoundingClientRect();
        
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            overlayCanvas.width = rect.width * dpr;
            overlayCanvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            overlayCtx.scale(dpr, dpr);
        } else {
             ctx.clearRect(0, 0, rect.width, rect.height);
             overlayCtx.clearRect(0, 0, rect.width, rect.height);
        }

        // A. Base Seismic
        if (layers.seismic.visible && seismicData && seismicData.traces && tempCanvasRef.current.width > 0) {
            ctx.save();
            ctx.translate(transform.x, transform.y);
            ctx.scale(transform.k, transform.k);
            ctx.globalAlpha = layers.seismic.opacity;
            
            const { hx, vx } = viewParams;
            const tempCanvas = tempCanvasRef.current;
            const scaledWidth = tempCanvas.width * hx;
            const scaledHeight = tempCanvas.height * vx;

            ctx.imageSmoothingEnabled = false; // Pixelated look for seismic
            ctx.drawImage(tempCanvas, 0, 0, scaledWidth, scaledHeight);
            ctx.restore();
        }

        // B. Overlays
        overlayCtx.save();
        overlayCtx.translate(transform.x, transform.y);
        overlayCtx.scale(transform.k, transform.k);

        // 1. Horizons
        if (layers.horizons.visible && session?.interpretations) {
            session.interpretations.filter(i => i.kind === 'horizon').forEach(interp => {
                const pts = interp.data?.points || [];
                if (pts.length < 2) return;
                
                overlayCtx.strokeStyle = interp.style?.color || '#06b6d4';
                overlayCtx.lineWidth = (interp.style?.width || 2) / transform.k;
                overlayCtx.lineCap = 'round';
                overlayCtx.lineJoin = 'round';
                overlayCtx.beginPath();
                pts.forEach((pt, i) => {
                    const px = pt.x * viewParams.hx;
                    const py = pt.y * viewParams.vx;
                    if (i === 0) overlayCtx.moveTo(px, py);
                    else overlayCtx.lineTo(px, py);
                });
                overlayCtx.stroke();
            });
        }

        // 2. Faults
        if (layers.faults.visible && session?.interpretations) {
            session.interpretations.filter(i => i.kind === 'fault').forEach(interp => {
                const pts = interp.data?.points || [];
                if (pts.length < 2) return;
                
                overlayCtx.strokeStyle = interp.style?.color || '#f59e0b';
                overlayCtx.lineWidth = (interp.style?.width || 2) / transform.k;
                overlayCtx.beginPath();
                pts.forEach((pt, i) => {
                    const px = pt.x * viewParams.hx;
                    const py = pt.y * viewParams.vx;
                    if (i === 0) overlayCtx.moveTo(px, py);
                    else overlayCtx.lineTo(px, py);
                });
                overlayCtx.stroke();
            });
        }

        // 3. Active Picks (Session)
        if (session?.currentPicks && session.currentPicks.length > 0) {
            const pts = session.currentPicks;
            const isFault = session.activeTool === 'fault';
            overlayCtx.strokeStyle = isFault ? '#f59e0b' : '#facc15';
            overlayCtx.lineWidth = 3 / transform.k;
            if(isFault) overlayCtx.setLineDash([5/transform.k, 5/transform.k]);
            
            overlayCtx.beginPath();
            pts.forEach((pt, i) => {
                const px = pt.x * viewParams.hx;
                const py = pt.y * viewParams.vx;
                if (i === 0) overlayCtx.moveTo(px, py);
                else overlayCtx.lineTo(px, py);
            });
            overlayCtx.stroke();
            overlayCtx.setLineDash([]);
            
            // Draw pick points
            overlayCtx.fillStyle = isFault ? '#f59e0b' : '#facc15';
            pts.forEach(pt => {
                overlayCtx.beginPath();
                overlayCtx.arc(pt.x * viewParams.hx, pt.y * viewParams.vx, 3/transform.k, 0, Math.PI * 2);
                overlayCtx.fill();
            });
        }

        // 4. Wells (Projected)
        if (layers.wells.visible && seismicData && session?.projectedWells) {
            session.projectedWells.forEach(w => {
                const x = w.x * viewParams.hx;
                overlayCtx.strokeStyle = 'white';
                overlayCtx.lineWidth = 1 / transform.k;
                overlayCtx.setLineDash([10/transform.k, 5/transform.k]);
                overlayCtx.beginPath();
                overlayCtx.moveTo(x, 0);
                overlayCtx.lineTo(x, seismicData.samplesPerTrace * viewParams.vx);
                overlayCtx.stroke();
                overlayCtx.setLineDash([]);
                
                // Name
                overlayCtx.save();
                overlayCtx.translate(x, 20 / transform.k);
                overlayCtx.scale(1/transform.k, 1/transform.k);
                overlayCtx.fillStyle = 'white';
                overlayCtx.font = '12px sans-serif';
                overlayCtx.shadowColor = 'black';
                overlayCtx.shadowBlur = 4;
                overlayCtx.fillText(w.name, 5, 0);
                overlayCtx.restore();
            });
        }

        overlayCtx.restore();

    }, [seismicData, viewParams, transform, session, layers, displaySettings]);

    useEffect(() => {
        const animate = () => {
            render();
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [render]);

    // === SEISMIC TEXTURE GENERATION (Optimized) ===
    useEffect(() => {
        if (!seismicData || !seismicData.traces) return;

        const tempCanvas = tempCanvasRef.current;
        const ctx = tempCanvas.getContext('2d');
        const { traces, samplesPerTrace, stats } = seismicData;
        const { pclip, gain, colorMap } = viewParams;
        const { brightness, contrast, amplitudeScaling } = displaySettings;

        if(tempCanvas.width !== traces.length || tempCanvas.height !== samplesPerTrace) {
            tempCanvas.width = traces.length;
            tempCanvas.height = samplesPerTrace;
        }

        const imageData = ctx.createImageData(traces.length, samplesPerTrace);
        const data = imageData.data;
        const range = ((stats.max - stats.min) * (100 - pclip) / 200) || 1;
        const colorFn = (COLOR_MAPS[colorMap] || COLOR_MAPS.grayscale).fn;

        // Pre-calculate contrast factor
        const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

        for (let i = 0; i < traces.length; i++) {
            const trace = traces[i];
            for (let j = 0; j < samplesPerTrace; j++) {
                let val = trace[j] * gain;
                
                if (amplitudeScaling === 'log') {
                    val = Math.sign(val) * Math.log1p(Math.abs(val));
                } else if (amplitudeScaling === 'power') {
                    val = Math.sign(val) * Math.pow(Math.abs(val), 0.5);
                }

                // Basic clipping
                if (val > range) val = range;
                if (val < -range) val = -range;
                
                let norm = (val + range) / (2 * range);
                
                // Color Mapping
                let [r, g, b] = colorFn(norm);

                // Brightness & Contrast
                if (brightness !== 0 || contrast !== 0) {
                    r = contrastFactor * (r - 128) + 128 + brightness;
                    g = contrastFactor * (g - 128) + 128 + brightness;
                    b = contrastFactor * (b - 128) + 128 + brightness;
                }

                const idx = (j * traces.length + i) * 4;
                data[idx] = r < 0 ? 0 : (r > 255 ? 255 : r);
                data[idx+1] = g < 0 ? 0 : (g > 255 ? 255 : g);
                data[idx+2] = b < 0 ? 0 : (b > 255 ? 255 : b);
                data[idx+3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    }, [seismicData, viewParams.pclip, viewParams.gain, viewParams.colorMap, displaySettings]);

    // === INTERACTION ===
    const handleWheel = (e) => {
        e.preventDefault();
        const rect = containerRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const factor = e.deltaY > 0 ? 0.9 : 1.1;
        
        setSeismicTransform(p => ({
            k: Math.max(0.1, Math.min(p.k * factor, 50)),
            x: mx - (mx - p.x) * factor,
            y: my - (my - p.y) * factor
        }));
    };

    const handleMouseDown = (e) => {
        if (session?.activeTool !== 'pan' && onPick) {
            const rect = containerRef.current.getBoundingClientRect();
            const mx = (e.clientX - rect.left - transform.x) / transform.k / viewParams.hx;
            const my = (e.clientY - rect.top - transform.y) / transform.k / viewParams.vx;
            onPick({ x: mx, y: my });
            return;
        }
        isDragging.current = true;
        lastPosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        
        // Update cursor info
        const dataX = Math.floor((mx - transform.x) / transform.k / viewParams.hx);
        const dataY = Math.floor((my - transform.y) / transform.k / viewParams.vx);
        
        if (seismicData?.traces && dataX >= 0 && dataX < seismicData.traces.length && dataY >= 0 && dataY < seismicData.samplesPerTrace) {
            const amp = seismicData.traces[dataX][dataY];
            setCursorInfo({
                trace: dataX,
                sample: dataY,
                amp: amp.toFixed(2),
                screenX: mx,
                screenY: my
            });
        } else {
            setCursorInfo(null);
        }

        if (!isDragging.current) return;
        const dx = e.clientX - lastPosition.current.x;
        const dy = e.clientY - lastPosition.current.y;
        lastPosition.current = { x: e.clientX, y: e.clientY };
        setSeismicTransform(p => ({ ...p, x: p.x + dx, y: p.y + dy }));
    };

    const handleMouseUp = () => { isDragging.current = false; };

    return (
        <div 
            ref={containerRef} 
            className="w-full h-full bg-black relative overflow-hidden cursor-crosshair"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <canvas ref={canvasRef} className="absolute inset-0" />
            <canvas ref={overlayCanvasRef} className="absolute inset-0 pointer-events-none" />
            
            {/* Cursor Info Tooltip */}
            {cursorInfo && (
                <div 
                    className="absolute pointer-events-none bg-black/80 text-xs text-white p-1 rounded border border-slate-700 z-50 flex flex-col gap-0.5"
                    style={{ left: cursorInfo.screenX + 15, top: cursorInfo.screenY + 15 }}
                >
                    <div className="flex gap-2"><span>Trace:</span><span className="font-mono text-cyan-400">{cursorInfo.trace}</span></div>
                    <div className="flex gap-2"><span>Sample:</span><span className="font-mono text-cyan-400">{cursorInfo.sample}</span></div>
                    <div className="flex gap-2"><span>Amp:</span><span className="font-mono text-yellow-400">{cursorInfo.amp}</span></div>
                </div>
            )}

            {isLoading && <div className="absolute center bg-slate-900/50 p-4 rounded"><Loader2 className="animate-spin text-cyan-400" /></div>}
            {!seismicData && !isLoading && <div className="flex items-center justify-center h-full text-slate-500"><ImageOff className="w-12 h-12 mr-2" /> No Data Loaded</div>}
        </div>
    );
};

export default SeismicDataDisplay;