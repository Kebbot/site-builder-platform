import { useState, useCallback, useRef } from 'react';
import { BuilderElement, AlignmentGuide, SnapLines, Container } from '../types/types';

interface UseAlignmentGuidesProps {
    container: Container;
    snapThreshold?: number;
    enabled?: boolean;
}

interface AlignmentResult {
    guides: AlignmentGuide[];
    snappedPosition: {
        x: number;
        y: number;
    };
    snapLines: SnapLines;
}

export const useAlignmentGuides = ({
    container,
    snapThreshold = 5,
    enabled = true
}: UseAlignmentGuidesProps) => {
    const [guides, setGuides] = useState<AlignmentGuide[]>([]);
    const [snapLines, setSnapLines] = useState<SnapLines>({ vertical: [], horizontal: [] });
    const guidesRef = useRef<AlignmentGuide[]>([]);
    const snapLinesRef = useRef<SnapLines>({ vertical: [], horizontal: [] });

    // Основная функция расчета направляющих
    const calculateGuides = useCallback((
        movingElement: BuilderElement,
        allElements: BuilderElement[],
        containerRect: DOMRect,
        ignoreElementIds: string[] = []
    ): AlignmentResult => {
        if (!enabled) {
            return { guides: [], snappedPosition: { x: movingElement.position.x, y: movingElement.position.y }, snapLines: { vertical: [], horizontal: [] } };
        }

        const newGuides: AlignmentGuide[] = [];
        const verticalSnapLines: number[] = [];
        const horizontalSnapLines: number[] = [];

        const movingRect = calculateElementRect(movingElement, containerRect);
        const movingCenterX = movingRect.left + movingRect.width / 2;
        const movingCenterY = movingRect.top + movingRect.height / 2;

        // Проверяем выравнивание с другими элементами
        allElements.forEach(element => {
            if (element.id === movingElement.id || ignoreElementIds.includes(element.id)) return;

            const elementRect = calculateElementRect(element, containerRect);
            const elementCenterX = elementRect.left + elementRect.width / 2;
            const elementCenterY = elementRect.top + elementRect.height / 2;

            // Левая граница
            checkAlignment(
                movingRect.left,
                elementRect.left,
                'vertical',
                elementRect.left,
                [element.id],
                newGuides,
                verticalSnapLines,
                snapThreshold
            );

            // Правая граница
            checkAlignment(
                movingRect.right,
                elementRect.right,
                'vertical',
                elementRect.right,
                [element.id],
                newGuides,
                verticalSnapLines,
                snapThreshold
            );

            // Центр по X
            checkAlignment(
                movingCenterX,
                elementCenterX,
                'vertical',
                elementCenterX,
                [element.id],
                newGuides,
                verticalSnapLines,
                snapThreshold
            );

            // Верхняя граница
            checkAlignment(
                movingRect.top,
                elementRect.top,
                'horizontal',
                elementRect.top,
                [element.id],
                newGuides,
                horizontalSnapLines,
                snapThreshold
            );

            // Нижняя граница
            checkAlignment(
                movingRect.bottom,
                elementRect.bottom,
                'horizontal',
                elementRect.bottom,
                [element.id],
                newGuides,
                horizontalSnapLines,
                snapThreshold
            );

            // Центр по Y
            checkAlignment(
                movingCenterY,
                elementCenterY,
                'horizontal',
                elementCenterY,
                [element.id],
                newGuides,
                horizontalSnapLines,
                snapThreshold
            );
        });

        // Выравнивание с границами контейнера
        checkContainerAlignment(
            movingRect,
            containerRect,
            newGuides,
            verticalSnapLines,
            horizontalSnapLines,
            snapThreshold
        );

        // Выравнивание с сеткой (если включена)
        checkGridAlignment(
            movingRect,
            containerRect,
            newGuides,
            verticalSnapLines,
            horizontalSnapLines,
            10 // grid size
        );

        // Применяем привязку к ближайшей направляющей
        const snappedPosition = applySnapping(
            { x: movingElement.position.x, y: movingElement.position.y },
            newGuides,
            snapThreshold
        );

        guidesRef.current = newGuides;
        snapLinesRef.current = {
            vertical: verticalSnapLines,
            horizontal: horizontalSnapLines
        };

        return {
            guides: newGuides,
            snappedPosition,
            snapLines: snapLinesRef.current
        };
    }, [enabled, snapThreshold]);

    // Функция проверки выравнивания между двумя точками
    const checkAlignment = (
        movingPos: number,
        targetPos: number,
        type: 'vertical' | 'horizontal',
        snapPosition: number,
        elementIds: string[],
        guides: AlignmentGuide[],
        snapLines: number[],
        threshold: number
    ) => {
        const distance = Math.abs(movingPos - targetPos);

        if (distance <= threshold) {
            const strength = calculateStrength(distance, threshold);

            guides.push({
                type,
                position: snapPosition,
                elementIds: elementIds,
                strength
            });

            if (!snapLines.includes(snapPosition)) {
                snapLines.push(snapPosition);
            }
        }
    };

    // Выравнивание с границами контейнера
    const checkContainerAlignment = (
        movingRect: DOMRect,
        containerRect: DOMRect,
        guides: AlignmentGuide[],
        verticalSnapLines: number[],
        horizontalSnapLines: number[],
        threshold: number
    ) => {
        // Левая граница контейнера
        if (Math.abs(movingRect.left) <= threshold) {
            guides.push({
                type: 'vertical',
                position: 0,
                elementIds: ['container'],
                strength: 'strong'
            });
            verticalSnapLines.push(0);
        }

        // Правая граница контейнера
        if (Math.abs(movingRect.right - containerRect.width) <= threshold) {
            guides.push({
                type: 'vertical',
                position: containerRect.width,
                elementIds: ['container'],
                strength: 'strong'
            });
            verticalSnapLines.push(containerRect.width);
        }

        // Верхняя граница контейнера
        if (Math.abs(movingRect.top) <= threshold) {
            guides.push({
                type: 'horizontal',
                position: 0,
                elementIds: ['container'],
                strength: 'strong'
            });
            horizontalSnapLines.push(0);
        }

        // Нижняя граница контейнера
        if (Math.abs(movingRect.bottom - containerRect.height) <= threshold) {
            guides.push({
                type: 'horizontal',
                position: containerRect.height,
                elementIds: ['container'],
                strength: 'strong'
            });
            horizontalSnapLines.push(containerRect.height);
        }

        // Центр контейнера по X
        if (Math.abs(movingRect.left + movingRect.width / 2 - containerRect.width / 2) <= threshold) {
            guides.push({
                type: 'vertical',
                position: containerRect.width / 2,
                elementIds: ['container'],
                strength: 'medium'
            });
            verticalSnapLines.push(containerRect.width / 2);
        }

        // Центр контейнера по Y
        if (Math.abs(movingRect.top + movingRect.height / 2 - containerRect.height / 2) <= threshold) {
            guides.push({
                type: 'horizontal',
                position: containerRect.height / 2,
                elementIds: ['container'],
                strength: 'medium'
            });
            horizontalSnapLines.push(containerRect.height / 2);
        }
    };

    // Выравнивание с сеткой
    const checkGridAlignment = (
        movingRect: DOMRect,
        containerRect: DOMRect,
        guides: AlignmentGuide[],
        verticalSnapLines: number[],
        horizontalSnapLines: number[],
        gridSize: number
    ) => {
        // Выравнивание по сетке для X
        const gridX = Math.round(movingRect.left / gridSize) * gridSize;
        if (Math.abs(movingRect.left - gridX) <= snapThreshold) {
            guides.push({
                type: 'vertical',
                position: gridX,
                elementIds: ['grid'],
                strength: 'weak'
            });
            verticalSnapLines.push(gridX);
        }

        // Выравнивание по сетке для Y
        const gridY = Math.round(movingRect.top / gridSize) * gridSize;
        if (Math.abs(movingRect.top - gridY) <= snapThreshold) {
            guides.push({
                type: 'horizontal',
                position: gridY,
                elementIds: ['grid'],
                strength: 'weak'
            });
            horizontalSnapLines.push(gridY);
        }
    };

    // Применение привязки к позиции
    const applySnapping = (
        position: { x: number; y: number },
        guides: AlignmentGuide[],
        threshold: number
    ): { x: number; y: number } => {
        let snappedX = position.x;
        let snappedY = position.y;

        const verticalGuides = guides.filter(g => g.type === 'vertical');
        const horizontalGuides = guides.filter(g => g.type === 'horizontal');

        // Привязка по X
        for (const guide of verticalGuides) {
            if (Math.abs(position.x - guide.position) <= threshold) {
                snappedX = guide.position;
                break;
            }
        }

        // Привязка по Y
        for (const guide of horizontalGuides) {
            if (Math.abs(position.y - guide.position) <= threshold) {
                snappedY = guide.position;
                break;
            }
        }

        return { x: snappedX, y: snappedY };
    };

    // Расчет силы привязки на основе расстояния
    const calculateStrength = (distance: number, threshold: number): 'weak' | 'medium' | 'strong' => {
        const ratio = distance / threshold;
        if (ratio < 0.3) return 'strong';
        if (ratio < 0.7) return 'medium';
        return 'weak';
    };

    // Расчет реальных координат элемента относительно контейнера
    const calculateElementRect = (element: BuilderElement, containerRect: DOMRect): DOMRect => {
        const width = typeof element.position.width === 'number'
            ? element.position.width
            : parseFloat(element.position.width as string);

        const height = typeof element.position.height === 'number'
            ? element.position.height
            : parseFloat(element.position.height as string);

        return new DOMRect(
            element.position.x,
            element.position.y,
            width,
            height
        );
    };

    // Очистка направляющих
    const clearGuides = useCallback(() => {
        setGuides([]);
        setSnapLines({ vertical: [], horizontal: [] });
        guidesRef.current = [];
        snapLinesRef.current = { vertical: [], horizontal: [] };
    }, []);

    // Обновление видимых направляющих
    const updateVisibleGuides = useCallback((newGuides: AlignmentGuide[]) => {
        setGuides(newGuides);
    }, []);

    // Получение текущих направляющих
    const getCurrentGuides = useCallback((): AlignmentGuide[] => {
        return guidesRef.current;
    }, []);

    // Получение текущих линий привязки
    const getCurrentSnapLines = useCallback((): SnapLines => {
        return snapLinesRef.current;
    }, []);

    return {
        guides,
        snapLines,
        calculateGuides,
        clearGuides,
        updateVisibleGuides,
        getCurrentGuides,
        getCurrentSnapLines
    };
};

// Вспомогательная функция для использования вне компонентов
export const calculateElementDistance = (
    element1: BuilderElement,
    element2: BuilderElement,
    containerRect: DOMRect
): { horizontal: number; vertical: number } => {
    const rect1 = new DOMRect(
        element1.position.x,
        element1.position.y,
        typeof element1.position.width === 'number' ? element1.position.width : parseFloat(element1.position.width as string),
        typeof element1.position.height === 'number' ? element1.position.height : parseFloat(element1.position.height as string)
    );

    const rect2 = new DOMRect(
        element2.position.x,
        element2.position.y,
        typeof element2.position.width === 'number' ? element2.position.width : parseFloat(element2.position.width as string),
        typeof element2.position.height === 'number' ? element2.position.height : parseFloat(element2.position.height as string)
    );

    return {
        horizontal: Math.abs(rect1.left - rect2.left),
        vertical: Math.abs(rect1.top - rect2.top)
    };
};

// Хук для управления состоянием привязки
export const useSnapManager = () => {
    const [isSnapping, setIsSnapping] = useState(false);
    const [lastSnapPosition, setLastSnapPosition] = useState<{ x: number; y: number } | null>(null);

    const startSnapping = useCallback((position: { x: number; y: number }) => {
        setIsSnapping(true);
        setLastSnapPosition(position);
    }, []);

    const stopSnapping = useCallback(() => {
        setIsSnapping(false);
        setLastSnapPosition(null);
    }, []);

    const updateSnapPosition = useCallback((position: { x: number; y: number }) => {
        setLastSnapPosition(position);
    }, []);

    return {
        isSnapping,
        lastSnapPosition,
        startSnapping,
        stopSnapping,
        updateSnapPosition
    };
};