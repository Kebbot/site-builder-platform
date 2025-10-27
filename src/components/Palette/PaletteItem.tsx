import React, { useCallback, useState } from 'react';
import { PaletteItem as PaletteItemType } from '../../types/types';
import { useTheme } from '../../contexts/ThemeContext';
import './PaletteItem.css';

interface PaletteItemProps {
    item: PaletteItemType;
    onDragStart: (elementType: string, elementData: any) => void;
    onDragEnd: () => void;
}

export const PaletteItem: React.FC<PaletteItemProps> = ({
    item,
    onDragStart,
    onDragEnd
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const { theme, getColor, getBorderRadius } = useTheme();

    // Обработчик начала перетаскивания
    const handleDragStart = useCallback((e: React.DragEvent) => {
        e.dataTransfer.setData('builder/element', JSON.stringify({
            type: item.element.type,
            data: item.element
        }));

        e.dataTransfer.effectAllowed = 'copy';

        setIsDragging(true);
        onDragStart(item.element.type || item.id, item.element);
    }, [item, onDragStart]);

    // Обработчик окончания перетаскивания
    const handleDragEnd = useCallback(() => {
        setIsDragging(false);
        onDragEnd();
    }, [onDragEnd]);

    // Обработчик клика для быстрого добавления
    const handleClick = useCallback(() => {
        // Можно добавить логику для быстрого добавления элемента в центр активного контейнера
        console.log('Quick add element:', item.name);
    }, [item]);

    // Рендер предпросмотра элемента
    const renderElementPreview = () => {
        const elementStyle: React.CSSProperties = {
            ...item.element.style,
            width: '100%',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            borderRadius: getBorderRadius('md'),
            border: `1px solid ${getColor('border')}`,
            backgroundColor: getColor('surface'),
            color: getColor('text'),
            pointerEvents: 'none',
            overflow: 'hidden'
        };

        switch (item.element.type) {
            case 'text':
                return (
                    <div style={elementStyle}>
                        <span style={{
                            fontSize: '14px',
                            color: getColor('text'),
                            fontFamily: 'inherit'
                        }}>
                            {item.element.content || 'Текст'}
                        </span>
                    </div>
                );

            case 'heading':
                return (
                    <div style={elementStyle}>
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: getColor('text'),
                            margin: 0,
                            fontFamily: 'inherit'
                        }}>
                            {item.element.content || 'Заголовок'}
                        </h3>
                    </div>
                );

            case 'button':
                return (
                    <div style={elementStyle}>
                        <button
                            style={{
                                backgroundColor: getColor('primary'),
                                color: 'white',
                                border: 'none',
                                borderRadius: getBorderRadius('sm'),
                                padding: '8px 16px',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontFamily: 'inherit'
                            }}
                            disabled
                        >
                            {item.element.content || 'Кнопка'}
                        </button>
                    </div>
                );

            case 'image':
                return (
                    <div style={elementStyle}>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(45deg, ${getColor('surface')}, ${getColor('border')})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: getColor('textSecondary'),
                                fontSize: '12px'
                            }}
                        >
                            🖼️ Изображение
                        </div>
                    </div>
                );

            case 'container':
                return (
                    <div style={elementStyle}>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                border: `2px dashed ${getColor('border')}`,
                                borderRadius: getBorderRadius('md'),
                                backgroundColor: getColor('background'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: getColor('textSecondary'),
                                fontSize: '12px'
                            }}
                        >
                            📦 Контейнер
                        </div>
                    </div>
                );

            case 'section':
                return (
                    <div style={elementStyle}>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                border: `1px solid ${getColor('border')}`,
                                borderRadius: getBorderRadius('lg'),
                                backgroundColor: getColor('surface'),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: getColor('textSecondary'),
                                fontSize: '12px',
                                padding: '10px'
                            }}
                        >
                            📑 Секция
                        </div>
                    </div>
                );

            case 'divider':
                return (
                    <div style={elementStyle}>
                        <div
                            style={{
                                width: '100%',
                                height: '1px',
                                backgroundColor: getColor('border'),
                                margin: 'auto 0'
                            }}
                        />
                    </div>
                );

            case 'spacer':
                return (
                    <div style={elementStyle}>
                        <div
                            style={{
                                width: '100%',
                                height: '100%',
                                background: `repeating-linear-gradient(
                  45deg,
                  ${getColor('surface')},
                  ${getColor('surface')} 5px,
                  ${getColor('border')} 5px,
                  ${getColor('border')} 10px
                )`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: getColor('textSecondary'),
                                fontSize: '12px'
                            }}
                        >
                            ⏸️ Отступ
                        </div>
                    </div>
                );

            case 'input':
                return (
                    <div style={elementStyle}>
                        <input
                            type="text"
                            placeholder={item.element.props?.placeholder || 'Поле ввода...'}
                            style={{
                                width: '80%',
                                padding: '8px 12px',
                                border: `1px solid ${getColor('border')}`,
                                borderRadius: getBorderRadius('sm'),
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                backgroundColor: getColor('background'),
                                color: getColor('text')
                            }}
                            disabled
                        />
                    </div>
                );

            default:
                return (
                    <div style={elementStyle}>
                        <span style={{ color: getColor('textSecondary') }}>
                            {item.element.metadata?.name || 'Элемент'}
                        </span>
                    </div>
                );
        }
    };

    return (
        <div
            className={`palette-item ${isDragging ? 'dragging' : ''} category-${item.category}`}
            draggable={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            title={`Добавить ${item.name}`}
        >
            <div className="palette-item-preview">
                {renderElementPreview()}
            </div>

            <div className="palette-item-info">
                <div className="palette-item-header">
                    <span className="palette-item-icon">{item.icon}</span>
                    <span className="palette-item-name">{item.name}</span>
                    {item.isNew && <span className="palette-item-badge">NEW</span>}
                </div>

                <div className="palette-item-description">
                    {item.element.metadata?.name || 'Элемент конструктора'}
                </div>

                <div className="palette-item-meta">
                    <span className="palette-item-category">
                        {getCategoryName(item.category)}
                    </span>
                    <span className="palette-item-popularity">
                        {'★'.repeat(Math.floor(item.popularity / 20))}
                    </span>
                </div>
            </div>

            <div className="palette-item-drag-handle">
                ⋮⋮
            </div>
        </div>
    );
};

// Вспомогательная функция для получения читаемого названия категории
const getCategoryName = (category: string): string => {
    const categoryNames: Record<string, string> = {
        layout: 'Макет',
        content: 'Контент',
        media: 'Медиа',
        form: 'Формы',
        navigation: 'Навигация',
        advanced: 'Расширенные'
    };

    return categoryNames[category] || category;
};

export default PaletteItem;