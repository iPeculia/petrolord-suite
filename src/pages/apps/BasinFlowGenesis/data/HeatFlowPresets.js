export const HeatFlowPresets = [
    {
        id: 'continental_stable',
        name: 'Stable Continental',
        description: 'Standard cratonic heat flow, relatively constant over time. Suitable for mature basins.',
        value: 60,
        range: '50-70 mW/m²',
        type: 'constant',
        history: [
            { age: 200, value: 60 },
            { age: 0, value: 60 }
        ]
    },
    {
        id: 'oceanic',
        name: 'Oceanic / Active',
        description: 'High heat flow typical of young oceanic crust or active margins.',
        value: 100,
        range: '80-120 mW/m²',
        type: 'variable',
        history: [
            { age: 200, value: 120 },
            { age: 100, value: 100 },
            { age: 0, value: 80 }
        ]
    },
    {
        id: 'rifting',
        name: 'Active Rifting',
        description: 'Heat flow spike associated with crustal thinning and rifting events.',
        value: 120,
        range: '100-150 mW/m²',
        type: 'variable',
        history: [
            { age: 200, value: 60 },
            { age: 100, value: 60 },
            { age: 50, value: 130 }, // Rift peak
            { age: 0, value: 80 }
        ]
    },
    {
        id: 'post_rift',
        name: 'Post-Rift Cooling',
        description: 'Decaying heat flow following a rifting event (McKenzie model style).',
        value: 70,
        range: '60-80 mW/m²',
        type: 'variable',
        history: [
            { age: 100, value: 100 },
            { age: 50, value: 80 },
            { age: 0, value: 60 }
        ]
    }
];