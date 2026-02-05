import React from 'react';

const assessSscRisk = (h2s_partial_pressure) => {
  const h2s_psia = h2s_partial_pressure * 14.5038;

  if (h2s_psia < 0.05) {
    return {
      risk: 'Low',
      note: 'H₂S partial pressure is below the NACE MR0175 threshold for sour service.'
    };
  } else if (h2s_psia < 1) {
    return {
      risk: 'Moderate',
      note: 'Sour service conditions apply. Material selection according to NACE MR0175 is critical.'
    };
  } else {
    return {
      risk: 'Severe',
      note: 'High H₂S partial pressure. Severe risk of SSC. Strict adherence to NACE MR0175 and potentially higher-grade materials are required.'
    };
  }
};

const getCorrosionRateCategory = (rate) => {
  if (rate < 0.1) return 'Low';
  if (rate < 1.0) return 'Moderate';
  if (rate < 5.0) return 'High';
  return 'Severe';
};

export const calculateCorrosion = (inputs) => {
  const { temperature, co2_partial_pressure, h2s_partial_pressure, ph, oil_wetting, scaling_tendency } = inputs;

  if (temperature === null || co2_partial_pressure === null || h2s_partial_pressure === null) {
    throw new Error("Temperature, CO₂ and H₂S partial pressures are required.");
  }

  let baseCorrosionRate = 0;
  if (co2_partial_pressure > 0) {
    const tempKelvin = temperature + 273.15;
    const logCR = 5.8 - (1710 / tempKelvin) + 0.67 * Math.log10(co2_partial_pressure);
    baseCorrosionRate = Math.pow(10, logCR);
  }

  // pH factor
  let f_ph = 1;
  if (ph > 4) f_ph = Math.pow(10, -0.5 * (ph - 4));

  // Oil wetting factor
  const f_oil = oil_wetting === 'oil_continuous' ? 0.1 : 1;

  // Scaling factor
  const f_scale = scaling_tendency === 'carbonate_scale' ? 0.2 : 1;

  const finalCorrosionRate = baseCorrosionRate * f_ph * f_oil * f_scale;

  const sscAssessment = assessSscRisk(h2s_partial_pressure);
  const corrosionCategory = getCorrosionRateCategory(finalCorrosionRate);

  let recommendation;
  if (sscAssessment.risk === 'Severe' || sscAssessment.risk === 'Moderate') {
    recommendation = `High risk of Sulfide Stress Cracking (SSC). ${sscAssessment.note} The calculated CO₂ corrosion rate is ${finalCorrosionRate.toFixed(2)} mm/yr, but material selection should be primarily driven by SSC resistance.`;
  } else if (finalCorrosionRate < 0.1) {
    recommendation = "CO₂ corrosion rate is low. Standard monitoring is likely sufficient. " + sscAssessment.note;
  } else if (finalCorrosionRate < 1) {
    recommendation = "Moderate CO₂ corrosion rate. Consider corrosion inhibition or regular inspections. " + sscAssessment.note;
  } else {
    recommendation = "High CO₂ corrosion rate. Corrosion mitigation (e.g., inhibitors, CRA materials) is strongly recommended. " + sscAssessment.note;
  }

  return {
    corrosion_rate_mm_yr: finalCorrosionRate,
    corrosion_rate_category: corrosionCategory,
    ssc_risk: sscAssessment.risk,
    recommendation: recommendation,
  };
};