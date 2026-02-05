import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layers, Mountain, Activity, Shovel as Pickaxe } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const GeologicalContextGuide = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Mountain className="w-8 h-8 text-amber-500" />
        <div>
          <h2 className="text-2xl font-bold text-white">Geological Foundations</h2>
          <p className="text-slate-400">Understanding the geological controls on velocity is crucial for accurate modeling.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Layers className="w-5 h-5 text-blue-400"/> Basin Analysis</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400 text-sm space-y-2">
            <p>Basin type fundamentally dictates velocity trends. Extensional basins often show normal compaction, while compressional basins may exhibit uplift and erosion, complicating V0-k relationships.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-400"/> Salt Tectonics</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400 text-sm space-y-2">
            <p>Salt creates extreme velocity contrasts (4500 m/s vs 2500 m/s sediments). Accurate modeling of salt diapirs, overhangs, and welds is essential for subsalt imaging.</p>
          </CardContent>
        </Card>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-2">
        <AccordionItem value="strat" className="bg-slate-900 border border-slate-800 rounded-lg px-4">
            <AccordionTrigger className="text-white hover:no-underline">Stratigraphic Framework</AccordionTrigger>
            <AccordionContent className="text-slate-400 text-sm">
                Sequence stratigraphy guides velocity model layering. Major flooding surfaces often mark significant velocity shifts. Unconformities represent time gaps where velocity trends may reset or shift abruptly due to erosion and uplift.
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="diagenesis" className="bg-slate-900 border border-slate-800 rounded-lg px-4">
            <AccordionTrigger className="text-white hover:no-underline">Compaction & Diagenesis</AccordionTrigger>
            <AccordionContent className="text-slate-400 text-sm">
                Mechanical compaction drives the primary increase of velocity with depth. Chemical diagenesis (cementation) can cause rapid velocity increases in carbonates or high-temperature sandstones, often deviating from standard compaction curves.
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faulting" className="bg-slate-900 border border-slate-800 rounded-lg px-4">
            <AccordionTrigger className="text-white hover:no-underline">Structural Geology & Faulting</AccordionTrigger>
            <AccordionContent className="text-slate-400 text-sm">
                Faults can juxtapose lithologies with different velocities, creating lateral velocity contrasts. In shadow zones below major faults, poor seismic illumination makes accurate velocity modeling critical for depth positioning.
            </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default GeologicalContextGuide;