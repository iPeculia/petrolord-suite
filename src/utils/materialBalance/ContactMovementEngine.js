/**
 * Contact Movement Engine
 * Calculates fluid contact depths based on volume displacement.
 */

export const calculateVolumeChange = (Np, Gp, Wp, Bo, Bg, Bw, Boi, Bgi, Bwi, Rs, Rsi, We) => {
  // Produced Reservoir Volumes
  const V_oil_prod = Np * Bo;
  const V_gas_prod = (Gp - Np * (Rs || 0)) * Bg; // Free gas produced
  const V_water_prod = Wp * Bw;
  
  // Net Voidage
  const Voidage = V_oil_prod + V_gas_prod + V_water_prod;
  
  // Net Influx
  const Influx = (We || 0) * Bw;
  
  // Expansion is internal, handled by balance. 
  // For contact MOVEMENT, we care about replacement.
  // e.g. In water drive, Influx replaces Voidage.
  // Net volume change at reservoir conditions.
  
  return { Voidage, Influx };
};

export const calculateOWCMovement = (
  N,      // OOIP (STB)
  area,   // Reservoir Area (ft2)
  phi,    // Porosity (fraction)
  Swi,    // Initial Water Saturation
  Sor,    // Residual Oil Saturation
  We_cum, // Cumulative Water Influx (res bbl)
  Wp_cum, // Cumulative Water Produced (res bbl)
  Bw,     // Water FVF
  initialOWC // Initial OWC Depth (ft)
) => {
  // Simple piston-like displacement model
  // Water moves up into oil zone.
  // Volume of rock invaded by water = Net Water Influx / (phi * (1 - Swi - Sor))
  // Net Water Influx = We_cum - Wp_cum (assuming produced water comes from aquifer or swept zone)
  
  const netWaterGain = (We_cum - Wp_cum); // res bbl
  
  if (netWaterGain <= 0) return initialOWC; // Contact doesn't move down in simple water drive (or assumes negligible)
  
  const mobilePoreVolumeFraction = phi * (1 - Swi - Sor);
  if (mobilePoreVolumeFraction <= 0) return initialOWC;
  
  // Convert bbl to ft3
  const netWaterGain_ft3 = netWaterGain * 5.615;
  
  // Height change dh = Vol / (Area * Fraction)
  // Area is assumed constant (cylinder). For complex shapes, need Area(depth) curve.
  const dh = netWaterGain_ft3 / (area * mobilePoreVolumeFraction);
  
  // OWC moves UP (depth decreases)
  return initialOWC - dh;
};

export const calculateGOCMovement = (
  N,      // OOIP (STB)
  m,      // Gas Cap Ratio
  area,   // Reservoir Area (ft2)
  phi,    // Porosity
  Swi,    // Initial Water
  Sorg,   // Residual Oil to Gas
  Sgr,    // Residual Gas to Oil (if oil moves up?) usually GOC moves down
  G_exp,  // Gas Expansion Volume (res bbl) - or net gas cap change
  producedGasCapGas, // res bbl
  initialGOC
) => {
  // Gas cap expands into oil zone as pressure drops
  // Volume invaded = Gas Expansion - Gas Cap Gas Produced
  
  const netGasGrowth = G_exp - producedGasCapGas; // res bbl
  
  if (netGasGrowth <= 0) return initialGOC; // Gas cap shrinks?
  
  const mobilePoreVolumeFraction = phi * (1 - Swi - Sorg);
  if (mobilePoreVolumeFraction <= 0) return initialGOC;
  
  const netGasGrowth_ft3 = netGasGrowth * 5.615;
  const dh = netGasGrowth_ft3 / (area * mobilePoreVolumeFraction);
  
  // GOC moves DOWN (depth increases)
  return initialGOC + dh;
};