export const CASING_GRADES = [
    { name: 'H-40', yield: 40000, tensile: 60000, color: '#a0a0a0' },
    { name: 'J-55', yield: 55000, tensile: 75000, color: '#50c878' },
    { name: 'K-55', yield: 55000, tensile: 95000, color: '#50c878' },
    { name: 'N-80', yield: 80000, tensile: 100000, color: '#ff4500' },
    { name: 'L-80', yield: 80000, tensile: 95000, color: '#8b4513' },
    { name: 'C-90', yield: 90000, tensile: 105000, color: '#800080' },
    { name: 'C-95', yield: 95000, tensile: 105000, color: '#9370db' },
    { name: 'T-95', yield: 95000, tensile: 105000, color: '#4b0082' },
    { name: 'P-110', yield: 110000, tensile: 125000, color: '#ffffff' },
    { name: 'Q-125', yield: 125000, tensile: 135000, color: '#ffa500' }
];

export const CASING_SIZES = [
    { od: 4.5, weight: [11.6, 13.5, 15.1], id_ref: 4.0, type: 'Tubing/Casing' },
    { od: 5.0, weight: [15.0, 18.0, 21.4], id_ref: 4.4, type: 'Casing' },
    { od: 5.5, weight: [17.0, 20.0, 23.0], id_ref: 4.8, type: 'Casing' },
    { od: 7.0, weight: [23.0, 26.0, 29.0, 32.0], id_ref: 6.3, type: 'Casing' },
    { od: 9.625, weight: [36.0, 40.0, 43.5, 47.0], id_ref: 8.8, type: 'Casing' },
    { od: 11.75, weight: [42.0, 47.0, 54.0, 60.0], id_ref: 10.8, type: 'Casing' },
    { od: 13.375, weight: [54.5, 61.0, 68.0, 72.0], id_ref: 12.5, type: 'Casing' },
    { od: 16.0, weight: [65.0, 75.0, 84.0], id_ref: 15.0, type: 'Casing' },
    { od: 20.0, weight: [94.0, 106.5, 133.0], id_ref: 19.0, type: 'Casing' }
];

export const TUBING_SIZES = [
    { od: 2.375, weight: [4.6, 5.8], id_ref: 1.995, type: 'Tubing' },
    { od: 2.875, weight: [6.4, 8.6], id_ref: 2.441, type: 'Tubing' },
    { od: 3.5, weight: [9.3, 12.7], id_ref: 2.992, type: 'Tubing' },
    { od: 4.5, weight: [11.6, 13.5], id_ref: 3.9, type: 'Tubing' },
    { od: 5.5, weight: [17.0, 20.0], id_ref: 4.8, type: 'Tubing' }
];

export const CONNECTIONS = [
    { name: 'ST&C', type: 'API', efficiency: 1.0 },
    { name: 'LT&C', type: 'API', efficiency: 1.0 },
    { name: 'BTC', type: 'API', efficiency: 1.0 },
    { name: 'VAM Top', type: 'Premium', efficiency: 1.0 },
    { name: 'Tenaris Blue', type: 'Premium', efficiency: 1.0 },
    { name: 'JFE Bear', type: 'Premium', efficiency: 1.0 }
];

// Helper to generate a mock catalog item with basic API formulas
export const generateCatalogItem = (od, weight, gradeName, connName, type) => {
    let grade = CASING_GRADES.find(g => g.name === gradeName);
    
    // Safety check if grade is not found (e.g. for mock grades like 13Cr-80)
    if (!grade) {
        // Fallback to L-80 properties to avoid crash
        grade = CASING_GRADES.find(g => g.name === 'L-80') || CASING_GRADES[0];
    }
    
    // Simplistic formula for properties (Mock physics for UI population)
    const wallThickness = (weight / 10.68) / od; // Very rough approx for density of steel
    const id = od - 2 * wallThickness;
    
    // Ensure grade.yield exists, defaulting to 80000 if something went wrong
    const yieldStrength = grade.yield || 80000;

    // API Collapse approx (simplified)
    const d_t = od/wallThickness;
    const collapse = yieldStrength * (2.99 / d_t - 0.054); 
    
    // API Burst (Barlow's)
    const burst = 0.875 * (2 * yieldStrength * wallThickness) / od;
    
    // Tension (Body Yield)
    const bodyYield = yieldStrength * (Math.PI/4) * (od*od - id*id);

    return {
        id: `${type}-${od}-${weight}-${gradeName}-${connName}`.replace(/\s+/g, ''),
        type,
        od,
        weight,
        grade: gradeName, // Keep original requested name
        connection: connName,
        id_drift: (id - 0.125).toFixed(3),
        id_nom: id.toFixed(3),
        yield_str: yieldStrength,
        burst_rating: Math.round(burst),
        collapse_rating: Math.round(collapse),
        joint_yield: Math.round(bodyYield * 0.9), // Approx 90% joint efficiency
        wall_thickness: wallThickness.toFixed(3)
    };
};

export const MOCK_CATALOG = [];

// Generate Casing Catalog
CASING_SIZES.forEach(size => {
    size.weight.forEach(w => {
        ['K-55', 'L-80', 'N-80', 'P-110', 'Q-125'].forEach(g => {
            ['BTC', 'VAM Top'].forEach(c => {
                MOCK_CATALOG.push(generateCatalogItem(size.od, w, g, c, 'Casing'));
            });
        });
    });
});

// Generate Tubing Catalog
TUBING_SIZES.forEach(size => {
    size.weight.forEach(w => {
        ['L-80', 'P-110', '13Cr-80'].forEach(g => {
             // Mock 13Cr grade if not exists
             let gradeToUse = g;
             if(g === '13Cr-80') gradeToUse = 'L-80'; // Fallback for calculations, keeping ID distinct
             
            ['VAM Top', 'Tenaris Blue'].forEach(c => {
                // Pass the fallback grade name for calculation purposes if needed, 
                // but our safety check in generateCatalogItem now handles missing grades gracefully
                // by falling back to L-80 properties while keeping the custom name.
                // However, passing the custom name "13Cr-80" to generateCatalogItem will trigger the safety fallback inside.
                
                MOCK_CATALOG.push(generateCatalogItem(size.od, w, g, c, 'Tubing'));
            });
        });
    });
});