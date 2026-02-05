import Papa from 'papaparse';

/**
 * CSV Parser utilities for Material Balance Pro
 * Robust detection and parsing of engineering data files.
 */

// Standardized column headers mapping with flexible aliases
const HEADER_ALIASES = {
  production: {
    date: ['date', 'time', 'timestamp', 'dt', 'period'],
    np: ['np (stb)', 'np', 'cumulative oil', 'cum oil', 'oil cum', 'oil prod cum', 'cumulative_oil'],
    gp: ['gp (scf)', 'gp', 'cumulative gas', 'cum gas', 'gas cum', 'gas prod cum', 'cumulative_gas'],
    wp: ['wp (stb)', 'wp', 'cumulative water', 'cum water', 'water cum', 'water prod cum', 'cumulative_water'],
    wc: ['wc', 'water cut', 'wct', 'bsw', 'water_cut'],
    rp: ['rp', 'gor', 'gas oil ratio', 'avg gor'],
    comments: ['comment', 'comments', 'remark', 'remarks', 'note', 'notes']
  },
  pressure: {
    date: ['date', 'time', 'timestamp', 'dt'],
    pr: ['pr (psia)', 'pr', 'reservoir pressure', 'sbhp', 'p_res', 'pres', 'p_avg'],
    pwf: ['pwf (psia)', 'pwf', 'flowing pressure', 'fbhp', 'p_flow'],
    testType: ['test type', 'test', 'type', 'method', 'source']
  },
  pvt: {
    pressure: ['pressure (psia)', 'pressure', 'p', 'pres', 'pressure_psia'],
    bo: ['bo (rb/stb)', 'bo', 'oil fvf', 'oil formation volume factor', 'formation volume factor oil'],
    bg: ['bg (rb/scf)', 'bg', 'gas fvf', 'gas formation volume factor', 'formation volume factor gas'],
    rs: ['rs (scf/stb)', 'rs', 'solution gas', 'gas oil ratio', 'gor', 'solution gor'],
    rv: ['rv (stb/scf)', 'rv', 'vapor oil ratio', 'condensate gas ratio', 'cgr'],
    mu_o: ['µo (cp)', 'uo (cp)', 'mu_o', 'oil viscosity', 'visc oil', 'viscosity oil', 'muo'],
    mu_g: ['µg (cp)', 'ug (cp)', 'mu_g', 'gas viscosity', 'visc gas', 'viscosity gas', 'mug']
  },
  contacts: {
    date: ['date', 'time', 'timestamp'],
    goc: ['goc depth (ft)', 'goc', 'gas oil contact', 'gas-oil contact', 'goc depth'],
    owc: ['owc depth (ft)', 'owc', 'oil water contact', 'oil-water contact', 'owc depth'],
    method: ['method', 'source', 'tool', 'logging tool']
  }
};

/**
 * Finds the best matching column header from a list of available headers.
 * @param {string[]} headers - The headers from the CSV file.
 * @param {string[]} possibleNames - Array of possible aliases for the column.
 * @returns {string|null} The matching header name or null.
 */
const findColumn = (headers, possibleNames) => {
  if (!headers || !possibleNames) return null;
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim().replace(/\s+/g, ' '));
  
  // 1. Exact match (case-insensitive)
  for (const name of possibleNames) {
    const n = name.toLowerCase().trim().replace(/\s+/g, ' ');
    const idx = normalizedHeaders.indexOf(n);
    if (idx !== -1) return headers[idx];
  }

  // 2. Contains match (header includes alias, e.g. "Np (STB)" includes "Np")
  // We prioritize longer aliases to avoid false positives (e.g. matching "P" in "Np")
  const sortedAliases = [...possibleNames].sort((a, b) => b.length - a.length);
  
  for (const name of sortedAliases) {
    const n = name.toLowerCase().trim();
    // Skip very short aliases for partial matching to avoid noise
    if (n.length < 2) continue; 
    
    const idx = normalizedHeaders.findIndex(h => h.includes(n));
    if (idx !== -1) return headers[idx];
  }

  return null;
};

/**
 * Detects the file type based on column headers.
 * Returns the type with the highest confidence score.
 */
export const detectFileType = (csvData) => {
  if (!csvData || csvData.length === 0) return 'unknown';
  const headers = Object.keys(csvData[0]);
  
  const scores = {
    production: 0,
    pressure: 0,
    pvt: 0,
    contacts: 0
  };

  // Production scoring
  if (findColumn(headers, HEADER_ALIASES.production.date)) scores.production += 2;
  if (findColumn(headers, HEADER_ALIASES.production.np)) scores.production += 3; // Critical
  if (findColumn(headers, HEADER_ALIASES.production.gp)) scores.production += 2;
  if (findColumn(headers, HEADER_ALIASES.production.wp)) scores.production += 1;

  // Pressure scoring
  if (findColumn(headers, HEADER_ALIASES.pressure.date)) scores.pressure += 2;
  if (findColumn(headers, HEADER_ALIASES.pressure.pr)) scores.pressure += 3; // Critical
  if (findColumn(headers, HEADER_ALIASES.pressure.pwf)) scores.pressure += 2;

  // PVT scoring
  if (findColumn(headers, HEADER_ALIASES.pvt.pressure)) scores.pvt += 3; // Critical
  if (findColumn(headers, HEADER_ALIASES.pvt.bo)) scores.pvt += 2;
  if (findColumn(headers, HEADER_ALIASES.pvt.rs)) scores.pvt += 2;
  // Negative score if Date exists (PVT usually doesn't have dates, unlike others)
  if (findColumn(headers, ['date', 'time'])) scores.pvt -= 5; 

  // Contacts scoring
  if (findColumn(headers, HEADER_ALIASES.contacts.date)) scores.contacts += 2;
  if (findColumn(headers, HEADER_ALIASES.contacts.goc)) scores.contacts += 3; // Critical
  if (findColumn(headers, HEADER_ALIASES.contacts.owc)) scores.contacts += 3; // Critical

  // Find winner
  let bestType = 'unknown';
  let maxScore = 3; // Minimum threshold

  for (const [type, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestType = type;
    }
  }

  return bestType;
};

const cleanNumber = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  // Remove commas, handle scientific notation if needed
  const cleaned = String(val).replace(/,/g, '').trim();
  if (cleaned === '') return 0;
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

const parseDate = (val) => {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0]; // YYYY-MM-DD
};

// --- Parsing Functions ---

export const parseProductionHistory = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy', // Skip empty lines robustly
      complete: (results) => {
        const raw = results.data;
        if (!raw || raw.length === 0) {
          return reject(new Error("File is empty or could not be parsed."));
        }

        const headers = Object.keys(raw[0]);
        const cols = {
          date: findColumn(headers, HEADER_ALIASES.production.date),
          np: findColumn(headers, HEADER_ALIASES.production.np),
          gp: findColumn(headers, HEADER_ALIASES.production.gp),
          wp: findColumn(headers, HEADER_ALIASES.production.wp),
          wc: findColumn(headers, HEADER_ALIASES.production.wc),
          rp: findColumn(headers, HEADER_ALIASES.production.rp),
          comments: findColumn(headers, HEADER_ALIASES.production.comments)
        };

        // Validation
        if (!cols.date) return reject(new Error("Missing required column: Date"));
        if (!cols.np && !cols.gp) return reject(new Error("Missing required columns: Np (Cumulative Oil) or Gp (Cumulative Gas)"));

        const parsed = { dates: [], Np: [], Gp: [], Wp: [], Wc: [], Rp: [], comments: [] };
        
        raw.forEach(row => {
          const d = parseDate(row[cols.date]);
          if (d) { // Skip rows with invalid dates
            parsed.dates.push(d);
            parsed.Np.push(cleanNumber(row[cols.np]));
            parsed.Gp.push(cleanNumber(row[cols.gp]));
            parsed.Wp.push(cleanNumber(row[cols.wp]));
            parsed.Wc.push(cleanNumber(row[cols.wc]));
            parsed.Rp.push(cleanNumber(row[cols.rp]));
            parsed.comments.push(row[cols.comments] || '');
          }
        });
        
        resolve(parsed);
      },
      error: (err) => reject(err)
    });
  });
};

export const parsePressureData = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        const raw = results.data;
        if (!raw || raw.length === 0) {
          return reject(new Error("File is empty."));
        }

        const headers = Object.keys(raw[0]);
        const cols = {
          date: findColumn(headers, HEADER_ALIASES.pressure.date),
          pr: findColumn(headers, HEADER_ALIASES.pressure.pr),
          pwf: findColumn(headers, HEADER_ALIASES.pressure.pwf),
          testType: findColumn(headers, HEADER_ALIASES.pressure.testType)
        };

        if (!cols.date) return reject(new Error("Missing required column: Date"));
        if (!cols.pr) return reject(new Error("Missing required column: Reservoir Pressure (Pr)"));

        const parsed = { dates: [], Pr: [], Pwf: [], testType: [] };
        raw.forEach(row => {
          const d = parseDate(row[cols.date]);
          if (d) {
            parsed.dates.push(d);
            parsed.Pr.push(cleanNumber(row[cols.pr]));
            parsed.Pwf.push(cleanNumber(row[cols.pwf]));
            parsed.testType.push(row[cols.testType] || 'Unknown');
          }
        });
        resolve(parsed);
      },
      error: (err) => reject(err)
    });
  });
};

export const parsePVTData = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        const raw = results.data;
        if (!raw || raw.length === 0) {
          return reject(new Error("File is empty."));
        }

        const headers = Object.keys(raw[0]);
        const cols = {
          pressure: findColumn(headers, HEADER_ALIASES.pvt.pressure),
          bo: findColumn(headers, HEADER_ALIASES.pvt.bo),
          bg: findColumn(headers, HEADER_ALIASES.pvt.bg),
          rs: findColumn(headers, HEADER_ALIASES.pvt.rs),
          rv: findColumn(headers, HEADER_ALIASES.pvt.rv),
          mu_o: findColumn(headers, HEADER_ALIASES.pvt.mu_o),
          mu_g: findColumn(headers, HEADER_ALIASES.pvt.mu_g)
        };

        if (!cols.pressure) return reject(new Error("Missing required column: Pressure"));
        if (!cols.bo && !cols.bg) return reject(new Error("Missing required columns: Bo (Oil FVF) or Bg (Gas FVF)"));

        const parsed = { pressure: [], Bo: [], Bg: [], Rs: [], Rv: [], mu_o: [], mu_g: [] };
        raw.forEach(row => {
          const p = cleanNumber(row[cols.pressure]);
          // PVT tables might have 0 pressure row, allow it if needed, but usually > 0
          if (row[cols.pressure] !== undefined && row[cols.pressure] !== '') {
            parsed.pressure.push(p);
            parsed.Bo.push(cleanNumber(row[cols.bo]));
            parsed.Bg.push(cleanNumber(row[cols.bg]));
            parsed.Rs.push(cleanNumber(row[cols.rs]));
            parsed.Rv.push(cleanNumber(row[cols.rv]));
            parsed.mu_o.push(cleanNumber(row[cols.mu_o]));
            parsed.mu_g.push(cleanNumber(row[cols.mu_g]));
          }
        });
        resolve(parsed);
      },
      error: (err) => reject(err)
    });
  });
};

export const parseContactObservations = async (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: 'greedy',
      complete: (results) => {
        const raw = results.data;
        if (!raw || raw.length === 0) {
          return reject(new Error("File is empty."));
        }

        const headers = Object.keys(raw[0]);
        const cols = {
          date: findColumn(headers, HEADER_ALIASES.contacts.date),
          goc: findColumn(headers, HEADER_ALIASES.contacts.goc),
          owc: findColumn(headers, HEADER_ALIASES.contacts.owc),
          method: findColumn(headers, HEADER_ALIASES.contacts.method)
        };

        if (!cols.date) return reject(new Error("Missing required column: Date"));
        if (!cols.goc && !cols.owc) return reject(new Error("Missing required columns: GOC or OWC"));

        const parsed = { dates: [], measuredGOC: [], measuredOWC: [], method: [] };
        raw.forEach(row => {
          const d = parseDate(row[cols.date]);
          if (d) {
            parsed.dates.push(d);
            parsed.measuredGOC.push(cleanNumber(row[cols.goc]));
            parsed.measuredOWC.push(cleanNumber(row[cols.owc]));
            parsed.method.push(row[cols.method] || 'Observation');
          }
        });
        resolve(parsed);
      },
      error: (err) => reject(err)
    });
  });
};