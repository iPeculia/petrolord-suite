import React from 'react';
import { Button } from '@/components/ui/button';
import { Printer, FileText } from 'lucide-react';

const PrintableDocumentation = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex justify-center gap-4 my-8 print:hidden">
        <Button variant="outline" onClick={handlePrint} className="border-slate-700">
            <Printer className="w-4 h-4 mr-2" /> Print Guide
        </Button>
        <Button variant="outline" className="border-slate-700">
            <FileText className="w-4 h-4 mr-2" /> Download PDF Manual (v2.1)
        </Button>
    </div>
  );
};

export default PrintableDocumentation;