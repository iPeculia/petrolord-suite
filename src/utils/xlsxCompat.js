import ExcelJS from "exceljs";

/**
 * Minimal XLSX-compatible surface used across Petrolord Suite.
 * Supported:
 * - utils.book_new()
 * - utils.book_append_sheet(wb, ws, name)
 * - utils.json_to_sheet(data)
 * - utils.aoa_to_sheet(aoa)
 * - writeFile(wb, filename)
 * - read(bufferOrArrayBuffer, { type: 'array' })  // basic parsing
 *
 * Notes:
 * - This is a pragmatic bridge to unblock builds.
 * - It won’t cover every SheetJS feature, only what we typically use.
 */

function makeSheetFromAOA(aoa) {
  return { __type: "aoa", data: Array.isArray(aoa) ? aoa : [] };
}

function makeSheetFromJSON(json) {
  const arr = Array.isArray(json) ? json : [];
  const headers = arr.length ? Object.keys(arr[0]) : [];
  const aoa = [headers, ...arr.map((r) => headers.map((h) => r?.[h] ?? ""))];
  return makeSheetFromAOA(aoa);
}

async function writeWorkbookToArrayBuffer(wb) {
  const workbook = new ExcelJS.Workbook();

  for (const [name, sheet] of wb.__sheets) {
    const ws = workbook.addWorksheet(name);

    if (sheet?.__type === "aoa") {
      sheet.data.forEach((row) => ws.addRow(row));
    } else {
      // unknown sheet shape -> best effort
      ws.addRow(["Unsupported sheet format"]);
    }

    // light formatting
    ws.eachRow((r) => {
      r.eachCell((cell) => {
        cell.alignment = { ...(cell.alignment || {}), wrapText: true, vertical: "top" };
      });
    });
    ws.columns.forEach((col) => {
      col.width = Math.min(60, Math.max(12, (col.header ? String(col.header).length : 12) + 2));
    });
  }

  return workbook.xlsx.writeBuffer();
}

function downloadArrayBuffer(buffer, fileName) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const utils = {
  book_new() {
    return { __sheets: new Map() };
  },
  book_append_sheet(wb, ws, name = "Sheet1") {
    if (!wb?.__sheets) wb.__sheets = new Map();
    wb.__sheets.set(name, ws);
  },
  aoa_to_sheet(aoa) {
    return makeSheetFromAOA(aoa);
  },
  json_to_sheet(data) {
    return makeSheetFromJSON(data);
  },
};

export async function writeFile(wb, fileName = "export.xlsx") {
  const buffer = await writeWorkbookToArrayBuffer(wb);
  downloadArrayBuffer(buffer, fileName);
}

/**
 * Very basic reader for xlsx arraybuffers (for PPFG / imports).
 * Returns a workbook-like object with sheets data in AOA form.
 */
export async function read(arrayBuffer, opts = {}) {
  const type = opts?.type;
  if (type !== "array") {
    throw new Error(`xlsxCompat.read only supports { type: "array" } currently`);
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const wb = utils.book_new();

  workbook.worksheets.forEach((ws) => {
    const aoa = [];
    ws.eachRow({ includeEmpty: true }, (row) => {
      aoa.push(row.values.slice(1).map((v) => (v?.text ? v.text : v ?? "")));
    });
    utils.book_append_sheet(wb, utils.aoa_to_sheet(aoa), ws.name || "Sheet1");
  });

  return wb;
}
