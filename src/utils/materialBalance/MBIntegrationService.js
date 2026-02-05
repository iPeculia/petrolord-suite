/**
 * Integration Service for Material Balance Pro
 * Handles data formatting and export to other modules.
 */

export const exportContactForecastToEarthModel = (contactForecast) => {
  if (!contactForecast) return null;
  
  // Format: { date: 'ISO', GOC_TVD: 1234, OWC_TVD: 5678 }
  return contactForecast.map(pt => ({
    date: pt.date,
    GOC_TVD: pt.GOC,
    OWC_TVD: pt.OWC,
    source: 'MaterialBalancePro'
  }));
};

export const exportPressureForecastToFDP = (forecastData) => {
  if (!forecastData) return null;
  
  return forecastData.map(pt => ({
    year: new Date(pt.date).getFullYear(),
    pressure: pt.pressure,
    production_oil: pt.qo,
    production_gas: pt.qg,
    production_water: pt.qw
  }));
};

export const exportScenarioToNPVBuilder = (scenario) => {
  // Convert simulation volumes to cash flow input format
  return {
    scenarioName: scenario.name,
    oil_production_series: scenario.data.map(d => ({ date: d.date, value: d.qo })),
    gas_production_series: scenario.data.map(d => ({ date: d.date, value: d.qg })),
    water_production_series: scenario.data.map(d => ({ date: d.date, value: d.qw })),
  };
};