import React, { useRef } from 'react';
    import { useDrag } from 'react-dnd';
    import { motion } from 'framer-motion';
    import { ITEM_TYPES, NODE_TYPES } from '@/components/networkdiagram/constants';

    const DraggableNode = ({ id, x, y, type, label, onSelectNode, isSelected, readOnly }) => {
      const nodeRef = useRef(null);
      const [{ isDragging }, drag] = useDrag(() => ({
        type: ITEM_TYPES.NODE,
        item: { id, left: x, top: y, type },
        canDrag: !readOnly,
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }), [id, x, y, readOnly]);

      const nodeConfig = NODE_TYPES[type];
      const Icon = nodeConfig.icon;

      const handleClick = (e) => {
        e.stopPropagation();
        onSelectNode(id);
      };

      const containerClasses = `
        absolute flex items-center p-2 rounded-lg cursor-grab
        ${isSelected ? 'ring-2 ring-lime-400 shadow-lg' : ''}
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${nodeConfig.bgColor}
      `;

      return (
        <motion.div
          ref={drag(nodeRef)}
          style={{ left: x, top: y }}
          className={containerClasses}
          onClick={handleClick}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <div className="p-2 bg-black/20 rounded-md">
            <Icon className={`w-6 h-6 ${nodeConfig.iconColor}`} />
          </div>
          <span className="ml-2 font-bold text-white text-sm whitespace-nowrap">{label}</span>
        </motion.div>
      );
    };

    export default DraggableNode;