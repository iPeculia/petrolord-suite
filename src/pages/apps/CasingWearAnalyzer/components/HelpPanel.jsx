import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, BookOpen, Calculator, AlertTriangle, FileText, ChevronRight, X, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TOOLTIPS } from '../utils/tooltips';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const HelpPanel = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started Guide',
      icon: PlayCircle,
      content: (
        <div className="space-y-4 text-sm text-slate-300">
          <p className="text-emerald-400 font-medium">Follow these steps to perform a complete casing wear analysis:</p>
          <div className="space-y-3 pl-2 border-l-2 border-slate-800">
            <div className="space-y-1">
              <strong className="text-white block">1. Select Project & Context</strong>
              <p className="text-xs text-slate-400">Use the left panel to select or create a project, then choose the specific well and casing section you want to analyze.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block">2. Define Operation</strong>
              <p className="text-xs text-slate-400">In the "Inputs & Loads" tab, select a BHA template or define your drill string components (DP, HWDP, Drill Collars).</p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block">3. Set Mud & Wear Parameters</strong>
              <p className="text-xs text-slate-400">Input mud density, viscosity, and wear factors. Higher wear factors simulate more abrasive conditions.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block">4. Input Exposure Time</strong>
              <p className="text-xs text-slate-400">Enter total rotating hours and sliding hours expected for this section. This drives the wear volume calculation.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block">5. Run Calculation</strong>
              <p className="text-xs text-slate-400">Click the large green "RUN CALCULATION" button at the bottom of the Inputs tab. This will validate your data and generate results.</p>
            </div>
            <div className="space-y-1">
              <strong className="text-white block">6. Analyze Results</strong>
              <p className="text-xs text-slate-400">Review the "Wear Profile" tab for graphical plots and "Risk Zones" tab for identified critical areas.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'mechanisms',
      title: 'Casing Wear Mechanisms',
      icon: BookOpen,
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>Casing wear occurs primarily due to the mechanical interaction between the rotating drill string and the stationary casing inner wall.</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
            <li><strong>Rotation:</strong> The primary driver. Tool joints rotating against the casing wall remove material via abrasion.</li>
            <li><strong>Doglegs:</strong> High dogleg severity creates large normal contact forces, accelerating wear.</li>
            <li><strong>Sliding:</strong> Contributing factor, though usually less severe than rotation due to lower accumulated distance.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'model',
      title: 'Wear Model',
      icon: Calculator,
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>This analyzer uses a standard energy dissipation model:</p>
          <div className="bg-slate-950 p-2 rounded border border-slate-800 font-mono text-xs text-amber-400">
            Volume = WF × Force × Distance
          </div>
          <p>Where:</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-slate-400">
            <li><strong>WF:</strong> Wear Factor (depends on mud type and tool joint hardbanding)</li>
            <li><strong>Force:</strong> Normal contact force calculated from BHA weight and string tension</li>
            <li><strong>Distance:</strong> Total distance the tool joint travels against the casing wall</li>
          </ul>
        </div>
      )
    },
    {
      id: 'capacity',
      title: 'Capacity Recalculation',
      icon: AlertTriangle,
      content: (
        <div className="space-y-3 text-sm text-slate-300">
          <p>As the casing wall thins, its structural integrity decreases.</p>
          <div className="space-y-2">
            <div>
              <span className="font-semibold text-white">Burst:</span> Reduced proportionally to remaining wall thickness (Barlow's formula approx).
            </div>
            <div>
              <span className="font-semibold text-white">Collapse:</span> Reduced significantly, approximately proportional to the square or cube of the wall thickness ratio.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'glossary',
      title: 'Glossary',
      icon: FileText,
      content: (
        <div className="space-y-2">
          {Object.entries(TOOLTIPS).map(([key, tip]) => (
            <div key={key} className="border-b border-slate-800 pb-2 last:border-0">
              <div className="text-xs font-bold text-slate-200">{tip.title}</div>
              <div className="text-xs text-slate-400">{tip.content}</div>
            </div>
          ))}
        </div>
      )
    }
  ];

  const filteredSections = sections.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (typeof s.content === 'string' && s.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
        <h2 className="font-bold text-white flex items-center">
          <BookOpen className="w-5 h-5 mr-2 text-emerald-500" />
          Help & Learning
        </h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="p-4 bg-slate-900">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics..." 
            className="pl-9 bg-slate-950 border-slate-700 text-sm"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <Accordion type="single" collapsible defaultValue="getting-started" className="w-full space-y-4">
            {filteredSections.map(section => (
              <AccordionItem key={section.id} value={section.id} className="border border-slate-800 rounded-lg bg-slate-900/50 overflow-hidden">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-slate-800">
                  <div className="flex items-center text-sm font-bold text-amber-400 uppercase tracking-wide">
                    <section.icon className="w-4 h-4 mr-2" />
                    {section.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 bg-slate-900 border-t border-slate-800">
                  {section.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {filteredSections.length === 0 && (
            <div className="text-center text-slate-500 py-10">
              No topics found matching "{searchQuery}"
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HelpPanel;