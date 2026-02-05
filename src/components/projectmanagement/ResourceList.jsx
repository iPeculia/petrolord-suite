import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, User, Briefcase, Mail, Phone, Award } from 'lucide-react';

const ResourceList = ({ resources, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('All');

  const disciplines = ['All', ...new Set(resources.map(r => r.discipline))];

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.discipline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (r.skills && r.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesDiscipline = filterDiscipline === 'All' || r.discipline === filterDiscipline;
    return matchesSearch && matchesDiscipline;
  });

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex gap-4 items-center bg-slate-900 p-3 rounded border border-slate-800">
        <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
            <Input 
                placeholder="Search by name, discipline, or skill..." 
                className="pl-8 bg-slate-800 border-slate-700"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
        <select 
            className="bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white"
            value={filterDiscipline}
            onChange={e => setFilterDiscipline(e.target.value)}
        >
            {disciplines.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-900/50 border border-slate-800 rounded-lg">
        <Table>
            <TableHeader className="bg-slate-900 sticky top-0 z-10">
                <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead className="text-slate-300">Name</TableHead>
                    <TableHead className="text-slate-300">Discipline</TableHead>
                    <TableHead className="text-slate-300">Type</TableHead>
                    <TableHead className="text-slate-300">Availability</TableHead>
                    <TableHead className="text-slate-300">Rate</TableHead>
                    <TableHead className="text-slate-300">Skills</TableHead>
                    <TableHead className="text-right text-slate-300">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredResources.map(resource => (
                    <TableRow key={resource.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                        <TableCell>
                            <Avatar className="h-8 w-8 bg-slate-800 border border-slate-600">
                                <AvatarFallback className="text-xs text-slate-300">{resource.name.substring(0,2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </TableCell>
                        <TableCell className="font-medium text-white">
                            <div>{resource.name}</div>
                            <div className="text-xs text-slate-500 flex gap-2">
                                {resource.contact_info?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {resource.contact_info.email}</span>}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="outline" className="border-slate-600 text-slate-400">{resource.discipline}</Badge>
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">{resource.type}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${resource.availability_percent > 80 ? 'bg-green-500' : resource.availability_percent > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                <span className="text-sm text-slate-300">{resource.availability_percent}%</span>
                            </div>
                        </TableCell>
                        <TableCell className="text-slate-300 font-mono text-sm">${resource.cost_per_day}/day</TableCell>
                        <TableCell>
                            <div className="flex flex-wrap gap-1 max-w-[200px]">
                                {resource.skills && resource.skills.slice(0, 2).map(skill => (
                                    <span key={skill} className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-400">{skill}</span>
                                ))}
                                {resource.skills && resource.skills.length > 2 && <span className="text-[10px] text-slate-500">+{resource.skills.length - 2} more</span>}
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => onEdit(resource)} className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                                <Edit className="w-4 h-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
                {filteredResources.length === 0 && (
                    <TableRow><TableCell colSpan="8" className="text-center py-10 text-slate-500">No resources found.</TableCell></TableRow>
                )}
            </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ResourceList;