import { jsPDF } from 'jspdf';
    import 'jspdf-autotable';
    import Papa from 'papaparse';
    import { saveAs } from 'file-saver';

    export const exportFlowAssuranceCSV = (results, inputs) => {
        const { profiles } = results;
        const csvData = profiles.ptProfile.map((row, index) => {
            const riskRow = profiles.riskProfile[index];
            return {
                'Distance (ft)': row.distance,
                'Pressure (psia)': row.pressure.toFixed(2),
                'Temperature (°F)': row.temperature.toFixed(2),
                'Hydrate Temp (°F)': row.hydrateTemp.toFixed(2),
                'WAT (°F)': row.waxTemp.toFixed(2),
                'Hydrate Risk': riskRow.hydrateRisk.toFixed(3),
                'Wax Risk': riskRow.waxRisk.toFixed(3),
                'Corrosion Risk': riskRow.corrosionRisk.toFixed(3),
                'Total Risk': riskRow.totalRisk.toFixed(3),
            };
        });

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${inputs.projectName}_flow_assurance.csv`);
    };


    export const exportFlowAssurancePDF = (results, inputs) => {
        const doc = new jsPDF();
        const { kpis, profiles, recommendations, alerts } = results;

        doc.setFontSize(18);
        doc.text(`Flow Assurance Report: ${inputs.projectName}`, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Analysis Date: ${new Date().toLocaleDateString()}`, 14, 28);
        
        doc.setFontSize(14);
        doc.text("Key Performance Indicators", 14, 40);
        doc.autoTable({
            startY: 45,
            head: [['Metric', 'Value', 'Unit']],
            body: [
                ['Overall Risk', kpis.overallRisk, ''],
                ['Highest Risk Factor', kpis.highestRiskFactor, ''],
                ['Estimated Mitigation Cost', kpis.mitigationCost, '$/day'],
            ],
            theme: 'striped',
        });
        
        let finalY = doc.lastAutoTable.finalY + 10;

        doc.setFontSize(14);
        doc.text("AI-Driven Recommendations", 14, finalY);
        doc.autoTable({
            startY: finalY + 5,
            head: [['Recommendation', 'Value', 'Unit']],
            body: [
                ['Inhibitor Type', recommendations.inhibitorType, ''],
                ['Dosage', recommendations.dosage, 'ppm'],
                ['Primary Action', recommendations.action, ''],
            ],
            theme: 'striped',
        });

        finalY = doc.lastAutoTable.finalY + 10;
        
        if(alerts.length > 0) {
            doc.setFontSize(14);
            doc.text("Active Alerts Log", 14, finalY);
            doc.autoTable({
                startY: finalY + 5,
                head: [['Time', 'Location', 'Risk Type', 'Severity', 'Action']],
                body: alerts.map(a => [a.timestamp, a.location, a.riskType, a.severity, a.action]),
                theme: 'striped',
            });
        }
        
        doc.save(`${inputs.projectName}_flow_assurance_report.pdf`);
    };