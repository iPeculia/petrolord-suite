// Utility for handling external API integrations for the Petrophysics Estimator

// --- Mock API Responses (Simulating external services) ---

const MOCK_USGS_WELLS = [
    { api: "42-301-34567", name: "Permian Scout 1", lat: 31.8, lon: -102.3, depth: 8500, formation: "Wolfcamp" },
    { api: "42-301-34568", name: "Midland Explorer 4", lat: 31.9, lon: -102.1, depth: 9200, formation: "Spraberry" },
    { api: "42-301-34569", name: "Delaware Basin A-2", lat: 31.7, lon: -103.5, depth: 11000, formation: "Bone Spring" }
];

const MOCK_MARKET_DATA = {
    oil: { price: 78.45, change: 1.25, unit: "USD/bbl", updated: new Date().toISOString() },
    gas: { price: 2.85, change: -0.12, unit: "USD/mmbtu", updated: new Date().toISOString() }
};

const MOCK_FORMATION_DATA = [
    { name: "Eagle Ford", age: "Late Cretaceous", type: "Shale", environment: "Marine Shelf" },
    { name: "Bakken", age: "Late Devonian", type: "Shale/Dolomite", environment: "Anoxic Basin" },
    { name: "Wolfcamp", age: "Permian", type: "Shale/Carbonate", environment: "Basin Floor Fan" }
];

// --- API Service Class ---

export class ExternalDataService {
    constructor(toast) {
        this.toast = toast;
        this.apiKeys = {}; // In real app, load from secure storage/Supabase
    }

    setApiKey(service, key) {
        this.apiKeys[service] = key;
    }

    async fetchWellData(source = 'usgs', query = {}) {
        // Simulation of network delay
        await new Promise(r => setTimeout(r, 1200));

        if (source === 'usgs') {
            return MOCK_USGS_WELLS.filter(w => !query.search || w.name.toLowerCase().includes(query.search.toLowerCase()));
        }
        
        if (source === 'generic_rest') {
            if (!this.apiKeys['generic_rest']) throw new Error("API Key missing for Generic REST endpoint");
            // Real fetch would go here:
            // const res = await fetch(query.url, { headers: { Authorization: `Bearer ${this.apiKeys['generic_rest']}` }});
            // return await res.json();
            return MOCK_USGS_WELLS; // Fallback
        }

        throw new Error(`Unknown source: ${source}`);
    }

    async fetchMarketData() {
        await new Promise(r => setTimeout(r, 800));
        // Could integrate with alpha-vantage or similar free tiers if keys provided
        return MOCK_MARKET_DATA;
    }

    async fetchFormationInfo(formationName) {
        await new Promise(r => setTimeout(r, 600));
        const match = MOCK_FORMATION_DATA.find(f => f.name.toLowerCase() === formationName?.toLowerCase());
        if (!match) return { name: formationName, note: "No geological reference found." };
        return match;
    }

    async fetchProductionHistory(wellApi) {
        await new Promise(r => setTimeout(r, 1500));
        // Mock production data
        const history = [];
        let rate = 1000;
        for(let i=0; i<24; i++) {
            rate = rate * 0.95 * (1 + (Math.random() * 0.1 - 0.05));
            history.push({ month: i+1, oil: Math.round(rate), gas: Math.round(rate * 2.5) });
        }
        return history;
    }

    async importSeismicAttributes(fileOrId) {
        await new Promise(r => setTimeout(r, 2000));
        // Return mock attribute track correlated to depth
        return {
            name: "Acoustic Impedance",
            data: Array.from({length: 100}, (_, i) => ({ depth: 5000 + i*10, value: 25000 + Math.random() * 5000 }))
        };
    }
}