// Mock service for EarthModel Pro Phase 3 Integrations
// Simulates communication with external apps (Log Facies, PPFG, NPV, FDP)

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const earthModelIntegrationService = {
  // --- Generic Connection ---
  checkConnection: async (appName) => {
    await delay(800);
    // Simulate successful connection 90% of the time
    return Math.random() > 0.1 
      ? { status: 'connected', latency: Math.floor(Math.random() * 100) + 20 + 'ms' }
      : { status: 'error', message: 'Connection timeout' };
  },

  // --- Log Facies Integration ---
  syncLogFacies: async (direction = 'pull') => {
    await delay(2000);
    return {
      status: 'success',
      items: [
        { id: 1, well: 'Well-A1', logs: ['Gamma', 'Resistivity'], facies_model: 'Deltaic_V2', synced_at: new Date().toISOString() },
        { id: 2, well: 'Well-B2', logs: ['Gamma', 'Density', 'Neutron'], facies_model: 'Deltaic_V2', synced_at: new Date().toISOString() }
      ],
      conflicts: []
    };
  },

  // --- PPFG Integration ---
  syncPPFG: async () => {
    await delay(1500);
    return {
      status: 'success',
      data: {
        pore_pressure_gradient: 0.45, // psi/ft
        fracture_gradient: 0.72,
        overburden_gradient: 1.0,
        wells_updated: 5
      }
    };
  },

  // --- NPV Integration ---
  exportVolumesToNPV: async (scenarioId, volumes) => {
    await delay(1800);
    console.log(`Exporting volumes for scenario ${scenarioId}:`, volumes);
    return {
      status: 'success',
      scenario_link: `npv-scenario-${scenarioId}`,
      economic_impact: {
        npv_change: '+5.2%',
        irr: '18.5%'
      }
    };
  },

  // --- FDP Integration ---
  syncDevelopmentPlan: async () => {
    await delay(2500);
    return {
      status: 'success',
      plan: {
        wells: [
          { name: 'P-01', type: 'Producer', status: 'Planned', location: { x: 4500, y: 5200 } },
          { name: 'I-01', type: 'Injector', status: 'Planned', location: { x: 4800, y: 5500 } }
        ],
        facilities: [
          { name: 'FPSO-Alpha', type: 'Processing', capacity: '100k bpd' }
        ]
      }
    };
  }
};