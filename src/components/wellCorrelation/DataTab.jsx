import React, { useState } from 'react';
import WellListPanel from './WellListPanel';
import WellLogViewer from './WellLogViewer';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const DataTab = () => {
  const [selectedWells, setSelectedWells] = useState([]);

  const handleWellSelect = (well) => {
    // Toggle selection for multi-well viewing
    if (selectedWells.find(w => w.id === well.id)) {
      setSelectedWells(selectedWells.filter(w => w.id !== well.id));
    } else {
      setSelectedWells([...selectedWells, well]);
    }
  };

  return (
    <div className="h-full w-full flex">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <WellListPanel onWellSelect={handleWellSelect} />
        </ResizablePanel>
        
        <ResizableHandle className="bg-slate-800 w-1 hover:bg-blue-600 transition-colors" />
        
        <ResizablePanel defaultSize={80}>
          <WellLogViewer selectedWells={selectedWells} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DataTab;