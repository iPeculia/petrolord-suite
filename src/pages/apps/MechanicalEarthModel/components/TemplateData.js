import React from "react";
export const templates = [
    {
        id: 'onshore-clastic',
        name: 'Onshore Clastic',
        description: 'Ideal for conventional onshore wells in clastic (sandstone/shale) sequences at shallow to moderate depths.',
        params: {
            poissonsRatio: 0.28,
            frictionAngle: 32,
            tectonicStressRatio: 0.8,
        },
        useCases: ['Vertical exploration wells', 'Development drilling', 'Standard pressure regimes'],
    },
    {
        id: 'offshore-clastic',
        name: 'Offshore Clastic',
        description: 'Suited for offshore environments with moderate to deep clastic sections. Accounts for higher overburden and pore pressures.',
        params: {
            poissonsRatio: 0.30,
            frictionAngle: 28,
            tectonicStressRatio: 0.9,
        },
        useCases: ['Platform drilling', 'Extended reach drilling (ERD)', 'Mildly overpressured zones'],
    },
    {
        id: 'deepwater',
        name: 'Deepwater',
        description: 'For challenging deepwater exploration and development, featuring narrow mud weight windows and unconsolidated sediments.',
        params: {
            poissonsRatio: 0.35,
            frictionAngle: 25,
            tectonicStressRatio: 1.0,
        },
        useCases: ['Deepwater exploration', 'Sub-salt plays', 'Highly overpressured environments'],
    },
    {
        id: 'carbonate',
        name: 'Carbonate',
        description: 'Designed for carbonate (limestone/dolomite) formations, which often exhibit higher rock strength and natural fractures.',
        params: {
            poissonsRatio: 0.25,
            frictionAngle: 35,
            tectonicStressRatio: 0.7,
        },
        useCases: ['Carbonate reservoirs', 'Naturally fractured formations', 'Geothermal wells'],
    },
    {
        id: 'custom',
        name: 'Custom',
        description: 'Start with a blank slate. You will define all parameters manually in the upcoming steps.',
        params: {},
        useCases: ['Unique geological settings', 'Expert users', 'Detailed calibration projects'],
    },
];