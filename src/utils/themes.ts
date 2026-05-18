export interface ThemePreset {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  border: string;
}

export const themePresets: Record<string, ThemePreset> = {
  default: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    background: '#ffffff',
    text: '#1f2937',
    accent: '#f59e0b',
    border: '#e5e7eb'
  },
  dark: {
    primary: '#818cf8',
    secondary: '#a78bfa',
    background: '#1f2937',
    text: '#f9fafb',
    accent: '#fbbf24',
    border: '#374151'
  },
  neon: {
    primary: '#06b6d4',
    secondary: '#ec4899',
    background: '#0f172a',
    text: '#f0f9ff',
    accent: '#fbbf24',
    border: '#334155'
  },
  forest: {
    primary: '#10b981',
    secondary: '#34d399',
    background: '#f0fdf4',
    text: '#064e3b',
    accent: '#fbbf24',
    border: '#d1fae5'
  },
  sunset: {
    primary: '#f97316',
    secondary: '#fb923c',
    background: '#fff7ed',
    text: '#7c2d12',
    accent: '#eab308',
    border: '#fed7aa'
  },
  ocean: {
    primary: '#0ea5e9',
    secondary: '#38bdf8',
    background: '#f0f9ff',
    text: '#0c4a6e',
    accent: '#06b6d4',
    border: '#bae6fd'
  }
};

export function applyTheme(element: HTMLElement, theme: string | ThemePreset): void {
  const themeColors = typeof theme === 'string' ? themePresets[theme] || themePresets.default : theme;

  element.style.setProperty('--gwc-primary', themeColors.primary);
  element.style.setProperty('--gwc-secondary', themeColors.secondary);
  element.style.setProperty('--gwc-background', themeColors.background);
  element.style.setProperty('--gwc-text', themeColors.text);
  element.style.setProperty('--gwc-accent', themeColors.accent);
  element.style.setProperty('--gwc-border', themeColors.border);
}

