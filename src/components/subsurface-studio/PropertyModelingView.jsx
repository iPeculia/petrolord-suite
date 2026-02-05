
/* eslint-disable react/no-unknown-property */
import React, { useState, Suspense } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, Center, Box } from '@react-three/drei';
import { useToast } from '@/components/ui/use-toast';

// Components
import PropertyModelingToolbar from './property-modeling/PropertyModelingToolbar';
import PropertyLayerManager from './property-modeling/PropertyLayerManager';
import VolumetricCalculationPanel from './property-modeling/VolumetricCalculationPanel';
import PropertyDistributionPanel from './property-modeling/PropertyDistributionPanel';
import UncertaintyAnalysisPanel from './property-modeling/UncertaintyAnalysisPanel';
import PropertyAnalysisPanel from './property-modeling/PropertyAnalysisPanel';
import PropertyExportPanel from './property-modeling/PropertyExportPanel';

// Mock property grid visualization
const PropertyGridViz = ({ property, opacity }) => {
    // Create a simple 3D grid of cubes representing cells
    // In reality this would be InstancedMesh with thousands of cells
    const cells = [];
    for(let x=0; x<5; x++) {
        for(let y=0; y<5; y++) {
            for(let z=0; z<3; z++) {
                // Mock property value determining color
                const val = Math.random(); 
                let color = 'blue';
                if (property === 'porosity') {
                    color = val > 0.8 ? '#10b981' : val > 0.5 ? '#f59e0b' : '#3b82f6';
                } else if (property === 'permeability') {
                    color = val > 0.7 ? '#ef4444' : '#a855f7';
                }

                cells.push(
                    <Box 
                        key={`${x}-${y}-${z}`} 
                        position={[x*12 - 30, z*12, y*12 - 30]} 
                        args={[10, 10, 10]}
                    >
                         <meshStandardMaterial color={color} transparent opacity={opacity} />
                    </Box>
                );
            }
        }
    }
    return <group>{cells}</group>;
};

const PropertyModelingView = () => {
    const { toast } = useToast();
    
    // State
    const [activeTool, setActiveTool] = useState('select');
    const [activeProperty, setActiveProperty] = useState('porosity');
    const [layers, setLayers] = useState({
        grid: { visible: true, opacity: 1.0 },
        wells: { visible: true, opacity: 0.8 },
        contacts: { visible: false, opacity: 0.5 },
        uncertainty: { visible: false, opacity: 0.3 }
    });
    const [showLayerManager, setShowLayerManager] = useState(false);

    const handleRunModel = (prop, method) => {
        setActiveProperty(prop);
        toast({ title: "Model Updated", description: `Displaying ${prop} distribution.` });
    };

    return (
        <div className="flex h-full w-full bg-slate-950 text-white overflow-hidden font-sans flex-col">
            <PropertyModelingToolbar 
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
                {/* LEFT PANEL: Controls */}
                <Panel defaultSize={25} minSize={20} maxSize={35} className="bg-slate-900 border-r border-slate-800 flex flex-col">
                    <ScrollArea className="h-full p-4 space-y-4">
                        <VolumetricCalculationPanel 
                            onCalculate={(val) => console.log("STOIP:", val)}
                        />
                        
                        <PropertyDistributionPanel 
                            onRunModel={handleRunModel}
                        />

                        <UncertaintyAnalysisPanel />

                        <PropertyAnalysisPanel property={activeProperty} />

                        <PropertyExportPanel />
                    </ScrollArea>
                </Panel>

                <PanelResizeHandle className="w-1 bg-slate-800 hover:bg-cyan-500 transition-colors" />

                {/* CENTER PANEL: 3D Visualization */}
                <Panel className="relative bg-black">
                    <Canvas camera={{ position: [100, 80, 100], fov: 50 }}>
                        <color attach="background" args={['#020617']} />
                        <Suspense fallback={null}>
                            <Center>
                                {layers.grid.visible && (
                                    <PropertyGridViz 
                                        property={activeProperty} 
                                        opacity={layers.grid.opacity} 
                                    />
                                )}
                                
                                {/* Mock Well */}
                                {layers.wells.visible && (
                                    <mesh position={[0, 20, 0]}>
                                        <cylinderGeometry args={[0.5, 0.5, 100, 8]} />
                                        <meshStandardMaterial color="white" />
                                    </mesh>
                                )}

                                {/* Mock Contact Plane */}
                                {layers.contacts.visible && (
                                    <mesh position={[0, -10, 0]} rotation={[-Math.PI/2, 0, 0]}>
                                        <planeGeometry args={[100, 100]} />
                                        <meshStandardMaterial color="blue" transparent opacity={0.3} side={2} />
                                    </mesh>
                                )}
                            </Center>
                            
                            <Grid args={[200, 200]} cellSize={10} cellThickness={0.5} sectionSize={50} sectionThickness={1} fadeDistance={400} sectionColor="#334155" cellColor="#1e293b" />
                            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI/2} />
                            <Environment preset="city" />
                            <ambientLight intensity={0.5} />
                            <directionalLight position={[10, 20, 5]} intensity={1} />
                        </Suspense>
                    </Canvas>

                    {/* Layer Manager Overlay */}
                    {showLayerManager && (
                        <div className="absolute top-4 right-4 w-64 z-10">
                            <PropertyLayerManager layers={layers} setLayers={setLayers} />
                        </div>
                    )}

                    {/* Legend Overlay */}
                    <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur p-3 rounded border border-slate-800 text-xs">
                        <div className="font-bold mb-2 text-slate-200 capitalize">{activeProperty}</div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> <span>High</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-sm"></div> <span>Medium</span></div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> <span>Low</span></div>
                        </div>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default PropertyModelingView;
