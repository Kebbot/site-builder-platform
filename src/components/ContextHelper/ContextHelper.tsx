import React, { useState } from 'react';
import { BuilderElement } from '../../types/types';
import './ContextHelper.css';

interface ContextHelperProps {
    components: BuilderElement[];
}

export const ContextHelper: React.FC<ContextHelperProps> = ({ components }) => {
    const [isVisible, setIsVisible] = useState(false);

    const generateContext = () => {
        const componentStats = components.reduce((acc, comp) => {
            acc[comp.type] = (acc[comp.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const zeroblockCount = components.filter(c => c.type === 'zeroblock').length;
        const hasCustomCode = components.filter(c => c.props?.customHTML).length;

        return `🚀 SITE-BUILTER NO-CODE PLATFORM - ПОЛНЫЙ КОНТЕКСТ

📊 ТЕКУЩЕЕ СОСТОЯНИЕ ПРОЕКТА:
• Всего компонентов: ${components.length}
    • Распределение: ${Object.entries(componentStats).map(([type, count]) => `${getComponentName(type)}: ${count}`).join(', ')}
• ZeroBlock: ${zeroblockCount} (${hasCustomCode} с кастомным кодом)
    • Последнее обновление: ${new Date().toLocaleString('ru-RU')}

    ✅ ПОЛНОСТЬЮ РЕАЛИЗОВАННЫЕ ФИЧИ:
    • Drag-and-drop конструктор (@dnd-kit)
    • ZeroBlock система с редактором кода (HTML/CSS/JS)
    • Темная/светлая тема с сохранением в localStorage
    • Интерактивная панель свойств для каждого типа компонента
    • Экспорт в чистые HTML/CSS/JS файлы
    • История изменений (Ctrl+Z/Ctrl+Y)
    • Буфер обмена (Ctrl+C/Ctrl+V/Ctrl+D)
    • Адаптивный предпросмотр (мобильный/планшет/десктоп)
    • Система шаблонов сайтов
    • Аналитика использования компонентов
    • Скрываемые панели (как в Tilda)

    🎨 ДОСТУПНЫЕ КОМПОНЕНТЫ:
    • 📝 Текст, 🔘 Кнопка, 🖼️ Изображение
    • 🔝 Шапка, 🔻 Подвал, 🎴 Карточка
    • 📋 Форма, 📝 Поле ввода, 🎛️ ZeroBlock

    🏗 АРХИТЕКТУРА:
    • React 18 + TypeScript + @dnd-kit
    • CSS Variables для темизации
    • Component[]с историей в useHistory
    • Все стили в CSS-файлах с адаптивностью

    🎯 ПРИОРИТЕТНЫЕ СЛЕДУЮЩИЕ ЗАДАЧИ:
    1. КОНТЕЙНЕРНЫЕ КОМПОНЕНТЫ (section, grid, flexbox)
    2. ВЛОЖЕННОСТЬ ЭЛЕМЕНТОВ (перетаскивание в контейнеры)
    3. СИСТЕМА СЕТКИ И НАПРАВЛЯЮЩИЕ (как в Webflow)
    4. E-COMMERCE КОМПОНЕНТЫ (товары, корзина)
    5. РАСШИРЕННАЯ БИБЛИОТЕКА ШАБЛОНОВ (30+ готовых)

    💡 КОМАНДА ДЛЯ НОВОГО ЧАТА:
    "Продолжим разработку Site-Builder. В проекте ${components.length} компонентов (${Object.keys(componentStats).length} типов), полностью реализованы: ZeroBlock, темы, DnD, экспорт, история, адаптивность. Дальше - контейнерные компоненты и система сетки."

    📅 Контекст сгенерирован: ${new Date().toLocaleString('ru-RU')}`;
    };

    const getComponentName = (type: string) => {
        const names: Record<string, string> = {
            'text': 'Текст', 'button': 'Кнопка', 'image': 'Изображение',
            'header': 'Шапка', 'footer': 'Подвал', 'card': 'Карточка',
            'form': 'Форма', 'input': 'Поле', 'zeroblock': 'ZeroBlock'
        };
        return names[type] || type;
    };

    const copyContext = () => {
        navigator.clipboard.writeText(generateContext());
        alert('✅ Контекст скопирован! Вставь в начале нового чата.');
        setIsVisible(false);
    };

    return (
        <>
            <button
                className="context-helper-btn"
                onClick={() => setIsVisible(!isVisible)}
                title="Скопировать контекст для нового чата"
            >
                📋 Контекст
            </button>

            {isVisible && (
                <div className="context-helper-modal">
                    <div className="context-header">
                        <h3>📋 Контекст для продолжения разработки</h3>
                        <button onClick={() => setIsVisible(false)}>✕</button>
                    </div>

                    <div className="context-content">
                        <pre>{generateContext()}</pre>
                    </div>

                    <div className="context-actions">
                        <button onClick={copyContext} className="copy-btn">
                            📋 Скопировать и закрыть
                        </button>
                        <button onClick={() => setIsVisible(false)}>
                            Отмена
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};