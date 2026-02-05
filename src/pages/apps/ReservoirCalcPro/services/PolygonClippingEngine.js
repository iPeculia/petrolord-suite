export class PolygonClippingEngine {
    /**
     * Checks if a point is inside a polygon using the Ray Casting algorithm.
     * This is the industry standard for point-in-polygon tests.
     * 
     * Algorithm:
     * 1. Cast a ray from the point in any fixed direction (usually horizontal +x).
     * 2. Count how many times the ray intersects with polygon edges.
     * 3. If the count is odd, the point is inside. If even, it's outside.
     * 
     * @param {Object} point - {x, y}
     * @param {Array} polygonVertices - Array of {x, y} objects
     * @returns {boolean} true if inside
     */
    static isPointInPolygon(point, polygonVertices) {
        if (!polygonVertices || polygonVertices.length < 3) return false;
        
        const x = point.x, y = point.y;
        let inside = false;
        
        for (let i = 0, j = polygonVertices.length - 1; i < polygonVertices.length; j = i++) {
            const xi = polygonVertices[i].x, yi = polygonVertices[i].y;
            const xj = polygonVertices[j].x, yj = polygonVertices[j].y;
            
            // Check if the point's Y coordinate is within the edge's Y range
            // AND calculate the X-intersection of the ray with the edge
            const intersect = ((yi > y) !== (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            
            if (intersect) inside = !inside;
        }
        
        return inside;
    }

    /**
     * Calculates the area of a polygon using the Shoelace formula (Surveyor's formula).
     * @param {Array} vertices - Array of {x, y} objects
     * @returns {number} Area (always positive)
     */
    static calculatePolygonArea(vertices) {
        if (!vertices || vertices.length < 3) return 0;
        
        let area = 0;
        for (let i = 0; i < vertices.length; i++) {
            const j = (i + 1) % vertices.length;
            area += vertices[i].x * vertices[j].y;
            area -= vertices[j].x * vertices[i].y;
        }
        
        return Math.abs(area) / 2.0;
    }

    /**
     * Generates vertices for a circular polygon approximation.
     * @param {number} centerX 
     * @param {number} centerY 
     * @param {number} radius 
     * @param {number} numPoints 
     * @returns {Array} Array of {x, y} vertices
     */
    static generateCircle(centerX, centerY, radius, numPoints = 36) {
        const vertices = [];
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * 2 * Math.PI;
            vertices.push({
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle)
            });
        }
        return vertices;
    }
}