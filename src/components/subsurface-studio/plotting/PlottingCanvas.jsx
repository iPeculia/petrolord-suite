import React, { useState } from 'react';
    import { Rnd } from 'react-rnd';
    import { DraggableItem, ItemTypes } from './DraggableItem';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { AlignJustify } from 'lucide-react';

    export const PlottingCanvas = ({ dropRef, canvasRef, items, isOver, moveItem, resizeItem }) => {
        const [editingTextId, setEditingTextId] = useState(null);
        const [textValue, setTextValue] = useState('');

        const handleTextDoubleClick = (id, currentText) => {
            setEditingTextId(id);
            setTextValue(currentText);
        };

        const handleTextChange = (e) => {
            setTextValue(e.target.value);
            moveItem(editingTextId, items[editingTextId].left, items[editingTextId].top, e.target.value); // Update content directly
        };

        const handleTextBlur = () => {
            setEditingTextId(null);
        };

        return (
            <div
                id="plotting-canvas-export"
                ref={(el) => {
                    dropRef(el);
                    if (canvasRef) canvasRef.current = el;
                }}
                className={`relative h-full w-full bg-slate-100 border border-dashed border-slate-300 ${isOver ? 'bg-slate-200' : ''}`}
            >
                {Object.values(items).map((item) => (
                    <Rnd
                        key={item.id}
                        size={{ width: item.width, height: item.height }}
                        position={{ x: item.left, y: item.top }}
                        onDragStop={(e, d) => {
                            moveItem(item.id, d.x, d.y);
                        }}
                        onResizeStop={(e, direction, ref, delta, position) => {
                            resizeItem(item.id, ref.style.width, ref.style.height);
                            moveItem(item.id, position.x, position.y);
                        }}
                        bounds="parent"
                        minWidth={item.type === ItemTypes.TEXT ? 100 : 200}
                        minHeight={item.type === ItemTypes.TEXT ? 30 : 100}
                        style={{ zIndex: 10 }}
                    >
                        {item.type === ItemTypes.VIEW ? (
                            <div className="h-full w-full border border-slate-300 bg-white rounded-md flex items-center justify-center text-slate-600">
                                <div className="text-sm font-semibold">{item.name}</div>
                            </div>
                        ) : (
                            <div
                                className="h-full w-full border border-slate-300 bg-white rounded-md flex items-center justify-center p-2"
                                onDoubleClick={() => handleTextDoubleClick(item.id, item.content || item.name)}
                            >
                                {editingTextId === item.id ? (
                                    <Textarea
                                        value={textValue}
                                        onChange={handleTextChange}
                                        onBlur={handleTextBlur}
                                        autoFocus
                                        className="h-full w-full bg-white text-slate-800 border-none focus-visible:ring-0 resize-none"
                                    />
                                ) : (
                                    <div className="text-sm text-slate-800 break-words overflow-hidden">
                                        {item.content || item.name}
                                    </div>
                                )}
                            </div>
                        )}
                    </Rnd>
                ))}
            </div>
        );
    };