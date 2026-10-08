import { themeInitScript } from './theme-init.js';

/**
 * Vite plugin: inlines the theme init script at the top of <head>, so every app resolves the
 * theme before first paint with the same code.
 *
 *   import { designSystem } from '@lucabonaldo/design/vite';
 *   export default { plugins: [designSystem()] };
 */
export function designSystem() {
  return {
    name: 'lucabonaldo-design',
    transformIndexHtml: {
      order: 'pre',
      handler() {
        return [{ tag: 'script', children: themeInitScript, injectTo: 'head-prepend' }];
      },
    },
  };
}
