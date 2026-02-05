import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export const exportTorqueDragCSV = (results, inputs) => {
    const { scenarios } = results;
    let allData = [];

    Object.entries(scenarios).forEach(([scenarioName, scenarioData]) => {
        scenarioData.forEach(point => {
            allData.push({
                'Scenario': scenarioName,
                'Measured Depth (ft)': point.md.toFixed(2),
                'Pick-up Weight (klbs)': point.pickup.toFixed(2),
                'Slack-off Weight (klbs)': point.slackoff.toFixed(2),
                'Rotary Torque (kft-lbs)': point.torque.toFixed(2),
            });
        });
    });

    const csv = Papa.unparse(allData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${inputs.projectName}_torque_drag_simulation.csv`);
};


export const exportTorqueDragPDF = (results, inputs) => {
    const doc = new jsPDF();
    const { summary } = results;

    doc.setFontSize(18);
    doc.text(`Torque & Drag Report: ${inputs.projectName}`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Well: ${inputs.wellName}`, 14, 28);
    
    doc.setFontSize(14);
    doc.text("Summary KPIs", 14, 40);
    doc.autoTable({
        startY: 45,
        head: [['Metric', 'Value', 'Unit']],
        body: [
            ['Max Hookload', summary.maxHookload.toFixed(1), 'klbs'],
            ['Max Torque', summary.maxTorque.toFixed(1), 'kft-lbs'],
            ['Max Drag', summary.maxDrag.toFixed(1), 'klbs'],
            ['Limits Exceeded?', summary.limitsExceeded ? 'Yes' : 'No', ''],
        ],
        theme: 'striped',
    });
    
    let finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.text("Warnings & Recommendations", 14, finalY);
    
    const warningsBody = summary.warnings.length > 0 
        ? summary.warnings.map(w => [w])
        : [['All predicted values are within safe operating limits.']];

    doc.autoTable({
        startY: finalY + 5,
        body: warningsBody,
        theme: 'grid',
    });
    
    doc.save(`${inputs.projectName}_TD_report.pdf`);
};