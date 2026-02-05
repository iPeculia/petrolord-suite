import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, Edit, Trash2, Loader2, Target, Search, Filter, 
  Map as MapIcon, List as ListIcon, MoreHorizontal, ArrowUpDown, Download, Upload, AlertCircle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Papa from 'papaparse';
import TargetDialog from '../components/TargetDialog';
import TargetsMap from '../components/TargetsMap';
import ImportTargetsDialog from '../components/ImportTargetsDialog';

const TargetsTab = ({ wellId, depthUnit }) => {
  const [targets, setTargets] = useState([]);
  const [wellInfo, setWellInfo] = useState({ name: 'Current Well', x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [ppfgProjects, setPpfgProjects] = useState([]);
  
  // Dialog States
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState(null);

  const { user } = useAuth();
  const { toast } = useToast();

  const METERS_TO_FEET = 3.28084;
  const unitLabel = depthUnit === 'meters' ? 'm' : 'ft';
  const convertToDisplay = (value_m) => (depthUnit === 'feet' ? (value_m * METERS_TO_FEET) : value_m);

  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Targets
      const { data: targetsData, error: targetsError } = await supabase
        .from('well_targets')
        .select('*')
        .eq('well_id', wellId)
        .order('priority', { ascending: true }); // High priority (1) first

      if (targetsError) throw targetsError;
      setTargets(targetsData || []);

      // 2. Fetch Well Info (for Map center)
      const { data: wellData, error: wellError } = await supabase
        .from('wells')
        .select('name, surface_x, surface_y')
        .eq('id', wellId)
        .single();
      
      if (!wellError && wellData) {
        setWellInfo({ 
          name: wellData.name, 
          x: parseFloat(wellData.surface_x) || 0, 
          y: parseFloat(wellData.surface_y) || 0 
        });
      }

      // 3. Fetch PPFG Projects (Mock for now or real if table exists)
      // Assuming 'saved_pvt_projects' acts as PPFG placeholder or similar for this demo
      const { data: ppfgData } = await supabase
        .from('saved_pvt_projects') 
        .select('id, project_name')
        .eq('user_id', user.id)
        .limit(5);
      
      setPpfgProjects(ppfgData || []);

    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Error loading data', description: error.message });
    } finally {
      setLoading(false);
    }
  }, [wellId, user.id, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers ---

  const handleSaveTarget = async (targetData) => {
    try {
      const payload = {
        name: targetData.name,
        target_type: targetData.target_type,
        tvd_m: targetData.tvd_m,
        x: targetData.x,
        y: targetData.y,
        priority: targetData.priority,
        notes: targetData.notes,
        well_id: wellId,
        user_id: user.id,
        target_data: targetData.target_data
      };

      let error;
      if (editingTarget) {
        const { error: updateError } = await supabase
          .from('well_targets')
          .update(payload)
          .eq('id', editingTarget.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('well_targets')
          .insert(payload);
        error = insertError;
      }

      if (error) throw error;

      toast({ 
        title: editingTarget ? "Target Updated" : "Target Created", 
        className: "bg-[#4CAF50] text-white border-none"
      });
      setIsEditorOpen(false);
      fetchData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Save Failed', description: error.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this target?')) return;
    const { error } = await supabase.from('well_targets').delete().eq('id', id);
    if (error) {
      toast({ variant: 'destructive', title: 'Delete Failed', description: error.message });
    } else {
      toast({ title: 'Target deleted' });
      setTargets(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleImport = async (importedTargets) => {
    try {
      const payload = importedTargets.map(t => ({
        ...t,
        well_id: wellId,
        user_id: user.id,
        priority: 2, // Medium default
        target_data: { status: 'Active' }
      }));

      const { error } = await supabase.from('well_targets').insert(payload);
      if (error) throw error;
      fetchData();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Import Failed', description: error.message });
    }
  };

  const handleExport = () => {
    const csvData = targets.map(t => ({
        Name: t.name,
        Type: t.target_type,
        TVD: convertToDisplay(t.tvd_m).toFixed(2),
        X: t.x,
        Y: t.y,
        Priority: t.priority === 1 ? 'High' : t.priority === 2 ? 'Medium' : 'Low',
        Status: t.target_data?.status || 'Active',
        Notes: t.notes
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `targets_${new Date().toISOString()}.csv`;
    link.click();
  };

  // --- Filtering & Sorting ---
  const processedTargets = useMemo(() => {
    return targets.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All' || t.target_type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [targets, searchQuery, typeFilter]);

  const priorityColors = { 1: 'bg-red-500/20 text-red-400 border-red-500/30', 2: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', 3: 'bg-green-500/20 text-green-400 border-green-500/30' };
  const priorityLabels = { 1: 'High', 2: 'Medium', 3: 'Low' };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 h-full flex flex-col">
      
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 p-4 rounded-xl border border-slate-800 shrink-0">
        <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                    placeholder="Search targets..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-800 border-slate-700 focus:border-[#4CAF50] focus:ring-[#4CAF50]/20" 
                />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] bg-slate-800 border-slate-700">
                    <Filter className="w-3 h-3 mr-2 text-slate-400" />
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Point">Point</SelectItem>
                    <SelectItem value="Window">Window</SelectItem>
                    <SelectItem value="Plane">Plane</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="flex items-center gap-2">
            <div className="bg-slate-800 rounded-lg p-1 border border-slate-700 flex">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-8 px-3 ${viewMode === 'list' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    onClick={() => setViewMode('list')}
                >
                    <ListIcon className="w-4 h-4 mr-2" /> List
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`h-8 px-3 ${viewMode === 'map' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                    onClick={() => setViewMode('map')}
                >
                    <MapIcon className="w-4 h-4 mr-2" /> Map
                </Button>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                <DropdownMenuItem onClick={handleExport}><Download className="mr-2 h-4 w-4"/> Export CSV</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsImportOpen(true)}><Upload className="mr-2 h-4 w-4"/> Import Targets</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => { setEditingTarget(null); setIsEditorOpen(true); }} size="sm" className="bg-[#4CAF50] hover:bg-[#43a047] text-white font-bold shadow-lg shadow-green-900/20">
                <Plus className="mr-2 h-4 w-4" /> Add Target
            </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden relative min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#4CAF50]" />
            <p>Loading target data...</p>
          </div>
        ) : targets.length === 0 && !searchQuery ? (
          <div className="flex flex-col items-center justify-center h-full py-20 text-center">
            <div className="bg-slate-800 p-6 rounded-full mb-6 ring-1 ring-slate-700"><Target className="h-12 w-12 text-slate-500" /></div>
            <h3 className="text-xl font-semibold text-white">No geological targets found</h3>
            <p className="text-slate-400 mt-2 max-w-sm">Create your first target manually or import from EarthModel Pro.</p>
            <div className="flex gap-4 mt-6">
              <Button onClick={() => { setEditingTarget(null); setIsEditorOpen(true); }} className="bg-[#4CAF50] text-white">Create Manually</Button>
              <Button onClick={() => setIsImportOpen(true)} variant="outline" className="border-slate-700">Import Data</Button>
            </div>
          </div>
        ) : viewMode === 'list' ? (
          <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-700">
            <Table>
              <TableHeader className="bg-slate-900 sticky top-0 z-10">
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400 font-bold w-[250px]">Name</TableHead>
                  <TableHead className="text-slate-400 font-bold">Type</TableHead>
                  <TableHead className="text-slate-400 font-bold text-right">TVD ({unitLabel})</TableHead>
                  <TableHead className="text-slate-400 font-bold text-right">Coordinates (X, Y)</TableHead>
                  <TableHead className="text-slate-400 font-bold text-center">Priority</TableHead>
                  <TableHead className="text-slate-400 font-bold text-center">Reservoir</TableHead>
                  <TableHead className="text-right text-slate-400 w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                {processedTargets.map((target) => (
                  <motion.tr 
                    key={target.id} 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="border-slate-800 hover:bg-slate-800/50 transition-colors group"
                  >
                    <TableCell className="font-medium text-white">
                        <div className="flex flex-col">
                            <span>{target.name}</span>
                            <span className="text-[10px] text-slate-500 truncate max-w-[200px]">{target.notes || 'No notes'}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                        <Badge variant="outline" className="border-slate-700 text-slate-400 font-normal">{target.target_type}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-[#FFC107]">
                        {convertToDisplay(target.tvd_m).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-400 text-xs">
                        {target.x?.toFixed(1)}, {target.y?.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-center">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${priorityColors[target.priority] || priorityColors[3]}`}>
                            {priorityLabels[target.priority] || 'Low'}
                        </span>
                    </TableCell>
                    <TableCell className="text-center text-sm text-slate-300">
                        {target.target_data?.reservoir || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button onClick={() => { setEditingTarget(target); setIsEditorOpen(true); }} variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-700 text-slate-400 hover:text-white">
                              <Edit className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleDelete(target.id)} variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-900/20 text-slate-600 hover:text-red-400">
                              <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                    </TableCell>
                  </motion.tr>
                ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="h-full w-full">
            <TargetsMap 
              targets={processedTargets} 
              wellLocation={wellInfo}
              onTargetSelect={(t) => { setEditingTarget(t); setIsEditorOpen(true); }}
            />
          </div>
        )}
      </div>

      {/* Editor Dialog */}
      <TargetDialog 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)} 
        onSave={handleSaveTarget}
        target={editingTarget}
        ppfgProjects={ppfgProjects}
      />

      {/* Import Dialog */}
      <ImportTargetsDialog 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onImport={handleImport}
      />

    </motion.div>
  );
};

export default TargetsTab;