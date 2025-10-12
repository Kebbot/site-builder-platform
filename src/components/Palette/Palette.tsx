import React from 'react';
import PaletteItem from './PaletteItem';
import './Palette.css';

const Palette: React.FC = () => {
    const paletteItems = [
        // Базовые элементы
        {
            type: 'text',
            label: 'Текстовый блок',
            emoji: '📝',
            description: 'Заголовки и параграфы',
            color: '#4299e1'
        },
        {
            type: 'button',
            label: 'Кнопка',
            emoji: '🔘',
            description: 'Интерактивная кнопка',
            color: '#48bb78'
        },
        {
            type: 'image',
            label: 'Изображение',
            emoji: '🖼️',
            description: 'Блок для изображения',
            color: '#ed8936'
        },

        // Структурные элементы
        {
            type: 'header',
            label: 'Шапка сайта',
            emoji: '🔝',
            description: 'Верхняя часть страницы',
            color: '#9f7aea'
        },
        {
            type: 'footer',
            label: 'Подвал сайта',
            emoji: '🔻',
            description: 'Нижняя часть страницы',
            color: '#f56565'
        },
        {
            type: 'card',
            label: 'Карточка',
            emoji: '🎴',
            description: 'Контейнер для контента',
            color: '#38b2ac'
        },

        // Формы
        {
            type: 'form',
            label: 'Форма',
            emoji: '📋',
            description: 'Группа полей ввода',
            color: '#ed64a6'
        },
        {
            type: 'input',
            label: 'Поле ввода',
            emoji: '📝',
            description: 'Текстовое поле',
            color: '#667eea'
        },

        // КОНТЕЙНЕРЫ (НОВЫЕ)
        {
            type: 'section',
            label: '📦 Секция',
            emoji: '📦',
            description: 'Контейнер для группировки элементов',
            color: '#4299e1'
        },
        {
            type: 'grid',
            label: '🔲 Grid сетка',
            emoji: '🔲',
            description: 'CSS Grid контейнер',
            color: '#ed8936'
        },
        {
            type: 'flex',
            label: '📏 Flex контейнер',
            emoji: '📏',
            description: 'CSS Flexbox контейнер',
            color: '#48bb78'
        },

        // ПРОДВИНУТЫЕ
        {
            type: 'zeroblock',
            label: '🎛️ ZeroBlock',
            emoji: '🎛️',
            description: 'Кастомный HTML/CSS/JS блок',
            color: '#9f7aea'
        },

        // E-COMMERCE КОМПОНЕНТЫ
        {
            type: 'product-card',
            label: '🛍️ Карточка товара',
            emoji: '🛍️',
            description: 'Карточка с изображением, ценой и кнопкой',
            color: '#ed64a6'
        },
        {
            type: 'product-grid',
            label: '📦 Сетка товаров',
            emoji: '📦',
            description: 'Сетка для отображения каталога товаров',
            color: '#667eea'
        },
        {
            type: 'shopping-cart',
            label: '🛒 Корзина',
            emoji: '🛒',
            description: 'Корзина покупок с итоговой суммой',
            color: '#48bb78'
        },
        {
            type: 'checkout-form',
            label: '💳 Форма заказа',
            emoji: '💳',
            description: 'Форма оформления заказа',
            color: '#ed8936'
        },
        {
            type: 'product-rating',
            label: '⭐ Рейтинг',
            emoji: '⭐',
            description: 'Рейтинг товара со звездами',
            color: '#f6ad55'
        }
    ];

    return (
        <div className="palette">
            <div className="palette-header">
                <h3>📦 Библиотека компонентов</h3>
                <div className="palette-subtitle">Перетащите в рабочую область</div>
            </div>
            <div className="palette-categories">
                <div className="category">
                    <h4>📐 Базовые</h4>
                    <div className="palette-items">
                        {paletteItems.slice(0, 3).map((item) => (
                            <PaletteItem key={item.type} {...item} />
                        ))}
                    </div>
                </div>
                <div className="category">
                    <h4>🎨 Структура</h4>
                    <div className="palette-items">
                        {paletteItems.slice(3, 6).map((item) => (
                            <PaletteItem key={item.type} {...item} />
                        ))}
                    </div>
                </div>

                <div className="category">
                    <h4>📝 Формы</h4>
                    <div className="palette-items">
                        {paletteItems.slice(6, 8).map((item) => (
                            <PaletteItem key={item.type} {...item} />
                        ))}
                    </div>
                </div>

                {/* КАТЕГОРИЯ - КОНТЕЙНЕРЫ */}
                <div className="category">
                    <h4>🏗 Контейнеры</h4>
                    <div className="palette-items">
                        {paletteItems.slice(8, 11).map((item) => (
                            <PaletteItem key={item.type} {...item} />
                        ))}
                    </div>
                </div>

                {/* КАТЕГОРИЯ - ПРОДВИНУТЫЕ */}
                <div className="category">
                    <h4>⚡ Продвинутые</h4>
                    <div className="palette-items">
                        {paletteItems.slice(11, 12).map((item) => (
                            <PaletteItem key={item.type} {...item} />
                        ))}
                    </div>
                </div>

                {/* НОВАЯ КАТЕГОРИЯ - E-COMMERCE */}
                <div className="category">
                    <h4>🛒 E-commerce</h4>
                    <div className="palette-items">
                        {paletteItems.slice(12, 17).map((item) => (
                            <PaletteItem key={item.type} {...item} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="palette-footer">
                <div className="palette-tip">
                    💡 <strong>Совет:</strong> Используйте контейнеры для сложных макетов!
                </div>
            </div>
            <div className="palette-footer">
                <div className="palette-tip">
                    💡 <strong>Совет:</strong> Используйте ZeroBlock для кастомных элементов!
                </div>
            </div>
        </div>
    );
};

export default Palette;