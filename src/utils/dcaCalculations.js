// Decline Curve Analysis Calculations (Arps)

    const calculateArpsDecline = (params) => {
        let { qi, di, b, econLimit, forecastYears } = params;
        const forecastDays = forecastYears * 365.25;
        const dailyDecline = di / 365.25;

        const rates = [];
        let cumulative = 0;
        let timeToLimit = -1;

        for (let t = 1; t <= forecastDays; t++) {
            let qt;
            if (b === 0) { // Exponential
                qt = qi * Math.exp(-dailyDecline * t);
            } else if (b > 0 && b < 1) { // Hyperbolic
                qt = qi / Math.pow(1 + b * dailyDecline * t, 1 / b);
            } else { // Harmonic (b=1)
                qt = qi / (1 + dailyDecline * t);
            }

            if (qt < econLimit) {
                if (timeToLimit === -1) {
                    timeToLimit = t;
                }
                break;
            }

            rates.push({ time: t, rate: qt });
            cumulative += qt;
        }

        return {
            rates,
            eur: cumulative,
            timeToLimit: timeToLimit / 365.25, // in years
        };
    };


    export const dcaCalculations = ({ params, productionData, mbalResults }) => {
        if (!productionData || productionData.length === 0) {
            throw new Error("Production data is required for forecasting.");
        }
        if (!mbalResults) {
            throw new Error("Material balance results (for historical cumulative) are required.");
        }

        const historicalCumulative = mbalResults.plotData.reduce((sum, d) => sum + (d.Np || 0), 0);

        // P50 (Base Case)
        const p50Params = { ...params };
        if (params.model === 'exponential') p50Params.b = 0;
        if (params.model === 'harmonic') p50Params.b = 1;
        const p50Results = calculateArpsDecline(p50Params);
        
        // P10 (High Case) - Higher initial rate, slower decline
        const p10Params = { ...p50Params, qi: params.qi * 1.2, di: params.di * 0.8 };
        const p10Results = calculateArpsDecline(p10Params);

        // P90 (Low Case) - Lower initial rate, faster decline
        const p90Params = { ...p50Params, qi: params.qi * 0.8, di: params.di * 1.2 };
        const p90Results = calculateArpsDecline(p90Params);
        
        // Combine for Chart
        const chartData = [];
        const lastHistDate = new Date(productionData[productionData.length-1].date);

        // Add history
        productionData.forEach(p => {
            chartData.push({
                date: p.date,
                history: parseFloat(p.oil)
            });
        });

        // Add forecast
        p50Results.rates.forEach((d, i) => {
            const forecastDate = new Date(lastHistDate);
            forecastDate.setDate(lastHistDate.getDate() + d.time);

            const p10Rate = p10Results.rates[i] ? p10Results.rates[i].rate : null;
            const p90Rate = p90Results.rates[i] ? p90Results.rates[i].rate : null;

            chartData.push({
                date: forecastDate.toISOString().split('T')[0],
                p50: d.rate,
                p10: p10Rate,
                p90: p90Rate,
            });
        });


        return {
            p50: {
                eur: historicalCumulative + p50Results.eur,
                remaining: p50Results.eur,
                timeToLimit: p50Results.timeToLimit,
            },
            p10: {
                eur: historicalCumulative + p10Results.eur,
                remaining: p10Results.eur,
                timeToLimit: p10Results.timeToLimit,
            },
            p90: {
                eur: historicalCumulative + p90Results.eur,
                remaining: p90Results.eur,
                timeToLimit: p90Results.timeToLimit,
            },
            chartData,
        };
    };