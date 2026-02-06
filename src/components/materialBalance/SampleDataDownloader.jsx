import React from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Use files from /public (Vite serves these as-is)
const PROD_CSV_URL = "/sample-data/material-balance/sample_production_history.csv";
const PRESSURE_CSV_URL = "/sample-data/material-balance/sample_pressure_data.csv";
const PVT_CSV_URL = "/sample-data/material-balance/sample_pvt_data.csv";
const CONTACTS_CSV_URL = "/sample-data/material-balance/sample_contact_observations.csv";

function SampleFileButton({ label, fileUrl, filename }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[10px] border-slate-700 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 gap-2 px-2"
            asChild
          >
            <a href={fileUrl} download={filename}>
              <FileText className="w-3 h-3" />
              {label}
              <Download className="w-3 h-3 ml-auto opacity-50" />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-900 border-slate-800 text-xs text-slate-300">
          Download {filename}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function SampleDataDownloader() {
  return (
    <div className="mt-4 pt-4 border-t border-slate-800/50">
      <div className="text-[10px] text-slate-500 font-semibold mb-2 flex items-center gap-2">
        <span>SAMPLE DATA TEMPLATES</span>
        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-400 font-normal">
          CSV Format
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <SampleFileButton
          label="Production"
          fileUrl={PROD_CSV_URL}
          filename="sample_production_history.csv"
        />
        <SampleFileButton
          label="Pressure"
          fileUrl={PRESSURE_CSV_URL}
          filename="sample_pressure_data.csv"
        />
        <SampleFileButton
          label="PVT Data"
          fileUrl={PVT_CSV_URL}
          filename="sample_pvt_data.csv"
        />
        <SampleFileButton
          label="Contacts"
          fileUrl={CONTACTS_CSV_URL}
          filename="sample_contact_observations.csv"
        />
      </div>
    </div>
  );
}
