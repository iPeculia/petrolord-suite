import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Plus, Edit, Trash2, Zap } from 'lucide-react';
    import CollapsibleSection from './CollapsibleSection';

    const CasingStringForm = ({ string, onSave, onCancel }) => {
        const [formData, setFormData] = useState(
            string || {
                name: '',
                section_top_md_m: 0,
                shoe_md_m: 0,
                od_in: 9.625,
                weight_lbft: 40,
                grade: 'K-55',
                design_factor_burst: 1.1,
                design_factor_collapse: 1.0,
                design_factor_tension: 1.6,
            }
        );

        const handleChange = (e) => {
            const { name, value, type } = e.target;
            setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
        };

        const handleSave = () => {
            onSave(formData);
        };

        return (
            <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                    <DialogTitle>{string ? 'Edit' : 'Add'} Casing String</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="col-span-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} className="bg-gray-700 border-gray-600" />
                    </div>
                    <div>
                        <Label htmlFor="section_top_md_m">Top MD (m)</Label>
                        <Input id="section_top_md_m" name="section_top_md_m" type="number" value={formData.section_top_md_m} onChange={handleChange} className="bg-gray-700 border-gray-600" />
                    </div>
                    <div>
                        <Label htmlFor="shoe_md_m">Shoe MD (m)</Label>
                        <Input id="shoe_md_m" name="shoe_md_m" type="number" value={formData.shoe_md_m} onChange={handleChange} className="bg-gray-700 border-gray-600" />
                    </div>
                    <div>
                        <Label htmlFor="od_in">OD (in)</Label>
                        <Input id="od_in" name="od_in" type="number" step="0.001" value={formData.od_in} onChange={handleChange} className="bg-gray-700 border-gray-600" />
                    </div>
                    <div>
                        <Label htmlFor="weight_lbft">Weight (lb/ft)</Label>
                        <Input id="weight_lbft" name="weight_lbft" type="number" step="0.1" value={formData.weight_lbft} onChange={handleChange} className="bg-gray-700 border-gray-600" />
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="grade">Grade</Label>
                        <Input id="grade" name="grade" value={formData.grade} onChange={handleChange} className="bg-gray-700 border-gray-600" />
                    </div>
                    <div>
                        <Label htmlFor="design_factor_burst">DF Burst</Label>
                        <Input id="design_factor_burst" name="design_factor_burst" type="number" step="0.1" value={formData.design_factor_burst} onChange={handleChange} className="bg-gray-700 border-gray-600" />
                    </div>
                    <div>
                        <Label htmlFor="design_factor_collapse">DF Collapse</Label>
                        <Input id="design_factor_collapse" name="design_factor_collapse" type="number" step="0.1" value={formData.design_factor_collapse} onChange={handleChange} className="bg-gray-700 border-gray-600" />
                    </div>
                    <div>
                        <Label htmlFor="design_factor_tension">DF Tension</Label>
                        <Input id="design_factor_tension" name="design_factor_tension" type="number" step="0.1" value={formData.design_factor_tension} onChange={handleChange} className="bg-gray-700 border-gray-600" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        );
    };

    const LoadCaseForm = ({ loadCase, casingStringId, onSave, onCancel }) => {
        const [formData, setFormData] = useState(
            loadCase || {
                case_name: '',
                case_type: 'Drilling',
                internal_p_profile: JSON.stringify([{ depth: 0, pressure: 0 }], null, 2),
                external_p_profile: JSON.stringify([{ depth: 0, pressure: 0 }], null, 2),
                axial_hookload_lbf: 0,
                casing_string_id: casingStringId,
            }
        );

        const handleChange = (e) => {
            const { name, value, type } = e.target;
            setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
        };

        const handleSave = () => {
            try {
                onSave({
                    ...formData,
                    internal_p_profile: JSON.parse(formData.internal_p_profile),
                    external_p_profile: JSON.parse(formData.external_p_profile),
                });
            } catch (error) {
                alert('Invalid JSON in pressure profiles.');
            }
        };

        return (
            <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{loadCase ? 'Edit' : 'Add'} Load Case</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                        <Label htmlFor="case_name">Case Name</Label>
                        <Input id="case_name" name="case_name" value={formData.case_name} onChange={handleChange} className="bg-gray-700 border-gray-600" />
                    </div>
                    <div>
                        <Label htmlFor="case_type">Case Type</Label>
                        <Input id="case_type" name="case_type" value={formData.case_type} onChange={handleChange} className="bg-gray-700 border-gray-600" />
                    </div>
                    <div>
                        <Label htmlFor="axial_hookload_lbf">Axial Hookload (lbf)</Label>
                        <Input id="axial_hookload_lbf" name="axial_hookload_lbf" type="number" value={formData.axial_hookload_lbf} onChange={handleChange} className="bg-gray-700 border-gray-600" />
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="internal_p_profile">Internal Pressure Profile (JSON)</Label>
                        <Textarea id="internal_p_profile" name="internal_p_profile" value={formData.internal_p_profile} onChange={handleChange} rows={5} className="bg-gray-700 border-gray-600" />
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="external_p_profile">External Pressure Profile (JSON)</Label>
                        <Textarea id="external_p_profile" name="external_p_profile" value={formData.external_p_profile} onChange={handleChange} rows={5} className="bg-gray-700 border-gray-600" />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSave}>Save</Button>
                </DialogFooter>
            </DialogContent>
        );
    };

    const InputPanel = ({
        casingStrings,
        loadCases,
        onAddCasingString,
        onUpdateCasingString,
        onDeleteCasingString,
        onAddLoadCase,
        onUpdateLoadCase,
        onDeleteLoadCase,
        onRunAnalysis,
        isAnalyzing
    }) => {
        const [isStringFormOpen, setIsStringFormOpen] = useState(false);
        const [editingString, setEditingString] = useState(null);
        const [isCaseFormOpen, setIsCaseFormOpen] = useState(false);
        const [editingCase, setEditingCase] = useState(null);
        const [activeCasingStringId, setActiveCasingStringId] = useState(null);

        const handleSaveCasingString = (stringData) => {
            if (editingString) {
                onUpdateCasingString({ ...editingString, ...stringData });
            } else {
                onAddCasingString(stringData);
            }
            setIsStringFormOpen(false);
            setEditingString(null);
        };

        const handleSaveLoadCase = (caseData) => {
            if (editingCase) {
                onUpdateLoadCase({ ...editingCase, ...caseData });
            } else {
                onAddLoadCase(caseData);
            }
            setIsCaseFormOpen(false);
            setEditingCase(null);
        };

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
            >
                <Dialog open={isStringFormOpen} onOpenChange={setIsStringFormOpen}>
                    {isStringFormOpen && <CasingStringForm string={editingString} onSave={handleSaveCasingString} onCancel={() => { setIsStringFormOpen(false); setEditingString(null); }} />}
                </Dialog>

                <Dialog open={isCaseFormOpen} onOpenChange={setIsCaseFormOpen}>
                    {isCaseFormOpen && <LoadCaseForm loadCase={editingCase} casingStringId={activeCasingStringId} onSave={handleSaveLoadCase} onCancel={() => { setIsCaseFormOpen(false); setEditingCase(null); }} />}
                </Dialog>

                <CollapsibleSection title="Casing Strings">
                    <div className="space-y-2">
                        {casingStrings.map(cs => (
                            <Card key={cs.id} className="bg-gray-800/50 border-gray-700">
                                <CardHeader className="p-4 flex flex-row items-center justify-between">
                                    <CardTitle className="text-base">{cs.name} ({cs.od_in}" {cs.weight_lbft}ppf)</CardTitle>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => { setEditingString(cs); setIsStringFormOpen(true); }}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400" onClick={() => onDeleteCasingString(cs.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                    <Button onClick={() => { setEditingString(null); setIsStringFormOpen(true); }} className="mt-4 w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Casing String
                    </Button>
                </CollapsibleSection>

                <CollapsibleSection title="Load Cases">
                    <div className="space-y-4">
                        <div>
                            <Label>Select Casing String for Load Cases</Label>
                            <Select onValueChange={setActiveCasingStringId} value={activeCasingStringId || ''}>
                                <SelectTrigger className="w-full bg-gray-800 border-gray-600">
                                    <SelectValue placeholder="Select a casing string..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {casingStrings.map(cs => (
                                        <SelectItem key={cs.id} value={cs.id}>{cs.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {activeCasingStringId && (
                            <>
                                <div className="space-y-2">
                                    {loadCases.filter(lc => lc.casing_string_id === activeCasingStringId).map(lc => (
                                        <Card key={lc.id} className="bg-gray-800/50 border-gray-700">
                                            <CardHeader className="p-4 flex flex-row items-center justify-between">
                                                <CardTitle className="text-base">{lc.case_name}</CardTitle>
                                                <div className="flex items-center space-x-1">
                                                    <Button variant="ghost" size="icon" onClick={() => onRunAnalysis(lc.casing_string_id, lc.id)} disabled={isAnalyzing}>
                                                        <Zap className="h-4 w-4 text-yellow-400" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => { setEditingCase(lc); setIsCaseFormOpen(true); }}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400" onClick={() => onDeleteLoadCase(lc.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                                <Button onClick={() => { setEditingCase(null); setIsCaseFormOpen(true); }} className="mt-4 w-full">
                                    <Plus className="mr-2 h-4 w-4" /> Add Load Case
                                </Button>
                            </>
                        )}
                    </div>
                </CollapsibleSection>
            </motion.div>
        );
    };

    export default InputPanel;