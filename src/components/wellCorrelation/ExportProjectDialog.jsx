import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const ExportProjectDialog = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white">
        <DialogHeader>
          <DialogTitle>Export Project Data</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup defaultValue="las" className="gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="las" id="las" className="border-slate-500 text-blue-500" />
              <Label htmlFor="las" className="text-slate-200">Multi-well LAS Zip</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" className="border-slate-500 text-blue-500" />
              <Label htmlFor="csv" className="text-slate-200">CSV Table (Tops & Markers)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pdf" id="pdf" className="border-slate-500 text-blue-500" />
              <Label htmlFor="pdf" className="text-slate-200">PDF Report (Cross-section)</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:text-white">
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)} className="bg-blue-600 hover:bg-blue-500 text-white">
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportProjectDialog;