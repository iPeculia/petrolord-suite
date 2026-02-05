export class PPFGDataAdapter {
    static adapt(sharedData) {
        if (!sharedData || !sharedData.payload) return null;
        
        const { payload } = sharedData;
        // Example payload structure expected from PPFG app
        // { pore_pressure_gradient: 0.45, fracture_gradient: 0.7, contacts: { owc: 5000 } }
        
        return {
            id: sharedData.id,
            name: sharedData.data_name,
            source: 'PPFG Analyzer',
            porePressureGradient: payload.pore_pressure_gradient,
            fractureGradient: payload.fracture_gradient,
            owc: payload.contacts?.owc,
            goc: payload.contacts?.goc,
            temperatureGradient: payload.temperature_gradient
        };
    }
}