import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap, Handle } from 'reactflow';
import 'reactflow/dist/style.css';

// Custom Node to match theme
const CustomNode = ({ data }) => {
    return (
        <div className={`px-4 py-2 shadow-md rounded-md border-2 w-48 text-center ${data.completed ? 'bg-green-900/50 border-green-600' : 'bg-slate-900 border-slate-600'}`}>
            <Handle type="target" position="top" className="w-3 h-3 bg-slate-400" />
            <div className="font-bold text-xs text-white">{data.label}</div>
            <div className="text-[10px] text-slate-400">{data.sub}</div>
            <Handle type="source" position="bottom" className="w-3 h-3 bg-slate-400" />
        </div>
    );
};

const nodeTypes = { custom: CustomNode };

const DependencyGraph = () => {
    const nodes = useMemo(() => [
        { id: '1', type: 'custom', position: { x: 250, y: 0 }, data: { label: 'Phase 1: Foundation', sub: 'Core Data Layers', completed: true } },
        { id: '2', type: 'custom', position: { x: 100, y: 100 }, data: { label: 'Phase 2: ML Engine', sub: 'Models & Training', completed: false } },
        { id: '3', type: 'custom', position: { x: 400, y: 100 }, data: { label: 'Phase 3: Visualization', sub: 'Canvas & Plots', completed: false } },
        { id: '4', type: 'custom', position: { x: 250, y: 200 }, data: { label: 'Phase 4: Interpretation', sub: 'Workflows & Reports', completed: false } },
        { id: '5', type: 'custom', position: { x: 100, y: 300 }, data: { label: 'Phase 5: Validation', sub: 'QC & Explainability', completed: false } },
        { id: '6', type: 'custom', position: { x: 400, y: 300 }, data: { label: 'Phase 6: Collaboration', sub: 'Enterprise Features', completed: false } },
        { id: '7', type: 'custom', position: { x: 250, y: 400 }, data: { label: 'Phase 7: Integration', sub: 'APIs & Connectors', completed: false } },
        { id: '8', type: 'custom', position: { x: 250, y: 500 }, data: { label: 'Phase 8: Scale', sub: 'Cloud & Perf', completed: false } },
    ], []);

    const edges = useMemo(() => [
        { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#64748b' } },
        { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#64748b' } },
        { id: 'e2-4', source: '2', target: '4', style: { stroke: '#64748b' } },
        { id: 'e3-4', source: '3', target: '4', style: { stroke: '#64748b' } },
        { id: 'e4-5', source: '4', target: '5', style: { stroke: '#64748b' } },
        { id: 'e4-6', source: '4', target: '6', style: { stroke: '#64748b' } },
        { id: 'e6-7', source: '6', target: '7', style: { stroke: '#64748b' } },
        { id: 'e7-8', source: '7', target: '8', style: { stroke: '#64748b' } },
    ], []);

    return (
        <div className="h-full w-full bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
            <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                nodeTypes={nodeTypes}
                fitView
                attributionPosition="bottom-right"
            >
                <Background color="#334155" gap={16} />
                <Controls className="bg-slate-800 border-slate-700 text-white fill-white" />
                <MiniMap nodeColor="#475569" maskColor="rgba(15, 23, 42, 0.8)" className="bg-slate-900 border border-slate-800" />
            </ReactFlow>
        </div>
    );
};

export default DependencyGraph;