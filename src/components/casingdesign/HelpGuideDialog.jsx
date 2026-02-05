import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Layers, FileText, BarChart3, ChevronsRight, Send, HelpCircle, Zap } from "lucide-react";

const HelpGuideDialog = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 text-white border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <HelpCircle className="w-6 h-6 mr-2 text-lime-400" />
            Casing &amp; Tubing Design Help Guide
          </DialogTitle>
          <DialogDescription>
            Your guide to designing, analyzing, and integrating wellbore casing schemes.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto pr-4">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-bold text-lg">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-lime-400" /> Strings Tab
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-slate-300">
                <p className="mb-2">This is where you define the physical casing program for your well. Each row represents a distinct casing string.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Add String:</strong> Click to open a form and add a new casing section.</li>
                  <li><strong>Edit/Delete:</strong> Use the icons on each row to modify or remove a string.</li>
                  <li><strong>Properties:</strong> Define the Name, OD (Outer Diameter), Weight, Grade, and depths for each string. These properties are critical for analysis.</li>
                  <li><strong>Design Factors (DF):</strong> Set the minimum required safety factors for Burst, Collapse, and Tension in the 'Add/Edit' form.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="font-bold text-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-lime-400" /> Load Cases Tab
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-slate-300">
                <p className="mb-2">This tab allows you to define the operational scenarios (load cases) that the casing strings will be subjected to during the well's life.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Select String:</strong> First, choose which casing string you want to apply load cases to using the dropdown menu.</li>
                  <li><strong>Add Case:</strong> Create a new load case, either from a template (e.g., Cementing, Kick) or from scratch.</li>
                  <li><strong>Pressure Profiles:</strong> Define the internal and external pressure profiles as a series of [depth, pressure] points in JSON format.</li>
                  <li><strong>Run Analysis:</strong> Click the <Zap className="h-4 w-4 inline-block mx-1"/> icon on a case to send it to the `casing-analyze` engine for computation.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="font-bold text-lg">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-lime-400" /> Results Tab
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-slate-300">
                <p className="mb-2">Once an analysis is complete, the results appear here. Each run is displayed in its own card.</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Result Cards:</strong> Quickly see the overall Pass/Fail status and the minimum safety factors for Burst, Collapse, and Tension compared to your design factors.</li>
                  <li><strong>View Report:</strong> Click to call the `casing-report` function, which generates and opens a detailed PDF summary of the run.</li>
                  <li><strong>Charts (Coming Soon):</strong> Detailed charts will show safety factors and pressure envelopes versus depth for in-depth analysis.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="font-bold text-lg">
                <div className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-lime-400" /> Push to Cementing
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-slate-300">
                <p>This integration streamlines your workflow by sending your finalized casing design directly to the Cementing Simulator. It pre-populates the simulator with the correct casing OD and shoe depth, saving time and reducing data entry errors.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="font-bold text-lg">
                <div className="flex items-center gap-2">
                  <ChevronsRight className="h-5 w-5 text-lime-400" /> Send to AFE
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-slate-300">
                <p>This feature connects your engineering design to project financials. It generates a bill of materials for the selected casing string and sends it to the AFE & Cost Control module, automatically creating a new line item for procurement and budget tracking.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpGuideDialog;