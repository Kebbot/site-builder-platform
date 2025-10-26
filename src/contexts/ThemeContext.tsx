import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types/types';

// Стандартная светлая тема
const defaultLightTheme: Theme = {
    id: 'light',
    name: 'Light Theme',
    colors: {
        primary: '#3b82f6',
        secondary: '#6b7280',
        accent: '#8b5cf6',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        error: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981',
        info: '#06b6d4'
    },
    typography: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem'
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        }
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
    },
    borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        full: '9999px'
    }
};

// Темная тема
const defaultDarkTheme: Theme = {
    id: 'dark',
    name: 'Dark Theme',
    colors: {
        primary: '#60a5fa',
        secondary: '#9ca3af',
        accent: '#a78bfa',
        background: '#111827',
        surface: '#1f2937',
        text: '#f9fafb',
        textSecondary: '#d1d5db',
        border: '#374151',
        error: '#f87171',
        warning: '#fbbf24',
        success: '#34d399',
        info: '#22d3ee'
    },
    typography: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: {
            xs: '0.75rem',
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem',
            '2xl': '1.5rem',
            '3xl': '1.875rem'
        },
        fontWeight: {
            light: 300,
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        }
    },
    spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem'
    },
    borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        full: '9999px'
    }
};

// Предопределенные темы
const predefinedThemes: Theme[] = [
    defaultLightTheme,
    defaultDarkTheme,
    {
        id: 'blue',
        name: 'Ocean Blue',
        colors: {
            primary: '#0066cc',
            secondary: '#66aaff',
            accent: '#0099ff',
            background: '#f0f8ff',
            surface: '#e6f3ff',
            text: '#003366',
            textSecondary: '#336699',
            border: '#99ccff',
            error: '#ff3333',
            warning: '#ff9900',
            success: '#00cc66',
            info: '#00aaff'
        },
        typography: defaultLightTheme.typography,
        spacing: defaultLightTheme.spacing,
        borderRadius: defaultLightTheme.borderRadius
    },
    {
        id: 'green',
        name: 'Forest Green',
        colors: {
            primary: '#059669',
            secondary: '#10b981',
            accent: '#34d399',
            background: '#f0fdf4',
            surface: '#dcfce7',
            text: '#052e16',
            textSecondary: '#166534',
            border: '#bbf7d0',
            error: '#ef4444',
            warning: '#f59e0b',
            success: '#22c55e',
            info: '#06b6d4'
        },
        typography: defaultLightTheme.typography,
        spacing: defaultLightTheme.spacing,
        borderRadius: defaultLightTheme.borderRadius
    },
    {
        id: 'purple',
        name: 'Royal Purple',
        colors: {
            primary: '#7c3aed',
            secondary: '#a78bfa',
            accent: '#c4b5fd',
            background: '#faf5ff',
            surface: '#f3e8ff',
            text: '#581c87',
            textSecondary: '#7e22ce',
            border: '#d8b4fe',
            error: '#ef4444',
            warning: '#f59e0b',
            success: '#10b981',
            info: '#06b6d4'
        },
        typography: defaultLightTheme.typography,
        spacing: defaultLightTheme.spacing,
        borderRadius: defaultLightTheme.borderRadius
    }
];

interface ThemeContextType {
    // Текущая тема
    theme: Theme;
    themeMode: 'light' | 'dark' | 'system' | string;

    // Доступные темы
    availableThemes: Theme[];
    predefinedThemes: Theme[];
    customThemes: Theme[];

    // Действия
    setTheme: (themeId: string) => void;
    setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
    createCustomTheme: (theme: Omit<Theme, 'id'>) => string;
    updateCustomTheme: (themeId: string, updates: Partial<Theme>) => void;
    deleteCustomTheme: (themeId: string) => void;
    resetToDefault: () => void;

    // Утилиты
    getColor: (colorPath: string) => string;
    getSpacing: (size: keyof Theme['spacing']) => string;
    getBorderRadius: (size: keyof Theme['borderRadius']) => string;
    getFontSize: (size: keyof Theme['typography']['fontSize']) => string;
    getFontWeight: (weight: keyof Theme['typography']['fontWeight']) => number;

    // CSS переменные
    cssVariables: Record<string, string>;

    // Состояние
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme = 'system'
}) => {
    const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system' | string>(defaultTheme);
    const [customThemes, setCustomThemes] = useState<Theme[]>([]);
    const [systemPreference, setSystemPreference] = useState<'light' | 'dark'>('light');

    // Определяем системные предпочтения
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const updateSystemPreference = () => {
            setSystemPreference(mediaQuery.matches ? 'dark' : 'light');
        };

        updateSystemPreference();

        const handleChange = (e: MediaQueryListEvent) => {
            updateSystemPreference();
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Вычисляем активную тему
    const getActiveTheme = (): Theme => {
        // Если выбран системный режим
        if (themeMode === 'system') {
            return systemPreference === 'dark' ? defaultDarkTheme : defaultLightTheme;
        }

        // Если выбраны встроенные светлая/темная темы
        if (themeMode === 'dark') return defaultDarkTheme;
        if (themeMode === 'light') return defaultLightTheme;

        // Ищем тему по ID среди предопределенных
        const predefined = predefinedThemes.find(t => t.id === themeMode);
        if (predefined) return predefined;

        // Ищем среди пользовательских тем
        const custom = customThemes.find(t => t.id === themeMode);
        if (custom) return custom;

        // Fallback на светлую тему
        return defaultLightTheme;
    };

    const activeTheme = getActiveTheme();
    const isDark = activeTheme.id === 'dark' || (themeMode === 'system' && systemPreference === 'dark');

    // Генерируем CSS переменные
    const cssVariables = React.useMemo(() => {
        const vars: Record<string, string> = {};

        // Цвета
        Object.entries(activeTheme.colors).forEach(([key, value]) => {
            vars[`--color-${key}`] = value;
        });

        // Типография
        Object.entries(activeTheme.typography.fontSize).forEach(([key, value]) => {
            vars[`--font-size-${key}`] = value;
        });

        Object.entries(activeTheme.typography.fontWeight).forEach(([key, value]) => {
            vars[`--font-weight-${key}`] = value.toString();
        });

        vars['--font-family'] = activeTheme.typography.fontFamily;

        // Отступы
        Object.entries(activeTheme.spacing).forEach(([key, value]) => {
            vars[`--spacing-${key}`] = value;
        });

        // Радиусы скругления
        Object.entries(activeTheme.borderRadius).forEach(([key, value]) => {
            vars[`--border-radius-${key}`] = value;
        });

        return vars;
    }, [activeTheme]);

    // Действия
    const setTheme = (themeId: string) => {
        setThemeMode(themeId);
        localStorage.setItem('builder-theme', themeId);
    };

    const setThemeModeWrapper = (mode: 'light' | 'dark' | 'system') => {
        setThemeMode(mode);
        localStorage.setItem('builder-theme-mode', mode);
    };

    const createCustomTheme = (themeData: Omit<Theme, 'id'>): string => {
        const newTheme: Theme = {
            ...themeData,
            id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        setCustomThemes(prev => [...prev, newTheme]);

        // Переключаемся на новую тему
        setTheme(newTheme.id);

        return newTheme.id;
    };

    const updateCustomTheme = (themeId: string, updates: Partial<Theme>) => {
        setCustomThemes(prev =>
            prev.map(theme =>
                theme.id === themeId ? { ...theme, ...updates } : theme
            )
        );

        // Если обновляем текущую тему, форсируем ре-рендер
        if (themeMode === themeId) {
            setTheme(themeId);
        }
    };

    const deleteCustomTheme = (themeId: string) => {
        setCustomThemes(prev => prev.filter(theme => theme.id !== themeId));

        // Если удаляем текущую тему, переключаемся на системную
        if (themeMode === themeId) {
            setThemeModeWrapper('system');
        }
    };

    const resetToDefault = () => {
        setCustomThemes([]);
        setThemeModeWrapper('system');
        localStorage.removeItem('builder-custom-themes');
    };

    // Утилиты для доступа к значениям темы
    const getColor = (colorPath: string): string => {
        const path = colorPath.split('.');
        let value: any = activeTheme.colors;

        for (const key of path) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                console.warn(`Color path '${colorPath}' not found in theme`);
                return '#000000';
            }
        }

        return value;
    };

    const getSpacing = (size: keyof Theme['spacing']): string => {
        return activeTheme.spacing[size] || '1rem';
    };

    const getBorderRadius = (size: keyof Theme['borderRadius']): string => {
        return activeTheme.borderRadius[size] || '0.25rem';
    };

    const getFontSize = (size: keyof Theme['typography']['fontSize']): string => {
        return activeTheme.typography.fontSize[size] || '1rem';
    };

    const getFontWeight = (weight: keyof Theme['typography']['fontWeight']): number => {
        return activeTheme.typography.fontWeight[weight] || 400;
    };

    // Восстанавливаем тему из localStorage при загрузке
    useEffect(() => {
        const savedTheme = localStorage.getItem('builder-theme');
        const savedThemeMode = localStorage.getItem('builder-theme-mode') as 'light' | 'dark' | 'system';
        const savedCustomThemes = localStorage.getItem('builder-custom-themes');

        if (savedTheme) {
            setThemeMode(savedTheme);
        } else if (savedThemeMode) {
            setThemeMode(savedThemeMode);
        }

        if (savedCustomThemes) {
            try {
                const parsedThemes = JSON.parse(savedCustomThemes);
                if (Array.isArray(parsedThemes)) {
                    setCustomThemes(parsedThemes);
                }
            } catch (error) {
                console.warn('Failed to parse custom themes from localStorage:', error);
            }
        }
    }, []);

    // Сохраняем пользовательские темы в localStorage при изменении
    useEffect(() => {
        localStorage.setItem('builder-custom-themes', JSON.stringify(customThemes));
    }, [customThemes]);

    // Применяем CSS переменные к документу
    useEffect(() => {
        const root = document.documentElement;

        // Устанавливаем все CSS переменные
        Object.entries(cssVariables).forEach(([key, value]) => {
            root.style.setProperty(key, value);
        });

        // Добавляем класс для темной темы
        if (isDark) {
            document.body.classList.add('theme-dark');
            document.body.classList.remove('theme-light');
        } else {
            document.body.classList.add('theme-light');
            document.body.classList.remove('theme-dark');
        }

        return () => {
            // Очищаем CSS переменные при размонтировании
            Object.keys(cssVariables).forEach(key => {
                root.style.removeProperty(key);
            });
        };
    }, [cssVariables, isDark]);

    const value: ThemeContextType = {
        theme: activeTheme,
        themeMode,
        availableThemes: [...predefinedThemes, ...customThemes],
        predefinedThemes,
        customThemes,
        setTheme,
        setThemeMode: setThemeModeWrapper,
        createCustomTheme,
        updateCustomTheme,
        deleteCustomTheme,
        resetToDefault,
        getColor,
        getSpacing,
        getBorderRadius,
        getFontSize,
        getFontWeight,
        cssVariables,
        isDark
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Хук для использования темы
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Вспомогательные хуки для конкретных значений
export const useThemeColor = () => {
    const theme = useTheme();
    return theme.getColor;
};

export const useThemeSpacing = () => {
    const theme = useTheme();
    return theme.getSpacing;
};

export const useThemeBorderRadius = () => {
    const theme = useTheme();
    return theme.getBorderRadius;
};

export const useThemeTypography = () => {
    const theme = useTheme();
    return {
        getFontSize: theme.getFontSize,
        getFontWeight: theme.getFontWeight,
        fontFamily: theme.theme.typography.fontFamily
    };
};

// ХОК для инжекта темы в компоненты (для классовых компонентов)
export const withTheme = <P extends object>(
    Component: React.ComponentType<P & { theme: ThemeContextType }>
): React.FC<P> => {
    const ThemedComponent: React.FC<P> = (props) => {
        const theme = useTheme();
        return <Component {...props} theme={theme} />;
    };

    ThemedComponent.displayName = `WithTheme(${Component.displayName || Component.name})`;
    return ThemedComponent;
};

// Утилита для применения стилей темы к элементу
export const applyThemeStyles = (styles: Record<string, any>, theme: ThemeContextType): Record<string, any> => {
    const themedStyles = { ...styles };

    // Функция для замены токенов темы
    const replaceThemeTokens = (value: string): string => {
        if (typeof value !== 'string') return value;

        // Заменяем токены цвета (theme.colors.primary -> реальное значение)
        if (value.startsWith('theme.colors.')) {
            const colorPath = value.replace('theme.colors.', '');
            return theme.getColor(colorPath);
        }

        // Заменяем токены отступов (theme.spacing.md -> реальное значение)
        if (value.startsWith('theme.spacing.')) {
            const spacingSize = value.replace('theme.spacing.', '') as keyof Theme['spacing'];
            return theme.getSpacing(spacingSize);
        }

        // Заменяем токены радиусов (theme.borderRadius.lg -> реальное значение)
        if (value.startsWith('theme.borderRadius.')) {
            const radiusSize = value.replace('theme.borderRadius.', '') as keyof Theme['borderRadius'];
            return theme.getBorderRadius(radiusSize);
        }

        return value;
    };

    // Рекурсивно обрабатываем все свойства стилей
    Object.keys(themedStyles).forEach(key => {
        const value = themedStyles[key];

        if (typeof value === 'string') {
            themedStyles[key] = replaceThemeTokens(value);
        } else if (Array.isArray(value)) {
            themedStyles[key] = value.map(item =>
                typeof item === 'string' ? replaceThemeTokens(item) : item
            );
        } else if (typeof value === 'object' && value !== null) {
            themedStyles[key] = applyThemeStyles(value, theme);
        }
    });

    return themedStyles;
};

// Утилита для создания стилизованного компонента с темой
export const createThemedStyle = (styleFn: (theme: ThemeContextType) => Record<string, any>) => {
    return () => {
        const theme = useTheme();
        return styleFn(theme);
    };
};

export default ThemeContext;