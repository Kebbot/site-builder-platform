import { Project, BuilderElement, Container, ExportOptions, ExportedProject } from '../types/types';

/**
 * Утилиты для экспорта проекта в различные форматы
 */

// Генерация CSS из стилей элемента
export const generateElementCSS = (element: BuilderElement, isResponsive: boolean = false): string => {
  const selector = `.element-${element.id}`;
  const styles = { ...element.style };

  // Обрабатываем позиционирование для абсолютно позиционированных элементов
  if (element.position) {
    styles.position = 'absolute';
    styles.left = `${element.position.x}px`;
    styles.top = `${element.position.y}px`;
    styles.width = typeof element.position.width === 'number'
      ? `${element.position.width}px`
      : element.position.width;
    styles.height = typeof element.position.height === 'number'
      ? `${element.position.height}px`
      : element.position.height;
    styles.zIndex = element.position.zIndex;

    if (element.position.rotation) {
      styles.transform = `rotate(${element.position.rotation}deg)`;
    }
  }

  // Обрабатываем контент-специфичные стили
  if (element.type === 'button') {
    styles.cursor = 'pointer';
    styles.userSelect = 'none';
  }

  if (element.type === 'text' || element.type === 'heading' || element.type === 'paragraph') {
    styles.whiteSpace = 'pre-wrap';
    styles.wordWrap = 'break-word';
  }

  if (element.type === 'image') {
    styles.display = 'block';
    styles.maxWidth = '100%';
  }

  // Конвертируем объект стилей в CSS строку
  const cssString = Object.entries(styles)
    .map(([property, value]) => {
      if (value === undefined || value === null) return '';

      // Конвертация camelCase в kebab-case
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();

      // Обработка числовых значений
      let cssValue = value;
      if (typeof value === 'number' && !['zIndex', 'fontWeight', 'opacity', 'lineHeight'].includes(property)) {
        cssValue = `${value}px`;
      }

      return `  ${cssProperty}: ${cssValue};`;
    })
    .filter(line => line !== '')
    .join('\n');

  return `${selector} {\n${cssString}\n}`;
};

// Генерация HTML для элемента
export const generateElementHTML = (element: BuilderElement): string => {
  const baseAttrs = `data-element-id="${element.id}" data-element-type="${element.type}" class="element-${element.id}"`;

  switch (element.type) {
    case 'text':
    case 'paragraph':
      return `<div ${baseAttrs}>${element.content || ''}</div>`;

    case 'heading':
      const level = element.props?.level || 'h1';
      return `<${level} ${baseAttrs}>${element.content || ''}</${level}>`;

    case 'button':
      return `<button ${baseAttrs} type="button">${element.content || ''}</button>`;

    case 'image':
      const src = element.content || element.props?.src || '';
      const alt = element.props?.alt || 'Image';
      return `<img ${baseAttrs} src="${src}" alt="${alt}" />`;

    case 'container':
    case 'section':
      const childElements = element.children?.map(child => generateElementHTML(child)).join('') || '';
      return `<div ${baseAttrs}>${childElements}${element.content || ''}</div>`;

    case 'divider':
      return `<hr ${baseAttrs} />`;

    case 'spacer':
      return `<div ${baseAttrs}></div>`;

    case 'input':
      const type = element.props?.type || 'text';
      const placeholder = element.props?.placeholder || '';
      return `<input ${baseAttrs} type="${type}" placeholder="${placeholder}" />`;

    default:
      return `<div ${baseAttrs}>${element.content || ''}</div>`;
  }
};

// Генерация CSS для контейнера
export const generateContainerCSS = (container: Container, isResponsive: boolean = false): string => {
  const selector = `.container-${container.id}`;
  const styles: any = { ...container.style };

  // Базовая стилизация контейнера
  styles.position = 'relative';
  styles.boxSizing = 'border-box';

  // Адаптивные стили
  if (isResponsive) {
    styles.maxWidth = '100%';
    styles.overflowX = 'hidden';
  }

  const cssString = Object.entries(styles)
    .map(([property, value]) => {
      if (value === undefined || value === null) return '';

      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `  ${cssProperty}: ${value};`;
    })
    .filter(line => line !== '')
    .join('\n');

  return `${selector} {\n${cssString}\n}`;
};

// Генерация HTML для контейнера
export const generateContainerHTML = (container: Container): string => {
  const elementsHTML = container.elements.map(element => generateElementHTML(element)).join('\n    ');
  return `
  <div class="container-${container.id}" data-container-id="${container.id}">
    ${elementsHTML}
  </div>`;
};

// Генерация базовых CSS стилей
export const generateBaseCSS = (project: Project, isResponsive: boolean = false): string => {
  const baseStyles = `
/* Base Styles for ${project.name} */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: ${project.settings.pageBackground || '#ffffff'};
  ${project.settings.pageBackgroundImage ? `background-image: url('${project.settings.pageBackgroundImage}');` : ''}
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

/* Container Styles */
.container-root {
  width: ${project.settings.pageWidth || '100%'};
  ${project.settings.pageHeight ? `height: ${project.settings.pageHeight};` : 'min-height: 100vh;'}
  margin: 0 auto;
  position: relative;
}

/* Responsive Design */
${isResponsive ? `
@media (max-width: ${project.settings.breakpoints?.tablet || 768}px) {
  .container-root {
    width: 100%;
    padding: 0 16px;
  }
  
  .element-responsive {
    width: 100% !important;
    position: relative !important;
    left: 0 !important;
  }
}

@media (max-width: ${project.settings.breakpoints?.mobile || 375}px) {
  body {
    font-size: 14px;
  }
  
  .container-root {
    padding: 0 8px;
  }
}
` : ''}

/* Utility Classes */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.flex { display: flex; }
.flex-column { flex-direction: column; }
.flex-center { 
  display: flex;
  align-items: center;
  justify-content: center;
}

.hidden { display: none; }
.visible { display: block; }

/* Animation Classes */
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.slide-up {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}
`;

  return baseStyles;
};

// Генерация JavaScript для интерактивных элементов
export const generateJavaScript = (project: Project, includeJS: boolean = true): string => {
  if (!includeJS) return '';

  const interactiveElements = project.containers.flatMap(container =>
    container.elements.filter(element =>
      element.type === 'button' || element.props?.onClick
    )
  );

  const jsCode = `
// JavaScript for ${project.name}
document.addEventListener('DOMContentLoaded', function() {
  // Button interactions
  ${interactiveElements.map(element => `
  // ${element.metadata.name}
  const ${element.id} = document.querySelector('[data-element-id="${element.id}"]');
  if (${element.id}) {
    ${element.id}.addEventListener('click', function() {
      ${element.props?.onClick || 'console.log("Button clicked: ' + element.id + '");'}
    });
  }
  `).join('\n  ')}

  // Image lazy loading
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));

  // Responsive behavior
  function handleResize() {
    const width = window.innerWidth;
    const isMobile = width <= ${project.settings.breakpoints?.mobile || 375};
    const isTablet = width <= ${project.settings.breakpoints?.tablet || 768} && width > ${project.settings.breakpoints?.mobile || 375};
    
    document.body.classList.toggle('mobile-view', isMobile);
    document.body.classList.toggle('tablet-view', isTablet);
    document.body.classList.toggle('desktop-view', !isMobile && !isTablet);
  }

  window.addEventListener('resize', handleResize);
  handleResize(); // Initial call
});

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
`;

  return jsCode;
};

// Основная функция экспорта проекта
export const exportProject = (
  project: Project,
  options: ExportOptions = {
    format: 'html',
    includeCSS: true,
    includeJS: true,
    minify: false,
    responsive: true,
    exportPath: './'
  }
): ExportedProject => {
  const { format, includeCSS, includeJS, minify, responsive } = options;

  // Генерация HTML структуры
  const containersHTML = project.containers.map(container => generateContainerHTML(container)).join('\n');

  const fullHTML = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.settings.title || project.name}</title>
  <meta name="description" content="${project.settings.description || ''}">
  <meta name="keywords" content="${project.settings.keywords || ''}">
  ${project.settings.favicon ? `<link rel="icon" href="${project.settings.favicon}" type="image/x-icon">` : ''}
  ${includeCSS ? `<style>${generateBaseCSS(project, responsive)}</style>` : ''}
</head>
<body>
  <div class="container-root">
    ${containersHTML}
  </div>
  ${includeJS ? `<script>${generateJavaScript(project, includeJS)}</script>` : ''}
</body>
</html>`;

  // Генерация CSS стилей
  const containerCSS = project.containers.map(container =>
    generateContainerCSS(container, responsive)
  ).join('\n\n');

  const elementsCSS = project.containers.flatMap(container =>
    container.elements.map(element => generateElementCSS(element, responsive))
  ).join('\n\n');

  const fullCSS = `${generateBaseCSS(project, responsive)}\n\n${containerCSS}\n\n${elementsCSS}`;

  // Генерация JavaScript
  const fullJS = generateJavaScript(project, includeJS);

  // Минификация если требуется
  let finalHTML = fullHTML;
  let finalCSS = fullCSS;
  let finalJS = fullJS;

  if (minify) {
    finalHTML = minifyHTML(fullHTML);
    finalCSS = minifyCSS(fullCSS);
    finalJS = minifyJS(fullJS);
  }

  // Сборка метаданных экспорта
  const totalElements = project.containers.reduce((sum, container) => sum + container.elements.length, 0);
  const fileSize = new Blob([finalHTML + finalCSS + finalJS]).size;

  const metadata = {
    elementCount: totalElements,
    containerCount: project.containers.length,
    exportTime: new Date().toISOString(),
    fileSize: formatFileSize(fileSize)
  };

  return {
    html: finalHTML,
    css: finalCSS,
    js: finalJS,
    assets: collectAssets(project),
    metadata
  };
};

// Экспорт в React компоненты
export const exportToReact = (project: Project): string => {
  const componentName = project.name.replace(/[^a-zA-Z0-9]/g, '').replace(/^[a-z]/, match => match.toUpperCase());

  const containerComponents = project.containers.map(container => {
    const containerName = `Container${container.id.replace(/[^a-zA-Z0-9]/g, '')}`;

    const elementComponents = container.elements.map(element => {
      const elementName = `Element${element.id.replace(/[^a-zA-Z0-9]/g, '')}`;

      const styleObject = JSON.stringify(element.style, null, 2);
      const positionStyle = `{
        position: 'absolute',
        left: ${element.position.x},
        top: ${element.position.y},
        width: ${typeof element.position.width === 'number' ? element.position.width : `'${element.position.width}'`},
        height: ${typeof element.position.height === 'number' ? element.position.height : `'${element.position.height}'`},
        zIndex: ${element.position.zIndex}
      }`;

      return `
const ${elementName} = () => {
  const style = { ...${styleObject}, ...${positionStyle} };
  
  return (
    ${generateReactElement(element, elementName)}
  );
};`;
    }).join('\n\n');

    return `
${elementComponents}

const ${containerName} = () => {
  const containerStyle = ${JSON.stringify(container.style, null, 2)};
  
  return (
    <div className="container-${container.id}" style={containerStyle}>
      ${container.elements.map(element =>
      `<${element} key="${element.id}" />`
    ).join('\n      ')}
    </div>
  );
};`;
  }).join('\n\n');

  return `
import React from 'react';
import './${componentName}.css';

${containerComponents}

const ${componentName} = () => {
  return (
    <div className="${componentName.toLowerCase()}">
      ${project.containers.map(container =>
    `<${container} key="${container.id}" />`
  ).join('\n      ')}
    </div>
  );
};

export default ${componentName};
`;
};

// Генерация React элемента
const generateReactElement = (element: BuilderElement, componentName: string): string => {
  const styleObject = `{ ...${JSON.stringify(element.style)}, ...${JSON.stringify({
    position: 'absolute',
    left: element.position.x,
    top: element.position.y,
    width: element.position.width,
    height: element.position.height,
    zIndex: element.position.zIndex
  })} }`;

  switch (element.type) {
    case 'text':
    case 'paragraph':
      return `<div style={${styleObject}}>${element.content || ''}</div>`;

    case 'heading':
      const level = element.props?.level || 'h1';
      return `<${level} style={${styleObject}}>${element.content || ''}</${level}>`;

    case 'button':
      return `<button style={${styleObject}} type="button">${element.content || ''}</button>`;

    case 'image':
      const src = element.content || element.props?.src || '';
      const alt = element.props?.alt || 'Image';
      return `<img style={${styleObject}} src="${src}" alt="${alt}" />`;

    default:
      return `<div style={${styleObject}}>${element.content || ''}</div>`;
  }
};

// Утилиты минификации
export const minifyHTML = (html: string): string => {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/<!--.*?-->/g, '')
    .trim();
};

export const minifyCSS = (css: string): string => {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Удаление комментариев
    .replace(/\s+/g, ' ')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*;\s*/g, ';')
    .replace(/\s*:\s*/g, ':')
    .replace(/;\s*}/g, '}')
    .trim();
};

export const minifyJS = (js: string): string => {
  return js
    .replace(/\/\/.*$/gm, '') // Удаление однострочных комментариев
    .replace(/\/\*[\s\S]*?\*\//g, '') // Удаление многострочных комментариев
    .replace(/\s+/g, ' ')
    .replace(/\s*([=+\-*\/%&|^!><?:])\s*/g, '$1')
    .replace(/;\s*/g, ';')
    .trim();
};

// Сборка используемых ассетов
const collectAssets = (project: Project): string[] => {
  const assets: Set<string> = new Set();

  project.containers.forEach(container => {
    // Фоновые изображения контейнеров
    if (container.style.backgroundImage) {
      assets.add(container.style.backgroundImage);
    }

    // Элементы с изображениями
    container.elements.forEach(element => {
      if (element.type === 'image') {
        const src = element.content || element.props?.src;
        if (src) assets.add(src);
      }

      if (element.style.backgroundImage) {
        assets.add(element.style.backgroundImage);
      }
    });
  });

  // Фавикон
  if (project.settings.favicon) {
    assets.add(project.settings.favicon);
  }

  // Фон страницы
  if (project.settings.pageBackgroundImage) {
    assets.add(project.settings.pageBackgroundImage);
  }

  return Array.from(assets);
};

// Форматирование размера файла
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Генерация манифеста для PWA
export const generateManifest = (project: Project): string => {
  return JSON.stringify({
    name: project.name,
    short_name: project.name.substring(0, 12),
    description: project.settings.description,
    start_url: '/',
    display: 'standalone',
    background_color: project.settings.pageBackground || '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: project.settings.favicon || '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: project.settings.favicon || '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }, null, 2);
};

// Экспорт проекта как ZIP архив (симуляция)
export const exportAsZip = async (project: Project, options: ExportOptions): Promise<Blob> => {
  const exported = exportProject(project, options);

  // В реальном приложении здесь была бы логика создания ZIP архива
  // Для демонстрации возвращаем blob с HTML содержимым

  const content = `
Project: ${project.name}
Exported: ${new Date().toLocaleDateString()}

Files:
- index.html (${formatFileSize(exported.html.length)})
- styles.css (${formatFileSize(exported.css.length)})
- script.js (${formatFileSize(exported.js.length)})

Assets:
${exported.assets.map(asset => `- ${asset}`).join('\n')}
  `.trim();

  return new Blob([content], { type: 'text/plain' });
};

// Валидация проекта перед экспортом
export const validateProjectForExport = (project: Project): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Проверка наличия контейнеров
  if (project.containers.length === 0) {
    errors.push('Проект не содержит контейнеров');
  }

  // Проверка корректности элементов
  project.containers.forEach((container, containerIndex) => {
    container.elements.forEach((element, elementIndex) => {
      if (!element.type) {
        errors.push(`Элемент ${elementIndex} в контейнере ${containerIndex} не имеет типа`);
      }

      if (!element.position) {
        errors.push(`Элемент ${elementIndex} в контейнере ${containerIndex} не имеет позиции`);
      }

      // Проверка изображений
      if (element.type === 'image' && !element.content && !element.props?.src) {
        errors.push(`Изображение ${elementIndex} в контейнере ${containerIndex} не имеет источника`);
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Предпросмотр экспорта
export const generateExportPreview = (project: Project, options: ExportOptions): string => {
  const exported = exportProject(project, options);

  return `
=== EXPORT PREVIEW ===
Project: ${project.name}
Format: ${options.format}
Size: ${exported.metadata.fileSize}
Elements: ${exported.metadata.elementCount}
Containers: ${exported.metadata.containerCount}

HTML: ${exported.html.length} chars
CSS: ${exported.css.length} chars
JS: ${exported.js.length} chars
Assets: ${exported.assets.length} files

Validation: ${validateProjectForExport(project).isValid ? 'PASS' : 'FAIL'}
  `.trim();
};

export default {
  exportProject,
  exportToReact,
  exportAsZip,
  validateProjectForExport,
  generateExportPreview,
  generateManifest,
  minifyHTML,
  minifyCSS,
  minifyJS
};