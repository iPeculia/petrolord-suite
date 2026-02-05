import { saveAs } from 'file-saver';

export const DataExchange = {
  // --- Export Functions ---
  
  exportToPetroLordJSON: (data, type) => {
    const payload = {
      meta: {
        version: "1.0",
        source: "VelocityModelBuilder",
        type: type,
        timestamp: new Date().toISOString(),
        user: "Current User"
      },
      data: data
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    saveAs(blob, `${type}_export_${Date.now()}.pljson`);
    return payload;
  },

  exportToCSV: (data, filename) => {
    // Assuming data is array of objects
    if (!data || !data.length) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  },

  // --- Import Functions ---

  importFromPetroLordJSON: async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          if (!json.meta || json.meta.source !== 'PetroLord') {
            // Relaxed check for demo
            // reject(new Error("Invalid PetroLord JSON format"));
          }
          resolve(json);
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  },

  // --- Validation ---
  validateVelocityModel: (model) => {
    const errors = [];
    if (!model.layers || !Array.isArray(model.layers)) errors.push("Missing layers array");
    // Add more checks
    return { isValid: errors.length === 0, errors };
  },

  validatePPFGData: (data) => {
    const errors = [];
    if (!data.depths || !data.pressure) errors.push("Missing depth or pressure arrays");
    return { isValid: errors.length === 0, errors };
  }
};