import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Container, BuilderElement, DragState } from '../../types/types';
import { useTheme } from '../../contexts/ThemeContext';
import './ContainerDropZone.css';

interface ContainerDropZoneProps {
    container: Container;
    onElementAdd: (elementType: string, containerId: string, position: { x: number; y: number }) => void;
    onElementMove: (elementId: string, containerId: string, position: { x: number; y: number }) => void;
    onContainerUpdate: (containerId: string, updates: Partial<Container>) => void;
    mode: 'edit' | 'preview';
    children?: React.ReactNode;
    isActive?: boolean;
    dragState: DragState;
    onDragStateChange: (state: DragState) => void;
}

export const ContainerDropZone: React.FC<ContainerDropZoneProps> = ({
    container,
    onElementAdd,
    onElementMove,
    onContainerUpdate,
    mode,
    children,
    isActive = true,
    dragState,
    onDragStateChange
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [dropPosition, setDropPosition] = useState<{ x: number; y: number } | null>(null);
    const [dragOverPosition, setDragOverPosition] = useState<{ x: number; y: number } | null>(null);
    const { theme } = useTheme();

    // Обработчики для перетаскивания из палитры
    const handleDragOver = useCallback((e: React.DragEvent) => {
        if (mode !== 'edit' || !isActive || !dragState.isDragging) return;

        e.preventDefault();
        e.stopPropagation();

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setDragOverPosition({ x, y });
        setIsDragOver(true);
    }, [mode, isActive, dragState.isDragging]);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        if (mode !== 'edit' || !isActive || !dragState.isDragging) return;

        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, [mode, isActive, dragState.isDragging]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        if (mode !== 'edit' || !isActive) return;

        e.preventDefault();
        e.stopPropagation();

        // Проверяем, действительно ли мы вышли из контейнера
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const { clientX, clientY } = e;
        const { left, top, right, bottom } = rect;

        if (clientX <= left || clientX >= right || clientY <= top || clientY >= bottom) {
            setIsDragOver(false);
            setDragOverPosition(null);
        }
    }, [mode, isActive]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        if (mode !== 'edit' || !isActive || !dragState.isDragging) return;

        e.preventDefault();
        e.stopPropagation();

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Получаем данные о перетаскиваемом элементе
        const elementType = dragState.elementType;
        const elementData = dragState.elementData;

        if (elementType) {
            onElementAdd(elementType, container.id, { x, y });
            setDropPosition({ x, y });

            // Анимация подтверждения дропа
            setTimeout(() => setDropPosition(null), 300);
        }

        setIsDragOver(false);
        setDragOverPosition(null);
        onDragStateChange({ isDragging: false, elementType: '', elementData: null });
    }, [mode, isActive, dragState, container.id, onElementAdd, onDragStateChange]);

    // Обработчики для перетаскивания между контейнерами
    const handleElementDragOver = useCallback((e: React.DragEvent, element: BuilderElement) => {
        if (mode !== 'edit' || !isActive) return;

        e.preventDefault();
        e.stopPropagation();

        // Показываем индикатор возможности дропа для перетаскиваемых элементов
        if (e.dataTransfer.types.includes('builder/element')) {
            setIsDragOver(true);
        }
    }, [mode, isActive]);

    const handleElementDrop = useCallback((e: React.DragEvent, targetElement: BuilderElement) => {
        if (mode !== 'edit' || !isActive) return;

        e.preventDefault();
        e.stopPropagation();

        try {
            const elementData = JSON.parse(e.dataTransfer.getData('builder/element'));

            if (elementData && elementData.id) {
                const rect = containerRef.current?.getBoundingClientRect();
                if (!rect) return;

                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Перемещаем элемент в этот контейнер
                onElementMove(elementData.id, container.id, { x, y });
            }
        } catch (error) {
            console.warn('Failed to parse dropped element data:', error);
        }

        setIsDragOver(false);
    }, [mode, isActive, container.id, onElementMove]);

    // Обработчик клика по контейнеру (сброс выделения)
    const handleContainerClick = useCallback((e: React.MouseEvent) => {
        if (mode !== 'edit' || !isActive) return;

        // Сбрасываем выделение только если кликнули по самому контейнеру, а не по его детям
        if (e.target === e.currentTarget) {
            // Можно добавить сброс выделения через callback
            // onElementSelect(null);
        }
    }, [mode, isActive]);

    // Эффект для глобальных событий перетаскивания
    useEffect(() => {
        const handleGlobalDragEnd = () => {
            setIsDragOver(false);
            setDragOverPosition(null);
        };

        document.addEventListener('dragend', handleGlobalDragEnd);
        return () => {
            document.removeEventListener('dragend', handleGlobalDragEnd);
        };
    }, []);

    // Рендер индикатора дропа
    const renderDropIndicator = () => {
        if (!isDragOver || !dragOverPosition || mode !== 'edit') return null;

        return (
            <div
                className="drop-indicator"
                style={{
                    left: dragOverPosition.x - 25,
                    top: dragOverPosition.y - 25,
                }}
            >
                <div className="drop-indicator-inner">
                    <div className="drop-indicator-icon">+</div>
                    <div className="drop-indicator-label">
                        {dragState.elementType || 'Элемент'}
                    </div>
                </div>
            </div>
        );
    };

    // Рендер индикатора подтверждения дропа
    const renderDropConfirmation = () => {
        if (!dropPosition || mode !== 'edit') return null;

        return (
            <div
                className="drop-confirmation"
                style={{
                    left: dropPosition.x - 20,
                    top: dropPosition.y - 20,
                }}
            >
                ✓
            </div>
        );
    };

    // Рендер зон для вставки между элементами
    const renderInsertionZones = () => {
        if (mode !== 'edit' || !isDragOver || !container.elements.length) return null;

        return (
            <>
                {/* Зона перед первым элементом */}
                <div
                    className="insertion-zone first-zone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleElementDrop(e, container.elements[0])}
                />

                {/* Зоны между элементами */}
                {container.elements.slice(0, -1).map((element, index) => (
                    <div
                        key={`insertion-${element.id}`}
                        className="insertion-zone between-zone"
                        style={{
                            top: element.position.y + (typeof element.position.height === 'number' ? element.position.height : parseInt(element.position.height as string)),
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleElementDrop(e, element)}
                    />
                ))}

                {/* Зона после последнего элемента */}
                <div
                    className="insertion-zone last-zone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleElementDrop(e, container.elements[container.elements.length - 1])}
                />
            </>
        );
    };

    const containerStyle: React.CSSProperties = {
        ...container.style,
        position: 'relative',
        minHeight: container.style.minHeight || '400px',
        cursor: mode === 'edit' && isActive ? 'default' : 'default',
    };

    return (
        <div
            ref={containerRef}
            className={`
        container-drop-zone 
        ${isActive ? 'active' : 'inactive'} 
        ${isDragOver ? 'drag-over' : ''}
        ${mode === 'preview' ? 'preview-mode' : 'edit-mode'}
        container-${container.type}
      `}
            style={containerStyle}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleContainerClick}
            data-container-id={container.id}
            data-container-type={container.type}
        >
            {/* Дочерние элементы */}
            {children}

            {/* Индикатор перетаскивания */}
            {renderDropIndicator()}

            {/* Подтверждение дропа */}
            {renderDropConfirmation()}

            {/* Зоны вставки между элементами */}
            {renderInsertionZones()}

            {/* Состояние пустого контейнера */}
            {container.elements.length === 0 && mode === 'edit' && (
                <div className="empty-container-message">
                    <div className="empty-container-icon">📄</div>
                    <div className="empty-container-text">
                        Перетащите элементы сюда
                    </div>
                    <div className="empty-container-hint">
                        Используйте палитру элементов слева
                    </div>
                </div>
            )}

            {/* Информация о контейнере в режиме редактирования */}
            {mode === 'edit' && isActive && (
                <div className="container-info">
                    <span className="container-name">{container.name}</span>
                    <span className="container-stats">
                        {container.elements.length} элементов
                    </span>
                </div>
            )}
        </div>
    );
};

export default ContainerDropZone;