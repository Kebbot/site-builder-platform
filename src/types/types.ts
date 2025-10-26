// Основные типы элементов конструктора
export interface BuilderElement {
    id: string;
    type: string;
    containerId?: string;
    parentId?: string; // Для вложенных элементов
    position: {
        x: number;
        y: number;
        width: number | string;
        height: number | string;
        zIndex: number;
        rotation?: number;
        lockAspectRatio?: boolean;
    };
    style: {
        // Layout
        display?: 'block' | 'flex' | 'grid' | 'inline' | 'inline-block' | 'none';
        position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
        flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
        justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
        alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
        flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
        gap?: string;

        // Box Model
        backgroundColor?: string;
        backgroundImage?: string;
        backgroundSize?: 'cover' | 'contain' | 'auto';
        backgroundPosition?: string;
        backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';
        color?: string;
        fontSize?: number;
        fontWeight?: string | number;
        fontFamily?: string;
        textAlign?: 'left' | 'center' | 'right' | 'justify';
        lineHeight?: number | string;
        letterSpacing?: string;
        textDecoration?: string;
        textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';

        // Spacing
        padding?: string;
        paddingTop?: string;
        paddingRight?: string;
        paddingBottom?: string;
        paddingLeft?: string;
        margin?: string;
        marginTop?: string;
        marginRight?: string;
        marginBottom?: string;
        marginLeft?: string;

        // Border
        border?: string;
        borderTop?: string;
        borderRight?: string;
        borderBottom?: string;
        borderLeft?: string;
        borderRadius?: string;
        borderTopLeftRadius?: string;
        borderTopRightRadius?: string;
        borderBottomRightRadius?: string;
        borderBottomLeftRadius?: string;
        borderColor?: string;
        borderWidth?: string;
        borderStyle?: 'none' | 'hidden' | 'dotted' | 'dashed' | 'solid' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset';

        // Effects
        opacity?: number;
        boxShadow?: string;
        textShadow?: string;
        transform?: string;
        transition?: string;
        filter?: string;
        backdropFilter?: string;

        // Advanced
        cursor?: string;
        overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
        overflowX?: string;
        overflowY?: string;
        minWidth?: string;
        maxWidth?: string;
        minHeight?: string;
        maxHeight?: string;
        objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
        zIndex?: number;
    };
    content?: string;
    children?: BuilderElement[];
    metadata: ElementMetadata;
    // Для форм и интерактивных элементов
    props?: {
        placeholder?: string;
        required?: boolean;
        disabled?: boolean;
        checked?: boolean;
        options?: string[];
        href?: string;
        target?: '_blank' | '_self' | '_parent' | '_top';
        alt?: string;
        src?: string;
    };
}

export interface ElementMetadata {
    name: string;
    icon: string;
    category: 'layout' | 'content' | 'media' | 'form' | 'navigation' | 'advanced';
    canHaveChildren: boolean;
    maxChildren?: number;
    isContainer?: boolean;
    resizable?: boolean;
    draggable?: boolean;
    rotatable?: boolean;
    lockable?: boolean;
    defaultSize?: {
        width: number | string;
        height: number | string;
    };
    defaultStyle?: Partial<BuilderElement['style']>;
    defaultContent?: string;
}

// Типы контейнеров
export interface Container {
    id: string;
    type: 'free' | 'grid' | 'flex' | 'section' | 'div';
    name: string;
    elements: BuilderElement[];
    style: {
        // Размеры и позиция
        width: string;
        height: string;
        minHeight: string;
        maxWidth?: string;
        maxHeight?: string;

        // Фон
        backgroundColor: string;
        backgroundImage?: string;
        backgroundSize?: string;
        backgroundPosition?: string;
        backgroundRepeat?: string;
        backgroundAttachment?: 'scroll' | 'fixed' | 'local';

        // Отступы
        padding?: string;
        margin?: string;

        // Границы
        border?: string;
        borderRadius?: string;

        // Эффекты
        boxShadow?: string;
        opacity?: number;

        // Прокрутка
        overflow?: string;

        // Flex/Grid специфичные
        gridTemplateColumns?: string;
        gridTemplateRows?: string;
        gridGap?: string;
        flexDirection?: string;
        justifyContent?: string;
        alignItems?: string;
    };
    metadata: {
        isRoot?: boolean;
        canDelete?: boolean;
        canRename?: boolean;
    };
}

// Проект
export interface Project {
    id: string;
    name: string;
    description?: string;
    containers: Container[];
    settings: ProjectSettings;
    metadata: {
        createdAt: string;
        updatedAt: string;
        createdBy: string;
        version: string;
    };
}

export interface ProjectSettings {
    // Viewport
    viewport: 'desktop' | 'tablet' | 'mobile' | 'responsive';
    breakpoints: {
        mobile: number;
        tablet: number;
        desktop: number;
    };

    // Настройки конструктора
    grid: boolean;
    snap: boolean;
    snapThreshold: number;
    rulers: boolean;
    outline: boolean;

    // Настройки страницы
    pageWidth: string;
    pageHeight: string;
    pageBackground: string;
    pageBackgroundImage?: string;

    // SEO
    title: string;
    description: string;
    keywords: string;
    favicon?: string;

    // Публикация
    published: boolean;
    publishUrl?: string;
}

// Состояние перетаскивания
export interface DragState {
    isDragging: boolean;
    elementType: string;
    elementData?: Partial<BuilderElement>;
    source?: 'palette' | 'canvas';
}

// Выравнивание и направляющие
export interface AlignmentGuide {
    type: 'vertical' | 'horizontal';
    position: number;
    elements: string[];
    strength: 'weak' | 'medium' | 'strong';
}

export interface SnapLines {
    vertical: number[];
    horizontal: number[];
}

// История изменений
export interface HistoryState {
    past: Project[];
    future: Project[];
    present: Project;
}

// Панель свойств
export interface PropertyGroup {
    id: string;
    name: string;
    icon: string;
    properties: Property[];
    collapsed?: boolean;
}

export interface Property {
    id: string;
    name: string;
    type: 'text' | 'number' | 'color' | 'select' | 'boolean' | 'range' | 'image' | 'font' | 'shadow' | 'gradient';
    value: any;
    options?: string[] | { label: string; value: any }[];
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    category?: 'layout' | 'typography' | 'background' | 'border' | 'effects' | 'advanced';
}

// Аналитика и предпросмотр
export interface AnalyticsData {
    elementId: string;
    clicks: number;
    views: number;
    interactions: number;
    lastInteraction: string;
}

export interface PreviewSettings {
    device: 'desktop' | 'tablet' | 'mobile';
    showGrid: boolean;
    showOutlines: boolean;
    showHidden: boolean;
    zoom: number;
}

// Темы
export interface Theme {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        error: string;
        warning: string;
        success: string;
        info: string;
    };
    typography: {
        fontFamily: string;
        fontSize: {
            xs: string;
            sm: string;
            base: string;
            lg: string;
            xl: string;
            '2xl': string;
            '3xl': string;
        };
        fontWeight: {
            light: number;
            normal: number;
            medium: number;
            semibold: number;
            bold: number;
        };
    };
    spacing: {
        xs: string;
        sm: string;
        md: string;
        lg: string;
        xl: string;
    };
    borderRadius: {
        sm: string;
        md: string;
        lg: string;
        full: string;
    };
}

// Шаблоны
export interface Template {
    id: string;
    name: string;
    description: string;
    category: 'business' | 'portfolio' | 'ecommerce' | 'blog' | 'landing' | 'personal';
    thumbnail: string;
    project: Project;
    tags: string[];
    isPremium: boolean;
    createdAt: string;
}

// Утилиты экспорта
export interface ExportOptions {
    format: 'html' | 'react' | 'vue' | 'static';
    includeCSS: boolean;
    includeJS: boolean;
    minify: boolean;
    responsive: boolean;
    exportPath: string;
}

export interface ExportedProject {
    html: string;
    css: string;
    js: string;
    assets: string[];
    metadata: {
        elementCount: number;
        containerCount: number;
        exportTime: string;
        fileSize: string;
    };
}

// Контекст и события
export interface BuilderContextType {
    project: Project;
    selectedElement: BuilderElement | null;
    selectedContainer: Container | null;
    dragState: DragState;
    previewSettings: PreviewSettings;
    history: HistoryState;
    theme: Theme;

    // Actions
    updateProject: (project: Project) => void;
    selectElement: (element: BuilderElement | null) => void;
    selectContainer: (container: Container | null) => void;
    setDragState: (state: DragState) => void;
    updateElement: (elementId: string, updates: Partial<BuilderElement>) => void;
    deleteElement: (elementId: string) => void;
    duplicateElement: (elementId: string) => void;
    addElement: (element: BuilderElement, containerId: string) => void;
    moveElement: (elementId: string, newContainerId: string, newPosition: Partial<BuilderElement['position']>) => void;

    // History
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;

    // Preview
    setPreviewSettings: (settings: Partial<PreviewSettings>) => void;
    togglePreview: () => void;
    isPreview: boolean;
}

// События клавиатуры
export interface KeyboardShortcut {
    key: string;
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    action: () => void;
    description: string;
}

// Палитра элементов
export interface PaletteItem {
    id: string;
    name: string;
    icon: string;
    category: string;
    element: Partial<BuilderElement>;
    popularity: number;
    isNew?: boolean;
}

// Вспомогательные типы
export type CSSUnit = 'px' | '%' | 'em' | 'rem' | 'vh' | 'vw' | 'vmin' | 'vmax';
export type ColorFormat = 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla';
export type FontWeight = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | 'normal' | 'bold' | 'lighter' | 'bolder';

// Утилитарные типы
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Константы
export const ELEMENT_TYPES = {
    // Layout
    CONTAINER: 'container',
    SECTION: 'section',
    DIV: 'div',
    GRID: 'grid',
    FLEX: 'flex',

    // Content
    TEXT: 'text',
    HEADING: 'heading',
    PARAGRAPH: 'paragraph',
    BUTTON: 'button',
    LINK: 'link',
    LIST: 'list',
    LIST_ITEM: 'list_item',

    // Media
    IMAGE: 'image',
    VIDEO: 'video',
    ICON: 'icon',
    GALLERY: 'gallery',

    // Forms
    FORM: 'form',
    INPUT: 'input',
    TEXTAREA: 'textarea',
    SELECT: 'select',
    CHECKBOX: 'checkbox',
    RADIO: 'radio',
    LABEL: 'label',

    // Navigation
    NAVBAR: 'navbar',
    MENU: 'menu',
    BREADCRUMB: 'breadcrumb',
    PAGINATION: 'pagination',

    // Advanced
    CAROUSEL: 'carousel',
    ACCORDION: 'accordion',
    MODAL: 'modal',
    TABS: 'tabs',
    CARD: 'card',
} as const;

export const CATEGORIES = {
    LAYOUT: 'layout',
    CONTENT: 'content',
    MEDIA: 'media',
    FORM: 'form',
    NAVIGATION: 'navigation',
    ADVANCED: 'advanced',
} as const;