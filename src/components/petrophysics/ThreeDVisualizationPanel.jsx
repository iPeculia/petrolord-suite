
/* eslint-disable react/no-unknown-property */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Html, Stars, GizmoHelper, GizmoViewport, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Layers, Box, Map, Settings, RotateCcw, Maximize, Eye, EyeOff, MousePointer2 } from 'lucide-react';
import { generateWellPath, generateLogMesh, generateStratigraphicSurface } from '@/utils/petrophysics3DUtils';

// --- Components for the Scene ---

const WellComponent = ({ well, path, colorMode, curveData, curveRange, isHovered, onHover }) => {
    const lineGeometry = useMemo(() => {
        if (colorMode === 'curve' && curveData) {
            return generateLogMesh(well, path, curveData, curveRange);
        }
        return null;
    }, [well, path, colorMode, curveData, curveRange]);

    const defaultPoints = useMemo(() => path, [path]);

    return (
        <group>
            {/* Well Head Label */}
            <Html position={[path[0].x, path[0].y + 20, path[0].z]} distanceFactor={500}>
                <div 
                    className={`px-2 py-1 rounded text-xs font-bold transition-all select-none pointer-events-none whitespace-nowrap ${isHovered ? 'bg-blue-600 text-white scale-110 z-50' : 'bg-black/50 text-white/80'}`}
                >
                    {well.name}
                </div>
            </Html>

            {/* Well Path (Thick Line for Curve, Thin for Trace) */}
            {colorMode === 'curve' && lineGeometry ? (
                <lineSegments geometry={lineGeometry}>
                    <lineBasicMaterial vertexColors linewidth={3} />
                </lineSegments>
            ) : (
                <Line 
                    points={defaultPoints} 
                    color={isHovered ? '#3B82F6' : '#64748B'} 
                    lineWidth={isHovered ? 3 : 1} 
                />
            )}

            {/* Invisible Hit Cylinder for Interactions */}
            <mesh 
                position={[path[0].x, path[path.length-1].y / 2, path[0].z]} 
                onPointerOver={(e) => { e.stopPropagation(); onHover(well.id); }}
                onPointerOut={(e) => { onHover(null); }}
                visible={false}
            >
                <cylinderGeometry args={[5, 5, Math.abs(path[path.length-1].y), 8]} />
                <meshBasicMaterial color="red" wireframe />
            </mesh>
        </group>
    );
};

const SurfaceComponent = ({ geometry, color, opacity, visible }) => {
    if (!geometry || !visible) return null;
    return (
        <mesh geometry={geometry}>
            <meshPhongMaterial 
                color={color} 
                side={THREE.DoubleSide} 
                transparent 
                opacity={opacity} 
                flatShading
            />
        </mesh>
    );
};

const GridFloor = ({ size = 5000, divisions = 50 }) => (
    <group position={[0, 0, 0]}>
        <gridHelper args={[size, divisions, '#334155', '#1e293b']} />
        {/* Compass / Map indication */}
        <Text position={[size/2 + 100, 0, 0]} rotation={[-Math.PI/2, 0, 0]} fontSize={size/20} color="#94a3b8">E</Text>
        <Text position={[0, 0, -size/2 - 100]} rotation={[-Math.PI/2, 0, 0]} fontSize={size/20} color="#94a3b8">N</Text>
    </group>
);

const Legend = ({ mode, range, curve }) => {
    if (mode !== 'curve') return null;
    return (
        <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-700 p-3 rounded-lg text-white w-48">
            <div className="text-xs font-bold mb-2 flex justify-between">
                <span>{curve}</span>
                <span className="text-slate-400">Log Scale</span>
            </div>
            <div className="h-4 w-full rounded bg-gradient-to-r from-yellow-400 to-green-900 mb-1" 
                 style={{ 
                     background: curve === 'GR' ? 'linear-gradient(to right, #FCD34D, #064E3B)' : 
                                 curve === 'PHIE' ? 'linear-gradient(to right, #FFFFFF, #3B82F6)' : 
                                 'linear-gradient(to right, blue, red)' 
                 }}>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{range[0]}</span>
                <span>{range[1]}</span>
            </div>
        </div>
    );
};

// --- Main Panel ---

const ThreeDVisualizationPanel = ({ petroState }) => {
    const { wells, markers, activeWellId } = petroState;
    const [hoveredWellId, setHoveredWellId] = useState(null);
    
    // View State
    const [vizSettings, setVizSettings] = useState({
        verticalExaggeration: 1,
        colorMode: 'trace', // 'trace', 'curve'
        activeCurve: 'GR',
        showSurfaces: true,
        surfaceOpacity: 0.5,
        showGrid: true,
        showWellNames: true,
    });

    // Camera Ref
    const controlsRef = useRef();

    // Prepare Data
    const wellPaths = useMemo(() => {
        const paths = {};
        const center = { x: 0, y: 0 };
        let count = 0;

        // Create a pseudo-layout if no coordinates
        const radius = wells.length * 100; // Spread wells out
        
        wells.forEach((well, idx) => {
            // Check for header coordinates, else use circle layout
            let offset = { 
                x: Math.cos(idx / wells.length * Math.PI * 2) * radius, 
                y: Math.sin(idx / wells.length * Math.PI * 2) * radius 
            };
            
            // Real coords check (simplified)
            if (well.header && (well.header.LOC || well.header.X)) {
                // This would need projection, for now stick to relative or circle if not strictly defined numbers
                // assuming circle layout for demo robustness
            }

            const rawPath = generateWellPath(well, offset);
            if (rawPath) {
                // Apply Vertical Exaggeration
                paths[well.id] = rawPath.map(p => new THREE.Vector3(p.x, p.y * vizSettings.verticalExaggeration, p.z));
            }
        });
        return paths;
    }, [wells, vizSettings.verticalExaggeration]);

    // Get Curve Range for Coloring
    const curveRange = useMemo(() => {
        if (vizSettings.colorMode !== 'curve') return [0, 1];
        let min = Infinity, max = -Infinity;
        wells.forEach(w => {
            w.data.forEach(row => {
                const val = row[vizSettings.activeCurve];
                if (val != null) {
                    if (val < min) min = val;
                    if (val > max) max = val;
                }
            });
        });
        return [min, max];
    }, [wells, vizSettings.colorMode, vizSettings.activeCurve]);

    // Generate Surfaces
    const surfaces = useMemo(() => {
        if (!vizSettings.showSurfaces) return [];
        // Group markers by name
        const uniqueMarkers = [...new Set(markers.map(m => m.name))];
        
        // Attach marker data to wells for utility
        const enrichedWells = wells.map(w => ({
            ...w,
            markers: markers.filter(m => m.well_id === w.id)
        }));

        return uniqueMarkers.map(mName => {
            // Scale depths for surface generation
            const scaledWellPaths = {};
            Object.keys(wellPaths).forEach(k => {
                scaledWellPaths[k] = wellPaths[k].map(p => new THREE.Vector3(p.x, p.y / vizSettings.verticalExaggeration, p.z)); // Pass unscaled depth for logic, or handle scale inside
            });
            
            // Wait, geometry generation expects unscaled depth if we just use z=-depth.
            // Actually we want the geometry vertices to match the visual scene.
            // So we should pass the scaled depths. 
            // Let's adjust the utility to take direct points or modify the utility to accept Z override.
            // For simplicity, let's just manually scale the markers depth before passing to utility logic if feasible,
            // OR, generating geometry based on the `wellPaths` Z values which are already scaled.
            
            // Re-using utility: `generateStratigraphicSurface` uses `marker.depth`. We need to scale that depth.
            const scaledEnrichedWells = enrichedWells.map(w => ({
                ...w,
                markers: w.markers.map(m => ({ ...m, depth: m.depth * vizSettings.verticalExaggeration }))
            }));

            const geom = generateStratigraphicSurface(mName, scaledEnrichedWells, wellPaths);
            // Pick a color for the surface
            const colorHash = mName.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
            const color = `hsl(${colorHash % 360}, 70%, 50%)`;
            
            return { name: mName, geometry: geom, color };
        }).filter(s => s.geometry);
    }, [markers, wells, wellPaths, vizSettings.showSurfaces, vizSettings.verticalExaggeration]);

    const resetCamera = () => {
        if (controlsRef.current) {
            controlsRef.current.reset();
        }
    };

    return (
        <div className="h-full flex flex-col lg:flex-row bg-slate-950 overflow-hidden">
            {/* Controls Sidebar */}
            <div className="w-full lg:w-72 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col shrink-0 z-10">
                <div className="p-4 border-b border-slate-800">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Box className="w-5 h-5 text-purple-500" /> 3D Visualization
                    </h2>
                    <p className="text-xs text-slate-400">Interactive Scene Explorer</p>
                </div>
                
                <div className="p-4 space-y-6 overflow-y-auto flex-1">
                    <div className="space-y-3">
                        <Label className="text-white">Display Mode</Label>
                        <Tabs value={vizSettings.colorMode} onValueChange={v => setVizSettings({...vizSettings, colorMode: v})}>
                            <TabsList className="w-full bg-slate-800">
                                <TabsTrigger value="trace" className="flex-1">Trace</TabsTrigger>
                                <TabsTrigger value="curve" className="flex-1">Property</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {vizSettings.colorMode === 'curve' && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-left-2">
                            <Label className="text-white">Property Curve</Label>
                            <Select value={vizSettings.activeCurve} onValueChange={v => setVizSettings({...vizSettings, activeCurve: v})}>
                                <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GR">Gamma Ray (GR)</SelectItem>
                                    <SelectItem value="PHIE">Porosity (PHIE)</SelectItem>
                                    <SelectItem value="SW">Saturation (SW)</SelectItem>
                                    <SelectItem value="RHOB">Density (RHOB)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-4 border-t border-slate-800 pt-4">
                        <Label className="text-white">Scene Layers</Label>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Layers className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-200">Stratigraphic Surfaces</span>
                            </div>
                            <Switch checked={vizSettings.showSurfaces} onCheckedChange={c => setVizSettings({...vizSettings, showSurfaces: c})} />
                        </div>

                        {vizSettings.showSurfaces && (
                            <div className="space-y-2 pl-6">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Opacity</span>
                                    <span>{Math.round(vizSettings.surfaceOpacity * 100)}%</span>
                                </div>
                                <Slider 
                                    value={[vizSettings.surfaceOpacity]} 
                                    min={0} max={1} step={0.1} 
                                    onValueChange={([v]) => setVizSettings({...vizSettings, surfaceOpacity: v})} 
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Map className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-200">Reference Grid</span>
                            </div>
                            <Switch checked={vizSettings.showGrid} onCheckedChange={c => setVizSettings({...vizSettings, showGrid: c})} />
                        </div>
                    </div>

                    <div className="space-y-3 border-t border-slate-800 pt-4">
                        <Label className="text-white">Vertical Exaggeration (x{vizSettings.verticalExaggeration})</Label>
                        <Slider 
                            value={[vizSettings.verticalExaggeration]} 
                            min={1} max={10} step={0.5} 
                            onValueChange={([v]) => setVizSettings({...vizSettings, verticalExaggeration: v})} 
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                    <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800" onClick={resetCamera}>
                        <RotateCcw className="w-4 h-4 mr-2" /> Reset Camera
                    </Button>
                </div>
            </div>

            {/* 3D Canvas */}
            <div className="flex-1 relative bg-black cursor-move">
                <Canvas camera={{ position: [2000, 2000, 2000], fov: 45 }}>
                    <color attach="background" args={['#020617']} />
                    <fog attach="fog" args={['#020617', 2000, 15000]} />
                    
                    <ambientLight intensity={0.7} />
                    <pointLight position={[5000, 5000, 5000]} intensity={1} />
                    <Stars radius={10000} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

                    {/* Controls */}
                    <OrbitControls 
                        ref={controlsRef} 
                        makeDefault 
                        minPolarAngle={0} 
                        maxPolarAngle={Math.PI / 2 - 0.05} 
                        dampingFactor={0.1}
                    />
                    
                    <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                        <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
                    </GizmoHelper>

                    {/* Scene Objects */}
                    <group>
                        {vizSettings.showGrid && <GridFloor />}
                        
                        {wells.map(well => {
                            const path = wellPaths[well.id];
                            if (!path) return null;
                            return (
                                <WellComponent 
                                    key={well.id} 
                                    well={well} 
                                    path={path}
                                    colorMode={vizSettings.colorMode}
                                    curveData={vizSettings.activeCurve}
                                    curveRange={curveRange}
                                    isHovered={hoveredWellId === well.id}
                                    onHover={setHoveredWellId}
                                />
                            );
                        })}

                        {surfaces.map((surf, idx) => (
                            <SurfaceComponent 
                                key={idx} 
                                geometry={surf.geometry} 
                                color={surf.color} 
                                opacity={vizSettings.surfaceOpacity} 
                                visible={vizSettings.showSurfaces}
                            />
                        ))}
                    </group>
                </Canvas>

                {/* Overlays */}
                <Legend mode={vizSettings.colorMode} curve={vizSettings.activeCurve} range={curveRange.map(n => n.toFixed(2))} />
                
                {hoveredWellId && (
                    <div className="absolute top-4 right-4 bg-black/80 text-white p-2 rounded border border-blue-500 text-xs">
                        <div className="font-bold">Active Interaction</div>
                        <div>Well: {wells.find(w => w.id === hoveredWellId)?.name}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThreeDVisualizationPanel;
