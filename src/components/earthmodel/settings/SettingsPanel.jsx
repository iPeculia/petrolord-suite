import React from 'react';
import { useSettings } from '@/context/SettingsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Monitor, Bell, Database, Shield } from 'lucide-react';

const SettingsPanel = () => {
  const { isOpen, toggleSettings, settings, updateSetting } = useSettings();

  return (
    <Dialog open={isOpen} onOpenChange={toggleSettings}>
      <DialogContent className="max-w-3xl bg-slate-950 border-slate-800 text-slate-100 min-h-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1 flex gap-6 mt-4">
          <TabsList className="flex flex-col w-48 bg-slate-900 h-full justify-start space-y-1 p-2">
            <TabsTrigger value="general" className="w-full justify-start"><Settings className="w-4 h-4 mr-2" /> General</TabsTrigger>
            <TabsTrigger value="display" className="w-full justify-start"><Monitor className="w-4 h-4 mr-2" /> Display</TabsTrigger>
            <TabsTrigger value="notifications" className="w-full justify-start"><Bell className="w-4 h-4 mr-2" /> Notifications</TabsTrigger>
            <TabsTrigger value="data" className="w-full justify-start"><Database className="w-4 h-4 mr-2" /> Data & Storage</TabsTrigger>
            <TabsTrigger value="security" className="w-full justify-start"><Shield className="w-4 h-4 mr-2" /> Security</TabsTrigger>
          </TabsList>

          <div className="flex-1 pr-4">
            <TabsContent value="general" className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">General Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Language</Label>
                    <p className="text-xs text-slate-500">Select your preferred language interface.</p>
                  </div>
                  <Select defaultValue="en">
                    <SelectTrigger className="w-32 bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Unit System</Label>
                    <p className="text-xs text-slate-500">Measurement units for projects.</p>
                  </div>
                  <Select defaultValue="metric">
                    <SelectTrigger className="w-32 bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      <SelectItem value="metric">Metric</SelectItem>
                      <SelectItem value="imperial">Imperial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="display" className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-xs text-slate-500">Application appearance.</p>
                  </div>
                  <Select value={settings.theme} onValueChange={(v) => updateSetting('theme', v)}>
                    <SelectTrigger className="w-32 bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>UI Density</Label>
                    <p className="text-xs text-slate-500">Compact mode for data-heavy views.</p>
                  </div>
                  <Select value={settings.density} onValueChange={(v) => updateSetting('density', v)}>
                    <SelectTrigger className="w-32 bg-slate-900 border-slate-700"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Notifications</Label>
                  <p className="text-xs text-slate-500">Receive alerts about system events.</p>
                </div>
                <Switch checked={settings.notifications} onCheckedChange={(v) => updateSetting('notifications', v)} />
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Data Management</h3>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Save</Label>
                  <p className="text-xs text-slate-500">Automatically save changes every 5 minutes.</p>
                </div>
                <Switch checked={settings.autoSave} onCheckedChange={(v) => updateSetting('autoSave', v)} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;