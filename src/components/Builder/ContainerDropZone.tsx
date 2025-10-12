import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface ContainerDropZoneProps {
    containerId: string;
    children?: React.ReactNode;
    isOver?: boolean;
}

export const ContainerDropZone: React.FC<ContainerDropZoneProps> = ({
    containerId,
    children,
    isOver = false
}) => {
    const { isOver: isDroppableOver, setNodeRef } = useDroppable({
        id: `container-${containerId}`,
        data: {
            accepts: ['text', 'button', 'image', 'card', 'form', 'input', 'zeroblock'],
            isContainer: true
        }
    });

    const showDropIndicator = isDroppableOver || isOver;

    return (
        <div
            ref={setNodeRef}
            className={`container-dropzone ${showDropIndicator ? 'drop-active' : ''}`}
            style={{
                minHeight: children ? 'auto' : '80px',
                border: showDropIndicator ? '2px dashed #4299e1' : '2px dashed transparent',
                backgroundColor: showDropIndicator ? 'rgba(66, 153, 225, 0.1)' : 'transparent',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                padding: showDropIndicator ? '12px' : '0'
            }}
        >
            {children || (
                <div className="empty-container-placeholder">
                    <div className="placeholder-icon">📥</div>
                    <div className="placeholder-text">Перетащите элементы сюда</div>
                </div>
            )}
        </div>
    );
};