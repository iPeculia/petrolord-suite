import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import CoreViewer from './CoreViewer';
import StripLogViewer from './StripLogViewer';
import AnnotationList from './AnnotationList';
import { Camera, FileText, List, Download } from 'lucide-react';

const ResultsPanel = ({ results }) => {
  const { inputs, annotations, stripLogData, imageSrc } = results;
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">{inputs.wellName} - Core Analysis</h1>
        <Button variant="outline" className="border-lime-400 text-lime-400 hover:bg-lime-400/10">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
      
      <div className="flex-grow flex gap-4">
        <div className="w-2/3 flex flex-col">
          <Tabs defaultValue="core-viewer" className="w-full flex-grow flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="core-viewer"><Camera className="w-4 h-4 mr-2"/>Core Viewer</TabsTrigger>
              <TabsTrigger value="strip-log"><FileText className="w-4 h-4 mr-2"/>Strip Log</TabsTrigger>
            </TabsList>
            <TabsContent value="core-viewer" className="flex-grow bg-white/5 rounded-b-lg p-2 mt-0">
              <CoreViewer imageSrc={imageSrc} annotations={annotations} selectedAnnotation={selectedAnnotation} />
            </TabsContent>
            <TabsContent value="strip-log" className="flex-grow bg-white/5 rounded-b-lg p-4 mt-0">
              <StripLogViewer stripLogData={stripLogData} topDepth={inputs.topDepth} baseDepth={inputs.baseDepth} />
            </TabsContent>
          </Tabs>
        </div>
        <div className="w-1/3 flex flex-col">
          <div className="bg-white/5 rounded-lg p-4 flex-grow flex flex-col">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center"><List className="w-5 h-5 mr-2 text-lime-300"/>Annotations</h2>
            <div className="flex-grow overflow-y-auto">
              <AnnotationList annotations={annotations} onSelect={setSelectedAnnotation} selectedId={selectedAnnotation?.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPanel;