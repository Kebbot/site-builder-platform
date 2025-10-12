import React from 'react';
import './GridOverlay.css';

interface GridOverlayProps {
    isVisible: boolean;
    spacing?: number;
}

export const GridOverlay: React.FC<GridOverlayProps> = ({
    isVisible,
    spacing = 20
}) => {
    if (!isVisible) return null;

    return (
        <div className="grid-overlay">
            <div
                className="grid-lines"
                style={{
                    backgroundSize: `${spacing}px ${spacing}px`,
                    backgroundImage: `
                        linear-gradient(to right, rgba(66, 153, 225, 0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(66, 153, 225, 0.1) 1px, transparent 1px)
                    `
                }}
            />
            <div className="grid-center-line vertical" />
            <div className="grid-center-line horizontal" />
        </div>
    );
};