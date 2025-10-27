import React from 'react';
import { AlignmentGuide } from '../../types/types';
import './AlignmentGuides.css';

export interface Guide {
    id: string;
    type: 'horizontal' | 'vertical';
    position: number;
    elementIds: string[];
}

interface AlignmentGuidesProps {
    guides: AlignmentGuide[];
    snapLines?: {
        vertical: number[];
        horizontal: number[];
    };
    containerRect?: DOMRect;
}

export const AlignmentGuides: React.FC<AlignmentGuidesProps> = ({
    guides,
    snapLines,
    containerRect
}) => {
    if (!guides.length || !containerRect) return null;

    return (
        <div className="alignment-guides">
            {/* Рендерим направляющие */}
            {guides.map((guide, index) => {
                const guideId = guide.id || `guide-${guide.type}-${guide.position}-${index}`;

                const style: React.CSSProperties = guide.type === 'vertical'
                    ? {
                        left: guide.position,
                        top: 0,
                        bottom: 0,
                        width: '1px'
                    }
                    : {
                        top: guide.position,
                        left: 0,
                        right: 0,
                        height: '1px'
                    };

                const strengthClass = `guide-${guide.strength || 'medium'}`;

                return (
                    <div
                        key={guideId}
                        className={`alignment-guide ${guide.type} ${strengthClass}`}
                        style={style}
                    />
                );
            })}

            {/* Рендерим линии привязки */}
            {snapLines && (
                <>
                    {snapLines.vertical.map((position, index) => (
                        <div
                            key={`snap-v-${position}-${index}`}
                            className="snap-line vertical"
                            style={{ left: position }}
                        />
                    ))}
                    {snapLines.horizontal.map((position, index) => (
                        <div
                            key={`snap-h-${position}-${index}`}
                            className="snap-line horizontal"
                            style={{ top: position }}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default AlignmentGuides;