import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useCorrelationPanel } from '@/hooks/useWellCorrelation';
import { useWellManagement } from '@/hooks/useWellManagement';
import { useWellCorrelation } from '@/contexts/WellCorrelationContext';
import { useAdvancedVisualization } from '@/hooks/useAdvancedVisualization';
import { Card } from '@/components/ui/card';
import TrackRenderer from './TrackRenderer';
import DepthTrackRenderer from './DepthTrackRenderer';
import AdvancedToolbar from './AdvancedToolbar';
import LayerPanel from './LayerPanel';
import AnalysisPanel from './AnalysisPanel';
import WellHeader from './WellHeader';
import { generateWellLogs } from '@/data/wellLogs';
import { calculateDepthDifference } from '@/utils/measurementUtils';
import { ArrowUp, ArrowRight, Layout } from 'lucide-react';

const CorrelationPanel = ({ onMarkerClick }) => {
  const { tracks, markers, updateTrackWidth } = useWellCorrelation();
  const { 
    zoom, 
    verticalScale, 
    spacingMode, 
    spacingValue, 
    backgroundColor, 
    backgroundOpacity,
  } = useCorrelationPanel();
  
  const { 
    orderedWells, 
    selectedWells, 
    hiddenWells,
    wellsInCorrelation,
    reorderWells, 
    selectWell, 
    moveWell,
    toggleWellVisibility,
    removeFromCorrelation,
    addToCorrelation
  } = useWellManagement();

  const {
    activeTool,
    layers,
    annotations,
    addTextAnnotation,
    measurements,
    addMeasurement,
    undo,
    redo,
    handleExport
  } = useAdvancedVisualization();

  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [showAnalysisPanel, setShowAnalysisPanel] = useState(false);
  const [cursorData, setCursorData] = useState(null);
  
  // Interaction State
  const [interactionState, setInteractionState] = useState({
    isDragging: false,
    startPoint: null,
    currentPoint: null,
    tempMeasurement: null
  });

  const scrollAreaRef = useRef(null);
  const contentRef = useRef(null);

  // Mock depth range
  const depthRange = { min: 0, max: 3500 };
  const contentHeight = (depthRange.max - depthRange.min) * verticalScale;

  // --- Resizing Logic (Columns) ---
  const [isResizing, setIsResizing] = useState(false);
  const resizeState = useRef({ trackId: null, startX: 0, startWidth: 0 });

  const handleResizeStart = useCallback((e, trackId) => {
    if (activeTool !== 'select') return; // Only resize in select mode
    e.preventDefault();
    e.stopPropagation();
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      setIsResizing(true);
      resizeState.current = { trackId, startX: e.clientX, startWidth: track.width };
      document.body.style.cursor = 'col-resize';
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
    }
  }, [tracks, updateTrackWidth, activeTool]);

  const handleResizeMove = useCallback((e) => {
    if (resizeState.current.trackId) {
      const diff = e.clientX - resizeState.current.startX;
      const newWidth = Math.max(30, resizeState.current.startWidth + diff);
      updateTrackWidth(resizeState.current.trackId, newWidth);
    }
  }, [updateTrackWidth]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    resizeState.current = { trackId: null, startX: 0, startWidth: 0 };
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, [handleResizeMove]);

  // --- Keyboard Navigation ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); undo(); }
        if (e.key === 'y') { e.preventDefault(); redo(); }
        if (e.key === 'e') { e.preventDefault(); handleExport('png', 'correlation-canvas'); }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, handleExport]);

  // --- Canvas Interactions (Pan, Measure, Annotate) ---
  const handleCanvasMouseDown = (e) => {
    if (activeTool === 'select') return;
    
    const rect = contentRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setInteractionState(prev => ({
      ...prev,
      isDragging: true,
      startPoint: { x, y, clientX: e.clientX, clientY: e.clientY },
      currentPoint: { x, y }
    }));
  };

  const handleCanvasMouseMove = (e) => {
    const rect = contentRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Update cursor data for analysis
    const depth = (y / verticalScale) + depthRange.min;
    setCursorData({ depth, values: {} }); // Add real curve values here in future

    if (!interactionState.isDragging) return;

    if (activeTool === 'pan' && scrollAreaRef.current) {
        const container = scrollAreaRef.current; 
        if (container) {
            const dx = e.clientX - interactionState.startPoint.clientX;
            const dy = e.clientY - interactionState.startPoint.clientY;
            container.scrollLeft -= dx;
            container.scrollTop -= dy;
            setInteractionState(prev => ({ 
                ...prev, 
                startPoint: { ...prev.startPoint, clientX: e.clientX, clientY: e.clientY } 
            }));
        }
    } else if (activeTool === 'measure') {
        setInteractionState(prev => ({ ...prev, currentPoint: { x, y } }));
    }
  };

  const handleCanvasMouseUp = (e) => {
    if (!interactionState.isDragging) return;

    const rect = contentRef.current?.getBoundingClientRect();
    const x = e.clientX - (rect?.left || 0);
    const y = e.clientY - (rect?.top || 0);

    if (activeTool === 'measure') {
        const p1 = interactionState.startPoint;
        const p2 = { x, y };
        const dist = calculateDepthDifference(p1.y, p2.y, verticalScale);
        if (dist > 0) {
            addMeasurement({
                id: Date.now(),
                start: p1,
                end: p2,
                value: dist.toFixed(2) + ' m'
            });
        }
    } else if (activeTool === 'text') {
        if (Math.abs(x - interactionState.startPoint.x) < 5 && Math.abs(y - interactionState.startPoint.y) < 5) {
            const text = prompt("Enter annotation text:");
            if (text) {
                addTextAnnotation({ x, y }, text);
            }
        }
    }

    setInteractionState({ isDragging: false, startPoint: null, currentPoint: null, tempMeasurement: null });
  };

  // Drop handler for adding wells via drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const wellId = e.dataTransfer.getData('wellId');
    if (wellId && !wellsInCorrelation.includes(wellId)) {
      addToCorrelation(wellId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  // --- Render Data ---
  const getSpacing = (index) => spacingMode === 'constant' ? spacingValue : 20;

  // Filter ordered wells to only show those explicitly added to correlation view
  const activeWells = orderedWells.filter(w => wellsInCorrelation.includes(w.id));

  return (
    <div className="h-full w-full flex flex-col bg-slate-950" style={{ backgroundColor }}>
      
      <AdvancedToolbar 
        onToggleLayers={() => setShowLayerPanel(p => !p)}
        onToggleAnalysis={() => setShowAnalysisPanel(p => !p)}
      />
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panels Overlay */}
        {showLayerPanel && (
            <div className="absolute left-0 top-0 bottom-0 z-30">
                <LayerPanel onClose={() => setShowLayerPanel(false)} />
            </div>
        )}
        {showAnalysisPanel && (
            <div className="absolute left-0 top-0 bottom-0 z-30" style={{ left: showLayerPanel ? '256px' : '0' }}>
                <AnalysisPanel onClose={() => setShowAnalysisPanel(false)} cursorData={cursorData} />
            </div>
        )}

        {/* Main Scrollable Canvas */}
        <div 
            ref={scrollAreaRef}
            className={`flex-1 overflow-auto relative ${activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' : activeTool === 'measure' ? 'cursor-crosshair' : ''}`}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <div 
                id="correlation-canvas"
                ref={contentRef}
                className="flex min-h-[600px] p-6 items-start transition-transform duration-75 ease-out origin-top-left relative"
                style={{ 
                  transform: `scale(${zoom})`,
                  transformOrigin: '0 0',
                  width: `${Math.max(100, 100 / zoom)}%`,
                  opacity: backgroundOpacity,
                  minHeight: '100%'
                }}
            >
                {/* Interaction Overlay (SVG for lines/annotations) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-50" style={{ minHeight: contentHeight }}>
                    {interactionState.isDragging && activeTool === 'measure' && interactionState.startPoint && (
                        <g>
                            <line 
                                x1={interactionState.startPoint.x} y1={interactionState.startPoint.y}
                                x2={interactionState.currentPoint.x} y2={interactionState.currentPoint.y}
                                stroke="#facc15" strokeWidth="2" strokeDasharray="4"
                            />
                            <text x={interactionState.currentPoint.x + 10} y={interactionState.currentPoint.y} fill="#facc15" fontSize="12">
                                {calculateDepthDifference(interactionState.startPoint.y, interactionState.currentPoint.y, verticalScale).toFixed(1)} m
                            </text>
                        </g>
                    )}
                    
                    {layers?.measurements?.visible && measurements.map(m => (
                        <g key={m.id}>
                            <line x1={m.start.x} y1={m.start.y} x2={m.end.x} y2={m.end.y} stroke="#facc15" strokeWidth="2" />
                            <text x={m.end.x + 5} y={m.end.y} fill="#facc15" fontSize="12">{m.value}</text>
                        </g>
                    ))}

                    {layers?.annotations?.visible && annotations.map(ann => (
                        <text key={ann.id} x={ann.position.x} y={ann.position.y} fill="#ef4444" fontSize="14" fontWeight="bold">
                            {ann.content}
                        </text>
                    ))}
                </svg>

                {activeWells.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center p-8 border-2 border-dashed border-slate-800 rounded-lg bg-slate-900/50 max-w-md">
                      <Layout className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-300 mb-2">Correlation View Empty</h3>
                      <p className="text-sm text-slate-500 mb-4">
                        Select wells from the Project Wells panel on the left and add them here to start correlating.
                      </p>
                      <div className="flex justify-center gap-4 text-xs text-slate-600">
                        <span className="flex items-center"><ArrowRight className="w-3 h-3 mr-1" /> Drag & Drop Wells</span>
                        <span className="flex items-center"><ArrowUp className="w-3 h-3 mr-1" /> Use "Add" Buttons</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={(result) => {
                      if (!result.destination) return;
                      reorderWells(result.source.index, result.destination.index);
                  }}>
                      <Droppable droppableId="wells-droppable" direction="horizontal">
                          {(provided) => (
                              <div ref={provided.innerRef} {...provided.droppableProps} className="flex">
                                  {activeWells.map((well, index) => {
                                      if (hiddenWells.includes(well.id)) return null;
                                      const wellLogData = well.logData || generateWellLogs(well.id, 0, well.totalDepth, 0.5);

                                      return (
                                          <Draggable key={well.id} draggableId={well.id} index={index} isDragDisabled={activeTool !== 'select'}>
                                              {(provided, snapshot) => (
                                                  <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      style={{ 
                                                          ...provided.draggableProps.style, 
                                                          marginRight: getSpacing(index),
                                                          opacity: snapshot.isDragging ? 0.8 : 1
                                                      }}
                                                  >
                                                      <Card className={`bg-slate-900 border-slate-800 shrink-0 flex flex-col shadow-2xl overflow-hidden rounded-lg ring-1 ${selectedWells.includes(well.id) ? 'ring-blue-500 ring-2' : 'ring-slate-800/50'}`}>
                                                          <WellHeader 
                                                              well={well} 
                                                              dragHandleProps={provided.dragHandleProps} 
                                                              isSelected={selectedWells.includes(well.id)} 
                                                              isHidden={false} 
                                                              onSelect={selectWell} 
                                                              onVisibilityToggle={(id) => {
                                                                // Standard toggle visibility or remove
                                                                // If removing from view is preferred via eye icon context:
                                                                removeFromCorrelation(id); 
                                                              }} 
                                                              onMove={moveWell} 
                                                          />
                                                          
                                                          <div className="flex flex-1 bg-slate-950 relative" style={{ height: contentHeight }}>
                                                              {layers?.grid?.visible && (
                                                                  <div className="absolute inset-0 pointer-events-none" 
                                                                      style={{ 
                                                                          backgroundImage: 'linear-gradient(to bottom, #334155 1px, transparent 1px)', 
                                                                          backgroundSize: `100% ${100 * verticalScale}px`, 
                                                                          opacity: layers.grid.opacity * 0.2
                                                                      }} 
                                                                  />
                                                              )}

                                                              {tracks.map(track => {
                                                                  if (track.type && track.type.startsWith('DEPTH')) {
                                                                      return <DepthTrackRenderer key={track.id} track={track} wellId={well.id} depthRange={depthRange} height={contentHeight} onResizeStart={handleResizeStart} />;
                                                                  }
                                                                  return (
                                                                      <div key={track.id} style={{ opacity: layers?.logs?.visible ? layers.logs.opacity : 0 }}>
                                                                          <TrackRenderer 
                                                                            track={track} 
                                                                            wellData={wellLogData.curves} 
                                                                            depths={wellLogData.depths} 
                                                                            depthRange={depthRange} 
                                                                            height={contentHeight} 
                                                                            onResizeStart={handleResizeStart} 
                                                                          />
                                                                      </div>
                                                                  );
                                                              })}

                                                              {layers?.markers?.visible && (
                                                                  <div className="absolute inset-0 pointer-events-none z-10" style={{ opacity: layers.markers.opacity }}>
                                                                      {markers.filter(m => m.wellId === well.id).map(marker => (
                                                                          <div key={marker.id} className="absolute w-full border-t-2 border-dashed cursor-pointer hover:border-white pointer-events-auto group transition-all duration-200" style={{ top: `${((marker.depth - depthRange.min) / (depthRange.max - depthRange.min)) * contentHeight}px`, borderColor: marker.color }} onClick={() => onMarkerClick && onMarkerClick(marker.id)}>
                                                                              <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded text-slate-200 bg-slate-900/90 border border-slate-700/50 shadow-md backdrop-blur-sm -translate-y-1/2 inline-block group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                                                                  {marker.name}
                                                                              </span>
                                                                          </div>
                                                                      ))}
                                                                  </div>
                                                              )}
                                                          </div>
                                                      </Card>
                                                  </div>
                                              )}
                                          </Draggable>
                                      );
                                  })}
                                  {provided.placeholder}
                              </div>
                          )}
                      </Droppable>
                  </DragDropContext>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationPanel;