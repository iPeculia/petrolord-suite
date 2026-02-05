// Parameter Presets for PP-FG Analysis

export const BASIN_PRESETS = {
    NIGER_DELTA: {
        name: "Niger Delta (Deep Offshore)",
        description: "Overpressured shales, driven by undercompaction and unloading.",
        params: {
            eatonExponent: 3.0,
            bowerA: 8.0,
            bowerB: 0.7,
            poissonRatio: 0.44,
            nctIntercept: 190,
            nctSlope: 0.00006,
            fluidDensity: 0.44 // psi/ft (approx 8.5 ppg)
        },
        ranges: {
            eatonExponent: { min: 2.5, max: 4.5 },
            poissonRatio: { min: 0.40, max: 0.48 }
        }
    },
    GULF_OF_MEXICO: {
        name: "Gulf of Mexico (Deepwater)",
        description: "Rapid sedimentation, salt interactions. High pressure windows.",
        params: {
            eatonExponent: 3.5,
            bowerA: 10.0,
            bowerB: 0.75,
            poissonRatio: 0.46,
            nctIntercept: 180,
            nctSlope: 0.00005,
            fluidDensity: 0.45
        },
        ranges: {
            eatonExponent: { min: 3.0, max: 5.0 },
            poissonRatio: { min: 0.42, max: 0.50 }
        }
    },
    NORTH_SEA: {
        name: "North Sea (HPHT)",
        description: "Older sediments, chemical compaction, unloading mechanisms.",
        params: {
            eatonExponent: 2.8,
            bowerA: 6.0,
            bowerB: 0.8,
            poissonRatio: 0.38,
            nctIntercept: 160,
            nctSlope: 0.00004,
            fluidDensity: 0.46
        },
        ranges: {
            eatonExponent: { min: 2.0, max: 3.5 },
            poissonRatio: { min: 0.35, max: 0.42 }
        }
    },
    ONSHORE_GENERIC: {
        name: "Onshore (Normal Pressure)",
        description: "Compacted sediments, hydrostatic to mild overpressure.",
        params: {
            eatonExponent: 1.5,
            bowerA: 4.0,
            bowerB: 0.9,
            poissonRatio: 0.35,
            nctIntercept: 140,
            nctSlope: 0.00003,
            fluidDensity: 0.433
        },
        ranges: {
            eatonExponent: { min: 1.0, max: 2.5 },
            poissonRatio: { min: 0.30, max: 0.40 }
        }
    }
};

export const VARIANT_MODIFIERS = {
    LOW: { eatonExponent: 0.8, poissonRatio: 0.9, label: 'Optimistic' }, // Multipliers
    BASE: { eatonExponent: 1.0, poissonRatio: 1.0, label: 'Most Likely' },
    HIGH: { eatonExponent: 1.2, poissonRatio: 1.1, label: 'Conservative' }
};