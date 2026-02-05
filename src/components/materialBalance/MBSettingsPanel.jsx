import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useMaterialBalance } from '@/hooks/useMaterialBalance';
import { useToast } from '@/components/ui/use-toast';

const MBSettingsPanel = ({ isOpen, onClose }) => {
  const { settings, updateSettings } = useMaterialBalance();
  const { toast } = useToast();

  const [localSettings, setLocalSettings] = React.useState(settings);

  React.useEffect(() => {
    if (isOpen) setLocalSettings(settings);
  }, [isOpen, settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    toast({ title: "Settings Saved", description: "Your preferences have been updated." });
    onClose();
  };

  const handleChange = (key, value) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-950 border-slate-800 text-slate-200">
        <DialogHeader>
          <DialogTitle>Settings & Preferences</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full h-[400px] flex flex-col">
          <TabsList className="bg-slate-900 border border-slate-800 mb-4 w-full justify-start">
            <TabsTrigger value="general" className="text-xs">General</TabsTrigger>
            <TabsTrigger value="display" className="text-xs">Display</TabsTrigger>
            <TabsTrigger value="calculation" className="text-xs">Calculation</TabsTrigger>
            <TabsTrigger value="data" className="text-xs">Data Management</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto pr-2">
            <TabsContent value="general" className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800">
                <div className="space-y-0.5">
                  <Label className="text-sm">Auto-Save</Label>
                  <p className="text-xs text-slate-500">Automatically save project changes.</p>
                </div>
                <Switch 
                    checked={localSettings.autoSave} 
                    onCheckedChange={(v) => handleChange('autoSave', v)} 
                />
              </div>
              
              {localSettings.autoSave && (
                  <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800">
                    <div className="space-y-0.5">
                      <Label className="text-sm">Interval (minutes)</Label>
                      <p className="text-xs text-slate-500">How often to auto-save.</p>
                    </div>
                    <Input 
                        type="number" 
                        min="1" 
                        max="60"
                        className="w-20 h-8 bg-slate-950 border-slate-700"
                        value={localSettings.autoSaveInterval}
                        onChange={(e) => handleChange('autoSaveInterval', parseInt(e.target.value) || 5)}
                    />
                  </div>
              )}

              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800">
                <div className="space-y-0.5">
                  <Label className="text-sm">Units System</Label>
                  <p className="text-xs text-slate-500">Preferred unit system for new projects.</p>
                </div>
                <Select value={localSettings.units} onValueChange={(v) => handleChange('units', v)}>
                    <SelectTrigger className="w-32 h-8 bg-slate-950 border-slate-700">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="field">Field (Imperial)</SelectItem>
                        <SelectItem value="metric">Metric</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="display" className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800">
                <div className="space-y-0.5">
                  <Label className="text-sm">Theme</Label>
                  <p className="text-xs text-slate-500">Application color scheme.</p>
                </div>
                <Select value={localSettings.theme} onValueChange={(v) => handleChange('theme', v)}>
                    <SelectTrigger className="w-32 h-8 bg-slate-950 border-slate-700">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dark">Dark Mode</SelectItem>
                        <SelectItem value="light">Light Mode</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800">
                <div className="space-y-0.5">
                  <Label className="text-sm">Show Tooltips</Label>
                  <p className="text-xs text-slate-500">Show helpful hints on hover.</p>
                </div>
                <Switch 
                    checked={localSettings.showTooltips} 
                    onCheckedChange={(v) => handleChange('showTooltips', v)} 
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800">
                <div className="space-y-0.5">
                  <Label className="text-sm">Plot Grid Lines</Label>
                  <p className="text-xs text-slate-500">Show grid lines on charts.</p>
                </div>
                <Switch 
                    checked={localSettings.showGrid} 
                    onCheckedChange={(v) => handleChange('showGrid', v)} 
                />
              </div>
            </TabsContent>

            <TabsContent value="calculation" className="space-y-4">
               <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800">
                <div className="space-y-0.5">
                  <Label className="text-sm">Decimal Places</Label>
                  <p className="text-xs text-slate-500">Precision for displayed results.</p>
                </div>
                <Input 
                    type="number" 
                    min="0" 
                    max="6"
                    className="w-20 h-8 bg-slate-950 border-slate-700"
                    value={localSettings.decimalPlaces}
                    onChange={(e) => handleChange('decimalPlaces', parseInt(e.target.value) || 2)}
                />
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
               <div className="p-4 bg-red-900/10 border border-red-900/30 rounded space-y-4">
                  <Label className="text-red-400 font-bold">Danger Zone</Label>
                  <Separator className="bg-red-900/30" />
                  <div className="flex items-center justify-between">
                      <div>
                          <div className="text-sm text-slate-300">Clear Local Cache</div>
                          <div className="text-xs text-slate-500">Removes temporary data. Safe to do.</div>
                      </div>
                      <Button variant="outline" size="sm" className="border-red-900/50 text-red-400 hover:bg-red-900/20">Clear Cache</Button>
                  </div>
                  <div className="flex items-center justify-between">
                      <div>
                          <div className="text-sm text-slate-300">Reset to Defaults</div>
                          <div className="text-xs text-slate-500">Restores factory settings.</div>
                      </div>
                      <Button variant="outline" size="sm" className="border-red-900/50 text-red-400 hover:bg-red-900/20">Reset</Button>
                  </div>
               </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-800 mt-auto">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500">Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MBSettingsPanel;