export const validateInputs = (state) => {
  const issues = [];

  // Helper to add issue
  const addIssue = (type, location, description, fixAction = null) => {
    issues.push({ id: Math.random().toString(36).substr(2, 9), type, location, description, fixAction });
  };

  const { modelSettings, productionData, costData, assumptions } = state;

  // --- Setup / Model Settings Validation ---
  if (modelSettings.startYear >= modelSettings.endYear) {
    addIssue('critical', 'Setup', 'Start Year must be before End Year.');
  }
  if (modelSettings.discountRate < 0 || modelSettings.discountRate > 1) {
    addIssue('warning', 'Setup', 'Discount Rate looks unusual (expected 0-1 range).');
  }

  // --- Production Validation ---
  if (productionData && productionData.length > 0) {
    let hasZeroProduction = true;
    let hasNegativeProduction = false;
    let missingYears = false;

    // Check for gaps in years
    const years = productionData.map(d => d.year).sort((a, b) => a - b);
    for (let i = 0; i < years.length - 1; i++) {
        if (years[i+1] !== years[i] + 1) missingYears = true;
    }

    productionData.forEach(row => {
      const totalProd = (row.oil_rate || 0) + (row.gas_rate || 0) + (row.condensate_rate || 0);
      if (totalProd > 0) hasZeroProduction = false;
      if ((row.oil_rate < 0) || (row.gas_rate < 0) || (row.condensate_rate < 0)) hasNegativeProduction = true;
    });

    if (hasNegativeProduction) {
      addIssue('critical', 'Production', 'Negative production values detected.', 'removeNegatives');
    }
    if (hasZeroProduction) {
      addIssue('info', 'Production', 'No production entered yet.');
    }
    if (missingYears) {
        addIssue('critical', 'Production', 'Gap detected in production years.');
    }
  }

  // --- Cost Validation ---
  if (costData) {
      // CAPEX Checks
      const capexYears = costData.capex?.flatMap(c => c.profile?.map(p => p.year) || []) || [];
      const maxCapexYear = Math.max(...capexYears, 0);
      const prodStartYear = productionData?.[0]?.year || modelSettings.startYear;
      
      // Simple check: huge capex long after production starts might be weird, but valid for phased dev.
      // Better check: Negative costs
      let hasNegativeCosts = false;
      costData.capex?.forEach(bucket => {
          bucket.profile?.forEach(p => {
              if (p.amount < 0) hasNegativeCosts = true;
          });
      });
      if (hasNegativeCosts) {
          addIssue('critical', 'Costs', 'Negative CAPEX values found.', 'removeNegativeCosts');
      }
  }

  // --- Assumptions Validation ---
  if (assumptions) {
    if (assumptions.workingInterest > 100 || assumptions.workingInterest < 0) {
      addIssue('critical', 'Assumptions', 'Working Interest must be 0-100%.');
    }
    if (assumptions.netRevenueInterest > assumptions.workingInterest) {
      addIssue('warning', 'Assumptions', 'NRI is usually less than or equal to WI.');
    }
  }

  return issues;
};