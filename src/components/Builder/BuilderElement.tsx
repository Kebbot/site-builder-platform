import React, { useRef, useState, useCallback, useEffect } from 'react';
import { BuilderElement } from '../../types/types';
import { useTheme } from '../../contexts/ThemeContext';
import './BuilderElement.css';

interface BuilderElementProps {
    element: BuilderElement;
    isSelected: boolean;
    onSelect: (element: BuilderElement) => void;
    onMove: (elementId: string, position: Partial<BuilderElement['position']>) => void;
    onDelete: (elementId: string) => void;
    onUpdate: (elementId: string, updates: Partial<BuilderElement>) => void;
    onDuplicate: (elementId: string) => void;
    onResize: (elementId: string, size: { width: number; height: number }) => void;
    mode: 'edit' | 'preview';
    onDragStateChange: (state: any) => void;
    calculateGuides: (element: BuilderElement, allElements: BuilderElement[], containerRect: DOMRect) => any;
    containerRect?: DOMRect;
    allElements: BuilderElement[];
}

export const BuilderElement: React.FC<BuilderElementProps> = ({
    element,
    isSelected,
    onSelect,
    onMove,
    onDelete,
    onUpdate,
    onDuplicate,
    onResize,
    mode,
    onDragStateChange,
    calculateGuides,
    containerRect,
    allElements
}) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [elementStart, setElementStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const [resizeDirection, setResizeDirection] = useState<string>('');
    const { theme } = useTheme();

    // Обработчик начала перетаскивания
    const handleMouseDown = (e: React.MouseEvent) => {
        if (mode !== 'edit') return;

        e.stopPropagation();
        onSelect(element);

        // Проверяем, не начали ли мы ресайз с хендла
        const target = e.target as HTMLElement;
        if (target.classList.contains('resize-handle')) {
            return; // Ресайз обрабатывается отдельно
        }

        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setElementStart({
            x: element.position.x,
            y: element.position.y,
            width: typeof element.position.width === 'number' ? element.position.width : parseInt(element.position.width as string),
            height: typeof element.position.height === 'number' ? element.position.height : parseInt(element.position.height as string)
        });

        onDragStateChange({ isDragging: true, elementType: element.type, elementData: element });
    };

    // Обработчик ресайза
    const handleResizeStart = (e: React.MouseEvent, direction: string) => {
        e.stopPropagation();
        onSelect(element);

        setIsResizing(true);
        setResizeDirection(direction);
        setDragStart({ x: e.clientX, y: e.clientY });
        setElementStart({
            x: element.position.x,
            y: element.position.y,
            width: typeof element.position.width === 'number' ? element.position.width : parseInt(element.position.width as string),
            height: typeof element.position.height === 'number' ? element.position.height : parseInt(element.position.height as string)
        });
    };

    // Глобальные обработчики для drag и resize
    useEffect(() => {
        if (!isDragging && !isResizing) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                handleDragMove(e);
            } else if (isResizing) {
                handleResizeMove(e);
            }
        };

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                onDragStateChange({ isDragging: false, elementType: '', elementData: null });
            }
            if (isResizing) {
                setIsResizing(false);
                setResizeDirection('');
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, isResizing, resizeDirection]);

    // Логика перемещения
    const handleDragMove = (e: MouseEvent) => {
        if (!containerRect) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        let newX = elementStart.x + deltaX;
        let newY = elementStart.y + deltaY;

        // Ограничиваем перемещение в пределах контейнера
        const elementWidth = typeof element.position.width === 'number' ? element.position.width : parseInt(element.position.width as string);
        const elementHeight = typeof element.position.height === 'number' ? element.position.height : parseInt(element.position.height as string);

        newX = Math.max(0, Math.min(newX, containerRect.width - elementWidth));
        newY = Math.max(0, Math.min(newY, containerRect.height - elementHeight));

        // Вычисляем направляющие
        const tempElement = {
            ...element,
            position: { ...element.position, x: newX, y: newY }
        };

        const alignmentResult = calculateGuides(tempElement, allElements, containerRect);

        // Применяем привязку
        if (alignmentResult.snappedPosition) {
            newX = alignmentResult.snappedPosition.x;
            newY = alignmentResult.snappedPosition.y;
        }

        onMove(element.id, { x: newX, y: newY });
    };

    // Логика ресайза
    const handleResizeMove = (e: MouseEvent) => {
        if (!containerRect) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        let newWidth = elementStart.width;
        let newHeight = elementStart.height;
        let newX = elementStart.x;
        let newY = elementStart.y;

        const minSize = 20; // Минимальный размер элемента

        switch (resizeDirection) {
            case 'nw': // северо-запад
                newWidth = Math.max(minSize, elementStart.width - deltaX);
                newHeight = Math.max(minSize, elementStart.height - deltaY);
                newX = elementStart.x + (elementStart.width - newWidth);
                newY = elementStart.y + (elementStart.height - newHeight);
                break;
            case 'ne': // северо-восток
                newWidth = Math.max(minSize, elementStart.width + deltaX);
                newHeight = Math.max(minSize, elementStart.height - deltaY);
                newY = elementStart.y + (elementStart.height - newHeight);
                break;
            case 'sw': // юго-запад
                newWidth = Math.max(minSize, elementStart.width - deltaX);
                newHeight = Math.max(minSize, elementStart.height + deltaY);
                newX = elementStart.x + (elementStart.width - newWidth);
                break;
            case 'se': // юго-восток
                newWidth = Math.max(minSize, elementStart.width + deltaX);
                newHeight = Math.max(minSize, elementStart.height + deltaY);
                break;
            case 'n': // север
                newHeight = Math.max(minSize, elementStart.height - deltaY);
                newY = elementStart.y + (elementStart.height - newHeight);
                break;
            case 's': // юг
                newHeight = Math.max(minSize, elementStart.height + deltaY);
                break;
            case 'w': // запад
                newWidth = Math.max(minSize, elementStart.width - deltaX);
                newX = elementStart.x + (elementStart.width - newWidth);
                break;
            case 'e': // восток
                newWidth = Math.max(minSize, elementStart.width + deltaX);
                break;
        }

        // Ограничиваем размеры в пределах контейнера
        if (newX + newWidth > containerRect.width) {
            newWidth = containerRect.width - newX;
        }
        if (newY + newHeight > containerRect.height) {
            newHeight = containerRect.height - newY;
        }

        onMove(element.id, { x: newX, y: newY });
        onResize(element.id, { width: newWidth, height: newHeight });
    };

    // Обработчик клавиш для удаления
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (mode !== 'edit') return;

        if (e.key === 'Delete' && isSelected) {
            e.preventDefault();
            onDelete(element.id);
        }

        if (e.key === 'Escape' && isSelected) {
            onSelect(null);
        }
    };

    // Обработчик двойного клика для редактирования контента
    const handleDoubleClick = (e: React.MouseEvent) => {
        if (mode !== 'edit') return;

        e.stopPropagation();

        if (element.type === 'text' || element.type === 'heading' || element.type === 'paragraph') {
            // Активируем редактирование текста
            const element = e.currentTarget as HTMLElement;
            const contentEditable = element.querySelector('[contenteditable="true"]') as HTMLElement;
            if (contentEditable) {
                contentEditable.focus();
            }
        }
    };

    // Обработчик изменения контента
    const handleContentChange = (e: React.FormEvent<HTMLElement>) => {
        const newContent = e.currentTarget.textContent || '';
        onUpdate(element.id, { content: newContent });
    };

    // Рендер содержимого элемента в зависимости от типа
    const renderElementContent = () => {
        const baseStyle: React.CSSProperties = {
            ...element.style,
            width: '100%',
            height: '100%',
            boxSizing: 'border-box'
        };

        switch (element.type) {
            case 'text':
            case 'paragraph':
                return (
                    <div
                        className="element-text"
                        style={baseStyle}
                        contentEditable={mode === 'edit' && isSelected}
                        suppressContentEditableWarning
                        onBlur={handleContentChange}
                        dangerouslySetInnerHTML={{ __html: element.content || 'Текст' }}
                    />
                );

            case 'heading':
                const headingLevel = element.props?.level || 'h1';
                const HeadingTag = headingLevel as keyof JSX.IntrinsicElements;
                return (
                    <HeadingTag
                        className="element-heading"
                        style={baseStyle}
                        contentEditable={mode === 'edit' && isSelected}
                        suppressContentEditableWarning
                        onBlur={handleContentChange}
                        dangerouslySetInnerHTML={{ __html: element.content || 'Заголовок' }}
                    />
                );

            case 'button':
                return (
                    <button
                        className="element-button"
                        style={baseStyle}
                        contentEditable={mode === 'edit' && isSelected}
                        suppressContentEditableWarning
                        onBlur={handleContentChange}
                        dangerouslySetInnerHTML={{ __html: element.content || 'Кнопка' }}
                    />
                );

            case 'image':
                return (
                    <img
                        className="element-image"
                        src={element.content || element.props?.src || 'https://via.placeholder.com/150'}
                        alt={element.props?.alt || 'Изображение'}
                        style={baseStyle}
                    />
                );

            case 'container':
            case 'section':
                return (
                    <div
                        className={`element-container ${element.type}`}
                        style={baseStyle}
                    >
                        {element.content && (
                            <div
                                contentEditable={mode === 'edit' && isSelected}
                                suppressContentEditableWarning
                                onBlur={handleContentChange}
                                dangerouslySetInnerHTML={{ __html: element.content }}
                            />
                        )}
                        {/* Дочерние элементы будут рендериться родительским контейнером */}
                    </div>
                );

            case 'divider':
                return (
                    <hr
                        className="element-divider"
                        style={baseStyle}
                    />
                );

            case 'spacer':
                return (
                    <div
                        className="element-spacer"
                        style={baseStyle}
                    />
                );

            default:
                return (
                    <div
                        className="element-default"
                        style={baseStyle}
                        contentEditable={mode === 'edit' && isSelected}
                        suppressContentEditableWarning
                        onBlur={handleContentChange}
                        dangerouslySetInnerHTML={{ __html: element.content || 'Элемент' }}
                    />
                );
        }
    };

    // Рендер контролов для редактирования
    const renderElementControls = () => {
        if (mode !== 'edit' || !isSelected) return null;

        return (
            <div className="element-controls">
                {/* Кнопка удаления */}
                <button
                    className="control-btn delete-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(element.id);
                    }}
                    title="Удалить элемент (Delete)"
                >
                    ×
                </button>

                {/* Кнопка дублирования */}
                <button
                    className="control-btn duplicate-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate(element.id);
                    }}
                    title="Дублировать элемент"
                >
                    ⎘
                </button>

                {/* Резайз хендлы */}
                {element.metadata.resizable !== false && (
                    <>
                        <div className="resize-handle n" onMouseDown={(e) => handleResizeStart(e, 'n')} />
                        <div className="resize-handle s" onMouseDown={(e) => handleResizeStart(e, 's')} />
                        <div className="resize-handle w" onMouseDown={(e) => handleResizeStart(e, 'w')} />
                        <div className="resize-handle e" onMouseDown={(e) => handleResizeStart(e, 'e')} />
                        <div className="resize-handle nw" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
                        <div className="resize-handle ne" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
                        <div className="resize-handle sw" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
                        <div className="resize-handle se" onMouseDown={(e) => handleResizeStart(e, 'se')} />
                    </>
                )}

                {/* Информация о размерах */}
                <div className="element-size-info">
                    {Math.round(typeof element.position.width === 'number' ? element.position.width : parseInt(element.position.width as string))} ×
                    {Math.round(typeof element.position.height === 'number' ? element.position.height : parseInt(element.position.height as string))}
                </div>
            </div>
        );
    };

    const elementWidth = typeof element.position.width === 'number' ? element.position.width : parseInt(element.position.width as string);
    const elementHeight = typeof element.position.height === 'number' ? element.position.height : parseInt(element.position.height as string);

    return (
        <div
            ref={elementRef}
            className={`
        builder-element 
        element-${element.type} 
        ${isSelected ? 'selected' : ''} 
        ${isDragging ? 'dragging' : ''}
        ${isResizing ? 'resizing' : ''}
        ${mode === 'preview' ? 'preview-mode' : ''}
      `}
            style={{
                position: 'absolute',
                left: element.position.x,
                top: element.position.y,
                width: elementWidth,
                height: elementHeight,
                zIndex: element.position.zIndex,
                cursor: mode === 'edit' && element.metadata.draggable !== false ? (isDragging ? 'grabbing' : 'grab') : 'default',
                transform: element.position.rotation ? `rotate(${element.position.rotation}deg)` : 'none',
                userSelect: mode === 'edit' ? 'none' : 'auto'
            }}
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            data-element-id={element.id}
            data-element-type={element.type}
        >
            {renderElementContent()}
            {renderElementControls()}

            {/* Подсветка при выборе */}
            {isSelected && mode === 'edit' && (
                <div className="element-selection-overlay" />
            )}
        </div>
    );
};

export default BuilderElement;