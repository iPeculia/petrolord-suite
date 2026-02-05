import React from 'react';
import WellCorrelationHeader from './WellCorrelationHeader';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import WellCorrelationTabs from './WellCorrelationTabs';
import { usePanelVisibility } from '@/hooks/useWellCorrelation';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const WellCorrelationLayout = () => {
  const { leftPanelVisible, rightPanelVisible, leftPanelWidth, rightPanelWidth, setLeftPanelWidth, setRightPanelWidth } = usePanelVisibility();

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 overflow-hidden">
      {/* Top Header */}
      <WellCorrelationHeader />

      {/* Main Layout Area with Resizable Panels */}
      <div className="flex-1 flex overflow-hidden relative">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          
          {/* Left Sidebar (Collapsible) */}
          {leftPanelVisible && (
            <>
              <ResizablePanel 
                defaultSize={leftPanelWidth} 
                minSize={15} 
                maxSize={30} 
                onResize={setLeftPanelWidth}
                className="bg-slate-900 border-r border-slate-800"
              >
                <LeftSidebar width="100%" />
              </ResizablePanel>
              <ResizableHandle className="w-1 bg-slate-800 hover:bg-blue-600 transition-colors" />
            </>
          )}

          {/* Center Content (Tabs/Canvas) */}
          <ResizablePanel defaultSize={100 - (leftPanelVisible ? leftPanelWidth : 0) - (rightPanelVisible ? rightPanelWidth : 0)}>
            <div className="h-full w-full bg-slate-950 relative">
               <WellCorrelationTabs />
            </div>
          </ResizablePanel>

          {/* Right Sidebar (Collapsible) */}
          {rightPanelVisible && (
            <>
              <ResizableHandle className="w-1 bg-slate-800 hover:bg-blue-600 transition-colors" />
              <ResizablePanel 
                defaultSize={rightPanelWidth} 
                minSize={20} 
                maxSize={40} 
                onResize={setRightPanelWidth}
                className="bg-slate-900 border-l border-slate-800"
              >
                <RightSidebar width="100%" />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WellCorrelationLayout;