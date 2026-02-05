import Papa from 'papaparse';
import * as XLSX from 'xlsx';

// Basic LAS 2.0 Parser
const parseLAS = (content) => {
    const lines = content.split('\n');
    let section = null;
    const curves = [];
    const data = [];
    const headerMeta = {};

    for (let line of lines) {
        line = line.trim();
        if (!line || line.startsWith('#')) continue;

        if (line.startsWith('~')) {
            if (line.toUpperCase().includes('~CURVE')) section = 'CURVE';
            else if (line.toUpperCase().includes('~A')) section = 'DATA';
            else if (line.toUpperCase().includes('~WELL')) section = 'WELL';
            else section = 'OTHER';
            continue;
        }

        if (section === 'CURVE') {
            const parts = line.split(/[:\s]+/).filter(Boolean);
            if(parts.length > 0) curves.push(parts[0]);
        } else if (section === 'WELL') {
            // Very basic meta parsing
            const parts = line.split(':');
            if(parts.length > 1) {
                 const key = parts[0].split('.')[0].trim();
                 headerMeta[key] = parts[1].trim();
            }
        } else if (section === 'DATA') {
            const values = line.split(/\s+/).map(Number);
            const row = {};
            curves.forEach((curve, idx) => {
                row[curve] = values[idx];
            });
            if(Object.keys(row).length > 0) data.push(row);
        }
    }
    return { data, curves, meta: headerMeta };
};

// File Parser Factory
export const parseFile = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const extension = file.name.split('.').pop().toLowerCase();

        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let result = { data: [], curves: [], meta: {} };

                if (extension === 'las') {
                    result = parseLAS(content);
                } else if (extension === 'csv' || extension === 'txt') {
                    const parsed = Papa.parse(content, { header: true, dynamicTyping: true, skipEmptyLines: true });
                    result.data = parsed.data;
                    result.curves = parsed.meta.fields;
                } else if (extension === 'xlsx' || extension === 'xls') {
                    const workbook = XLSX.read(content, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet);
                    result.data = jsonData;
                    if(jsonData.length > 0) result.curves = Object.keys(jsonData[0]);
                } else if (extension === 'json') {
                    const parsed = JSON.parse(content);
                    // Assume structure { data: [], curves: [], meta: {} }
                    if(parsed.data) result = parsed;
                    else {
                        result.data = parsed;
                        if(parsed.length > 0) result.curves = Object.keys(parsed[0]);
                    }
                } else {
                    reject(new Error(`Unsupported file extension: .${extension}`));
                }

                resolve(result);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = () => reject(new Error('File reading failed'));

        if (extension === 'xlsx' || extension === 'xls') {
            reader.readAsBinaryString(file);
        } else {
            reader.readAsText(file);
        }
    });
};