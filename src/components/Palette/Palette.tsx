import React, { useState, useCallback, useMemo } from 'react';
import { PaletteItem as PaletteItemType, DragState } from '../../types/types';
import { PaletteItem } from './PaletteItem';
import { useTheme } from '../../contexts/ThemeContext';
import './Palette.css';

interface PaletteProps {
    onDragStart: (dragState: DragState) => void;
    onDragEnd: () => void;
    isDragging: boolean;
}

const defaultPaletteItems: PaletteItemType[] = [
    {
        id: 'text',
        name: 'Текст',
        icon: '📝',
        category: 'content',
        element: {
            type: 'text',
            content: 'Текст',
            style: {
                fontSize: 16,
                color: '#1f2937',
                padding: '8px',
                fontFamily: 'inherit'
            },
            metadata: {
                name: 'Текст',
                icon: '📝',
                category: 'content',
                canHaveChildren: false,
                resizable: true,
                draggable: true,
                defaultSize: { width: 200, height: 40 }
            }
        },
        popularity: 90
    },
    {
        id: 'heading',
        name: 'Заголовок',
        icon: '🔤',
        category: 'content',
        element: {
            type: 'heading',
            content: 'Заголовок',
            style: {
                fontSize: 24,
                fontWeight: 'bold',
                color: '#1f2937',
                padding: '12px',
                fontFamily: 'inherit'
            },
            props: { level: 'h1' },
            metadata: {
                name: 'Заголовок',
                icon: '🔤',
                category: 'content',
                canHaveChildren: false,
                resizable: true,
                draggable: true,
                defaultSize: { width: 300, height: 60 }
            }
        },
        popularity: 85
    },
    {
        id: 'button',
        name: 'Кнопка',
        icon: '🔘',
        category: 'content',
        element: {
            type: 'button',
            content: 'Кнопка',
            style: {
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '6px',
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer',
                textAlign: 'center' as const
            },
            metadata: {
                name: 'Кнопка',
                icon: '🔘',
                category: 'content',
                canHaveChildren: false,
                resizable: true,
                draggable: true,
                defaultSize: { width: 120, height: 44 }
            }
        },
        popularity: 80
    },
    {
        id: 'image',
        name: 'Изображение',
        icon: '🖼️',
        category: 'media',
        element: {
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
                draggable: true,
                defaultSize: { width: 200, height: 150 }
            }
        },
        popularity: 75
    },
    {
        id: 'container',
        name: 'Контейнер',
        icon: '📦',
        category: 'layout',
        element: {
            type: 'container',
            content: '',
            style: {
                backgroundColor: '#f8fafc',
                border: '1px dashed #e5e7eb',
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
                isContainer: true,
                defaultSize: { width: 300, height: 200 }
            }
        },
        popularity: 70
    },
    {
        id: 'section',
        name: 'Секция',
        icon: '📑',
        category: 'layout',
        element: {
            type: 'section',
            content: '',
            style: {
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                padding: '40px 20px',
                minHeight: '200px'
            },
            metadata: {
                name: 'Секция',
                icon: '📑',
                category: 'layout',
                canHaveChildren: true,
                resizable: true,
                draggable: true,
                isContainer: true,
                defaultSize: { width: 400, height: 300 }
            }
        },
        popularity: 65
    },
    {
        id: 'divider',
        name: 'Разделитель',
        icon: '➖',
        category: 'layout',
        element: {
            type: 'divider',
            content: '',
            style: {
                borderTop: '1px solid #e5e7eb',
                height: '1px',
                margin: '20px 0'
            },
            metadata: {
                name: 'Разделитель',
                icon: '➖',
                category: 'layout',
                canHaveChildren: false,
                resizable: false,
                draggable: true,
                defaultSize: { width: 300, height: 1 }
            }
        },
        popularity: 60
    },
    {
        id: 'spacer',
        name: 'Отступ',
        icon: '⏸️',
        category: 'layout',
        element: {
            type: 'spacer',
            content: '',
            style: {
                height: '40px',
                backgroundColor: 'transparent'
            },
            metadata: {
                name: 'Отступ',
                icon: '⏸️',
                category: 'layout',
                canHaveChildren: false,
                resizable: true,
                draggable: true,
                defaultSize: { width: 100, height: 40 }
            }
        },
        popularity: 55
    },
    {
        id: 'input',
        name: 'Поле ввода',
        icon: '📝',
        category: 'form',
        element: {
            type: 'input',
            content: '',
            style: {
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
                fontFamily: 'inherit'
            },
            props: {
                placeholder: 'Введите текст...',
                type: 'text'
            },
            metadata: {
                name: 'Поле ввода',
                icon: '📝',
                category: 'form',
                canHaveChildren: false,
                resizable: true,
                draggable: true,
                defaultSize: { width: 200, height: 40 }
            }
        },
        popularity: 50
    }
];

const categories = [
    { id: 'all', name: 'Все элементы', icon: '📁' },
    { id: 'layout', name: 'Макет', icon: '📐' },
    { id: 'content', name: 'Контент', icon: '📝' },
    { id: 'media', name: 'Медиа', icon: '🖼️' },
    { id: 'form', name: 'Формы', icon: '📋' }
];

export const Palette: React.FC<PaletteProps> = ({
    onDragStart,
    onDragEnd,
    isDragging
}) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { theme } = useTheme();

    // Фильтрация элементов по категории и поисковому запросу
    const filteredItems = useMemo(() => {
        return defaultPaletteItems.filter(item => {
            const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.element.metadata.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    // Обработчик начала перетаскивания элемента
    const handleDragStart = useCallback((elementType: string, elementData: any) => {
        onDragStart({
            isDragging: true,
            elementType,
            elementData,
            source: 'palette'
        });
    }, [onDragStart]);

    // Обработчик окончания перетаскивания
    const handleDragEnd = useCallback(() => {
        onDragEnd();
    }, [onDragEnd]);

    return (
        <div className={`palette ${isDragging ? 'dragging' : ''}`}>
            <div className="palette-header">
                <h2 className="palette-title">Элементы</h2>
                <div className="palette-search">
                    <input
                        type="text"
                        placeholder="Поиск элементов..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <div className="palette-categories">
                {categories.map(category => (
                    <button
                        key={category.id}
                        className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-name">{category.name}</span>
                    </button>
                ))}
            </div>

            <div className="palette-items">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <PaletteItem
                            key={item.id}
                            item={item}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        />
                    ))
                ) : (
                    <div className="palette-empty">
                        <div className="empty-icon">🔍</div>
                        <div className="empty-text">Элементы не найдены</div>
                        <div className="empty-hint">
                            Попробуйте изменить запрос или выбрать другую категорию
                        </div>
                    </div>
                )}
            </div>

            <div className="palette-footer">
                <div className="palette-stats">
                    {filteredItems.length} элементов
                </div>
                <div className="palette-hint">
                    Перетащите элемент на холст
                </div>
            </div>
        </div>
    );
};

export default Palette;