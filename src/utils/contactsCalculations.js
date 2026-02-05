export const contactsCalculations = ({ params, mbalResults }) => {
        const { 
            initialOwc, 
            initialGoc, 
            area, 
            netPay, 
            swi, 
            cf, 
            cw, 
            bob 
        } = params;
        const { plotData, ooip, m, driveIndices } = mbalResults;

        if (!plotData || plotData.length === 0) {
            throw new Error("MBAL results are required to track contacts.");
        }

        if (swi === undefined || cf === undefined || cw === undefined || bob === undefined) {
            throw new Error("Rock & Fluid properties (Swi, cf, cw, bob) are missing. Please provide them in the Contacts Tracker panel.");
        }

        const areaSqFt = area * 43560;
        const porosity = (ooip * bob) / (areaSqFt * netPay * (1 - swi));

        if (isNaN(porosity) || porosity <= 0 || porosity >= 1) {
            throw new Error("Could not calculate a valid porosity from OOIP and geometric inputs. Please check your inputs.");
        }

        const contactData = [{ days: 0, owc: initialOwc, goc: initialGoc }];
        let currentOwc = initialOwc;
        let currentGoc = initialGoc;

        for (let i = 0; i < plotData.length; i++) {
            const step = plotData[i];
            const days = (i + 1) * 30;

            const We = step.We || 0;
            const Bw = 1.02;
            const dV_water = We * Bw;
            const dH_owc = dV_water / (areaSqFt * porosity * (1 - swi));
            currentOwc = initialOwc - dH_owc;
            
            const GDI = driveIndices.GDI;
            const F_total = step.F + (step.We || 0);
            const gasExpansionVolume = GDI * F_total;
            const dH_goc = gasExpansionVolume / (areaSqFt * porosity * (1-swi));
            currentGoc = initialGoc + dH_goc;

            contactData.push({
                days,
                owc: currentOwc,
                goc: currentGoc,
            });
        }

        const lastDataPoint = contactData[contactData.length - 1];

        return {
            contactData,
            currentOwc: lastDataPoint.owc,
            currentGoc: lastDataPoint.goc,
        };
    };