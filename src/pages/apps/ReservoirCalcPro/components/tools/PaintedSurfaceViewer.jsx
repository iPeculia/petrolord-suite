
/* eslint-disable react/no-unknown-property */
import React, { useMemo, Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Center, Environment, GizmoHelper, GizmoViewport, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Loader2 } from 'lucide-react';

// Improved Camera Controller to prevent fly-away or NaN issues
const CameraController = ({ bounds }) => {
    const { camera, controls } = useThree();
    const fitted = useRef(false);

    useEffect(() => {
        if (bounds && controls && !fitted.current) {
            try {
                controls.fitToBox(bounds, true);
                fitted.current = true;
            } catch (e) {
                console.warn("Camera fit error:", e);
            }
        }
    }, [bounds, controls]);

    return null;
};

const SurfaceMesh = ({ gridData, onBoundsCalculated }) => {
    const meshData = useMemo(() => {
        // Validation
        if (!gridData || !gridData.z || !gridData.x || !gridData.y) return null;
        
        const nx = gridData.x.length;
        const ny = gridData.y.length;
        if (nx < 2 || ny < 2) return null;

        try {
            // Calculate dimensions
            const minX = gridData.x[0];
            const maxX = gridData.x[nx - 1];
            const minY = gridData.y[0];
            const maxY = gridData.y[ny - 1];
            
            const width = Math.abs(maxX - minX);
            const height = Math.abs(maxY - minY);
            
            if (width === 0 || height === 0) return null;

            const geometry = new THREE.PlaneGeometry(width, height, nx - 1, ny - 1);
            const positions = geometry.attributes.position.array;

            let minZ = Infinity;
            let maxZ = -Infinity;

            // IMPORTANT: Three.js PlaneGeometry creates vertices row-by-row, usually Top-to-Bottom.
            // Our GridData.z is typically ordered Bottom-to-Top (y[0] = min Y).
            // We must iterate Y backwards (ny-1 down to 0) to match Three.js vertex order.
            
            let pIdx = 0;
            for (let j = ny - 1; j >= 0; j--) { // Iterate rows Top to Bottom
                for (let i = 0; i < nx; i++) {  // Iterate cols Left to Right
                    let zVal = gridData.z[j] ? gridData.z[j][i] : null;
                    
                    // Handle nulls/NaNs
                    if (zVal === null || zVal === undefined || isNaN(zVal)) {
                        // Fallback to closest logical value or 0
                        zVal = minZ !== Infinity ? minZ : 0; 
                    }

                    // Track range
                    if (zVal < minZ) minZ = zVal;
                    if (zVal > maxZ) maxZ = zVal;

                    // Set vertex Z (local displacement)
                    // Scaling down by 5 to avoid extreme vertical exaggeration in visualization
                    positions[pIdx * 3 + 2] = zVal / 5; 
                    pIdx++;
                }
            }
            
            geometry.computeVertexNormals();
            
            // Calculate bounds for camera
            geometry.computeBoundingBox();
            const box = geometry.boundingBox;

            return { geometry, minZ, maxZ, box };

        } catch (err) {
            console.error("Mesh Generation Error:", err);
            return null;
        }
    }, [gridData]);

    useEffect(() => {
        if (meshData && onBoundsCalculated) {
            onBoundsCalculated(meshData.box);
        }
    }, [meshData, onBoundsCalculated]);

    if (!meshData) return null;

    return (
        <mesh geometry={meshData.geometry} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
            <meshStandardMaterial 
                color="#3b82f6"
                roughness={0.4}
                metalness={0.2}
                side={THREE.DoubleSide}
                flatShading={false}
            />
        </mesh>
    );
};

const PaintedSurfaceViewer = ({ gridData }) => {
    const [bounds, setBounds] = useState(null);

    // Key to force re-mount on new data to prevent Three.js context issues
    const canvasKey = useMemo(() => gridData ? `${gridData.x?.[0]}-${gridData.z?.length}` : 'empty', [gridData]);

    if (!gridData || !gridData.z) {
        return <div className="w-full h-full flex items-center justify-center text-slate-600">No 3D Data</div>;
    }

    return (
        <div className="w-full h-full bg-slate-950 relative overflow-hidden group">
            <Canvas shadows dpr={[1, 2]} key={canvasKey} className="w-full h-full block">
                <Suspense fallback={<Html center><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></Html>}>
                    <PerspectiveCamera makeDefault position={[0, 2000, 2000]} fov={45} near={10} far={100000} />
                    <OrbitControls 
                        makeDefault 
                        enableDamping 
                        dampingFactor={0.1} 
                        rotateSpeed={0.6} 
                        zoomSpeed={0.8}
                    />
                    
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5000, 10000, 5000]} intensity={1.2} castShadow />
                    <pointLight position={[-5000, 5000, -5000]} intensity={0.5} />

                    <Center>
                         <SurfaceMesh gridData={gridData} onBoundsCalculated={setBounds} />
                    </Center>
                    
                    <gridHelper args={[50000, 50, '#1e293b', '#0f172a']} position={[0, -5000, 0]} />
                    <Environment preset="city" />
                    
                    <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                        <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
                    </GizmoHelper>

                    {bounds && <CameraController bounds={bounds} />}
                </Suspense>
            </Canvas>
            
            <div className="absolute bottom-2 left-4 text-[9px] text-slate-600 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity select-none">
                Left: Rotate • Right: Pan • Scroll: Zoom
            </div>
        </div>
    );
};

export default React.memo(PaintedSurfaceViewer);
