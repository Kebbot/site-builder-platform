import { useState, useEffect } from 'react';
import { Component } from '../types/types';
import { Guide } from '../components/Builder/AlignmentGuides';

export const useAlignmentGuides = (components: Component[], selectedComponent: Component | null) => {
    const [guides, setGuides] = useState<Guide[]>([]);

    useEffect(() => {
        if (!selectedComponent) {
            setGuides([]);
            return;
        }

        const newGuides: Guide[] = [];
        const selectedRect = document.getElementById(selectedComponent.id)?.getBoundingClientRect();

        if (!selectedRect) return;

        // Находим элементы для выравнивания
        components.forEach(comp => {
            if (comp.id === selectedComponent.id) return;

            const compRect = document.getElementById(comp.id)?.getBoundingClientRect();
            if (!compRect) return;

            // Проверяем выравнивание по верхнему краю
            if (Math.abs(compRect.top - selectedRect.top) < 5) {
                newGuides.push({
                    id: `top-${comp.id}`,
                    type: 'horizontal',
                    position: compRect.top,
                    elementIds: [comp.id]
                });
            }

            // Проверяем выравнивание по левому краю
            if (Math.abs(compRect.left - selectedRect.left) < 5) {
                newGuides.push({
                    id: `left-${comp.id}`,
                    type: 'vertical',
                    position: compRect.left,
                    elementIds: [comp.id]
                });
            }

            // Проверяем выравнивание по центру
            if (Math.abs(compRect.left + compRect.width / 2 - selectedRect.left - selectedRect.width / 2) < 5) {
                newGuides.push({
                    id: `center-${comp.id}`,
                    type: 'vertical',
                    position: compRect.left + compRect.width / 2,
                    elementIds: [comp.id]
                });
            }
        });

        setGuides(newGuides);
    }, [components, selectedComponent]);

    return guides;
};