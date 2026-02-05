import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, AlertTriangle, ImageOff, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { parseSegy } from '@/utils/segy-parser';
import { useStudio } from '@/contexts/StudioContext';
import { COLOR_MAPS } from '@/utils/colorMaps';

const SectionView = ({ asset, parentSeismic, session, onPick }) => {
    const { toast } = useToast();
    const { getAssetFile, seismicState, setSeismicState, setSeismicViewParams, setSeismicTransform } = useStudio();
    const { seismicData, viewParams, transform, isLoading, error } = seismicState;
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const tempCanvasRef = useRef(document.createElement('canvas'));
    const overlayCanvasRef = useRef(null); // New canvas for horizons

    const isDragging = useRef(false);
    const lastPosition = useRef({ x: 0, y: 0 });
    const requestRef = useRef();

    // === 1. Optimized Rendering Loop ===
    const render = useCallback(() => {
        const canvas = canvasRef.current;
        const overlayCanvas = overlayCanvasRef.current;
        
        if (!canvas || !overlayCanvas) return;
        
        const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for opaque bg
        const overlayCtx = overlayCanvas.getContext('2d');

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        // Resize logic (debounced ideally, but here check active dims)
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            overlayCanvas.width = rect.width * dpr;
            overlayCanvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            overlayCtx.scale(dpr, dpr);
        } else {
             // Just clear if dims match
             ctx.clearRect(0, 0, rect.width, rect.height);
             overlayCtx.clearRect(0, 0, rect.width, rect.height);
        }

        // A. Draw Seismic (Base Layer)
        if (seismicData && seismicData.traces && seismicData.traces.length > 0 && tempCanvasRef.current.width > 0) {
            ctx.save();
            ctx.translate(transform.x, transform.y);
            ctx.scale(transform.k, transform.k);
            
            const { hx, vx } = viewParams;
            const tempCanvas = tempCanvasRef.current;
            const scaledWidth = tempCanvas.width * hx;
            const scaledHeight = tempCanvas.height * vx;

            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(tempCanvas, 0, 0, scaledWidth, scaledHeight);
            ctx.restore();
        } else {
            // Draw placeholder grid if empty
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1;
            ctx.beginPath();
            for(let i=0; i<rect.width; i+=50) { ctx.moveTo(i,0); ctx.lineTo(i, rect.height); }
            for(let j=0; j<rect.height; j+=50) { ctx.moveTo(0,j); ctx.lineTo(rect.width, j); }
            ctx.stroke();
        }

        // B. Draw Horizons / Interpretations (Overlay Layer)
        if (session && (session.interpretations.length > 0 || session.currentPicks.length > 0)) {
            overlayCtx.save();
            overlayCtx.translate(transform.x, transform.y);
            overlayCtx.scale(transform.k, transform.k);

            const drawPoints = (points, color, width = 2) => {
                if (!points || points.length === 0) return;
                overlayCtx.strokeStyle = color;
                overlayCtx.lineWidth = width / transform.k; // Keep consistent visual width
                overlayCtx.lineCap = 'round';
                overlayCtx.beginPath();
                // Points stored as {x, y} relative to seismic data grid
                // Need to scale by hx, vx
                points.forEach((pt, i) => {
                    const px = pt.x * viewParams.hx;
                    const py = pt.y * viewParams.vx;
                    if (i === 0) overlayCtx.moveTo(px, py);
                    else overlayCtx.lineTo(px, py);
                });
                overlayCtx.stroke();
            };

            // Draw saved horizons
            session.interpretations.forEach(interp => {
                const pts = interp.data?.points || [];
                drawPoints(pts, interp.style?.color || '#06b6d4');
            });

            // Draw current session picks (active editing)
            drawPoints(session.currentPicks, '#facc15', 3); // Yellow for active
            
            overlayCtx.restore();
        }

    }, [seismicData, viewParams, transform, session]);

    // Animation Loop
    useEffect(() => {
        const animate = () => {
            render();
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [render]);

    // === 2. Background Texture Generation ===
    useEffect(() => {
        if (!seismicData || !seismicData.traces || seismicData.traces.length === 0) return;

        const tempCanvas = tempCanvasRef.current;
        const ctx = tempCanvas.getContext('2d');

        const { traces, samplesPerTrace, stats } = seismicData;
        const { pclip, gain, colorMap } = viewParams;

        const displayWidth = traces.length;
        const displayHeight = samplesPerTrace;

        // Only resize if changed significantly to avoid thrashing
        if(tempCanvas.width !== displayWidth || tempCanvas.height !== displayHeight) {
            tempCanvas.width = displayWidth;
            tempCanvas.height = displayHeight;
        }

        const imageData = ctx.createImageData(displayWidth, displayHeight);
        const data = imageData.data;

        // Pre-calc range
        const halfRange = (stats.max - stats.min) * (100 - pclip) / 200;
        const pclipMin = stats.min + halfRange;
        const pclipMax = stats.max - halfRange;
        const range = pclipMax - pclipMin || 1;
        
        const colorFn = (COLOR_MAPS[colorMap] || COLOR_MAPS.grayscale).fn;

        // Optimization: simple loop
        for (let i = 0; i < traces.length; i++) {
            const trace = traces[i];
            for (let j = 0; j < samplesPerTrace; j++) {
                let value = trace[j] * gain;
                // Clamp
                if (value < pclipMin) value = pclipMin;
                if (value > pclipMax) value = pclipMax;
                
                const normalizedValue = (value - pclipMin) / range;
                const [r, g, b] = colorFn(normalizedValue);

                const pixelIndex = (j * displayWidth + i) * 4;
                data[pixelIndex] = r;
                data[pixelIndex + 1] = g;
                data[pixelIndex + 2] = b;
                data[pixelIndex + 3] = 255;
            }
        }
        ctx.putImageData(imageData, 0, 0);
        // No need to trigger drawSeismic(), animation loop handles it
    }, [seismicData, viewParams.pclip, viewParams.gain, viewParams.colorMap]);


    // === 3. Data Fetching Logic ===
    const fetchAndParseSeismic = useCallback(async (sliceType, sliceIndex) => {
        if (!asset || !parentSeismic) {
            setSeismicState(prev => ({...prev, seismicData: null, error: null}));
            return;
        }
        setSeismicState(prev => ({...prev, isLoading: true, error: null}));
        try {
            const file = await getAssetFile(parentSeismic);
            if (!file) throw new Error('Seismic data file not found.');
            
            const sliceData = await parseSegy(file, sliceType, sliceIndex);
            if (sliceData.error) throw new Error(sliceData.error);

            if (!sliceData.traces || sliceData.traces.length === 0) {
                setSeismicState(prev => ({ ...prev, seismicData: null, error: `No traces found for ${sliceType} ${sliceIndex}.` }));
            } else {
                setSeismicState(prev => ({ ...prev, seismicData: sliceData, error: null }));
            }
        } catch (err) {
            console.error('Failed to load or parse seismic section:', err);
            setSeismicState(prev => ({ ...prev, error: err.message, seismicData: null }));
        } finally {
            setSeismicState(prev => ({...prev, isLoading: false}));
        }
    }, [asset, parentSeismic, getAssetFile, setSeismicState]);

    useEffect(() => {
        const isNewParent = parentSeismic && (!seismicData || (seismicData.parentUri && seismicData.parentUri !== parentSeismic.uri));

        if (asset?.meta || isNewParent) {
            const newIndex = asset?.meta?.index || viewParams.index;
            const newSliceType = asset?.meta?.sectionType || viewParams.sliceType;

            const hasChanged = 
                viewParams.index !== newIndex ||
                viewParams.sliceType !== newSliceType ||
                isNewParent ||
                !seismicData;

            if (hasChanged) {
                setSeismicViewParams({ index: newIndex, sliceType: newSliceType });
                fetchAndParseSeismic(newSliceType, newIndex);
            }
        }
    }, [asset, parentSeismic, fetchAndParseSeismic, setSeismicViewParams, viewParams, seismicData]);


    const handleSliceChange = (newIndex) => {
        const { min, max } = getIndexRange();
        const clampedIndex = Math.max(min, Math.min(max, newIndex));
        setSeismicViewParams({ index: clampedIndex });
        fetchAndParseSeismic(viewParams.sliceType, clampedIndex);
    };
    
    const resetZoomAndPan = useCallback(() => {
        if (!canvasRef.current || !seismicData) return;
        
        const { clientWidth, clientHeight } = canvasRef.current;
        const { hx, vx } = viewParams;
        const { traces, samplesPerTrace } = seismicData;
        const dataWidth = traces.length * hx;
        const dataHeight = samplesPerTrace * vx;

        const scaleX = clientWidth / dataWidth;
        const scaleY = clientHeight / dataHeight;
        const k = Math.min(scaleX, scaleY) * 0.9; // fit with 10% margin
        
        const x = (clientWidth - dataWidth * k) / 2;
        const y = (clientHeight - dataHeight * k) / 2;
        
        setSeismicTransform({ x, y, k });
    }, [seismicData, viewParams, setSeismicTransform]);
    
    // Auto-fit on data load
    useEffect(() => {
       if(seismicData) resetZoomAndPan();
    }, [seismicData?.traces?.length]); // Only when data dimensions change


     // === 4. Interaction Handlers ===
     const handleWheel = (e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const scaleFactor = 1.1;
        const newTransform = { ...transform };
        
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const zoomFactor = e.deltaY < 0 ? scaleFactor : 1 / scaleFactor;
        
        // Zoom centered on mouse
        newTransform.x = mouseX - (mouseX - newTransform.x) * zoomFactor;
        newTransform.y = mouseY - (mouseY - newTransform.y) * zoomFactor;
        newTransform.k *= zoomFactor;
        
        setSeismicTransform(newTransform);
    };

    const handleMouseDown = (e) => {
        // If we are in picking mode and clicking on the canvas (not dragging view)
        if (session && session.activeTool !== 'pointer') {
             const canvas = canvasRef.current;
             if (!canvas) return;
             const rect = canvas.getBoundingClientRect();
             const mouseX = e.clientX - rect.left;
             const mouseY = e.clientY - rect.top;

             // Convert screen coords to data coords
             const dataX = (mouseX - transform.x) / transform.k / viewParams.hx;
             const dataY = (mouseY - transform.y) / transform.k / viewParams.vx;
             
             if(onPick) onPick({ x: dataX, y: dataY, traceIndex: Math.round(dataX), time: dataY });
             return; // Don't drag view if picking
        }

        isDragging.current = true;
        lastPosition.current = { x: e.clientX, y: e.clientY };
        if (containerRef.current) containerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastPosition.current.x;
        const dy = e.clientY - lastPosition.current.y;
        lastPosition.current = { x: e.clientX, y: e.clientY };
        setSeismicTransform({ ...transform, x: transform.x + dx, y: transform.y + dy });
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        if (containerRef.current) containerRef.current.style.cursor = session?.activeTool === 'pointer' ? 'grab' : 'crosshair';
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        container.addEventListener('wheel', handleWheel, { passive: false });
        container.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        
        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [transform, setSeismicTransform, session?.activeTool]);

    const getIndexRange = () => {
        if (!parentSeismic?.meta) return { min: 0, max: 0, step: 1 };
        const meta = parentSeismic.meta;
        if (viewParams.sliceType === 'inline') return { min: meta.il_min || 0, max: meta.il_max || 0, step: meta.il_step || 1 };
        if (viewParams.sliceType === 'crossline') return { min: meta.xl_min || 0, max: meta.xl_max || 0, step: meta.xl_step || 1 };
        if (viewParams.sliceType === 'z-slice') return { min: Math.round(meta.z_min || 0), max: Math.round(meta.z_max || meta.nsamp * meta.dt_ms), step: Math.round(meta.dt_ms || 4) };
        return { min: 0, max: 0, step: 1 };
    };
    const indexRange = getIndexRange();

    const renderContent = () => {
        if (!asset) return <div className="flex flex-col items-center justify-center h-full text-slate-500 bg-slate-950"><ImageOff className="w-16 h-16 mb-4" /> <p className="text-lg">No Seismic Section Selected</p></div>;
        if (isLoading && !seismicData) return <div className="flex flex-col items-center justify-center h-full text-cyan-400 bg-slate-950"><Loader2 className="w-16 h-16 animate-spin mb-4" /> <p className="text-lg">Parsing Seismic Data...</p></div>;
        if (error) return <div className="flex flex-col items-center justify-center h-full text-amber-400 bg-slate-950"><AlertTriangle className="w-16 h-16 mb-4" /> <p className="text-lg">Error: {error}</p></div>;
        
        return (
            <div ref={containerRef} className="w-full h-full overflow-hidden relative bg-black" style={{ cursor: session?.activeTool === 'pointer' ? 'grab' : 'crosshair' }}>
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
                <canvas ref={overlayCanvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
                {isLoading && <div className="absolute top-2 left-2 bg-slate-900/50 p-2 rounded-full"><Loader2 className="w-6 h-6 text-cyan-400 animate-spin" /></div>}
            </div>
        );
    };

    const getSliderLabel = () => {
        switch(viewParams.sliceType) {
            case 'inline': return 'Inline';
            case 'crossline': return 'Crossline';
            case 'z-slice': return 'Time Slice';
            default: return 'Index';
        }
    };

    return (
        <div className="h-full w-full flex flex-col bg-slate-900">
            <div className="flex-grow relative bg-slate-950 overflow-hidden">
                {renderContent()}
            </div>
            <div className="p-3 border-t border-slate-800 text-xs shrink-0 bg-slate-900/80 backdrop-blur-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div className="space-y-2">
                        <Label className="text-slate-300">{getSliderLabel()}: {viewParams.index}</Label>
                        <Slider min={indexRange.min} max={indexRange.max} step={indexRange.step} value={[viewParams.index]} onValueChange={([val]) => handleSliceChange(val)} disabled={isLoading} />
                        <div className="text-slate-400 flex justify-between text-[10px]">
                            <span>{indexRange.min}</span>
                            <span>{indexRange.max}</span>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <div className="flex justify-between"><Label className="text-slate-300">V. Exag: {viewParams.vx.toFixed(1)}x</Label><Label className="text-slate-300">H. Sqz: {viewParams.hx.toFixed(1)}x</Label></div>
                        <div className="flex gap-2">
                            <Slider min={0.1} max={5} step={0.1} value={[viewParams.vx]} onValueChange={([val]) => setSeismicViewParams({ vx: val })} />
                            <Slider min={0.1} max={5} step={0.1} value={[viewParams.hx]} onValueChange={([val]) => setSeismicViewParams({ hx: val })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between"><Label className="text-slate-300">Gain: {viewParams.gain.toFixed(1)}</Label><Label className="text-slate-300">Clip: {viewParams.pclip}%</Label></div>
                        <div className="flex gap-2">
                             <Slider min={0.1} max={5} step={0.1} value={[viewParams.gain]} onValueChange={([val]) => setSeismicViewParams({ gain: val })} />
                             <Slider min={80} max={100} step={1} value={[viewParams.pclip]} onValueChange={([val]) => setSeismicViewParams({ pclip: val })} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="colorMap" className="text-slate-300">Color Map</Label>
                        <Select value={viewParams.colorMap} onValueChange={(v) => setSeismicViewParams({ colorMap: v })}>
                            <SelectTrigger id="colorMap" className="h-8"><SelectValue placeholder="Select..." /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(COLOR_MAPS).map(([key, { name }]) => (
                                    <SelectItem key={key} value={key}>{name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         <Button variant="outline" size="sm" onClick={resetZoomAndPan} className="w-full mt-2 h-7">
                            <Repeat className="w-3 h-3 mr-2"/>
                            Reset View
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionView;