import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, GitCommit, ShieldCheck, MessageSquare } from 'lucide-react';

// Sub-components
import ModelVersioningSystem from './ModelVersioningSystem';
import EditHistoryAuditTrail from './EditHistoryAuditTrail';
import AnnotationAndCommentsSystem from './AnnotationAndCommentsSystem';
import ReproducibleRunsManager from './ReproducibleRunsManager';
import VersionBranchingManager from './VersionBranchingManager';
import TeamCommentThread from './TeamCommentThread';
import ChangeNotificationSystem from './ChangeNotificationSystem';
import AuditReportGenerator from './AuditReportGenerator';
import VersionComparisonViewer from './VersionComparisonViewer';
import RoleBasedAccessControl from './RoleBasedAccessControl';

const CollaborationWorkspace = () => {
  return (
    <div className="flex flex-col h-full bg-slate-950">
        <div className="flex-shrink-0 border-b border-slate-800 bg-slate-900/50 p-1">
            <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
                <div className="px-2 mb-2">
                    <TabsList className="w-full justify-start h-9 bg-transparent p-0 gap-1">
                        <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400 border border-transparent data-[state=active]:border-slate-700">
                            <MessageSquare className="w-3 h-3 mr-2" /> Overview
                        </TabsTrigger>
                        <TabsTrigger value="versioning" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-purple-400 border border-transparent data-[state=active]:border-slate-700">
                            <GitCommit className="w-3 h-3 mr-2" /> Versioning
                        </TabsTrigger>
                        <TabsTrigger value="audit" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-400 border border-transparent data-[state=active]:border-slate-700">
                            <ShieldCheck className="w-3 h-3 mr-2" /> Audit & Compliance
                        </TabsTrigger>
                        <TabsTrigger value="team" className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-orange-400 border border-transparent data-[state=active]:border-slate-700">
                            <Users className="w-3 h-3 mr-2" /> Team
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex-1 overflow-hidden bg-slate-950 relative p-4">
                    <TabsContent value="overview" className="h-full m-0 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                            <div className="md:col-span-1"><ChangeNotificationSystem /></div>
                            <div className="md:col-span-1"><TeamCommentThread /></div>
                            <div className="md:col-span-1"><AnnotationAndCommentsSystem /></div>
                        </div>
                    </TabsContent>

                    <TabsContent value="versioning" className="h-full m-0 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                            <div className="md:col-span-1"><ModelVersioningSystem /></div>
                            <div className="md:col-span-1"><VersionBranchingManager /></div>
                            <div className="md:col-span-1"><VersionComparisonViewer /></div>
                        </div>
                    </TabsContent>

                    <TabsContent value="audit" className="h-full m-0 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                            <div className="md:col-span-1"><EditHistoryAuditTrail /></div>
                            <div className="md:col-span-1"><ReproducibleRunsManager /></div>
                            <div className="md:col-span-1"><AuditReportGenerator /></div>
                        </div>
                    </TabsContent>

                    <TabsContent value="team" className="h-full m-0 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                            <div className="md:col-span-2"><RoleBasedAccessControl /></div>
                            {/* Placeholder for Team Stats or something else */}
                            <div className="md:col-span-1 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-xs p-4">
                                Team Activity Statistics Panel
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    </div>
  );
};

export default CollaborationWorkspace;