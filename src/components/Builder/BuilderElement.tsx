import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Component } from '../../types/types';
import { ContainerDropZone } from './ContainerDropZone';
import './BuilderElement.css';

interface BuilderElementProps {
    component: Component;
    isSelected: boolean;
    onSelect: (component: Component) => void;
    onDelete: (componentId: string) => void;
    onUpdateComponent?: (component: Component) => void;
    onCopyComponent?: (component: Component) => void;
    onDuplicateComponent?: (component: Component) => void;
    isPreviewMode?: boolean;
}

// Вспомогательная функция для получения метки типа
const getElementTypeLabel = (type: string) => {
    switch (type) {
        case 'text': return 'Текст';
        case 'button': return 'Кнопка';
        case 'image': return 'Изображение';
        case 'header': return 'Шапка';
        case 'footer': return 'Подвал';
        case 'card': return 'Карточка';
        case 'form': return 'Форма';
        case 'input': return 'Поле ввода';
        case 'zeroblock': return 'ZeroBlock';
        case 'section': return 'Секция';
        case 'grid': return 'Grid';
        case 'flex': return 'Flex';
        case 'product-card': return 'Карточка товара';
        case 'product-grid': return 'Сетка товаров';
        case 'shopping-cart': return 'Корзина';
        case 'checkout-form': return 'Форма заказа';
        case 'product-rating': return 'Рейтинг';
        default: return 'Элемент';
    }
};

const BuilderElement: React.FC<BuilderElementProps> = ({
    component,
    isSelected,
    onSelect,
    onDelete,
    onUpdateComponent,
    onCopyComponent,
    onDuplicateComponent,
    isPreviewMode = false
}) => {
    // Хук для перетаскивания
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: component.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isPreviewMode && !isDragging) {
            onSelect(component);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(component.id);
    };

    const getSafeStyles = () => {
        const {
            flexDirection,
            alignItems,
            justifyContent,
            display,
            gridTemplateColumns,
            gridGap,
            flexWrap,
            ...safeStyles
        } = component.styles;

        const result: React.CSSProperties = {
            ...safeStyles,
            position: 'relative' as 'relative'
        };

        if (flexDirection) result.flexDirection = flexDirection as 'row' | 'column' | 'row-reverse' | 'column-reverse';
        if (alignItems) result.alignItems = alignItems as 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
        if (justifyContent) result.justifyContent = justifyContent as 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
        if (display) result.display = display as 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';
        if (gridTemplateColumns) result.gridTemplateColumns = gridTemplateColumns;
        if (gridGap) result.gridGap = gridGap;
        if (flexWrap) result.flexWrap = flexWrap as 'nowrap' | 'wrap' | 'wrap-reverse';

        return result;
    };

    const renderElement = () => {
        const baseStyle = getSafeStyles();

        switch (component.type) {
            case 'text':
                return (
                    <div style={baseStyle} className="element-content">
                        {component.props.text || 'Текст элемента'}
                    </div>
                );
            case 'button':
                return (
                    <button style={baseStyle} className="element-content">
                        {component.props.text || 'Кнопка'}
                    </button>
                );
            case 'image':
                return (
                    <div style={baseStyle} className="element-content">
                        <div className="image-preview">
                            <div className="image-icon">🖼️</div>
                            <div className="image-caption">
                                {component.props.text || 'Изображение'}
                            </div>
                        </div>
                    </div>
                );
            case 'header':
                return (
                    <header style={baseStyle} className="element-content header-element">
                        <div className="header-content">
                            <div className="logo">🏢 {component.props.text || 'Логотип'}</div>
                            <nav className="header-nav">
                                <span>Главная</span>
                                <span>О нас</span>
                                <span>Контакты</span>
                            </nav>
                        </div>
                    </header>
                );
            case 'footer':
                return (
                    <footer style={baseStyle} className="element-content footer-element">
                        <div className="footer-content">
                            <div>© 2024 {component.props.text || 'Мой сайт'}. Все права защищены.</div>
                            <div className="footer-links">
                                <span>Политика конфиденциальности</span>
                                <span>Условия использования</span>
                            </div>
                        </div>
                    </footer>
                );
            case 'card':
                return (
                    <div style={baseStyle} className="element-content card-element">
                        <div className="card-header">
                            <h3>{component.props.text || 'Заголовок карточки'}</h3>
                        </div>
                        <div className="card-body">
                            <p>Содержимое карточки. Здесь может быть текст, изображения или другие элементы.</p>
                        </div>
                        <div className="card-footer">
                            <button>Действие</button>
                        </div>
                    </div>
                );
            case 'form':
                return (
                    <div style={baseStyle} className="element-content form-element">
                        <h3>{component.props.text || 'Форма обратной связи'}</h3>
                        <div className="form-fields">
                            <input type="text" placeholder="Ваше имя" />
                            <input type="email" placeholder="Ваш email" />
                            <textarea placeholder="Сообщение"></textarea>
                            <button>Отправить</button>
                        </div>
                    </div>
                );
            case 'input':
                return (
                    <div style={baseStyle} className="element-content input-element">
                        <input
                            type="text"
                            placeholder={component.props.placeholder || "Введите текст..."}
                            style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                    </div>
                );
            case 'zeroblock':
                return (
                    <div style={baseStyle} className="element-content zeroblock-element">
                        <div className="zeroblock-preview">
                            <div className="zeroblock-icon">🎛️</div>
                            <div className="zeroblock-title">ZeroBlock</div>
                            <div className="zeroblock-description">
                                {component.props.customHTML ? 'Кастомный блок' : 'Пустой блок'}
                            </div>
                            {component.props.customHTML && (
                                <div className="zeroblock-badge">
                                    💻 Есть код
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'section':
                return (
                    <div style={baseStyle} className="element-content section-element">
                        <div className="container-header">
                            <div className="container-icon">📦</div>
                            <div className="container-title">Секция</div>
                            <div className="container-description">
                                {component.children ? `${component.children.length} вложенных элементов` : 'Перетащите элементы сюда'}
                            </div>
                        </div>
                        <ContainerDropZone containerId={component.id}>
                            {component.children?.map((child) => (
                                <BuilderElement
                                    key={child.id}
                                    component={child}
                                    isSelected={isSelected}
                                    onSelect={onSelect}
                                    onDelete={onDelete}
                                    onUpdateComponent={onUpdateComponent}
                                    onCopyComponent={onCopyComponent}
                                    onDuplicateComponent={onDuplicateComponent}
                                    isPreviewMode={isPreviewMode}
                                />
                            ))}
                        </ContainerDropZone>
                    </div>
                );
            case 'grid':
                return (
                    <div style={baseStyle} className="element-content grid-element">
                        <div className="container-header">
                            <div className="container-icon">🔲</div>
                            <div className="container-title">Grid Сетка</div>
                            <div className="container-description">
                                {component.children ? `${component.children.length} элементов в сетке` : 'CSS Grid контейнер'}
                            </div>
                        </div>
                        <ContainerDropZone containerId={component.id}>
                            {component.children?.map((child) => (
                                <BuilderElement
                                    key={child.id}
                                    component={child}
                                    isSelected={isSelected}
                                    onSelect={onSelect}
                                    onDelete={onDelete}
                                    onUpdateComponent={onUpdateComponent}
                                    onCopyComponent={onCopyComponent}
                                    onDuplicateComponent={onDuplicateComponent}
                                    isPreviewMode={isPreviewMode}
                                />
                            ))}
                        </ContainerDropZone>
                    </div>
                );
            case 'flex':
                return (
                    <div style={baseStyle} className="element-content flex-element">
                        <div className="container-header">
                            <div className="container-icon">📏</div>
                            <div className="container-title">Flex Контейнер</div>
                            <div className="container-description">
                                {component.children ? `${component.children.length} flex-элементов` : 'CSS Flexbox контейнер'}
                            </div>
                        </div>
                        <ContainerDropZone containerId={component.id}>
                            {component.children?.map((child) => (
                                <BuilderElement
                                    key={child.id}
                                    component={child}
                                    isSelected={isSelected}
                                    onSelect={onSelect}
                                    onDelete={onDelete}
                                    onUpdateComponent={onUpdateComponent}
                                    onCopyComponent={onCopyComponent}
                                    onDuplicateComponent={onDuplicateComponent}
                                    isPreviewMode={isPreviewMode}
                                />
                            ))}
                        </ContainerDropZone>
                    </div>
                );
            case 'product-card':
                return (
                    <div style={baseStyle} className="element-content product-card-element">
                        <div className="product-image">
                            <div className="image-placeholder">🖼️</div>
                        </div>
                        <div className="product-info">
                            <h3 className="product-title">{component.props.productName || 'Название товара'}</h3>
                            <p className="product-description">
                                {component.props.productDescription || 'Описание товара'}
                            </p>
                            <div className="product-price">
                                {component.props.productPrice || '999'} {component.props.currency || '₽'}
                            </div>
                            <button className="buy-button">
                                {component.props.buttonText || 'В корзину'}
                            </button>
                        </div>
                    </div>
                );
            case 'product-grid':
                return (
                    <div style={baseStyle} className="element-content product-grid-element">
                        <div className="grid-header">
                            <h3>Каталог товаров</h3>
                            <p>Сетка для отображения товаров</p>
                        </div>
                        <div className="products-container">
                            {/* Дети будут отображаться здесь как товары */}
                            {component.children?.map((child) => (
                                <BuilderElement
                                    key={child.id}
                                    component={child}
                                    isSelected={isSelected}
                                    onSelect={onSelect}
                                    onDelete={onDelete}
                                    onUpdateComponent={onUpdateComponent}
                                    onCopyComponent={onCopyComponent}
                                    onDuplicateComponent={onDuplicateComponent}
                                    isPreviewMode={isPreviewMode}
                                />
                            ))}
                        </div>
                    </div>
                );
            case 'shopping-cart':
                return (
                    <div style={baseStyle} className="element-content shopping-cart-element">
                        <div className="cart-header">
                            <h3>🛒 Корзина</h3>
                            <div className="cart-count">3 товара</div>
                        </div>
                        <div className="cart-items">
                            <div className="cart-item">
                                <span>Товар 1</span>
                                <span>999 ₽</span>
                            </div>
                            <div className="cart-item">
                                <span>Товар 2</span>
                                <span>799 ₽</span>
                            </div>
                        </div>
                        <div className="cart-total">
                            <strong>Итого: 1 798 ₽</strong>
                        </div>
                        <button className="checkout-button">
                            Оформить заказ
                        </button>
                    </div>
                );
            case 'checkout-form':
                return (
                    <div style={baseStyle} className="element-content checkout-form-element">
                        <h3>💳 Оформление заказа</h3>
                        <div className="form-fields">
                            <input type="text" placeholder="ФИО" />
                            <input type="email" placeholder="Email" />
                            <input type="tel" placeholder="Телефон" />
                            <input type="text" placeholder="Адрес доставки" />
                            <select>
                                <option>Способ оплаты</option>
                                <option>Картой онлайн</option>
                                <option>Наличными</option>
                            </select>
                            <button className="submit-order">Заказать</button>
                        </div>
                    </div>
                );
            case 'product-rating':
                const rating = component.props.rating || 4;
                return (
                    <div style={baseStyle} className="element-content product-rating-element">
                        <div className="stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={star <= rating ? 'star filled' : 'star'}>
                                    {star <= rating ? '⭐' : '☆'}
                                </span>
                            ))}
                        </div>
                        <span className="rating-text">({rating}.0)</span>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`builder-element ${isSelected ? 'selected' : ''} ${isDragging ? 'dragging' : ''} ${isPreviewMode ? 'preview' : ''}`}
            onClick={handleClick}
        >
            {/* Ручка для перетаскивания - только для нее слушатели */}
            {!isPreviewMode && (
                <div
                    className="drag-handle"
                    {...attributes}
                    {...listeners}
                    title="Перетащите для изменения порядка"
                    onClick={(e) => e.stopPropagation()} // Предотвращаем выделение при клике на ручку
                >
                    ⋮⋮
                </div>
            )}

            {renderElement()}

            {isSelected && !isPreviewMode && (
                <>
                    <div className="element-badge">
                        {getElementTypeLabel(component.type)}
                    </div>
                    <button
                        className="element-delete-btn"
                        onClick={handleDelete}
                        title="Удалить элемент"
                    >
                        🗑️
                    </button>
                </>
            )}
        </div>
    );
};

export default BuilderElement;