import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position,
  MiniMap,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

import { 
  Play, Save, Plus, Settings2, Clock, History, BarChart3, 
  Share2, FileJson, RotateCcw, AlertTriangle, CheckCircle2, XCircle,
  MoreVertical, Layout, ArrowRight, Workflow, Activity
} from 'lucide-react';

import { workflowNodeTypes, initialTemplates, mockExecutionHistory } from '@/utils/petrophysicsWorkflowUtils';

// Custom Node Component
const WorkflowNode = ({ data, selected }) => {
  const Icon = workflowNodeTypes.find(t => t.type === data.type)?.icon || Settings2;
  
  return (
    <div className={`px-4 py-3 shadow-lg rounded-lg bg-slate-900 border transition-all min-w-[180px] ${selected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-700'}`}>
      <Handle type="target" position={Position.Top} className="!bg-slate-500 !w-3 !h-3" />
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-md ${selected ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{data.label}</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">{data.category || 'Node'}</div>
        </div>
      </div>
      {data.status && (
         <div className="mt-2 flex items-center justify-end">
            {data.status === 'running' && <Badge variant="outline" className="text-blue-400 border-blue-400/30 animate-pulse text-[10px]">Running</Badge>}
            {data.status === 'success' && <Badge variant="outline" className="text-emerald-400 border-emerald-400/30 text-[10px]">Success</Badge>}
            {data.status === 'error' && <Badge variant="outline" className="text-rose-400 border-rose-400/30 text-[10px]">Error</Badge>}
         </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-slate-500 !w-3 !h-3" />
    </div>
  );
};

const nodeTypes = {
  input: WorkflowNode,
  calc_vsh: WorkflowNode,
  calc_phi: WorkflowNode,
  calc_sw: WorkflowNode,
  calc_perm: WorkflowNode,
  logic_if: WorkflowNode,
  logic_loop: WorkflowNode,
  transform: WorkflowNode,
  integration: WorkflowNode,
  output: WorkflowNode,
};

const WorkflowBuilderContent = ({ petroState }) => {
    const { toast } = useToast();
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [workflowName, setWorkflowName] = useState("New Workflow");
    const [isRunning, setIsRunning] = useState(false);
    const [executionLog, setExecutionLog] = useState([]);
    const [showScheduleDialog, setShowScheduleDialog] = useState(false);
    const [configNode, setConfigNode] = useState(null);

    // Drag & Drop Logic
    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeType));
        event.dataTransfer.effectAllowed = 'move';
    };

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const typeData = event.dataTransfer.getData('application/reactflow');
            if (!typeData) return;

            const nodeType = JSON.parse(typeData);
            const position = reactFlowWrapper.current.getBoundingClientRect();
            const newNode = {
                id: `node_${Date.now()}`,
                type: nodeType.type,
                position: {
                    x: event.clientX - position.left - 100,
                    y: event.clientY - position.top - 50,
                },
                data: { label: nodeType.label, type: nodeType.type, category: nodeType.category },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [setNodes]
    );

    const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#64748b' } }, eds)), [setEdges]);

    const loadTemplate = (template) => {
        setNodes(template.nodes.map(n => ({ ...n, data: { ...n.data, type: n.type } }))); // Ensure type in data for custom node
        setEdges(template.edges.map(e => ({ ...e, animated: true, style: { stroke: '#64748b' } })));
        setWorkflowName(template.name);
        toast({ title: "Template Loaded", description: `Loaded ${template.name}` });
    };

    const handleRunWorkflow = async () => {
        if (nodes.length === 0) {
            toast({ variant: "destructive", title: "Empty Workflow", description: "Add nodes before running." });
            return;
        }

        setIsRunning(true);
        setExecutionLog([]); // Clear previous log
        
        // Simulate execution sequence
        const sortedNodes = [...nodes].sort((a, b) => a.position.y - b.position.y);
        
        for (let i = 0; i < sortedNodes.length; i++) {
            const node = sortedNodes[i];
            
            // Update status to running
            setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, status: 'running' } } : n));
            
            await new Promise(r => setTimeout(r, 800 + Math.random() * 500)); // Simulate processing time
            
            // Random failure chance for demo
            const success = Math.random() > 0.1;
            
            setNodes(nds => nds.map(n => n.id === node.id ? { ...n, data: { ...n.data, status: success ? 'success' : 'error' } } : n));
            setExecutionLog(prev => [...prev, { 
                time: new Date().toLocaleTimeString(), 
                node: node.data.label, 
                status: success ? 'Completed' : 'Failed', 
                details: success ? 'Processed successfully' : 'Timeout or Data Error' 
            }]);

            if (!success && node.data.type !== 'logic_if') break; // Stop on error unless it's conditional
        }

        setIsRunning(false);
        toast({ title: "Workflow Execution Finished", description: "Check logs for details." });
    };

    const onNodeClick = (e, node) => {
        setConfigNode(node);
    };

    const handleSaveNodeConfig = () => {
        setConfigNode(null);
        toast({ title: "Configuration Saved", description: "Node settings updated locally." });
    };

    return (
        <div className="h-full flex flex-col md:flex-row overflow-hidden bg-slate-950">
            {/* Sidebar - Nodes & Templates */}
            <div className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0">
                <div className="p-4 border-b border-slate-800">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Workflow className="w-5 h-5 text-blue-400" /> Components
                    </h3>
                </div>
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                        <div>
                            <h4 className="text-xs font-medium text-slate-500 uppercase mb-3">Available Nodes</h4>
                            <div className="grid grid-cols-1 gap-2">
                                {workflowNodeTypes.map((nodeType) => (
                                    <div
                                        key={nodeType.type}
                                        className="bg-slate-800 border border-slate-700 p-3 rounded-lg cursor-grab active:cursor-grabbing hover:border-blue-500 transition-colors group"
                                        onDragStart={(e) => onDragStart(e, nodeType)}
                                        draggable
                                    >
                                        <div className="flex items-center gap-3">
                                            <nodeType.icon className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                                            <div className="text-sm text-slate-200">{nodeType.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-medium text-slate-500 uppercase mb-3">Templates</h4>
                            <div className="space-y-2">
                                {initialTemplates.map(tpl => (
                                    <div 
                                        key={tpl.id} 
                                        onClick={() => loadTemplate(tpl)}
                                        className="p-3 bg-slate-800/50 border border-slate-800 rounded-lg hover:bg-slate-800 hover:border-slate-600 cursor-pointer transition-all"
                                    >
                                        <div className="text-sm font-medium text-blue-100">{tpl.name}</div>
                                        <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">{tpl.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 flex flex-col h-full relative" ref={reactFlowWrapper}>
                {/* Toolbar */}
                <div className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3">
                         <Input 
                            value={workflowName} 
                            onChange={e => setWorkflowName(e.target.value)} 
                            className="bg-transparent border-none h-9 text-lg font-medium text-white focus-visible:ring-0 px-0 w-64"
                         />
                         <Badge variant="outline" className="text-amber-500 border-amber-500/30 bg-amber-500/10">Draft</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white" onClick={() => setNodes([])}>
                            <RotateCcw className="w-4 h-4 mr-2" /> Clear
                         </Button>
                         <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-white" onClick={() => setShowScheduleDialog(true)}>
                            <Clock className="w-4 h-4 mr-2" /> Schedule
                         </Button>
                         <Button variant="outline" size="sm" className="border-slate-700 bg-slate-800 text-white">
                            <Save className="w-4 h-4 mr-2" /> Save
                         </Button>
                         <Button size="sm" onClick={handleRunWorkflow} disabled={isRunning} className="bg-blue-600 hover:bg-blue-500 text-white">
                            {isRunning ? <span className="animate-spin mr-2">⌛</span> : <Play className="w-4 h-4 mr-2" />} Run
                         </Button>
                    </div>
                </div>

                {/* Flow Canvas */}
                <div className="flex-1 bg-slate-950 relative">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onNodeClick={onNodeClick}
                        nodeTypes={nodeTypes}
                        fitView
                        className="bg-slate-950"
                    >
                        <Background color="#1e293b" gap={16} />
                        <Controls className="bg-slate-800 border-slate-700 fill-slate-400" />
                        <MiniMap className="bg-slate-900 border border-slate-800" nodeColor="#3b82f6" maskColor="rgba(15, 23, 42, 0.6)" />
                        {/* Execution Log Overlay */}
                        {executionLog.length > 0 && (
                            <Panel position="bottom-left" className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-lg p-4 w-80 max-h-60 overflow-y-auto shadow-2xl">
                                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Execution Log</h4>
                                <div className="space-y-2">
                                    {executionLog.map((log, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs">
                                            {log.status === 'Completed' ? <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5" /> : <XCircle className="w-3 h-3 text-rose-500 mt-0.5" />}
                                            <div>
                                                <span className="text-slate-300 font-medium">{log.node}</span>
                                                <div className="text-slate-500">{log.details}</div>
                                            </div>
                                            <span className="ml-auto text-slate-600 font-mono">{log.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </Panel>
                        )}
                    </ReactFlow>
                </div>
            </div>

            {/* Node Configuration Dialog */}
            <Dialog open={!!configNode} onOpenChange={(open) => !open && setConfigNode(null)}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Configure {configNode?.data.label}</DialogTitle>
                        <DialogDescription className="text-slate-400">Set parameters for this operation.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Node Label</label>
                            <Input defaultValue={configNode?.data.label} className="bg-slate-950 border-slate-700" />
                        </div>
                        {configNode?.data.category === 'Calculation' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Method</label>
                                <Select>
                                    <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue placeholder="Select method" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="linear">Linear</SelectItem>
                                        <SelectItem value="larionov">Larionov (Tertiary)</SelectItem>
                                        <SelectItem value="steiber">Steiber</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {configNode?.data.category === 'Logic' && (
                            <div className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800">
                                <span className="text-sm">Stop on Error</span>
                                <Switch />
                            </div>
                        )}
                        {configNode?.data.type === 'output' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Export Format</label>
                                <Select defaultValue="las">
                                    <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="las">LAS 2.0</SelectItem>
                                        <SelectItem value="csv">CSV</SelectItem>
                                        <SelectItem value="db">Database (Supabase)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveNodeConfig} className="bg-blue-600 hover:bg-blue-500">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Schedule Dialog */}
            <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Schedule Workflow</DialogTitle>
                        <DialogDescription>Automate execution at specific intervals.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-lg">
                            <div className="space-y-1">
                                <div className="text-sm font-medium">Enable Schedule</div>
                                <div className="text-xs text-slate-500">Workflow will run automatically.</div>
                            </div>
                            <Switch />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-slate-400">Frequency</label>
                            <Select defaultValue="daily">
                                <SelectTrigger className="bg-slate-950 border-slate-700"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hourly">Every Hour</SelectItem>
                                    <SelectItem value="daily">Daily (Midnight)</SelectItem>
                                    <SelectItem value="weekly">Weekly (Sunday)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => {toast({title:"Scheduled"}); setShowScheduleDialog(false)}}>Confirm Schedule</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

const MonitoringContent = () => {
    return (
        <div className="p-6 space-y-6 h-full overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="bg-slate-900 border-slate-800">
                     <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-blue-500" /> Success Rate
                         </CardTitle>
                     </CardHeader>
                     <CardContent>
                         <div className="text-3xl font-bold text-white">94.2%</div>
                         <p className="text-xs text-slate-500 mt-1">Last 30 days</p>
                     </CardContent>
                 </Card>
                 <Card className="bg-slate-900 border-slate-800">
                     <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-emerald-500" /> Avg. Execution Time
                         </CardTitle>
                     </CardHeader>
                     <CardContent>
                         <div className="text-3xl font-bold text-white">450ms</div>
                         <p className="text-xs text-slate-500 mt-1">Optimized performance</p>
                     </CardContent>
                 </Card>
                 <Card className="bg-slate-900 border-slate-800">
                     <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-500" /> Active Schedules
                         </CardTitle>
                     </CardHeader>
                     <CardContent>
                         <div className="text-3xl font-bold text-white">3</div>
                         <p className="text-xs text-slate-500 mt-1">Workflows running periodically</p>
                     </CardContent>
                 </Card>
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Execution History</CardTitle>
                    <CardDescription>Recent workflow runs and their status.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">Run ID</TableHead>
                                <TableHead className="text-slate-400">Workflow Name</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-slate-400">Duration</TableHead>
                                <TableHead className="text-slate-400">User</TableHead>
                                <TableHead className="text-slate-400 text-right">Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mockExecutionHistory.map((run) => (
                                <TableRow key={run.id} className="border-slate-800 hover:bg-slate-800/50">
                                    <TableCell className="font-mono text-xs text-slate-500">{run.id}</TableCell>
                                    <TableCell className="text-slate-200 font-medium">{run.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            run.status === 'Success' 
                                            ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10' 
                                            : 'text-rose-500 border-rose-500/30 bg-rose-500/10'
                                        }>
                                            {run.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-400">{run.duration}</TableCell>
                                    <TableCell className="text-slate-400">{run.user}</TableCell>
                                    <TableCell className="text-right text-slate-500 text-xs">
                                        {new Date(run.timestamp).toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

// Main Wrapper Component
const WorkflowPanel = ({ petroState }) => {
    const [activeTab, setActiveTab] = useState('builder');

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="border-b border-slate-800 bg-slate-900 px-4 py-2 flex items-center justify-between flex-shrink-0">
                    <TabsList className="bg-slate-800">
                        <TabsTrigger value="builder" className="data-[state=active]:bg-blue-600">
                            <Layout className="w-4 h-4 mr-2" /> Builder
                        </TabsTrigger>
                        <TabsTrigger value="monitor" className="data-[state=active]:bg-blue-600">
                            <BarChart3 className="w-4 h-4 mr-2" /> Monitor & History
                        </TabsTrigger>
                        <TabsTrigger value="templates" className="data-[state=active]:bg-blue-600">
                            <FileJson className="w-4 h-4 mr-2" /> My Templates
                        </TabsTrigger>
                    </TabsList>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-slate-700 text-slate-300">
                            <Share2 className="w-4 h-4 mr-2" /> Share
                        </Button>
                    </div>
                </div>

                <TabsContent value="builder" className="flex-1 mt-0 overflow-hidden relative">
                    <ReactFlowProvider>
                        <WorkflowBuilderContent petroState={petroState} />
                    </ReactFlowProvider>
                </TabsContent>
                
                <TabsContent value="monitor" className="flex-1 mt-0 overflow-hidden">
                    <MonitoringContent />
                </TabsContent>

                <TabsContent value="templates" className="flex-1 mt-0 p-6 overflow-y-auto">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {initialTemplates.map(tpl => (
                             <Card key={tpl.id} className="bg-slate-900 border-slate-800 hover:border-blue-500 transition-colors cursor-pointer">
                                 <CardHeader>
                                     <div className="flex justify-between items-start">
                                        <CardTitle className="text-white">{tpl.name}</CardTitle>
                                        <Badge variant="secondary">{tpl.nodes.length} Nodes</Badge>
                                     </div>
                                     <CardDescription>{tpl.description}</CardDescription>
                                 </CardHeader>
                                 <CardContent>
                                     <div className="flex flex-wrap gap-2 mt-2">
                                         {tpl.tags?.map(tag => (
                                             <Badge key={tag} variant="outline" className="text-xs border-slate-700 text-slate-400">{tag}</Badge>
                                         ))}
                                     </div>
                                     <Button className="w-full mt-4" variant="secondary">Use Template</Button>
                                 </CardContent>
                             </Card>
                         ))}
                         <Card className="bg-slate-900/50 border-dashed border-slate-800 flex items-center justify-center min-h-[200px] cursor-pointer hover:bg-slate-900 hover:border-slate-700">
                             <div className="text-center">
                                 <Plus className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                                 <p className="text-slate-500 font-medium">Create Template</p>
                             </div>
                         </Card>
                     </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default WorkflowPanel;