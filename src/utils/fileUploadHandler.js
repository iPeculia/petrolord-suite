import * as XLSX from 'xlsx';
import Papa from 'papaparse';

/**
 * Reads file content based on type
 * @param {File} file 
 * @returns {Promise<string|ArrayBuffer>}
 */
export const readFileContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const isBinary = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.las');
    
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);

    if (isBinary) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsText(file);
    }
  });
};

/**
 * Parses Excel file buffer
 * @param {ArrayBuffer} buffer 
 * @returns {Array<Object>} Array of row objects
 */
export const parseExcel = (buffer) => {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(worksheet);
};

/**
 * Parses CSV text
 * @param {string} text 
 * @returns {Promise<Array<Object>>} Array of row objects
 */
export const parseCSV = (text) => {
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error)
    });
  });
};