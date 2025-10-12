import React, { useState } from 'react';
import { Component } from '../../types/types';
import ZeroBlockEditor from '../../ZeroBlock/ZeroBlockEditor';
import './PropertiesPanel.css';

interface PropertiesPanelProps {
    component: Component | null;
    onUpdateComponent: (component: Component) => void;
    onDeleteComponent?: (componentId: string) => void;
    onCopyComponent?: (component: Component) => void;
    onDuplicateComponent?: (component: Component) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
    component,
    onUpdateComponent,
    onDeleteComponent,
    onCopyComponent,
    onDuplicateComponent
}) => {
    const [showZeroBlockEditor, setShowZeroBlockEditor] = useState(false);

    if (!component) {
        return (
            <div className="properties-panel">
                <div className="properties-empty">
                    <div className="empty-icon">🎯</div>
                    <h3>Выберите элемент</h3>
                    <p>Кликните на любой элемент в рабочей области чтобы редактировать его свойства</p>
                </div>
            </div>
        );
    }

    const handleTextChange = (text: string) => {
        onUpdateComponent({
            ...component,
            props: {
                ...component.props,
                text: text
            }
        });
    };

    const handleStyleChange = (property: string, value: string) => {
        onUpdateComponent({
            ...component,
            styles: {
                ...component.styles,
                [property]: value
            }
        });
    };

    const handleDelete = () => {
        if (onDeleteComponent && component.id) {
            onDeleteComponent(component.id);
        }
    };

    const handleCopy = () => {
        if (onCopyComponent && component) {
            onCopyComponent(component);
        }
    };

    const handleDuplicate = () => {
        if (onDuplicateComponent && component) {
            onDuplicateComponent(component);
        }
    };

    const handleZeroBlockSave = (html: string, css: string, js: string) => {
        onUpdateComponent({
            ...component,
            props: {
                ...component.props,
                customHTML: html,
                customCSS: css,
                customJS: js
            }
        });
        setShowZeroBlockEditor(false);
    };
    // Специфические свойства для Section (ИСПРАВЛЕННАЯ ВЕРСИЯ)
    const renderSectionProperties = () => (
        <div className="property-section">
            <h4>📦 Настройки секции</h4>
            <div className="property-group">
                <label>Цвет фона</label>
                <input
                    type="color"
                    value={component.styles.backgroundColor || '#f7fafc'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="property-input"
                />
            </div>

            <div className="property-row">
                <div className="property-group">
                    <label>Высота</label>
                    <select
                        value={component.styles.height || 'auto'}
                        onChange={(e) => handleStyleChange('height', e.target.value)}
                        className="property-input"
                    >
                        <option value="auto">Авто</option>
                        <option value="100px">100px</option>
                        <option value="150px">150px</option>
                        <option value="200px">200px</option>
                        <option value="300px">300px</option>
                        <option value="400px">400px</option>
                        <option value="500px">500px</option>
                    </select>
                </div>

                <div className="property-group">
                    <label>Направление flex</label>
                    <select
                        value={component.styles.flexDirection || 'column'}
                        onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                        className="property-input"
                    >
                        <option value="column">⬇️ Колонка</option>
                        <option value="row">➡️ Ряд</option>
                        <option value="column-reverse">⬆️ Колонка (обратно)</option>
                        <option value="row-reverse">⬅️ Ряд (обратно)</option>
                    </select>
                </div>
            </div>

            <div className="property-group">
                <label>Выравнивание элементов</label>
                <select
                    value={component.styles.alignItems || 'stretch'}
                    onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                    className="property-input"
                >
                    <option value="stretch">📏 Растянуть</option>
                    <option value="flex-start">⬆️ В начале</option>
                    <option value="center">⏺️ По центру</option>
                    <option value="flex-end">⬇️ В конце</option>
                </select>
            </div>
        </div>
    );

    // Специфические свойства для Grid (ИСПРАВЛЕННАЯ ВЕРСИЯ)
    const renderGridProperties = () => (
        <div className="property-section">
            <h4>🔲 Настройки Grid сетки</h4>

            <div className="property-group">
                <label>Колонки сетки</label>
                <select
                    value={component.styles.gridTemplateColumns || 'repeat(2, 1fr)'}
                    onChange={(e) => handleStyleChange('gridTemplateColumns', e.target.value)}
                    className="property-input"
                >
                    <option value="1fr">1 колонка</option>
                    <option value="repeat(2, 1fr)">2 колонки</option>
                    <option value="repeat(3, 1fr)">3 колонки</option>
                    <option value="repeat(4, 1fr)">4 колонки</option>
                    <option value="repeat(auto-fit, minmax(200px, 1fr))">Авто-подбор</option>
                </select>
            </div>

            <div className="property-row">
                <div className="property-group">
                    <label>Расстояние между элементами</label>
                    <select
                        value={component.styles.gridGap || '10px'}
                        onChange={(e) => handleStyleChange('gridGap', e.target.value)}
                        className="property-input"
                    >
                        <option value="5px">5px - Маленькое</option>
                        <option value="10px">10px - Среднее</option>
                        <option value="15px">15px - Большое</option>
                        <option value="20px">20px - Очень большое</option>
                    </select>
                </div>

                <div className="property-group">
                    <label>Высота</label>
                    <select
                        value={component.styles.height || 'auto'}
                        onChange={(e) => handleStyleChange('height', e.target.value)}
                        className="property-input"
                    >
                        <option value="auto">Авто</option>
                        <option value="150px">150px</option>
                        <option value="200px">200px</option>
                        <option value="250px">250px</option>
                        <option value="300px">300px</option>
                    </select>
                </div>
            </div>

            <div className="property-group">
                <label>Цвет фона</label>
                <input
                    type="color"
                    value={component.styles.backgroundColor || '#fff5f5'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="property-input"
                />
            </div>
        </div>
    );

    // Специфические свойства для Flex (ИСПРАВЛЕННАЯ ВЕРСИЯ)
    const renderFlexProperties = () => (
        <div className="property-section">
            <h4>📏 Настройки Flex контейнера</h4>

            <div className="property-row">
                <div className="property-group">
                    <label>Направление</label>
                    <select
                        value={component.styles.flexDirection || 'row'}
                        onChange={(e) => handleStyleChange('flexDirection', e.target.value)}
                        className="property-input"
                    >
                        <option value="row">➡️ Горизонтально (row)</option>
                        <option value="column">⬇️ Вертикально (column)</option>
                        <option value="row-reverse">⬅️ Горизонтально (обратно)</option>
                        <option value="column-reverse">⬆️ Вертикально (обратно)</option>
                    </select>
                </div>

                <div className="property-group">
                    <label>Выравнивание по главной оси</label>
                    <select
                        value={component.styles.justifyContent || 'center'}
                        onChange={(e) => handleStyleChange('justifyContent', e.target.value)}
                        className="property-input"
                    >
                        <option value="flex-start">⬅️ В начале</option>
                        <option value="center">⏺️ По центру</option>
                        <option value="flex-end">➡️ В конце</option>
                        <option value="space-between">↔️ Равномерно</option>
                        <option value="space-around">⏺️↔️ С отступами</option>
                    </select>
                </div>
            </div>

            <div className="property-row">
                <div className="property-group">
                    <label>Выравнивание по поперечной оси</label>
                    <select
                        value={component.styles.alignItems || 'center'}
                        onChange={(e) => handleStyleChange('alignItems', e.target.value)}
                        className="property-input"
                    >
                        <option value="stretch">📏 Растянуть</option>
                        <option value="flex-start">⬆️ В начале</option>
                        <option value="center">⏺️ По центру</option>
                        <option value="flex-end">⬇️ В конце</option>
                    </select>
                </div>

                <div className="property-group">
                    <label>Перенос элементов</label>
                    <select
                        value={component.styles.flexWrap || 'nowrap'}
                        onChange={(e) => handleStyleChange('flexWrap', e.target.value)}
                        className="property-input"
                    >
                        <option value="nowrap">🚫 Без переноса</option>
                        <option value="wrap">↩️ С переносом</option>
                        <option value="wrap-reverse">🔄 Обратный перенос</option>
                    </select>
                </div>
            </div>

            <div className="property-group">
                <label>Высота</label>
                <select
                    value={component.styles.height || 'auto'}
                    onChange={(e) => handleStyleChange('height', e.target.value)}
                    className="property-input"
                >
                    <option value="auto">Авто</option>
                    <option value="100px">100px</option>
                    <option value="150px">150px</option>
                    <option value="200px">200px</option>
                </select>
            </div>

            <div className="property-group">
                <label>Цвет фона</label>
                <input
                    type="color"
                    value={component.styles.backgroundColor || '#f0fff4'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="property-input"
                />
            </div>
        </div>
    );

    const getComponentIcon = (type: string) => {
        switch (type) {
            case 'text': return '📝';
            case 'button': return '🔘';
            case 'image': return '🖼️';
            case 'header': return '🔝';
            case 'footer': return '🔻';
            case 'card': return '🎴';
            case 'form': return '📋';
            case 'input': return '📝';
            case 'zeroblock': return '🎛️';
            default: return '⚙️';
        }
    };

    // Общие свойства для всех элементов
    const renderCommonProperties = () => (
        <div className="property-section">
            <h4>📐 Размер и отступы</h4>

            <div className="property-row">
                <div className="property-group">
                    <label>Ширина</label>
                    <select
                        value={component.styles.width || 'auto'}
                        onChange={(e) => handleStyleChange('width', e.target.value)}
                        className="property-input"
                    >
                        <option value="auto">Авто</option>
                        <option value="100%">Полная ширина</option>
                        <option value="50%">50% ширины</option>
                        <option value="300px">Фиксированная (300px)</option>
                    </select>
                </div>

                <div className="property-group">
                    <label>Выравнивание</label>
                    <select
                        value={component.styles.textAlign || 'left'}
                        onChange={(e) => handleStyleChange('textAlign', e.target.value)}
                        className="property-input"
                    >
                        <option value="left">⬅️ Слева</option>
                        <option value="center">⏺️ По центру</option>
                        <option value="right">➡️ Справа</option>
                    </select>
                </div>
            </div>

            <div className="property-row">
                <div className="property-group">
                    <label>Внутренние отступы</label>
                    <input
                        type="text"
                        value={component.styles.padding || '10px'}
                        onChange={(e) => handleStyleChange('padding', e.target.value)}
                        className="property-input"
                        placeholder="10px"
                    />
                </div>

                <div className="property-group">
                    <label>Внешние отступы</label>
                    <input
                        type="text"
                        value={component.styles.margin || '0px'}
                        onChange={(e) => handleStyleChange('margin', e.target.value)}
                        className="property-input"
                        placeholder="0px"
                    />
                </div>
            </div>
        </div>
    );

    // Специфические свойства для текста
    const renderTextProperties = () => (
        <div className="property-section">
            <h4>📝 Содержимое</h4>
            <div className="property-group">
                <label>Текст элемента</label>
                <textarea
                    value={component.props.text || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="property-input"
                    rows={4}
                    placeholder="Введите текст..."
                />
            </div>

            <div className="property-row">
                <div className="property-group">
                    <label>Размер шрифта</label>
                    <select
                        value={component.styles.fontSize || '16px'}
                        onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                        className="property-input"
                    >
                        <option value="12px">12px - Мелкий</option>
                        <option value="14px">14px - Обычный</option>
                        <option value="16px">16px - Средний</option>
                        <option value="18px">18px - Крупный</option>
                        <option value="24px">24px - Заголовок</option>
                        <option value="32px">32px - Большой заголовок</option>
                    </select>
                </div>

                <div className="property-group">
                    <label>Цвет текста</label>
                    <input
                        type="color"
                        value={component.styles.color || '#000000'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        className="property-input"
                    />
                </div>
            </div>

            <div className="property-group">
                <label>Цвет фона</label>
                <input
                    type="color"
                    value={component.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="property-input"
                />
            </div>
        </div>
    );

    // Специфические свойства для кнопки
    const renderButtonProperties = () => (
        <div className="property-section">
            <h4>🔘 Настройки кнопки</h4>
            <div className="property-group">
                <label>Текст кнопки</label>
                <input
                    type="text"
                    value={component.props.text || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="property-input"
                    placeholder="Текст кнопки..."
                />
            </div>

            <div className="property-row">
                <div className="property-group">
                    <label>Цвет фона</label>
                    <input
                        type="color"
                        value={component.styles.backgroundColor || '#4299e1'}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="property-input"
                    />
                </div>

                <div className="property-group">
                    <label>Цвет текста</label>
                    <input
                        type="color"
                        value={component.styles.color || '#ffffff'}
                        onChange={(e) => handleStyleChange('color', e.target.value)}
                        className="property-input"
                    />
                </div>
            </div>

            <div className="property-group">
                <label>Скругление углов</label>
                <select
                    value={component.styles.borderRadius || '4px'}
                    onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                    className="property-input"
                >
                    <option value="0px">Без скругления</option>
                    <option value="4px">Маленькое</option>
                    <option value="8px">Среднее</option>
                    <option value="20px">Большое</option>
                    <option value="50%">Круглая</option>
                </select>
            </div>
        </div>
    );

    // Специфические свойства для изображения
    const renderImageProperties = () => (
        <div className="property-section">
            <h4>🖼️ Настройки изображения</h4>
            <div className="property-group">
                <label>Подпись изображения</label>
                <input
                    type="text"
                    value={component.props.text || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="property-input"
                    placeholder="Описание изображения..."
                />
            </div>

            <div className="property-row">
                <div className="property-group">
                    <label>Высота блока</label>
                    <select
                        value={component.styles.height || '200px'}
                        onChange={(e) => handleStyleChange('height', e.target.value)}
                        className="property-input"
                    >
                        <option value="150px">150px</option>
                        <option value="200px">200px</option>
                        <option value="250px">250px</option>
                        <option value="300px">300px</option>
                        <option value="auto">Авто</option>
                    </select>
                </div>

                <div className="property-group">
                    <label>Цвет фона</label>
                    <input
                        type="color"
                        value={component.styles.backgroundColor || '#f7fafc'}
                        onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                        className="property-input"
                    />
                </div>
            </div>
        </div>
    );

    // Специфические свойства для header
    const renderHeaderProperties = () => (
        <div className="property-section">
            <h4>🔝 Настройки шапки</h4>
            <div className="property-group">
                <label>Текст логотипа</label>
                <input
                    type="text"
                    value={component.props.text || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="property-input"
                    placeholder="Название сайта..."
                />
            </div>

            <div className="property-group">
                <label>Цвет фона</label>
                <input
                    type="color"
                    value={component.styles.backgroundColor || '#2d3748'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="property-input"
                />
            </div>

            <div className="property-group">
                <label>Цвет текста</label>
                <input
                    type="color"
                    value={component.styles.color || '#ffffff'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="property-input"
                />
            </div>
        </div>
    );

    // Специфические свойства для footer
    const renderFooterProperties = () => (
        <div className="property-section">
            <h4>🔻 Настройки подвала</h4>
            <div className="property-group">
                <label>Текст копирайта</label>
                <input
                    type="text"
                    value={component.props.text || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="property-input"
                    placeholder="Текст копирайта..."
                />
            </div>

            <div className="property-group">
                <label>Цвет фона</label>
                <input
                    type="color"
                    value={component.styles.backgroundColor || '#4a5568'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="property-input"
                />
            </div>

            <div className="property-group">
                <label>Цвет текста</label>
                <input
                    type="color"
                    value={component.styles.color || '#ffffff'}
                    onChange={(e) => handleStyleChange('color', e.target.value)}
                    className="property-input"
                />
            </div>
        </div>
    );

    // Специфические свойства для card
    const renderCardProperties = () => (
        <div className="property-section">
            <h4>🎴 Настройки карточки</h4>
            <div className="property-group">
                <label>Заголовок карточки</label>
                <input
                    type="text"
                    value={component.props.text || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="property-input"
                    placeholder="Заголовок карточки..."
                />
            </div>

            <div className="property-group">
                <label>Цвет фона</label>
                <input
                    type="color"
                    value={component.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="property-input"
                />
            </div>

            <div className="property-group">
                <label>Скругление углов</label>
                <select
                    value={component.styles.borderRadius || '8px'}
                    onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                    className="property-input"
                >
                    <option value="0px">Без скругления</option>
                    <option value="4px">Маленькое</option>
                    <option value="8px">Среднее</option>
                    <option value="16px">Большое</option>
                </select>
            </div>
        </div>
    );

    // Специфические свойства для form
    const renderFormProperties = () => (
        <div className="property-section">
            <h4>📋 Настройки формы</h4>
            <div className="property-group">
                <label>Заголовок формы</label>
                <input
                    type="text"
                    value={component.props.text || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="property-input"
                    placeholder="Заголовок формы..."
                />
            </div>

            <div className="property-group">
                <label>Цвет фона</label>
                <input
                    type="color"
                    value={component.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="property-input"
                />
            </div>

            <div className="property-group">
                <label>Скругление углов</label>
                <select
                    value={component.styles.borderRadius || '8px'}
                    onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                    className="property-input"
                >
                    <option value="0px">Без скругления</option>
                    <option value="4px">Маленькое</option>
                    <option value="8px">Среднее</option>
                    <option value="16px">Большое</option>
                </select>
            </div>
        </div>
    );

    // Специфические свойства для input
    const renderInputProperties = () => (
        <div className="property-section">
            <h4>📝 Настройки поля ввода</h4>
            <div className="property-group">
                <label>Подсказка (placeholder)</label>
                <input
                    type="text"
                    value={component.props.placeholder || ''}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="property-input"
                    placeholder="Текст подсказки..."
                />
            </div>

            <div className="property-group">
                <label>Цвет фона</label>
                <input
                    type="color"
                    value={component.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                    className="property-input"
                />
            </div>
        </div>
    );

    // Специфические свойства для ZeroBlock
    const renderZeroBlockProperties = () => (
        <div className="property-section">
            <h4>🎛️ ZeroBlock Редактор</h4>

            <div className="property-group">
                <label>Кастомный HTML/CSS/JS блок</label>
                <button
                    onClick={() => setShowZeroBlockEditor(true)}
                    className="property-input"
                    style={{
                        background: 'var(--primary-gradient)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '12px',
                        fontWeight: '500'
                    }}
                >
                    {component.props.customHTML ? '✏️ Редактировать код' : '🎛️ Открыть редактор'}
                </button>
            </div>

            {component.props.customHTML && (
                <div className="property-group">
                    <label>Статус блока</label>
                    <div style={{
                        padding: '8px 12px',
                        background: '#48bb78',
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '12px',
                        textAlign: 'center',
                        fontWeight: '500'
                    }}>
                        ✅ Блок содержит кастомный код
                    </div>
                </div>
            )}

            {showZeroBlockEditor && (
                <ZeroBlockEditor
                    initialHTML={component.props.customHTML || ''}
                    initialCSS={component.props.customCSS || ''}
                    initialJS={component.props.customJS || ''}
                    onSave={handleZeroBlockSave}
                    onClose={() => setShowZeroBlockEditor(false)}
                />
            )}
        </div>
    );

    return (
        <div className="properties-panel">
            <div className="properties-header">
                <div className="component-title">
                    <span className="component-icon">{getComponentIcon(component.type)}</span>
                    <div>
                        <h3>{getComponentTypeName(component.type)}</h3>
                        <span className="component-id">ID: {component.id.slice(0, 8)}</span>
                    </div>
                </div>
                <div className="component-actions">
                    <button
                        className="component-action-btn"
                        onClick={handleCopy}
                        title="Копировать (Ctrl+C)"
                    >
                        📋
                    </button>
                    <button
                        className="component-action-btn"
                        onClick={handleDuplicate}
                        title="Дублировать (Ctrl+D)"
                    >
                        🎭
                    </button>
                    {onDeleteComponent && (
                        <button
                            className="component-action-btn delete"
                            onClick={handleDelete}
                            title="Удалить"
                        >
                            🗑️
                        </button>
                    )}
                </div>
            </div>

            {renderCommonProperties()}

            {component.type === 'text' && renderTextProperties()}
            {component.type === 'button' && renderButtonProperties()}
            {component.type === 'image' && renderImageProperties()}
            {component.type === 'header' && renderHeaderProperties()}
            {component.type === 'footer' && renderFooterProperties()}
            {component.type === 'card' && renderCardProperties()}
            {component.type === 'form' && renderFormProperties()}
            {component.type === 'input' && renderInputProperties()}
            {component.type === 'zeroblock' && renderZeroBlockProperties()}
            {component.type === 'section' && renderSectionProperties()}
            {component.type === 'grid' && renderGridProperties()}
            {component.type === 'flex' && renderFlexProperties()}
        </div>
    );
};

// Вспомогательные функции
const getComponentTypeName = (type: string) => {
    switch (type) {
        case 'text': return 'Текстовый блок';
        case 'button': return 'Кнопка';
        case 'image': return 'Изображение';
        case 'header': return 'Шапка сайта';
        case 'footer': return 'Подвал сайта';
        case 'card': return 'Карточка';
        case 'form': return 'Форма';
        case 'input': return 'Поле ввода';
        case 'zeroblock': return 'ZeroBlock';
        case 'section': return 'Секция';
        case 'grid': return 'Grid сетка';
        case 'flex': return 'Flex контейнер';
        default: return 'Элемент';
    }
};

export default PropertiesPanel;