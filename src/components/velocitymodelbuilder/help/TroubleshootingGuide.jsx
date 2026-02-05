import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertCircle } from 'lucide-react';

const TroubleshootingGuide = () => {
  const issues = [
    { q: "Data Import Failed (LAS/CSV)", a: "Check that your file includes required columns (Depth/Time or Depth/Velocity). Ensure no special characters in headers. Verify units match project settings." },
    { q: "Velocity Inversion Detected", a: "Physical velocity inversions occur in overpressure zones or gas clouds. If unexpected, check for cycle skips in sonic logs or bad VSP picks." },
    { q: "Depth Conversion Mismatch", a: "Ensure the Seismic Reference Datum (SRD) matches the Well Datum (KB/MSL). A datum shift is the most common cause of static depth errors." },
    { q: "Export Format Not Readable", a: "Petrel requires specific header keywords. Try using the 'Generic ASCII' export if the proprietary format fails, and map columns manually in the destination software." },
    { q: "Slow Grid Processing", a: "Large grids (>10M cells) may time out in the browser. Enable 'GPU Acceleration' in settings or use the 'Batch Processing' tab to offload to the cloud." }
  ];

  return (
    <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" /> Troubleshooting & Common Errors
        </h2>
        <Accordion type="single" collapsible className="w-full space-y-2">
            {issues.map((issue, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-slate-900 border border-slate-800 rounded-md px-4">
                    <AccordionTrigger className="text-sm text-slate-200 hover:no-underline py-3 text-left">
                        {issue.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-400 text-xs pb-4">
                        <div className="pl-4 border-l-2 border-slate-700">
                            {issue.a}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </div>
  );
};

export default TroubleshootingGuide;