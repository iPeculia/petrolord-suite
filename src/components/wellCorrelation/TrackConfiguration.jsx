import React, { useState } from 'react';
import { useTrackConfigurationContext } from '@/contexts/TrackConfigurationContext';
import { useLogManagement } from '@/hooks/useLogManagement';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2, GripVertical, Settings, ChevronDown, Waves, ArrowRight, Ruler, LogIn, Upload } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { DEPTH_TYPES, DEPTH_LABELS, DEPTH_COLORS } from '@/utils/depthTrackUtils';
import LogSelectionDropdown from './LogSelectionDropdown';
import LogCustomizationPanel from './LogCustomizationPanel';
import LogCurveFillPanel from './LogCurveFillPanel';
import LogImportDialog from './LogImportDialog';

const TrackConfiguration = () => {
  const { tracks, addTrack, removeTrack, updateTrack, importLogs } = useTrackConfigurationContext();
  const { addLogToTrack, removeLogFromTrack, updateLogSettings } = useLogManagement();
  const [editingLogId, setEditingLogId] = useState(null);
  const [importOpen, setImportOpen] = useState(false);

  const handleAddTrack = (type) => {
    let newTrack = {
        id: crypto.randomUUID(),
        title: 'New Track',
        width: 150,
        settings: {}
    };

    if (type === 'LOG') {
        newTrack = {
            ...newTrack,
            type: 'LOG',
            scale: 'linear',
            logs: [],
            grid: { horizontal: true, vertical: true },
        };
    } else {
        newTrack = {
            ...newTrack,
            type: type,
            title: DEPTH_LABELS[type],
            width: 80,
            settings: {
                tickInterval: 500,
                showLabels: true,
                showGrid: true,
                showDeviation: false,
                showSeaLevel: false,
                color: DEPTH_COLORS[type]
            }
        };
    }
    addTrack(newTrack);
  };

  const handleImportLogs = (data) => {
    if (importLogs) {
        importLogs([data]);
    }
  };

  const setPresetWidth = (trackId, preset) => {
    let width = 150;
    if (preset === 'narrow') width = 80;
    if (preset === 'normal') width = 150;
    if (preset === 'wide') width = 300;
    const track = tracks.find(t => t.id === trackId);
    if (track) {
        updateTrack(trackId, { ...track, width });
    }
  };

  const getTrackIcon = (track) => {
      const color = track.settings?.color || (track.type && track.type.startsWith('DEPTH') ? DEPTH_COLORS[track.type] : '#94a3b8');
      if (track.type === DEPTH_TYPES.TVDSS) return <Waves className="w-3.5 h-3.5" style={{color}} />;
      if (track.type === DEPTH_TYPES.TVD) return <ArrowRight className="w-3.5 h-3.5 rotate-90" style={{color}} />;
      if (track.type === DEPTH_TYPES.MD) return <Ruler className="w-3.5 h-3.5" style={{color}} />;
      return <LogIn className="w-3.5 h-3.5 text-slate-400" />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200">
      <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10 backdrop-blur-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Track Config</h3>
        
        <div className="flex gap-1">
            <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setImportOpen(true)} 
                className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800"
                title="Import Logs"
            >
                <Upload className="w-3.5 h-3.5" />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700 hover:bg-slate-800 hover:text-white shadow-sm">
                        <Plus className="w-3 h-3 mr-1" /> Add <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-200 min-w-[200px]" align="end">
                    <DropdownMenuLabel className="text-xs text-slate-500">Log Tracks</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleAddTrack('LOG')} className="cursor-pointer focus:bg-slate-800">
                        <LogIn className="w-3.5 h-3.5 mr-2 text-slate-400" /> Standard Log Track
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuLabel className="text-xs text-slate-500">Depth Tracks</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleAddTrack(DEPTH_TYPES.MD)} className="cursor-pointer focus:bg-slate-800">
                        <Ruler className="w-3.5 h-3.5 mr-2 text-blue-400" /> Measured Depth (MD)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddTrack(DEPTH_TYPES.TVD)} className="cursor-pointer focus:bg-slate-800">
                        <ArrowRight className="w-3.5 h-3.5 mr-2 text-emerald-400 rotate-90" /> True Vertical Depth (TVD)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAddTrack(DEPTH_TYPES.TVDSS)} className="cursor-pointer focus:bg-slate-800">
                        <Waves className="w-3.5 h-3.5 mr-2 text-purple-400" /> Sub-Sea (TVDSS)
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>

      <ScrollArea className="flex-1 p-2">
        <Accordion type="single" collapsible className="space-y-2">
          {tracks.map((track) => (
            <AccordionItem key={track.id} value={track.id} className="border border-slate-800 rounded-md bg-slate-900/50 overflow-hidden">
              <div className="flex items-center px-2 hover:bg-slate-800/50 transition-colors rounded-t-md group">
                <GripVertical className="w-4 h-4 text-slate-700 group-hover:text-slate-500 cursor-move transition-colors" />
                <AccordionTrigger className="hover:no-underline py-2 text-xs flex-1 px-2">
                  <div className="flex items-center gap-2 w-full overflow-hidden">
                      <div className="flex-shrink-0">{getTrackIcon(track)}</div>
                      <span className="font-medium truncate text-slate-300">{track.title}</span>
                  </div>
                </AccordionTrigger>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-slate-600 hover:text-red-400 hover:bg-slate-950/50 transition-colors"
                  onClick={(e) => { e.stopPropagation(); removeTrack(track.id); }}
                  aria-label={`Remove ${track.title}`}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              
              <AccordionContent className="px-3 pb-3 space-y-4 bg-slate-950/30 border-t border-slate-800/50 pt-3">
                <div className="space-y-2">
                  <Label className="text-[10px] text-slate-400 uppercase tracking-wider">Title</Label>
                  <Input 
                    value={track.title} 
                    onChange={(e) => updateTrack(track.id, { ...track, title: e.target.value })}
                    className="h-7 text-xs bg-slate-950 border-slate-700 focus:ring-blue-900 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <Label className="text-[10px] text-slate-400 uppercase tracking-wider">Width ({track.width}px)</Label>
                    <div className="flex gap-1">
                      <button onClick={() => setPresetWidth(track.id, 'narrow')} className="text-[9px] px-1.5 py-0.5 bg-slate-800 rounded hover:bg-slate-700 border border-slate-700 transition-colors">N</button>
                      <button onClick={() => setPresetWidth(track.id, 'normal')} className="text-[9px] px-1.5 py-0.5 bg-slate-800 rounded hover:bg-slate-700 border border-slate-700 transition-colors">M</button>
                      <button onClick={() => setPresetWidth(track.id, 'wide')} className="text-[9px] px-1.5 py-0.5 bg-slate-800 rounded hover:bg-slate-700 border border-slate-700 transition-colors">W</button>
                    </div>
                  </div>
                  <Slider 
                    value={[track.width]} 
                    min={30} 
                    max={500} 
                    step={10}
                    onValueChange={([val]) => updateTrack(track.id, { ...track, width: val })}
                    className="flex-1 py-1"
                  />
                </div>

                {track.type === 'LOG' && (
                    <>
                        <div className="flex items-center justify-between">
                            <Label className="text-[10px] text-slate-400 uppercase tracking-wider">Scale Type</Label>
                            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded border border-slate-800">
                                <span className={`text-[10px] px-1 transition-colors ${track.scale === 'linear' ? 'text-white font-bold' : 'text-slate-600'}`}>Lin</span>
                                <Switch 
                                checked={track.scale === 'log'}
                                onCheckedChange={(c) => updateTrack(track.id, { ...track, scale: c ? 'log' : 'linear' })}
                                className="scale-75 data-[state=checked]:bg-purple-600"
                                />
                                <span className={`text-[10px] px-1 transition-colors ${track.scale === 'log' ? 'text-white font-bold' : 'text-slate-600'}`}>Log</span>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-800">
                            <div className="flex justify-between items-center">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase">Logs ({track.logs?.length || 0})</Label>
                                <div className="w-28">
                                    <LogSelectionDropdown onSelect={(mnemonic) => addLogToTrack(track.id, mnemonic)} />
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                {(track.logs || []).map((log, idx) => (
                                    <div key={log.id} className="group bg-slate-900 rounded border border-slate-800 overflow-hidden">
                                        <div 
                                            className="flex items-center justify-between p-2 hover:bg-slate-800 cursor-pointer transition-all"
                                            onClick={() => setEditingLogId(editingLogId === log.id ? null : log.id)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: log.color }} />
                                                <span className="text-xs font-medium text-slate-300">{log.mnemonic}</span>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-5 w-5 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100"
                                                onClick={(e) => { e.stopPropagation(); setEditingLogId(editingLogId === log.id ? null : log.id); }}
                                            >
                                                <Settings className="w-3 h-3" />
                                            </Button>
                                        </div>
                                        
                                        {editingLogId === log.id && (
                                            <div className="p-2 bg-slate-950/50 border-t border-slate-800 space-y-3">
                                                <LogCustomizationPanel 
                                                    log={log} 
                                                    onChange={(key, value) => updateLogSettings(track.id, log.id, { [key]: value })}
                                                    onRemove={() => {
                                                        removeLogFromTrack(track.id, log.id);
                                                        setEditingLogId(null);
                                                    }}
                                                />
                                                <LogCurveFillPanel 
                                                    log={log}
                                                    otherLogs={track.logs}
                                                    onUpdate={(fillSettings) => updateLogSettings(track.id, log.id, { fill: fillSettings })}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                
                                {(track.logs || []).length === 0 && (
                                    <div className="text-center p-3 text-[10px] text-slate-600 bg-slate-900/20 rounded border border-dashed border-slate-800">
                                        No logs added. Add a log to display curves.
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>

      <LogImportDialog open={importOpen} onOpenChange={setImportOpen} onImport={handleImportLogs} />
    </div>
  );
};

export default TrackConfiguration;