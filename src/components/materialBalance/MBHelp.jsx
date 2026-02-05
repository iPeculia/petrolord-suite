import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { HelpCircle, Book, Video, ExternalLink } from 'lucide-react';

const MBHelp = () => {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full overflow-y-auto">
      <CardHeader className="p-4 border-b border-slate-800">
        <CardTitle className="text-lg font-bold text-slate-200 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" /> Help & Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-slate-800">
                <AccordionTrigger className="text-slate-300 hover:text-blue-400">Quick Start Guide</AccordionTrigger>
                <AccordionContent className="text-slate-400 text-sm space-y-2">
                    <p>1. <strong>Setup:</strong> Define your Tank parameters (Type, Initial Pressure, Temperature) in the "Setup" tab.</p>
                    <p>2. <strong>Import Data:</strong> Load Production, Pressure, and PVT history using the import tools.</p>
                    <p>3. <strong>Diagnostics:</strong> Go to "Diagnostics" to identify the drive mechanism using the Campbell/Havlena-Odeh plots.</p>
                    <p>4. <strong>Modeling:</strong> Use "Models & Contacts" to fit a regression model (solving for OOIP/OGIP and Aquifer size).</p>
                    <p>5. <strong>Forecasting:</strong> Create production scenarios in the "Forecast" tab to predict future pressure and contact movements.</p>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-slate-800">
                <AccordionTrigger className="text-slate-300 hover:text-blue-400">Interpreting Diagnostic Plots</AccordionTrigger>
                <AccordionContent className="text-slate-400 text-sm space-y-2">
                    <div className="space-y-1">
                        <strong className="text-slate-200">F vs Eo (Volumetric Oil)</strong>
                        <p>A straight line passing through the origin indicates a purely volumetric undersaturated oil reservoir. The slope represents N (OOIP).</p>
                    </div>
                    <div className="space-y-1 mt-2">
                        <strong className="text-slate-200">F vs Et (Solution Gas / Gas Cap)</strong>
                        <p>Used for reservoirs with gas caps or solution gas drive. Linearity confirms the model parameters (m, N).</p>
                    </div>
                    <div className="space-y-1 mt-2">
                        <strong className="text-slate-200">P/Z vs Gp (Gas)</strong>
                        <p>Standard plot for volumetric gas. A straight line extrapolates to OGIP at P/Z=0. Curvature may indicate water influx.</p>
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-slate-800">
                <AccordionTrigger className="text-slate-300 hover:text-blue-400">Contact Movement Physics</AccordionTrigger>
                <AccordionContent className="text-slate-400 text-sm space-y-2">
                    <p>Material Balance Pro estimates contact movement based on volumetric displacement.</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li><strong>OWC Rise:</strong> Calculated from cumulative water influx (We) minus water production, filling the pore volume from the bottom up.</li>
                        <li><strong>GOC Fall:</strong> Calculated from gas cap expansion due to pressure drop, displacing oil downwards.</li>
                    </ul>
                    <p className="text-xs text-yellow-500 mt-2">Note: This is a "tank" approximation and assumes uniform piston-like displacement. Heterogeneity is not modeled.</p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>

        <div className="mt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2"><Book className="w-4 h-4" /> Glossary</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <strong className="text-blue-400">F</strong>
                    <p className="text-slate-500">Underground Withdrawal (Total fluid production in reservoir bbl)</p>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <strong className="text-blue-400">Eo</strong>
                    <p className="text-slate-500">Expansion of Oil + Dissolved Gas</p>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <strong className="text-blue-400">Eg</strong>
                    <p className="text-slate-500">Expansion of Gas Cap Gas</p>
                </div>
                <div className="bg-slate-950 p-2 rounded border border-slate-800">
                    <strong className="text-blue-400">We</strong>
                    <p className="text-slate-500">Cumulative Water Influx</p>
                </div>
            </div>
        </div>
        
        <div className="mt-6">
            <Button variant="outline" className="w-full justify-between text-slate-400 border-slate-700">
                <span>Video Tutorials</span>
                <Video className="w-4 h-4" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MBHelp;