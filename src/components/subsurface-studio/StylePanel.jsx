import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Palette, Save, Plus, Trash2, Globe } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from '@/contexts/SupabaseAuthContext';

const StylePropertyEditor = ({ title, properties, onUpdate, styleData }) => {
    return (
        <div className="space-y-2 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
            <h4 className="font-semibold text-slate-200">{title}</h4>
            {properties.map(prop => (
                <div key={prop.key}>
                    <Label className="text-xs text-slate-400">{prop.label}</Label>
                    <Input
                        type={prop.type === 'color' ? 'color' : 'number'}
                        value={styleData[prop.key] || prop.default}
                        onChange={e => onUpdate(prop.key, e.target.value)}
                        className={`bg-slate-800 border-slate-600 h-8 text-white ${prop.type === 'color' ? 'p-1 w-full' : ''}`}
                    />
                </div>
            ))}
        </div>
    );
};

const StylePanel = ({ projectId, onApplyStyle, selectedAsset }) => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [styleName, setStyleName] = useState('New Style');
    const [stylePayload, setStylePayload] = useState({
        lines: { color: '#ff0000', width: 2, dash: 'solid' },
        polygons: { fillColor: '#ff0000', fillOpacity: 0.5, outlineColor: '#ffffff', outlineWidth: 1 },
        grids: { colorRamp: 'viridis', min: 0, max: 100, opacity: 0.7 },
        points: { symbol: 'circle', size: 5, color: '#ff0000' }
    });
    const [isGlobal, setIsGlobal] = useState(false);
    const [savedStyles, setSavedStyles] = useState([]);
    const [activeStyleTab, setActiveStyleTab] = useState('lines');

    useEffect(() => {
        if (selectedAsset) {
            if (selectedAsset.type === 'grid') setActiveStyleTab('grids');
            else if (selectedAsset.type === 'pointset') setActiveStyleTab('points');
            else if (selectedAsset.kind === 'horizon' || selectedAsset.kind === 'fault') setActiveStyleTab('lines');
            else if (selectedAsset.type === 'map' || selectedAsset.kind === 'polygon') setActiveStyleTab('polygons');
        }
    }, [selectedAsset]);

    const fetchStyles = useCallback(async () => {
        if (!user || !projectId) {
            setSavedStyles([]);
            return;
        }

        const { data, error } = await supabase
            .from('ss_styles')
            .select('*')
            .or(`project_id.eq.${projectId},created_by.eq.${user.id}`)
            .order('created_at', { ascending: false });

        if (error) {
            toast({ variant: 'destructive', title: 'Failed to fetch styles', description: error.message });
        } else {
            setSavedStyles(data || []);
        }
    }, [projectId, toast, user]);

    useEffect(() => {
        fetchStyles();
        const channel = supabase.channel(`ss_styles_changes_${projectId}`);
        if (channel.state !== 'joined') {
            const subscription = channel.on('postgres_changes', { event: '*', schema: 'public', table: 'ss_styles', filter: `project_id=eq.${projectId}`}, fetchStyles).subscribe();
            return () => supabase.removeChannel(subscription);
        }
    }, [fetchStyles, projectId]);

    const handleStyleUpdate = (category, key, value) => {
        setStylePayload(prev => ({ ...prev, [category]: { ...prev[category], [key]: value } }));
    };

    const handleSaveStyle = async () => {
        if (!styleName) { toast({ variant: 'destructive', title: 'Style name is required.' }); return; }
        if (!projectId && !isGlobal) { toast({ variant: 'destructive', title: 'Select a project or save as a global style.' }); return; }
        if (projectId === 'local-project' && !isGlobal) { toast({ variant: 'destructive', title: 'Cannot save project-specific style for demo project.' }); return; }
        
        const { error } = await supabase.from('ss_styles').insert({
            project_id: projectId, name: styleName, payload: stylePayload, created_by: user.id
        });

        if (error) toast({ variant: 'destructive', title: 'Failed to save style', description: error.message });
        else toast({ title: `Style '${styleName}' saved!` });
    };

    const handleDeleteStyle = async (styleId) => {
        const { error } = await supabase.from('ss_styles').delete().eq('id', styleId);
        if (error) toast({ variant: 'destructive', title: 'Failed to delete style', description: error.message });
        else toast({ title: 'Style deleted.' });
    };
    
    const applyAndSetStyle = (style) => {
        setStylePayload(style.payload);
        setStyleName(style.name);
        onApplyStyle(style);
    }

    const projectStyles = savedStyles.filter(s => s.project_id === projectId);
    const globalStyles = savedStyles.filter(s => s.is_global); // This will be empty with the new query, but leaving UI for now

    const lineProps = [ { key: 'color', label: 'Color', type: 'color', default: '#ff0000' }, { key: 'width', label: 'Width (px)', type: 'number', default: 2 }, ];
    const polyProps = [ { key: 'fillColor', label: 'Fill Color', type: 'color', default: '#ff0000' }, { key: 'fillOpacity', label: 'Opacity (0-1)', type: 'number', default: 0.5 }, { key: 'outlineColor', label: 'Outline Color', type: 'color', default: '#ffffff', }, { key: 'outlineWidth', label: 'Outline Width (px)', type: 'number', default: 1 } ];
    const gridProps = [ { key: 'min', label: 'Min Value', type: 'number', default: 0 }, { key: 'max', label: 'Max Value', type: 'number', default: 100 }, { key: 'opacity', label: 'Opacity (0-1)', type: 'number', default: 0.7 }];
    const pointProps = [ { key: 'size', label: 'Size (px)', type: 'number', default: 5 }, { key: 'color', label: 'Color', type: 'color', default: '#ff0000' }];

    return (
        <div className="w-full">
            <h2 className="text-lg font-bold mb-4 flex items-center"><Palette className="w-5 h-5 mr-2 text-rose-400" /> Style Editor</h2>
            <ScrollArea className="h-[calc(100%-40px)] pr-3">
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Create/Edit Style</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-4">
                                <div>
                                    <Label>Style Name</Label>
                                    <Input value={styleName} onChange={(e) => setStyleName(e.target.value)} className="bg-slate-800 border-slate-600" />
                                </div>

                                <Select value={activeStyleTab} onValueChange={setActiveStyleTab}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="lines">Lines & Horizons</SelectItem>
                                        <SelectItem value="polygons">Polygons & Maps</SelectItem>
                                        <SelectItem value="grids">Grids & Heatmaps</SelectItem>
                                        <SelectItem value="points">Points & Wells</SelectItem>
                                    </SelectContent>
                                </Select>

                                {activeStyleTab === 'lines' && <StylePropertyEditor title="Line Properties" properties={lineProps} onUpdate={(k,v) => handleStyleUpdate('lines', k, v)} styleData={stylePayload.lines} />}
                                {activeStyleTab === 'polygons' && <StylePropertyEditor title="Polygon Properties" properties={polyProps} onUpdate={(k,v) => handleStyleUpdate('polygons', k, v)} styleData={stylePayload.polygons} />}
                                {activeStyleTab === 'grids' && <StylePropertyEditor title="Grid Properties" properties={gridProps} onUpdate={(k,v) => handleStyleUpdate('grids', k, v)} styleData={stylePayload.grids} />}
                                {activeStyleTab === 'points' && <StylePropertyEditor title="Point Properties" properties={pointProps} onUpdate={(k,v) => handleStyleUpdate('points', k, v)} styleData={stylePayload.points} />}

                                <Button onClick={handleSaveStyle} className="w-full bg-lime-600 hover:bg-lime-700 text-white">
                                    <Save className="w-4 h-4 mr-2" /> Save Style
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                        <AccordionTrigger>Saved Styles</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-2">
                                {projectStyles.length === 0 && <p className="text-sm text-slate-400 italic">No saved styles.</p>}
                                {projectStyles.map(style => (
                                    <div key={style.id} className="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700">
                                        <span className="text-sm font-medium">{style.name}</span>
                                        <div className="flex gap-1">
                                            <Button size="xs" variant="ghost" onClick={() => applyAndSetStyle(style)}>Apply</Button>
                                            <Button size="xs" variant="ghost" className="text-red-400" onClick={() => handleDeleteStyle(style.id)}><Trash2 className="w-3 h-3" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </ScrollArea>
        </div>
    );
};

export default StylePanel;