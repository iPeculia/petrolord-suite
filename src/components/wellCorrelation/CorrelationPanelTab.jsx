import React, { useState } from 'react';
import CorrelationPanel from './CorrelationPanel';
import CorrelationAssistant from './CorrelationAssistant';
import QCPanel from './QCPanel';
import { useTrackConfigurationContext } from '@/contexts/TrackConfigurationContext';

const CorrelationPanelTab = () => {
  // Use context state controlled by header buttons
  const { showAssistant, showQC } = useTrackConfigurationContext();
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  // Mock handler for when a marker is clicked in the correlation panel
  const handleMarkerClick = (markerId) => {
    setSelectedMarkerId(markerId);
    // Optional: Automatically open QC panel if configured to do so
    // setShowQC(true); 
  };

  return (
    <div className="h-full w-full flex">
      {/* Main Correlation View */}
      <div className="flex-1 flex flex-col relative">
        <CorrelationPanel onMarkerClick={handleMarkerClick} />
      </div>

      {/* Right Sidebar: Assistant or QC */}
      {(showAssistant || showQC) && (
        <div className="flex h-full border-l border-slate-800 shadow-xl z-10 bg-slate-900 w-80 shrink-0">
          {showAssistant && !showQC && <CorrelationAssistant />}
          {showQC && !showAssistant && <QCPanel selectedMarkerId={selectedMarkerId} />}
          
          {/* If both are open, maybe tab them or stack them? For now, prioritize assistant or stack vertically */}
          {showAssistant && showQC && (
             <div className="flex flex-col h-full w-full">
                <div className="flex-1 border-b border-slate-800 overflow-hidden">
                    <CorrelationAssistant />
                </div>
                <div className="flex-1 overflow-hidden">
                    <QCPanel selectedMarkerId={selectedMarkerId} />
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CorrelationPanelTab;