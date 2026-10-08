/**
 * Runs inline in <head>, before first paint: flags JS (html.js) and resolves the theme
 * (stored choice, else the system preference) into html[data-theme], so there is no flash.
 *
 * The choice is stored in a `theme` cookie. On *.lucabonaldo.dev it is scoped to the parent
 * domain, so one choice follows the visitor across every app.
 *
 * Inline it with the Vite plugin (`@lucabonaldo/design/vite`), or paste `themeInitScript`.
 */
function init() {
  var root = document.documentElement;
  var theme = null;
  root.classList.add('js');
  try {
    theme = (document.cookie.match(/(?:^|; )theme=(light|dark)(?:;|$)/) || [])[1];
  } catch (e) {}
  if (theme !== 'light' && theme !== 'dark') {
    theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  root.dataset.theme = theme;
}

export var themeInitScript = '(' + init.toString() + ')();';
