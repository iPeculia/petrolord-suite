import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollaborationProvider } from '../../../contexts/CollaborationContext';
import TeamManagement from './TeamManagement';
import ProjectSharing from './ProjectSharing';
import CommentingSystem from './CommentingSystem';
import ActivityFeed from './ActivityFeed';
import NotificationPanel from './NotificationPanel';
import RealTimeCollaboration from './RealTimeCollaboration';
import VersionControl from './VersionControl';
import AuditLog from './AuditLog';
import CollaborationExportPanel from './CollaborationExportPanel';
import CollaborationHelpPanel from './CollaborationHelpPanel';
import { Users, Share2, MessageSquare, Activity, Bell, Zap, GitBranch, ShieldCheck, FileDown, HelpCircle } from 'lucide-react';

const CollaborationWorkflow = () => {
    return (
        <CollaborationProvider>
            <Tabs defaultValue="team" className="h-full flex flex-col">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 lg:grid-cols-10 h-auto">
                    <TabsTrigger value="team"><Users className="w-4 h-4 mr-2" />Team</TabsTrigger>
                    <TabsTrigger value="sharing"><Share2 className="w-4 h-4 mr-2" />Sharing</TabsTrigger>
                    <TabsTrigger value="comments"><MessageSquare className="w-4 h-4 mr-2" />Comments</TabsTrigger>
                    <TabsTrigger value="activity"><Activity className="w-4 h-4 mr-2" />Activity</TabsTrigger>
                    <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" />Notifications</TabsTrigger>
                    <TabsTrigger value="realtime"><Zap className="w-4 h-4 mr-2" />Real-Time</TabsTrigger>
                    <TabsTrigger value="versions"><GitBranch className="w-4 h-4 mr-2" />Versions</TabsTrigger>
                    <TabsTrigger value="audit"><ShieldCheck className="w-4 h-4 mr-2" />Audit</TabsTrigger>
                    <TabsTrigger value="export"><FileDown className="w-4 h-4 mr-2" />Export</TabsTrigger>
                    <TabsTrigger value="help"><HelpCircle className="w-4 h-4 mr-2" />Help</TabsTrigger>
                </TabsList>
                <div className="flex-grow mt-4 overflow-y-auto">
                    <TabsContent value="team"><TeamManagement /></TabsContent>
                    <TabsContent value="sharing"><ProjectSharing /></TabsContent>
                    <TabsContent value="comments"><CommentingSystem /></TabsContent>
                    <TabsContent value="activity"><ActivityFeed /></TabsContent>
                    <TabsContent value="notifications"><NotificationPanel /></TabsContent>
                    <TabsContent value="realtime"><RealTimeCollaboration /></TabsContent>
                    <TabsContent value="versions"><VersionControl /></TabsContent>
                    <TabsContent value="audit"><AuditLog /></TabsContent>
                    <TabsContent value="export"><CollaborationExportPanel /></TabsContent>
                    <TabsContent value="help"><CollaborationHelpPanel /></TabsContent>
                </div>
            </Tabs>
        </CollaborationProvider>
    );
};

export default CollaborationWorkflow;