import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchematic } from '@/contexts/SchematicContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const PropertiesPanel = () => {
  const { selectedComponent, updateComponent, setSelectedComponentId } = useSchematic();
  const [localProperties, setLocalProperties] = useState({});

  useEffect(() => {
    if (selectedComponent) {
      setLocalProperties(selectedComponent.properties);
    }
  }, [selectedComponent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalProperties(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (selectedComponent && selectedComponent.properties[name] !== value) {
      updateComponent(selectedComponent.id, { [name]: value });
    }
  };

  const handleClose = () => {
    setSelectedComponentId(null);
  };

  return (
    <AnimatePresence>
      {selectedComponent && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="w-80 bg-slate-800/50 border-l border-slate-700 p-4 flex-shrink-0 overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Properties</h2>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-slate-400">Component Name</Label>
              <Input
                id="name"
                name="name"
                value={localProperties.name || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="topDepth" className="text-slate-400">Top Depth (m)</Label>
              <Input
                id="topDepth"
                name="topDepth"
                type="number"
                value={localProperties.topDepth || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="bottomDepth" className="text-slate-400">Bottom Depth (m)</Label>
              <Input
                id="bottomDepth"
                name="bottomDepth"
                type="number"
                value={localProperties.bottomDepth || ''}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PropertiesPanel;