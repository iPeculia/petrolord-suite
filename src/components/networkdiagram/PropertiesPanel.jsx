import React from 'react';
    import { motion } from 'framer-motion';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Button } from '@/components/ui/button';
    import { X } from 'lucide-react';
    import { NODE_TYPES } from '@/components/networkdiagram/constants';

    const PropertiesPanel = ({ node, onUpdate, onDeselect, onDelete, readOnly }) => {
      if (!node) {
        return (
          <div className="p-4 bg-slate-900 border-l border-slate-700 text-slate-400 text-center">
            Select a node or edge to view its properties.
          </div>
        );
      }

      const nodeConfig = NODE_TYPES[node.type];
      const Icon = nodeConfig.icon;

      const handleChange = (e) => {
        const { name, value } = e.target;
        onUpdate(node.id, { ...node.properties, [name]: value });
      };

      const handleLabelChange = (e) => {
        onUpdate(node.id, { ...node, label: e.target.value });
      };
      
      const renderProperty = (key) => {
        return (
            <div key={key}>
              <Label htmlFor={key} className="text-xs text-lime-300 capitalize">{key.replace(/_/g, ' ')}</Label>
              <Input
                id={key}
                name={key}
                value={node.properties[key] || ''}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white"
                readOnly={readOnly}
              />
            </div>
        );
      }
      
      const defaultProperties = ['pressure_in_psi', 'pressure_out_psi', 'temperature_f', 'flow_rate_bpd'];
      const customProperties = nodeConfig.properties.filter(p => !defaultProperties.includes(p));

      return (
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-80 bg-slate-900 border-l border-slate-700 flex flex-col"
        >
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className={`w-6 h-6 ${nodeConfig.iconColor}`} />
              <h3 className="text-lg font-bold text-white">{nodeConfig.label} Properties</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={onDeselect}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto flex-grow">
            <div>
              <Label htmlFor="label" className="text-xs text-lime-300">Label</Label>
              <Input
                id="label"
                value={node.label || ''}
                onChange={handleLabelChange}
                className="bg-slate-700 border-slate-600 text-white font-bold"
                readOnly={readOnly}
              />
            </div>
            
            <h4 className="font-semibold text-slate-300 pt-2 border-t border-slate-700/50">Default Properties</h4>
            {defaultProperties.map(renderProperty)}

            <h4 className="font-semibold text-slate-300 pt-2 border-t border-slate-700/50">Custom Properties</h4>
            {customProperties.map(renderProperty)}

          </div>
          {!readOnly && (
            <div className="p-4 border-t border-slate-700">
              <Button variant="destructive" className="w-full" onClick={() => onDelete(node.id)}>
                Delete Node
              </Button>
            </div>
          )}
        </motion.div>
      );
    };

    export default PropertiesPanel;