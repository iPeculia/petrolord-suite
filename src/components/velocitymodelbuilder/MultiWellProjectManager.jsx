import React, { useState } from 'react';
import { 
  Layout, Plus, FileSpreadsheet, Database, 
  ArrowLeftRight, Search, Filter, MoreHorizontal, Users 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MultiWellProjectManager = ({ wells = [], onWellSelect, activeWellId }) => {
  const [sharedModel, setSharedModel] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration if no wells provided
  const displayWells = wells.length > 0 ? wells : [
    { id: 'w1', name: 'Well-01', status: 'calibrated', type: 'Vertical', checkshots: true },
    { id: 'w2', name: 'Well-02', status: 'pending', type: 'Deviated', checkshots: false },
    { id: 'w3', name: 'Well-03', status: 'calibrated', type: 'Vertical', checkshots: true },
    { id: 'w4', name: 'Well-04_ST1', status: 'modeled', type: 'Horizontal', checkshots: true },
  ];

  const filteredWells = displayWells.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Card className="h-full bg-slate-900 border-slate-800 flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-800">
        <div className="flex justify-between items-center mb-4">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400"/> Project Wells
          </CardTitle>
          <Button size="sm" variant="outline" className="h-7 text-xs bg-emerald-900/20 text-emerald-400 border-emerald-800 hover:bg-emerald-900/40">
            <Plus className="w-3 h-3 mr-1" /> Add Well
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
          <Switch 
            id="model-mode" 
            checked={sharedModel} 
            onCheckedChange={setSharedModel}
          />
          <div className="flex flex-col">
            <Label htmlFor="model-mode" className="text-xs font-semibold text-slate-300 cursor-pointer">
              {sharedModel ? "Shared Field Model" : "Per-Well Models"}
            </Label>
            <span className="text-[10px] text-slate-500">
              {sharedModel ? "Apply one velocity function to all wells" : "Unique functions for each well"}
            </span>
          </div>
        </div>
      </CardHeader>

      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <Search className="absolute left-2 top-2 h-3 w-3 text-slate-500" />
          <Input 
            placeholder="Search wells..." 
            className="h-8 pl-7 bg-slate-950 border-slate-800 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <CardContent className="flex-1 p-0 min-h-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col divide-y divide-slate-800">
            {filteredWells.map(well => (
              <div 
                key={well.id} 
                className={`flex items-center justify-between p-3 hover:bg-slate-800/50 cursor-pointer transition-colors ${activeWellId === well.id ? 'bg-blue-900/20 border-l-2 border-blue-500' : 'border-l-2 border-transparent'}`}
                onClick={() => onWellSelect && onWellSelect(well.id)}
              >
                <div className="flex items-start gap-3">
                  <Checkbox id={`chk-${well.id}`} className="mt-1 border-slate-600 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" />
                  <div>
                    <div className="text-sm font-medium text-slate-200">{well.name}</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-slate-700 text-slate-400">{well.type}</Badge>
                      {well.checkshots && <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/30">CS</Badge>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    well.status === 'calibrated' ? 'bg-emerald-500' : 
                    well.status === 'modeled' ? 'bg-blue-500' : 'bg-slate-600'
                  }`} title={well.status} />
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-white">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700">
                      <DropdownMenuItem className="text-xs">View Data</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs">Compare</DropdownMenuItem>
                      <DropdownMenuItem className="text-xs text-red-400">Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      
      <div className="p-3 border-t border-slate-800 bg-slate-950/50 text-xs flex justify-between items-center text-slate-500">
        <span>{filteredWells.length} Wells</span>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs hover:text-white">
          <ArrowLeftRight className="w-3 h-3 mr-1" /> Compare Selected
        </Button>
      </div>
    </Card>
  );
};

export default MultiWellProjectManager;