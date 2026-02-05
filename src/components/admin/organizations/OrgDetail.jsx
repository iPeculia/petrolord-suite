import React, { useEffect, useState } from 'react';
import { useAdminOrg } from '@/contexts/AdminOrganizationContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LayoutDashboard, Users, Shield, CreditCard, FileText, Settings, History } from 'lucide-react';
import OrgOverview from './OrgOverview';
import OrgTeam from './OrgTeam';
import OrgAccess from './OrgAccess';
import OrgSubscription from './OrgSubscription';
import OrgQuotes from './OrgQuotes';
import OrgSettings from './OrgSettings';
import OrgAudit from './OrgAudit';

const OrgDetail = () => {
  const { selectedOrg, setViewMode, fetchOrgUsers } = useAdminOrg();
  const [orgUsers, setOrgUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      if (selectedOrg?.id) {
        setLoadingUsers(true);
        const users = await fetchOrgUsers(selectedOrg.id);
        setOrgUsers(users);
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, [selectedOrg, fetchOrgUsers]);

  if (!selectedOrg) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-800">
        <Button variant="ghost" size="icon" onClick={() => setViewMode('list')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            {selectedOrg.name}
            <span className={`text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 font-mono text-slate-400`}>
              ID: {selectedOrg.id.substring(0,8)}
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Managing organization settings, users, and subscriptions.</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        <div className="border-b border-slate-800 bg-slate-900/50 -mx-6 px-6 mb-6">
          <TabsList className="h-12 bg-transparent p-0 gap-6">
            <TabsTrigger value="overview" className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-lime-500 data-[state=active]:bg-transparent px-0">
              <LayoutDashboard className="h-4 w-4 mr-2" /> Overview
            </TabsTrigger>
            <TabsTrigger value="team" className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-lime-500 data-[state=active]:bg-transparent px-0">
              <Users className="h-4 w-4 mr-2" /> Team ({orgUsers?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="access" className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-lime-500 data-[state=active]:bg-transparent px-0">
              <Shield className="h-4 w-4 mr-2" /> Access Matrix
            </TabsTrigger>
            <TabsTrigger value="subscription" className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-lime-500 data-[state=active]:bg-transparent px-0">
              <CreditCard className="h-4 w-4 mr-2" /> Subscription
            </TabsTrigger>
            <TabsTrigger value="quotes" className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-lime-500 data-[state=active]:bg-transparent px-0">
              <FileText className="h-4 w-4 mr-2" /> Quotes
            </TabsTrigger>
            <TabsTrigger value="settings" className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-lime-500 data-[state=active]:bg-transparent px-0">
              <Settings className="h-4 w-4 mr-2" /> Settings
            </TabsTrigger>
            <TabsTrigger value="audit" className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-lime-500 data-[state=active]:bg-transparent px-0">
              <History className="h-4 w-4 mr-2" /> Audit Log
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto pb-10">
          <TabsContent value="overview" className="mt-0 h-full"><OrgOverview orgUsers={orgUsers} /></TabsContent>
          <TabsContent value="team" className="mt-0 h-full"><OrgTeam users={orgUsers} onUpdate={() => fetchOrgUsers(selectedOrg.id).then(setOrgUsers)} /></TabsContent>
          <TabsContent value="access" className="mt-0 h-full"><OrgAccess users={orgUsers} /></TabsContent>
          <TabsContent value="subscription" className="mt-0 h-full"><OrgSubscription /></TabsContent>
          <TabsContent value="quotes" className="mt-0 h-full"><OrgQuotes /></TabsContent>
          <TabsContent value="settings" className="mt-0 h-full"><OrgSettings /></TabsContent>
          <TabsContent value="audit" className="mt-0 h-full"><OrgAudit /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default OrgDetail;