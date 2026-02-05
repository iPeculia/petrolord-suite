export class VelocityModelDataAdapter {
    static adapt(sharedData) {
        if (!sharedData || !sharedData.payload) return null;
        const { payload } = sharedData;
        
        // Assuming payload contains a grid or function
        return {
            id: sharedData.id,
            name: sharedData.data_name,
            source: 'Velocity Model Builder',
            type: payload.type, // 'grid' or 'function'
            averageVelocity: payload.avg_velocity,
            depthGrid: payload.depth_grid // Array of points potentially
        };
    }
}