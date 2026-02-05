import Papa from 'papaparse';

export function parseAnyAsciiGrid(text) {
  const lines = text.trim().split(/\r?\n/);
  const hdr = {};
  lines.slice(0, 10).forEach(line => {
    const [key, val] = line.trim().split(/\s+/);
    if (/ncols/i.test(key)) hdr.ncols = +val;
    if (/nrows/i.test(key)) hdr.nrows = +val;
    if (/cellsize/i.test(key)) hdr.cellsize = +val;
    if (/xinc/i.test(key)) hdr.xinc = +val;
    if (/yinc/i.test(key)) hdr.yinc = +val;
  });

  const data = [];
  let started = false;
  for (const line of lines) {
    const nums = line.trim().split(/\s+/).map(Number);
    if (nums.every(n => !isNaN(n))) {
      started = true;
      data.push(nums);
    } else if (started) {
      break;
    }
  }

  if (data.length === 0) {
    throw new Error('No grid rows found in the ASCII file.');
  }

  const cols = data[0].length;
  if (!data.every(r => r.length === cols)) {
    throw new Error('Jagged rows detected. All data rows must have the same number of columns.');
  }

  const dx = hdr.xinc ?? hdr.cellsize;
  const dy = hdr.yinc ?? hdr.cellsize;

  if (!dx || !dy) {
    throw new Error('Could not detect cell size from header (CELLSIZE, XINC, YINC).');
  }

  return { data, cell_size_x: dx, cell_size_y: dy };
}

export function parseXyzCsv(text) {
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const { data, errors } = results;

        if (errors.length) {
          const firstError = errors[0];
          reject(new Error(`CSV Parsing Error on row ${firstError.row}: ${firstError.message}`));
          return;
        }
        
        if (data.length < 2) {
            reject(new Error("CSV must contain at least 2 rows of data."));
            return;
        }
        
        if (!data[0].hasOwnProperty('x') || !data[0].hasOwnProperty('y') || !data[0].hasOwnProperty('z')) {
            reject(new Error("CSV file must have 'x', 'y', and 'z' columns."));
            return;
        }

        try {
          const xs = [...new Set(data.map(r => r.x))].sort((a, b) => a - b);
          const ys = [...new Set(data.map(r => r.y))].sort((a, b) => a - b);
          
          if (xs.length < 2 || ys.length < 2) {
              reject(new Error("Insufficient unique X or Y coordinates to form a grid. Need at least 2 of each."));
              return;
          }

          const dx = xs[1] - xs[0];
          const dy = ys[1] - ys[0];
          
          if (dx <= 0 || dy <= 0) {
            reject(new Error("Could not determine a positive cell size from X/Y coordinates."));
            return;
          }

          const grid = ys.map(y => xs.map(x => {
            const rec = data.find(r => r.x === x && r.y === y);
            return rec ? rec.z : NaN;
          }));

          resolve({ data: grid, cell_size_x: dx, cell_size_y: dy });
        } catch (e) {
            reject(new Error(`Error processing CSV data: ${e.message}`));
        }
      },
      error: (error) => {
        reject(new Error(`PapaParse Error: ${error.message}`));
      }
    });
  });
}