
/* eslint-disable react/no-unknown-property */
import React, { Suspense, useMemo, useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Text, Grid, GizmoHelper, GizmoViewport, Html, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const WellPath = ({ stations, color, name, active, radius = 5, exaggeration = 1 }) => {
    const points = useMemo(() => {
        if (!stations || stations.length === 0) return [];
        return stations.map(s => new THREE.Vector3(s.East, (s.TVD * -1 * exaggeration), s.North));
    }, [stations, exaggeration]);

    if (points.length === 0) return null;

    const lastPoint = points[points.length - 1];

    return (
        <group>
            {/* Main Line */}
            <Line 
                points={points} 
                color={color} 
                lineWidth={active ? 4 : 3} 
                transparent
                opacity={active ? 1 : 0.8}
            />
            
            {/* Well Name Label */}
            <Html position={[lastPoint.x, lastPoint.y, lastPoint.z]}>
                <div className={`px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none transform -translate-y-full ${active ? 'bg-slate-900/80 text-white border border-lime-500' : 'bg-slate-800/60 text-slate-300'}`}>
                    {name}
                </div>
            </Html>

            {/* Surface Location Marker */}
            <mesh position={[points[0].x, points[0].y, points[0].z]}>
                <boxGeometry args={[20, 5, 20]} />
                <meshStandardMaterial color={active ? "#4CAF50" : "#64748b"} />
            </mesh>
        </group>
    );
};

const TargetMarker = ({ target, exaggeration = 1 }) => {
    const position = [target.x, (target.tvd_m * -1 * exaggeration), target.y];
    
    return (
        <group position={position}>
            {/* Target sphere */}
            <Sphere args={[15, 16, 16]}>
                <meshStandardMaterial color="#FFC107" transparent opacity={0.8} />
            </Sphere>
            {/* Tolerance cylinder if specified, simpler to just show center for now or disk */}
            <Cylinder args={[30, 30, 2, 32]} rotation={[Math.PI/2, 0, 0]}>
                 <meshBasicMaterial color="#FFC107" wireframe transparent opacity={0.3} />
            </Cylinder>
            
            <Html distanceFactor={5000}>
                <div className="bg-amber-500/90 text-black px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap">
                    {target.name}
                </div>
            </Html>
        </group>
    );
};

const WellTrajectory3DView = ({ 
    planResult, 
    offsetWells = [], 
    targets = [], 
    exaggeration = 1,
    showOffsetWells = true
}) => {
    const [resetKey, setResetKey] = useState(0);

    const handleReset = () => setResetKey(prev => prev + 1);

    return (
        <div className="h-full w-full relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            {/* Controls Overlay */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button 
                    onClick={handleReset}
                    className="bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-md text-xs backdrop-blur-sm border border-slate-600 transition-colors"
                >
                    Reset View
                </button>
                <div className="bg-slate-800/80 p-2 rounded-md backdrop-blur-sm border border-slate-600">
                    <div className="text-[10px] text-slate-400 mb-1 uppercase">Vertical Exaggeration</div>
                    <div className="text-center font-mono font-bold text-lime-400">{exaggeration}x</div>
                </div>
            </div>

            <Canvas camera={{ fov: 45, near: 10, far: 100000, position: [3000, 2000, 3000], up: [0, 0, -1] }}>
                <color attach="background" args={['#0f172a']} />
                <fog attach="fog" args={['#0f172a', 5000, 50000]} />
                
                <ambientLight intensity={0.7} />
                <pointLight position={[1000, 1000, 1000]} intensity={1} />
                <pointLight position={[-1000, -1000, -1000]} intensity={0.5} />

                <group scale={[1, 1, 1]}>
                    {/* Reference Well */}
                    {planResult && (
                        <WellPath 
                            stations={planResult} 
                            color="#4CAF50" 
                            name="Active Well" 
                            active={true} 
                            exaggeration={exaggeration}
                        />
                    )}

                    {/* Offset Wells */}
                    {showOffsetWells && offsetWells.map((well, idx) => (
                        <WellPath 
                            key={well.id || idx} 
                            stations={well.stations} 
                            color={well.color || "#64748b"} 
                            name={well.name} 
                            active={false}
                            exaggeration={exaggeration} 
                        />
                    ))}

                    {/* Targets */}
                    {targets.map((target, idx) => (
                        <TargetMarker key={target.id || idx} target={target} exaggeration={exaggeration} />
                    ))}

                    {/* Grid at Surface (Y=0) */}
                    <Grid 
                        position={[0, 0, 0]} 
                        args={[20000, 20000]} 
                        cellSize={1000} 
                        cellThickness={1} 
                        cellColor="#1e293b" 
                        sectionSize={5000} 
                        sectionThickness={1.5} 
                        sectionColor="#334155" 
                        fadeDistance={30000} 
                        infiniteGrid 
                    />
                    
                    {/* Depth Reference Planes */}
                    <Grid 
                        position={[0, -2000 * exaggeration, 0]} 
                        args={[20000, 20000]} 
                        cellSize={1000} 
                        cellColor="#1e293b" 
                        sectionSize={5000} 
                        sectionColor="#1e293b" 
                        fadeDistance={30000} 
                        infiniteGrid 
                    />
                </group>

                <OrbitControls 
                    makeDefault 
                    minDistance={100} 
                    maxDistance={50000} 
                    enableDamping 
                    dampingFactor={0.1}
                    target={[0, -2000, 0]}
                />
                
                <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                    <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
                </GizmoHelper>
            </Canvas>
        </div>
    );
};

export default WellTrajectory3DView;
