
/* eslint-disable react/no-unknown-property */
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, GizmoHelper, GizmoViewport, Center } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { Layers, Box, Activity, Eye, Maximize } from 'lucide-react';
import * as THREE from 'three';

const Geobody = ({ position, type, selected, onClick }) => {
  const color = type === 'channel' ? '#3b82f6' : 
                type === 'lobe' ? '#22c55e' : 
                type === 'salt' ? '#ef4444' : '#eab308';
  
  return (
    <mesh position={position} onClick={onClick}>
      <boxGeometry args={[1, 1, 3]} />
      <meshStandardMaterial 
        color={selected ? '#ffffff' : color} 
        transparent 
        opacity={0.8} 
        wireframe={selected}
      />
      {selected && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1, 1, 3)]} />
          <lineBasicMaterial color="white" />
        </lineSegments>
      )}
    </mesh>
  );
};

const ObjectViewer3D = ({ objects = [], onObjectSelect }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [layers, setLayers] = useState({ grid: true, bodies: true, wells: true });

  // Mock objects if none provided
  const displayObjects = objects.length > 0 ? objects : [
    { id: 1, type: 'channel', position: [0, 0, 0] },
    { id: 2, type: 'lobe', position: [2, 0, 2] },
    { id: 3, type: 'salt', position: [-2, 1, -2] },
  ];

  const handleSelect = (id) => {
    setSelectedId(id);
    if(onObjectSelect) onObjectSelect(displayObjects.find(o => o.id === id));
  };

  return (
    <div className="w-full h-full relative bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
      <Canvas camera={{ position: [10, 10, 10], fov: 45 }}>
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Center>
            {layers.bodies && displayObjects.map(obj => (
              <Geobody 
                key={obj.id} 
                {...obj} 
                selected={selectedId === obj.id}
                onClick={(e) => { e.stopPropagation(); handleSelect(obj.id); }}
              />
            ))}
          </Center>
          <Environment preset="city" />
        </Suspense>
        {layers.grid && <Grid infiniteGrid fadeDistance={50} sectionColor="#475569" cellColor="#1e293b" />}
        <OrbitControls makeDefault />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
        </GizmoHelper>
      </Canvas>

      {/* HUD Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Card className="p-2 bg-slate-900/90 backdrop-blur border-slate-800">
          <div className="flex flex-col gap-2">
            <Toggle pressed={layers.grid} onPressedChange={() => setLayers(prev => ({...prev, grid: !prev.grid}))} size="sm" className="justify-start">
              <Box className="w-4 h-4 mr-2" /> Grid
            </Toggle>
            <Toggle pressed={layers.bodies} onPressedChange={() => setLayers(prev => ({...prev, bodies: !prev.bodies}))} size="sm" className="justify-start">
              <Layers className="w-4 h-4 mr-2" /> Geobodies
            </Toggle>
            <Toggle pressed={layers.wells} onPressedChange={() => setLayers(prev => ({...prev, wells: !prev.wells}))} size="sm" className="justify-start">
              <Activity className="w-4 h-4 mr-2" /> Wells
            </Toggle>
          </div>
        </Card>
        <div className="flex gap-2">
            <Button size="sm" variant="secondary" className="flex-1"><Eye className="w-4 h-4 mr-2"/> Reset View</Button>
            <Button size="sm" variant="secondary" className="flex-1"><Maximize className="w-4 h-4 mr-2"/> Full</Button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4">
        <Card className="p-3 bg-slate-900/90 backdrop-blur border-slate-800">
          <h4 className="text-xs font-bold text-slate-400 mb-2 uppercase">Legend</h4>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-slate-300"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Channel</div>
            <div className="flex items-center gap-2 text-xs text-slate-300"><span className="w-3 h-3 rounded-full bg-green-500"></span> Lobe</div>
            <div className="flex items-center gap-2 text-xs text-slate-300"><span className="w-3 h-3 rounded-full bg-red-500"></span> Salt Dome</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ObjectViewer3D;
