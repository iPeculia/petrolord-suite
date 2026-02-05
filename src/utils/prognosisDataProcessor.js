import { calculateTemperatureProfile } from './temperatureCalculator';

export const processPrognosisData = (phase1Data, phase4Data, phase5Data, manualInputs) => {
    if (!phase1Data || !phase1Data.depths) return null;

    const depths = phase1Data.depths;
    
    // Mock formations if not present
    const formations = manualInputs?.formations || [
        { name: "Nordland", top: 0, bottom: 1200, lithology: "Sand/Shale", type: 'group' },
        { name: "Hordaland", top: 1200, bottom: 2800, lithology: "Shale", type: 'group' },
        { name: "Rogaland", top: 2800, bottom: 3100, lithology: "Shale", type: 'group' },
        { name: "Balder", top: 2800, bottom: 2850, lithology: "Tuff", type: 'formation' },
        { name: "Sele", top: 2850, bottom: 2950, lithology: "Shale", type: 'formation' },
        { name: "Lista", top: 2950, bottom: 3100, lithology: "Sand", type: 'formation' },
        { name: "Shetland", top: 3100, bottom: 4200, lithology: "Chalk", type: 'group' },
        { name: "Cromer Knoll", top: 4200, bottom: 4500, lithology: "Marl", type: 'group' },
        { name: "Viking", top: 4500, bottom: 5000, lithology: "Sandstone", type: 'group' },
        { name: "Brent", top: 5000, bottom: 5500, lithology: "Sandstone", type: 'group' }
    ];

    // Casing points
    const casing = manualInputs?.casing || [
        { depth: 500, size: 30 },
        { depth: 1500, size: 20 },
        { depth: 3500, size: 13.375 },
        { depth: 4800, size: 9.625 }
    ];

    // Temperature
    const tempData = calculateTemperatureProfile(depths, {
        seabedTemp: 45,
        gradient: 1.6
    });

    // Merge curves
    const mergedData = depths.map((d, i) => ({
        depth: d,
        gr: phase1Data.GR?.[i] || null,
        res: phase1Data.res?.[i] || null,
        dt: phase1Data.dt?.[i] || null,
        rhob: phase1Data.rhob?.[i] || null,
        cali: phase1Data.cali?.[i] || null,
        pp: phase4Data?.pp_ppg?.[i] || null,
        pp_low: phase4Data?.pp_p10?.[i] || (phase4Data?.pp_ppg?.[i] * 0.95) || null,
        pp_high: phase4Data?.pp_p90?.[i] || (phase4Data?.pp_ppg?.[i] * 1.05) || null,
        fg: phase5Data?.fg_ppg?.[i] || null,
        obg: phase5Data?.obg_ppg?.[i] || null,
        temp: tempData[i]
    }));

    return {
        data: mergedData,
        formations,
        casing,
        hardData: {
            lot: manualInputs?.lot || [{ depth: 3550, value: 13.8 }],
            fit: manualInputs?.fit || [{ depth: 1550, value: 11.2 }],
            rft: manualInputs?.rft || [{ depth: 4600, value: 12.5 }, { depth: 4750, value: 12.8 }],
            tempPoints: [{ depth: 4600, value: 210 }]
        }
    };
};