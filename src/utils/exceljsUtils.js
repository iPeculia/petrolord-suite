import ExcelJS from "exceljs";

/**
 * Download a Blob as a file
 */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Convert array-of-objects to worksheet
 * @param {ExcelJS.Workbook} wb
 * @param {string} name
 * @param {Array<Record<string, any>>} rows
 * @param {Array<{header: string, key: string, width?: number}>} [columns]
 */
export const addJsonSheet = (wb, name, rows, columns) => {
  const ws = wb.addWorksheet(name);

  const inferredKeys =
    rows?.length ? Object.keys(rows[0]) : (columns ? columns.map(c => c.key) : []);

  ws.columns =
    columns?.length
      ? columns.map(c => ({ header: c.header, key: c.key, width: c.width ?? 22 }))
      : inferredKeys.map(k => ({ header: k, key: k, width: 22 }));

  if (rows?.length) ws.addRows(rows);

  // Basic header styling
  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: "middle", horizontal: "left", wrapText: true };

  // Wrap cells
  ws.eachRow((row) => {
    row.alignment = { vertical: "top", wrapText: true };
  });

  return ws;
};

/**
 * Convert array-of-arrays to worksheet
 * @param {ExcelJS.Workbook} wb
 * @param {string} name
 * @param {any[][]} aoa
 */
export const addAoaSheet = (wb, name, aoa) => {
  const ws = wb.addWorksheet(name);
  aoa.forEach((r) => ws.addRow(r));

  const headerRow = ws.getRow(1);
  headerRow.font = { bold: true };
  headerRow.alignment = { vertical: "middle", wrapText: true };

  ws.columns?.forEach((c) => (c.width = c.width ?? 22));
  ws.eachRow((row) => (row.alignment = { vertical: "top", wrapText: true }));

  return ws;
};

/**
 * Create & download an .xlsx from workbook
 */
export const writeWorkbookToXlsxDownload = async (wb, filename = "export.xlsx") => {
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  downloadBlob(blob, filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`);
};

/**
 * Read an uploaded .xlsx File into ExcelJS workbook
 * @param {File} file
 */
export const readXlsxFileToWorkbook = async (file) => {
  const wb = new ExcelJS.Workbook();
  const buf = await file.arrayBuffer();
  await wb.xlsx.load(buf);
  return wb;
};

/**
 * Convert first sheet to array-of-objects (header row = first row)
 * @param {ExcelJS.Workbook} wb
 * @param {number} [sheetIndex=1] ExcelJS sheets are 1-based with getWorksheet(n)
 */
export const workbookSheetToJson = (wb, sheetIndex = 1) => {
  const ws = wb.getWorksheet(sheetIndex);
  if (!ws) return [];

  const headerRow = ws.getRow(1);
  const headers = headerRow.values
    .slice(1)
    .map((h) => String(h ?? "").trim());

  const out = [];
  ws.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    const obj = {};
    headers.forEach((h, i) => {
      obj[h || `col_${i + 1}`] = row.getCell(i + 1).value ?? "";
    });
    // skip empty rows
    const hasAny = Object.values(obj).some(v => String(v ?? "").trim() !== "");
    if (hasAny) out.push(obj);
  });

  return out;
};
