import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  addEdge, 
  Background, 
  Controls, 
  MiniMap,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { workflowTemplates } from '@/config/integrationTemplates';
import { Save, Play, Plus, Settings2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Start Workflow' }, type: 'input' },
];

const initialEdges = [];

const WorkflowBuilder = () => {
  const { toast } = useToast();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const loadTemplate = (templateId) => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newNodes = template.steps.map((step, index) => ({
      id: step.id,
      position: { x: 250, y: 100 + index * 100 },
      data: { label: step.label },
      type: index === 0 ? 'input' : (index === template.steps.length - 1 ? 'output' : 'default'),
      style: { 
        background: '#1e293b', 
        color: '#fff', 
        border: '1px solid #475569',
        width: 180
      }
    }));

    const newEdges = template.steps.slice(0, -1).map((step, index) => ({
      id: `e${step.id}-${template.steps[index + 1].id}`,
      source: step.id,
      target: template.steps[index + 1].id,
      animated: true,
      style: { stroke: '#64748b' }
    }));

    setNodes(newNodes);
    setEdges(newEdges);
    setSelectedTemplate(templateId);
    toast({ title: "Template Loaded", description: `Loaded ${template.name}` });
  };

  const handleSave = () => {
    toast({ title: "Workflow Saved", description: "Custom workflow saved to library." });
  };

  return (
    <div className="h-full flex flex-col bg-slate-950">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900">
        <div className="flex items-center gap-4">
          <Select onValueChange={loadTemplate}>
            <SelectTrigger className="w-[250px] bg-slate-800 border-slate-700">
              <SelectValue placeholder="Load Template" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
              {workflowTemplates.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-500">
            <Play className="w-4 h-4 mr-2" /> Run Workflow
          </Button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          className="bg-slate-950"
        >
          <Background color="#334155" gap={16} />
          <Controls className="bg-slate-800 border-slate-700 fill-slate-400" />
          <MiniMap className="bg-slate-900 border-slate-800" maskColor="rgba(0,0,0,0.6)" nodeColor="#475569" />
        </ReactFlow>
        
        <Card className="absolute top-4 left-4 w-64 bg-slate-900/90 border-slate-800 backdrop-blur">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-white">Toolbox</CardTitle>
          </CardHeader>
          <CardContent className="py-3 gap-2 grid">
            <Button variant="secondary" size="sm" className="justify-start bg-slate-800 text-slate-300 hover:bg-slate-700">
              <Plus className="w-3 h-3 mr-2" /> Add App Task
            </Button>
            <Button variant="secondary" size="sm" className="justify-start bg-slate-800 text-slate-300 hover:bg-slate-700">
              <Plus className="w-3 h-3 mr-2" /> Add Logic Gate
            </Button>
            <Button variant="secondary" size="sm" className="justify-start bg-slate-800 text-slate-300 hover:bg-slate-700">
              <Plus className="w-3 h-3 mr-2" /> Add Notification
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkflowBuilder;