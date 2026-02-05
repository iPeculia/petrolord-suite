import Papa from 'papaparse';

export const parseCSV = (fileContent) => {
  return new Promise((resolve, reject) => {
    Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve({
          headers: results.meta.fields,
          rows: results.data,
          errors: results.errors
        });
      },
      error: (error) => reject(error)
    });
  });
};

const COLUMN_ALIASES = {
  date: ['date', 'time', 'timestamp', 'prod_date', 'period'],
  rate: ['rate', 'oil', 'gas', 'water', 'qo', 'qg', 'qw', 'volume'],
  cum: ['cum', 'cumulative', 'np', 'gp', 'wp'],
  well: ['well', 'well_name', 'wellname', 'api', 'uwi']
};

export const detectColumns = (headers) => {
  const lowerHeaders = headers.map(h => h.toLowerCase());
  const mapping = {
    date: null,
    rate: null,
    cum: null,
    well: null
  };

  for (const [key, aliases] of Object.entries(COLUMN_ALIASES)) {
    for (const alias of aliases) {
      const index = lowerHeaders.findIndex(h => h.includes(alias));
      if (index !== -1 && !mapping[key]) {
        mapping[key] = headers[index];
        break; // Found a match for this key
      }
    }
  }
  return mapping;
};

export const mapColumns = (data, mapping) => {
  return data.map(row => ({
    date: row[mapping.date],
    rate: Number(row[mapping.rate]),
    cum: mapping.cum ? Number(row[mapping.cum]) : null,
    well: mapping.well ? row[mapping.well] : 'Unknown Well',
    original: row
  })).filter(row => row.date != null); // Basic filter
};

export const validateData = (data) => {
  const errors = [];
  const warnings = [];
  let validCount = 0;

  data.forEach((row, index) => {
    if (!row.date) {
      errors.push(`Row ${index + 1}: Missing date`);
    } else if (isNaN(new Date(row.date).getTime())) {
      errors.push(`Row ${index + 1}: Invalid date format`);
    }

    if (isNaN(row.rate)) {
      errors.push(`Row ${index + 1}: Invalid rate`);
    } else if (row.rate < 0) {
      warnings.push(`Row ${index + 1}: Negative rate`);
    } else {
      validCount++;
    }
  });

  return { valid: validCount > 0, validCount, errors, warnings };
};