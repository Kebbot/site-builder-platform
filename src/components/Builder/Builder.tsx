import React, { useState, useCallback, useRef, useEffect } from 'react';
import { BuilderElement, Container, Project, DragState, AlignmentGuide } from '../../types/types';
import { BuilderElement as ElementComponent } from './BuilderElement';
import { ContainerDropZone } from './ContainerDropZone';
import { AlignmentGuides } from './AlignmentGuides';
import { GridOverlay } from './GridOverlay';
import { useAlignmentGuides } from '../../hooks/useAlignmentGuides';
import { useTheme } from '../../contexts/ThemeContext';
import './Builder.css';

interface BuilderProps {
    project: Project;
    onProjectUpdate: (project: Project) => void;
    selectedElement: BuilderElement | null;
    onElementSelect: (element: BuilderElement | null) => void;
    selectedContainer: Container | null;
    onContainerSelect: (container: Container | null) => void;
    mode: 'edit' | 'preview';
    onModeChange?: (mode: 'edit' | 'preview') => void;
}

export const Builder: React.FC<BuilderProps> = ({
    project,
    onProjectUpdate,
    selectedElement,
    onElementSelect,
    selectedContainer,
    onContainerSelect,
    mode,
    onModeChange
}) => {
    const [dragState, setDragState] = useState<DragState>({
        isDragging: false,
        elementType: '',
        elementData: null,
        source: 'palette'
    });

    const [activeGuides, setActiveGuides] = useState<AlignmentGuide[]>([]);
    const [snapLines, setSnapLines] = useState<{ vertical: number[]; horizontal: number[] }>({ vertical: [], horizontal: [] });
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();

    // Инициализируем хук выравнивания
    const { guides, calculateGuides, clearGuides, updateVisibleGuides } = useAlignmentGuides({
        container: selectedContainer || project.containers[0],
        snapThreshold: project.settings.snapThreshold || 5,
        enabled: project.settings.snap
    });

    // Получаем активный контейнер (или первый, если не выбран)
    const activeContainer = selectedContainer || project.containers[0];

    // Обработчик перемещения элемента
    const handleElementMove = useCallback((elementId: string, newPosition: Partial<BuilderElement['position']>) => {
        const updatedContainers = project.containers.map(container => ({
            ...container,
            elements: container.elements.map(element =>
                element.id === elementId
                    ? { ...element, position: { ...element.position, ...newPosition } }
                    : element
            )
        }));

        onProjectUpdate({ ...project, containers: updatedContainers });
    }, [project, onProjectUpdate]);

    // Обработчик изменения размера элемента
    const handleElementResize = useCallback((elementId: string, size: { width: number; height: number }) => {
        const updatedContainers = project.containers.map(container => ({
            ...container,
            elements: container.elements.map(element =>
                element.id === elementId
                    ? { ...element, position: { ...element.position, ...size } }
                    : element
            )
        }));

        onProjectUpdate({ ...project, containers: updatedContainers });
    }, [project, onProjectUpdate]);

    // Обработчик обновления элемента
    const handleElementUpdate = useCallback((elementId: string, updates: Partial<BuilderElement>) => {
        const updatedContainers = project.containers.map(container => ({
            ...container,
            elements: container.elements.map(element =>
                element.id === elementId
                    ? { ...element, ...updates }
                    : element
            )
        }));

        onProjectUpdate({ ...project, containers: updatedContainers });
    }, [project, onProjectUpdate]);

    // Обработчик добавления элемента
    const handleElementAdd = useCallback((elementType: string, containerId: string, position: { x: number; y: number }) => {
        const defaultElements: Record<string, Partial<BuilderElement>> = {
            text: {
                type: 'text',
                content: 'Текст',
                style: {
                    fontSize: 16,
                    color: theme.getColor('text'),
                    padding: '8px'
                },
                metadata: {
                    name: 'Текст',
                    icon: '📝',
                    category: 'content',
                    canHaveChildren: false,
                    resizable: true,
                    draggable: true
                }
            },
            heading: {
                type: 'heading',
                content: 'Заголовок',
                style: {
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: theme.getColor('text'),
                    padding: '12px'
                },
                props: { level: 'h1' },
                metadata: {
                    name: 'Заголовок',
                    icon: '🔤',
                    category: 'content',
                    canHaveChildren: false,
                    resizable: true,
                    draggable: true
                }
            },
            button: {
                type: 'button',
                content: 'Кнопка',
                style: {
                    backgroundColor: theme.getColor('primary'),
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: theme.getBorderRadius('md'),
                    fontSize: 16,
                    fontWeight: 'bold',
                    cursor: 'pointer'
                },
                metadata: {
                    name: 'Кнопка',
                    icon: '🔘',
                    category: 'content',
                    canHaveChildren: false,
                    resizable: true,
                    draggable: true
                }
            },
            image: {
                type: 'image',
                content: 'https://via.placeholder.com/200x100',
                style: {
                    objectFit: 'cover'
                },
                props: {
                    alt: 'Изображение',
                    src: 'https://via.placeholder.com/200x100'
                },
                metadata: {
                    name: 'Изображение',
                    icon: '🖼️',
                    category: 'media',
                    canHaveChildren: false,
                    resizable: true,
                    draggable: true
                }
            },
            container: {
                type: 'container',
                content: '',
                style: {
                    backgroundColor: theme.getColor('surface'),
                    border: `1px dashed ${theme.getColor('border')}`,
                    padding: '20px',
                    minHeight: '100px'
                },
                metadata: {
                    name: 'Контейнер',
                    icon: '📦',
                    category: 'layout',
                    canHaveChildren: true,
                    resizable: true,
                    draggable: true,
                    isContainer: true
                }
            }
        };

        const elementConfig = defaultElements[elementType] || defaultElements.text;

        const newElement: BuilderElement = {
            id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            containerId,
            position: {
                x: position.x,
                y: position.y,
                width: elementConfig.metadata?.defaultSize?.width || 200,
                height: elementConfig.metadata?.defaultSize?.height || 100,
                zIndex: 1
            },
            ...elementConfig
        } as BuilderElement;

        const updatedContainers = project.containers.map(container =>
            container.id === containerId
                ? { ...container, elements: [...container.elements, newElement] }
                : container
        );

        onProjectUpdate({ ...project, containers: updatedContainers });
        onElementSelect(newElement);
    }, [project, onProjectUpdate, onElementSelect, theme]);

    // Обработчик удаления элемента
    const handleElementDelete = useCallback((elementId: string) => {
        const updatedContainers = project.containers.map(container => ({
            ...container,
            elements: container.elements.filter(element => element.id !== elementId)
        }));

        onProjectUpdate({ ...project, containers: updatedContainers });

        if (selectedElement?.id === elementId) {
            onElementSelect(null);
        }
    }, [project, onProjectUpdate, selectedElement, onElementSelect]);

    // Обработчик дублирования элемента
    const handleElementDuplicate = useCallback((elementId: string) => {
        const elementToDuplicate = project.containers
            .flatMap(container => container.elements)
            .find(element => element.id === elementId);

        if (!elementToDuplicate) return;

        const duplicatedElement: BuilderElement = {
            ...elementToDuplicate,
            id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            position: {
                ...elementToDuplicate.position,
                x: elementToDuplicate.position.x + 20,
                y: elementToDuplicate.position.y + 20
            }
        };

        const updatedContainers = project.containers.map(container =>
            container.id === elementToDuplicate.containerId
                ? { ...container, elements: [...container.elements, duplicatedElement] }
                : container
        );

        onProjectUpdate({ ...project, containers: updatedContainers });
        onElementSelect(duplicatedElement);
    }, [project, onProjectUpdate, onElementSelect]);

    // Обработчик перемещения элемента между контейнерами
    const handleElementMoveBetweenContainers = useCallback((elementId: string, newContainerId: string, position: { x: number; y: number }) => {
        let elementToMove: BuilderElement | undefined;

        // Находим элемент и удаляем его из текущего контейнера
        const containersWithElementRemoved = project.containers.map(container => {
            const elementIndex = container.elements.findIndex(el => el.id === elementId);
            if (elementIndex !== -1) {
                elementToMove = container.elements[elementIndex];
                return {
                    ...container,
                    elements: container.elements.filter(el => el.id !== elementId)
                };
            }
            return container;
        });

        if (!elementToMove) return;

        // Добавляем элемент в новый контейнер
        const updatedContainers = containersWithElementRemoved.map(container =>
            container.id === newContainerId
                ? {
                    ...container,
                    elements: [...container.elements, {
                        ...elementToMove!,
                        containerId: newContainerId,
                        position: { ...elementToMove!.position, ...position }
                    }]
                }
                : container
        );

        onProjectUpdate({ ...project, containers: updatedContainers });
    }, [project, onProjectUpdate]);

    // Обработчик обновления контейнера
    const handleContainerUpdate = useCallback((containerId: string, updates: Partial<Container>) => {
        const updatedContainers = project.containers.map(container =>
            container.id === containerId ? { ...container, ...updates } : container
        );

        onProjectUpdate({ ...project, containers: updatedContainers });
    }, [project, onProjectUpdate]);

    // Обработчик клика по контейнеру
    const handleContainerClick = useCallback((e: React.MouseEvent, container: Container) => {
        if (mode !== 'edit') return;

        // Сбрасываем выделение элемента при клике на контейнер
        if (e.target === e.currentTarget) {
            onElementSelect(null);
            onContainerSelect(container);
        }
    }, [mode, onElementSelect, onContainerSelect]);

    // Функция для расчета направляющих
    const handleCalculateGuides = useCallback((movingElement: BuilderElement, allElements: BuilderElement[], containerRect: DOMRect) => {
        if (!project.settings.snap) {
            return { guides: [], snappedPosition: { x: movingElement.position.x, y: movingElement.position.y }, snapLines: { vertical: [], horizontal: [] } };
        }

        const result = calculateGuides(movingElement, allElements, containerRect);
        setActiveGuides(result.guides);
        setSnapLines(result.snapLines);

        return result;
    }, [project.settings.snap, calculateGuides]);

    // Обработчик изменения состояния перетаскивания
    const handleDragStateChange = useCallback((newDragState: DragState) => {
        setDragState(newDragState);

        if (!newDragState.isDragging) {
            clearGuides();
            setActiveGuides([]);
            setSnapLines({ vertical: [], horizontal: [] });
        }
    }, [clearGuides]);

    // Обработчик клавиш
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (mode !== 'edit') return;

            // Удаление выбранного элемента
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement) {
                e.preventDefault();
                handleElementDelete(selectedElement.id);
            }

            // Отмена выделения
            if (e.key === 'Escape' && selectedElement) {
                onElementSelect(null);
            }

            // Дублирование элемента
            if (e.key === 'd' && (e.ctrlKey || e.metaKey) && selectedElement) {
                e.preventDefault();
                handleElementDuplicate(selectedElement.id);
            }

            // Переключение режима просмотра/редактирования
            if (e.key === 'Tab' && e.ctrlKey) {
                e.preventDefault();
                onModeChange?.(mode === 'edit' ? 'preview' : 'edit');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [mode, selectedElement, handleElementDelete, handleElementDuplicate, onElementSelect, onModeChange]);

    // Получаем все элементы для передачи в BuilderElement
    const getAllElements = useCallback(() => {
        return project.containers.flatMap(container => container.elements);
    }, [project.containers]);

    // Рендер контейнеров
    const renderContainers = () => {
        return project.containers.map(container => (
            <div
                key={container.id}
                className={`builder-container ${container.type} ${selectedContainer?.id === container.id ? 'selected' : ''}`}
                onClick={(e) => handleContainerClick(e, container)}
            >
                <ContainerDropZone
                    container={container}
                    onElementAdd={handleElementAdd}
                    onElementMove={handleElementMoveBetweenContainers}
                    onContainerUpdate={handleContainerUpdate}
                    mode={mode}
                    isActive={mode === 'edit'}
                    dragState={dragState}
                    onDragStateChange={handleDragStateChange}
                >
                    {container.elements.map(element => (
                        <ElementComponent
                            key={element.id}
                            element={element}
                            isSelected={selectedElement?.id === element.id}
                            onSelect={onElementSelect}
                            onMove={handleElementMove}
                            onDelete={handleElementDelete}
                            onUpdate={handleElementUpdate}
                            onDuplicate={handleElementDuplicate}
                            onResize={handleElementResize}
                            mode={mode}
                            onDragStateChange={handleDragStateChange}
                            calculateGuides={handleCalculateGuides}
                            containerRect={containerRef.current?.getBoundingClientRect()}
                            allElements={getAllElements()}
                        />
                    ))}
                </ContainerDropZone>

                {/* Направляющие выравнивания */}
                {mode === 'edit' && activeGuides.length > 0 && (
                    <AlignmentGuides
                        guides={activeGuides}
                        snapLines={snapLines}
                        containerRect={containerRef.current?.getBoundingClientRect()}
                    />
                )}
            </div>
        ));
    };

    const builderStyle: React.CSSProperties = {
        backgroundColor: project.settings.pageBackground || theme.getColor('background'),
        backgroundImage: project.settings.pageBackgroundImage ? `url(${project.settings.pageBackgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
    };

    return (
        <div
            className={`builder ${mode} ${project.settings.viewport}`}
            style={builderStyle}
            ref={containerRef}
        >
            {/* Сетка */}
            {project.settings.grid && mode === 'edit' && <GridOverlay />}

            {/* Контейнеры */}
            <div className="builder-containers">
                {renderContainers()}
            </div>

            {/* Информация о режиме */}
            {mode === 'edit' && (
                <div className="builder-mode-indicator">
                    <div className="mode-indicator-content">
                        <span className="mode-text">Режим редактирования</span>
                        <span className="viewport-text">
                            {project.settings.viewport === 'desktop' && '🖥️ Desktop'}
                            {project.settings.viewport === 'tablet' && '📱 Tablet'}
                            {project.settings.viewport === 'mobile' && '📱 Mobile'}
                        </span>
                        <span className="hint-text">
                            Tab для переключения режима • Delete для удаления
                        </span>
                    </div>
                </div>
            )}

            {/* Подсказки для пустого проекта */}
            {project.containers.every(container => container.elements.length === 0) && mode === 'edit' && (
                <div className="builder-empty-state">
                    <div className="empty-state-content">
                        <div className="empty-state-icon">🚀</div>
                        <h2 className="empty-state-title">Начните создавать свой сайт</h2>
                        <p className="empty-state-description">
                            Перетащите элементы из палитры слева или выберите готовый шаблон
                        </p>
                        <div className="empty-state-actions">
                            <button className="action-button primary">
                                📁 Выбрать шаблон
                            </button>
                            <button className="action-button secondary">
                                🎨 Настроить стили
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Builder;