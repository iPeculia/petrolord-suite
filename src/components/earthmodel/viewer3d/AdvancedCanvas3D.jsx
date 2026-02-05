
/* eslint-disable react/no-unknown-property */
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, GizmoHelper, GizmoViewport } from '@react-three/drei';
import * as THREE from 'three';

// Dummy data generators for visualization
const generatePoints = (count, bounds) => {
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push(
      (Math.random() - 0.5) * bounds,
      (Math.random() - 0.5) * bounds,
      (Math.random() - 0.5) * bounds
    );
  }
  return new Float32Array(points);
};

const SeismicPlane = ({ position, rotation, color }) => (
  <mesh position={position} rotation={rotation}>
    <planeGeometry args={[20, 20]} />
    <meshStandardMaterial color={color} opacity={0.5} transparent side={THREE.DoubleSide} />
  </mesh>
);

const FaultSurface = ({ points }) => (
  <mesh>
    <bufferGeometry>
      <bufferAttribute
        attach="attributes-position"
        count={points.length / 3}
        array={points}
        itemSize={3}
      />
    </bufferGeometry>
    <pointsMaterial size={0.2} color="red" />
  </mesh>
);

const FaciesGrid = ({ count }) => {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => [new THREE.Color('#F4A460'), new THREE.Color('#708090'), new THREE.Color('#BDB76B')], []);

  useFrame(() => {
    if (mesh.current) {
      let i = 0;
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 5; y++) {
          for (let z = 0; z < 10; z++) {
            dummy.position.set(x - 5, y - 2.5, z - 5);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
            mesh.current.setColorAt(i, colors[Math.floor(Math.random() * 3)]);
            i++;
          }
        }
      }
      mesh.current.instanceMatrix.needsUpdate = true;
      mesh.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, 500]}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial />
    </instancedMesh>
  );
};

const AdvancedCanvas3D = ({ layers = { grid: true, faults: true, seismic: true } }) => {
  const faultPoints = useMemo(() => generatePoints(1000, 15), []);

  return (
    <div className="w-full h-full bg-slate-950 relative">
      <Canvas camera={{ position: [15, 15, 15], fov: 50 }}>
        <color attach="background" args={['#0f172a']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        <group>
          {layers.grid && <FaciesGrid />}
          {layers.faults && <FaultSurface points={faultPoints} />}
          {layers.seismic && (
            <>
              <SeismicPlane position={[0, 0, 0]} rotation={[0, 0, 0]} color="#4ade80" />
              <SeismicPlane position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="#60a5fa" />
            </>
          )}
        </group>

        <Grid infiniteGrid sectionColor="#475569" cellColor="#1e293b" fadeDistance={50} />
        <OrbitControls makeDefault />
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
        </GizmoHelper>
        <Environment preset="city" />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 text-xs text-slate-500 pointer-events-none">
        WebGL Rendering • {layers.grid ? 'Grid: ON' : 'Grid: OFF'} • {layers.faults ? 'Faults: ON' : 'Faults: OFF'}
      </div>
    </div>
  );
};

export default AdvancedCanvas3D;
