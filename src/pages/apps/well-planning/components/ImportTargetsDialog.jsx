import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Download, Database, Layers } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ImportTargetsDialog = ({ isOpen, onClose, onImport }) => {
  const [source, setSource] = useState('earthmodel');
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { toast } = useToast();

  // Mock data for sources
  const mockEarthModelSurfaces = [
    { id: 1, name: 'Top Reservoir A', depth: 2500, type: 'Surface' },
    { id: 2, name: 'Base Reservoir A', depth: 2650, type: 'Surface' },
    { id: 3, name: 'Fault Block B', depth: 2550, type: 'Fault' },
  ];

  const mockCorrelationTops = [
    { id: 4, name: 'MFS-40', depth: 2100, well: 'Offset-01' },
    { id: 5, name: 'MFS-50', depth: 2300, well: 'Offset-01' },
  ];

  const currentItems = source === 'earthmodel' ? mockEarthModelSurfaces : mockCorrelationTops;

  const handleToggleItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleImport = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const imported = currentItems.filter(i => selectedItems.includes(i.id)).map(item => ({
        name: item.name,
        tvd: item.depth,
        x: 0, // Mock coords
        y: 0,
        type: 'Geological Marker',
        description: `Imported from ${source === 'earthmodel' ? 'EarthModel Pro' : 'Well Correlation Tool'}`
      }));
      
      onImport(imported);
      setLoading(false);
      onClose();
      setSelectedItems([]);
      toast({ title: "Import Successful", description: `${imported.length} targets imported.` });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white"><Download className="mr-2 h-5 w-5 text-[#4CAF50]"/> Import Targets</DialogTitle>
          <DialogDescription className="text-slate-400">Select source application and items to import.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Source Application</Label>
            <Select value={source} onValueChange={(v) => { setSource(v); setSelectedItems([]); }}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="earthmodel">
                  <div className="flex items-center"><Database className="mr-2 h-4 w-4 text-blue-400"/> EarthModel Pro</div>
                </SelectItem>
                <SelectItem value="correlation">
                  <div className="flex items-center"><Layers className="mr-2 h-4 w-4 text-orange-400"/> Well Correlation Tool</div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Available Items</Label>
            <div className="border border-slate-700 rounded-md bg-slate-950/50">
              <ScrollArea className="h-[200px] p-3">
                <div className="space-y-2">
                  {currentItems.map(item => (
                    <div key={item.id} className="flex items-center space-x-2 p-2 hover:bg-slate-800 rounded transition-colors">
                      <Checkbox 
                        id={`item-${item.id}`} 
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleToggleItem(item.id)}
                        className="border-slate-500 data-[state=checked]:bg-[#4CAF50] data-[state=checked]:border-[#4CAF50]"
                      />
                      <Label htmlFor={`item-${item.id}`} className="flex-1 cursor-pointer flex justify-between text-slate-300">
                        <span>{item.name}</span>
                        <span className="font-mono text-xs text-slate-500">{item.depth}m</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <p className="text-xs text-slate-500 text-right">{selectedItems.length} items selected</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="text-slate-400">Cancel</Button>
          <Button onClick={handleImport} disabled={loading || selectedItems.length === 0} className="bg-[#4CAF50] hover:bg-[#43a047] text-white">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Import Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTargetsDialog;