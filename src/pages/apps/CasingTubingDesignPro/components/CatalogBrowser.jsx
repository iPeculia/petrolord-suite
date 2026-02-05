import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCasingTubingDesign } from '../contexts/CasingTubingDesignContext';
import { Search, Database } from 'lucide-react';

const CatalogBrowser = ({ open, onOpenChange, onSelect }) => {
    const { catalog } = useCasingTubingDesign();
    const [searchTerm, setSearchTerm] = useState('');
    const [odFilter, setOdFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');

    const uniqueODs = ['All', ...new Set(catalog.map(c => c.od))].sort((a, b) => a - b);
    const uniqueTypes = ['All', ...new Set(catalog.map(c => c.type))];

    const filteredCatalog = catalog.filter(item => {
        const matchesSearch = 
            item.grade.toLowerCase().includes(searchTerm.toLowerCase()) || 
            item.connection.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesOD = odFilter === 'All' || item.od === parseFloat(odFilter);
        const matchesType = typeFilter === 'All' || item.type.includes(typeFilter);
        return matchesSearch && matchesOD && matchesType;
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl h-[85vh] bg-slate-950 border-slate-800 text-white flex flex-col p-0 overflow-hidden shadow-2xl shadow-black/50">
                <div className="p-6 pb-4 border-b border-slate-800 bg-slate-900/50">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-xl text-white">
                            <Database className="w-5 h-5 mr-3 text-purple-400" />
                            Tubular Catalog
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Browse and select API 5CT casing and tubing components.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex gap-4 mt-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                            <Input 
                                placeholder="Search by grade (e.g. L-80) or connection..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-slate-900 border-slate-700 text-sm focus:border-purple-500"
                            />
                        </div>
                        <div className="w-40">
                            <Select value={typeFilter} onValueChange={setTypeFilter}>
                                <SelectTrigger className="bg-slate-900 border-slate-700 h-10">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    {uniqueTypes.map(t => (
                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-32">
                            <Select value={odFilter.toString()} onValueChange={setOdFilter}>
                                <SelectTrigger className="bg-slate-900 border-slate-700 h-10">
                                    <SelectValue placeholder="OD" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    {uniqueODs.map(od => (
                                        <SelectItem key={od} value={od.toString()}>{od === 'All' ? 'All Sizes' : `${od}"`}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden bg-slate-950">
                    <ScrollArea className="h-full">
                        <Table>
                            <TableHeader className="sticky top-0 bg-slate-900 z-10 shadow-sm border-b border-slate-800">
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400 font-semibold w-[80px]">Type</TableHead>
                                    <TableHead className="text-slate-400 font-semibold">OD (in)</TableHead>
                                    <TableHead className="text-slate-400 font-semibold">Weight (lb/ft)</TableHead>
                                    <TableHead className="text-slate-400 font-semibold">Grade</TableHead>
                                    <TableHead className="text-slate-400 font-semibold">Connection</TableHead>
                                    <TableHead className="text-slate-400 font-semibold text-right">Burst (psi)</TableHead>
                                    <TableHead className="text-slate-400 font-semibold text-right">Collapse (psi)</TableHead>
                                    <TableHead className="text-slate-400 font-semibold text-right">Yield (klb)</TableHead>
                                    <TableHead className="text-slate-400 w-[80px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCatalog.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center h-32 text-slate-500">
                                            No items found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCatalog.map((item) => (
                                        <TableRow key={item.id} className="border-slate-800 hover:bg-slate-900/50 group transition-colors">
                                            <TableCell className="text-slate-500 text-xs">{item.type}</TableCell>
                                            <TableCell className="font-bold text-white font-mono">{item.od}</TableCell>
                                            <TableCell className="font-mono text-slate-300">{item.weight}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300`}>
                                                    {item.grade}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-xs">{item.connection}</TableCell>
                                            <TableCell className="text-right font-mono text-emerald-400">{item.burst_rating}</TableCell>
                                            <TableCell className="text-right font-mono text-amber-400">{item.collapse_rating}</TableCell>
                                            <TableCell className="text-right font-mono text-blue-400">{Math.round(item.joint_yield/1000)}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" className="h-7 w-full bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-400 transition-all opacity-0 group-hover:opacity-100" onClick={() => onSelect && onSelect(item)}>
                                                    Select
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
                
                <div className="p-3 border-t border-slate-800 bg-slate-900 flex justify-between items-center text-xs text-slate-500">
                    <span>Showing {filteredCatalog.length} items</span>
                    <span className="flex items-center"><Database className="w-3 h-3 mr-1"/> API 5CT 10th Ed. Data</span>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CatalogBrowser;