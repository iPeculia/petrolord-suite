
/* eslint-disable react/no-unknown-property */
import React, { useState, useRef, Suspense, useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, Center } from '@react-three/drei';
import { useToast } from '@/components/ui/use-toast';

// Components
import StructuralFrameworkToolbar from './structural/StructuralFrameworkToolbar';
import StructuralLayerManager from './structural/StructuralLayerManager';
import FaultModelingPanel from './structural/FaultModelingPanel';
import HorizonModelingPanel from './structural/HorizonModelingPanel';
import GridGenerationPanel from './structural/GridGenerationPanel';
import PropertyModelingPanel from './structural/PropertyModelingPanel';
import StructuralAnalysisPanel from './structural/StructuralAnalysisPanel';
import StructuralFrameworkExportPanel from './structural/StructuralFrameworkExportPanel';

// Utils
import { generateStructuralGrid, distributeProperty } from '@/utils/structuralModelingUtils';

// --- 3D Visualization Components (Mini) ---
const FaultSurface = ({ fault }) => {
    // Simple plane representation for a fault
    // Dip and Strike would control rotation
    const rotationX = (fault.dip * Math.PI) / 180;
    return (
        <mesh position={[0, -10, 0]} rotation={[rotationX, 0, 0]}>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="red" side={2} transparent opacity={0.5} />
        </mesh>
    );
};

const HorizonSurface = ({ horizon }) => {
    // Simple wavy surface
    return (
        <mesh position={[0, -horizon.depth / 100, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[300, 300, 32, 32]} />
            <meshStandardMaterial color="yellow" wireframe={false} side={2} transparent opacity={0.6} />
        </mesh>
    );
};

const StructuralGridViz = ({ grid, property }) => {
    if (!grid) return null;
    // Visualize grid points as simple points or instanced mesh
    // Simplified: render a few blocks
    return (
        <group>
            {grid.points.filter((_, i) => i % 50 === 0).map((pt, i) => (
                <mesh key={i} position={[pt.x - grid.params.originX - 100, (pt.z / 10), pt.y - grid.params.originY - 100]}>
                     <boxGeometry args={[2, 2, 2]} />
                     <meshStandardMaterial color={property === 'porosity' ? 'blue' : 'green'} />
                </mesh>
            ))}
        </group>
    );
};

const StructuralFrameworkView = () => {
    const { toast } = useToast();
    
    // State
    const [activeTool, setActiveTool] = useState('select');
    const [layers, setLayers] = useState({
        faults: { visible: true, opacity: 0.8 },
        horizons: { visible: true, opacity: 0.8 },
        grids: { visible: true, opacity: 1.0 },
        properties: { visible: true, opacity: 1.0 },
        wells: { visible: true, opacity: 1.0 }
    });
    const [showLayerManager, setShowLayerManager] = useState(false);

    // Model Data
    const [faults, setFaults] = useState([
        { id: 'f1', name: 'Main Boundary Fault', type: 'Normal', dip: 65, throw: 120 }
    ]);
    const [horizons, setHorizons] = useState([
        { id: 'h1', name: 'Top Reservoir', type: 'Seismic', depth: 2500 }
    ]);
    const [grid, setGrid] = useState(null);
    const [activeProperty, setActiveProperty] = useState(null);

    // Selections
    const [activeFault, setActiveFault] = useState(null);
    const [activeHorizon, setActiveHorizon] = useState(null);

    // Actions
    const handleGenerateGrid = (params) => {
        const newGrid = generateStructuralGrid(horizons, faults, params);
        setGrid(newGrid);
        toast({ title: "Grid Generated", description: `${newGrid.points.length} cells created.` });
    };

    const handleRunPropertyModel = (prop, method) => {
        setActiveProperty(prop);
        if(grid) {
            // In real app, store values in grid
            distributeProperty(grid, prop, method); 
            toast({ title: "Property Modeled", description: `${prop} distributed using ${method}.` });
        }
    };

    const handleSaveFault = () => {
        if(activeFault?.id) {
            setFaults(prev => prev.map(f => f.id === activeFault.id ? activeFault : f));
        } else if (activeFault) {
            const newF = { ...activeFault, id: crypto.randomUUID() };
            setFaults(prev => [...prev, newF]);
            setActiveFault(newF);
        }
        toast({ title: "Fault Saved" });
    };

    const handleSaveHorizon = () => {
         if(activeHorizon?.id) {
            setHorizons(prev => prev.map(h => h.id === activeHorizon.id ? activeHorizon : h));
        } else if (activeHorizon) {
            const newH = { ...activeHorizon, id: crypto.randomUUID() };
            setHorizons(prev => [...prev, newH]);
            setActiveHorizon(newH);
        }
        toast({ title: "Horizon Saved" });
    };

    return (
        <div className="flex h-full w-full bg-slate-950 text-white overflow-hidden font-sans flex-col">
            <StructuralFrameworkToolbar 
                activeTool={activeTool} 
                setActiveTool={setActiveTool}
                toggleLayerManager={() => setShowLayerManager(!showLayerManager)}
                onExport={() => toast({title: "Opening Export Dialog"})}
                onUndo={() => toast({title: "Undo"})}
                onRedo={() => toast({title: "Redo"})}
                onReset={() => toast({title: "View Reset"})}
                onZoomIn={() => {}}
                onZoomOut={() => {}}
            />

            <PanelGroup direction="horizontal" className="flex-grow">
                {/* LEFT PANEL: Modeling Controls */}
                <Panel defaultSize={20} minSize={15} maxSize={30} className="bg-slate-900 border-r border-slate-800 flex flex-col">
                    <ScrollArea className="h-full p-4 space-y-4">
                        {activeTool === 'create_fault' && (
                            <FaultModelingPanel 
                                activeFault={activeFault} 
                                setActiveFault={setActiveFault} 
                                faultList={faults}
                                onSave={handleSaveFault}
                                onDelete={(id) => setFaults(prev => prev.filter(f => f.id !== id))}
                            />
                        )}
                        {activeTool === 'create_horizon' && (
                            <HorizonModelingPanel 
                                activeHorizon={activeHorizon}
                                setActiveHorizon={setActiveHorizon}
                                horizonList={horizons}
                                onSave={handleSaveHorizon}
                                onDelete={(id) => setHorizons(prev => prev.filter(h => h.id !== id))}
                            />
                        )}
                        {activeTool === 'generate_grid' && (
                            <GridGenerationPanel onGenerate={handleGenerateGrid} />
                        )}
                        
                        <PropertyModelingPanel onRunModel={handleRunPropertyModel} />
                        
                        <StructuralAnalysisPanel />
                        
                        <StructuralFrameworkExportPanel />
                    </ScrollArea>
                </Panel>

                <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-cyan-500 transition-colors" />

                {/* CENTER PANEL: 3D Visualization */}
                <Panel className="relative bg-black">
                    <Canvas camera={{ position: [200, 200, 200], fov: 45 }}>
                        <color attach="background" args={['#0f172a']} />
                        <Suspense fallback={null}>
                            <Center>
                                {layers.faults.visible && faults.map(f => <FaultSurface key={f.id} fault={f} />)}
                                {layers.horizons.visible && horizons.map(h => <HorizonSurface key={h.id} horizon={h} />)}
                                {layers.grids.visible && grid && <StructuralGridViz grid={grid} property={activeProperty} />}
                            </Center>
                            <Grid args={[500, 500]} cellSize={50} cellThickness={1} sectionSize={100} sectionThickness={1.5} fadeDistance={800} sectionColor="#334155" cellColor="#1e293b" />
                            <OrbitControls makeDefault />
                            <Environment preset="city" />
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 10, 5]} intensity={1} />
                        </Suspense>
                    </Canvas>

                    {/* Layer Manager Overlay */}
                    {showLayerManager && (
                        <div className="absolute top-4 right-4 w-64 z-10">
                            <StructuralLayerManager layers={layers} setLayers={setLayers} />
                        </div>
                    )}
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default StructuralFrameworkView;
