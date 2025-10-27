import React, { useState, useCallback, useMemo } from 'react';
import { BuilderElement, Container, PropertyGroup, Project } from '../../types/types';
import { useTheme } from '../../contexts/ThemeContext';
import './PropertiesPanel.css';

interface PropertiesPanelProps {
    selectedElement: BuilderElement | null;
    selectedContainer: Container | null;
    project: Project;
    onElementUpdate: (elementId: string, updates: Partial<BuilderElement>) => void;
    onContainerUpdate: (containerId: string, updates: Partial<Container>) => void;
    onProjectUpdate: (updates: Partial<Project>) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    selectedElement,
    selectedContainer,
    project,
    onElementUpdate,
    onContainerUpdate,
    onProjectUpdate
}) => {
    const { theme, getColor, getBorderRadius } = useTheme();
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['layout', 'typography']));

    // Группы свойств для элемента
    const elementPropertyGroups = useMemo((): PropertyGroup[] => {
        if (!selectedElement) return [];

        const baseGroups: PropertyGroup[] = [
            {
                id: 'layout',
                name: 'Макет',
                icon: '📐',
                properties: [
                    {
                        id: 'position-x',
                        name: 'Позиция X',
                        type: 'number',
                        value: selectedElement.position.x,
                        unit: 'px',
                        min: 0,
                        category: 'layout'
                    },
                    {
                        id: 'position-y',
                        name: 'Позиция Y',
                        type: 'number',
                        value: selectedElement.position.y,
                        unit: 'px',
                        min: 0,
                        category: 'layout'
                    },
                    {
                        id: 'width',
                        name: 'Ширина',
                        type: 'number',
                        value: typeof selectedElement.position.width === 'number'
                            ? selectedElement.position.width
                            : parseInt(selectedElement.position.width as string),
                        unit: 'px',
                        min: 10,
                        max: 2000,
                        category: 'layout'
                    },
                    {
                        id: 'height',
                        name: 'Высота',
                        type: 'number',
                        value: typeof selectedElement.position.height === 'number'
                            ? selectedElement.position.height
                            : parseInt(selectedElement.position.height as string),
                        unit: 'px',
                        min: 10,
                        max: 2000,
                        category: 'layout'
                    },
                    {
                        id: 'zIndex',
                        name: 'Z-Index',
                        type: 'number',
                        value: selectedElement.position.zIndex,
                        min: 0,
                        max: 9999,
                        category: 'layout'
                    }
                ]
            },
            {
                id: 'typography',
                name: 'Типография',
                icon: '🔤',
                properties: [
                    {
                        id: 'fontSize',
                        name: 'Размер шрифта',
                        type: 'number',
                        value: selectedElement.style.fontSize || 16,
                        unit: 'px',
                        min: 8,
                        max: 72,
                        category: 'typography'
                    },
                    {
                        id: 'fontWeight',
                        name: 'Насыщенность',
                        type: 'select',
                        value: selectedElement.style.fontWeight || 'normal',
                        options: [
                            { label: 'Тонкий', value: '100' },
                            { label: 'Светлый', value: '300' },
                            { label: 'Обычный', value: 'normal' },
                            { label: 'Средний', value: '500' },
                            { label: 'Полужирный', value: '600' },
                            { label: 'Жирный', value: 'bold' },
                            { label: 'Черный', value: '900' }
                        ],
                        category: 'typography'
                    },
                    {
                        id: 'textAlign',
                        name: 'Выравнивание',
                        type: 'select',
                        value: selectedElement.style.textAlign || 'left',
                        options: [
                            { label: 'Слева', value: 'left' },
                            { label: 'По центру', value: 'center' },
                            { label: 'Справа', value: 'right' },
                            { label: 'По ширине', value: 'justify' }
                        ],
                        category: 'typography'
                    },
                    {
                        id: 'color',
                        name: 'Цвет текста',
                        type: 'color',
                        value: selectedElement.style.color || getColor('text'),
                        category: 'typography'
                    },
                    {
                        id: 'lineHeight',
                        name: 'Межстрочный интервал',
                        type: 'range',
                        value: selectedElement.style.lineHeight || 1.5,
                        min: 1,
                        max: 3,
                        step: 0.1,
                        category: 'typography'
                    }
                ]
            },
            {
                id: 'background',
                name: 'Фон',
                icon: '🎨',
                properties: [
                    {
                        id: 'backgroundColor',
                        name: 'Цвет фона',
                        type: 'color',
                        value: selectedElement.style.backgroundColor || 'transparent',
                        category: 'background'
                    },
                    {
                        id: 'backgroundImage',
                        name: 'Фоновое изображение',
                        type: 'image',
                        value: selectedElement.style.backgroundImage || '',
                        category: 'background'
                    },
                    {
                        id: 'opacity',
                        name: 'Прозрачность',
                        type: 'range',
                        value: selectedElement.style.opacity || 1,
                        min: 0,
                        max: 1,
                        step: 0.1,
                        category: 'background'
                    }
                ]
            },
            {
                id: 'border',
                name: 'Граница',
                icon: '🔲',
                properties: [
                    {
                        id: 'border',
                        name: 'Граница',
                        type: 'text',
                        value: selectedElement.style.border || '',
                        category: 'border'
                    },
                    {
                        id: 'borderRadius',
                        name: 'Скругление углов',
                        type: 'text',
                        value: selectedElement.style.borderRadius || '0px',
                        category: 'border'
                    },
                    {
                        id: 'borderColor',
                        name: 'Цвет границы',
                        type: 'color',
                        value: selectedElement.style.borderColor || '#d1d5db',
                        category: 'border'
                    }
                ]
            },
            {
                id: 'effects',
                name: 'Эффекты',
                icon: '✨',
                properties: [
                    {
                        id: 'boxShadow',
                        name: 'Тень',
                        type: 'shadow',
                        value: selectedElement.style.boxShadow || '',
                        category: 'effects'
                    },
                    {
                        id: 'transform',
                        name: 'Трансформация',
                        type: 'text',
                        value: selectedElement.style.transform || '',
                        category: 'effects'
                    },
                    {
                        id: 'transition',
                        name: 'Переход',
                        type: 'text',
                        value: selectedElement.style.transition || '',
                        category: 'effects'
                    }
                ]
            },
            {
                id: 'advanced',
                name: 'Дополнительно',
                icon: '⚙️',
                properties: [
                    {
                        id: 'className',
                        name: 'CSS класс',
                        type: 'text',
                        value: selectedElement.props?.className || '',
                        category: 'advanced'
                    },
                    {
                        id: 'id',
                        name: 'ID элемента',
                        type: 'text',
                        value: selectedElement.props?.id || '',
                        category: 'advanced'
                    },
                    {
                        id: 'customCSS',
                        name: 'Пользовательский CSS',
                        type: 'text',
                        value: selectedElement.props?.customCSS || '',
                        category: 'advanced'
                    }
                ]
            }
        ];

        // Добавляем специфичные свойства для разных типов элементов
        if (selectedElement.type === 'button') {
            baseGroups.find(g => g.id === 'typography')?.properties.push(
                {
                    id: 'buttonVariant',
                    name: 'Вариант кнопки',
                    type: 'select',
                    value: selectedElement.props?.variant || 'primary',
                    options: [
                        { label: 'Основная', value: 'primary' },
                        { label: 'Вторичная', value: 'secondary' },
                        { label: 'Текстовая', value: 'text' },
                        { label: 'С обводкой', value: 'outline' }
                    ],
                    category: 'typography'
                }
            );
        }

        if (selectedElement.type === 'image') {
            baseGroups.find(g => g.id === 'advanced')?.properties.unshift(
                {
                    id: 'altText',
                    name: 'Alt текст',
                    type: 'text',
                    value: selectedElement.props?.alt || '',
                    category: 'advanced'
                },
                {
                    id: 'objectFit',
                    name: 'Обрезка изображения',
                    type: 'select',
                    value: selectedElement.style.objectFit || 'cover',
                    options: [
                        { label: 'Заполнить', value: 'fill' },
                        { label: 'Обрезать', value: 'cover' },
                        { label: 'Вписать', value: 'contain' },
                        { label: 'По размеру', value: 'none' },
                        { label: 'Масштабировать', value: 'scale-down' }
                    ],
                    category: 'advanced'
                }
            );
        }

        return baseGroups;
    }, [selectedElement, theme]);

    // Группы свойств для контейнера
    const containerPropertyGroups = useMemo((): PropertyGroup[] => {
        if (!selectedContainer) return [];

        return [
            {
                id: 'container-layout',
                name: 'Макет контейнера',
                icon: '📐',
                properties: [
                    {
                        id: 'containerWidth',
                        name: 'Ширина',
                        type: 'text',
                        value: selectedContainer.style.width,
                        category: 'layout'
                    },
                    {
                        id: 'containerHeight',
                        name: 'Высота',
                        type: 'text',
                        value: selectedContainer.style.height,
                        category: 'layout'
                    },
                    {
                        id: 'minHeight',
                        name: 'Минимальная высота',
                        type: 'text',
                        value: selectedContainer.style.minHeight,
                        category: 'layout'
                    }
                ]
            },
            {
                id: 'container-background',
                name: 'Фон контейнера',
                icon: '🎨',
                properties: [
                    {
                        id: 'containerBackgroundColor',
                        name: 'Цвет фона',
                        type: 'color',
                        value: selectedContainer.style.backgroundColor,
                        category: 'background'
                    },
                    {
                        id: 'containerBackgroundImage',
                        name: 'Фоновое изображение',
                        type: 'image',
                        value: selectedContainer.style.backgroundImage || '',
                        category: 'background'
                    }
                ]
            }
        ];
    }, [selectedContainer]);

    // Группы свойств для проекта
    const projectPropertyGroups = useMemo((): PropertyGroup[] => {
        return [
            {
                id: 'page-settings',
                name: 'Настройки страницы',
                icon: '📄',
                properties: [
                    {
                        id: 'pageWidth',
                        name: 'Ширина страницы',
                        type: 'select',
                        value: project.settings.pageWidth,
                        options: [
                            { label: 'Полная ширина', value: '100%' },
                            { label: '1200px', value: '1200px' },
                            { label: '992px', value: '992px' },
                            { label: '768px', value: '768px' }
                        ],
                        category: 'layout'
                    },
                    {
                        id: 'pageBackground',
                        name: 'Фон страницы',
                        type: 'color',
                        value: project.settings.pageBackground,
                        category: 'background'
                    },
                    {
                        id: 'pageTitle',
                        name: 'Заголовок страницы',
                        type: 'text',
                        value: project.settings.title,
                        category: 'content'
                    }
                ]
            },
            {
                id: 'builder-settings',
                name: 'Настройки конструктора',
                icon: '⚙️',
                properties: [
                    {
                        id: 'gridEnabled',
                        name: 'Показывать сетку',
                        type: 'boolean',
                        value: project.settings.grid,
                        category: 'layout'
                    },
                    {
                        id: 'snapEnabled',
                        name: 'Включить привязку',
                        type: 'boolean',
                        value: project.settings.snap,
                        category: 'layout'
                    },
                    {
                        id: 'viewport',
                        name: 'Разрешение',
                        type: 'select',
                        value: project.settings.viewport,
                        options: [
                            { label: 'Десктоп', value: 'desktop' },
                            { label: 'Планшет', value: 'tablet' },
                            { label: 'Мобильный', value: 'mobile' }
                        ],
                        category: 'layout'
                    }
                ]
            }
        ];
    }, [project]);

    // Обработчик изменения свойства
    const handlePropertyChange = useCallback((propertyId: string, value: any) => {
        if (selectedElement) {
            // Определяем категорию свойства и обновляем соответствующий объект
            if (propertyId.startsWith('position-')) {
                const positionField = propertyId.replace('position-', '');
                onElementUpdate(selectedElement.id, {
                    position: { ...selectedElement.position, [positionField]: value }
                });
            } else if (['width', 'height', 'zIndex'].includes(propertyId)) {
                onElementUpdate(selectedElement.id, {
                    position: { ...selectedElement.position, [propertyId]: value }
                });
            } else {
                onElementUpdate(selectedElement.id, {
                    style: { ...selectedElement.style, [propertyId]: value }
                });
            }
        } else if (selectedContainer) {
            if (propertyId.startsWith('container')) {
                const styleField = propertyId.replace('container', '').replace(/^[A-Z]/, match => match.toLowerCase());
                onContainerUpdate(selectedContainer.id, {
                    style: { ...selectedContainer.style, [styleField]: value }
                });
            }
        } else {
            // Обновление настроек проекта
            if (propertyId === 'pageWidth' || propertyId === 'pageBackground' || propertyId === 'pageTitle') {
                const settingsField = propertyId.replace('page', '').replace(/^[A-Z]/, match => match.toLowerCase());
                onProjectUpdate({
                    settings: { ...project.settings, [settingsField]: value }
                });
            } else if (propertyId === 'gridEnabled' || propertyId === 'snapEnabled' || propertyId === 'viewport') {
                const settingsField = propertyId.replace('Enabled', '').toLowerCase();
                onProjectUpdate({
                    settings: { ...project.settings, [settingsField]: value }
                });
            }
        }
    }, [selectedElement, selectedContainer, project, onElementUpdate, onContainerUpdate, onProjectUpdate]);

    // Переключение раскрытия группы
    const toggleGroup = useCallback((groupId: string) => {
        setExpandedGroups(prev => {
            const newSet = new Set(prev);
            if (newSet.has(groupId)) {
                newSet.delete(groupId);
            } else {
                newSet.add(groupId);
            }
            return newSet;
        });
    }, []);

    // Рендер контрола для свойства
    const renderPropertyControl = (property: any) => {
        const commonProps = {
            key: property.id,
            value: property.value,
            onChange: (value: any) => handlePropertyChange(property.id, value),
            className: 'property-control'
        };

        switch (property.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        {...commonProps}
                        placeholder={property.name}
                    />
                );

            case 'number':
                return (
                    <div className="number-control">
                        <input
                            type="number"
                            {...commonProps}
                            min={property.min}
                            max={property.max}
                            step={property.step}
                        />
                        {property.unit && <span className="property-unit">{property.unit}</span>}
                    </div>
                );

            case 'color':
                return (
                    <div className="color-control">
                        <input
                            type="color"
                            {...commonProps}
                        />
                        <span className="color-value">{property.value}</span>
                    </div>
                );

            case 'select':
                return (
                    <select {...commonProps}>
                        {property.options?.map((option: any) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'boolean':
                return (
                    <label className="boolean-control">
                        <input
                            type="checkbox"
                            checked={!!property.value}
                            onChange={(e) => commonProps.onChange(e.target.checked)}
                        />
                        <span className="boolean-slider"></span>
                    </label>
                );

            case 'range':
                return (
                    <div className="range-control">
                        <input
                            type="range"
                            {...commonProps}
                            min={property.min}
                            max={property.max}
                            step={property.step}
                        />
                        <span className="range-value">{property.value}</span>
                    </div>
                );

            case 'image':
                return (
                    <div className="image-control">
                        <input
                            type="text"
                            {...commonProps}
                            placeholder="URL изображения"
                        />
                        <button className="browse-button">Обзор</button>
                    </div>
                );

            default:
                return (
                    <input
                        type="text"
                        {...commonProps}
                        placeholder={property.name}
                    />
                );
        }
    };

    // Рендер групп свойств
    const renderPropertyGroups = (groups: PropertyGroup[]) => {
        return groups.map(group => (
            <div key={group.id} className="property-group">
                <div
                    className="property-group-header"
                    onClick={() => toggleGroup(group.id)}
                >
                    <span className="group-icon">{group.icon}</span>
                    <span className="group-name">{group.name}</span>
                    <span className="group-toggle">
                        {expandedGroups.has(group.id) ? '▼' : '►'}
                    </span>
                </div>

                {expandedGroups.has(group.id) && (
                    <div className="property-group-content">
                        {group.properties.map(property => (
                            <div key={property.id} className="property-item">
                                <label className="property-label">
                                    {property.name}
                                </label>
                                <div className="property-control-wrapper">
                                    {renderPropertyControl(property)}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ));
    };

    // Определяем, что показывать в панели
    const getPanelContent = () => {
        if (selectedElement) {
            return (
                <>
                    <div className="properties-header">
                        <div className="element-info">
                            <span className="element-icon">{selectedElement.metadata.icon}</span>
                            <div className="element-details">
                                <h3 className="element-name">{selectedElement.metadata.name}</h3>
                                <span className="element-type">{selectedElement.type}</span>
                            </div>
                        </div>
                    </div>
                    {renderPropertyGroups(elementPropertyGroups)}
                </>
            );
        }

        if (selectedContainer) {
            return (
                <>
                    <div className="properties-header">
                        <div className="element-info">
                            <span className="element-icon">📦</span>
                            <div className="element-details">
                                <h3 className="element-name">{selectedContainer.name}</h3>
                                <span className="element-type">Контейнер ({selectedContainer.type})</span>
                            </div>
                        </div>
                    </div>
                    {renderPropertyGroups(containerPropertyGroups)}
                </>
            );
        }

        return (
            <>
                <div className="properties-header">
                    <div className="element-info">
                        <span className="element-icon">📄</span>
                        <div className="element-details">
                            <h3 className="element-name">Настройки проекта</h3>
                            <span className="element-type">{project.name}</span>
                        </div>
                    </div>
                </div>
                {renderPropertyGroups(projectPropertyGroups)}
            </>
        );
    };

    return (
        <div className="properties-panel">
            <div className="properties-content">
                {getPanelContent()}
            </div>

            {/* Состояние, когда ничего не выбрано */}
            {!selectedElement && !selectedContainer && (
                <div className="properties-empty">
                    <div className="empty-icon">⚙️</div>
                    <div className="empty-text">Выберите элемент для редактирования</div>
                    <div className="empty-hint">
                        Кликните на любой элемент на холсте, чтобы увидеть его свойства
                    </div>
                </div>
            )}
        </div>
    );
};

export default PropertiesPanel;