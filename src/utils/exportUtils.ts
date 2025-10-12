import { Component } from './../types/types';

// Генерация HTML структуры
export const generateHTML = (components: Component[]): string => {
    const elementsHTML = components.map(component => {
        switch (component.type) {
            case 'text':
                return `    <div class="element-${component.id} text-element">
      ${component.props.text || 'Текст элемента'}
    </div>`;

            case 'button':
                return `    <button class="element-${component.id} button-element">
      ${component.props.text || 'Кнопка'}
    </button>`;

            case 'image':
                return `    <div class="element-${component.id} image-element">
      <div class="image-placeholder">
        🖼️ ${component.props.text || 'Изображение'}
      </div>
    </div>`;

            case 'zeroblock':
                const zeroblockHTML = component.props.customHTML || '<div>ZeroBlock</div>';
                const zeroblockCSS = component.props.customCSS || '';
                const zeroblockJS = component.props.customJS || '';

                return `    <div class="element-${component.id} zeroblock-element">
      ${zeroblockHTML}
      <style>${zeroblockCSS}</style>
      <script>${zeroblockJS}</script>
    </div>`;

            default:
                return `    <div class="element-${component.id}">
      Неизвестный элемент
    </div>`;
        }
    }).join('\n');

    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Сайт создан в конструкторе</title>
    <style>
${generateCSS(components)}
    </style>
</head>
<body>
    <div class="container">
${elementsHTML}
    </div>
    
    <script>
${generateJS(components)}
    </script>
</body>
</html>`;
};

// Генерация CSS стилей
export const generateCSS = (components: Component[]): string => {
    const globalStyles = `        /* Глобальные стили */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f4f4f4;
            padding: 20px;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .image-placeholder {
            background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: #666;
        }`;

    const componentStyles = components.map(component => {
        const styles = Object.entries(component.styles)
            .map(([property, value]) => `            ${property}: ${value};`)
            .join('\n');

        return `        .element-${component.id} {
${styles}
        }`;
    }).join('\n\n');

    return `${globalStyles}

${componentStyles}`;
};

// Генерация JavaScript
export const generateJS = (components: Component[]): string => {
    const buttonComponents = components.filter(comp => comp.type === 'button');

    if (buttonComponents.length === 0) {
        return `        // JavaScript код будет здесь
        console.log('Сайт успешно загружен!');`;
    }

    const buttonHandlers = buttonComponents.map(component => {
        return `        document.querySelector('.element-${component.id}').addEventListener('click', function() {
            alert('Кнопка "${component.props.text || 'Без названия'}" нажата!');
        });`;
    }).join('\n');

    return `        // Обработчики для кнопок
        document.addEventListener('DOMContentLoaded', function() {
${buttonHandlers}
        });`;
};

// Создание и скачивание ZIP архива
export const downloadProject = (components: Component[], projectName: string = 'my-website') => {
    const htmlContent = generateHTML(components);
    const cssContent = generateCSS(components);
    const jsContent = generateJS(components);

    // Создаем отдельные файлы
    const files = {
        'index.html': htmlContent,
        'styles.css': `/* Стили для ${projectName} */\n${cssContent}`,
        'script.js': `/* JavaScript для ${projectName} */\n${jsContent}`,
        'README.txt': `Сайт "${projectName}" создан в конструкторе сайтов\n\nДля запуска откройте файл index.html в браузере.\n\nФайлы:\n- index.html - главная страница\n- styles.css - стили\n- script.js - JavaScript код`
    };

    // Скачиваем каждый файл по отдельности (пока без ZIP)
    Object.entries(files).forEach(([filename, content]) => {
        downloadFile(filename, content);
    });
};

// Вспомогательная функция для скачивания файла
const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};