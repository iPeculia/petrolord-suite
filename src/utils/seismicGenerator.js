export const generateSyntheticSeismic = (width = 500, height = 500) => {
    const data = Array(height).fill(0).map(() => new Array(width).fill(0));

    const addLayer = (y_center, thickness, amp, dip = 0) => {
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const current_y_center = y_center + (j - width / 2) * dip;
                const dist = Math.abs(i - current_y_center) / (thickness / 2);
                if (dist <= 2) { // Only compute wavelet where it matters
                    const wavelet = Math.exp(-dist * dist) * Math.cos(dist * Math.PI * 2);
                    
                    let fault_offset = 0;
                    if (j > width / 2) fault_offset = 20;
                    if (Math.abs(i - (current_y_center + fault_offset)) < thickness * 2) {
                        data[i][j] += wavelet * amp;
                    }
                }
            }
        }
    };
    
    const addNoise = (noise_level) => {
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                data[i][j] += (Math.random() - 0.5) * noise_level;
            }
        }
    };

    addLayer(50, 20, 20, 0.1);
    addLayer(150, 30, -15, 0);
    addLayer(250, 25, 25, -0.05);
    addLayer(350, 40, 10, 0);
    addLayer(450, 15, -18, 0.08);
    addNoise(3);

    const flatData = data.flat();
    const sorted = [...flatData].sort((a, b) => a - b);
    const p1 = sorted[Math.floor(sorted.length * 0.01)];
    const p99 = sorted[Math.floor(sorted.length * 0.99)];

    const samples = Array.from({ length: height }, (_, i) => i * 4);
    const headers = Array.from({ length: width }, (_, i) => ({ inline: 1000 + i, xline: 2000 }));
    
    return {
        traces: data,
        samples,
        headers,
        percentiles: { p1, p99 }
    };
};