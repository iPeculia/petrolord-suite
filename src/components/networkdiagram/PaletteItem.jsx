import React from 'react';
    import { useDrag } from 'react-dnd';
    import { motion } from 'framer-motion';
    import { ITEM_TYPES } from '@/components/networkdiagram/constants';

    const PaletteItem = ({ type, label, icon: Icon, bgColor, iconColor }) => {
      const [{ isDragging }, drag] = useDrag(() => ({
        type: ITEM_TYPES.NODE,
        item: { type, isPaletteItem: true },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }));

      return (
        <motion.div
          ref={drag}
          className={`flex items-center p-2 rounded-lg cursor-grab ${bgColor} ${isDragging ? 'opacity-50 scale-105' : 'opacity-100'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="p-2 bg-black/20 rounded-md">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <span className="ml-3 font-semibold text-white text-sm">{label}</span>
        </motion.div>
      );
    };

    export default PaletteItem;