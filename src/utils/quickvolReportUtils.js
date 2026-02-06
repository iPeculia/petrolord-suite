import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";

// --- Templates ---

export const REPORT_TEMPLATES = {
  executive: {
    name: "Executive Summary",
    description: "High-level overview of key volumetric findings and risks.",
    sections: [
      { id: "header", type: "header", title: "Report Header" },
      {
        id: "summary_text",
        type: "text",
        title: "Executive Summary",
        content:
          "The volumetric analysis indicates a substantial potential accumulation. Key uncertainties have been identified in the porosity and water saturation parameters.",
      },
      { id: "kpi_summary", type: "kpi-grid", title: "Key Performance Indicators" },
      { id: "risk_summary", type: "risk-matrix", title: "Risk Assessment" },
      { id: "footer", type: "footer", title: "Report Footer" },
    ],
  },
  technical: {
    name: "Technical Report",
    description: "Detailed technical breakdown of methodology and calculations.",
    sections: [
      { id: "header", type: "header", title: "Report Header" },
      {
        id: "methodology",
        type: "text",
        title: "Methodology",
        content:
          "A dual approach using deterministic map-based volumes and probabilistic Monte Carlo simulation (5,000 iterations) was employed to assess range of uncertainty.",
      },
      { id: "input_summary", type: "table-inputs", title: "Input Parameters" },
      { id: "det_results", type: "table-deterministic", title: "Deterministic Results" },
      { id: "prob_dist", type: "chart-histogram", title: "Probabilistic Distribution" },
      { id: "prob_cdf", type: "chart-cdf", title: "Expectation Curve (CDF)" },
      { id: "sensitivity", type: "chart-tornado", title: "Sensitivity Analysis" },
      { id: "footer", type: "footer", title: "Report Footer" },
    ],
  },
  detailed: {
    name: "Detailed Audit Report",
    description: "Comprehensive record including audit trails and validation logs.",
    sections: [
      { id: "header", type: "header", title: "Report Header" },
      { id: "meta", type: "text-meta", title: "Project Metadata" },
      { id: "input_summary", type: "table-inputs", title: "Input Parameters" },
      { id: "validation", type: "validation-log", title: "Data Validation Checks" },
      { id: "det_results", type: "table-deterministic", title: "Deterministic Results" },
      { id: "prob_results", type: "table-probabilistic", title: "Probabilistic Statistics" },
      { id: "all_charts", type: "chart-group", title: "Visualizations" },
      { id: "audit", type: "audit-log", title: "Audit Trail" },
      { id: "footer", type: "footer", title: "Report Footer" },
    ],
  },
};

// --- Generators ---

export const generateReportData = (templateKey, contextData) => {
  const template = REPORT_TEMPLATES[templateKey] || REPORT_TEMPLATES.executive;
  return template.sections.map((s) => ({
    ...s,
    id: `${s.type}_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`,
  }));
};

// --- Helpers ---

const autosizeColumns = (worksheet, min = 12, max = 60) => {
  worksheet.columns.forEach((col) => {
    let best = min;
    col.eachCell({ includeEmpty: true }, (cell) => {
      const v = cell?.value;
      const s =
        v == null
          ? ""
          : typeof v === "string"
            ? v
            : typeof v === "number"
              ? String(v)
              : typeof v === "object" && v?.text
                ? String(v.text)
                : String(v);
      best = Math.max(best, s.length + 2);
    });
    col.width = Math.min(max, Math.max(min, best));
  });
};

const downloadBufferAsFile = (buffer, fileName, mime) => {
  const blob = new Blob([buffer], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// --- Exporters ---

/**
 * Browser-safe Excel export (replaces SheetJS/XLSX).
 * Requires: npm i exceljs
 */
export const exportToExcel = async (data, fileName = "QuickVol_Report.xlsx") => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Petrolord Suite";
  workbook.created = new Date();

  // 1) Summary Sheet
  const wsSummary = workbook.addWorksheet("Summary", {
    views: [{ state: "frozen", ySplit: 3 }],
  });

  wsSummary.addRow(["QuickVol Report", ""]);
  wsSummary.addRow(["Generated At", new Date().toLocaleString()]);
  wsSummary.addRow(["", ""]);
  wsSummary.addRow(["Deterministic STOOIP", data?.mapResults?.stooip ?? "-"]);
  wsSummary.addRow(["Probabilistic P50", data?.stochasticResults?.in_place?.p50 ?? "-"]);
  wsSummary.addRow(["Scenario Count", data?.scenarios?.length ?? 0]);

  // Style title row
  wsSummary.getRow(1).font = { bold: true, size: 14 };
  wsSummary.getRow(1).alignment = { vertical: "middle" };

  // Bold first column labels
  [2, 4, 5, 6].forEach((r) => {
    wsSummary.getCell(`A${r}`).font = { bold: true };
  });

  autosizeColumns(wsSummary);

  // 2) Inputs Sheet
  const wsInputs = workbook.addWorksheet("Inputs", {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  wsInputs.columns = [
    { header: "Parameter", key: "parameter", width: 22 },
    { header: "Distribution", key: "distribution", width: 16 },
    { header: "Values", key: "values", width: 60 },
  ];
  wsInputs.getRow(1).font = { bold: true };

  const inputs = data?.stochasticInputs ?? {};
  Object.entries(inputs).forEach(([key, val]) => {
    if (val && typeof val === "object") {
      wsInputs.addRow({
        parameter: key,
        distribution: val.dist || "triangular",
        values: JSON.stringify(val),
      });
    } else {
      wsInputs.addRow({
        parameter: key,
        distribution: "constant",
        values: val,
      });
    }
  });

  // Wrap long JSON values
  wsInputs.getColumn(3).alignment = { wrapText: true, vertical: "top" };

  // Optional: Deterministic / Probabilistic / Scenarios sheets (safe placeholders)
  // Add your real tables here if you want; this keeps export stable and error-free.

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBufferAsFile(
    buffer,
    fileName,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
};

export const exportToPdf = async (elementId, fileName = "QuickVol_Report.pdf", watermarkText) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const originalStyle = element.style.cssText;
  element.style.width = "1200px";
  element.style.height = "auto";
  element.style.background = "#0f172a";
  element.style.color = "#ffffff";

  const noPrintElements = element.querySelectorAll(".no-print");
  noPrintElements.forEach((el) => (el.style.display = "none"));

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#0f172a",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error("PDF Export failed", error);
    throw error;
  } finally {
    element.style.cssText = originalStyle;
    noPrintElements.forEach((el) => (el.style.display = ""));
  }
};

export const exportToWordMock = (fileName = "QuickVol_Report.doc") => {
  const content = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>QuickVol Report</title></head>
      <body>
        <h1>QuickVol Advanced Report</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
        <hr/>
        <p>
          This is a placeholder for the Word export functionality. In a production environment,
          this would generate a complete .docx file using libraries like 'docx' or server-side generation.
        </p>
      </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", content], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
