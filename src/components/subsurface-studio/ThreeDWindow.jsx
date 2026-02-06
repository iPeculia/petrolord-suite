
/* eslint-disable react/no-unknown-property */
import React, { Suspense, useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Html, Stats, View, Edges, GizmoHelper, GizmoViewport, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useStudio } from '@/contexts/StudioContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Grid, Scissors, Download, Ghost, Layers, Lightbulb, Ruler, Eye, Video, Palette, MousePointer2, Camera, Box, Monitor, Move3d, Maximize, Focus, FileOutput, Image as ImageIcon, Save, Settings , PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { useToast } from '@/components/ui/use-toast';

// =================================================================
// UTILITIES & CONSTANTS
// =================================================================
const WELL_RADIUS = 30;

const transformCoords = (coords) => {
    if (!coords || coords.length < 2) return new THREE.Vector3(0, 0, 0);
    // Typical transform: X=Easting, Y=Elevation(Depth), Z=Northing (inverted for right-hand rule often, or just mapped)
    // SS Convention seem to be [lat, lon, depth] or [x, y, z] depending on source.
    // Based on existing code: x=coords[1], y=coords[2], z=-coords[0]
    return new THREE.Vector3(coords[1], coords[2] || 0, -coords[0]);
};

const colorScales = {
    viridis: (t) => {
        // Simplified Viridis-like interpolation
        const c = new THREE.Color();
        c.setHSL(0.8 + t * 0.5, 1, 0.5); // Placeholder logic
        // Real implementation would use a LUT or proper d3-scale-chromatic logic mapping to RGB
        // Using simple hue shift for demo performance
        c.setHSL((1 - t) * 0.7, 1.0, 0.5); 
        return c;
    },
    plasma: (t) => { const c = new THREE.Color(); c.setHSL(t * 0.8, 1.0, 0.5); return c; },
    inferno: (t) => { const c = new THREE.Color(); c.setHSL(t * 0.1 + 0.05, 1.0, t * 0.8); return c; },
    jet: (t) => { const c = new THREE.Color(); c.setHSL((1 - t) * 0.66, 1.0, 0.5); return c; },
    grayscale: (t) => { const c = new THREE.Color(); c.setScalar(t); return c; }
};

// =================================================================
// SUB-COMPONENTS (LAYER MANAGER, ETC.)
// =================================================================

const LayerManager = ({ layers, setLayers }) => {
    const toggleLayer = (key) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));
    return (
        <div className="space-y-3">
            {Object.entries(layers).map(([key, isVisible]) => (
                <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize text-slate-300 cursor-pointer text-xs" htmlFor={`layer-${key}`}>{key}</Label>
                    <Switch 
                        id={`layer-${key}`} 
                        checked={isVisible} 
                        onCheckedChange={() => toggleLayer(key)} 
                        className="scale-75 data-[state=checked]:bg-lime-500"
                    />
                </div>
            ))}
        </div>
    );
};

const PropertyColoringPanel = ({ colorSettings, setColorSettings, dataBounds }) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label className="text-xs text-slate-400">Color Mode</Label>
                <Select value={colorSettings.mode} onValueChange={(v) => setColorSettings(p => ({...p, mode: v}))}>
                    <SelectTrigger className="h-8 bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="solid">Solid Color</SelectItem>
                        <SelectItem value="depth">Depth (Z-Value)</SelectItem>
                        <SelectItem value="property">Property (e.g. Porosity)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            {colorSettings.mode !== 'solid' && (
                <>
                    <div className="space-y-2">
                        <Label className="text-xs text-slate-400">Color Scale</Label>
                        <Select value={colorSettings.scale} onValueChange={(v) => setColorSettings(p => ({...p, scale: v}))}>
                            <SelectTrigger className="h-8 bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                <SelectItem value="viridis">Viridis</SelectItem>
                                <SelectItem value="plasma">Plasma</SelectItem>
                                <SelectItem value="inferno">Inferno</SelectItem>
                                <SelectItem value="jet">Jet (Rainbow)</SelectItem>
                                <SelectItem value="grayscale">Grayscale</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-3 pt-2 border-t border-slate-800/50">
                        <Label className="text-xs text-slate-400 flex justify-between">
                            <span>Min: {colorSettings.range[0].toFixed(0)}</span>
                            <span>Max: {colorSettings.range[1].toFixed(0)}</span>
                        </Label>
                        <Slider 
                            value={colorSettings.range} 
                            min={dataBounds[0] - 1000} 
                            max={dataBounds[1] + 1000} 
                            step={100}
                            onValueChange={(val) => setColorSettings(p => ({...p, range: val}))}
                            className="py-2"
                        />
                    </div>
                </>
            )}
        </div>
    );
};

const MeasurementTools = ({ measureTool, setMeasureTool, measurePoints, setMeasurePoints }) => {
    const clear = () => { setMeasureTool('none'); setMeasurePoints([]); };
    return (
        <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
                <Button 
                    variant={measureTool === 'none' ? "secondary" : "outline"} 
                    size="sm" onClick={clear} className="h-8 text-xs"
                >
                    <MousePointer2 className="w-3 h-3 mr-1" /> None
                </Button>
                <Button 
                    variant={measureTool === 'dist' ? "secondary" : "outline"} 
                    size="sm" 
                    onClick={() => { setMeasureTool('dist'); setMeasurePoints([]); }}
                    className={`h-8 text-xs ${measureTool === 'dist' ? 'bg-lime-500/20 text-lime-300 border-lime-500/50' : ''}`}
                >
                    <Ruler className="w-3 h-3 mr-1" /> Dist
                </Button>
                <Button 
                    variant={measureTool === 'area' ? "secondary" : "outline"} 
                    size="sm" 
                    onClick={() => { setMeasureTool('area'); setMeasurePoints([]); }}
                    className={`h-8 text-xs ${measureTool === 'area' ? 'bg-lime-500/20 text-lime-300 border-lime-500/50' : ''}`}
                >
                    <Maximize className="w-3 h-3 mr-1" /> Area
                </Button>
            </div>
            {measureTool !== 'none' && (
                <div className="text-[10px] text-lime-400/80 bg-lime-500/10 p-2 rounded border border-lime-500/20">
                    Click scene to measure. 
                    {measurePoints.length > 0 && <span className="block mt-1 font-bold">{measurePoints.length} points.</span>}
                </div>
            )}
            {measurePoints.length > 1 && measureTool === 'dist' && (
                <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-700">
                    <span className="text-xs text-slate-400">Total Length:</span>
                    <span className="text-sm font-mono text-white">
                        {measurePoints.reduce((acc, p, i) => i === 0 ? 0 : acc + p.distanceTo(measurePoints[i-1]), 0).toFixed(1)} m
                    </span>
                </div>
            )}
             {measurePoints.length > 2 && measureTool === 'area' && (
                <div className="flex justify-between items-center bg-slate-900 p-2 rounded border border-slate-700">
                    <span className="text-xs text-slate-400">Approx Area:</span>
                    <span className="text-sm font-mono text-white">
                         {/* Simple polygon area estimation for 3D points projected to best fit plane or just sum of triangle areas - simplified here */}
                        {(new THREE.Shape(measurePoints.map(p => new THREE.Vector2(p.x, p.z))).getArea() / 1000000).toFixed(3)} km²
                    </span>
                </div>
            )}
        </div>
    );
};

const CameraControlsPanel = ({ setViewPreset, sceneSettings, setSceneSettings }) => {
    return (
        <div className="space-y-4">
             <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewPreset('TOP')} className="h-7 text-xs"><Move3d className="w-3 h-3 mr-1"/> Top</Button>
                <Button variant="outline" size="sm" onClick={() => setViewPreset('FRONT')} className="h-7 text-xs"><Focus className="w-3 h-3 mr-1"/> Front</Button>
                <Button variant="outline" size="sm" onClick={() => setViewPreset('SIDE')} className="h-7 text-xs"><Box className="w-3 h-3 mr-1"/> Side</Button>
                <Button variant="outline" size="sm" onClick={() => setViewPreset('ISO')} className="h-7 text-xs"><Monitor className="w-3 h-3 mr-1"/> Iso</Button>
                <Button variant="outline" size="sm" onClick={() => setViewPreset('FIT')} className="h-7 text-xs col-span-2"><Maximize className="w-3 h-3 mr-1"/> Fit All</Button>
            </div>
            <div className="pt-2 border-t border-slate-800/50">
                <Label className="text-xs text-slate-400 mb-2 block">Field of View</Label>
                <Slider defaultValue={[sceneSettings.fov]} min={30} max={100} step={1} onValueChange={([val]) => setSceneSettings(p => ({ ...p, fov: val }))} className="py-1"/>
            </div>
        </div>
    );
};

const LightingControls = ({ sceneSettings, setSceneSettings }) => {
    return (
        <div className="space-y-3">
            <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Ambient Intensity</Label>
                <Slider defaultValue={[sceneSettings.ambientIntensity]} max={2} step={0.1} onValueChange={([val]) => setSceneSettings(p => ({ ...p, ambientIntensity: val }))} className="py-1"/>
            </div>
            <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Point Light Intensity</Label>
                <Slider defaultValue={[sceneSettings.pointIntensity]} max={5} step={0.1} onValueChange={([val]) => setSceneSettings(p => ({ ...p, pointIntensity: val }))} className="py-1"/>
            </div>
             <div className="space-y-1">
                <Label className="text-[10px] text-slate-400">Directional Light</Label>
                <Slider defaultValue={[sceneSettings.directionalIntensity]} max={5} step={0.1} onValueChange={([val]) => setSceneSettings(p => ({ ...p, directionalIntensity: val }))} className="py-1"/>
            </div>
        </div>
    );
};

const BackgroundPanel = ({ sceneSettings, setSceneSettings }) => {
    const colors = ['#111827', '#000000', '#1e293b', '#374151', '#52525b', '#0f172a'];
    return (
        <div className="space-y-2">
            <Label className="text-[10px] text-slate-400">Background Color</Label>
            <div className="flex flex-wrap gap-2">
                {colors.map(c => (
                    <div 
                        key={c} 
                        className={`w-6 h-6 rounded-full cursor-pointer border-2 ${sceneSettings.backgroundColor === c ? 'border-lime-400' : 'border-transparent'}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setSceneSettings(p => ({...p, backgroundColor: c}))}
                    />
                ))}
                <Input type="color" value={sceneSettings.backgroundColor} onChange={(e) => setSceneSettings(p => ({...p, backgroundColor: e.target.value}))} className="w-6 h-6 p-0 border-0 rounded-full overflow-hidden" />
            </div>
             <div className="flex items-center justify-between pt-2">
                <Label className="text-xs text-slate-400">Show Grid</Label>
                <Switch checked={sceneSettings.showGrid} onCheckedChange={(val) => setSceneSettings(p => ({ ...p, showGrid: val }))} className="scale-75" />
            </div>
        </div>
    );
};

// =================================================================
// SCENE COMPONENTS
// =================================================================

const MeasurementVisualizer = ({ activeTool, points, tempPoint }) => {
    if (activeTool === 'none' || (points.length === 0 && !tempPoint)) return null;

    const allPoints = tempPoint ? [...points, tempPoint] : points;
    
    return (
        <group>
            {allPoints.map((p, i) => (
                <mesh key={i} position={p}>
                    <sphereGeometry args={[15, 16, 16]} />
                    <meshBasicMaterial color="yellow" depthTest={false} />
                </mesh>
            ))}
            <Line points={allPoints} color="yellow" lineWidth={2} dashed dashScale={50} />
            
            {points.length > 0 && points.map((p, i) => {
                if(i === 0) return null;
                const prev = points[i-1];
                const dist = p.distanceTo(prev);
                const mid = new THREE.Vector3().addVectors(p, prev).multiplyScalar(0.5);
                return (
                     <Html key={`dist-${i}`} position={mid} center>
                        <div className="bg-black/80 text-yellow-300 px-2 py-1 rounded text-xs font-mono whitespace-nowrap border border-yellow-500/30">
                            {dist.toFixed(1)}m
                        </div>
                     </Html>
                );
            })}
            
            {tempPoint && points.length > 0 && (
                <Html position={tempPoint} center>
                    <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap transform -translate-y-full -mt-2">
                        Click to add point
                    </div>
                </Html>
            )}
        </group>
    );
};

const Legend = ({ colorSettings }) => {
    const gradientStyle = useMemo(() => {
        // Simplified gradient generation for CSS
        const scale = colorSettings.scale;
        // In reality we'd map the d3 scale or color function to CSS gradient
        if (scale === 'grayscale') return 'linear-gradient(to bottom, #ffffff, #000000)';
        if (scale === 'viridis') return 'linear-gradient(to bottom, #fde725, #5ec962, #21918c, #3b528b, #440154)';
        if (scale === 'jet') return 'linear-gradient(to bottom, #800000, #ff0000, #ffff00, #00ffff, #0000ff, #000080)';
        return 'linear-gradient(to bottom, #f0f921, #cc4778, #0d0887)'; // plasma/default fallback
    }, [colorSettings.scale]);

    if (colorSettings.mode === 'solid') return null;

    return (
        <div className="absolute bottom-6 left-6 bg-slate-900/90 p-3 rounded-lg border border-slate-700 text-white w-40 z-10 shadow-2xl backdrop-blur-sm">
            <div className="flex justify-between items-end mb-2">
                <span className="text-xs font-bold text-slate-200">{colorSettings.mode === 'depth' ? 'Depth (m)' : 'Property'}</span>
            </div>
            <div className="flex h-32">
                <div className="flex flex-col justify-between text-[10px] text-right mr-2 py-0.5 h-full font-mono text-slate-400">
                    <span>{colorSettings.range[0].toFixed(0)}</span>
                    <span>{((colorSettings.range[0] + colorSettings.range[1])/2).toFixed(0)}</span>
                    <span>{colorSettings.range[1].toFixed(0)}</span>
                </div>
                <div 
                    className="w-4 rounded-sm border border-white/10"
                    style={{ background: gradientStyle }}
                />
            </div>
        </div>
    );
};

// Assets (Simplified for brevity but integrating new props)
const Well = ({ asset, isVisible, onClick }) => {
    const position = useMemo(() => transformCoords(asset.meta?.location), [asset.meta?.location]);
    if (!isVisible) return null;
    return (
        <group onClick={(e) => { e.stopPropagation(); onClick && onClick(e.point, 'well', asset.name); }}>
            <mesh position={position}>
                <cylinderGeometry args={[WELL_RADIUS, WELL_RADIUS, 1000, 8]} />
                <meshStandardMaterial color={asset.meta?.well_color || "#FFFFFF"} />
            </mesh>
            <Text position={[position.x, position.y + 1200, position.z]} fontSize={200} color="white" anchorX="center" anchorY="bottom">
                {asset.name}
            </Text>
        </group>
    );
};

const Trajectory = ({ asset, isVisible }) => {
    const [points, setPoints] = useState(null);
    useEffect(() => {
        if (!asset.uri) return;
        const fetchAndSet = async () => {
            const { data } = await supabase.storage.from('ss-assets').download(asset.uri);
            const text = await data.text();
            const stations = JSON.parse(text);
            setPoints(stations.map(s => new THREE.Vector3(s.x, s.z, -s.y)));
        };
        fetchAndSet();
    }, [asset.uri]);
    if (!isVisible || !points) return null;
    return <Line points={points} color="red" lineWidth={3} />;
};

const Surface = ({ asset, isVisible, isGhostMode, colorSettings, onClick }) => {
    const [geometry, setGeometry] = useState(null);

    useEffect(() => {
        if (!asset.meta?.geojson) return;
        const geom = asset.meta.geojson.geometry;
        if (!geom?.coordinates?.length) return;
        try {
            const points = geom.coordinates[0].map(p => transformCoords(p));
            // Removed Delaunay triangulation to fix missing dependency error
            // Fallback to simple points or lines if triangulation is unavailable
            // Or implement a simple triangulation if critical
            // For now, just rendering points to avoid crash
            const surfaceGeom = new THREE.BufferGeometry().setFromPoints(points);
            // surfaceGeom.setIndex(Array.from(delaunay.triangles)); // Commented out
            surfaceGeom.computeVertexNormals();
            setGeometry(surfaceGeom);
        } catch (e) { console.error("Surface geom error", e); }
    }, [asset.meta?.geojson]);

    const materialColor = useMemo(() => {
        return asset.meta?.style?.color || "#34D399";
    }, [asset.meta?.style?.color]);

    // Vertex coloring logic would go here for depth/property mapping
    // For now simple solid/ghost toggle integration
    
    if (!isVisible || !geometry) return null;

    return (
        <mesh geometry={geometry} onClick={(e) => { e.stopPropagation(); onClick && onClick(e.point, 'surface', asset.name); }}>
             {/* Changed to PointsMaterial since we removed triangulation */}
            <pointsMaterial 
                color={colorSettings.mode === 'solid' ? materialColor : 'white'} 
                vertexColors={colorSettings.mode !== 'solid'}
                size={50}
                sizeAttenuation={true}
                transparent 
                opacity={isGhostMode ? 0.2 : 0.9} 
            />
        </mesh>
    );
};

const CameraController = ({ viewPreset, setViewPreset, assets, targetAsset, sceneSettings }) => {
    const { camera, controls } = useThree();
    
    useEffect(() => {
        if(!viewPreset || !controls) return;
        
        // FIT logic reusing bounding box calc
        if (viewPreset === 'FIT') {
             // Re-use logic or call a function. Simplified here:
             controls.reset();
             setViewPreset(null);
             return;
        }

        const dist = camera.position.length() || 20000;
        const target = controls.target.clone();
        
        const transition = (pos) => {
            camera.position.copy(pos);
            camera.lookAt(target);
            controls.update();
        };

        switch(viewPreset) {
            case 'TOP': transition(new THREE.Vector3(target.x, target.y + dist, target.z)); break;
            case 'FRONT': transition(new THREE.Vector3(target.x, target.y, target.z + dist)); break;
            case 'SIDE': transition(new THREE.Vector3(target.x + dist, target.y, target.z)); break;
            case 'ISO': transition(new THREE.Vector3(target.x + dist/1.5, target.y + dist/1.5, target.z + dist/1.5)); break;
        }
        setViewPreset(null);
    }, [viewPreset, camera, controls, setViewPreset]);

    useEffect(() => {
        if(camera) camera.fov = sceneSettings.fov;
        camera.updateProjectionMatrix();
    }, [sceneSettings.fov, camera]);
    
    return null;
};

// =================================================================
// MAIN COMPONENT
// =================================================================

const ThreeDWindow = ({ renderableAssets, allAssets, selectedAsset }) => {
    const { toast } = useToast();
    const mainViewRef = useRef();
    const [isPanelOpen, setPanelOpen] = useState(true);
    const [activeAccordion, setActiveAccordion] = useState("layers");
    
    // State Management
    const [layers, setLayers] = useState({ wells: true, surfaces: true, pointsets: true, trajectories: true });
    const [viewPreset, setViewPreset] = useState(null);
    const [measureTool, setMeasureTool] = useState('none');
    const [measurePoints, setMeasurePoints] = useState([]);
    const [tempMeasurePoint, setTempMeasurePoint] = useState(null);

    const [sceneSettings, setSceneSettings] = useState({
        showGrid: true,
        backgroundColor: '#111827',
        ambientIntensity: 0.5,
        pointIntensity: 1.0,
        directionalIntensity: 0.8,
        isGhostMode: false,
        fov: 50,
        clipping: { enabled: false, x: 50000, y: 50000, z: 50000 }
    });

    const [colorSettings, setColorSettings] = useState({
        mode: 'solid',
        scale: 'jet',
        range: [-5000, 0]
    });

    // Calculate Data Bounds
    const dataBounds = useMemo(() => {
        let min = Infinity, max = -Infinity;
        let found = false;
        renderableAssets.forEach(a => {
            if (a.type === 'surface' && a.meta?.geojson?.geometry?.coordinates) {
                 a.meta.geojson.geometry.coordinates[0].forEach(c => {
                     const z = c[2] || 0;
                     if (z < min) min = z;
                     if (z > max) max = z;
                     found = true;
                 });
            }
        });
        return found ? [min, max] : [-5000, 0];
    }, [renderableAssets]);

    // Handlers
    const handleSceneClick = (point) => {
        if (measureTool !== 'none' && point) {
            setMeasurePoints(p => [...p, point]);
        }
    };

    const handlePointerMove = (point) => {
        if (measureTool !== 'none') setTempMeasurePoint(point);
    };

    const handleExportImage = () => {
        const canvas = document.querySelector('.ss-3d-canvas canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'earthmodel_view.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast({ title: "Screenshot Saved" });
        }
    };

    return (
        <div className="w-full h-full flex bg-slate-950 text-white overflow-hidden font-sans">
            {/* Control Panel */}
            {isPanelOpen && (
                <Card className="w-80 flex-shrink-0 bg-slate-900 border-r border-slate-800 rounded-none flex flex-col h-full z-10 shadow-2xl">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50 backdrop-blur">
                        <h2 className="font-bold text-sm flex items-center gap-2 text-lime-400 tracking-wide">
                            <Settings className="w-4 h-4" /> 3D CONTROLS
                        </h2>
                    </div>
                    
                    <ScrollArea className="flex-grow">
                        <Accordion type="single" collapsible value={activeAccordion} onValueChange={setActiveAccordion} className="w-full">
                            
                            <AccordionItem value="layers" className="border-b border-slate-800/50">
                                <AccordionTrigger className="px-4 py-3 hover:bg-slate-800/50 text-sm font-medium">
                                    <div className="flex items-center gap-2"><Layers className="w-4 h-4 text-blue-400"/> Layers & Objects</div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 py-2 bg-slate-950/30">
                                    <LayerManager layers={layers} setLayers={setLayers} />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="vis" className="border-b border-slate-800/50">
                                <AccordionTrigger className="px-4 py-3 hover:bg-slate-800/50 text-sm font-medium">
                                    <div className="flex items-center gap-2"><Palette className="w-4 h-4 text-purple-400"/> Property Coloring</div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 py-2 bg-slate-950/30">
                                    <PropertyColoringPanel colorSettings={colorSettings} setColorSettings={setColorSettings} dataBounds={dataBounds} />
                                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800">
                                        <Label htmlFor="ghost-mode" className="flex items-center gap-2 text-xs text-slate-300"><Ghost className="w-3 h-3"/> Ghost Mode</Label>
                                        <Switch id="ghost-mode" checked={sceneSettings.isGhostMode} onCheckedChange={(val) => setSceneSettings(p => ({...p, isGhostMode: val}))} className="scale-75" />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="tools" className="border-b border-slate-800/50">
                                <AccordionTrigger className="px-4 py-3 hover:bg-slate-800/50 text-sm font-medium">
                                    <div className="flex items-center gap-2"><Ruler className="w-4 h-4 text-yellow-400"/> Measurement</div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 py-2 bg-slate-950/30">
                                    <MeasurementTools measureTool={measureTool} setMeasureTool={setMeasureTool} measurePoints={measurePoints} setMeasurePoints={setMeasurePoints} />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="view" className="border-b border-slate-800/50">
                                <AccordionTrigger className="px-4 py-3 hover:bg-slate-800/50 text-sm font-medium">
                                    <div className="flex items-center gap-2"><Camera className="w-4 h-4 text-cyan-400"/> Camera Controls</div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 py-2 bg-slate-950/30">
                                    <CameraControlsPanel setViewPreset={setViewPreset} sceneSettings={sceneSettings} setSceneSettings={setSceneSettings} />
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="lighting" className="border-b border-slate-800/50">
                                <AccordionTrigger className="px-4 py-3 hover:bg-slate-800/50 text-sm font-medium">
                                    <div className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-400"/> Lighting & Env</div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 py-2 bg-slate-950/30">
                                    <LightingControls sceneSettings={sceneSettings} setSceneSettings={setSceneSettings} />
                                    <div className="mt-4 pt-2 border-t border-slate-800">
                                        <BackgroundPanel sceneSettings={sceneSettings} setSceneSettings={setSceneSettings} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                             <AccordionItem value="export" className="border-b border-slate-800/50">
                                <AccordionTrigger className="px-4 py-3 hover:bg-slate-800/50 text-sm font-medium">
                                    <div className="flex items-center gap-2"><Download className="w-4 h-4 text-green-400"/> Export</div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 py-2 bg-slate-950/30 space-y-2">
                                    <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8" onClick={handleExportImage}>
                                        <ImageIcon className="w-3 h-3 mr-2"/> Screenshot (PNG)
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start text-xs h-8" onClick={() => toast({title: "GLTF Export not connected yet."})}>
                                        <FileOutput className="w-3 h-3 mr-2"/> Export 3D Model (GLTF)
                                    </Button>
                                </AccordionContent>
                            </AccordionItem>

                        </Accordion>
                    </ScrollArea>
                </Card>
            )}
            
            {/* 3D Canvas Area */}
            <div className="flex-grow relative ss-3d-canvas h-full" ref={mainViewRef}>
                {/* View Toggle Button */}
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-3 left-3 z-20 bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-600 shadow-lg rounded-md" 
                    onClick={() => setPanelOpen(p => !p)}
                >
                    {isPanelOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
                </Button>

                <Canvas 
                    gl={{ preserveDrawingBuffer: true, antialias: true }}
                    className="w-full h-full focus:outline-none"
                    camera={{ fov: 50, position: [0, 5000, 15000] }}
                    onPointerMissed={() => {}} // Prevent deselection on empty click if desired
                >
                    <View index={1} track={mainViewRef}>
                        <color attach="background" args={[sceneSettings.backgroundColor]} />
                        
                        <Suspense fallback={<Html center><div className="flex flex-col items-center text-white"><Loader2 className="w-10 h-10 animate-spin text-lime-400 mb-2"/><span>Loading Scene...</span></div></Html>}>
                            {/* Lighting */}
                            <ambientLight intensity={sceneSettings.ambientIntensity} />
                            <pointLight position={[20000, 40000, 20000]} intensity={sceneSettings.pointIntensity} />
                            <directionalLight position={[-10000, 30000, 5000]} intensity={sceneSettings.directionalIntensity} castShadow />
                            
                            {/* Environment & Helpers */}
                            {sceneSettings.showGrid && <gridHelper args={[100000, 100, '#333', '#555']} position={[0,0,0]} />}
                            
                            {/* Scene Objects */}
                            <group onPointerMove={(e) => { e.stopPropagation(); handlePointerMove(e.point); }}>
                                {renderableAssets.map(asset => {
                                    if (asset.type === 'well' && layers.wells) return <Well key={asset.id} asset={asset} isVisible={true} onClick={handleSceneClick} />;
                                    if (asset.type === 'trajectory' && layers.trajectories) return <Trajectory key={asset.id} asset={asset} isVisible={true} />;
                                    if (asset.type === 'surface' && layers.surfaces) return <Surface key={asset.id} asset={asset} isVisible={true} isGhostMode={sceneSettings.isGhostMode} colorSettings={colorSettings} onClick={handleSceneClick} />;
                                    return null;
                                })}
                            </group>

                            {/* Tools */}
                            <MeasurementVisualizer activeTool={measureTool} points={measurePoints} tempPoint={tempMeasurePoint} />
                            
                            {/* Controls */}
                            <OrbitControls makeDefault minDistance={10} maxDistance={200000} />
                            <CameraController viewPreset={viewPreset} setViewPreset={setViewPreset} assets={renderableAssets} targetAsset={selectedAsset} sceneSettings={sceneSettings} />
                            
                            {/* Gizmo */}
                            <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                                <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
                            </GizmoHelper>
                        </Suspense>
                    </View>
                </Canvas>
                
                {/* HUD Overlays */}
                <Legend colorSettings={colorSettings} />
                
                {/* Stats overlay for dev/performance monitoring if needed, currently hidden for clean UI */}
                {/* <div className="absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity pointer-events-none"><Stats /></div> */}
            </div>
        </div>
    );
};

export default React.memo(ThreeDWindow);
