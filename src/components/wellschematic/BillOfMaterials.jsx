import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchematic } from '@/contexts/SchematicContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { X, FileJson, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

const BillOfMaterials = ({ isVisible, onClose, schematicRef }) => {
  const { components } = useSchematic();
  const { toast } = useToast();

  const exportToJson = () => {
    if (components.length === 0) {
      toast({
        title: "Export Failed",
        description: "There are no components to export.",
        variant: "destructive",
      });
      return;
    }
    const dataStr = JSON.stringify({ components }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "well-schematic-bom.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Export Successful",
      description: "Bill of Materials exported as JSON.",
    });
  };

  const exportToPdf = async () => {
    if (components.length === 0) {
      toast({
        title: "Export Failed",
        description: "There are no components to export.",
        variant: "destructive",
      });
      return;
    }

    const canvasElement = schematicRef.current?.getCanvasElement();
    if (!canvasElement) {
      toast({
        title: "Export Failed",
        description: "Could not find the schematic canvas.",
        variant: "destructive",
      });
      return;
    }

    try {
      const canvas = await html2canvas(canvasElement, {
        backgroundColor: '#0f172a', // slate-900
        scale: 2,
        useCORS: true,
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      
      let finalImgWidth = pdfWidth - 20;
      let finalImgHeight = finalImgWidth / ratio;

      if (finalImgHeight > pdfHeight / 2) {
        finalImgHeight = pdfHeight / 2;
        finalImgWidth = finalImgHeight * ratio;
      }

      pdf.setFontSize(18);
      pdf.text('Well Schematic Diagram', 14, 15);
      pdf.addImage(imgData, 'PNG', 10, 25, finalImgWidth, finalImgHeight);

      const tableStartY = 25 + finalImgHeight + 10;

      pdf.autoTable({
        startY: tableStartY,
        head: [['Component', 'Type', 'Top (m)', 'Bottom (m)']],
        body: components.map(c => [
          c.properties.name,
          c.type.replace('_', ' '),
          c.properties.topDepth,
          c.properties.bottomDepth,
        ]),
        theme: 'grid',
        headStyles: { fillColor: [41, 53, 72] }, // slate-700
        styles: { font: 'helvetica', fontSize: 8 },
      });

      pdf.save('well-schematic.pdf');
      toast({
        title: "Export Successful",
        description: "Schematic and BOM exported as PDF.",
      });

    } catch (error) {
      console.error("PDF Export Error:", error);
      toast({
        title: "Export Failed",
        description: "An error occurred while generating the PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute top-0 right-0 h-full w-full md:w-1/3 lg:w-1/4 bg-slate-800/95 backdrop-blur-sm border-l border-slate-700 z-20 flex flex-col"
        >
          <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-shrink-0">
            <h2 className="text-lg font-semibold text-white">Bill of Materials</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportToJson}>
                <FileJson className="h-4 w-4 mr-2" />
                JSON
              </Button>
              <Button variant="outline" size="sm" onClick={exportToPdf}>
                <FileText className="h-4 w-4 mr-2" />
                PDF
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {components.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">Component</TableHead>
                    <TableHead className="text-white">Type</TableHead>
                    <TableHead className="text-right text-white">Top (m)</TableHead>
                    <TableHead className="text-right text-white">Bottom (m)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {components.map((component) => (
                    <TableRow key={component.id}>
                      <TableCell className="font-medium">{component.properties.name}</TableCell>
                      <TableCell className="capitalize text-slate-400">{component.type.replace('_', ' ')}</TableCell>
                      <TableCell className="text-right">{component.properties.topDepth}</TableCell>
                      <TableCell className="text-right">{component.properties.bottomDepth}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-400">No components in schematic.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BillOfMaterials;