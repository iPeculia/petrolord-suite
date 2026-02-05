import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { FileDown, Settings } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';

const Reporting = () => {
  const { toast } = useToast();

  const handleExport = (format) => {
    toast({
      title: 'Export Initiated',
      description: `Generating ${format} report...`,
    });
  };
  
  const handleCustomize = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "Customizable Report Builder isn't implemented yet.",
      duration: 3000,
    });
  };

  return (
    <CollapsibleSection title="Reporting & Export" icon={<FileDown />}>
      <div className="bg-white/5 p-6 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
            <h3 className="text-lg font-semibold text-white">Generate Reports</h3>
            <p className="text-sm text-lime-300">Export your analysis summary or detailed logs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleCustomize} variant="outline"><Settings className="w-4 h-4 mr-2"/>Customize</Button>
          <Button onClick={() => handleExport('PDF')}><FileDown className="w-4 h-4 mr-2"/>Export PDF</Button>
          <Button onClick={() => handleExport('CSV')}><FileDown className="w-4 h-4 mr-2"/>Export CSV</Button>
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default Reporting;