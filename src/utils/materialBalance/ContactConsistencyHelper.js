/**
 * Contact Consistency Helper
 * Validates and analyzes fluid contact movements.
 */

export const calculateContactMovement = (productionHistory, tankGeometry, driveType, N, m, We) => {
  // Placeholder for sophisticated movement model
  // In Phase 3, we focus on validation and checking directionality
  // E.g., if Water Drive -> OWC should rise.
  return {
    GOC: [],
    OWC: []
  };
};

export const validateContactData = (contactObservations, reservoirMetadata) => {
  const issues = [];
  
  if (!contactObservations.dates || contactObservations.dates.length === 0) {
    return issues;
  }

  const { OWC0, GOC0, thickness, datum } = reservoirMetadata;
  
  // Basic geometry bounds
  // Assuming thickness is gross thickness and contacts are depths (TVD)
  // We don't have structure top/base explicitly in simple metadata, 
  // but we can check relative positions.

  contactObservations.dates.forEach((date, i) => {
    const goc = contactObservations.measuredGOC[i];
    const owc = contactObservations.measuredOWC[i];

    // Check 1: GOC vs OWC
    if (goc && owc && goc >= owc) {
      issues.push({
        date,
        severity: 'error',
        message: `GOC (${goc}) is deeper than or equal to OWC (${owc}). This is physically impossible for standard reservoirs.`
      });
    }

    // Check 2: Initial Contact deviations
    if (i === 0 && OWC0) {
        // Check if first measured is wildly different from metadata init
        if (owc && Math.abs(owc - OWC0) > 50) {
            issues.push({
                date,
                severity: 'warning',
                message: `First measured OWC (${owc}) differs significantly from defined Initial OWC (${OWC0}).`
            });
        }
    }

    // Check 3: Movement Direction (Heuristic)
    // Need previous point
    if (i > 0) {
        const prevOwc = contactObservations.measuredOWC[i-1];
        const prevGoc = contactObservations.measuredGOC[i-1];

        if (prevOwc && owc) {
            const diff = prevOwc - owc; // Positive means OWC moved UP (shallower)
            if (Math.abs(diff) > 100) {
                 issues.push({
                    date,
                    severity: 'warning',
                    message: `Large jump in OWC detected (${diff.toFixed(1)} ft). Check data quality.`
                });
            }
        }
    }
  });

  return issues;
};

export const calculateConsistencyScore = (issues, totalPoints) => {
    if (totalPoints === 0) return 0;
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    
    // Simple scoring
    let score = 100;
    score -= (errorCount * 20);
    score -= (warningCount * 5);
    
    return Math.max(0, score);
};