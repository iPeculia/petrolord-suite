import React, { useState } from 'react';
import { useAdminOrg } from '@/contexts/AdminOrganizationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import UnifiedAuthSettings from './UnifiedAuthSettings';

const OrgSettings = () => {
  const { selectedOrg, updateOrganization, deleteOrganization } = useAdminOrg();
  const [name, setName] = useState(selectedOrg.name);
  const [email, setEmail] = useState(selectedOrg.contact_email);
  const { toast } = useToast();

  const handleSave = async () => {
    await updateOrganization(selectedOrg.id, { name, contact_email: email });
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you absolutely sure you want to delete ${selectedOrg.name}? This cannot be undone.`)) {
      await deleteOrganization(selectedOrg.id);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Update the basic profile information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Organization Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} className="bg-slate-950 border-slate-700" />
          </div>
          <div className="space-y-2">
            <Label>Contact Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} className="bg-slate-950 border-slate-700" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </CardFooter>
      </Card>

      <UnifiedAuthSettings />

      <Card className="bg-slate-900 border-slate-800 border-red-900/20">
        <CardHeader>
          <CardTitle className="text-red-500">Danger Zone</CardTitle>
          <CardDescription>Destructive actions for this organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-900/10 p-4 rounded border border-red-900/30 flex justify-between items-center">
            <div>
              <h4 className="font-bold text-red-400">Delete Organization</h4>
              <p className="text-sm text-red-300/70">Permanently remove this organization and all data.</p>
            </div>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgSettings;