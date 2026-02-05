import { v4 as uuidv4 } from 'uuid';

    export const applyBourdetSmoothing = (derivativeData, L) => {
        if (L === 0 || !derivativeData || derivativeData.length < 3) return derivativeData;
        const smoothed = [];
        const logX = derivativeData.map(p => Math.log(p.x));

        for (let i = 1; i < derivativeData.length - 1; i++) {
            const d_prev = Math.log(derivativeData[i].y) - Math.log(derivativeData[i-1].y);
            const d_next = Math.log(derivativeData[i+1].y) - Math.log(derivativeData[i].y);
            const w_prev = (logX[i+1] - logX[i]) / (logX[i+1] - logX[i-1]);
            const w_next = (logX[i] - logX[i-1]) / (logX[i+1] - logX[i-1]);
            
            const smoothed_d = w_prev * d_prev + w_next * d_next;
            
            const smoothed_log_y = (1-L)*Math.log(derivativeData[i].y) + L * smoothed_d;

            smoothed.push({ x: derivativeData[i].x, y: Math.exp(smoothed_log_y) });
        }
        return smoothed;
    };

    export const generateWellTestData = (inputs, realData = null) => {
        const runId = uuidv4();
        
        let time, pressure;

        if (realData && realData.length > 0) {
            time = realData.map(d => d.time);
            pressure = realData.map(d => d.pressure);
        } else {
            time = Array.from({ length: 100 }, (_, i) => 0.01 * Math.pow(10, i / 20));
            pressure = time.map(t => inputs.initialPressure - 100 * (1 - Math.exp(-t / 5)) - 50 * Math.log(t + 1));
        }

        const deltaP = pressure.map(p => Math.abs(p - inputs.initialPressure));
        
        const derivative = [];
        for (let i = 1; i < deltaP.length - 1; i++) {
            const dlogt = Math.log(time[i+1]) - Math.log(time[i-1]);
            if (dlogt === 0) continue;
            const ddp = deltaP[i+1] - deltaP[i-1];
            derivative.push({ x: time[i], y: (ddp / dlogt) * time[i] });
        }

        const modelFit = time.map(t => {
            const wbs = 100 * Math.exp(-t/0.1); 
            const irf = 10 * Math.log(t); 
            const boundary = (t > 50) ? Math.pow((t-50)/10, 2) : 0;
            return wbs + irf + boundary;
        });

        const regimeData = [
            { label: 'Wellbore Storage', range: [0.01, 0.5], color: 'rgba(59, 130, 246, 0.7)' },
            { label: 'Radial Flow', range: [1, 10], color: 'rgba(34, 197, 94, 0.7)' },
            { label: 'Boundary Effects', range: [50, 100], color: 'rgba(239, 68, 68, 0.7)' },
        ];


        return {
            runId: runId,
            kpis: {
                permeability: 123.4, skin: 5.6, pi: 3510,
                wellboreStorage: 0.0012, flowEfficiency: 0.88, rmse: 2.15,
                boundaryDistance: 2500,
                confidence: { kh: [110.2, 135.1], skin: [4.9, 6.2], Pi: [3505, 3515] }
            },
            plotsData: {
                pressure: time.map((t, i) => ({ x: t, y: pressure[i] })),
                deltaP: time.map((t, i) => ({ x: t, y: deltaP[i] })),
                derivative: derivative,
                modelFit: time.map((t, i) => ({ x: t, y: modelFit[i] })),
                horner: time.map((t, i) => ({ x: (24 + t)/t, y: pressure[i] })),
                mdh: time.map((t, i) => ({ x: t, y: pressure[i] })),
                regimes: regimeData,
            },
            warnings: ['High skin factor detected, consider well stimulation.'],
            model: 'homogeneous_wbs_skin',
            mappedData: time.map((t, i) => ({time: t, pressure: pressure[i], rate: 1000}))
        };
    };