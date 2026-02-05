/**
 * Service for petrophysical calculations and data management.
 */

export const petrophysicsService = {
  /**
   * Calculates permeability from porosity using a correlation
   * @param {number} phi - Porosity
   * @param {Object} model - { type: 'timur', constants: [a, b, c] }
   */
  calculatePermeability: (phi, model) => {
    // Example Timur equation mock
    if (model.type === 'timur') {
      return 0.136 * (phi ** 4.4) / (0.1 ** 2); // Simplified
    }
    return phi * 100; // Fallback linear
  },

  /**
   * Calculates Water Saturation (Archie)
   * @param {number} rt - True Resistivity
   * @param {number} phi - Porosity
   * @param {number} rw - Water Resistivity
   * @param {number} m - Cementation exp
   * @param {number} n - Saturation exp
   * @param {number} a - Tortuosity
   */
  calculateSw: (rt, phi, rw, m = 2, n = 2, a = 1) => {
    if (phi <= 0 || rt <= 0) return 1;
    const f = a / (phi ** m);
    const sw = ( (f * rw) / rt ) ** (1/n);
    return Math.min(Math.max(sw, 0), 1);
  },

  /**
   * Saves a petrophysical workflow state
   */
  saveWorkflow: async (workflowData) => {
    console.log('Saving petro workflow:', workflowData);
    return { success: true, timestamp: new Date() };
  }
};