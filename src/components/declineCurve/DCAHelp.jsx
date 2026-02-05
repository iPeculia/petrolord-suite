import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { HelpCircle, Keyboard, BookOpen, PlayCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DCAHelp = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" title="DCA Documentation">
          <HelpCircle size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[600px] bg-slate-950 border-l border-slate-800 text-slate-100 shadow-2xl">
        <SheetHeader className="pb-4 border-b border-slate-800">
          <SheetTitle className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="text-blue-500" size={24} />
            DCA Knowledge Base
          </SheetTitle>
          <SheetDescription className="text-slate-400">
            Comprehensive guide to Decline Curve Analysis workflows, mathematics, and best practices.
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] pr-6 pt-6">
          <div className="space-y-8 pb-10">
            
            {/* Shortcuts Section */}
            <section className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-blue-400">
                <Keyboard size={16} />
                <h3>Keyboard Shortcuts</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Save Project</span>
                  <kbd className="bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-200 border border-slate-700 shadow-sm">Ctrl+S</kbd>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Undo Action</span>
                  <kbd className="bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-200 border border-slate-700 shadow-sm">Ctrl+Z</kbd>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Redo Action</span>
                  <kbd className="bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-200 border border-slate-700 shadow-sm">Ctrl+Y</kbd>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Export Chart</span>
                  <kbd className="bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-200 border border-slate-700 shadow-sm">Ctrl+E</kbd>
                </div>
              </div>
            </section>

            {/* Documentation Topics */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-sm font-semibold text-emerald-400 border-b border-slate-800 pb-2">
                <BookOpen size={16} />
                <h3>Analysis Guide</h3>
              </div>
              
              <Accordion type="single" collapsible className="w-full space-y-2">
                
                {/* Item 1: Getting Started */}
                <AccordionItem value="item-1" className="border border-slate-800 rounded-lg bg-slate-900/30 px-3">
                  <AccordionTrigger className="text-sm font-medium text-slate-200 hover:text-white hover:no-underline py-3">
                    1. Getting Started with DCA
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-400 space-y-4 pb-4 pt-1">
                    <p>
                      Decline Curve Analysis (DCA) is the standard method for forecasting future oil and gas production by analyzing historical rate-time data. It assumes that past production trends will continue into the future, governed by physical reservoir depletion.
                    </p>
                    
                    <div className="bg-slate-900 p-3 rounded border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-200 mb-2 uppercase tracking-wider">The Arps Equation</h4>
                      <div className="font-mono text-xs bg-black/30 p-2 rounded text-emerald-400 text-center mb-2">
                        q(t) = qᵢ / (1 + b · Dᵢ · t)^(1/b)
                      </div>
                      <ul className="space-y-1 text-xs list-disc pl-4">
                        <li><strong className="text-slate-200">qᵢ (Initial Rate):</strong> Production rate at the start of the forecast period.</li>
                        <li><strong className="text-slate-200">Dᵢ (Initial Decline):</strong> The slope of the curve at time zero. Usually expressed as % effective decline per year.</li>
                        <li><strong className="text-slate-200">b (Decline Exponent):</strong> Controls the curvature.
                          <ul className="list-disc pl-4 mt-1 space-y-1 text-slate-500">
                            <li><span className="text-blue-400">b = 0 (Exponential):</span> Constant percentage decline. Straight line on semi-log plot. Conservative.</li>
                            <li><span className="text-blue-400">0 &lt; b &lt; 1 (Hyperbolic):</span> Rate of decline decreases over time. Common for unconventional wells.</li>
                            <li><span className="text-blue-400">b = 1 (Harmonic):</span> Rate is inversely proportional to time. Most optimistic.</li>
                          </ul>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-200">Step-by-Step Workflow</h4>
                      <ol className="list-decimal pl-4 text-xs space-y-1">
                        <li><strong>Import Data:</strong> Upload a CSV file with `Date` and `Rate` columns.</li>
                        <li><strong>Select Well:</strong> Choose the well you wish to analyze from the sidebar.</li>
                        <li><strong>Select Stream:</strong> Toggle between Oil, Gas, or Water analysis.</li>
                        <li><strong>Set Fit Window:</strong> Use the brush tool or date pickers to exclude early-life flush production or shut-ins. Focus on the stable decline period (boundary dominated flow).</li>
                        <li><strong>Fit Model:</strong> Click "Auto-Fit" or manually adjust parameters to match the history.</li>
                      </ol>
                    </div>

                    <div className="bg-amber-900/20 border border-amber-900/50 p-3 rounded flex gap-2">
                      <AlertTriangle className="text-amber-500 shrink-0" size={16} />
                      <div className="text-xs">
                        <strong className="text-amber-500 block mb-1">Common Pitfall</strong>
                        Fitting the entire history including the initial ramp-up ("flush production") often results in artificially high 'b' values and optimistic reserves. Always crop the start date to the onset of established decline.
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Item 2: Forecasting */}
                <AccordionItem value="item-2" className="border border-slate-800 rounded-lg bg-slate-900/30 px-3">
                  <AccordionTrigger className="text-sm font-medium text-slate-200 hover:text-white hover:no-underline py-3">
                    2. Forecasting & Scenarios
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-400 space-y-4 pb-4 pt-1">
                    <p>
                      Once a model fits historical data, it is extended into the future to estimate Estimated Ultimate Recovery (EUR).
                    </p>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="bg-slate-900 p-3 rounded border border-slate-800">
                        <h4 className="text-xs font-bold text-slate-200 mb-2">Economic Limits</h4>
                        <p className="text-xs mb-2">
                          The <strong>Economic Limit</strong> is the production rate where operating costs exceed revenue. Production is assumed to stop here.
                        </p>
                        <ul className="text-xs space-y-1 list-disc pl-4">
                          <li>Set a realistic limit (e.g., 5 bbl/d) to prevent infinite forecasts.</li>
                          <li>Enable "Stop at Limit" to truncate the EUR calculation automatically.</li>
                        </ul>
                      </div>

                      <div className="bg-slate-900 p-3 rounded border border-slate-800">
                        <h4 className="text-xs font-bold text-slate-200 mb-2">Scenario Analysis</h4>
                        <p className="text-xs mb-2">
                          Create multiple forecasts to bracket uncertainty:
                        </p>
                        <ul className="text-xs space-y-1 list-disc pl-4">
                          <li><strong className="text-emerald-400">Low Case (P90):</strong> Use lower 'b' factor (e.g., 0.3) or steeper decline. Conservative.</li>
                          <li><strong className="text-blue-400">Base Case (P50):</strong> Your best-fit parameters.</li>
                          <li><strong className="text-purple-400">High Case (P10):</strong> Use higher 'b' factor (e.g., 1.2) or shallower decline. Optimistic.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-200">Best Practices</h4>
                      <ul className="list-none space-y-2 text-xs">
                        <li className="flex gap-2 items-start">
                          <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                          <span><strong>Transition to Exponential:</strong> For high 'b' factor hyperbolic declines, force a switch to exponential decline when the effective decline rate drops below a threshold (e.g., 6%/yr). This prevents over-forecasting late-life reserves.</span>
                        </li>
                        <li className="flex gap-2 items-start">
                          <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                          <span><strong>Facility Limits:</strong> If a well is choked back, set a "Facility Limit" in the forecast settings to cap the rate until natural decline takes over.</span>
                        </li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Item 3: Type Curves */}
                <AccordionItem value="item-3" className="border border-slate-800 rounded-lg bg-slate-900/30 px-3">
                  <AccordionTrigger className="text-sm font-medium text-slate-200 hover:text-white hover:no-underline py-3">
                    3. Type Curve Analysis
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-400 space-y-4 pb-4 pt-1">
                    <p>
                      Type Curves represent the average performance of a group of analogous wells. They are essential for evaluating new drills (PUDs) where no production history exists.
                    </p>

                    <div className="bg-slate-900 p-3 rounded border border-slate-800">
                      <h4 className="text-xs font-bold text-slate-200 mb-2">Normalization</h4>
                      <p className="text-xs mb-2">
                        To average wells started at different times, we must normalize them:
                      </p>
                      <ul className="text-xs space-y-2 list-disc pl-4">
                        <li>
                          <strong>Time Normalization (Peak Align):</strong> Shifts all wells horizontally so their peak production month is at Time = 0.
                        </li>
                        <li>
                          <strong>Rate Normalization:</strong> Scales rates relative to a peak or average, allowing comparison of wells with different magnitudes but similar decline shapes.
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-200">Workflow</h4>
                      <ol className="list-decimal pl-4 text-xs space-y-1">
                        <li>Go to the <strong>Type Curve</strong> tab.</li>
                        <li><strong>Filter Wells:</strong> Select a group of wells with similar geology and completion design (e.g., "Wolfcamp A - 2023").</li>
                        <li><strong>Create Curve:</strong> Click "Create New Curve". The system will automatically align peak rates.</li>
                        <li><strong>Fit Average:</strong> A best-fit hyperbolic curve is drawn through the P50 of the aggregated data points.</li>
                        <li><strong>Apply:</strong> Use this curve's parameters (qi, Di, b) to forecast new locations.</li>
                      </ol>
                    </div>

                    <div className="bg-blue-900/20 border border-blue-900/50 p-3 rounded">
                      <h4 className="text-xs font-bold text-blue-400 mb-1">Pro Tip: Identifying Outliers</h4>
                      <p className="text-xs text-slate-300">
                        Visualizing all wells together on a normalized plot makes it easy to spot "mechanical failures" or "water loading" issues. Exclude these outliers from your Type Curve to ensure it represents reservoir potential, not operational problems.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </section>

            {/* Tutorials Section */}
            <section>
              <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-purple-400 border-b border-slate-800 pb-2">
                <PlayCircle size={16} />
                <h3>Video Tutorials</h3>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="bg-slate-900 p-3 rounded border border-slate-800 hover:border-slate-700 cursor-pointer group flex justify-between items-center">
                  <div>
                    <div className="text-xs font-medium text-slate-200 group-hover:text-blue-400">Basic DCA Workflow</div>
                    <div className="text-[10px] text-slate-500">Understanding q, D, and b</div>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">5 mins</span>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-800 hover:border-slate-700 cursor-pointer group flex justify-between items-center">
                  <div>
                    <div className="text-xs font-medium text-slate-200 group-hover:text-blue-400">Advanced Multi-Well Analysis</div>
                    <div className="text-[10px] text-slate-500">Type curves & Normalization</div>
                  </div>
                  <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">12 mins</span>
                </div>
              </div>
            </section>

          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default DCAHelp;