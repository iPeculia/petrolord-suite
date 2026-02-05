const conversionFactors = {
    depth: { 'm': 1, 'ft': 3.28084 },
    pressure: { 'psi': 1, 'kPa': 6.89476, 'bar': 0.0689476 },
    density: { 'g/cc': 1, 'kg/m3': 1000 },
};

export const unitConversionService = {
    convert: (value, category, fromUnit, toUnit) => {
        if (fromUnit === toUnit) return value;
        const categoryFactors = conversionFactors[category];
        if (!categoryFactors) throw new Error(`Unknown conversion category: ${category}`);

        const fromFactor = categoryFactors[fromUnit];
        const toFactor = categoryFactors[toUnit];

        if (fromFactor === undefined || toFactor === undefined) {
            throw new Error(`Unsupported unit in category ${category}: ${fromUnit} or ${toUnit}`);
        }
        
        // Convert to base unit (first in list), then to target unit
        const baseValue = value / fromFactor;
        return baseValue * toFactor;
    }
};