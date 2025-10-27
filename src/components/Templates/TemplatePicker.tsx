import React, { useState, useCallback, useMemo } from 'react';
import { Template, Project } from '../../types/types';
import { useTheme } from '../../contexts/ThemeContext';
import './TemplatePicker.css';

interface TemplatePickerProps {
    isOpen?: boolean;
    onClose: () => void;
    onTemplateSelect: (templateProject: Project) => void;
    currentProject?: Project;
    onBack?: () => void;
}

// Моковые данные шаблонов (в реальном приложении будут загружаться с сервера)
const defaultTemplates: Template[] = [
    {
        id: 'landing-1',
        name: 'Лендинг для стартапа',
        description: 'Современный лендинг с акцентом на продукт и призывом к действию',
        category: 'landing',
        thumbnail: 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Startup+Landing',
        project: {
            id: 'template-1',
            name: 'Лендинг для стартапа',
            containers: [
                {
                    id: 'header',
                    type: 'section',
                    name: 'Шапка',
                    elements: [
                        {
                            id: 'logo',
                            type: 'text',
                            containerId: 'header',
                            position: { x: 50, y: 20, width: 120, height: 40, zIndex: 1 },
                            style: { fontSize: 24, fontWeight: 'bold', color: '#1f2937' },
                            content: 'Логотип',
                            metadata: { name: 'Текст', icon: '📝', category: 'content', canHaveChildren: false }
                        },
                        {
                            id: 'nav',
                            type: 'text',
                            containerId: 'header',
                            position: { x: 200, y: 30, width: 400, height: 30, zIndex: 1 },
                            style: { fontSize: 16, color: '#6b7280', textAlign: 'center' },
                            content: 'Главная О нас Услуги Контакты',
                            metadata: { name: 'Текст', icon: '📝', category: 'content', canHaveChildren: false }
                        }
                    ],
                    style:
                    {
                        width: '100%',
                        height: '80px',
                        minHeight: '80px',
                        backgroundColor: '#ffffff',
                        padding: '0'
                    }, metadata: {
                        isRoot: true,
                        canDelete: false,
                        canRename: true
                    }
                },
                {
                    id: 'hero',
                    type: 'section',
                    name: 'Главный экран',
                    elements: [
                        {
                            id: 'hero-title',
                            type: 'heading',
                            containerId: 'hero',
                            position: { x: 100, y: 80, width: 600, height: 60, zIndex: 1 },
                            style: { fontSize: 48, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' },
                            content: 'Инновационный продукт для вашего бизнеса',
                            metadata: { name: 'Заголовок', icon: '🔤', category: 'content', canHaveChildren: false }
                        },
                        {
                            id: 'hero-subtitle',
                            type: 'text',
                            containerId: 'hero',
                            position: { x: 100, y: 160, width: 600, height: 40, zIndex: 1 },
                            style: { fontSize: 20, color: '#6b7280', textAlign: 'center' },
                            content: 'Описание вашего продукта или услуги',
                            metadata: { name: 'Текст', icon: '📝', category: 'content', canHaveChildren: false }
                        },
                        {
                            id: 'hero-button',
                            type: 'button',
                            containerId: 'hero',
                            position: { x: 300, y: 220, width: 200, height: 50, zIndex: 1 },
                            style: { backgroundColor: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '6px', fontSize: 16, fontWeight: 'bold' },
                            content: 'Начать сейчас',
                            metadata: { name: 'Кнопка', icon: '🔘', category: 'content', canHaveChildren: false }
                        }
                    ],
                    style: {
                        width: '100%',
                        height: '400px',
                        minHeight: '400px',
                        backgroundColor: '#f8fafc',
                        padding: '40px 0'
                    },
                    metadata: {
                        isRoot: true,
                        canDelete: false,
                        canRename: true
                    }
                }
            ],
            settings: {
                viewport: 'desktop',
                grid: true,
                snap: true,
                snapThreshold: 5,
                rulers: false,
                outline: false,
                pageWidth: '100%',
                pageHeight: 'auto',
                pageBackground: '#ffffff',
                breakpoints: { mobile: 375, tablet: 768, desktop: 1200 },
                title: 'Лендинг для стартапа',
                description: '',
                keywords: '',
                published: false
            },
            metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'system', version: '1.0.0' }
        },
        tags: ['лендинг', 'стартап', 'современный'],
        isPremium: false,
        createdAt: new Date().toISOString()
    },
    {
        id: 'portfolio-1',
        name: 'Портфолио дизайнера',
        description: 'Элегантное портфолио для творческого профессионала',
        category: 'portfolio',
        thumbnail: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Designer+Portfolio',
        project: {
            id: 'template-2',
            name: 'Портфолио дизайнера',
            containers: [
                {
                    id: 'header',
                    type: 'section',
                    name: 'Шапка',
                    elements: [
                        {
                            id: 'logo',
                            type: 'text',
                            containerId: 'header',
                            position: { x: 50, y: 20, width: 120, height: 40, zIndex: 1 },
                            style: { fontSize: 24, fontWeight: 'bold', color: '#8b5cf6' },
                            content: 'Портфолио',
                            metadata: { name: 'Текст', icon: '📝', category: 'content', canHaveChildren: false }
                        }
                    ],
                    style: {
                        width: '100%',
                        height: '80px',
                        minHeight: '80px',
                        backgroundColor: '#ffffff',
                        padding: '0'
                    },
                    metadata: {
                        isRoot: true,
                        canDelete: false,
                        canRename: true
                    }
                },
                {
                    id: 'gallery',
                    type: 'section',
                    name: 'Галерея работ',
                    elements: [
                        {
                            id: 'gallery-title',
                            type: 'heading',
                            containerId: 'gallery',
                            position: { x: 50, y: 40, width: 700, height: 60, zIndex: 1 },
                            style: { fontSize: 36, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' },
                            content: 'Мои работы',
                            metadata: { name: 'Заголовок', icon: '🔤', category: 'content', canHaveChildren: false }
                        }
                    ],
                    style: {
                        width: '100%',
                        height: '600px',
                        minHeight: '600px',
                        backgroundColor: '#faf5ff',
                        padding: '40px 0'
                    },
                    metadata: {
                        isRoot: true,
                        canDelete: false,
                        canRename: true
                    }
                }
            ],
            settings: {
                viewport: 'desktop',
                grid: true,
                snap: true,
                snapThreshold: 5,
                rulers: false,
                outline: false,
                pageWidth: '100%',
                pageHeight: 'auto',
                pageBackground: '#ffffff',
                breakpoints: { mobile: 375, tablet: 768, desktop: 1200 },
                title: 'Портфолио дизайнера',
                description: '',
                keywords: '',
                published: false
            },
            metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'system', version: '1.0.0' }
        },
        tags: ['портфолио', 'дизайн', 'творческий'],
        isPremium: false,
        createdAt: new Date().toISOString()
    },
    {
        id: 'ecommerce-1',
        name: 'Интернет-магазин',
        description: 'Полнофункциональный шаблон для интернет-магазина',
        category: 'ecommerce',
        thumbnail: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=E-Commerce',
        project: {
            id: 'template-3',
            name: 'Интернет-магазин',
            containers: [
                {
                    id: 'header',
                    type: 'section',
                    name: 'Шапка',
                    elements: [
                        {
                            id: 'logo',
                            type: 'text',
                            containerId: 'header',
                            position: { x: 50, y: 20, width: 120, height: 40, zIndex: 1 },
                            style: { fontSize: 24, fontWeight: 'bold', color: '#10b981' },
                            content: 'Магазин',
                            metadata: { name: 'Текст', icon: '📝', category: 'content', canHaveChildren: false }
                        }
                    ],
                    style: {
                        width: '100%',
                        height: '80px',
                        minHeight: '80px',
                        backgroundColor: '#ffffff',
                        padding: '0'
                    },
                    metadata: {
                        isRoot: true,
                        canDelete: false,
                        canRename: true
                    }
                },
                {
                    id: 'products',
                    type: 'section',
                    name: 'Товары',
                    elements: [
                        {
                            id: 'products-title',
                            type: 'heading',
                            containerId: 'products',
                            position: { x: 50, y: 40, width: 700, height: 60, zIndex: 1 },
                            style: { fontSize: 36, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' },
                            content: 'Популярные товары',
                            metadata: { name: 'Заголовок', icon: '🔤', category: 'content', canHaveChildren: false }
                        }
                    ],
                    style: {
                        width: '100%',
                        height: '500px',
                        minHeight: '500px',
                        backgroundColor: '#f0fdf4',
                        padding: '40px 0'
                    },
                    metadata: {
                        isRoot: true,
                        canDelete: false,
                        canRename: true
                    }
                }
            ],
            settings: {
                viewport: 'desktop',
                grid: true,
                snap: true,
                snapThreshold: 5,
                rulers: false,
                outline: false,
                pageWidth: '100%',
                pageHeight: 'auto',
                pageBackground: '#ffffff',
                breakpoints: { mobile: 375, tablet: 768, desktop: 1200 },
                title: 'Интернет-магазин',
                description: '',
                keywords: '',
                published: false
            },
            metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'system', version: '1.0.0' }
        },
        tags: ['магазин', 'товары', 'продажи'],
        isPremium: true,
        createdAt: new Date().toISOString()
    },
    {
        id: 'blog-1',
        name: 'Блог платформа',
        description: 'Чистый и минималистичный дизайн для блога',
        category: 'blog',
        thumbnail: 'https://via.placeholder.com/300x200/EF4444/FFFFFF?text=Blog+Platform',
        project: {
            id: 'template-4',
            name: 'Блог платформа',
            containers: [
                {
                    id: 'header',
                    type: 'section',
                    name: 'Шапка',
                    elements: [
                        {
                            id: 'logo',
                            type: 'text',
                            containerId: 'header',
                            position: { x: 50, y: 20, width: 120, height: 40, zIndex: 1 },
                            style: { fontSize: 24, fontWeight: 'bold', color: '#ef4444' },
                            content: 'Мой блог',
                            metadata: { name: 'Текст', icon: '📝', category: 'content', canHaveChildren: false }
                        }
                    ],
                    style: {
                        width: '100%',
                        height: '80px',
                        minHeight: '80px',
                        backgroundColor: '#ffffff',
                        padding: '0'
                    },
                    metadata: {
                        isRoot: true,
                        canDelete: false,
                        canRename: true
                    }
                },
                {
                    id: 'posts',
                    type: 'section',
                    name: 'Статьи',
                    elements: [
                        {
                            id: 'posts-title',
                            type: 'heading',
                            containerId: 'posts',
                            position: { x: 50, y: 40, width: 700, height: 60, zIndex: 1 },
                            style: { fontSize: 36, fontWeight: 'bold', color: '#1f2937', textAlign: 'center' },
                            content: 'Последние статьи',
                            metadata: { name: 'Заголовок', icon: '🔤', category: 'content', canHaveChildren: false }
                        }
                    ],
                    style: {
                        width: '100%',
                        height: '600px',
                        minHeight: '600px',
                        backgroundColor: '#fef2f2',
                        padding: '40px 0'
                    },
                    metadata: {
                        isRoot: true,
                        canDelete: false,
                        canRename: true
                    }
                }
            ],
            settings: {
                viewport: 'desktop',
                grid: true,
                snap: true,
                snapThreshold: 5,
                rulers: false,
                outline: false,
                pageWidth: '100%',
                pageHeight: 'auto',
                pageBackground: '#ffffff',
                breakpoints: { mobile: 375, tablet: 768, desktop: 1200 },
                title: 'Блог платформа',
                description: '',
                keywords: '',
                published: false
            },
            metadata: { createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: 'system', version: '1.0.0' }
        },
        tags: ['блог', 'статьи', 'минимализм'],
        isPremium: false,
        createdAt: new Date().toISOString()
    }
];

const categories = [
    { id: 'all', name: 'Все шаблоны', icon: '📁' },
    { id: 'landing', name: 'Лендинги', icon: '🚀' },
    { id: 'portfolio', name: 'Портфолио', icon: '🎨' },
    { id: 'ecommerce', name: 'Магазины', icon: '🛒' },
    { id: 'blog', name: 'Блоги', icon: '📝' },
    { id: 'business', name: 'Бизнес', icon: '💼' },
    { id: 'personal', name: 'Персональные', icon: '👤' }
];

export const TemplatePicker: React.FC<TemplatePickerProps> = ({
    isOpen = true,
    onClose,
    onTemplateSelect,
    currentProject,
    onBack
}) => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const { theme } = useTheme();

    // Фильтрация шаблонов по категории и поисковому запросу
    const filteredTemplates = useMemo(() => {
        return defaultTemplates.filter(template => {
            const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
            const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    // Обработчик выбора шаблона
    const handleTemplateSelect = useCallback((template: Template) => {
        onTemplateSelect(template.project);
        onClose();
    }, [onTemplateSelect, onClose]);

    // Обработчик закрытия модального окна
    const handleClose = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    // Обработчик нажатия клавиши Escape
    React.useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="template-picker-overlay" onClick={handleClose}>
            <div className="template-picker-modal">
                <div className="template-picker-header">
                    <h2 className="template-picker-title">Выберите шаблон</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="template-picker-content">
                    <div className="template-search">
                        <input
                            type="text"
                            placeholder="Поиск шаблонов..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="template-categories">
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

                    <div className="templates-grid">
                        {filteredTemplates.length > 0 ? (
                            filteredTemplates.map(template => (
                                <div
                                    key={template.id}
                                    className={`template-card ${template.isPremium ? 'premium' : ''}`}
                                    onClick={() => handleTemplateSelect(template)}
                                >
                                    <div className="template-thumbnail">
                                        <img src={template.thumbnail} alt={template.name} />
                                        {template.isPremium && (
                                            <div className="premium-badge">PREMIUM</div>
                                        )}
                                    </div>
                                    <div className="template-info">
                                        <h3 className="template-name">{template.name}</h3>
                                        <p className="template-description">{template.description}</p>
                                        <div className="template-tags">
                                            {template.tags.map(tag => (
                                                <span key={tag} className="template-tag">#{tag}</span>
                                            ))}
                                        </div>
                                        <div className="template-meta">
                                            <span className="template-category">
                                                {categories.find(c => c.id === template.category)?.name}
                                            </span>
                                            <span className="template-date">
                                                {new Date(template.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="templates-empty">
                                <div className="empty-icon">🔍</div>
                                <div className="empty-text">Шаблоны не найдены</div>
                                <div className="empty-hint">
                                    Попробуйте изменить запрос или выбрать другую категорию
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="template-picker-footer">
                    <div className="template-stats">
                        {filteredTemplates.length} шаблонов
                    </div>
                    <button className="cancel-button" onClick={onClose}>
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplatePicker;