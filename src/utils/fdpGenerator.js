export const generateFdpDocument = (inputs) => {
  const {
    projectName,
    regionCountry,
    developmentConcept,
    stoip,
    numProducers,
    capex,
    fdpStandard,
  } = inputs;

  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const executiveSummary = `
## 1.0 Executive Summary

This Field Development Plan (FDP) outlines the proposed strategy for the commercial development of the ${projectName}, located in ${regionCountry}. The selected development concept is a ${developmentConcept}, designed to optimize recovery and economic value.

The project's primary objective is to efficiently produce the estimated ${stoip} MMbbl of STOOIP. The development will be phased, with an initial phase comprising ${numProducers} production wells.

The total estimated Capital Expenditure (CAPEX) for the project is approximately $${capex} MM. This FDP has been prepared in accordance with the ${fdpStandard}.
  `;

  const introduction = `
## 2.0 Introduction

### 2.1 Project Background
The ${projectName} represents a significant hydrocarbon resource. This document provides a comprehensive overview of the technical, commercial, and operational plan for its development.

### 2.2 Scope of Work
The scope of this FDP covers all aspects from subsurface characterization to surface facilities design, drilling, completion, and economic evaluation.
  `;

  const subsurface = `
## 3.0 Subsurface Development Plan

### 3.1 Geological and Geophysical Overview
The field is characterized by [Detailed geological description placeholder]. The main reservoir units are [Reservoir units placeholder].

### 3.2 Reservoir Characterization
- Stock Tank Oil Initially In Place (STOOIP): ${stoip} MMbbl
- Gas Initially In Place (GIIP): [GIIP placeholder] Bscf
- Hydrocarbon Type: ${inputs.hydrocarbonType || 'Light Oil'}

### 3.3 Production and Injection Wells
A total of ${numProducers} production wells and ${inputs.numInjectors || 'N/A'} injection wells are planned. The well types will primarily be ${inputs.wellTypes?.join(', ') || 'Horizontal'}.
  `;

  const facilities = `
## 4.0 Surface Facilities and Infrastructure

### 4.1 Development Concept
The chosen concept is a ${developmentConcept}. This was selected based on a rigorous evaluation of technical feasibility, cost, and schedule.

### 4.2 Processing Facilities
The surface facilities will be designed to handle [Production rates placeholder]. Key components include separators, compressors, and water treatment units.
  `;

  const economics = `
## 5.0 Economic Analysis

### 5.1 Key Economic Indicators
- Project CAPEX (P50): $${capex} MM
- Project OPEX (P50): $${inputs.opex} MM/year
- Project NPV (P50): $${inputs.npv} MM

### 5.2 Fiscal Regime
The project will be governed by a ${inputs.fiscalRegime}.
  `;

  const hse = `
## 6.0 Health, Safety, and Environment (HSE)

A comprehensive HSE management plan will be implemented to ensure the safety of all personnel and minimize environmental impact. Key considerations include [HSE risks placeholder].
  `;

  const conclusion = `
## 7.0 Conclusion and Recommendations

The development of ${projectName} is technically feasible and economically robust. It is recommended to proceed to the next project phase, targeting a Final Investment Decision (FID) by ${inputs.targetSanctionDate}.
  `;

  return `
# Field Development Plan (FDP)
## ${projectName}

**Date:** ${date}
**Prepared By:** ${inputs.preparedBy}

---

${executiveSummary}
---
${introduction}
---
${subsurface}
---
${facilities}
---
${economics}
---
${hse}
---
${conclusion}
  `.trim();
};