import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

// --- Helper: Format Date ---
const formatDate = (date) => new Date(date).toLocaleString();

// --- 1. LAS Export ---
export const exportToLAS = (well) => {
    if (!well || !well.data) return null;
    
    let content = `~VERSION INFORMATION\n VERS.   2.0 :   CWLS LOG ASCII STANDARD - VERSION 2.0\n WRAP.    NO :   ONE LINE PER DEPTH STEP\n`;
    
    content += `~WELL INFORMATION\n`;
    content += `STRT.M      ${well.depthRange.min.toFixed(4)} : START DEPTH\n`;
    content += `STOP.M      ${well.depthRange.max.toFixed(4)} : STOP DEPTH\n`;
    content += `STEP.M      ${well.statistics.step.toFixed(4)} : STEP\n`;
    content += `NULL.       -999.25 : NULL VALUE\n`;
    content += `COMP.       ${well.header['COMP']?.value || 'COMPANY'} : COMPANY\n`;
    content += `WELL.       ${well.name} : WELL\n`;
    content += `FLD .       ${well.header['FLD']?.value || 'FIELD'} : FIELD\n`;
    content += `LOC .       ${well.header['LOC']?.value || 'LOCATION'} : LOCATION\n`;
    content += `SRVC.       PETROPHYSICS ESTIMATOR : SERVICE COMPANY\n`;
    content += `DATE.       ${new Date().toDateString()} : LOG DATE\n`;

    content += `~CURVE INFORMATION\n`;
    const curveKeys = Object.keys(well.data[0]).filter(k => k !== 'LITH_CODE' && k !== 'FLUID_CODE'); 
    curveKeys.forEach(key => {
        let unit = '';
        if (key === 'DEPTH') unit = 'M';
        else if (key === 'PHIE' || key === 'SW' || key === 'VSH') unit = 'V/V';
        else if (key === 'PERM') unit = 'MD';
        else {
            const originalCurve = well.curves ? well.curves.find(c => well.curveMap[key] === c.mnemonic) : null;
            unit = originalCurve ? originalCurve.unit : '';
        }
        content += `${key.padEnd(8)}.${unit.padEnd(4)} : ${key}\n`;
    });

    content += `~ASCII LOG DATA\n`;
    well.data.forEach(row => {
        const line = curveKeys.map(key => {
            const val = row[key];
            return (val === null || isNaN(val)) ? '-999.25' : val.toFixed(4);
        }).join('  ');
        content += line + '\n';
    });

    return content; // Return string content for zip or file saving
};

// --- 2. Excel Export (Comprehensive) ---
export const generateExcelWorkbook = (well, project, markers, reserves, qc) => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Well Header
    const headerData = [
        ['Project', project?.name || 'N/A'],
        ['Well Name', well.name],
        ['API', well.api],
        ['Export Date', formatDate(new Date())],
        ['Top Depth', well.depthRange.min],
        ['Bottom Depth', well.depthRange.max],
        ['Step', well.statistics.step],
        [],
        ['Mnemonic', 'Value', 'Description'],
        ...Object.entries(well.header || {}).map(([k, v]) => [k, v.value, v.description])
    ];
    const wsHeader = XLSX.utils.aoa_to_sheet(headerData);
    XLSX.utils.book_append_sheet(wb, wsHeader, "Header");

    // Sheet 2: Log Data
    const wsData = XLSX.utils.json_to_sheet(well.data);
    XLSX.utils.book_append_sheet(wb, wsData, "Log Data");

    // Sheet 3: Markers
    if (markers && markers.length > 0) {
        const markerData = markers.map(m => ({ Name: m.name, Depth: m.depth, Type: m.type }));
        const wsMarkers = XLSX.utils.json_to_sheet(markerData);
        XLSX.utils.book_append_sheet(wb, wsMarkers, "Markers");
    }

    // Sheet 4: Reserves
    if (reserves && reserves.length > 0) {
        const resData = reserves.map(r => ({
            Zone: r.name,
            Top: r.topDepth,
            Base: r.baseDepth,
            OOIP: r.volumes?.ooip,
            OGIP: r.volumes?.ogip,
            Reserves: r.volumes?.reserves,
            NetPay: r.stats?.payThickness,
            AvgPhi: r.stats?.avgPhi,
            AvgSw: r.stats?.avgSw
        }));
        const wsReserves = XLSX.utils.json_to_sheet(resData);
        XLSX.utils.book_append_sheet(wb, wsReserves, "Reserves");
    }

    // Sheet 5: QC Stats
    if (qc && qc.stats) {
        const qcRows = [['Score', qc.score], [], ['Curve', 'Min', 'Max', 'Mean', 'Outliers']];
        Object.entries(qc.stats).forEach(([curve, stats]) => {
            qcRows.push([curve, stats.min, stats.max, stats.mean, stats.outliers]);
        });
        const wsQC = XLSX.utils.aoa_to_sheet(qcRows);
        XLSX.utils.book_append_sheet(wb, wsQC, "QC Stats");
    }

    return wb;
};

// --- 3. PDF Report Generation ---
export const generatePDFReport = (well, project, markers, reserves, qc, config = {}) => {
    const doc = new jsPDF();
    const margin = 15;
    let yPos = 20;
    const brandColor = config.brandColor || [41, 128, 185]; // Default Blue

    // --- Header ---
    // Optional Logo placeholder
    // if (config.logo) doc.addImage(config.logo, 'PNG', 170, 10, 25, 10);

    doc.setFontSize(22);
    doc.setTextColor(...brandColor);
    doc.text(config.title || "Petrophysical Analysis Report", margin, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Project: ${project?.name || 'N/A'}`, margin, yPos);
    doc.text(`Well: ${well.name} (API: ${well.api || 'N/A'})`, margin + 80, yPos);
    yPos += 6;
    doc.text(`Date: ${formatDate(new Date())}`, margin, yPos);
    doc.text(`Prepared For: ${config.client || 'Internal'}`, margin + 80, yPos);
    yPos += 15;

    doc.setDrawColor(200);
    doc.line(margin, yPos, 210 - margin, yPos);
    yPos += 10;

    // --- 1. Well Summary ---
    if (config.sections?.summary !== false) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("1. Well Summary", margin, yPos);
        yPos += 8;
        
        const summaryData = [
            ["Operator", well.header['COMP']?.value || '-'],
            ["Location", well.header['LOC']?.value || '-'],
            ["Field", well.header['FLD']?.value || '-'],
            ["Depth Range", `${well.depthRange.min} - ${well.depthRange.max} ${well.depthUnit || 'm'}`],
            ["Total Curves", well.data.length > 0 ? Object.keys(well.data[0]).length : 0],
            ["Step", well.statistics.step]
        ];

        doc.autoTable({
            startY: yPos,
            head: [['Parameter', 'Value']],
            body: summaryData,
            theme: 'striped',
            headStyles: { fillColor: brandColor },
            margin: { left: margin, right: margin }
        });
        yPos = doc.lastAutoTable.finalY + 15;
    }

    // --- 2. Markers / Stratigraphy ---
    if (config.sections?.markers !== false && markers && markers.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14);
        doc.text("2. Stratigraphy & Markers", margin, yPos);
        yPos += 8;

        const markerRows = markers.map(m => [m.name, m.depth.toFixed(2), m.type]);
        doc.autoTable({
            startY: yPos,
            head: [['Zone Name', 'Depth', 'Type']],
            body: markerRows,
            theme: 'grid',
            headStyles: { fillColor: [52, 73, 94] },
            margin: { left: margin, right: margin }
        });
        yPos = doc.lastAutoTable.finalY + 15;
    }

    // --- 3. Petrophysical Results (Stats) ---
    if (config.sections?.properties !== false) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14);
        doc.text("3. Petrophysical Properties Summary", margin, yPos);
        yPos += 8;

        const calcAvg = (key) => {
            const vals = well.data.map(d => d[key]).filter(v => v != null);
            if (vals.length === 0) return '-';
            return (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(4);
        };

        const propsData = [
            ['Avg Porosity (PHIE)', calcAvg('PHIE')],
            ['Avg Saturation (SW)', calcAvg('SW')],
            ['Avg Permeability (PERM)', calcAvg('PERM')],
            ['Avg Vshale (VSH)', calcAvg('VSH')]
        ];

        doc.autoTable({
            startY: yPos,
            head: [['Property', 'Field Average']],
            body: propsData,
            theme: 'striped',
            headStyles: { fillColor: [46, 204, 113] }, // Green
            margin: { left: margin, right: margin }
        });
        yPos = doc.lastAutoTable.finalY + 15;
    }

    // --- 4. Reserves ---
    if (config.sections?.reserves !== false && reserves && reserves.length > 0) {
        if (yPos > 250) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14);
        doc.text("4. Reserves Estimation", margin, yPos);
        yPos += 8;

        const resRows = reserves.map(r => [
            r.name,
            r.volumes?.ooip ? r.volumes.ooip.toLocaleString(undefined, {maximumFractionDigits:0}) + ' STB' : '-',
            r.volumes?.ogip ? r.volumes.ogip.toLocaleString(undefined, {maximumFractionDigits:0}) + ' MSCF' : '-',
            r.volumes?.reserves ? r.volumes.reserves.toLocaleString(undefined, {maximumFractionDigits:0}) : '-'
        ]);

        doc.autoTable({
            startY: yPos,
            head: [['Zone', 'OOIP', 'OGIP', 'Recoverable']],
            body: resRows,
            theme: 'grid',
            headStyles: { fillColor: [230, 126, 34] }, // Orange
            margin: { left: margin, right: margin }
        });
        yPos = doc.lastAutoTable.finalY + 15;
    }

    // --- 5. QC Report ---
    if (config.sections?.qc !== false && qc) {
        if (yPos > 230) { doc.addPage(); yPos = 20; }
        doc.setFontSize(14);
        doc.text("5. Data Quality Control", margin, yPos);
        yPos += 8;

        doc.setFontSize(12);
        doc.setTextColor(qc.score >= 90 ? 'green' : qc.score >= 70 ? 'orange' : 'red');
        doc.text(`Overall Quality Score: ${qc.score.toFixed(0)}/100`, margin, yPos);
        doc.setTextColor(0);
        yPos += 10;

        const issues = qc.flags.map(f => [f.severity, f.section, f.message]);
        
        if (issues.length > 0) {
            doc.autoTable({
                startY: yPos,
                head: [['Severity', 'Section', 'Issue']],
                body: issues,
                theme: 'plain',
                styles: { fontSize: 8 },
                columnStyles: { 0: { fontStyle: 'bold' } },
                margin: { left: margin, right: margin }
            });
        } else {
            doc.setFontSize(10);
            doc.text("No critical data quality issues detected.", margin, yPos);
        }
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount} - ${config.footer || 'Generated by Petrophysics Estimator'}`, margin, 285);
    }

    return doc;
};

// --- 4. Batch Export (Zip) ---
export const generateBatchExportZip = async (wells, project, exportType = 'las') => {
    const zip = new JSZip();
    
    for (const well of wells) {
        if (exportType === 'las') {
            const content = exportToLAS(well);
            if (content) zip.file(`${well.name}.las`, content);
        } else if (exportType === 'excel') {
             const wb = generateExcelWorkbook(well, project, [], [], null);
             const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
             zip.file(`${well.name}.xlsx`, wbOut);
        } else if (exportType === 'pdf') {
             const doc = generatePDFReport(well, project, [], [], null, { title: `${well.name} Report` });
             const pdfData = doc.output('blob');
             zip.file(`${well.name}.pdf`, pdfData);
        }
    }

    return await zip.generateAsync({ type: 'blob' });
};

// --- 5. Project JSON Export ---
export const exportProjectJSON = (petroState) => {
    const jsonString = JSON.stringify(petroState, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `${petroState.projectName || 'Petrophysics_Project'}_${new Date().toISOString().split('T')[0]}.json`);
};