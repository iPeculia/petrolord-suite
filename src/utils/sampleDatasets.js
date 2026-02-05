export const SAMPLE_DATASETS = {
    NIGER_DELTA: {
        name: "Niger Delta Deep Offshore",
        type: "las",
        description: "Overpressured shale sequence with rapid formation pressure ramp.",
        curves: ["DEPTH", "GR", "RES", "DT", "RHOB"],
        data: Array.from({length: 100}, (_, i) => ({
            DEPTH: 5000 + i * 50,
            GR: 40 + Math.random() * 80,
            RES: 1 + Math.random() * 5,
            DT: 120 - (i * 0.5) + (Math.random() * 10),
            RHOB: 2.1 + (i * 0.005)
        }))
    },
    DEEPWATER: {
        name: "Gulf of Mexico Deepwater",
        type: "csv",
        description: "Salt canopy section with subsalt overpressure reversal.",
        curves: ["TVD", "GAM", "ILD", "DTC", "DEN"],
        data: Array.from({length: 100}, (_, i) => ({
            TVD: 8000 + i * 50,
            GAM: 60 + Math.random() * 60,
            ILD: 0.5 + Math.random() * 2,
            DTC: 140 - (i * 0.4),
            DEN: 2.0 + (i * 0.004)
        }))
    },
    ONSHORE: {
        name: "Permian Basin Onshore",
        type: "json",
        description: "Normal pressure carbonate section.",
        curves: ["MD", "GR", "RT", "DT", "ROPA"],
        data: Array.from({length: 100}, (_, i) => ({
            MD: 2000 + i * 50,
            GR: 20 + Math.random() * 40,
            RT: 10 + Math.random() * 100,
            DT: 50 + Math.random() * 10,
            ROPA: 50 + Math.random() * 50
        }))
    }
};