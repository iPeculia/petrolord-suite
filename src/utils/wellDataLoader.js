import { sampleWell, sampleCurves } from '@/data/samplePorePressureData';

// Simulation of fetching multiple wells based on existing single well data
// In a real app, this would fetch from Supabase or an API
export const loadMultiWellData = async () => {
    // Mock data generation for demonstration
    const wells = [];
    
    const locations = [
        { x: 0, y: 0, name: "Well A-01 (Reference)" },
        { x: 2000, y: 500, name: "Well A-02" },
        { x: -1500, y: 2000, name: "Well B-01" },
        { x: 3000, y: -1000, name: "Well C-03" },
        { x: 500, y: 4000, name: "Well D-05" }
    ];

    // Helper to interpolate sample data for variety
    const generateMockCurve = (baseCurve, modifier, noise = 0) => {
        return baseCurve.map(val => val * modifier + (Math.random() * noise - noise/2));
    };

    locations.forEach((loc, idx) => {
        const depthModifier = 1 + (Math.random() * 0.1 - 0.05); // Slight depth variation
        const pressureModifier = 1 + (Math.random() * 0.1 - 0.05); // Pressure variation

        // Use the sample depth curve as a base, but stretch/compress it
        const depths = sampleCurves[0].data.map(d => d * depthModifier);
        
        // Mock PP/FG results
        // Basic physics approx: PP increases with depth, FG higher than PP
        const pp = depths.map(d => (d * 0.465 * pressureModifier) + (d > 8000 ? (d-8000)*0.2 : 0)); 
        const fg = depths.map((d, i) => pp[i] + (d * 0.2)); 

        wells.push({
            id: `w-${idx}`,
            name: loc.name,
            location: { lat: 28.5 + loc.y/300000, lon: -90.5 + loc.x/300000, x: loc.x, y: loc.y }, // Approx lat/lon conversion
            depths,
            results: {
                pp,
                fg,
                obg: depths.map(d => d * 1.0) // Mock OBG
            },
            status: Math.random() > 0.8 ? 'warning' : 'analyzed',
            operator: 'Petrolord E&P'
        });
    });

    return new Promise(resolve => setTimeout(() => resolve(wells), 800));
};