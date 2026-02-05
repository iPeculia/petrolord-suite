/**
 * Report Generator Service
 * Generates PDF and Excel summaries of correlation projects.
 */

export const generateCSV = (wells, horizons, markers) => {
  const header = ['Well', 'Horizon', 'MD', 'Marker Type', 'Comments'];
  const rows = markers.map(m => {
    const well = wells.find(w => w.id === m.wellId);
    const horizon = horizons.find(h => h.id === m.horizonId);
    return [
      well?.name || 'Unknown',
      horizon?.name || 'Unassigned',
      m.depth,
      m.type || 'Stratigraphic',
      m.description || ''
    ].join(',');
  });

  return [header.join(','), ...rows].join('\n');
};

export const generatePDFReport = (projectData) => {
  // In a real app, use jspdf or react-pdf
  console.log('Generating PDF for project:', projectData.name);
  return "PDF_BINARY_BLOB_STUB";
};