import React from 'react';
import { Template } from '../../types/types';
import './TemplatePicker.css';

interface TemplatePickerProps {
    templates: Template[];
    onTemplateSelect: (template: Template) => void;
    onClose: () => void;
}

const TemplatePicker: React.FC<TemplatePickerProps> = ({
    templates,
    onTemplateSelect,
    onClose
}) => {
    const categories = [
        { id: 'business', name: '💼 Бизнес', icon: '💼' },
        { id: 'portfolio', name: '🎨 Портфолио', icon: '🎨' },
        { id: 'blog', name: '📝 Блог', icon: '📝' },
        { id: 'landing', name: '🚀 Лендинг', icon: '🚀' }
    ];

    return (
        <div className="template-picker-overlay">
            <div className="template-picker">
                <div className="template-picker-header">
                    <h2>🎨 Выберите шаблон</h2>
                    <button className="close-button" onClick={onClose}>✕</button>
                </div>

                <div className="template-categories">
                    {categories.map(category => (
                        <button key={category.id} className="category-tab">
                            {category.icon} {category.name}
                        </button>
                    ))}
                </div>

                <div className="templates-grid">
                    {templates.map(template => (
                        <div
                            key={template.id}
                            className="template-card"
                            onClick={() => onTemplateSelect(template)}
                        >
                            <div className="template-thumbnail">
                                <div className="thumbnail-placeholder">
                                    {template.thumbnail || '🖼️'}
                                </div>
                            </div>
                            <div className="template-info">
                                <h4>{template.name}</h4>
                                <p>{template.description}</p>
                                <div className="template-category">
                                    {categories.find(c => c.id === template.category)?.icon}
                                    {categories.find(c => c.id === template.category)?.name}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="template-picker-footer">
                    <button className="cancel-button" onClick={onClose}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplatePicker;