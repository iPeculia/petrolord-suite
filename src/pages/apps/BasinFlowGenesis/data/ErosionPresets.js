export const ErosionPresets = [
    {
        id: 'none',
        name: 'No Erosion',
        description: 'Continuous deposition or hiatus without significant removal of section.',
        amount: 0,
        events: []
    },
    {
        id: 'moderate',
        name: 'Moderate Erosion',
        description: 'Uplift event removing ~500m of overburden.',
        amount: 500,
        events: [
            { age: 5, amount: 500 } // 5 Ma ago
        ]
    },
    {
        id: 'high',
        name: 'High Erosion',
        description: 'Major unconformity removing >1000m of section.',
        amount: 1500,
        events: [
            { age: 10, amount: 1500 } // 10 Ma ago
        ]
    },
    {
        id: 'custom',
        name: 'Custom Event',
        description: 'User-defined erosion timing and magnitude.',
        amount: 0, // Placeholder
        events: []
    }
];