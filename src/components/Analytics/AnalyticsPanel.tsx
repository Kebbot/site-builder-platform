import React from 'react';
import { Project } from '../../types/types';
import './AnalyticsPanel.css';

interface AnalyticsPanelProps {
    project: Project;
    onBack: () => void;
}

export const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
    project,
    onBack
}) => {
    // Сбор статистики по проекту
    const totalElements = project.containers.reduce(
        (sum, container) => sum + container.elements.length,
        0
    );

    const elementTypes = project.containers.flatMap(container =>
        container.elements.map(element => element.type)
    );

    const elementTypeCount = elementTypes.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="analytics-panel">
            <div className="analytics-header">
                <button onClick={onBack} className="back-button">
                    ← Назад к конструктору
                </button>
                <h2>Аналитика проекта</h2>
            </div>

            <div className="analytics-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-value">{project.containers.length}</div>
                        <div className="stat-label">Контейнеров</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">{totalElements}</div>
                        <div className="stat-label">Всего элементов</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">
                            {new Date(project.metadata.createdAt).toLocaleDateString()}
                        </div>
                        <div className="stat-label">Создан</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-value">
                            {new Date(project.metadata.updatedAt).toLocaleDateString()}
                        </div>
                        <div className="stat-label">Обновлен</div>
                    </div>
                </div>

                <div className="analytics-section">
                    <h3>Распределение элементов по типам</h3>
                    <div className="element-types">
                        {Object.entries(elementTypeCount).map(([type, count]) => (
                            <div key={type} className="type-item">
                                <span className="type-name">{type}</span>
                                <span className="type-count">{count}</span>
                                <div
                                    className="type-bar"
                                    style={{
                                        width: `${(count / totalElements) * 100}%`
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="analytics-section">
                    <h3>Информация о проекте</h3>
                    <div className="project-info">
                        <div className="info-row">
                            <span className="info-label">Название:</span>
                            <span className="info-value">{project.name}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Описание:</span>
                            <span className="info-value">{project.description || 'Не указано'}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Версия:</span>
                            <span className="info-value">{project.metadata.version}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Статус:</span>
                            <span className="info-value">
                                {project.settings.published ? 'Опубликован' : 'Черновик'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="analytics-section">
                    <h3>Рекомендации</h3>
                    <div className="recommendations">
                        {totalElements === 0 && (
                            <div className="recommendation warning">
                                ⚠️ Добавьте элементы на страницу
                            </div>
                        )}

                        {!project.settings.title && (
                            <div className="recommendation warning">
                                ⚠️ Установите заголовок страницы
                            </div>
                        )}

                        {!project.settings.description && (
                            <div className="recommendation warning">
                                ⚠️ Добавьте описание для SEO
                            </div>
                        )}

                        {totalElements > 10 && (
                            <div className="recommendation success">
                                ✅ Отличное количество элементов
                            </div>
                        )}

                        {Object.keys(elementTypeCount).length >= 3 && (
                            <div className="recommendation success">
                                ✅ Хорошее разнообразие типов элементов
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Также оставляем default export для обратной совместимости
export default AnalyticsPanel;