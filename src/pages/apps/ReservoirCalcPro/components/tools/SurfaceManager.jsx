import React, { useState, useMemo } from 'react';
import { useReservoirCalc } from '../../contexts/ReservoirCalcContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, Trash2, Plus, Edit2 } from 'lucide-react';
import SurfaceImportDialog from './SurfaceImportDialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const SurfaceManager = () => {
    const { state, addSurface, deleteSurface, dispatch } = useReservoirCalc();
    const { toast } = useToast();
    const [isImportOpen, setImportOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    // CRITICAL FIX: Safely handle surfaces as Object or Array
    // This prevents "state.surfaces.map is not a function" error
    const surfacesList = useMemo(() => {
        if (!state.surfaces) return [];
        if (Array.isArray(state.surfaces)) return state.surfaces;
        return Object.values(state.surfaces);
    }, [state.surfaces]);

    const surfaceCount = surfacesList.length;

    const handleDelete = (id) => {
        deleteSurface(id);
        toast({ title: "Surface Deleted", description: "Surface removed from project." });
    };

    const startEdit = (surface) => {
        setEditingId(surface.id);
        setEditName(surface.name);
    };

    const saveEdit = () => {
        if (editingId && editName && dispatch) {
            const surface = state.surfaces[editingId];
            if (surface) {
                dispatch({ 
                    type: 'ADD_SURFACE', 
                    payload: { ...surface, name: editName } 
                });
            }
            setEditingId(null);
        }
    };

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-blue-400" /> Surface Manager
                </h2>
                <Button size="sm" onClick={() => setImportOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" /> Import
                </Button>
            </div>

            <Card className="flex-1 bg-slate-900 border-slate-800 overflow-hidden flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400 font-medium uppercase tracking-wider">
                        Imported Surfaces ({surfaceCount})
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-full">
                        <div className="p-4 space-y-2">
                            {surfaceCount === 0 ? (
                                <div className="text-center text-slate-500 py-8 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center">
                                    <Layers className="w-8 h-8 mb-2 opacity-50" />
                                    <p>No surfaces loaded.</p>
                                    <p className="text-xs mt-1">Import a .csv, .txt or .zmap file to get started.</p>
                                </div>
                            ) : (
                                surfacesList.map(surface => (
                                    <div key={surface.id} className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800 hover:border-slate-700 transition-colors group">
                                        <div className="flex-1">
                                            {editingId === surface.id ? (
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        autoFocus
                                                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm text-white w-full"
                                                        value={editName}
                                                        onChange={e => setEditName(e.target.value)}
                                                        onBlur={saveEdit}
                                                        onKeyDown={e => e.key === 'Enter' && saveEdit()}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-200 flex items-center gap-2">
                                                        {surface.name}
                                                        <Edit2 
                                                            className="w-3 h-3 text-slate-600 cursor-pointer opacity-0 group-hover:opacity-100 hover:text-blue-400 transition-all" 
                                                            onClick={() => startEdit(surface)}
                                                        />
                                                    </span>
                                                    <div className="flex gap-2 mt-1">
                                                        <Badge variant="outline" className="text-[10px] px-1 py-0 text-slate-500 border-slate-800">{surface.format || 'grid'}</Badge>
                                                        <span className="text-[10px] text-slate-500">
                                                            {surface.points ? surface.points.length.toLocaleString() : '0'} pts
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-slate-600 hover:text-red-400 hover:bg-red-900/20"
                                            onClick={() => handleDelete(surface.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <SurfaceImportDialog 
                open={isImportOpen} 
                onOpenChange={setImportOpen} 
                onImport={addSurface} 
            />
        </div>
    );
};

export default SurfaceManager;