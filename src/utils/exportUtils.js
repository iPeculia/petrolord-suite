/**
 * Export utilities for Well Correlation Tool and Project Management
 */
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportAsImage = async (elementId, filename = 'correlation-view.png') => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Export element not found');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#0f172a', // Slate-950
      scale: 2, // Higher resolution
      useCORS: true,
      logging: false
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (error) {
    console.error('Export failed:', error);
  }
};

export const exportAsPDF = async (elementId, filename = 'correlation-report.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#0f172a',
      scale: 2
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
  } catch (error) {
    console.error('PDF Export failed:', error);
  }
};

export const exportDataAsCSV = (data, filename = 'data.csv') => {
  // Generic CSV export
  if (!data || !data.length) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(fieldName => JSON.stringify(row[fieldName])).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToExcel = (data, fileName = 'export.xlsx') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);
};

export const exportToPdf = (columns, data, fileName = 'export.pdf', title = 'Report') => {
  const doc = new jsPDF();
  
  if (title) {
    doc.text(title, 14, 15);
  }

  const tableColumn = columns.map(col => col.header);
  const tableRows = [];

  data.forEach(row => {
    const rowData = columns.map(col => {
      // Handle nested properties if needed
      return row[col.accessor] || ''; 
    });
    tableRows.push(rowData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: title ? 20 : 10,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [22, 163, 74] }, // Green-600
  });

  doc.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);
};

export const exportToGeoJSON = (layers, geoTransform, projectName = 'project') => {
  const features = [];

  const processLayer = (lines, type) => {
    if (!lines) return;
    lines.forEach(line => {
      if (!line.points || line.points.length < 2) return;

      const coordinates = line.points.map(pt => {
        let x = pt[0];
        let y = pt[1];
        if (geoTransform) {
          x = geoTransform.a * pt[0] + geoTransform.c;
          y = geoTransform.e * pt[1] + geoTransform.f;
        }
        return [x, y];
      });

      features.push({
        type: "Feature",
        properties: {
          id: line.id,
          value: line.value,
          type: type
        },
        geometry: {
          type: "LineString",
          coordinates: coordinates
        }
      });
    });
  };

  if (layers.contours) processLayer(layers.contours, 'contour');
  if (layers.faults) processLayer(layers.faults, 'fault');

  const geoJSON = {
    type: "FeatureCollection",
    features: features
  };

  const blob = new Blob([JSON.stringify(geoJSON, null, 2)], { type: "application/geo+json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${projectName}.geojson`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToDXF = (layers, geoTransform, projectName = 'project') => {
    let dxf = "0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n";

    const processLayer = (lines, layerName, color) => {
        if (!lines) return;
        lines.forEach(line => {
            if (!line.points || line.points.length < 2) return;
            
            dxf += "0\nPOLYLINE\n";
            dxf += "8\n" + layerName + "\n"; // Layer
            dxf += "62\n" + color + "\n"; // Color (1=Red, 3=Green)
            dxf += "66\n1\n"; // Vertices follow
            dxf += "10\n0.0\n20\n0.0\n30\n" + (line.value || 0.0) + "\n"; // Elevation

            line.points.forEach(pt => {
                let x = pt[0];
                let y = pt[1];
                if (geoTransform) {
                    x = geoTransform.a * pt[0] + geoTransform.c;
                    y = geoTransform.e * pt[1] + geoTransform.f;
                }
                dxf += "0\nVERTEX\n";
                dxf += "8\n" + layerName + "\n";
                dxf += "10\n" + x + "\n";
                dxf += "20\n" + y + "\n";
                dxf += "30\n" + (line.value || 0.0) + "\n";
            });
            dxf += "0\nSEQEND\n";
        });
    };

    if (layers.contours) processLayer(layers.contours, "CONTOURS", 3); // Green
    if (layers.faults) processLayer(layers.faults, "FAULTS", 1); // Red

    dxf += "0\nENDSEC\n0\nEOF";

    const blob = new Blob([dxf], { type: "application/dxf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName}.dxf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToCSV = (grid, projectName = 'project') => {
    let csvContent = "X,Y,Z\n";
    
    if (grid && grid.x && grid.y && grid.z) {
        // 2D Grid structure
        for (let i = 0; i < grid.y.length; i++) {
            for (let j = 0; j < grid.x.length; j++) {
                const x = grid.x[j];
                const y = grid.y[i];
                const z = grid.z[i][j];
                if (z !== null && z !== undefined && !isNaN(z)) {
                    csvContent += `${x},${y},${z}\n`;
                }
            }
        }
    } else if (Array.isArray(grid)) {
        // Array of objects - delegate to generic CSV export
        exportDataAsCSV(grid, `${projectName}.csv`);
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${projectName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};