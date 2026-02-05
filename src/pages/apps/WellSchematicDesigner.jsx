import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Edit, List } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { SchematicProvider } from '@/contexts/SchematicContext';
import ComponentPalette from '@/components/wellschematic/ComponentPalette';
import SchematicCanvas from '@/components/wellschematic/SchematicCanvas';
import PropertiesPanel from '@/components/wellschematic/PropertiesPanel';
import BillOfMaterials from '@/components/wellschematic/BillOfMaterials';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const WellSchematicDesigner = () => {
  const [isBomVisible, setIsBomVisible] = useState(false);
  const schematicCanvasRef = useRef(null);

  return (
    <>
      <Helmet>
        <title>Well Schematic Designer - Petrolord Suite</title>
        <meta name="description" content="Design, visualize, and manage well completion schematics with a powerful and intuitive drag-and-drop interface." />
      </Helmet>
      <DndProvider backend={HTML5Backend}>
        <SchematicProvider>
          <div className="flex flex-col h-full bg-slate-900 text-white">
            <header className="p-4 border-b border-slate-700 flex-shrink-0 flex justify-between items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-3"
              >
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2 rounded-lg">
                  <Edit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Well Schematic Designer</h1>
                  <p className="text-sm text-slate-400">Drag components onto the canvas to begin.</p>
                </div>
              </motion.div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => setIsBomVisible(true)}>
                      <List className="mr-2 h-4 w-4" />
                      Bill of Materials
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Show Bill of Materials and Export Options</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </header>
            <main className="flex-grow flex overflow-hidden">
              <ComponentPalette />
              <SchematicCanvas ref={schematicCanvasRef} />
              <PropertiesPanel />
              <BillOfMaterials 
                isVisible={isBomVisible} 
                onClose={() => setIsBomVisible(false)}
                schematicRef={schematicCanvasRef}
              />
            </main>
          </div>
        </SchematicProvider>
      </DndProvider>
    </>
  );
};

export default WellSchematicDesigner;