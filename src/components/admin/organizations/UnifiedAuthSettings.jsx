import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAdminOrg } from '@/contexts/AdminOrganizationContext';
import { useToast } from '@/components/ui/use-toast';
import { Users, Lock, Key } from 'lucide-react';

const UnifiedAuthSettings = () => {
  const { selectedOrg, updateOrganization } = useAdminOrg();
  const [allowHse, setAllowHse] = useState(selectedOrg.allow_hse_access ?? true);
  const [autoAddHse, setAutoAddHse] = useState(selectedOrg.auto_add_hse_free ?? true);
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateOrganization(selectedOrg.id, {
        allow_hse_access: allowHse,
        auto_add_hse_free: autoAddHse
      });
      toast({ title: 'Authentication Settings Saved' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Save Failed', description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-400" />
          Unified Authentication Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
          <div className="space-y-0.5">
            <Label className="text-base text-slate-200">Unified Login Enabled</Label>
            <p className="text-xs text-slate-500">
              Users can access both Suite and HSE platforms with a single set of credentials.
            </p>
          </div>
          <div className="px-3 py-1 bg-green-900/30 border border-green-800 rounded text-green-400 text-xs font-bold uppercase">
            Active
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-200">Allow HSE Platform Access</Label>
              <p className="text-xs text-slate-500">
                If disabled, users in this organization will only be able to access the Suite dashboard.
              </p>
            </div>
            <Switch checked={allowHse} onCheckedChange={setAllowHse} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-slate-200">Auto-assign HSE Free Module</Label>
              <p className="text-xs text-slate-500">
                Automatically grant 'HSE Free' access to all new team members upon invitation.
              </p>
            </div>
            <Switch checked={autoAddHse} onCheckedChange={setAutoAddHse} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-800 pt-6">
        <Button onClick={handleSave} disabled={isSaving} className="ml-auto bg-blue-600 hover:bg-blue-700">
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UnifiedAuthSettings;