import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Project, BuilderElement, Container, DragState, HistoryState } from './types/types';
import { Builder } from './components/Builder/Builder';
import { Palette } from './components/Palette/Palette';
import { PropertiesPanel } from './components/Properties/PropertiesPanel';
import { TemplatePicker } from './components/Templates/TemplatePicker';
import { AnalyticsPanel } from './components/Analytics/AnalyticsPanel';
import { ContextHelper } from './components/ContextHelper/ContextHelper';
import { ThemeProvider } from './contexts/ThemeContext';
import { exportProject, validateProjectForExport } from './utils/exportUtils';
import { useTheme } from './contexts/ThemeContext';
import './App.css';

// Начальное состояние проекта
const initialProject: Project = {
  id: 'project-1',
  name: 'Мой сайт',
  description: 'Создан в конструкторе сайтов',
  containers: [
    {
      id: 'container-1',
      type: 'free',
      name: 'Основной контейнер',
      elements: [],
      style: {
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        backgroundColor: '#ffffff',
        padding: '20px'
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
    breakpoints: {
      mobile: 375,
      tablet: 768,
      desktop: 1200
    },
    grid: true,
    snap: true,
    snapThreshold: 5,
    rulers: false,
    outline: true,
    pageWidth: '100%',
    pageHeight: 'auto',
    pageBackground: '#ffffff',
    title: 'Мой сайт',
    description: 'Создан в конструкторе сайтов',
    keywords: 'сайт, конструктор',
    published: false
  },
  metadata: {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user',
    version: '1.0.0'
  }
};

// История изменений
const initialHistory: HistoryState = {
  past: [],
  future: [],
  present: initialProject
};

function App() {
  // Состояния приложения
  const [history, setHistory] = useState<HistoryState>(initialHistory);
  const [selectedElement, setSelectedElement] = useState<BuilderElement | null>(null);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(initialProject.containers[0]);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    elementType: '',
    elementData: null,
    source: 'palette'
  });
  const [activeTab, setActiveTab] = useState<'builder' | 'templates' | 'analytics'>('builder');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    format: 'html' as const,
    includeCSS: true,
    includeJS: true,
    minify: false,
    responsive: true,
    exportPath: './'
  });

  const project = history.present;
  const { theme } = useTheme();

  // Обновление проекта с сохранением в историю
  const updateProject = useCallback((newProject: Project) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      future: [],
      present: newProject
    }));
  }, []);

  // Отмена последнего действия
  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;

      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);

      return {
        past: newPast,
        future: [prev.present, ...prev.future],
        present: previous
      };
    });
  }, []);

  // Повтор последнего действия
  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;

      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        future: newFuture,
        present: next
      };
    });
  }, []);

  // Проверка возможности undo/redo
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  // Обработчик обновления элемента
  const handleElementUpdate = useCallback((elementId: string, updates: Partial<BuilderElement>) => {
    const updatedContainers = project.containers.map(container => ({
      ...container,
      elements: container.elements.map(element =>
        element.id === elementId ? { ...element, ...updates } : element
      )
    }));

    updateProject({
      ...project,
      containers: updatedContainers,
      metadata: {
        ...project.metadata,
        updatedAt: new Date().toISOString()
      }
    });
  }, [project, updateProject]);

  // Обработчик обновления контейнера
  const handleContainerUpdate = useCallback((containerId: string, updates: Partial<Container>) => {
    const updatedContainers = project.containers.map(container =>
      container.id === containerId ? { ...container, ...updates } : container
    );

    updateProject({
      ...project,
      containers: updatedContainers,
      metadata: {
        ...project.metadata,
        updatedAt: new Date().toISOString()
      }
    });
  }, [project, updateProject]);

  // Обработчик обновления настроек проекта
  const handleProjectUpdate = useCallback((updates: Partial<Project>) => {
    updateProject({
      ...project,
      ...updates,
      metadata: {
        ...project.metadata,
        updatedAt: new Date().toISOString()
      }
    });
  }, [project, updateProject]);

  // Обработчик переключения режима просмотра/редактирования
  const handleModeToggle = useCallback(() => {
    setMode(prev => prev === 'edit' ? 'preview' : 'edit');
  }, []);

  // Обработчик изменения состояния перетаскивания
  const handleDragStateChange = useCallback((newDragState: DragState) => {
    setDragState(newDragState);
  }, []);

  // Обработчик выбора шаблона
  const handleTemplateSelect = useCallback((templateProject: Project) => {
    updateProject({
      ...templateProject,
      id: project.id,
      metadata: {
        ...templateProject.metadata,
        createdAt: project.metadata.createdAt,
        updatedAt: new Date().toISOString()
      }
    });

    setActiveTab('builder');
    setSelectedElement(null);
    setSelectedContainer(templateProject.containers[0] || null);
  }, [project, updateProject]);

  // Обработчик экспорта проекта
  const handleExport = useCallback(() => {
    const validation = validateProjectForExport(project);

    if (!validation.isValid) {
      alert(`Ошибки при экспорте:\n${validation.errors.join('\n')}`);
      return;
    }

    const exported = exportProject(project, exportOptions);

    // Создаем и скачиваем файлы
    const htmlBlob = new Blob([exported.html], { type: 'text/html' });
    const cssBlob = new Blob([exported.css], { type: 'text/css' });
    const jsBlob = new Blob([exported.js], { type: 'application/javascript' });

    // Скачиваем HTML файл
    const htmlLink = document.createElement('a');
    htmlLink.href = URL.createObjectURL(htmlBlob);
    htmlLink.download = 'index.html';
    htmlLink.click();

    // Для демонстрации показываем информацию об экспорте
    console.log('Экспорт завершен:', exported.metadata);
    setShowExportDialog(false);

    alert(`Проект успешно экспортирован!\n\nФайлы:\n- index.html (${exported.metadata.fileSize})\n- ${exported.assets.length} ресурсов`);
  }, [project, exportOptions]);

  // Горячие клавиши
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        if (canRedo) redo();
      }

      // Переключение режима
      if (e.key === 'Tab' && e.ctrlKey) {
        e.preventDefault();
        handleModeToggle();
      }

      // Сохранение
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // В реальном приложении здесь была бы логика сохранения
        console.log('Project saved:', project);
        alert('Проект сохранен!');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [canUndo, canRedo, undo, redo, handleModeToggle, project]);

  // Автосохранение при изменении проекта
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // В реальном приложении здесь была бы логика автосохранения
      if (project !== initialProject) {
        console.log('Autosaving project...');
        localStorage.setItem('builder-project-autosave', JSON.stringify(project));
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [project]);

  // Восстановление автосохранения при загрузке
  useEffect(() => {
    const savedProject = localStorage.getItem('builder-project-autosave');
    if (savedProject) {
      try {
        const parsedProject = JSON.parse(savedProject);
        // Можно добавить диалог подтверждения восстановления
        console.log('Found autosaved project');
      } catch (error) {
        console.warn('Failed to parse autosaved project:', error);
      }
    }
  }, []);

  // Ренер главного интерфейса
  return (
    <ThemeProvider>
      <div className={`app ${mode} viewport-${project.settings.viewport}`}>
        {/* Верхняя панель инструментов */}
        <header className="app-header">
          <div className="header-left">
            <div className="logo">
              <span className="logo-icon">🚀</span>
              <span className="logo-text">SiteBuilder</span>
            </div>

            <div className="project-info">
              <input
                type="text"
                value={project.name}
                onChange={(e) => handleProjectUpdate({ name: e.target.value })}
                className="project-name-input"
                placeholder="Название проекта"
              />
              <span className="project-stats">
                {project.containers.reduce((sum, container) => sum + container.elements.length, 0)} элементов
              </span>
            </div>
          </div>

          <div className="header-center">
            <div className="mode-controls">
              <button
                className={`mode-btn ${mode === 'edit' ? 'active' : ''}`}
                onClick={() => setMode('edit')}
                title="Режим редактирования"
              >
                ✏️ Редактировать
              </button>
              <button
                className={`mode-btn ${mode === 'preview' ? 'active' : ''}`}
                onClick={() => setMode('preview')}
                title="Режим просмотра"
              >
                👁️ Просмотр
              </button>
            </div>

            <div className="viewport-controls">
              <select
                value={project.settings.viewport}
                onChange={(e) => handleProjectUpdate({
                  settings: { ...project.settings, viewport: e.target.value as any }
                })}
                className="viewport-select"
              >
                <option value="desktop">🖥️ Desktop</option>
                <option value="tablet">📱 Tablet</option>
                <option value="mobile">📱 Mobile</option>
              </select>
            </div>
          </div>

          <div className="header-right">
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

            <div className="action-controls">
              <button
                onClick={() => setShowExportDialog(true)}
                className="export-btn"
                title="Экспорт проекта"
              >
                📤 Экспорт
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className="templates-btn"
                title="Шаблоны"
              >
                📁 Шаблоны
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className="analytics-btn"
                title="Аналитика"
              >
                📊 Аналитика
              </button>
            </div>
          </div>
        </header>

        {/* Основной контент */}
        <main className="app-main">
          {/* Левая панель - Палитра элементов */}
          {activeTab === 'builder' && (
            <aside className="app-sidebar left-sidebar">
              <Palette
                onDragStart={handleDragStateChange}
                onDragEnd={() => handleDragStateChange({
                  isDragging: false,
                  elementType: '',
                  elementData: null,
                  source: 'palette'
                })}
                isDragging={dragState.isDragging}
              />
            </aside>
          )}

          {/* Центральная область - Конструктор или другие вкладки */}
          <section className="app-content">
            {activeTab === 'builder' && (
              <Builder
                project={project}
                onProjectUpdate={updateProject}
                selectedElement={selectedElement}
                onElementSelect={setSelectedElement}
                selectedContainer={selectedContainer}
                onContainerSelect={setSelectedContainer}
                mode={mode}
                onModeChange={setMode}
              />
            )}

            {activeTab === 'templates' && (
              <TemplatePicker
                isOpen={activeTab === 'templates'}
                onClose={() => setActiveTab('builder')}
                onTemplateSelect={handleTemplateSelect}
                currentProject={project}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsPanel
                project={project}
                onBack={() => setActiveTab('builder')}
              />
            )}
          </section>

          {/* Правая панель - Свойства */}
          {activeTab === 'builder' && (
            <aside className="app-sidebar right-sidebar">
              <PropertiesPanel
                selectedElement={selectedElement}
                selectedContainer={selectedContainer}
                project={project}
                onElementUpdate={handleElementUpdate}
                onContainerUpdate={handleContainerUpdate}
                onProjectUpdate={handleProjectUpdate}
              />
            </aside>
          )}
        </main>

        {/* Контекстная помощь */}
        <ContextHelper
          components={allElements}
        />

        {/* Диалог экспорта */}
        {showExportDialog && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Экспорт проекта</h2>
                <button
                  onClick={() => setShowExportDialog(false)}
                  className="modal-close"
                >
                  ×
                </button>
              </div>

              <div className="modal-body">
                <div className="export-options">
                  <div className="option-group">
                    <label>Формат:</label>
                    <select
                      value={exportOptions.format}
                      onChange={(e) => setExportOptions(prev => ({
                        ...prev,
                        format: e.target.value as any
                      }))}
                    >
                      <option value="html">HTML/CSS/JS</option>
                      <option value="react">React Components</option>
                      <option value="static">Static Site</option>
                    </select>
                  </div>

                  <div className="option-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={exportOptions.includeCSS}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          includeCSS: e.target.checked
                        }))}
                      />
                      Включать CSS
                    </label>
                  </div>

                  <div className="option-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={exportOptions.includeJS}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          includeJS: e.target.checked
                        }))}
                      />
                      Включать JavaScript
                    </label>
                  </div>

                  <div className="option-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={exportOptions.minify}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          minify: e.target.checked
                        }))}
                      />
                      Минифицировать код
                    </label>
                  </div>

                  <div className="option-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={exportOptions.responsive}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          responsive: e.target.checked
                        }))}
                      />
                      Адаптивный дизайн
                    </label>
                  </div>
                </div>

                <div className="export-preview">
                  <h3>Предпросмотр экспорта</h3>
                  <div className="preview-stats">
                    <div>Элементов: {project.containers.reduce((sum, container) => sum + container.elements.length, 0)}</div>
                    <div>Контейнеров: {project.containers.length}</div>
                    <div>Ресурсов: {exportProject(project, exportOptions).assets.length}</div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  onClick={() => setShowExportDialog(false)}
                  className="btn-secondary"
                >
                  Отмена
                </button>
                <button
                  onClick={handleExport}
                  className="btn-primary"
                >
                  📤 Экспортировать
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Статус бар */}
        <footer className="app-footer">
          <div className="status-left">
            <span className="status-mode">
              {mode === 'edit' ? '✏️ Режим редактирования' : '👁️ Режим просмотра'}
            </span>
            <span className="status-viewport">
              {project.settings.viewport === 'desktop' && '🖥️ Desktop'}
              {project.settings.viewport === 'tablet' && '📱 Tablet'}
              {project.settings.viewport === 'mobile' && '📱 Mobile'}
            </span>
          </div>

          <div className="status-center">
            {selectedElement && (
              <span className="status-selection">
                Выбран: {selectedElement.metadata.name} ({selectedElement.type})
              </span>
            )}
            {!selectedElement && selectedContainer && (
              <span className="status-selection">
                Выбран контейнер: {selectedContainer.name}
              </span>
            )}
            {!selectedElement && !selectedContainer && (
              <span className="status-selection">
                Выберите элемент для редактирования
              </span>
            )}
          </div>

          <div className="status-right">
            <span className="status-help">
              Ctrl+Z/Y - Отмена/Повтор • Tab - Режим • Delete - Удалить
            </span>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;