export type Theme = 'light' | 'dark';

/** The explicitly chosen theme, or null when following the system. */
export function getStoredTheme(): Theme | null;
/** The theme currently applied. */
export function getTheme(): Theme;
export function isDark(): boolean;
/** Apply and remember a theme; pass null to forget the choice and follow the system again. */
export function setTheme(theme: Theme | null): void;
export function toggleTheme(): void;
/** Run a callback on every theme change; returns an unsubscribe function. */
export function onThemeChange(fn: (theme: Theme) => void): () => void;
/** Wire every .ds-theme-toggle, follow system changes and sync theme-color. */
export function initTheme(): void;

declare global {
  interface DocumentEventMap {
    themechange: CustomEvent<{ theme: Theme }>;
  }
}
