import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useDrop } from 'react-dnd';
import { useSchematic } from '@/contexts/SchematicContext';
import DepthTrack from './DepthTrack';
import { Layers, Minus, Anchor, GitCommitHorizontal, Shield } from 'lucide-react';

// Define a mapping for component types to their visual representation (e.g., color, shape)
// For now, we'll use simple divs with colors, but this is where more complex SVG rendering would go.
const componentVisuals = {
  casing: { color: 'bg-gray-500', borderColor: 'border-gray-400', width: 'w-24' },
  tubing: { color: 'bg-blue-500', borderColor: 'border-blue-400', width: 'w-16' },
  packer: { color: 'bg-red-500', borderColor: 'border-red-400', width: 'w-20', height: 'h-6' },
  sliding_sleeve: { color: 'bg-green-500', borderColor: 'border-green-400', width: 'w-16', height: 'h-8' },
  sssv: { color: 'bg-yellow-500', borderColor: 'border-yellow-400', width: 'w-16', height: 'h-8' },
};

const itemIcons = {
  casing: Layers,
  tubing: Minus,
  packer: Anchor,
  sliding_sleeve: GitCommitHorizontal,
  sssv: Shield,
};

const SchematicCanvas = forwardRef((props, ref) => {
  const { components, addComponent, selectedComponentId, setSelectedComponentId } = useSchematic();
  const canvasRef = useRef(null);
  const dropRef = useRef(null);
  const pixelsPerMeter = 5; // 5 pixels per meter for depth scaling
  const minComponentHeightPx = 20; // Minimum height for very short components

  useImperativeHandle(ref, () => ({
    getCanvasElement: () => canvasRef.current,
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'component',
    drop: (item, monitor) => {
      if (!dropRef.current) return;
      const canvasRect = dropRef.current.getBoundingClientRect();
      const offset = monitor.getClientOffset();
      
      const y = offset.y - canvasRect.top;
      const snappedY = Math.round(y / pixelsPerMeter) * pixelsPerMeter; // Snap to depth grid in pixels

      const canvasCenterX = canvasRect.width / 2;
      const componentWidth = componentVisuals[item.type]?.width ? parseInt(componentVisuals[item.type].width.replace('w-', '')) * 4 : 100; // Convert tailwind width to pixels
      const snappedX = canvasCenterX - (componentWidth / 2); 

      const position = {
        x: snappedX,
        y: snappedY,
      };
      addComponent(item, position);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  drop(dropRef);

  const handleSelectComponent = (e, id) => {
    e.stopPropagation();
    setSelectedComponentId(id);
  };

  const handleDeselect = () => {
    setSelectedComponentId(null);
  };

  const renderComponent = (component) => {
    const Icon = itemIcons[component.type];
    const isSelected = component.id === selectedComponentId;
    const visuals = componentVisuals[component.type];

    if (!visuals) return null;

    const topDepth = parseFloat(component.properties.topDepth);
    const bottomDepth = parseFloat(component.properties.bottomDepth);

    const componentHeightMeters = Math.abs(bottomDepth - topDepth);
    let componentHeightPx = componentHeightMeters * pixelsPerMeter;
    
    // Ensure a minimum height for visibility, especially for point-like components
    if (componentHeightPx < minComponentHeightPx) {
      componentHeightPx = minComponentHeightPx;
    }

    // Calculate the top position based on the component's topDepth
    // Assuming 0 depth is at the top of the canvas
    const topPx = topDepth * pixelsPerMeter;

    return (
      <div
        key={component.id}
        style={{ 
          top: `${topPx}px`, 
          left: `${component.left}px`,
          height: `${componentHeightPx}px`,
          width: visuals.width ? visuals.width.replace('w-', '') * 4 : '100px', // Convert Tailwind width to actual pixels
        }}
        className={`absolute flex items-center justify-center rounded-md border z-10 cursor-pointer transition-all duration-100 ease-in-out
          ${visuals.color} ${visuals.borderColor}
          ${isSelected ? 'border-purple-500 border-2 shadow-lg' : 'border-indigo-400'}
          ${visuals.height || ''}
        `}
        onClick={(e) => handleSelectComponent(e, component.id)}
      >
        {Icon && <Icon className="w-5 h-5 text-white" />}
        <span className="absolute bottom-1 text-xs text-white opacity-75">{component.properties.name}</span>
      </div>
    );
  };

  // Determine the maximum depth to set canvas height
  const maxDepth = components.reduce((max, comp) => {
    const currentBottomDepth = parseFloat(comp.properties.bottomDepth);
    return isNaN(currentBottomDepth) ? max : Math.max(max, currentBottomDepth);
  }, 0);

  const canvasHeight = Math.max(window.innerHeight, maxDepth * pixelsPerMeter + 200); // Ensure canvas is at least screen height or extends with depth

  return (
    <div className="flex-grow flex overflow-auto bg-slate-900" onClick={handleDeselect}>
      <DepthTrack pixelsPerMeter={pixelsPerMeter} maxDepth={maxDepth} />
      <div
        ref={dropRef}
        className={`flex-grow relative ${isOver ? 'bg-slate-800/50' : ''}`}
      >
        <div ref={canvasRef} className="relative w-full" style={{ height: `${canvasHeight}px` }}>
          {components.map(renderComponent)}
          {components.length === 0 && !isOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-slate-500 text-2xl font-semibold">Drop components here</p>
            </div>
          )}
           {isOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-purple-500/10 border-2 border-dashed border-purple-400 rounded-lg">
              <p className="text-purple-300 text-2xl font-semibold">Release to add component</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SchematicCanvas.displayName = 'SchematicCanvas';

export default SchematicCanvas;