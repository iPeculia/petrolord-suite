/**
 * Service for Rock Physics calculations.
 */

export const rockPhysicsService = {
  /**
   * Wyllie Time Average Equation
   * Calculates velocity from porosity.
   */
  calculateVelocityWyllie: (phi, matrixV, fluidV) => {
    if (phi >= 1) return fluidV;
    if (phi <= 0) return matrixV;
    
    // 1/V = phi/Vf + (1-phi)/Vm
    const slowness = (phi / fluidV) + ((1 - phi) / matrixV);
    return 1 / slowness;
  },

  /**
   * Gardner's Equation
   * Estimates density from velocity.
   * rho = alpha * V^0.25
   */
  calculateDensityGardner: (velocity, alpha = 0.31) => {
    return alpha * Math.pow(velocity, 0.25);
  },

  /**
   * Gassmann Fluid Substitution (Simplified)
   * Replaces initial fluid with new fluid to find new Bulk Modulus (K_sat_new)
   */
  fluidSubstitution: (K_sat_old, K_dry, K_fl_old, K_fl_new, phi) => {
    // Implementation of Gassmann equation logic would go here
    // This is a complex calculation usually involving K_matrix as well
    
    // Mock return for frontend demo
    const percentChange = (K_fl_new - K_fl_old) / K_fl_old;
    return K_sat_old * (1 + percentChange * 0.1); // Fake physics for UI feedback
  }
};