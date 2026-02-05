import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const exportData = (format, data, filename = 'export') => {
    switch (format) {
        case 'CSV':
            const csvContent = convertToCSV(data);
            downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
            break;
        case 'JSON':
            const jsonContent = JSON.stringify(data, null, 2);
            downloadFile(jsonContent, `${filename}.json`, 'application/json');
            break;
        case 'LAS':
            const lasContent = convertToLAS(data);
            downloadFile(lasContent, `${filename}.las`, 'text/plain');
            break;
        case 'Excel':
            exportToExcel(data, filename);
            break;
        default:
            console.warn('Unsupported format:', format);
    }
};

const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type });
    saveAs(blob, filename);
};

const convertToCSV = (data) => {
    // Simplified CSV converter assuming array of objects
    if (!Array.isArray(data) || data.length === 0) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
};

const convertToLAS = (data) => {
    // Simplified LAS 2.0 writer mock
    return `~VERSION INFORMATION
 VERS.                 2.0 :   CWLS LOG ASCII STANDARD - VERSION 2.0
 WRAP.                  NO :   ONE LINE PER DEPTH STEP
~WELL INFORMATION
 WELL.     MOCK WELL       :
 DATE.     ${new Date().toLocaleDateString()} :
~CURVE INFORMATION
 DEPT.FT                   :   1  DEPTH
 PP.PPG                    :   2  PORE PRESSURE
 FG.PPG                    :   3  FRACTURE GRADIENT
~ASCII LOG DATA
 1000.0   9.0   12.0
 1050.0   9.1   12.1
 1100.0   9.2   12.2
`;
};

const exportToExcel = (data, filename) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, `${filename}.xlsx`);
};