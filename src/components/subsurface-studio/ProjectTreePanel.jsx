import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase as customSupabaseClient } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useStudio } from '@/contexts/StudioContext';
import {
  ChevronRight, ChevronDown, File, Folder, Map, BarChart2, Grid, Layers, PlusCircle, Trash2, Edit, UploadCloud, MoreVertical, Search, X, Target, FileText, LineChart, Cpu, Scissors, Milestone, Shapes, Clock, Eye, EyeOff
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Slider } from '@/components/ui/slider';
import { useDrag, useDrop } from 'react-dnd';

import SeismicImportWizard from './SeismicImportWizard';
import WellDataImportWizard from './WellDataImportWizard';
import InterpretationImportWizard from './InterpretationImportWizard';
import ModelImportWizard from './ModelImportWizard';
import SurfaceImportWizard from './SurfaceImportWizard';
import PointsetImportWizard from './PointsetImportWizard';
import PolygonImportWizard from './PolygonImportWizard';
import NewLogDialog from './NewLogDialog';
import NewSurveyDialog from './NewSurveyDialog';
import NewTopDialog from './NewTopDialog';
import NewTrajectoryDialog from './NewTrajectoryDialog';
import NewTimeDepthDialog from './NewTimeDepthDialog';

const ItemTypes = { ASSET: 'asset', INTERPRETATION: 'interpretation' };

const getIcon = (type, kind) => {
  const iconClass = "w-4 h-4 mr-2 shrink-0";
  if (kind) {
    switch (kind) {
      case 'horizon': return <Layers className={iconClass} style={{ color: '#34D399' }} />;
      case 'fault': return <Grid className={iconClass} style={{ color: '#F87171' }} />;
      default: return <Layers className={iconClass} />;
    }
  }
  switch (type) {
    case 'well': return <Target className={iconClass} style={{ color: '#93C5FD' }} />;
    case 'survey': return <LineChart className={iconClass} style={{ color: '#A5B4FC' }} />;
    case 'logs': return <FileText className={iconClass} style={{ color: '#60A5FA' }} />;
    case 'log': return <FileText className={iconClass} style={{ color: '#60A5FA' }} />;
    case 'tops': return <Milestone className={iconClass} style={{ color: '#A5B4FC' }} />;
    case 'top': return <Milestone className={iconClass} style={{ color: '#A5B4FC' }} />;
    case 'trajectory': return <Milestone className={iconClass} style={{ color: '#93C5FD' }} />;
    case 'time-depth': return <Clock className={iconClass} style={{ color: '#FCD34D' }} />;
    case 'seismic':
    case 'seis.tiles':
    case 'seis.volume': return <BarChart2 className={iconClass} style={{ color: '#FBBF24' }} />;
    case 'section': return <Scissors className={iconClass} style={{ color: '#A78BFA' }} />;
    case 'grid': return <Grid className={iconClass} style={{ color: '#F472B6' }} />;
    case 'map': return <Map className={iconClass} style={{ color: '#818CF8' }} />;
    case 'folder': return <Folder className={iconClass} style={{ color: '#C4B5FD' }} />;
    case 'model': return <Cpu className={iconClass} style={{ color: '#F472B6' }} />;
    case 'surface': return <Layers className={iconClass} style={{ color: '#34D399' }} />;
    case 'cross-section': return <Scissors className={iconClass} style={{ color: '#A78BFA' }} />;
    case 'pointset': return <Milestone className={iconClass} style={{ color: '#FBCFE8' }} />;
    case 'polygon': return <Shapes className={iconClass} style={{ color: '#FDBA74' }} />;
    default: return <File className={iconClass} />;
  }
};

const SectionControl = ({ volume, sectionType }) => {
  const { meta } = volume;
  const { selectAssetAndParentWell, activeSyntheticAsset } = useStudio();
  const typeMap = {
    inline: { min: meta.il_min, max: meta.il_max, label: 'Inline' },
    crossline: { min: meta.xl_min, max: meta.xl_max, label: 'Crossline' },
    'z-slice': { min: Math.round(meta.z_min || 0), max: Math.round(meta.z_max || meta.nsamp * meta.dt_ms), label: 'Time Slice', unit: 'ms' },
  };

  const config = typeMap[sectionType];
  const syntheticId = `${volume.id}-${sectionType}`;
  const isSectionVisible = activeSyntheticAsset?.id.startsWith(syntheticId);
  
  const [value, setValue] = useState(activeSyntheticAsset?.meta?.index || config.min || 0);
  const [step, setStep] = useState(sectionType === 'z-slice' ? Math.round(meta.dt_ms) : 1);

  const createSyntheticAsset = (index) => ({
      id: `${syntheticId}-${index}`,
      name: `${config.label} ${index}`,
      type: 'section',
      parent_id: volume.id,
      isSynthetic: true,
      meta: { sectionType: sectionType, index: index, parentVolumeMeta: volume.meta }
  });

  const handleValueChange = (newValue) => {
    setValue(newValue);
    if (isSectionVisible) {
      selectAssetAndParentWell(createSyntheticAsset(newValue), { activateTab: 'Seismic' });
    }
  };

  useEffect(() => {
    if (isSectionVisible) {
        if(value !== activeSyntheticAsset.meta.index) {
             setValue(activeSyntheticAsset.meta.index);
        }
    }
  }, [activeSyntheticAsset, isSectionVisible, value]);

  const handleToggle = () => {
    if (isSectionVisible) {
        selectAssetAndParentWell(null);
    } else {
        selectAssetAndParentWell(createSyntheticAsset(value), { activateTab: 'Seismic' });
    }
  };
  
  if (config.min === undefined || config.max === undefined) return null;

  return (
    <div className="pl-4 pr-2 pb-2 pt-1 bg-slate-800/30 border-l-2 border-transparent data-[visible=true]:border-lime-400" data-visible={isSectionVisible}>
      <div className="flex items-center justify-between">
          <Label className="text-xs text-slate-300 font-semibold">{config.label}</Label>
          <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-6 w-6 shrink-0 ${isSectionVisible ? 'text-lime-400' : 'text-slate-500'} hover:bg-slate-700`}
                        onClick={handleToggle}
                    >
                        {isSectionVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                </TooltipTrigger>
                <TooltipContent><p>{isSectionVisible ? 'Hide Section' : 'Show Section'}</p></TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <Slider
          min={config.min}
          max={config.max}
          step={step}
          value={[value]}
          onValueChange={([val]) => handleValueChange(val)}
          className="flex-grow"
        />
        <Input
          type="number"
          className="w-20 h-7 bg-slate-700 border-slate-600 text-xs"
          value={value}
          onChange={(e) => handleValueChange(parseInt(e.target.value, 10) || config.min)}
          min={config.min}
          max={config.max}
        />
      </div>
       <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
        <span>{config.min}{config.unit}</span>
        <div className="flex items-center gap-2">
            <Label htmlFor={`step-${volume.id}-${sectionType}`} className="text-xs">Step:</Label>
            <Input 
              id={`step-${volume.id}-${sectionType}`}
              type="number"
              value={step}
              onChange={(e) => setStep(Math.max(1, parseInt(e.target.value,10) || 1))}
              className="w-14 h-6 bg-slate-700 border-slate-600 text-xs"
            />
        </div>
        <span>{config.max}{config.unit}</span>
      </div>
    </div>
  );
};


const TreeItem = ({ item, level, onSelect, onToggleVisibility, isActive, isVisible, onRename, onDelete, onMove, onCreate, onImport, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: [ItemTypes.ASSET, ItemTypes.INTERPRETATION],
    drop(draggedItem) {
      if (item.type === 'folder' || item.type === 'well') onMove(draggedItem, item.id);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: item.kind ? ItemTypes.INTERPRETATION : ItemTypes.ASSET,
    item: { ...item, type: item.kind ? ItemTypes.INTERPRETATION : ItemTypes.ASSET },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  drag(drop(ref));
  const hasChildren = item.children && item.children.length > 0;
  const isSeismicVolume = item.type === 'seis.volume';
  const canBeVisible = !item.isSyntheticFolder;
  const canBeDeleted = !item.isSyntheticFolder;
  const canBeRenamed = !item.isSyntheticFolder;

  return (
    <div style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div
        ref={ref}
        className={`flex items-center rounded-md cursor-pointer text-sm transition-colors group ${isActive ? 'bg-blue-600/20 text-white' : 'hover:bg-slate-700/50 text-slate-300'}`}
        style={{ paddingLeft: `${level * 1}rem` }}
        onClick={() => onSelect(item)}
      >
        <div className="flex items-center flex-grow py-1">
          {hasChildren || isSeismicVolume ? (
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="mr-1 p-0.5 rounded hover:bg-slate-600">
              {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : <div className="w-4 mr-1" />}
          {getIcon(item.type, item.kind)}
          <span className="truncate flex-grow">{item.name}</span>
        </div>
        <div className="flex items-center shrink-0 pr-1">
          {canBeVisible && (
            <TooltipProvider><Tooltip><TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className={`h-6 w-6 ${isVisible ? 'text-lime-400' : 'text-slate-500'} hover:bg-slate-700`} onClick={(e) => { e.stopPropagation(); onToggleVisibility(item); }}>
                {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
            </TooltipTrigger><TooltipContent><p>{isVisible ? 'Hide' : 'Show'}</p></TooltipContent></Tooltip>
          </TooltipProvider>
          )}
          <ItemMenu item={item} onRename={canBeRenamed ? onRename : null} onDelete={canBeDeleted ? onDelete : null} onCreate={onCreate} onImport={onImport} />
        </div>
      </div>
      {isOpen && isSeismicVolume && (
          <div>
            <SectionControl volume={item} sectionType="inline" />
            <SectionControl volume={item} sectionType="crossline" />
            <SectionControl volume={item} sectionType="z-slice" />
          </div>
      )}
      {isOpen && hasChildren && <div>{children}</div>}
    </div>
  );
};

const ItemMenu = ({ item, onRename, onDelete, onCreate, onImport }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:bg-slate-700" onClick={e => e.stopPropagation()}><MoreVertical className="w-4 h-4" /></Button>
    </PopoverTrigger>
    <PopoverContent className="w-48 bg-slate-800 border-slate-700 text-white p-1" onClick={e => e.stopPropagation()}>
      {item.type === 'folder' && item.name === 'Logs' && onCreate && <Button variant="ghost" className="w-full justify-start" size="sm" onClick={() => onCreate('log', item)}><PlusCircle className="w-4 h-4 mr-2" />New Log</Button>}
      {item.type === 'folder' && item.name === 'Surveys' && onCreate && <Button variant="ghost" className="w-full justify-start" size="sm" onClick={() => onCreate('survey', item)}><PlusCircle className="w-4 h-4 mr-2" />New Survey</Button>}
      {item.type === 'folder' && item.name === 'Tops' && onCreate && <Button variant="ghost" className="w-full justify-start" size="sm" onClick={() => onCreate('top', item)}><PlusCircle className="w-4 h-4 mr-2" />New Top</Button>}
      {item.type === 'folder' && item.name === 'Trajectories' && onCreate && <Button variant="ghost" className="w-full justify-start" size="sm" onClick={() => onCreate('trajectory', item)}><PlusCircle className="w-4 h-4 mr-2" />New Trajectory</Button>}
      {item.type === 'folder' && item.name === 'Time-Depth' && onCreate && <Button variant="ghost" className="w-full justify-start" size="sm" onClick={() => onCreate('time-depth', item)}><PlusCircle className="w-4 h-4 mr-2" />New Time-Depth</Button>}

      {item.type === 'well' && onImport && <Button variant="ghost" className="w-full justify-start" size="sm" onClick={() => onImport(item)}><UploadCloud className="w-4 h-4 mr-2" />Import Data</Button>}

      {onRename && <Button variant="ghost" className="w-full justify-start" size="sm" onClick={() => onRename(item)}><Edit className="w-4 h-4 mr-2" />Rename</Button>}
      {onDelete && <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-400 hover:bg-red-900/50" size="sm" onClick={() => onDelete(item)}><Trash2 className="w-4 h-4 mr-2" />Delete</Button>}
    </PopoverContent>
  </Popover>
);

const NewWellDialog = ({ open, onOpenChange, onSave }) => {
  const [name, setName] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [kb, setKb] = useState('');

  const handleSave = () => {
    onSave({ name, location: [parseFloat(y), parseFloat(x)], kb: parseFloat(kb) });
    setName(''); setX(''); setY(''); setKb('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create New Well</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="well-name" className="text-right">Name</Label>
            <Input id="well-name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="well-x" className="text-right">Surface X</Label>
            <Input id="well-x" type="number" value={x} onChange={e => setX(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="well-y" className="text-right">Surface Y</Label>
            <Input id="well-y" type="number" value={y} onChange={e => setY(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="well-kb" className="text-right">KB (elev)</Label>
            <Input id="well-kb" type="number" value={kb} onChange={e => setKb(e.target.value)} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Create Well</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProjectTreePanel = ({ width, isResizing }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    activeProject, allAssets, setAllAssets, allInterpretations, setAllInterpretations,
    selectedAssetId, visibleAssetIds, selectAssetAndParentWell, activeSyntheticAsset, toggleAssetVisibility
  } = useStudio();
  const projectId = activeProject?.id;

  const [searchTerm, setSearchTerm] = useState('');
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToRename, setItemToRename] = useState(null);
  const [newName, setNewName] = useState('');
  const [isSeismicWizardOpen, setSeismicWizardOpen] = useState(false);
  const [isWellDataWizardOpen, setWellDataWizardOpen] = useState(false);
  const [isInterpWizardOpen, setInterpWizardOpen] = useState(false);
  const [isModelWizardOpen, setModelWizardOpen] = useState(false);
  const [isSurfaceWizardOpen, setSurfaceWizardOpen] = useState(false);
  const [isPointsetWizardOpen, setPointsetWizardOpen] = useState(false);
  const [isPolygonWizardOpen, setPolygonWizardOpen] = useState(false);
  const [isNewWellModalOpen, setNewWellModalOpen] = useState(false);
  const [isNewLogModalOpen, setNewLogModalOpen] = useState(false);
  const [isNewSurveyModalOpen, setNewSurveyModalOpen] = useState(false);
  const [isNewTopModalOpen, setNewTopModalOpen] = useState(false);
  const [isNewTrajectoryModalOpen, setNewTrajectoryModalOpen] = useState(false);
  const [isNewTimeDepthModalOpen, setNewTimeDepthModalOpen] = useState(false);
  const [creationParent, setCreationParent] = useState(null);
  const [importParent, setImportParent] = useState(null);

  const handleSelect = (item) => {
    selectAssetAndParentWell(item, {
      activateTab: item.type === 'well' || item.type === 'log' || item.type === 'logs' ? 'Crossplot' : undefined
    });
  };
  
  const currentSelectedId = activeSyntheticAsset?.id || selectedAssetId;

  const handleRename = (item) => { setItemToRename(item); setNewName(item.name); };
  const handleDelete = (item) => setItemToDelete(item);

  const submitRename = async () => {
    if (!itemToRename || !newName) return;
    const isInterp = !!itemToRename.kind;
    const tableName = isInterp ? 'ss_interpretations' : 'ss_assets';
    const { error } = await customSupabaseClient.from(tableName).update({ name: newName }).eq('id', itemToRename.id);
    if (error) { toast({ variant: 'destructive', title: 'Rename failed', description: error.message }); }
    else {
      const updater = isInterp ? setAllInterpretations : setAllAssets;
      updater(prev => prev.map(i => i.id === itemToRename.id ? { ...i, name: newName } : i));
      toast({ title: 'Renamed successfully' });
    }
    setItemToRename(null); setNewName('');
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    const isInterp = !!itemToDelete.kind;
    const tableName = isInterp ? 'ss_interpretations' : 'ss_assets';
    const { error } = await customSupabaseClient.from(tableName).update({ deleted_at: new Date().toISOString() }).eq('id', itemToDelete.id);
    if (error) { toast({ variant: 'destructive', title: 'Delete failed', description: error.message }); }
    else {
      const updater = isInterp ? setAllInterpretations : setAllAssets;
      updater(prev => prev.filter(i => i.id !== itemToDelete.id));
      toast({ title: 'Deleted successfully' });
    }
    setItemToDelete(null);
  };

  const handleMove = async (draggedItem, targetGroupId) => {
    if (!targetGroupId || draggedItem.parent_id === targetGroupId) return;
    const { error } = await customSupabaseClient.from('ss_assets').update({ parent_id: targetGroupId }).eq('id', draggedItem.id);
    if (error) { toast({ variant: 'destructive', title: 'Move failed', description: error.message }); }
    else {
      setAllAssets(prev => prev.map(a => a.id === draggedItem.id ? { ...a, parent_id: targetGroupId } : a));
      toast({ title: `Moved '${draggedItem.name}'` });
    }
  };

  const createNewWell = async (wellData) => {
    if (!projectId || projectId === 'local-project') { toast({ variant: 'destructive', title: 'Cannot create well in demo project.' }); return; }
    const { data, error } = await customSupabaseClient.from('ss_assets').insert({ project_id: projectId, created_by: user.id, name: wellData.name, type: 'well', meta: { location: wellData.location, kb: wellData.kb } }).select();
    if (error) { toast({ variant: 'destructive', title: 'Failed to create well', description: error.message }); }
    else {
      setAllAssets(prev => [...prev, ...data]);
      toast({ title: 'New well created' });
      setNewWellModalOpen(false);
    }
  };

  const handleCreate = (type, parent) => {
    setCreationParent(parent);
    if (type === 'log') setNewLogModalOpen(true);
    else if (type === 'survey') setNewSurveyModalOpen(true);
    else if (type === 'top') setNewTopModalOpen(true);
    else if (type === 'trajectory') setNewTrajectoryModalOpen(true);
    else if (type === 'time-depth') setNewTimeDepthModalOpen(true);
  };

  const handleCreateComplete = (newAsset) => {
    setAllAssets(prev => [...prev, newAsset]);
    setCreationParent(null);
  };

  const handleImport = (parentItem) => {
    setImportParent(parentItem);
    if (parentItem?.type === 'well') setWellDataWizardOpen(true);
    else setSeismicWizardOpen(true);
  };

  const handleImportComplete = (newItem) => {
    if (newItem.kind) setAllInterpretations(prev => [...prev, newItem]);
    else setAllAssets(prev => Array.isArray(newItem) ? [...prev, ...newItem] : [...prev, newItem]);
    setImportParent(null);
  };

  const assetTree = useMemo(() => {
    const assets = (allAssets || []);
    const interpretations = (allInterpretations || []);

    const filteredAssets = assets.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const filteredInterpretations = interpretations.filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const wells = filteredAssets.filter(a => a.type === 'well');
    const seismicVolumes = filteredAssets.filter(a => a.type === 'seis.volume');
    const otherAssets = filteredAssets.filter(a => !a.parent_id && a.type !== 'well' && a.type !== 'seis.volume');
    
    const wellTree = wells.map(well => {
      const children = assets.filter(a => a.parent_id === well.id);
      const childTypes = [
        { name: 'Logs', type: 'logs' },
        { name: 'Surveys', type: 'survey' },
        { name: 'Tops', type: 'tops' },
        { name: 'Trajectories', type: 'trajectory' },
        { name: 'Time-Depth', type: 'time-depth' }
      ];

      const wellChildren = childTypes.map(folder => {
        const folderChildren = children.filter(c => c.type === folder.type || c.type === folder.type.slice(0, -1));
        return {
          id: `${well.id}-${folder.name.toLowerCase()}`,
          name: folder.name,
          type: 'folder',
          isSyntheticFolder: true,
          children: folderChildren,
          well_id: well.id
        };
      }).filter(folder => folder.children.length > 0);

      return { ...well, children: wellChildren };
    });

    const finalWellTree = searchTerm ? wellTree.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()) || w.children.some(f => f.children.length > 0)) : wellTree;

    return {
      wells: finalWellTree,
      seismic: seismicVolumes,
      seismicInterpretation: filteredInterpretations,
      models: otherAssets.filter(a => a.type === 'model'),
      surfaces: otherAssets.filter(a => a.type === 'surface'),
      crossSections: otherAssets.filter(a => a.type === 'cross-section'),
      pointsets: otherAssets.filter(a => a.type === 'pointset'),
      polygons: otherAssets.filter(a => a.type === 'polygon'),
    };
  }, [allAssets, allInterpretations, searchTerm]);

  const renderTree = useCallback((items, level = 0) => {
    return items.map(item => (
      <TreeItem
        key={item.id}
        item={item}
        level={level}
        onSelect={handleSelect}
        onToggleVisibility={toggleAssetVisibility}
        isActive={currentSelectedId === item.id}
        isVisible={visibleAssetIds.has(item.id)}
        onRename={handleRename}
        onDelete={handleDelete}
        onMove={handleMove}
        onCreate={handleCreate}
        onImport={handleImport}
      >
        {item.children && renderTree(item.children, level + 1)}
      </TreeItem>
    ));
  }, [currentSelectedId, visibleAssetIds, toggleAssetVisibility]);

  const renderEmptyState = (text) => (
    <div className="text-center text-slate-500 py-4 text-sm">{text}</div>
  );

  return (
    <aside className="h-full bg-slate-900 text-white flex flex-col shrink-0" style={{ width, transition: isResizing ? 'none' : 'width 0.2s ease-in-out' }}>
      <div className="p-2 border-b border-slate-700 shrink-0">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search assets..." className="bg-slate-800 border-slate-700 pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={!projectId} />
          {searchTerm && <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setSearchTerm('')}><X className="w-4 h-4" /></Button>}
        </div>
      </div>

      <ScrollArea className="flex-grow">
        <div className="p-2 space-y-2">
          <CollapsibleSection title="Wells" onAdd={() => setNewWellModalOpen(true)} addTooltip="New Well">
            {assetTree.wells.length > 0 ? renderTree(assetTree.wells) : renderEmptyState("No wells.")}
          </CollapsibleSection>
          <CollapsibleSection title="Seismic" onAdd={() => handleImport(null)} addTooltip="New Seismic">
            {assetTree.seismic.length > 0 ? renderTree(assetTree.seismic) : renderEmptyState("No seismic data.")}
          </CollapsibleSection>
          <CollapsibleSection title="Seismic Interpretation" onAdd={() => setInterpWizardOpen(true)} addTooltip="New Interpretation">
            {assetTree.seismicInterpretation.length > 0 ? renderTree(assetTree.seismicInterpretation) : renderEmptyState("No interpretations.")}
          </CollapsibleSection>
          <CollapsibleSection title="Models" onAdd={() => setModelWizardOpen(true)} addTooltip="New Model">
            {assetTree.models.length > 0 ? renderTree(assetTree.models) : renderEmptyState("No models.")}
          </CollapsibleSection>
          <CollapsibleSection title="Surfaces" onAdd={() => setSurfaceWizardOpen(true)} addTooltip="New Surface">
            {assetTree.surfaces.length > 0 ? renderTree(assetTree.surfaces) : renderEmptyState("No surfaces.")}
          </CollapsibleSection>
          <CollapsibleSection title="Cross Sections">
            {assetTree.crossSections.length > 0 ? renderTree(assetTree.crossSections) : renderEmptyState("No cross sections.")}
          </CollapsibleSection>
          <CollapsibleSection title="Pointset" onAdd={() => setPointsetWizardOpen(true)} addTooltip="New Pointset">
            {assetTree.pointsets.length > 0 ? renderTree(assetTree.pointsets) : renderEmptyState("No pointsets.")}
          </CollapsibleSection>
          <CollapsibleSection title="Polygon" onAdd={() => setPolygonWizardOpen(true)} addTooltip="New Polygon">
            {assetTree.polygons.length > 0 ? renderTree(assetTree.polygons) : renderEmptyState("No polygons.")}
          </CollapsibleSection>
        </div>
      </ScrollArea>

      <div className="p-2 border-t border-slate-700 shrink-0">
        <Button variant="outline" className="w-full justify-center" disabled={!projectId} onClick={() => handleImport(null)}>
          <UploadCloud className="w-4 h-4 mr-2" />
          Import Data
        </Button>
      </div>

      <SeismicImportWizard open={isSeismicWizardOpen} onOpenChange={setSeismicWizardOpen} projectId={projectId} onImportComplete={handleImportComplete} />
      <WellDataImportWizard open={isWellDataWizardOpen} onOpenChange={setWellDataWizardOpen} projectId={projectId} onImportComplete={handleImportComplete} parentWell={importParent} />
      <InterpretationImportWizard open={isInterpWizardOpen} onOpenChange={setInterpWizardOpen} projectId={projectId} onImportComplete={handleImportComplete} />
      <ModelImportWizard open={isModelWizardOpen} onOpenChange={setModelWizardOpen} projectId={projectId} onImportComplete={handleImportComplete} />
      <SurfaceImportWizard open={isSurfaceWizardOpen} onOpenChange={setSurfaceWizardOpen} projectId={projectId} onImportComplete={handleImportComplete} />
      <PointsetImportWizard open={isPointsetWizardOpen} onOpenChange={setPointsetWizardOpen} projectId={projectId} onImportComplete={handleImportComplete} />
      <PolygonImportWizard open={isPolygonWizardOpen} onOpenChange={setPolygonWizardOpen} projectId={projectId} onImportComplete={handleImportComplete} />
      <NewWellDialog open={isNewWellModalOpen} onOpenChange={setNewWellModalOpen} onSave={createNewWell} />
      <NewLogDialog open={isNewLogModalOpen} onOpenChange={setNewLogModalOpen} projectId={projectId} parentWell={allAssets.find(a => a.id === creationParent?.well_id)} onCreateComplete={handleCreateComplete} />
      <NewSurveyDialog open={isNewSurveyModalOpen} onOpenChange={setNewSurveyModalOpen} projectId={projectId} parentWell={allAssets.find(a => a.id === creationParent?.well_id)} onCreateComplete={handleCreateComplete} />
      <NewTopDialog open={isNewTopModalOpen} onOpenChange={setNewTopModalOpen} projectId={projectId} parentWell={allAssets.find(a => a.id === creationParent?.well_id)} onCreateComplete={handleCreateComplete} />
      <NewTrajectoryDialog open={isNewTrajectoryModalOpen} onOpenChange={setNewTrajectoryModalOpen} projectId={projectId} parentWell={allAssets.find(a => a.id === creationParent?.well_id)} onCreateComplete={handleCreateComplete} />
      <NewTimeDepthDialog open={isNewTimeDepthModalOpen} onOpenChange={setNewTimeDepthModalOpen} projectId={projectId} parentWell={allAssets.find(a => a.id === creationParent?.well_id)} onCreateComplete={handleCreateComplete} />

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the item '{itemToDelete?.name}'.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!itemToRename} onOpenChange={(open) => !open && setItemToRename(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Item</AlertDialogTitle>
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="mt-4" />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToRename(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={submitRename}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
};

const CollapsibleSection = ({ title, children, onAdd, addTooltip }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <div className="flex justify-between items-center cursor-pointer p-2 bg-slate-800/50 rounded-t-md" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center">
          {isOpen ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
          <span className="font-semibold text-slate-200">{title}</span>
        </div>
        {onAdd && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:bg-slate-600" onClick={(e) => { e.stopPropagation(); onAdd(); }}>
                  <PlusCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>{addTooltip}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {isOpen && <div className="p-1 bg-slate-800/20 rounded-b-md">{children}</div>}
    </div>
  );
};

export default ProjectTreePanel;