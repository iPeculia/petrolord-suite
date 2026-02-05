import { calculateLinearRegression } from './DiagnosticCalculator';

/**
 * MB Model Fitting Engine
 * Performs regression analysis for specific Material Balance Models.
 */

export const calculateResiduals = (actualData, fittedModelFn, xKey, yKey) => {
  return actualData.map(point => {
    const x = point[xKey];
    const y = point[yKey];
    const y_pred = fittedModelFn(x);
    return y - y_pred;
  });
};

export const calculateRMSE = (residuals) => {
  if (!residuals.length) return 0;
  const sumSq = residuals.reduce((acc, r) => acc + r * r, 0);
  return Math.sqrt(sumSq / residuals.length);
};

/**
 * Fit Volumetric Oil Model
 * F = N * Eo
 * Plot F vs Eo. Slope is N. Intercept should be 0.
 */
export const fitVolumetricModel = (diagnosticData) => {
  const regression = calculateLinearRegression(diagnosticData, 'Eo', 'F');
  
  // For pure volumetric, we might force intercept through zero, but standard regression gives best fit.
  // y = mx + c. N = m.
  const N = regression.slope;
  const residuals = calculateResiduals(diagnosticData, (x) => regression.slope * x + regression.intercept, 'Eo', 'F');
  const rmse = calculateRMSE(residuals);

  return {
    type: 'volumetric',
    N,
    R2: regression.r2,
    RMSE: rmse,
    intercept: regression.intercept, // Ideally close to 0
    params: { N }
  };
};

/**
 * Fit Gas Cap Model
 * F = N*Eo + m*N*Eg
 * F/Eo = N + m*N*(Eg/Eo)
 * Plot Y=F/Eo vs X=Eg/Eo. Intercept=N, Slope=m*N.
 */
export const fitGasCapModel = (diagnosticData) => {
  // Filter out points where Eo is close to 0 to avoid infinity
  const validData = diagnosticData.filter(d => Math.abs(d.Eo) > 0.0001);
  
  const regression = calculateLinearRegression(validData, 'Eg_over_Eo', 'F_over_Eo');
  
  const N = regression.intercept;
  const mN = regression.slope;
  const m = N !== 0 ? mN / N : 0;
  
  const residuals = calculateResiduals(validData, (x) => regression.slope * x + regression.intercept, 'Eg_over_Eo', 'F_over_Eo');
  const rmse = calculateRMSE(residuals);

  return {
    type: 'gascap',
    N,
    m,
    R2: regression.r2,
    RMSE: rmse,
    params: { N, m }
  };
};

/**
 * Fit Water Drive Model (Schilthuis Steady State Assumption)
 * F = N*Et + We
 * If We = C * sum(dp*dt)? Too complex for simple linear reg without iterating.
 * Simple check: F vs Et. If straight line -> Volumetric. Curve upward -> Water Drive.
 * Havlena-Odeh for Water Drive:
 * F / Et = N + We / Et
 * If assumes We = J * integral(dP), we can plot F/Et vs (integral(dP)/Et). Slope = J, Intercept = N.
 * We'll support a simple "Pot Aquifer" approximation: We = c * (Pi - P)
 * Then F = N*Et + U*(Pi-P). F/Et = N + U*((Pi-P)/Et).
 * X = (Pi-P)/Et, Y = F/Et. Slope = U, Intercept = N.
 */
export const fitWaterDriveModel = (diagnosticData) => {
  // Prepare X and Y
  const validData = diagnosticData.filter(d => Math.abs(d.Et) > 0.0001);
  
  const xyData = validData.map(d => ({
    X: (d.P_init - d.P) / d.Et, // Proxy for aquifer potential per unit expansion
    Y: d.F / d.Et
  }));
  
  const regression = calculateLinearRegression(xyData, 'X', 'Y');
  
  const N = regression.intercept;
  const U = regression.slope; // Aquifer constant
  
  // Calc residuals on the linearized plot
  const residuals = calculateResiduals(xyData, (x) => regression.slope * x + regression.intercept, 'X', 'Y');
  const rmse = calculateRMSE(residuals);

  return {
    type: 'water',
    N,
    U, // Aquifer constant
    R2: regression.r2,
    RMSE: rmse,
    params: { N, U }
  };
};