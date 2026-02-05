import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

const FaciesBasedRockTyping = ({ faciesScheme }) => {
    return (
        <div className="space-y-4 p-4 bg-slate-900 border border-slate-800 rounded-lg h-full overflow-auto">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">Electro-Rock Type Definition</h3>
                <Button size="sm"><Save className="w-4 h-4 mr-2" /> Save Definitions</Button>
            </div>
            
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-800">
                        <TableHead className="text-slate-400">Facies Class</TableHead>
                        <TableHead className="text-slate-400">Rock Type ID</TableHead>
                        <TableHead className="text-slate-400">Avg Phi (v/v)</TableHead>
                        <TableHead className="text-slate-400">Avg Perm (mD)</TableHead>
                        <TableHead className="text-slate-400">Capillary Pressure Model</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.keys(faciesScheme).map((facies, i) => (
                        <TableRow key={i} className="border-slate-800 hover:bg-slate-800/50">
                            <TableCell className="font-medium">
                                <span className="w-3 h-3 rounded-full inline-block mr-2" style={{backgroundColor: faciesScheme[facies]}}></span>
                                {facies}
                            </TableCell>
                            <TableCell><Input className="h-7 w-20 bg-slate-950 border-slate-700" defaultValue={i+1} /></TableCell>
                            <TableCell><Input className="h-7 w-24 bg-slate-950 border-slate-700" placeholder="0.00" /></TableCell>
                            <TableCell><Input className="h-7 w-24 bg-slate-950 border-slate-700" placeholder="0.00" /></TableCell>
                            <TableCell>
                                <select className="h-7 bg-slate-950 border border-slate-700 rounded text-sm text-slate-300 px-2">
                                    <option>J-Function</option>
                                    <option>Thomeer</option>
                                    <option>Brooks-Corey</option>
                                </select>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default FaciesBasedRockTyping;