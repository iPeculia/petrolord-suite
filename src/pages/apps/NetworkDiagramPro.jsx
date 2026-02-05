import React, { useState, useCallback } from 'react';
    import { Helmet } from 'react-helmet';
    import { DndProvider } from 'react-dnd';
    import { HTML5Backend } from 'react-dnd-html5-backend';
    import { useToast } from '@/components/ui/use-toast';
    import { v4 as uuidv4 } from 'uuid';
    import { AnimatePresence } from 'framer-motion';

    import Sidebar from '@/components/networkdiagram/Sidebar';
    import DiagramCanvas from '@/components/networkdiagram/DiagramCanvas';
    import PropertiesPanel from '@/components/networkdiagram/PropertiesPanel';
    import Toolbar from '@/components/networkdiagram/Toolbar';
    import { NODE_TYPES } from '@/components/networkdiagram/constants';

    const NetworkDiagramPro = ({ readOnly = false }) => {
      const [nodes, setNodes] = useState({});
      const [edges, setEdges] = useState([]);
      const [selectedNodeId, setSelectedNodeId] = useState(null);
      const [edgeConnectionStart, setEdgeConnectionStart] = useState(null);
      const { toast } = useToast();

      const showToast = () => {
        toast({
          title: "🚧 Feature In Development",
          description: "This feature isn't implemented yet—but stay tuned! 🚀",
        });
      };
      
      const addNode = useCallback((type, { x, y }) => {
        const id = uuidv4();
        const newNode = {
          id,
          type,
          label: `${NODE_TYPES[type].label} ${Object.values(nodes).filter(n => n.type === type).length + 1}`,
          x,
          y,
          properties: {},
        };
        setNodes(prev => ({ ...prev, [id]: newNode }));
        setSelectedNodeId(id);
      }, [nodes]);

      const moveNode = useCallback((id, { x, y }) => {
        setNodes(prev => ({ ...prev, [id]: { ...prev[id], x, y } }));
      }, []);

      const addEdge = useCallback((sourceId, targetId) => {
        if (sourceId === targetId) return;
        const newEdge = { source: sourceId, target: targetId };
        setEdges(prev => [...prev, newEdge]);
      }, []);
      
      const handleSelectNode = (id) => {
        if (readOnly) {
          setSelectedNodeId(id);
          return;
        }

        if (edgeConnectionStart) {
          addEdge(edgeConnectionStart, id);
          setEdgeConnectionStart(null);
          setSelectedNodeId(null);
        } else {
          setEdgeConnectionStart(id);
          setSelectedNodeId(id);
        }
      };

      const handleUpdateNode = (id, updatedData) => {
        setNodes(prev => ({
          ...prev,
          [id]: {
            ...prev[id],
            ...updatedData,
          }
        }));
      };

      const handleDeleteNode = (id) => {
        setNodes(prev => {
          const newNodes = { ...prev };
          delete newNodes[id];
          return newNodes;
        });
        setEdges(prev => prev.filter(edge => edge.source !== id && edge.target !== id));
        setSelectedNodeId(null);
      };

      const handleDeselect = () => {
        setSelectedNodeId(null);
        setEdgeConnectionStart(null);
      };

      return (
        <DndProvider backend={HTML5Backend}>
          <Helmet>
            <title>{readOnly ? 'Injection Network' : 'Network Diagram Pro'} - Petrolord Suite</title>
            <meta name="description" content="Visually model and optimize your surface production network." />
          </Helmet>
          <div className="flex h-screen flex-col bg-slate-900 text-white">
            <Toolbar 
              onSolve={showToast} 
              onExport={showToast} 
              onImport={showToast} 
              readOnly={readOnly}
              isReadOnlyView={readOnly}
            />
            <div className="flex flex-grow overflow-hidden">
              <Sidebar readOnly={readOnly} />
              <div className="flex-1 relative">
                <DiagramCanvas
                  nodes={nodes}
                  onNodeMove={moveNode}
                  onAddNode={addNode}
                  edges={edges}
                  onAddEdge={addEdge}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={handleSelectNode}
                  readOnly={readOnly}
                />
              </div>
              <AnimatePresence>
                {selectedNodeId && nodes[selectedNodeId] && (
                  <PropertiesPanel
                    key={selectedNodeId}
                    node={nodes[selectedNodeId]}
                    onUpdate={handleUpdateNode}
                    onDeselect={handleDeselect}
                    onDelete={handleDeleteNode}
                    readOnly={readOnly}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </DndProvider>
      );
    };

    export default NetworkDiagramPro;