import React, { useState } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { ChevronDown } from 'lucide-react';

    const CollapsibleSection = ({ title, icon, children, defaultOpen = false }) => {
      const [isOpen, setIsOpen] = useState(defaultOpen);

      return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex justify-between items-center p-3 text-left hover:bg-slate-800 transition-colors rounded-t-lg"
          >
            <div className="flex items-center space-x-3">
              <div className="text-lime-300">{icon}</div>
              <h3 className="font-semibold text-white">{title}</h3>
            </div>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
              <ChevronDown className="w-5 h-5 text-slate-400" />
            </motion.div>
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-3 border-t border-slate-700">
                  {children}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
    </div>
      );
    };

    export default CollapsibleSection;