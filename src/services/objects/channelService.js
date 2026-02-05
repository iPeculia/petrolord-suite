/**
 * Service for Channel Modeling operations.
 */

export const channelService = {
  /**
   * Generates geometry for a sinuous channel based on parameters.
   * Returns a set of points defining the centerline and boundaries.
   */
  generateChannelGeometry: (params) => {
    const { length, sinuosity, width, azimuth } = params;
    const points = [];
    const steps = 100;
    
    // Simple sine wave generation rotated by azimuth
    const radAzimuth = (azimuth * Math.PI) / 180;
    
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const xRaw = t * length;
        // Amplitude depends on sinuosity (simplified)
        const amplitude = (sinuosity - 1) * width * 2;
        const yRaw = amplitude * Math.sin(t * Math.PI * 4); // 2 periods
        
        // Rotate
        const x = xRaw * Math.cos(radAzimuth) - yRaw * Math.sin(radAzimuth);
        const y = xRaw * Math.sin(radAzimuth) + yRaw * Math.cos(radAzimuth);
        
        points.push({ x, y, z: 0 });
    }
    
    return { centerline: points, width };
  },

  /**
   * Calculates volume of the channel body
   */
  calculateVolume: (params) => {
    // Simplified: Length * Width * Thickness * Sinuosity correction
    return params.length * params.width * params.depth * params.sinuosity;
  }
};