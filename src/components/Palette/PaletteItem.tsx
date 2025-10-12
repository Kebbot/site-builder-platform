import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import './PaletteItem.css';

interface PaletteItemProps {
    type: string;
    label: string;
    emoji: string;
    description: string;
    color: string;
}

const PaletteItem: React.FC<PaletteItemProps> = ({
    type,
    label,
    emoji,
    description,
    color
}) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: `palette-${type}`,
        data: { type } // ← ВАЖНО: data должна содержать type
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.6 : 1,
        '--accent-color': color
    } as React.CSSProperties;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="palette-item"
        >
            <div className="palette-item-icon">{emoji}</div>
            <div className="palette-item-content">
                <div className="palette-item-label">{label}</div>
                <div className="palette-item-description">{description}</div>
            </div>
            <div className="palette-item-drag">⋮⋮</div>
        </div>
    );
};

export default PaletteItem;