import React, { useState, useCallback, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Palette from './components/Palette/Palette';
import Builder from './components/Builder/Builder';
import PropertiesPanel from './components/Properties/PropertiesPanel';
import TemplatePicker from './components/Templates/TemplatePicker';
import AnalyticsPanel from './components/Analytics/AnalyticsPanel';
import { Component, Template } from './types/types';
import { downloadProject } from './utils/exportUtils';
import { ContextHelper } from './components/ContextHelper/ContextHelper';
import './App.css';

// Демо-шаблоны
const demo_templates: Template[] = [
  {
    id: '1',
    name: 'Бизнес-лендинг',
    description: 'Профессиональный лендинг для бизнеса',
    category: 'landing',
    thumbnail: '💼',
    components: [
      {
        id: 'header-1',
        type: 'header',
        props: { text: 'Мой Бизнес' },
        styles: {
          backgroundColor: '#2d3748',
          color: 'white',
          padding: '1rem 2rem'
        }
      },
      {
        id: 'text-1',
        type: 'text',
        props: { text: 'Добро пожаловать в наш бизнес' },
        styles: {
          padding: '2rem',
          textAlign: 'center',
          fontSize: '24px',
          backgroundColor: '#f7fafc'
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Портфолио',
    description: 'Покажите свои работы в лучшем свете',
    category: 'portfolio',
    thumbnail: '🎨',
    components: [
      {
        id: 'header-2',
        type: 'header',
        props: { text: 'Мое Портфолио' },
        styles: {
          backgroundColor: '#4c51bf',
          color: 'white',
          padding: '1rem 2rem'
        }
      },
      {
        id: 'card-1',
        type: 'card',
        props: { text: 'Мои проекты' },
        styles: {
          margin: '2rem',
          padding: '0',
          backgroundColor: 'white',
          borderRadius: '8px'
        }
      }
    ]
  }
];

// Хук для истории изменений
function useHistory<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [index, setIndex] = useState(0);
  const currentState = history[index];

  const push = useCallback((newState: T) => {
    const newHistory = history.slice(0, index + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setIndex(newHistory.length - 1);
  }, [history, index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(index - 1);
    }
  }, [index]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex(index + 1);
    }
  }, [index, history.length]);

  return {
    state: currentState,
    push,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1
  };
}

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const {
    state: components,
    push: pushHistory,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory<Component[]>([]);

  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [projectName, setProjectName] = useState<string>('МойСайт');
  const [showTemplates, setShowTemplates] = useState<boolean>(false);
  const [clipboard, setClipboard] = useState<Component | null>(null);
  const [showCopyToast, setShowCopyToast] = useState<boolean>(false);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);

  // НОВОЕ: Состояние для скрытия панелей
  const [isPaletteVisible, setIsPaletteVisible] = useState(true);
  const [isPropertiesVisible, setIsPropertiesVisible] = useState(true);

  // Функция для обновления компонентов с историей
  const setComponents = useCallback((newComponents: Component[]) => {
    pushHistory(newComponents);
  }, [pushHistory]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const elementType = active.data.current?.type;
    const isContainerDrop = over.data.current?.isContainer;
    const containerId = isContainerDrop ? over.id.toString().replace('container-', '') : null;

    console.log('DRAG DEBUG:', { elementType, isContainerDrop, containerId, over: over.id });

    // СЛУЧАЙ 1: Перетаскивание в контейнер
    if (isContainerDrop && containerId && elementType) {
      const newComponent: Component = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: elementType as any,
        props: {
          text: getDefaultText(elementType)
        },
        styles: getDefaultStyles(elementType)
      };

      // Находим контейнер и добавляем в него элемент
      const updatedComponents = addComponentToContainer(components, containerId, newComponent);
      setComponents(updatedComponents);
      return;
    }

    // СЛУЧАЙ 2: Перетаскивание в основную область
    if (over.id === 'builder-dropzone' && elementType) {
      const newComponent: Component = {
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: elementType as any,
        props: {
          text: getDefaultText(elementType)
        },
        styles: getDefaultStyles(elementType)
      };

      setComponents([...components, newComponent]);
    }
  };


  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeIndex = components.findIndex((comp) => comp.id === activeId);
    const overIndex = components.findIndex((comp) => comp.id === overId);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newComponents = arrayMove(components, activeIndex, overIndex);
      setComponents(newComponents);
    }
  };

  // Функция для получения текста по умолчанию
  const getDefaultText = (type: string) => {
    switch (type) {
      case 'text': return 'Это текстовый блок';
      case 'button': return 'Нажми меня';
      case 'image': return 'Изображение';
      case 'header': return 'Мой сайт';
      case 'footer': return 'Мой сайт';
      case 'card': return 'Заголовок карточки';
      case 'form': return 'Форма обратной связи';
      case 'input': return '';
      case 'zeroblock': return 'ZeroBlock';
      // ДОБАВЛЯЕМ КОНТЕЙНЕРЫ
      case 'section': return 'Секция';
      case 'grid': return 'Grid сетка';
      case 'flex': return 'Flex контейнер';
      // E-COMMERCE КОМПОНЕНТЫ
      case 'product-card': return 'Название товара';
      case 'product-grid': return 'Сетка товаров';
      case 'shopping-cart': return 'Корзина покупок';
      case 'checkout-form': return 'Оформление заказа';
      case 'product-rating': return 'Рейтинг';
      default: return 'Элемент';
    }
  };

  // Функция для получения стилей по умолчанию
  const getDefaultStyles = (type: string): Component['styles'] => {
    const baseStyles: Component['styles'] = {
      margin: '5px',
      padding: '10px',
      border: '1px solid #ddd',
      backgroundColor: '#fff',
      borderRadius: '4px'
    };

    switch (type) {
      case 'text':
        return {
          ...baseStyles,
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center'
        };
      case 'button':
        return {
          ...baseStyles,
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          width: 'auto',
          display: 'inline-block'
        };
      case 'image':
        return {
          ...baseStyles,
          minHeight: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5'
        };
      case 'header':
        return {
          ...baseStyles,
          backgroundColor: '#2d3748',
          color: 'white',
          padding: '1rem 2rem',
          margin: '0',
          width: '100%'
        };
      case 'footer':
        return {
          ...baseStyles,
          backgroundColor: '#4a5568',
          color: 'white',
          padding: '2rem',
          margin: '2rem 0 0 0',
          width: '100%'
        };
      case 'card':
        return {
          ...baseStyles,
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: '0'
        };
      case 'form':
        return {
          ...baseStyles,
          backgroundColor: 'white',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        };
      case 'input':
        return {
          ...baseStyles,
          padding: '8px'
        };
      case 'zeroblock':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // ← ОСТАВЛЯЕМ background
          color: 'white',
          minHeight: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed rgba(255, 255, 255, 0.3)'
        };
      case 'section':
        return {
          ...baseStyles,
          height: '200px',
          backgroundColor: '#f7fafc',
          border: '2px dashed #cbd5e0',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px'
        };
      case 'grid':
        return {
          ...baseStyles,
          height: '200px',
          backgroundColor: '#fff5f5',
          border: '2px dashed #fed7d7',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridGap: '10px',
          padding: '15px'
        };
      case 'flex':
        return {
          ...baseStyles,
          height: '150px',
          backgroundColor: '#f0fff4',
          border: '2px dashed #c6f6d5',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '15px'
        };
      case 'product-card':
        return {
          ...baseStyles,
          width: '300px',
          height: '400px',
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column'
        };
      case 'product-grid':
        return {
          ...baseStyles,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gridGap: '20px',
          padding: '20px',
          backgroundColor: '#f7fafc'
        };
      case 'shopping-cart':
        return {
          ...baseStyles,
          width: '350px',
          height: '200px',
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        };
      case 'checkout-form':
        return {
          ...baseStyles,
          width: '400px',
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
        };
      case 'product-rating':
        return {
          ...baseStyles,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '8px 12px',
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          width: 'fit-content'
        };
      default:
        return baseStyles;
    }
  };

  // Функция для обновления компонента
  const updateComponent = (updatedComponent: Component) => {
    const newComponents = components.map(comp =>
      comp.id === updatedComponent.id ? updatedComponent : comp
    );
    setComponents(newComponents);
    setSelectedComponent(updatedComponent);
  };

  // Функция для удаления компонента
  const deleteComponent = (componentId: string) => {
    const newComponents = components.filter(comp => comp.id !== componentId);
    setComponents(newComponents);
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
  };

  // Функция для копирования элемента
  const copyComponent = (component: Component) => {
    setClipboard(component);
    setShowCopyToast(true);
    setTimeout(() => setShowCopyToast(false), 2000);
  };

  // Функция для вставки элемента
  const pasteComponent = () => {
    if (clipboard) {
      const newComponent: Component = {
        ...clipboard,
        id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      setComponents([...components, newComponent]);
    }
  };

  // Функция для дублирования элемента
  const duplicateComponent = (component: Component) => {
    const newComponent: Component = {
      ...component,
      id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    setComponents([...components, newComponent]);
  };

  // Функция для экспорта проекта
  const handleExport = () => {
    if (components.length === 0) {
      alert('Добавьте хотя бы один элемент на страницу перед экспортом!');
      return;
    }

    downloadProject(components, projectName);
    alert(`Проект "${projectName}" успешно экспортирован! Проверьте папку загрузок.`);
  };

  // Функция для применения шаблона
  const handleTemplateSelect = (template: Template) => {
    setComponents(template.components);
    setShowTemplates(false);
  };

  // Обработчики клавиш
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedComponent(null);
      }

      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        event.stopPropagation();

        switch (event.key.toLowerCase()) {
          case 'c':
          case 'с':
            if (selectedComponent) {
              setClipboard(selectedComponent);
              setShowCopyToast(true);
              setTimeout(() => setShowCopyToast(false), 2000);
            }
            break;

          case 'v':
          case 'м':
            if (clipboard) {
              const newComponent = {
                ...clipboard,
                id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
              };
              const newComponents = [...components, newComponent];
              setComponents(newComponents);
            }
            break;

          case 'd':
          case 'в':
            if (selectedComponent) {
              const newComponent = {
                ...selectedComponent,
                id: `component-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
              };
              const newComponents = [...components, newComponent];
              setComponents(newComponents);
            }
            break;

          case 'z':
            if (event.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;

          case 'y':
            redo();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [components, selectedComponent, clipboard, undo, redo, setComponents]);

  return (
    <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="header-title">
              <h1>🚀 Конструктор сайтов</h1>
              <p>Профессиональный no-code конструктор</p>
            </div>
            <div className="header-controls">
              {/* НОВОЕ: Кнопки переключения панелей */}
              <button
                onClick={() => setIsPaletteVisible(!isPaletteVisible)}
                className="panel-toggle"
                title={isPaletteVisible ? 'Скрыть панель элементов' : 'Показать панель элементов'}
              >
                {isPaletteVisible ? '◀️ Элементы' : 'Элементы ▶️'}
              </button>
              <ContextHelper components={components} />
              <button
                onClick={() => setShowAnalytics(true)}
                className="analytics-button"
                title="Статистика проекта"
              >
                📊 Аналитика
              </button>

              <button
                onClick={toggleTheme}
                className="theme-toggle"
                title={theme === 'light' ? 'Темная тема' : 'Светлая тема'}
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>

              <button
                onClick={() => setShowTemplates(true)}
                className="template-button"
              >
                🎨 Шаблоны
              </button>

              <div className="history-controls">
                <button
                  onClick={undo}
                  disabled={!canUndo}
                  className="history-btn"
                  title="Отменить (Ctrl+Z)"
                >
                  ↩️
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo}
                  className="history-btn"
                  title="Повторить (Ctrl+Y)"
                >
                  ↪️
                </button>
              </div>

              <button
                onClick={() => setIsPropertiesVisible(!isPropertiesVisible)}
                className="panel-toggle"
                title={isPropertiesVisible ? 'Скрыть свойства' : 'Показать свойства'}
              >
                {isPropertiesVisible ? 'Свойства ▶️' : '◀️ Свойства'}
              </button>

              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="project-name-input"
                placeholder="Название проекта"
              />

              <button
                onClick={handleExport}
                className="export-button"
                disabled={components.length === 0}
              >
                📦 Экспорт
              </button>
            </div>
          </div>
        </header>

        <div className="app-body">
          {/* Панель элементов - условный рендеринг */}
          {isPaletteVisible && <Palette />}

          {/* Основная рабочая область */}
          <Builder
            components={components}
            selectedComponent={selectedComponent}
            onSelectComponent={setSelectedComponent}
            onDeleteComponent={deleteComponent}
            onUpdateComponent={updateComponent}
            onCopyComponent={copyComponent}
            onDuplicateComponent={duplicateComponent}
          />

          {/* Панель свойств - условный рендеринг */}
          {isPropertiesVisible && (
            <PropertiesPanel
              component={selectedComponent}
              onUpdateComponent={updateComponent}
              onDeleteComponent={deleteComponent}
              onCopyComponent={copyComponent}
              onDuplicateComponent={duplicateComponent}
            />
          )}
        </div>

        {/* Модальные окна */}
        {showTemplates && (
          <TemplatePicker
            templates={demo_templates}
            onTemplateSelect={handleTemplateSelect}
            onClose={() => setShowTemplates(false)}
          />
        )}

        {showAnalytics && (
          <AnalyticsPanel
            components={components}
            isOpen={showAnalytics}
            onClose={() => setShowAnalytics(false)}
          />
        )}

        {showCopyToast && (
          <div className="toast">
            ✅ Элемент скопирован в буфер обмена
          </div>
        )}
      </div>
    </DndContext>
  );
}
// Вспомогательная функция ВНЕ компонента
const addComponentToContainer = (components: Component[], containerId: string, newComponent: Component): Component[] => {
  return components.map(comp => {
    if (comp.id === containerId) {
      return {
        ...comp,
        children: [...(comp.children || []), newComponent]
      };
    }

    if (comp.children) {
      return {
        ...comp,
        children: addComponentToContainer(comp.children, containerId, newComponent)
      };
    }

    return comp;
  });
};
// Главный компонент с провайдерами
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;