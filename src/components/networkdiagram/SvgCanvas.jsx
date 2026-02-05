import React from 'react';
    import { motion } from 'framer-motion';

    const SvgCanvas = ({ nodes, edges, onAddEdge, readOnly }) => {
      const getEdgePath = (edge) => {
        const sourceNode = nodes[edge.source];
        const targetNode = nodes[edge.target];
        if (!sourceNode || !targetNode) return '';
        
        const sourceX = sourceNode.x + 50;
        const sourceY = sourceNode.y + 25;
        const targetX = targetNode.x + 50;
        const targetY = targetNode.y + 25;
        
        const dx = targetX - sourceX;
        const dy = targetY - sourceY;

        return `M ${sourceX} ${sourceY} C ${sourceX + dx / 2} ${sourceY}, ${sourceX + dx / 2} ${targetY}, ${targetX} ${targetY}`;
      };

      return (
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#65a30d" />
            </marker>
          </defs>
          {edges.map((edge, i) => (
            <motion.path
              key={i}
              d={getEdgePath(edge)}
              stroke="#a3e635"
              strokeWidth="2.5"
              fill="none"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
          ))}
        </svg>
      );
    };

    export default SvgCanvas;