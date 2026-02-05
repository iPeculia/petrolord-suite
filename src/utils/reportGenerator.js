import { generatePDFReport } from './pdfReportBuilder';
import { generatePresentation } from './presentationBuilder';

export const generateReport = async (type, data, options) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (type === 'pdf') {
        return generatePDFReport(data, options);
    } else if (type === 'pptx') {
        return generatePresentation(data, options);
    }
    
    throw new Error(`Unsupported report type: ${type}`);
};