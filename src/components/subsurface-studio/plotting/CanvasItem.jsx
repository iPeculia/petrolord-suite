import React, { useEffect, useRef } from 'react';
    import { useDrag } from 'react-dnd';
    import { Rnd } from 'react-rnd';
    import { ItemTypes } from './DraggableItem';

    const CanvasItem = ({ id, left, top, width, height, type, contentId, name, onResize, onMove }) => {
      const [{ isDragging }, drag] = useDrag(() => ({
        type: type,
        item: { id, left, top, type, isNew: false },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }), [id, left, top, type]);

      const contentRef = useRef(null);

      useEffect(() => {
        if (type === ItemTypes.VIEW && contentId) {
          const sourceNode = document.getElementById(contentId);
          if (sourceNode) {
            const clonedNode = sourceNode.cloneNode(true);
            clonedNode.style.height = '100%';
            clonedNode.style.width = '100%';
            clonedNode.style.position = 'absolute';
            clonedNode.style.top = '0';
            clonedNode.style.left = '0';
            clonedNode.style.pointerEvents = 'none'; // Prevent interaction inside cloned view
            if (contentRef.current) {
                contentRef.current.innerHTML = '';
                contentRef.current.appendChild(clonedNode);
            }
          }
        }
      }, [contentId, type, width, height]);

      const renderContent = () => {
        if (type === ItemTypes.VIEW) {
          return <div ref={contentRef} className="w-full h-full overflow-hidden"></div>;
        }
        if (type === ItemTypes.TEXT) {
          return (
            <textarea
              defaultValue={name}
              className="w-full h-full bg-transparent border-none resize-none text-white p-2 focus:outline-none"
            />
          );
        }
        return null;
      };

      return (
        <Rnd
          size={{ width, height }}
          position={{ x: left, y: top }}
          onDragStop={(e, d) => {
            onMove(id, d.x, d.y);
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            onResize(id, ref.style.width, ref.style.height);
            onMove(id, position.x, position.y);
          }}
          dragHandleClassName="drag-handle"
          className="border-2 border-dashed border-slate-500 hover:border-lime-500 bg-slate-800/50 overflow-hidden"
          minWidth={50}
          minHeight={50}
        >
          <div className="w-full h-full relative">
            <div ref={drag} className="drag-handle absolute top-0 left-0 w-full h-5 bg-slate-600/50 cursor-move opacity-0 hover:opacity-100 transition-opacity"></div>
            {renderContent()}
          </div>
        </Rnd>
      );
    };

    export default CanvasItem;