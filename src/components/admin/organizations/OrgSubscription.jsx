import React, { useState } from 'react';
import { useAdminOrg } from '@/contexts/AdminOrganizationContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, HardDrive, Users, Layers, Calendar, 
  AlertTriangle, CheckCircle, Settings, FileText, Download,
  ExternalLink, Copy
} from 'lucide-react';
import PricingConfigurator from './components/PricingConfigurator';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency, formatDate } from '@/utils/adminHelpers';

const OrgSubscription = () => {
  const { selectedOrg, updateOrganization } = useAdminOrg();
  const { toast } = useToast();
  const [isManageOpen, setIsManageOpen] = useState(false);
  
  // Mock existing subscription if not present
  const subscription = selectedOrg?.subscription || {
    status: 'active',
    modules: ['geoscience', 'reservoir'],
    apps: [],
    user_limit: 10,
    storage_limit: 500,
    tier: 'growth',
    current_period_end: new Date(Date.now() + 86400000 * 15).toISOString(),
    amount: 1899
  };

  const subscribedModules = selectedOrg.subscribed_modules || ['hse_free'];

  const handleUpdateSubscription = async (newConfig) => {
    // In real app: Call API to update subscription, handle Stripe, etc.
    const updatedSub = {
      ...subscription,
      modules: newConfig.modules,
      apps: newConfig.apps,
      user_limit: newConfig.userCount,
      storage_limit: newConfig.storageGB,
      tier: newConfig.tierId,
      amount: newConfig.calculated.monthlyTotal
    };

    // Also update organization subscribed_modules logic if needed
    // Typically subscription drives subscribed_modules
    
    await updateOrganization(selectedOrg.id, { subscription: updatedSub });
    toast({ title: 'Subscription Updated', description: 'Changes have been applied successfully.' });
    setIsManageOpen(false);
  };

  // Initial config for the builder based on current sub
  const currentConfig = {
    modules: subscription.modules || [],
    apps: subscription.apps || [],
    userCount: subscription.user_limit || 5,
    storageGB: subscription.storage_limit || 100,
    tierId: subscription.tier || 'starter',
    customDiscount: 0 
  };

  const copyLoginLink = () => {
    navigator.clipboard.writeText('https://petrolord.com/login');
    toast({ title: 'Link Copied', description: 'Unified login URL copied to clipboard.' });
  };

  return (
    <div className="space-y-6 h-full overflow-y-auto pr-2">
      {/* Status Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold text-white">Current Plan</h2>
            <Badge variant="outline" className="bg-green-900/30 text-green-400 border-green-800 uppercase tracking-wider text-xs">
              {subscription.status}
            </Badge>
            <Badge variant="secondary" className="capitalize">
              {subscription.tier} Tier
            </Badge>
          </div>
          <p className="text-slate-400 flex items-center gap-4 text-sm">
            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> Renews: {formatDate(subscription.current_period_end)}</span>
            <span className="flex items-center"><CreditCard className="h-3 w-3 mr-1" /> {formatCurrency(subscription.amount)}/mo</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-slate-700">Payment Method</Button>
          <Button onClick={() => setIsManageOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Settings className="h-4 w-4 mr-2" /> Modify Plan
          </Button>
        </div>
      </div>

      {/* Unified Login Info */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-900 border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <ExternalLink className="h-32 w-32" />
        </div>
        <CardContent className="p-6 relative z-10">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Unified Login Information</h3>
              <p className="text-slate-400 text-sm mb-4">All users in this organization access both Suite and HSE platforms via a single portal.</p>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800 inline-flex">
                <code className="text-sm text-blue-400">https://petrolord.com/login</code>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={copyLoginLink}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <div className="text-sm text-slate-500 mb-1">Unified Access</div>
              <div className="text-green-400 font-bold flex items-center justify-end gap-1">
                <CheckCircle className="h-4 w-4" /> Active
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage & Limits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Modules */}
        <Card className="bg-slate-900 border-slate-800 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Layers className="h-5 w-5 mr-2 text-purple-400" /> Enabled Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Active Subscriptions</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {subscribedModules.map(m => (
                    <Badge key={m} variant="outline" className={`capitalize border-slate-700 text-slate-300 ${m === 'hse_free' ? 'bg-green-900/20 text-green-400' : 'bg-slate-800'}`}>
                      {m === 'hse_free' ? 'HSE (Free)' : m}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users */}
        <Card className="bg-slate-900 border-slate-800 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-400" /> Seat Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <div className="flex justify-between mb-2">
                <span className="text-2xl font-bold text-white">8</span>
                <span className="text-sm text-slate-400 pt-2">of {subscription.user_limit} seats</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[80%] rounded-full" />
              </div>
              <p className="text-xs text-slate-500 mt-3">
                2 seats remaining. Upgrade plan to add more users.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card className="bg-slate-900 border-slate-800 md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <HardDrive className="h-5 w-5 mr-2 text-orange-400" /> Data Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <div className="flex justify-between mb-2">
                <span className="text-2xl font-bold text-white">124<span className="text-sm font-normal text-slate-500">GB</span></span>
                <span className="text-sm text-slate-400 pt-2">of {subscription.storage_limit} GB</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 w-[25%] rounded-full" />
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Healthy usage level.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice History */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-400" /> Invoice History
        </h3>
        <div className="border border-slate-800 rounded-md bg-slate-900/50 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Invoice #</th>
                <th className="p-4 font-medium">Amount</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 text-right font-medium">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {[1,2,3].map(i => (
                <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-slate-300">Oct 01, 2023</td>
                  <td className="p-4 text-slate-400 font-mono">INV-2023-{100+i}</td>
                  <td className="p-4 text-slate-300">$1,899.00</td>
                  <td className="p-4"><Badge className="bg-green-900/20 text-green-400 hover:bg-green-900/20 border-green-900">Paid</Badge></td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Download className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modification Dialog */}
      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-[90vw] w-[1200px] h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Modify Subscription</DialogTitle>
            <DialogDescription>Update modules, add apps, or change capacity limits.</DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden py-4">
            <SubscriptionModifier 
              initialConfig={currentConfig} 
              onSave={handleUpdateSubscription}
              onCancel={() => setIsManageOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Wrapper for the configurator to handle save state
const SubscriptionModifier = ({ initialConfig, onSave, onCancel }) => {
  const [config, setConfig] = useState(initialConfig);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <PricingConfigurator 
          initialConfig={initialConfig} 
          onChange={setConfig}
        />
      </div>
      <div className="mt-auto pt-4 border-t border-slate-800 flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSave(config)} className="bg-lime-600 hover:bg-lime-700">
          Confirm Changes
        </Button>
      </div>
    </div>
  );
};

export default OrgSubscription;