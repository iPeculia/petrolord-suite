import React from 'react';
    import { useDrag } from 'react-dnd';

    export const ItemTypes = {
        VIEW: 'view',
        TEXT: 'text',
        IMAGE: 'image',
    };

    export const DraggableItem = ({ id, name, type, icon, contentId, left, top, width, height }) => {
        const [{ isDragging }, drag] = useDrag(() => ({
            type: type,
            item: { id, name, type, icon, contentId, left, top, width, height, isNew: left === undefined && top === undefined },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }), [id, name, type, icon, contentId, left, top, width, height]);

        return (
            <div
                ref={drag}
                className={`flex items-center p-3 rounded-md shadow-sm border border-slate-300 bg-white cursor-grab text-slate-800 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
                style={{
                    position: (left !== undefined && top !== undefined) ? 'absolute' : 'relative',
                    left: left !== undefined ? left : 'auto',
                    top: top !== undefined ? top : 'auto',
                    width: width !== undefined ? width : 'auto',
                    height: height !== undefined ? height : 'auto',
                }}
            >
                {icon}
                {name}
            </div>
        );
    };