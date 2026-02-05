import React from 'react';
    import {
      Dialog,
      DialogContent,
      DialogHeader,
      DialogTitle,
      DialogDescription,
    } from '@/components/ui/dialog';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
    import { Database, Droplets, BarChart3, TrendingUp, Compass, SlidersHorizontal, FileText } from 'lucide-react';

    const helpContent = [
      {
        id: 'data-hub',
        icon: Database,
        title: 'Step 1: Data Hub',
        content: "Start by uploading your reservoir data. You'll need three CSV files: Production History (time, oil/gas/water rates), Pressure Data (time, reservoir pressure), and optionally, a PVT Table (pressure, fluid properties). Just drag and drop each file into its corresponding card."
      },
      {
        id: 'pvt-rock',
        icon: Droplets,
        title: 'Step 2: PVT & Rock Properties',
        content: "If you didn't upload a PVT table, you can generate one here using industry-standard correlations. Enter basic fluid properties like API gravity and gas gravity, select your preferred correlations, and click 'Recalculate PVT Table'. Once you're satisfied with the properties (either uploaded or correlated), click 'Use Properties' to make them available for the other tabs."
      },
      {
        id: 'mbal',
        icon: BarChart3,
        title: 'Step 3: Material Balance',
        content: "This is the core of the analysis. Once your data is loaded and PVT is set, click 'Run Material Balance'. The engine will analyze your data to calculate the Original Oil-In-Place (OOIP) and identify the dominant reservoir drive mechanisms (e.g., water drive, gas cap drive). The results will appear in the Havlena-Odeh plot."
      },
      {
        id: 'aquifer-model',
        icon: TrendingUp,
        title: 'Step 4: Aquifer Model (Optional)',
        content: "If you suspect water influx is affecting your reservoir, you can model it here. Choose a model (Fetkovich or Carter-Tracy), input the required aquifer parameters, and click 'Run Aquifer Model'. The calculated water influx (We) will automatically be used in the Material Balance calculation on the next run, refining your OOIP estimate."
      },
      {
        id: 'contact-tracker',
        icon: Compass,
        title: 'Step 5: Contact Tracker (Optional)',
        content: "After running the Material Balance, you can track how the Gas-Oil Contact (GOC) and Oil-Water Contact (OWC) have moved over time. Input the initial contact depths and key reservoir parameters, then click 'Track Contacts' to visualize their movement based on fluid withdrawal and influx."
      },
      {
        id: 'forecast',
        icon: SlidersHorizontal,
        title: 'Step 6: Forecast & Scenarios',
        content: "Use the results from your Material Balance to generate a production forecast. The tool automatically sets initial parameters based on your production history, but you can adjust them. Choose a decline model (e.g., Hyperbolic), set an economic limit, and click 'Run Forecast' to see P10, P50, and P90 production scenarios."
      },
      {
        id: 'reports',
        icon: FileText,
        title: 'Step 7: Reports & Export',
        content: "Your analysis is complete! From this tab, you can generate a professional PDF summary of your key findings or export the raw forecast data to a CSV file for use in other applications. You can also push your results to other Petrolord apps like EPE Cloud or the Scenario Planner."
      }
    ];

    const HelpGuideDialog = ({ isOpen, onOpenChange }) => {
      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-lime-300 text-xl">Reservoir Balance - Help Guide</DialogTitle>
              <DialogDescription>
                Follow these steps for a complete reservoir surveillance workflow.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[60vh] pr-4">
              <Accordion type="single" collapsible className="w-full" defaultValue="data-hub">
                {helpContent.map((item) => {
                  const Icon = item.icon;
                  return (
                    <AccordionItem value={item.id} key={item.id}>
                      <AccordionTrigger className="text-lg hover:no-underline">
                        <div className="flex items-center">
                          <Icon className="w-5 h-5 mr-3 text-lime-400" />
                          {item.title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-300 pl-8">
                        {item.content}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      );
    };

    export default HelpGuideDialog;