// Обновляем интерфейс Component
export interface Component {
    id: string;
    type: 'button' | 'text' | 'image' | 'container' | 'header' | 'footer' | 'form' | 'input' | 'video' | 'card' | 'zeroblock' | 'section' | 'grid' | 'flex' | 'product-card' | 'product-grid' | 'shopping-cart' | 'checkout-form' | 'product-rating';
    props: {
        text?: string;
        src?: string;
        color?: string;
        placeholder?: string;
        type?: string;
        required?: boolean;
        customHTML?: string;
        customCSS?: string;
        customJS?: string;
        // НОВЫЕ СВОЙСТВА ДЛЯ КОНТЕЙНЕРОВ
        containerType?: 'section' | 'grid' | 'flex';
        columns?: number;
        gap?: string;
        // НОВЫЕ СВОЙСТВА ДЛЯ E-COMMERCE
        productName?: string;
        productPrice?: string;
        productDescription?: string;
        productImage?: string;
        rating?: number;
        currency?: string;
        buttonText?: string;
    };
    styles: {
        width?: string;
        height?: string;
        margin?: string;
        padding?: string;
        backgroundColor?: string;
        color?: string;
        fontSize?: string;
        border?: string;
        borderRadius?: string;
        textAlign?: 'left' | 'center' | 'right';
        display?: 'block' | 'inline' | 'inline-block' | 'flex' | 'grid' | 'none';
        flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
        alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
        justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
        gridTemplateColumns?: string;
        gridGap?: string;
        flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
        // ДОБАВЛЕНЫ НОВЫЕ СВОЙСТВА
        boxShadow?: string;
        cursor?: string;
        overflow?: string;
        gap?: string;
        minHeight?: string;
        background?: string;
    };
    // НОВОЕ ПОЛЕ ДЛЯ ВЛОЖЕННОСТИ
    children?: Component[];
}

// УДАЛИЛИ Project интерфейс, так как он не используется
// export interface Project {
//   id: string;
//   name: string;
//   components: Component[];
// }

// Типы для Drag-and-Drop
export interface DraggableItem {
    type: 'button' | 'text' | 'image' | 'header' | 'footer' | 'form' | 'input' | 'card' | 'product-card' | 'product-grid' | 'shopping-cart' | 'checkout-form' | 'product-rating';
}

// Типы для шаблонов
export interface Template {
    id: string;
    name: string;
    description: string;
    category: 'business' | 'portfolio' | 'blog' | 'landing' | 'ecommerce';
    thumbnail: string;
    components: Component[];
}

export interface TemplatesState {
    templates: Template[];
    currentTemplate: Template | null;
}