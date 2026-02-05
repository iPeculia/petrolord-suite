import React from 'react';
    import { motion } from 'framer-motion';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { NODE_TYPES } from '@/components/networkdiagram/constants';
    import PaletteItem from '@/components/networkdiagram/PaletteItem';

    const Sidebar = ({ readOnly }) => {
      if (readOnly) return null;
      
      return (
        <motion.div 
          className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col"
          initial={{ x: -256 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-bold text-white">Components</h2>
            <p className="text-xs text-lime-300">Drag to add to canvas</p>
          </div>
          <ScrollArea className="flex-grow">
            <div className="p-4 space-y-3">
              {Object.entries(NODE_TYPES).map(([type, config]) => (
                <PaletteItem
                  key={type}
                  type={type}
                  label={config.label}
                  icon={config.icon}
                  bgColor={config.bgColor}
                  iconColor={config.iconColor}
                />
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      );
    };

    export default Sidebar;