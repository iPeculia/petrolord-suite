import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, List, HardHat, FileText, Replace } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useToast } from "@/components/ui/use-toast";

const DeliverablesGenerator = () => {
    const { toast } = useToast();

    const generatePdf = (type) => {
        const doc = new jsPDF();
        const today = new Date().toLocaleDateString();

        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text(`Facility Network Hydraulics - ${type}`, 14, 22);
        doc.setFontSize(11);
        doc.text(`Generated on: ${today}`, 14, 28);
        
        let tableData;
        let tableHeaders;
        let fileName;

        switch(type) {
            case 'Line List':
                tableHeaders = [["Tag", "Service", "From", "To", "Size (in)", "Spec", "MAOP (psi)", "Design T (°F)"]];
                tableData = [["PL-101", "Multiphase Production", "Wellhead A", "Manifold 1", "6.065", "API 5L X52", "1480", "150"]];
                fileName = 'Line_List.pdf';
                break;
            case 'MTO Estimate':
                tableHeaders = [["Item", "Description", "Size (in)", "Grade", "Quantity", "Unit"]];
                tableData = [
                    ["Pipe", "Line Pipe, SMLS", "6", "API 5L X52", "5000", "ft"],
                    ["Flange", "Weld Neck, RF", "6", "A105", "10", "ea"],
                    ["Valve", "Ball Valve, RF", "6", "A216 WCB", "4", "ea"],
                ];
                fileName = 'MTO_Estimate.pdf';
                break;
            case 'Summary Report':
                 doc.autoTable({
                    startY: 35,
                    head: [['Parameter', 'Value', 'Unit/Status']],
                    body: [
                        ['Pipe OD', '12.75', 'in'],
                        ['Wall Thickness (Nominal)', '0.358', 'in'],
                        ['MAOP', '1480', 'psi'],
                        ['Flow Regime', 'Intermittent', ''],
                        ['Liquid Holdup', '0.452', ''],
                        ['Pigging Bend Radius Check', 'PASS', '60" > 63.75" min'],
                    ],
                    theme: 'grid',
                    headStyles: { fillColor: [41, 128, 185] },
                });
                fileName = 'Summary_Report.pdf';
                break;
            case 'Pigging Plan':
                doc.autoTable({
                    startY: 35,
                    head: [['Parameter', 'Value', 'Recommendation/Status']],
                    body: [
                        ['Bend Radius Check', 'FAIL', 'Actual: 60 in, Min. Required: 63.75 in (5D)'],
                        ['Expected Pig Velocity', '10 ft/s', 'ACCEPTABLE: Within 3-15 ft/s ideal range'],
                        ['Launcher/Receiver Length', '~1.9 ft pig + 1.1 ft handling', 'Recommended total length: ~3.0 ft'],
                        ['Pigging Frequency', 'Monthly (initial)', 'Adjust based on debris analysis after first runs'],
                    ],
                    theme: 'grid',
                    headStyles: { fillColor: [41, 128, 185] },
                });
                fileName = 'Pigging_Plan.pdf';
                break;
            default:
                return;
        }

        if (type !== 'Summary Report' && type !== 'Pigging Plan') {
            doc.autoTable({
                startY: 35,
                head: tableHeaders,
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [41, 128, 185] },
            });
        }
        
        doc.save(fileName);
        toast({
            title: "PDF Generated!",
            description: `${fileName} has been downloaded.`,
        });
    };

    const ActionCard = ({ icon: Icon, title, description, buttonText, onClick, colorClass }) => (
        <Card className="bg-slate-900/70 border-slate-700 backdrop-blur-sm text-center transform hover:-translate-y-2 transition-transform duration-300">
            <CardHeader className="flex flex-col items-center">
                <div className={`p-4 bg-gradient-to-br ${colorClass} rounded-full mb-4`}>
                    <Icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-white">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-slate-400 mb-6 h-10">{description}</p>
                <Button onClick={onClick} className="w-full bg-slate-700 hover:bg-slate-600">
                    <FileDown className="mr-2 h-4 w-4" /> {buttonText}
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ActionCard 
                    icon={List}
                    title="Line List"
                    description="Generate a standard process line list for the designed pipeline."
                    buttonText="Export Line List"
                    onClick={() => generatePdf('Line List')}
                    colorClass="from-blue-500 to-cyan-500"
                />
                <ActionCard 
                    icon={HardHat}
                    title="MTO Estimate"
                    description="Create a preliminary Material Take-Off for cost estimation."
                    buttonText="Export MTO"
                    onClick={() => generatePdf('MTO Estimate')}
                    colorClass="from-orange-500 to-amber-500"
                />
                <ActionCard 
                    icon={Replace}
                    title="Pigging Plan"
                    description="Export a detailed plan covering pigging feasibility and logistics."
                    buttonText="Export Pigging Plan"
                    onClick={() => generatePdf('Pigging Plan')}
                    colorClass="from-purple-500 to-pink-500"
                />
                <ActionCard 
                    icon={FileText}
                    title="Summary Report"
                    description="Compile all key design parameters and results into a single document."
                    buttonText="Export Summary"
                    onClick={() => generatePdf('Summary Report')}
                    colorClass="from-green-500 to-emerald-500"
                />
            </div>
            <div className="mt-8 text-center text-slate-500">
                <p>All reports are generated with sample data. Customizations can be added!</p>
            </div>
        </motion.div>
    );
};

export default DeliverablesGenerator;