/**
 * Light/dark theme controller.
 *
 * Pairs with the inline init script (theme-init.js), which sets html[data-theme] before first
 * paint. This wires toggles, persists an explicit choice in a `theme` cookie (shared across
 * *.lucabonaldo.dev), keeps following the system until a choice is made, and keeps
 * <meta name="theme-color"> in step with --ds-bg.
 *
 * A 'themechange' event ({ detail: { theme } }) is dispatched on document on every change.
 */

var KEY = 'theme';
var SHARED_DOMAIN = 'lucabonaldo.dev';
var YEAR = 60 * 60 * 24 * 365;

var MOON =
  '<svg class="ds-theme-toggle__moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/></svg>';
var SUN =
  '<svg class="ds-theme-toggle__sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/></svg>';

var root = document.documentElement;
var system = window.matchMedia('(prefers-color-scheme: dark)');
var started = false;

function cookieDomain() {
  var host = location.hostname;
  return host === SHARED_DOMAIN || host.endsWith('.' + SHARED_DOMAIN) ? SHARED_DOMAIN : null;
}

/** The explicitly chosen theme, or null when following the system. */
export function getStoredTheme() {
  try {
    var match = document.cookie.match(/(?:^|; )theme=(light|dark)(?:;|$)/);
    return match ? match[1] : null;
  } catch (err) {
    return null;
  }
}

function store(theme) {
  var parts = [KEY + '=' + theme, 'path=/', 'max-age=' + YEAR, 'SameSite=Lax'];
  var domain = cookieDomain();
  if (domain) {
    parts.push('domain=' + domain);
  }
  if (location.protocol === 'https:') {
    parts.push('Secure');
  }
  try {
    document.cookie = parts.join('; ');
  } catch (err) {
    // cookies unavailable: the choice just won't persist
  }
}

/** The theme currently applied. */
export function getTheme() {
  if (root.dataset.theme === 'dark' || root.dataset.theme === 'light') {
    return root.dataset.theme;
  }
  return system.matches ? 'dark' : 'light';
}

export function isDark() {
  return getTheme() === 'dark';
}

function apply(theme) {
  root.dataset.theme = theme;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    var bg = getComputedStyle(root).getPropertyValue('--ds-bg').trim();
    if (bg) {
      meta.content = bg;
    }
  }
  document.querySelectorAll('.ds-theme-toggle').forEach(function (button) {
    button.setAttribute('aria-pressed', String(theme === 'dark'));
  });
  document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
}

/** Apply and remember a theme; pass null to forget the choice and follow the system again. */
export function setTheme(theme) {
  if (theme === null) {
    try {
      document.cookie =
        KEY + '=; path=/; max-age=0' + (cookieDomain() ? '; domain=' + cookieDomain() : '');
    } catch (err) {}
    apply(system.matches ? 'dark' : 'light');
    return;
  }
  store(theme);
  apply(theme);
}

export function toggleTheme() {
  setTheme(isDark() ? 'light' : 'dark');
}

/** Run a callback on every theme change; returns an unsubscribe function. */
export function onThemeChange(fn) {
  function handler(e) {
    fn(e.detail.theme);
  }
  document.addEventListener('themechange', handler);
  return function () {
    document.removeEventListener('themechange', handler);
  };
}

/**
 * Wire every .ds-theme-toggle button (empty ones get the sun/moon icons), follow system
 * changes until the visitor chooses, and sync theme-color. Safe to call more than once.
 */
export function initTheme() {
  document.querySelectorAll('.ds-theme-toggle').forEach(function (button) {
    if (button.dataset.dsTheme) {
      return;
    }
    button.dataset.dsTheme = '1';
    if (!button.children.length) {
      button.innerHTML = MOON + SUN;
    }
    if (!button.hasAttribute('aria-label')) {
      button.setAttribute('aria-label', 'Dark theme');
    }
    button.addEventListener('click', toggleTheme);
  });

  if (!started) {
    started = true;
    system.addEventListener('change', function (e) {
      if (!getStoredTheme()) {
        apply(e.matches ? 'dark' : 'light');
      }
    });
  }

  apply(getTheme());
}
