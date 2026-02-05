import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

export const exportCementingCSV = (results, inputs) => {
    const { ecdProfile, pressureProfile } = results;
    let allData = [];

    const maxLength = Math.max(ecdProfile.length, pressureProfile.length);

    for (let i = 0; i < maxLength; i++) {
        allData.push({
            'ECD Depth (ft)': ecdProfile[i]?.depth?.toFixed(2) || '',
            'ECD (ppg)': ecdProfile[i]?.ecd?.toFixed(3) || '',
            'Pressure Time (min)': pressureProfile[i]?.time || '',
            'Surface Pressure (psi)': pressureProfile[i]?.pressure?.toFixed(0) || '',
        });
    }

    const csv = Papa.unparse(allData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${inputs.projectName}_cementing_simulation.csv`);
};


export const exportCementingPDF = (results, inputs) => {
    const doc = new jsPDF();
    const { summary } = results;

    doc.setFontSize(18);
    doc.text(`Cementing Simulation Report: ${inputs.projectName}`, 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Well: ${inputs.wellName}`, 14, 28);
    
    doc.setFontSize(14);
    doc.text("Job Summary KPIs", 14, 40);
    doc.autoTable({
        startY: 45,
        head: [['Metric', 'Value', 'Unit']],
        body: [
            ['Displacement Efficiency', summary.displacementEfficiency.toFixed(1), '%'],
            ['Max Surface Pressure', summary.maxPressure.toFixed(0), 'psi'],
            ['Total Slurry Volume', summary.totalSlurryVolume.toFixed(0), 'bbl'],
            ['Free Fall Duration', summary.freeFallDuration.toFixed(1), 'min'],
        ],
        theme: 'striped',
    });
    
    let finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.text("Job Inputs", 14, finalY);
    const inputsBody = [
        ['Casing OD', inputs.casingOD, 'in'],
        ['Hole Diameter', inputs.holeDiameter, 'in'],
        ['Shoe Depth', inputs.shoeDepth, 'ft'],
        ['Pump Rate', inputs.pumpRate, 'bpm'],
    ];
    doc.autoTable({
        startY: finalY + 5,
        head: [['Parameter', 'Value', 'Unit']],
        body: inputsBody,
        theme: 'grid',
    });
    
    doc.save(`${inputs.projectName}_cementing_report.pdf`);
};