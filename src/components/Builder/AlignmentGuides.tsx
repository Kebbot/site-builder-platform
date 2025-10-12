import React from 'react';
import './AlignmentGuides.css';

export interface Guide {
    id: string;
    type: 'horizontal' | 'vertical';
    position: number;
    elementIds: string[];
}

interface AlignmentGuidesProps {
    guides: Guide[];
    isVisible: boolean;
}

export const AlignmentGuides: React.FC<AlignmentGuidesProps> = ({
    guides,
    isVisible
}) => {
    if (!isVisible || guides.length === 0) return null;

    return (
        <div className="alignment-guides">
            {guides.map((guide) => (
                <div
                    key={guide.id}
                    className={`guide ${guide.type}`}
                    style={{
                        [guide.type === 'horizontal' ? 'top' : 'left']: `${guide.position}px`
                    }}
                >
                    <div className="guide-line" />
                    <div className="guide-label">
                        {guide.elementIds.length} элементов
                    </div>
                </div>
            ))}
        </div>
    );
};