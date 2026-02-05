import Papa from 'papaparse';

// --- Import Helper ---
export const parseImportedData = (importedData) => {
    // Handle Data Exchange Hub format
    if (importedData.logData && Array.isArray(importedData.logData)) {
        // Format from Crossplot itself (loading saved state)
        return importedData;
    }
    
    if (importedData.curve_data && Array.isArray(importedData.curve_data)) {
        // Format from some other log apps which send curve_data array
        const data = importedData.curve_data;
        if (data.length === 0) return null;
        
        // Extract curve names from first object
        const curves = Object.keys(data[0]);
        const depthCol = curves.find(c => c.toLowerCase().includes('dep') || c.toLowerCase() === 'md') || curves[0];
        
        const depthValues = data.map(row => row[depthCol]).filter(d => d != null && !isNaN(d));
        const mdMin = depthValues.length ? Math.min(...depthValues) : 0;
        const mdMax = depthValues.length ? Math.max(...depthValues) : 0;
        
        const suggestedMap = suggestCurveMapping(curves);
        if (!suggestedMap.depth) suggestedMap.depth = depthCol;

        return {
            logData: data,
            curves,
            depthCol,
            mdMin,
            mdMax,
            curveMap: suggestedMap,
            fileName: importedData.name || "Imported_Dataset"
        };
    }
    
    return null;
};

// --- Main Parsers ---
const parseLAS = (fileContent) => {
  const lines = fileContent.split(/\r\n|\n/);
  let curves = [];
  let data = [];
  let inDataSection = false;
  let depthCol = '';

  let curveSectionContent = '';
  let inCurveSection = false;

  for (const line of lines) {
    const trimLine = line.trim();
    if (trimLine.toUpperCase().startsWith('~C')) {
      inCurveSection = true;
      continue;
    }
    if (trimLine.startsWith('~')) {
      if (inCurveSection && trimLine.toUpperCase().startsWith('~A')) {
          // End of curves, start of data
          inCurveSection = false;
      } else if(inCurveSection) {
          inCurveSection = false; // Any other section
      }
    }
    if (inCurveSection) {
      if(!trimLine.startsWith('#')) curveSectionContent += line + '\n';
    }
  }

  if (curveSectionContent) {
    const curveLines = curveSectionContent.split('\n').filter(l => l.trim());
    curves = curveLines.map(l => {
        // Split by first dot or space to get mnemonic
        const parts = l.split(/[.:\s]+/); 
        return parts[0].trim();
    });
    depthCol = curves[0];
  }

  // Data Section
  for (const line of lines) {
    const trimLine = line.trim();
    if (trimLine.toUpperCase().startsWith('~A')) {
      inDataSection = true;
      continue;
    }
    if (inDataSection) {
      if (trimLine === '' || trimLine.startsWith('#')) continue;
      // Handle LAS wrapping if needed? Assuming standard non-wrapped for now or simple space delimited
      const values = trimLine.split(/\s+/).map(v => parseFloat(v));
      data.push(values);
    }
  }

  const dataObjects = data.map(row => {
    const obj = {};
    curves.forEach((curve, i) => {
      obj[curve] = row[i];
    });
    return obj;
  });

  return { curves, data: dataObjects, depthCol };
};

const parseCSV = (fileContent) => {
  const result = Papa.parse(fileContent, { header: true, dynamicTyping: true, skipEmptyLines: true });
  const curves = result.meta.fields;
  const depthCol = curves[0];
  return { curves, data: result.data, depthCol };
};

export const parseLogFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        if (file.name.toLowerCase().endsWith('.las')) {
          resolve(parseLAS(content));
        } else if (file.name.toLowerCase().endsWith('.csv')) {
          resolve(parseCSV(content));
        } else {
          reject(new Error('Unsupported file type. Please use .las or .csv'));
        }
      } catch (e) {
        reject(new Error('Failed to parse file: ' + e.message));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

const suggestCurveMapping = (curves) => {
  const mapping = { depth: '', gr: '', rhob: '', nphi: '', dt: '', rt: '', phi: '' };
  const lowerCurves = curves.map(c => c.toLowerCase());

  const findCurve = (patterns) => {
    for (const pattern of patterns) {
      const index = lowerCurves.findIndex(c => c.includes(pattern));
      if (index !== -1) return curves[index];
    }
    return '';
  };

  mapping.depth = findCurve(['dept', 'depth', 'md']);
  mapping.gr = findCurve(['gr', 'gamma', 'gapi']);
  mapping.rhob = findCurve(['rhob', 'den', 'density', 'rho']);
  mapping.nphi = findCurve(['nphi', 'neu', 'neutron', 'tnph']);
  mapping.dt = findCurve(['dt', 'sonic', 'ac']);
  mapping.rt = findCurve(['rt', 'resd', 'ild', 'rdeep', 'res_deep']);
  mapping.phi = findCurve(['phi', 'por', 'phie', 'phit']);

  return mapping;
};

export const processFileUpload = async (file) => {
  const { curves, data, depthCol } = await parseLogFile(file);
  const suggestedMap = suggestCurveMapping(curves);
  if (!suggestedMap.depth) suggestedMap.depth = depthCol;

  const depthValues = data.map(row => row[depthCol]).filter(d => d != null && !isNaN(d));
  const mdMin = depthValues.length > 0 ? Math.min(...depthValues) : 0;
  const mdMax = depthValues.length > 0 ? Math.max(...depthValues) : 0;

  return {
    logData: data,
    curves,
    depthCol,
    mdMin,
    mdMax,
    suggestedMap,
  };
};

// --- Calculations ---

const addDensityNeutronOverlays = (plot_data, layout) => {
  const lithologyLines = {
    sandstone: { x: [2.65, 1.9], y: [-0.02, 0.45], name: 'Sandstone (SiO2)' },
    limestone: { x: [2.71, 2.0], y: [0.0, 0.48], name: 'Limestone (CaCO3)' },
    dolomite: { x: [2.87, 2.2], y: [0.02, 0.46], name: 'Dolomite (CaMg(CO3)2)' },
  };

  Object.values(lithologyLines).forEach(line => {
    plot_data.push({
      x: line.x,
      y: line.y,
      mode: 'lines',
      type: 'scatter',
      name: line.name,
      line: { color: 'rgba(255, 255, 255, 0.4)', width: 1.5, dash: 'dot' },
      hoverinfo: 'name'
    });
  });
  layout.showlegend = true;
};

const addPickettPlotOverlays = (plot_data, layout, params) => {
  const { a, m, n, Rw, sw_lines, phi_min, phi_max } = params;
  // Logarithmic space for Pickett lines
  const phi_values = [];
  for(let i=0; i<=50; i++) {
      const val = phi_min * Math.pow(phi_max/phi_min, i/50);
      phi_values.push(val);
  }

  sw_lines.forEach(sw => {
    // Archie: Sw^n = (a * Rw) / (phi^m * Rt)  =>  Rt = (a * Rw) / (phi^m * Sw^n)
    const rt_values = phi_values.map(phi => (a * Rw) / (Math.pow(phi, m) * Math.pow(sw, n)));
    plot_data.push({
      x: rt_values,
      y: phi_values,
      mode: 'lines',
      type: 'scatter',
      name: `Sw = ${sw * 100}%`,
      line: { color: 'rgba(59, 130, 246, 0.6)', width: 2, dash: 'dash' },
      hoverinfo: 'name'
    });
  });
  layout.showlegend = true;
};

const runKMeans = (data, k, max_iter) => {
    // Data is array of [x, y]
    if (!data || data.length < k) return new Array(data ? data.length : 0).fill(0);
    
    // Randomly initialize centroids from data
    let centroids = [];
    const usedIndices = new Set();
    while(centroids.length < k && usedIndices.size < data.length) {
        const idx = Math.floor(Math.random() * data.length);
        if(!usedIndices.has(idx)) {
            centroids.push([...data[idx]]);
            usedIndices.add(idx);
        }
    }
    
    let assignments = new Array(data.length);

    for (let iter = 0; iter < max_iter; iter++) {
        let changed = false;
        // E-step: Assign points
        for (let i = 0; i < data.length; i++) {
            let minDist = Infinity;
            let bestCentroid = 0;
            for (let j = 0; j < k; j++) {
                const dx = data[i][0] - centroids[j][0];
                const dy = data[i][1] - centroids[j][1];
                const dist = dx*dx + dy*dy; // Squared dist is sufficient
                if (dist < minDist) {
                    minDist = dist;
                    bestCentroid = j;
                }
            }
            if (assignments[i] !== bestCentroid) {
                assignments[i] = bestCentroid;
                changed = true;
            }
        }

        if (!changed && iter > 5) break; // Converged early

        // M-step: Update centroids
        const newCentroids = Array.from({ length: k }, () => [0, 0]);
        const counts = new Array(k).fill(0);
        
        for (let i = 0; i < data.length; i++) {
            const c = assignments[i];
            newCentroids[c][0] += data[i][0];
            newCentroids[c][1] += data[i][1];
            counts[c]++;
        }

        for (let j = 0; j < k; j++) {
            if (counts[j] > 0) {
                newCentroids[j][0] /= counts[j];
                newCentroids[j][1] /= counts[j];
            } else {
                // Re-init empty centroid
                const idx = Math.floor(Math.random() * data.length);
                newCentroids[j] = [...data[idx]];
            }
        }
        centroids = newCentroids;
    }
    return assignments;
};

export const computePlotData = ({ logData, curveMap, filter, plotType, params }) => {
  let filteredData = logData;

  // Filter by Depth
  if (filter.md_min || filter.md_max) {
      const min = filter.md_min ? parseFloat(filter.md_min) : -Infinity;
      const max = filter.md_max ? parseFloat(filter.md_max) : Infinity;
      filteredData = filteredData.filter(row => {
          const d = row[curveMap.depth];
          return d >= min && d <= max;
      });
  }

  // Filter by Vsh
  if (curveMap.gr && filter.vsh_max < 1) {
    // Simple Vsh calc locally on current filtered data
    const grValues = filteredData.map(row => row[curveMap.gr]).filter(v => v != null && !isNaN(v));
    if(grValues.length > 0) {
        const grMin = Math.min(...grValues);
        const grMax = Math.max(...grValues);
        const grRange = grMax - grMin || 1;
        
        filteredData = filteredData.filter(row => {
            const gr = row[curveMap.gr];
            if(gr == null || isNaN(gr)) return false;
            const vsh = (gr - grMin) / grRange;
            return vsh <= filter.vsh_max;
        });
    }
  }

  // Calculate Porosity if enabled
  if (params.poro.enabled && curveMap.rhob) {
    filteredData = filteredData.map(row => {
      const rhob = row[curveMap.rhob];
      if (rhob != null && !isNaN(rhob)) {
        const den_mat = params.poro.rho_matrix;
        const den_fl = params.poro.rho_fluid;
        // phi = (rho_ma - rho_b) / (rho_ma - rho_fl)
        const phi_calc = (den_mat - rhob) / (den_mat - den_fl);
        return { ...row, PHI_CALC: Math.max(0, Math.min(1, phi_calc)) };
      }
      return { ...row, PHI_CALC: null };
    });
  }

  let plot_data = [];
  let layout = {};
  let point_count = filteredData.length;
  let applied_filters = `MD: ${filter.md_min}-${filter.md_max}, Vsh Max: ${filter.vsh_max}`;

  let x_data = [], y_data = [];
  let x_label, y_label;
  let originalIndices = [];

  if (plotType === 'density_neutron') {
    filteredData.forEach((row, idx) => {
        const x = row[curveMap.rhob];
        const y = row[curveMap.nphi];
        if(x!=null && !isNaN(x) && y!=null && !isNaN(y)) {
            x_data.push(x);
            y_data.push(y);
            originalIndices.push(idx);
        }
    });
    x_label = 'Bulk Density (g/cc)';
    y_label = 'Neutron Porosity (v/v)';
    layout = {
      title: 'Density-Neutron Crossplot',
      xaxis: { title: x_label, range: [params.dn.rhob_min, params.dn.rhob_max], zeroline: false },
      yaxis: { title: y_label, range: [params.dn.nphi_max, params.dn.nphi_min], zeroline: false } // Standard ND reverse Y
    };
    addDensityNeutronOverlays(plot_data, layout);

  } else if (plotType === 'pickett') {
    const x_curve = curveMap.rt;
    const y_curve = curveMap[params.pickett.porosity_source]; // usually PHI or PHI_CALC or NPHI
    
    filteredData.forEach((row, idx) => {
        const x = row[x_curve];
        const y = row[y_curve];
        if(x!=null && !isNaN(x) && x > 0 && y!=null && !isNaN(y) && y > 0) { // Log plot needs positive
            x_data.push(x);
            y_data.push(y);
            originalIndices.push(idx);
        }
    });
    
    x_label = 'Resistivity (ohm.m)';
    y_label = 'Porosity (v/v)';
    layout = {
      title: 'Pickett Plot',
      xaxis: { title: x_label, type: 'log', range: [Math.log10(params.pickett.rt_min), Math.log10(params.pickett.rt_max)] },
      yaxis: { title: y_label, type: 'log', range: [Math.log10(params.pickett.phi_min), Math.log10(params.pickett.phi_max)] }
    };
    addPickettPlotOverlays(plot_data, layout, params.pickett);
  }

  // Clustering or Coloring
  let color_data;
  let colorscale = 'Viridis';
  let colorbarTitle = curveMap.gr || 'GR';

  if (params.cluster.enabled && x_data.length > 0) {
    // Prepare data for KMeans [x, y]
    const clusterInput = x_data.map((x, i) => [x, y_data[i]]);
    const assignments = runKMeans(clusterInput, params.cluster.k, params.cluster.max_iter);
    color_data = assignments;
    colorscale = 'Portland'; // Distinct colors
    colorbarTitle = 'Cluster ID';
  } else if (params.poro.enabled) {
    color_data = originalIndices.map(i => filteredData[i].PHI_CALC);
    colorscale = 'Jet';
    colorbarTitle = 'PHI_CALC';
  } else {
    // Default color by GR
    color_data = originalIndices.map(i => filteredData[i][curveMap.gr]);
  }

  plot_data.push({
    x: x_data, y: y_data, 
    mode: 'markers', 
    type: 'scatter', 
    name: 'Log Data',
    marker: { 
        color: color_data, 
        colorscale: colorscale, 
        showscale: true, 
        size: 6, 
        opacity: 0.8, 
        colorbar: { title: colorbarTitle, thickness: 15 } 
    }
  });

  // Add clusters back to data for export
  const exportData = filteredData.map((row, i) => {
      // Check if this row was used in plotting (exists in originalIndices)
      const plotIdx = originalIndices.indexOf(i);
      let clusterId = null;
      if(plotIdx !== -1 && params.cluster.enabled) {
           // Re-run simplistic matching or map back? 
           // Since we generated color_data parallel to x_data, we can map back via plotIdx
           // Wait, color_data is length of x_data. 
           // plotIdx is index in x_data.
           clusterId = color_data[plotIdx];
      }
      return { ...row, Cluster_ID: clusterId };
  });

  return { plot_data, layout, point_count, applied_filters, filteredData: exportData };
};

export const downloadCSV = (data, fileName) => {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};