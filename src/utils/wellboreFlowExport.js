import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export const exportWellboreFlowCSV = (results, inputs) => {
    const { timeSeriesProfiles } = results;
    let allData = [];

    timeSeriesProfiles.forEach(timeStep => {
        timeStep.profile.forEach(profilePoint => {
            allData.push({
                'Time (min)': timeStep.time.toFixed(2),
                'Depth (ft)': profilePoint.depth.toFixed(2),
                'Pressure (psia)': profilePoint.pressure.toFixed(2),
                'Temperature (°F)': profilePoint.temperature.toFixed(2),
                'Liquid Holdup': profilePoint.holdup.toFixed(3),
            });
        });
    });

    const csv = Papa.unparse(allData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${inputs.projectName}_transient_simulation.csv`);
};


export const exportWellboreFlowPDF = (results, inputs) => {
    const doc = new jsPDF();
    const { slugReport, solidsReport } = results;
    const finalProfile = results.timeSeriesProfiles[results.timeSeriesProfiles.length - 1];

    doc.setFontSize(18);
    doc.text(`Wellbore Flow Simulation Report: ${inputs.projectName}`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Simulation Type: ${inputs.simulationType} | Duration: ${inputs.simulationTime} min`, 14, 28);
    
    // --- Summary KPIs ---
    doc.setFontSize(14);
    doc.text("Final State Summary", 14, 40);
    doc.autoTable({
        startY: 45,
        head: [['Metric', 'Value', 'Unit']],
        body: [
            ['Wellhead Pressure', finalProfile.wellhead.pressure.toFixed(1), 'psia'],
            ['Wellhead Temperature', finalProfile.wellhead.temperature.toFixed(1), '°F'],
            ['Wellhead Liquid Holdup', finalProfile.wellhead.holdup.toFixed(2), ''],
        ],
        theme: 'striped',
    });
    
    let finalY = doc.lastAutoTable.finalY + 10;

    // --- Slug Report ---
    doc.setFontSize(14);
    doc.text("Slug Analysis Report", 14, finalY);
    doc.autoTable({
        startY: finalY + 5,
        body: [
            ['Slug Flow Regime', slugReport.flowRegime],
            ['Average Slug Frequency', `${slugReport.avgFrequency.toFixed(2)} /min`],
            ['Max Slug Volume', `${slugReport.maxSlugVolume.toFixed(1)} bbl`],
            ['Max Slug Velocity', `${slugReport.maxSlugVelocity.toFixed(1)} ft/s`],
        ],
        theme: 'grid',
    });

    finalY = doc.lastAutoTable.finalY + 10;

    // --- Solids Report ---
    doc.setFontSize(14);
    doc.text("Solids Transport Report", 14, finalY);
    doc.autoTable({
        startY: finalY + 5,
        body: [
            ['Sand Settling Velocity', `${solidsReport.settlingVelocity.toFixed(2)} ft/s`],
            ['Max Deposition Rate', `${solidsReport.maxDepositionRate.toFixed(2)} lb/hr`],
            ['Deposition Location (MD)', `${solidsReport.maxDepositionDepth} ft`],
            ['Erosion Risk', solidsReport.erosionRisk],
        ],
        theme: 'grid',
    });
    
    doc.save(`${inputs.projectName}_simulation_report.pdf`);
};