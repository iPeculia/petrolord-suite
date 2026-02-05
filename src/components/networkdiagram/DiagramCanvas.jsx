import React from 'react';
    import { useDrop } from 'react-dnd';
    import { motion } from 'framer-motion';
    import DraggableNode from '@/components/networkdiagram/DraggableNode';
    import SvgCanvas from '@/components/networkdiagram/SvgCanvas';
    import { ITEM_TYPES } from '@/components/networkdiagram/constants';

    const DiagramCanvas = ({ nodes, onNodeMove, onAddNode, edges, onAddEdge, selectedNodeId, onSelectNode, readOnly }) => {
      const [, drop] = useDrop(() => ({
        accept: ITEM_TYPES.NODE,
        drop: (item, monitor) => {
          if (item.isPaletteItem) {
            const delta = monitor.getSourceClientOffset();
            onAddNode(item.type, { x: delta.x - 250, y: delta.y - 60 });
          } else {
            const delta = monitor.getDifferenceFromInitialOffset();
            const left = Math.round(item.left + delta.x);
            const top = Math.round(item.top + delta.y);
            onNodeMove(item.id, { x: left, y: top });
          }
        },
      }), [onNodeMove, onAddNode]);

      return (
        <div ref={readOnly ? null : drop} className="relative w-full h-full bg-slate-800/50 overflow-hidden border border-slate-700 rounded-lg">
          <SvgCanvas nodes={nodes} edges={edges} onAddEdge={onAddEdge} readOnly={readOnly} />
          {Object.entries(nodes).map(([id, node]) => (
            <DraggableNode 
              key={id} 
              id={id} 
              {...node} 
              onSelectNode={onSelectNode} 
              isSelected={selectedNodeId === id}
              readOnly={readOnly}
            />
          ))}
          {!Object.keys(nodes).length && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-slate-500">
                <p className="text-lg font-semibold">Drop nodes here from the palette</p>
                <p>Click a node, then click another to create a connection.</p>
              </div>
            </div>
          )}
        </div>
      );
    };

    export default DiagramCanvas;