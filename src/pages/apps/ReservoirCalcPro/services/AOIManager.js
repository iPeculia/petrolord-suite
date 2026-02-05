import { v4 as uuidv4 } from 'uuid';
import { PolygonClippingEngine } from './PolygonClippingEngine';

export class AOIManager {
    static createAOI(name, vertices = [], color = '#3b82f6') {
        return {
            id: uuidv4(),
            name: name || 'New AOI',
            vertices: vertices, // Array of {x, y}
            color: color,
            visible: true,
            createdAt: new Date().toISOString(),
            area: this.calculateArea(vertices)
        };
    }

    static calculateArea(vertices) {
        if (!vertices || vertices.length < 3) return 0;
        return PolygonClippingEngine.calculatePolygonArea(vertices);
    }

    static validatePolygon(vertices) {
        if (!vertices || vertices.length < 3) return { valid: false, message: "At least 3 points required" };
        // Basic self-intersection check could go here, for now we rely on visual
        return { valid: true };
    }

    static exportGeoJSON(aoi, unitSystem = 'field') {
        // Simple conversion to GeoJSON Feature
        // Assuming coordinates are already projected (X, Y)
        const coordinates = [...aoi.vertices, aoi.vertices[0]].map(v => [v.x, v.y]);
        
        return {
            type: "Feature",
            properties: {
                name: aoi.name,
                color: aoi.color,
                area: aoi.area,
                unitSystem
            },
            geometry: {
                type: "Polygon",
                coordinates: [coordinates]
            }
        };
    }

    static importGeoJSON(feature) {
        if (feature.geometry && feature.geometry.type === "Polygon") {
            const coords = feature.geometry.coordinates[0];
            // Remove last point if it matches first (closed loop) to match internal format
            if (coords.length > 0 && 
                coords[0][0] === coords[coords.length-1][0] && 
                coords[0][1] === coords[coords.length-1][1]) {
                coords.pop();
            }
            
            const vertices = coords.map(c => ({ x: c[0], y: c[1] }));
            return this.createAOI(
                feature.properties?.name || 'Imported AOI',
                vertices,
                feature.properties?.color || '#3b82f6'
            );
        }
        return null;
    }
}