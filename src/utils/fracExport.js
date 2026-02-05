import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export const exportFracCSV = (results, inputs) => {
    const { treatmentPlot } = results;
    
    const csvData = treatmentPlot.map(point => ({
        'Time (min)': point.time,
        'Pressure (psi)': point.pressure,
        'Rate (bpm)': point.rate,
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${inputs.projectName}_frac_simulation.csv`);
};


export const exportFracPDF = (results, inputs) => {
    const doc = new jsPDF();
    const { summary } = results;

    doc.setFontSize(18);
    doc.text(`Frac & Completion Report: ${inputs.projectName}`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Well: ${inputs.wellName}`, 14, 28);
    
    doc.setFontSize(14);
    doc.text("Job Summary KPIs", 14, 40);
    doc.autoTable({
        startY: 45,
        head: [['Metric', 'Value', 'Unit']],
        body: [
            ['Fracture Half-Length', summary.fracHalfLength.toFixed(0), 'ft'],
            ['Average Conductivity', summary.avgConductivity.toFixed(0), 'mD-ft'],
            ['IP30 Forecast', summary.ip30.toFixed(0), 'bbl/d'],
            ['Total Proppant Pumped', summary.totalProppant.toFixed(1), 'M lbs'],
        ],
        theme: 'striped',
    });
    
    let finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.text("Job Design Inputs", 14, finalY);
    const inputsBody = [
        ['Lateral Length', inputs.lateralLength, 'ft'],
        ['Number of Stages', inputs.stages, ''],
        ['Pump Rate', inputs.pumpRate, 'bpm'],
        ['Fluid System', inputs.fluidSystem, ''],
        ['Proppant Type', inputs.proppantType, ''],
    ];
    doc.autoTable({
        startY: finalY + 5,
        head: [['Parameter', 'Value', 'Unit']],
        body: inputsBody,
        theme: 'grid',
    });
    
    doc.save(`${inputs.projectName}_frac_report.pdf`);
};