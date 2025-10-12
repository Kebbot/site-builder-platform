import React from 'react';
import { Component } from '../../types/types';
import './AnalyticsPanel.css';

interface AnalyticsPanelProps {
    components: Component[];
    isOpen: boolean;
    onClose: () => void;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ components, isOpen, onClose }) => {
    if (!isOpen) return null;

    const componentStats = components.reduce((acc, component) => {
        acc[component.type] = (acc[component.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const totalComponents = components.length;
    const mostUsedType = Object.entries(componentStats).sort((a, b) => b[1] - a[1])[0];

    return (
        <div className="analytics-overlay">
            <div className="analytics-panel">
                <div className="analytics-header">
                    <h2>📊 Статистика проекта</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="analytics-content">
                    <div className="stat-card">
                        <div className="stat-value">{totalComponents}</div>
                        <div className="stat-label">Всего элементов</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">{mostUsedType ? mostUsedType[1] : 0}</div>
                        <div className="stat-label">
                            {mostUsedType ? `Чаще всего: ${getComponentName(mostUsedType[0])}` : 'Нет данных'}
                        </div>
                    </div>

                    <div className="distribution">
                        <h3>Распределение по типам:</h3>
                        {Object.entries(componentStats).map(([type, count]) => (
                            <div key={type} className="distribution-item">
                                <span className="type-name">{getComponentName(type)}</span>
                                <span className="type-count">{count}</span>
                                <div
                                    className="type-bar"
                                    style={{ width: `${(count / totalComponents) * 100}%` }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="export-stats">
                        <h3>Рекомендации:</h3>
                        <ul>
                            {totalComponents === 0 && <li>🎯 Добавьте первый элемент чтобы начать</li>}
                            {totalComponents > 10 && <li>📝 Много элементов - рассмотрите группировку</li>}
                            {mostUsedType && mostUsedType[1] > 5 && (
                                <li>⚡ Часто используете "{getComponentName(mostUsedType[0])}" - создайте шаблон</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const getComponentName = (type: string) => {
    const names: Record<string, string> = {
        text: 'Текст',
        button: 'Кнопка',
        image: 'Изображение',
        header: 'Шапка',
        footer: 'Подвал',
        card: 'Карточка',
        form: 'Форма',
        input: 'Поле ввода'
    };
    return names[type] || type;
};

export default AnalyticsPanel;