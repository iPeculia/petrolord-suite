import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStudio } from '@/contexts/StudioContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Waypoints, Plus, Minus, Settings, ListTree, GripVertical, Sun, Moon, PanelLeftOpen, PanelLeftClose, Spline, MinusSquare, Save, Layers } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import * as d3 from 'd3';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getDistance } from 'geolib';

const ItemTypes = { WELL_TRACK: 'wellTrack' };

const DraggableWellTrack = ({ well, curves, tops, scale, shift, width, index, moveTrack, onShift, spacing, theme, onTopClick, correlation, trackRef, svgRef, ...props }) => {
    const dndRef = useRef(null);
    const [{ handlerId }, drop] = useDrop({
        accept: ItemTypes.WELL_TRACK,
        collect(monitor) { return { handlerId: monitor.getHandlerId() }; },
        hover(item, monitor) {
            if (!dndRef.current || spacing.mode !== 'manual') return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;
            moveTrack(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag, preview] = useDrag({
        type: ItemTypes.WELL_TRACK,
        item: () => ({ id: well.id, index }),
        collect: (monitor) => ({ isDragging: monitor.isDragging() }),
        canDrag: spacing.mode === 'manual',
    });

    drag(drop(dndRef));

    return (
        <div ref={preview} style={{ opacity: isDragging ? 0.4 : 1, ...props.style }} data-handler-id={handlerId} className="flex-shrink-0 h-full">
            <WellTrack ref={dndRef} well={well} curves={curves} tops={tops} scale={scale} shift={shift} width={width} onShift={onShift} canDrag={spacing.mode === 'manual'} theme={theme} onTopClick={onTopClick} correlation={correlation} trackRef={trackRef} svgRef={svgRef} />
        </div>
    );
};

const WellTrack = React.forwardRef(({ well, curves, tops, scale, shift, width, onShift, canDrag, theme, onTopClick, correlation, trackRef, svgRef }, ref) => {
    const localTrackRef = useRef(null);
    const headerHeight = 80;
    const depthAxisWidth = 60;
    const textColor = theme === 'dark' ? 'white' : 'black';
    const axisColor = theme === 'dark' ? '#555' : '#aaa';
    const gridColor = theme === 'dark' ? '#444' : '#eee';
    const trackBgColor = theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-200/50';
    const headerBgColor = theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200';
    const borderColor = theme === 'dark' ? 'border-slate-600' : 'border-slate-300';
    
    useEffect(() => {
        if (!localTrackRef.current || !well.meta?.data) return;

        const svg = d3.select(localTrackRef.current);
        svg.selectAll("*").remove();
        
        const g = svg.append("g").attr("transform", `translate(0, ${headerHeight})`);
        
        const primaryDepthCurve = well.meta.curves.find(c => ['MD', 'DEPT', 'DEPTH'].includes(c.toUpperCase()));
        if (!primaryDepthCurve) return;
        
        const validCurves = curves.filter(c => well.meta.curves.includes(c.name));
        const curveWidth = validCurves.length > 0 ? (width - depthAxisWidth) / validCurves.length : 0;
        
        const visibleDepthDomain = [scale.invert(0 - shift), scale.invert(800 - shift)]; // approx view height
        const depthScale = d3.scaleLinear().domain(scale.domain()).range(scale.range());
        
        const depthAxisGroup = g.append("g")
            .attr("class", "depth-axis")
            .attr("transform", `translate(${depthAxisWidth}, ${shift})`);
        
        depthAxisGroup.call(d3.axisLeft(depthScale).ticks(20))
            .call(g => g.selectAll("text").attr("fill", textColor))
            .call(g => g.selectAll(".domain, .tick line").attr("stroke", axisColor));

        validCurves.forEach((curveInfo, i) => {
            const curveGroup = g.append("g").attr("transform", `translate(${depthAxisWidth + i * curveWidth}, ${shift})`);
            const xScale = d3.scaleLinear().domain(curveInfo.scale || d3.extent(well.meta.data, d => d[curveInfo.name])).range([0, curveWidth]);
            
            const line = d3.line()
                .x(d => xScale(d[curveInfo.name]))
                .y(d => depthScale(d[primaryDepthCurve]))
                .defined(d => d[curveInfo.name] != null);
            
            curveGroup.append("path")
                .datum(well.meta.data)
                .attr("fill", "none")
                .attr("stroke", curveInfo.color || "cyan")
                .attr("stroke-width", 1.5)
                .attr("d", line);
        });

        // Draw Tops
        const topsGroup = g.append("g").attr("transform", `translate(0, ${shift})`);
        (well.meta?.tops || []).forEach(top => {
             topsGroup.append("line")
                .attr("x1", 0).attr("x2", width)
                .attr("y1", depthScale(top.depth)).attr("y2", depthScale(top.depth))
                .attr("stroke", top.color || 'yellow').attr("stroke-dasharray", "4 2");
            
            topsGroup.append("text")
                .attr("x", depthAxisWidth + 5)
                .attr("y", depthScale(top.depth) - 4)
                .attr("fill", top.color || 'yellow')
                .attr("font-size", "12px")
                .attr("class", "cursor-pointer")
                .text(top.name)
                .on("click", (event) => onTopClick(event, well, top));
        });
        
    }, [well, curves, scale, shift, width, theme]);

    return (
        <div ref={ref} className={`h-full border-r relative ${trackBgColor} ${borderColor}`} style={{ width: `${width}px` }} data-well-id={well.id} >
            <div className={`h-[80px] text-center font-bold p-2 border-b flex flex-col items-center justify-center ${headerBgColor} ${borderColor} ${textColor}`}>
                <div className='flex items-center'>
                    {canDrag && <GripVertical className="cursor-move text-slate-400 mr-2" />}
                    <span className="truncate">{well.name}</span>
                </div>
                 <div className="flex items-center space-x-1 mt-1">
                    <Button size="sm" variant={theme === 'dark' ? "outline" : "secondary"} className="h-6 px-2" onClick={() => onShift(well.id, 'up')}>Up</Button>
                    <Button size="sm" variant={theme === 'dark' ? "outline" : "secondary"} className="h-6 px-2" onClick={() => onShift(well.id, 'down')}>Down</Button>
                </div>
            </div>
            <div ref={trackRef} className="h-[calc(100%-80px)] w-full overflow-hidden">
                <svg ref={svgRef} width="100%" height={scale.range()[1]} style={{ transform: `translateY(${shift}px)` }} >
                    <g ref={localTrackRef}></g>
                </svg>
            </div>
        </div>
    );
});


const MainWellSectionView = () => {
    const { allAssets, allInterpretations, setAllInterpretations, activeProject } = useStudio();
    const { user } = useAuth();
    const { toast } = useToast();
    const [selectedWells, setSelectedWells] = useState([]);
    const [availableWells, setAvailableWells] = useState([]);
    const [availableCurves, setAvailableCurves] = useState([]);
    const [displayCurves, setDisplayCurves] = useState([]);
    const [verticalScale, setVerticalScale] = useState(0.1);
    const [trackShifts, setTrackShifts] = useState({});
    const [orderedWells, setOrderedWells] = useState([]);
    const [spacing, setSpacing] = useState({ mode: 'constant', value: 20 });
    const [isPanelOpen, setPanelOpen] = useState(true);
    const [theme, setTheme] = useState('dark');
    const [correlation, setCorrelation] = useState({ points: [], lineType: 'spline', inProgress: false });
    const [zoneShading, setZoneShading] = useState({ enabled: false, from: null, to: null, color: 'rgba(255, 235, 59, 0.3)' });
    const correlationLinesRef = useRef(null);

    const textColor = theme === 'dark' ? 'text-white' : 'text-slate-800';
    const panelBgColor = theme === 'dark' ? 'bg-slate-900/95' : 'bg-slate-100/95';
    const borderColor = theme === 'dark' ? 'border-slate-700' : 'border-slate-300';

    useEffect(() => {
        const wellsWithData = allAssets.filter(a => a.type === 'well' && a.meta?.data && a.meta?.location);
        setAvailableWells(wellsWithData);

        const allCurves = [...new Set(wellsWithData.flatMap(w => w.meta?.curves || []))];
        const defaultCurves = [
            { name: 'GR', color: '#00FF00', scale: [0, 150] },
            { name: 'RHOB', color: '#FF0000', scale: [1.95, 2.95] },
            { name: 'NPHI', color: '#0000FF', scale: [0.45, -0.15] },
            { name: 'RT', color: '#FF00FF', scale: [0.2, 2000] }
        ];
        const curveConfig = allCurves.map(c => defaultCurves.find(dc => dc.name === c) || { name: c, color: '#FFFFFF', scale: d3.extent(wellsWithData.flatMap(w => w.meta.data), d => d[c]) });
        setAvailableCurves(curveConfig);
        setDisplayCurves(curveConfig.filter(c => ['GR', 'RHOB', 'NPHI'].includes(c.name)));
    }, [allAssets]);

    useEffect(() => {
        const initialOrder = availableWells.filter(w => selectedWells.includes(w.id));
        setOrderedWells(initialOrder);
        setTrackShifts({});
    }, [selectedWells, availableWells]);

    const handleWellSelection = (wellId) => {
        setSelectedWells(prev => prev.includes(wellId) ? prev.filter(id => id !== wellId) : [...prev, wellId]);
    };

    const handleCurveSelection = (curveName) => {
        const curve = availableCurves.find(c => c.name === curveName);
        if (!curve) return;
        setDisplayCurves(prev => prev.some(c => c.name === curveName) ? prev.filter(c => c.name !== curveName) : [...prev, curve]);
    };

    const handleShift = (wellId, direction) => {
        setTrackShifts(prev => ({ ...prev, [wellId]: (prev[wellId] || 0) + (direction === 'up' ? -20 : 20) }));
    };

    const moveTrack = useCallback((dragIndex, hoverIndex) => {
        setOrderedWells(prev => {
            const newOrder = [...prev];
            const [dragged] = newOrder.splice(dragIndex, 1);
            newOrder.splice(hoverIndex, 0, dragged);
            return newOrder;
        });
    }, []);
    
    const handleTopClick = (event, well, top) => {
        event.stopPropagation();
        if (!correlation.inProgress) return;
        
        const trackElement = event.currentTarget.closest('[data-well-id]');
        const { left, top: trackTop } = trackElement.getBoundingClientRect();
        const mainViewRect = trackElement.parentElement.parentElement.getBoundingClientRect();

        const x = left - mainViewRect.left + (trackElement.offsetWidth / 2);
        const y = event.clientY - mainViewRect.top;

        const newPoint = { wellId: well.id, topName: top.name, x, y };
        setCorrelation(prev => ({...prev, points: [...prev.points, newPoint]}));
    };

    const handleSaveCorrelation = async () => {
        if (correlation.points.length < 2) {
            toast({ variant: 'destructive', title: "Not enough points", description: "Need at least two tops to create a correlation." });
            return;
        }

        const name = `Corr: ${correlation.points.map(p => p.topName).join('-')}`;
        const geojson = { type: 'Feature', geometry: { type: correlation.lineType === 'spline' ? 'LineString' : 'LineString', coordinates: correlation.points.map(p => [p.x, p.y]) }, properties: { name, wellIds: correlation.points.map(p => p.wellId), topNames: correlation.points.map(p => p.topName), lineType: correlation.lineType } };
        
        const { data, error } = await supabase.from('ss_interpretations').insert({ project_id: activeProject.id, name, kind: 'horizon', data: { points: correlation.points }, geojson, created_by: user.id }).select();

        if (error) { toast({ variant: 'destructive', title: "Failed to save correlation", description: error.message }); }
        else {
            toast({ title: "Correlation saved!" });
            setAllInterpretations(prev => [...prev, ...data]);
            setCorrelation({ points: [], lineType: 'spline', inProgress: false });
        }
    };
    
    const minDepth = Math.min(0, ...orderedWells.flatMap(w => w.meta.data.map(d => d[w.meta.curves.find(c => ['MD', 'DEPT', 'DEPTH'].includes(c.toUpperCase()))])));
    const maxDepth = Math.max(0, ...orderedWells.flatMap(w => w.meta.data.map(d => d[w.meta.curves.find(c => ['MD', 'DEPT', 'DEPTH'].includes(c.toUpperCase()))])));
    const depthScale = d3.scaleLinear().domain([minDepth, maxDepth]).range([0, (maxDepth - minDepth) * verticalScale]);

    useEffect(() => {
        // Draw correlation lines
        if (!correlationLinesRef.current) return;
        const svg = d3.select(correlationLinesRef.current);
        svg.selectAll('*').remove();

        const drawLine = (points, color, type) => {
            let lineGenerator;
            if (type === 'spline') {
                lineGenerator = d3.line().x(d => d.x).y(d => d.y).curve(d3.curveCatmullRom);
            } else {
                lineGenerator = d3.line().x(d => d.x).y(d => d.y);
            }
            svg.append('path').datum(points).attr('d', lineGenerator).attr('stroke', color).attr('stroke-width', 2).attr('fill', 'none');
        };

        // Draw in-progress line
        if (correlation.inProgress && correlation.points.length > 0) {
            drawLine(correlation.points, 'cyan', correlation.lineType);
        }

        // Draw saved interpretations
        allInterpretations.filter(i => i.kind === 'horizon' && i.data?.points).forEach(interp => {
            const points = interp.data.points;
            const updatedPoints = points.map(p => {
                const trackEl = document.querySelector(`[data-well-id="${p.wellId}"]`);
                if (!trackEl) return null;
                const rect = trackEl.getBoundingClientRect();
                const mainViewRect = trackEl.parentElement.parentElement.getBoundingClientRect();
                const well = orderedWells.find(w => w.id === p.wellId);
                const top = well?.meta.tops.find(t => t.name === p.topName);
                if(!top) return null;

                const shift = trackShifts[p.wellId] || 0;
                const y = depthScale(top.depth) + shift + 80; // header height
                
                return { ...p, x: rect.left - mainViewRect.left + rect.width / 2, y };
            }).filter(Boolean);
            
            if (updatedPoints.length > 1) {
                drawLine(updatedPoints, '#FFD700', interp.data.lineType || 'spline');
            }
        });
        
        // Draw zone shading
        if (zoneShading.enabled && zoneShading.from && zoneShading.to) {
            const fromPoints = allInterpretations.find(i => i.id === zoneShading.from)?.data.points;
            const toPoints = allInterpretations.find(i => i.id === zoneShading.to)?.data.points;

            if(fromPoints && toPoints) {
                // This is a simplified drawing logic. A robust one would need polygon clipping.
                const areaPoints = [...fromPoints, ...[...toPoints].reverse()];
                const areaGenerator = d3.area().x(d=>d.x).y0(d=>d.y).y1(d=>d.y).curve(d3.curveCatmullRom);
                svg.append('path').datum(areaPoints).attr('d', areaGenerator(areaPoints)).attr('fill', zoneShading.color);
            }
        }

    }, [correlation, allInterpretations, trackShifts, depthScale, orderedWells, zoneShading]);
    
    const controlPanel = (
        <div className={`h-full flex flex-col ${panelBgColor} ${textColor}`}>
            <h3 className={`font-bold p-4 border-b ${borderColor} flex items-center`}><ListTree className="mr-2 h-5 w-5" />Controls</h3>
            <ScrollArea className="flex-grow">
                <Accordion type="multiple" defaultValue={['wells', 'curves', 'spacing', 'scale', 'correlation']} className="w-full px-4">
                    <AccordionItem value="wells"><AccordionTrigger>Wells</AccordionTrigger><AccordionContent><ScrollArea className={`h-48 border rounded-md p-2 mt-1 ${borderColor}`}>{availableWells.map(well => (<div key={well.id} className="flex items-center space-x-2 my-1"><Checkbox id={`well-${well.id}`} checked={selectedWells.includes(well.id)} onCheckedChange={() => handleWellSelection(well.id)} /><Label htmlFor={`well-${well.id}`}>{well.name}</Label></div>))}</ScrollArea></AccordionContent></AccordionItem>
                    <AccordionItem value="curves"><AccordionTrigger>Curves</AccordionTrigger><AccordionContent><ScrollArea className={`h-32 border rounded-md p-2 mt-1 ${borderColor}`}>{availableCurves.map(curve => (<div key={curve.name} className="flex items-center space-x-2 my-1"><Checkbox id={`curve-${curve.name}`} checked={displayCurves.some(c => c.name === curve.name)} onCheckedChange={() => handleCurveSelection(curve.name)} /><Label htmlFor={`curve-${curve.name}`} style={{ color: theme === 'dark' ? curve.color : 'black' }}>{curve.name}</Label></div>))}</ScrollArea></AccordionContent></AccordionItem>
                    <AccordionItem value="spacing"><AccordionTrigger>Well Spacing</AccordionTrigger><AccordionContent><RadioGroup value={spacing.mode} onValueChange={(v) => setSpacing({ ...spacing, mode: v })} className="my-2 text-sm"><div className="flex items-center space-x-2"><RadioGroupItem value="constant" id="sp-const" /><Label htmlFor="sp-const">Constant</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="relative" id="sp-rel" /><Label htmlFor="sp-rel">Relative Distance</Label></div><div className="flex items-center space-x-2"><RadioGroupItem value="manual" id="sp-man" /><Label htmlFor="sp-man">Manual Drag</Label></div></RadioGroup>{spacing.mode === 'constant' && (<div><Label>Separation: {spacing.value}px</Label><Slider value={[spacing.value]} onValueChange={([val]) => setSpacing({...spacing, value: val})} min={0} max={200} step={5}/></div>)}{spacing.mode === 'manual' && <p className='text-xs text-slate-400'>Drag well headers to reorder.</p>}</AccordionContent></AccordionItem>
                    <AccordionItem value="scale"><AccordionTrigger>Vertical Scale</AccordionTrigger><AccordionContent><div className="flex items-center space-x-2 mt-1"><Button size="icon" variant={theme === 'dark' ? "outline" : "secondary"} className="h-8 w-8" onClick={() => setVerticalScale(s => Math.max(0.02, s - 0.05))}><Minus /></Button><Slider value={[verticalScale]} onValueChange={([val]) => setVerticalScale(val)} min={0.02} max={1} step={0.01} /><Button size="icon" variant={theme === 'dark' ? "outline" : "secondary"} className="h-8 w-8" onClick={() => setVerticalScale(s => Math.min(1, s + 0.05))}><Plus /></Button></div></AccordionContent></AccordionItem>
                    <AccordionItem value="correlation"><AccordionTrigger>Interpretation</AccordionTrigger><AccordionContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold mb-2">Correlate Tops</h4>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => setCorrelation(prev => ({...prev, inProgress: !prev.inProgress}))} variant={correlation.inProgress ? 'destructive' : 'default'} className="flex-grow">{correlation.inProgress ? "Cancel" : "Start New Correlation"}</Button>
                                {correlation.inProgress && (<Button size="sm" variant="secondary" onClick={() => setCorrelation(prev => ({...prev, lineType: prev.lineType === 'spline' ? 'straight' : 'spline'}))}><Spline className="w-4 h-4 mr-2"/>{correlation.lineType}</Button>)}
                            </div>
                            {correlation.inProgress && (<div className="flex gap-2 mt-2"><Button size="sm" onClick={() => setCorrelation(prev => ({...prev, points: prev.points.slice(0, -1)}))}><MinusSquare className="w-4 h-4 mr-2"/>Undo Last Pick</Button><Button size="sm" onClick={handleSaveCorrelation}><Save className="w-4 h-4 mr-2"/>Save</Button></div>)}
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Zone Shading</h4>
                             <div className="flex items-center space-x-2 mb-2"><Checkbox id="zone-shading-enable" checked={zoneShading.enabled} onCheckedChange={c => setZoneShading(p => ({...p, enabled: c}))}/><Label htmlFor="zone-shading-enable">Enable Shading</Label></div>
                             {zoneShading.enabled && (<div className="space-y-2 text-sm">
                                <Label>From Top:</Label>
                                <Select onValueChange={v => setZoneShading(p => ({...p, from: v}))}><SelectTrigger><SelectValue placeholder="Select Top Horizon..."/></SelectTrigger><SelectContent>{allInterpretations.filter(i => i.kind === 'horizon').map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent></Select>
                                <Label>To Top:</Label>
                                <Select onValueChange={v => setZoneShading(p => ({...p, to: v}))}><SelectTrigger><SelectValue placeholder="Select Bottom Horizon..."/></SelectTrigger><SelectContent>{allInterpretations.filter(i => i.kind === 'horizon').map(i => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent></Select>
                                <Label>Fill Color:</Label>
                                <Input type="color" value={zoneShading.color} onChange={e => setZoneShading(p => ({...p, color: e.target.value}))} className="w-full h-8"/>
                             </div>)}
                        </div>
                    </AccordionContent></AccordionItem>
                </Accordion>
            </ScrollArea>
        </div>
    );
    
    if (availableWells.length === 0) {
        return <div className={`flex flex-col items-center justify-center h-full text-center rounded-lg m-4 ${theme === 'dark' ? 'text-slate-400 bg-slate-800/20' : 'text-slate-500 bg-slate-200/20'}`}><Waypoints className="w-24 h-24 text-slate-600 mb-4" /><h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Well Section View</h2><p>No wells with log data found. Import well data to begin.</p></div>;
    }
    
    return (
        <div className={`h-full w-full relative ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'} ${textColor}`}>
             <PanelGroup direction="horizontal">
                {isPanelOpen && <Panel defaultSize={20} minSize={15} collapsible={true} onCollapse={() => setPanelOpen(false)}>{controlPanel}</Panel>}
                {isPanelOpen && <PanelResizeHandle className={`w-1.5 transition-colors ${theme === 'dark' ? 'bg-slate-700 hover:bg-cyan-400' : 'bg-slate-300 hover:bg-blue-400'}`} />}
                <Panel>
                    <div className="relative h-full w-full">
                        <ScrollArea className="h-full w-full">
                            <div className="flex flex-nowrap h-full relative">
                            {orderedWells.length > 0 ? (
                                orderedWells.map((well, index) => (
                                   <DraggableWellTrack
                                        key={well.id} index={index} well={well}
                                        curves={displayCurves}
                                        scale={depthScale}
                                        shift={trackShifts[well.id] || 0}
                                        width={80 + displayCurves.length * 100}
                                        moveTrack={moveTrack}
                                        onShift={handleShift}
                                        spacing={spacing}
                                        theme={theme}
                                        onTopClick={handleTopClick}
                                        correlation={correlation}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full w-full text-center"><Waypoints className="w-24 h-24 text-slate-600 mb-4" /><h2 className="text-2xl font-bold">Select Wells</h2><p>Use the control panel to select wells to display.</p></div>
                            )}
                            <svg ref={correlationLinesRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"></svg>
                            </div>
                             <div className="h-48"></div> {/* Spacer for scroll */}
                        </ScrollArea>
                        <div className="absolute top-2 right-14 z-20"><Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-600" />}</Button></div>
                        <div className="absolute top-2 right-2 z-20"><Button variant="ghost" size="icon" onClick={() => setPanelOpen(!isPanelOpen)}>{isPanelOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}</Button></div>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
};

const WellSectionView = () => (
    <DndProvider backend={HTML5Backend}>
        <MainWellSectionView />
    </DndProvider>
);

export default WellSectionView;