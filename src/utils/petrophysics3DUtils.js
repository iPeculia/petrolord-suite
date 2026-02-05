import * as THREE from 'three';
import * as d3 from 'd3';

// --- Color Scales ---
export const getCurveColor = (value, min, max, type) => {
    const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));
    
    if (type === 'GR') {
        // Gamma Ray: Yellow (sand) to Green/Brown (shale)
        return new THREE.Color().lerpColors(new THREE.Color('#FCD34D'), new THREE.Color('#064E3B'), normalized);
    } else if (type === 'PHIE' || type === 'NPHI') {
        // Porosity: White (tight) to Blue (porous)
        return new THREE.Color().lerpColors(new THREE.Color('#FFFFFF'), new THREE.Color('#3B82F6'), normalized);
    } else if (type === 'SW') {
        // Saturation: Red (oil) to Blue (water)
        return new THREE.Color().lerpColors(new THREE.Color('#EF4444'), new THREE.Color('#3B82F6'), normalized);
    } else if (type === 'RHOB') {
        // Density: Red to Blue
        return new THREE.Color().lerpColors(new THREE.Color('#EF4444'), new THREE.Color('#3B82F6'), normalized);
    } else {
        // Default rainbow
        const hue = (1 - normalized) * 0.66; // Red to Blue
        return new THREE.Color().setHSL(hue, 1, 0.5);
    }
};

// --- Geometry Generation ---

export const generateWellPath = (well, offset = { x: 0, y: 0 }) => {
    // Try to parse location from header, otherwise use offset or random
    let x = offset.x;
    let y = offset.y;
    
    // Simplistic parsing logic for X/Y if they exist in header
    if (well.header?.X?.value && !isNaN(well.header.X.value)) x = parseFloat(well.header.X.value);
    if (well.header?.Y?.value && !isNaN(well.header.Y.value)) y = parseFloat(well.header.Y.value);

    // We use Z-up in 3D space usually, but Three.js is Y-up. 
    // Subsurface usually: X=East, Y=North, Z=Depth (Down).
    // In Three.js: x=x, y=depth (negative), z=y (north).
    
    const depthKey = well.curveMap?.DEPTH || 'DEPTH';
    if (!well.data || well.data.length === 0) return null;

    const pathPoints = well.data.map(row => {
        const depth = row[depthKey];
        // Simulate minor deviation for visual interest if no survey
        // const deviationX = Math.sin(depth / 100) * 10; 
        // const deviationY = Math.cos(depth / 150) * 10;
        
        // Simple Vertical Well for now
        return new THREE.Vector3(x, -depth, y); 
    });

    return pathPoints;
};

export const generateLogMesh = (well, pathPoints, curveKey, curveRange) => {
    if (!pathPoints || pathPoints.length < 2) return null;

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    const radius = 2; // Tube radius
    const segments = 8; // Radial segments

    // Create a simplistic "tube" by stacking rings
    // This is manual geometry creation for vertex coloring
    
    const depthKey = well.curveMap?.DEPTH || 'DEPTH';
    const min = curveRange[0];
    const max = curveRange[1];

    for (let i = 0; i < pathPoints.length - 1; i++) {
        const p1 = pathPoints[i];
        const p2 = pathPoints[i + 1];
        const val1 = well.data[i][curveKey];
        const val2 = well.data[i+1][curveKey];

        if (val1 === null || val2 === null) continue;

        const c1 = getCurveColor(val1, min, max, curveKey);
        const c2 = getCurveColor(val2, min, max, curveKey);

        // Vector along the segment
        const diff = new THREE.Vector3().subVectors(p2, p1);
        // Arbitrary perpendicular vector (assuming mostly vertical)
        const perp = new THREE.Vector3(1, 0, 0);
        if (Math.abs(diff.x) < 0.001 && Math.abs(diff.z) < 0.001) {
            // perfectly vertical
        } else {
            // adjust perp
        }
        
        // Simple approach: thick line via triangle strip (billboard) or just use LineSegments for performance
        // For "tube" look, we need rings.
        // Let's stick to simple colored LineSegments for performance with many wells/points
        // Or thick lines using a special shader. 
        
        // For this implementation, we'll return Line positions and colors
        vertices.push(p1.x, p1.y, p1.z);
        vertices.push(p2.x, p2.y, p2.z);
        colors.push(c1.r, c1.g, c1.b);
        colors.push(c2.r, c2.g, c2.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    return geometry;
};

export const generateStratigraphicSurface = (markerName, wells, wellPaths) => {
    // 1. Collect points for this marker
    const points = [];
    
    wells.forEach((well, index) => {
        const marker = well.markers?.find(m => m.name === markerName); // Assuming well object has markers attached
        // If markers are separate in state, we need to pass them differently.
        // Assuming we find the depth:
        if (marker && wellPaths[well.id]) {
            // Interpolate position along well path
            // For vertical wells, just (x, -depth, y)
            const path = wellPaths[well.id];
            // Find closest point in path or just use header X,Y
            const depth = marker.depth;
            if (path.length > 0) {
                const wellX = path[0].x;
                const wellY = path[0].z; // Z in threejs is North/Y
                points.push(new THREE.Vector3(wellX, -depth, wellY));
            }
        }
    });

    if (points.length < 3) return null; // Need at least 3 points for a surface

    // 2. Triangulate (Delaunay on X, Z plane)
    const points2D = points.map(p => [p.x, p.z]);
    const delaunay = d3.Delaunay.from(points2D);
    const triangles = delaunay.triangles; // Uint32Array of indices

    // 3. Create Geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    // Flatten points
    const positionAttribute = [];
    points.forEach(p => positionAttribute.push(p.x, p.y, p.z));
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionAttribute, 3));
    geometry.setIndex(Array.from(triangles));
    geometry.computeVertexNormals();

    return geometry;
};