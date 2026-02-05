
/* eslint-disable react/no-unknown-property */
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, Stars, TransformControls } from '@react-three/drei';
import ViewerControls from './ViewerControls';

// Enhanced Surface Mesh with better materials
const SurfaceMesh = ({ points, color = 'orange', ve = 1 }) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} scale={[1, 1, 1]}>
      <planeGeometry args={[20, 20, 64, 64]} />
      <meshStandardMaterial 
        color={color} 
        wireframe={false} 
        roughness={0.4}
        metalness={0.1}
        side={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

const WellPath = ({ path, color = 'white' }) => {
  return (
     <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 10]} />
        <meshStandardMaterial color={color} />
     </mesh>
  );
};

const GridBlock = ({ position, size, color }) => (
    <mesh position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} transparent opacity={0.6} />
    </mesh>
);

const Canvas3D = ({ surfaces = [], wells = [], grids = [] }) => {
  const [ve, setVe] = useState(1);
  const [layers, setLayers] = useState({
      surfaces: true,
      wells: true,
      grids: true,
      gridLines: true
  });

  const handleCameraChange = (preset) => {
      // This would ideally use a ref to the OrbitControls or Camera to animate
      console.log("Move camera to", preset);
  };

  return (
    <div className="h-full w-full bg-slate-950 relative overflow-hidden">
      <Canvas camera={{ position: [15, 15, 15], fov: 50 }} shadows>
        <Suspense fallback={null}>
          <color attach="background" args={['#0f172a']} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#4ade80" />
          
          {layers.gridLines && (
             <Grid infiniteGrid fadeDistance={50} cellColor="#334155" sectionColor="#475569" />
          )}
          
          {layers.surfaces && surfaces.map((surface, i) => (
             <SurfaceMesh key={i} color={surface.color || 'orange'} ve={ve} />
          ))}

          {layers.surfaces && <SurfaceMesh color="#3b82f6" />} 
          {/* Demo Surface */}

          {layers.wells && wells.map((well, i) => (
             <WellPath key={i} />
          ))}
          
          {/* Demo Grid Block */}
          {layers.grids && (
              <group position={[5, 2, 5]}>
                 <GridBlock position={[0,0,0]} size={[2,2,2]} color="purple" />
              </group>
          )}

          <OrbitControls makeDefault />
          <Environment preset="city" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        </Suspense>
      </Canvas>
      
      <ViewerControls 
        onCameraChange={handleCameraChange}
        layers={layers}
        onLayerToggle={(key) => setLayers(p => ({...p, [key]: !p[key]}))}
        verticalExaggeration={ve}
        onVeChange={setVe}
      />
    </div>
  );
};

export default Canvas3D;
