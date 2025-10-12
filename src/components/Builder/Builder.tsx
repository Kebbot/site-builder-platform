import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Component } from '../../types/types';
import BuilderElement from './BuilderElement';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { GridOverlay } from './GridOverlay';
import { AlignmentGuides } from './AlignmentGuides';
import { useAlignmentGuides } from '../../hooks/useAlignmentGuides';
import './Builder.css';

// Компонент для Drop-зоны
function DropZone() {
    const { isOver, setNodeRef } = useDroppable({
        id: 'builder-dropzone',
    });

    const style = {
        backgroundColor: isOver ? '#ebf8ff' : '#f7fafc',
        borderColor: isOver ? '#4299e1' : '#cbd5e0',
    };

    return (
        <div ref={setNodeRef} style={style} className="builder-placeholder">
            <div className="placeholder-content">
                <div className="placeholder-icon">🎯</div>
                <h3>Перетащите элементы сюда</h3>
                <p>Начните создавать свой сайт с библиотеки компонентов</p>
            </div>
        </div>
    );
}

interface BuilderProps {
    components: Component[];
    selectedComponent: Component | null;
    onSelectComponent: (component: Component) => void;
    onDeleteComponent: (componentId: string) => void;
    onUpdateComponent?: (component: Component) => void;
    onCopyComponent?: (component: Component) => void;
    onDuplicateComponent?: (component: Component) => void;
}

type DeviceView = 'desktop' | 'tablet' | 'mobile';

const Builder: React.FC<BuilderProps> = ({
    components,
    selectedComponent,
    onSelectComponent,
    onDeleteComponent,
    onUpdateComponent,
    onCopyComponent,
    onDuplicateComponent
}) => {
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [deviceView, setDeviceView] = useState<DeviceView>('desktop');
    const [showGrid, setShowGrid] = useState(false);
    const [showGuides, setShowGuides] = useState(true);

    // Используем хук для получения направляющих
    const guides = useAlignmentGuides(components, selectedComponent);

    const getDeviceStyles = () => {
        switch (deviceView) {
            case 'mobile':
                return { maxWidth: '375px' };
            case 'tablet':
                return { maxWidth: '768px' };
            case 'desktop':
            default:
                return { maxWidth: '100%' };
        }
    };

    return (
        <div className="builder">
            <div className="builder-toolbar">
                <div className="toolbar-left">
                    <h3>🛠️ Рабочая область</h3>
                    <span className="element-count">
                        {components.length} элементов
                    </span>
                </div>
                <div className="toolbar-right">
                    <div className="visual-helpers">
                        <button
                            className={`helper-btn ${showGrid ? 'active' : ''}`}
                            onClick={() => setShowGrid(!showGrid)}
                            title="Показать/скрыть сетку"
                        >
                            {showGrid ? '🔲' : '◻️'} Сетка
                        </button>
                        <button
                            className={`helper-btn ${showGuides ? 'active' : ''}`}
                            onClick={() => setShowGuides(!showGuides)}
                            title="Показать/скрыть направляющие"
                        >
                            {showGuides ? '📐' : '📏'} Направляющие
                        </button>
                    </div>

                    <div className="device-controls">
                        <button
                            className={`device-btn ${deviceView === 'mobile' ? 'active' : ''}`}
                            onClick={() => setDeviceView('mobile')}
                            title="Мобильный вид (375px)"
                        >
                            📱
                        </button>
                        <button
                            className={`device-btn ${deviceView === 'tablet' ? 'active' : ''}`}
                            onClick={() => setDeviceView('tablet')}
                            title="Планшетный вид (768px)"
                        >
                            📟
                        </button>
                        <button
                            className={`device-btn ${deviceView === 'desktop' ? 'active' : ''}`}
                            onClick={() => setDeviceView('desktop')}
                            title="Десктопный вид"
                        >
                            💻
                        </button>
                    </div>

                    <button
                        className={`preview-button ${isPreviewMode ? 'active' : ''}`}
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                    >
                        {isPreviewMode ? '👁️ Режим просмотра' : '✏️ Режим редактирования'}
                    </button>
                </div>
            </div>

            <div className="builder-scroll-container">
                <div className={`builder-content ${isPreviewMode ? 'preview-mode' : ''} ${deviceView}`}>
                    <GridOverlay isVisible={showGrid} spacing={20} />
                    <AlignmentGuides guides={guides} isVisible={showGuides} />

                    <div className="components-wrapper" style={getDeviceStyles()}>
                        <SortableContext
                            items={components.map(c => c.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {components.map((component) => (
                                <BuilderElement
                                    key={component.id}
                                    component={component}
                                    isSelected={!isPreviewMode && selectedComponent?.id === component.id}
                                    onSelect={onSelectComponent}
                                    onDelete={onDeleteComponent}
                                    onUpdateComponent={onUpdateComponent}
                                    onCopyComponent={onCopyComponent}
                                    onDuplicateComponent={onDuplicateComponent}
                                    isPreviewMode={isPreviewMode}
                                />
                            ))}
                        </SortableContext>

                        {!isPreviewMode && <DropZone />}

                        {components.length === 0 && !isPreviewMode && (
                            <div className="empty-state">
                                <div className="empty-icon">✨</div>
                                <h3>Ваш сайт ждет наполнения</h3>
                                <p>Перетащите компоненты из левой панели чтобы начать создание</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Builder;