import { parseExcel, parseCSV } from './fileUploadHandler';
import { parseLAS } from './wellCorrelation/lasParser';

/**
 * Parses a log file (LAS, CSV, Excel, JSON) into standardized curve data
 * @param {File} file 
 * @returns {Promise<Object>} Standardized log data object
 */
export const parseLogFile = async (file) => {
  const extension = file.name.split('.').pop().toLowerCase();

  if (extension === 'las') {
    const lasData = await parseLAS(file);
    // Normalize LAS structure to generic structure if needed, or just return as is
    // Our app uses the structure returned by parseLAS mostly
    return {
      ...lasData,
      fileName: file.name,
      format: 'LAS'
    };
  }

  let rawData = [];
  
  if (extension === 'json') {
    const text = await file.text();
    rawData = JSON.parse(text);
  } else if (extension === 'csv') {
    const text = await file.text();
    rawData = await parseCSV(text);
  } else if (extension === 'xlsx' || extension === 'xls') {
    const buffer = await file.arrayBuffer();
    rawData = parseExcel(buffer);
  } else {
    throw new Error('Unsupported file format for logs.');
  }

  return convertTabularToLogData(rawData, file.name);
};

const convertTabularToLogData = (data, fileName) => {
  if (!data || data.length === 0) throw new Error('File contains no data.');

  // 1. Find Depth Column
  const headers = Object.keys(data[0]);
  const depthCol = headers.find(h => /depth|md|tvd|dept/i.test(h));

  if (!depthCol) throw new Error('Could not identify a Depth column (looking for Depth, MD, TVD).');

  // 2. Extract Depth array
  const depths = data.map(row => Number(row[depthCol])).filter(d => !isNaN(d));
  
  // 3. Extract Curves
  const curves = headers.filter(h => h !== depthCol).map(header => {
    const values = data.map(row => {
        const val = Number(row[header]);
        return isNaN(val) ? -999.25 : val; // Standard null value
    });
    
    // Calculate stats
    const validValues = values.filter(v => v !== -999.25);
    const min = validValues.length ? Math.min(...validValues) : 0;
    const max = validValues.length ? Math.max(...validValues) : 0;

    return {
      mnemonic: header.toUpperCase().replace(/[^A-Z0-9]/g, ''),
      unit: '', // Units often not in CSV header cleanly
      description: header,
      data: values,
      minValue: min,
      maxValue: max
    };
  });

  return {
    metadata: {
      name: fileName.split('.')[0],
      startDepth: depths[0],
      endDepth: depths[depths.length - 1],
      step: Math.abs(depths[1] - depths[0]) || 0,
      depthUnit: 'M' // Default assumption for CSV
    },
    curves,
    depths,
    statistics: {
      totalCurves: curves.length,
      totalDepthPoints: depths.length
    }
  };
};