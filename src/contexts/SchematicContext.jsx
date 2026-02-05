import React, { createContext, useState, useContext, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SchematicContext = createContext();

export const useSchematic = () => useContext(SchematicContext);

export const SchematicProvider = ({ children }) => {
  const [components, setComponents] = useState([]);
  const [selectedComponentId, setSelectedComponentId] = useState(null);

  const addComponent = (item, position) => {
    const newComponent = {
      ...item,
      id: uuidv4(),
      // Store pixel position for rendering, but properties use depth values
      top: position.y, 
      left: position.x,
      properties: {
        name: item.name,
        topDepth: position.y / 5, // Convert pixels to meters (assuming 5 pixels/meter)
        bottomDepth: (position.y + 100) / 5, // Default length of 100 pixels = 20 meters
      },
    };
    setComponents((prev) => [...prev, newComponent]);
    setSelectedComponentId(newComponent.id);
  };

  const updateComponent = useCallback((id, updatedProperties) => {
    setComponents((prev) =>
      prev.map((comp) => {
        if (comp.id === id) {
          const newProperties = { ...comp.properties, ...updatedProperties };
          // Recalculate pixel position based on updated depths
          const pixelsPerMeter = 5; // Must match SchematicCanvas
          const newTopPx = parseFloat(newProperties.topDepth) * pixelsPerMeter;
          return { 
            ...comp, 
            properties: newProperties,
            top: newTopPx, // Update pixel position for rendering
          };
        }
        return comp;
      })
    );
  }, []);

  const selectedComponent = components.find(c => c.id === selectedComponentId);

  const value = {
    components,
    addComponent,
    selectedComponentId,
    setSelectedComponentId,
    selectedComponent,
    updateComponent,
  };

  return (
    <SchematicContext.Provider value={value}>
      {children}
    </SchematicContext.Provider>
  );
};