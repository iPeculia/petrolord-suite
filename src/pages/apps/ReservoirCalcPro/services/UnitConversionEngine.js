import React from "react";

export class UnitConversionEngine {
    static factorsMap = {
        length: { ft: 1, m: 0.3048, km: 0.0003048 },
        area: { acre: 1, sq_ft: 43560, sq_m: 4046.86, km2: 0.00404686 },
        volume: { bbl: 1, m3: 0.158987, ft3: 5.61458, 'acre-ft': 1 / 7758 },
        pressure: { psi: 1, bar: 0.0689476, mpa: 0.00689476, kpa: 6.89476 }
    };

    static convert(value, fromUnit, toUnit, type) {
        if (value === null || value === undefined || isNaN(value)) return 0;
        if (fromUnit === toUnit) return value;

        if (type === 'temperature') {
            return this.convertTemperature(value, fromUnit, toUnit);
        }

        const factors = this.factorsMap[type];
        if (!factors) {
          console.warn(`UnitConversionEngine: Unknown conversion type "${type}"`);
          return value;
        }

        // Convert from the source unit to the base unit (ft, acre, bbl, psi)
        const baseValue = value / (factors[fromUnit] || 1);
        
        // Convert from the base unit to the target unit
        const finalValue = baseValue * (factors[toUnit] || 1);
        
        return finalValue;
    }

    static convertTemperature(val, from, to) {
        if (val === null || val === undefined || isNaN(val)) return 0;
        if (from === to) return val;
        
        let c = val;
        // Convert input to Celsius
        if (from === 'F' || from === '°F') {
            c = (val - 32) * 5/9;
        } else if (from === 'K') {
            c = val - 273.15;
        }
        
        // Convert from Celsius to the target unit
        if (to === 'F' || to === '°F') {
            return (c * 9/5) + 32;
        } else if (to === 'K') {
            return c + 273.15;
        }
        
        // If target is Celsius
        return c;
    }
}