export const generateDemoData = (type, startYear = new Date().getFullYear()) => {
  const years = [];
  const prod = [];
  const capex = [];
  const opex = [];
  
  const endYear = type === 'well' ? startYear + 9 : type === 'gas' ? startYear + 14 : startYear + 19;

  // --- 1. Simple Well (Oil, 10y) ---
  if (type === 'well') {
    for (let i = 0; i <= 9; i++) {
      const year = startYear + i;
      years.push(year);
      
      // Decline Curve: qi=1000, Di=20%
      const rate = 1000 * Math.exp(-0.2 * i); 
      
      prod.push({
        year,
        oil_rate: Math.round(rate * 365), // Annualized bbl
        gas_rate: Math.round(rate * 0.5 * 365), // GOR 500 scf/bbl
        condensate_rate: 0,
        notes: i === 0 ? 'Initial Production' : ''
      });

      capex.push({
        year,
        drilling_capex: i === 0 ? 3500000 : 0, // $3.5M initial
        facilities_capex: i === 0 ? 1500000 : 0, // $1.5M initial
        abandonment_capex: i === 9 ? 500000 : 0, // $0.5M abex
        other_capex: 0,
        notes: i === 0 ? 'Drilling & Completion' : (i === 9 ? 'P&A' : '')
      });

      opex.push({
        year,
        fixed_opex: 120000, // $10k/mo
        variable_oil: 5.5, // $/bbl
        variable_gas: 0.5, // $/mcf
        variable_water: 1.0,
        notes: ''
      });
    }

    return {
      modelSettings: {
        startYear,
        endYear,
        frequency: 'annual',
        currency: 'USD',
        discountRate: 0.10,
        inflationRate: 0.02,
        inflationEnabled: true,
        priceDeckType: 'flat'
      },
      streams: [
        { id: 'oil', name: 'Oil', active: true },
        { id: 'gas', name: 'Gas', active: true },
        { id: 'condensate', name: 'Condensate', active: false },
      ],
      productionData: prod,
      costData: { capexProfile: capex, opexProfile: opex },
      assumptions: {
        workingInterest: 100,
        netRevenueInterest: 87.5,
        taxRate: 35,
        royaltyRate: 12.5,
        uptime: 95
      },
      priceAssumptions: {
        oilPrice: 75,
        gasPrice: 3.5,
        escalation: 0.0
      },
      fiscalTerms: {
        template_type: 'royalty_tax',
        royalty_rate: 12.5,
        tax_rate: 35,
        depreciation_method: 'straight_line',
        ring_fence: true
      }
    };
  }

  // --- 2. Gas Field (Gas, 15y) ---
  if (type === 'gas') {
    for (let i = 0; i <= 14; i++) {
      const year = startYear + i;
      years.push(year);
      
      // Ramp 2 yrs, Plateau 5 yrs, Decline
      let rate = 0;
      const plateauRate = 50000; // 50 MMscf/d -> 50,000 Mcf/d
      if (i === 0) rate = plateauRate * 0.3;
      else if (i === 1) rate = plateauRate * 0.7;
      else if (i >= 2 && i <= 6) rate = plateauRate;
      else rate = plateauRate * Math.exp(-0.15 * (i - 6));

      prod.push({
        year,
        oil_rate: 0,
        gas_rate: Math.round(rate * 365), // Annualized Mcf
        condensate_rate: Math.round(rate * 10 * 365 / 1000), // 10 bbl/mmscf -> 0.01 bbl/mcf
        notes: i === 2 ? 'Plateau Start' : (i === 7 ? 'Decline Start' : '')
      });

      capex.push({
        year,
        drilling_capex: i <= 2 ? 15000000 : 0, // Dev drilling first 3 years
        facilities_capex: i === 0 ? 50000000 : (i === 1 ? 30000000 : 0), // CPF construction
        abandonment_capex: i === 14 ? 10000000 : 0,
        other_capex: i === 0 ? 5000000 : 0, // FEED/Exploration
        notes: i === 0 ? 'FEED & EPC' : ''
      });

      opex.push({
        year,
        fixed_opex: 5000000, // $5M/yr fixed
        variable_oil: 0,
        variable_gas: 0.25, // $/mcf
        variable_water: 0.5,
        notes: ''
      });
    }

    return {
      modelSettings: {
        startYear,
        endYear,
        frequency: 'annual',
        currency: 'USD',
        discountRate: 0.10,
        inflationRate: 0.02,
        inflationEnabled: true,
        priceDeckType: 'escalated'
      },
      streams: [
        { id: 'oil', name: 'Oil', active: false },
        { id: 'gas', name: 'Gas', active: true },
        { id: 'condensate', name: 'Condensate', active: true },
      ],
      productionData: prod,
      costData: { capexProfile: capex, opexProfile: opex },
      assumptions: {
        workingInterest: 60, // Partner
        netRevenueInterest: 60,
        taxRate: 30,
        royaltyRate: 5,
        uptime: 92
      },
      priceAssumptions: {
        oilPrice: 60, // For condensate link
        gasPrice: 4.5,
        escalation: 0.02
      },
      fiscalTerms: {
        template_type: 'royalty_tax',
        royalty_rate: 5,
        tax_rate: 30,
        depreciation_method: 'declining_balance',
        ring_fence: true
      }
    };
  }

  // --- 3. Full FDP (Oil+Gas, 20y, Phased) ---
  if (type === 'fdp') {
    for (let i = 0; i <= 19; i++) {
      const year = startYear + i;
      years.push(year);
      
      // Phase 1 (Oil) + Phase 2 (Gas blowdown later)
      let oilRate = 0;
      let gasRate = 0;

      // Oil Profile
      if (i < 2) oilRate = 15000 * (i + 1) * 0.5; // Ramp
      else if (i < 8) oilRate = 15000; // Plateau
      else oilRate = 15000 * Math.exp(-0.12 * (i - 8)); // Decline

      // Gas Profile (starts later, gas cap blowdown or associated)
      if (i < 5) gasRate = oilRate * 0.8; // Associated gas re-injected mostly? Let's say sales.
      else gasRate = oilRate * 2.5; // GOR increases

      prod.push({
        year,
        oil_rate: Math.round(oilRate * 365),
        gas_rate: Math.round(gasRate * 365),
        condensate_rate: 0,
        notes: i === 0 ? 'Phase 1 Startup' : (i === 5 ? 'Phase 2 Gas' : '')
      });

      capex.push({
        year,
        drilling_capex: (i < 3 ? 40000000 : 0) + (i === 5 ? 20000000 : 0), // Initial + Phase 2 drilling
        facilities_capex: i === 0 ? 150000000 : (i === 1 ? 50000000 : (i === 5 ? 30000000 : 0)), // FPSO/Platform + Compression
        abandonment_capex: i === 19 ? 40000000 : 0,
        other_capex: 0,
        notes: ''
      });

      opex.push({
        year,
        fixed_opex: 15000000, // $15M/yr
        variable_oil: 4.0, 
        variable_gas: 0.3, 
        variable_water: 1.5,
        notes: ''
      });
    }

    return {
      modelSettings: {
        startYear,
        endYear,
        frequency: 'annual',
        currency: 'USD',
        discountRate: 0.10,
        inflationRate: 0.025,
        inflationEnabled: true,
        priceDeckType: 'custom'
      },
      streams: [
        { id: 'oil', name: 'Oil', active: true },
        { id: 'gas', name: 'Gas', active: true },
        { id: 'condensate', name: 'Condensate', active: false },
      ],
      productionData: prod,
      costData: { capexProfile: capex, opexProfile: opex },
      assumptions: {
        workingInterest: 100,
        netRevenueInterest: 100, // Before PSC split
        taxRate: 0, // Handled in PSC
        royaltyRate: 0, // PSC often no royalty or included
        uptime: 90
      },
      priceAssumptions: {
        oilPrice: 65,
        gasPrice: 3.0,
        escalation: 0.02
      },
      fiscalTerms: {
        template_type: 'psc',
        cost_oil_limit: 60,
        profit_split: 40, // Contractor share
        tax_rate: 30, // Tax on profit share
        royalty_rate: 10
      }
    };
  }

  return null;
};