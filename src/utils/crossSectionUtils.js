import { getDistance } from 'geolib';
import * as THREE from 'three';
import * as d3 from 'd3';

// Calculate total length of the section line (polyline support)
export const calculateSectionLength = (points) => {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
        length += Math.sqrt(Math.pow(points[i].x - points[i-1].x, 2) + Math.pow(points[i].y - points[i-1].y, 2));
    }
    return length;
};

// Project a 3D point onto the 2D section line (Curtain projection)
// Returns { distance: number, offset: number, projectedPoint: {x,y} } 
export const projectPointToSection = (point, sectionLine) => {
    if (!sectionLine || sectionLine.length < 2) return null;

    let minDistance = Infinity;
    let bestProjection = null;
    let accumulatedLength = 0;

    for (let i = 1; i < sectionLine.length; i++) {
        const p1 = sectionLine[i-1];
        const p2 = sectionLine[i];
        const segmentVec = { x: p2.x - p1.x, y: p2.y - p1.y };
        const pointVec = { x: point.x - p1.x, y: point.y - p1.y };
        
        const segLenSq = segmentVec.x * segmentVec.x + segmentVec.y * segmentVec.y;
        const segLen = Math.sqrt(segLenSq);
        
        // Normalized t (0 to 1 along segment)
        let t = segLenSq === 0 ? 0 : (pointVec.x * segmentVec.x + pointVec.y * segmentVec.y) / segLenSq;
        t = Math.max(0, Math.min(1, t));

        const projectedX = p1.x + t * segmentVec.x;
        const projectedY = p1.y + t * segmentVec.y;
        
        // Perpendicular distance
        const distToSegment = Math.sqrt(Math.pow(point.x - projectedX, 2) + Math.pow(point.y - projectedY, 2));

        if (distToSegment < minDistance) {
            minDistance = distToSegment;
            bestProjection = {
                distance: accumulatedLength + (t * segLen),
                offset: distToSegment,
                segmentIndex: i - 1,
                projectedPoint: { x: projectedX, y: projectedY }
            };
        }
        accumulatedLength += segLen;
    }

    return bestProjection;
};

// Get interpolation curve points (Spline) for horizons
export const getCatmullRomPoints = (points, tension = 0.5, numPoints = 50) => {
    if (points.length < 2) return points;
    
    // Prepare simple array for THREE
    const vectorPoints = points.map(p => new THREE.Vector2(p.x, p.y));
    const curve = new THREE.SplineCurve(vectorPoints);
    const spacedPoints = curve.getPoints(numPoints * (points.length - 1));
    
    return spacedPoints.map(v => ({ x: v.x, y: v.y }));
};

// Generate ticks for axes
export const generateDepthTicks = (min, max, step = 100) => {
    const ticks = [];
    const start = Math.ceil(min / step) * step;
    for (let d = start; d <= max; d += step) {
        ticks.push(d);
    }
    return ticks;
};

export const generateDistanceTicks = (length, step = 500) => {
    const ticks = [];
    for (let d = 0; d <= length; d += step) {
        ticks.push(d);
    }
    return ticks;
};

// Color scales for property mapping
export const getPropertyColor = (value, min, max, scaleType = 'rainbow') => {
    const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
    
    if (scaleType === 'rainbow' || scaleType === 'jet') {
        const h = (1 - t) * 240; 
        return `hsl(${h}, 100%, 50%)`;
    } else if (scaleType === 'viridis') {
        return d3.interpolateViridis(t);
    } else if (scaleType === 'plasma') {
        return d3.interpolatePlasma(t);
    } else if (scaleType === 'grayscale') {
        const v = Math.floor(t * 255);
        return `rgb(${v},${v},${v})`;
    }
    return 'gray';
};