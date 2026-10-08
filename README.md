# Paper & ink

`@lucabonaldo/design`: the design system shared by [lucabonaldo.dev](https://lucabonaldo.dev),
Flaplab, FumbleChess and Prologez. Warm paper, ink type, one vermilion accent; light and dark.

Plain CSS plus a little JavaScript. No framework and no build step: Vite bundles the CSS and
fonts straight from `node_modules`.

```sh
npm run dev      # specimen page with every token and component, at docs/
```

## Install

Depend on a tagged release:

```json
"dependencies": {
  "@lucabonaldo/design": "github:LucaBonaldoIT/design#v0.1.0"
}
```

While iterating on both at once, `npm link @lucabonaldo/design` from the app.

## Use

```js
// vite.config.js: inlines the theme init script into <head>, so there is no theme flash
import { designSystem } from '@lucabonaldo/design/vite';
export default { plugins: [designSystem()] };
```

```js
// main.js
import '@lucabonaldo/design/fonts.css'; // optional: self-hosted Fraunces + Inter
import '@lucabonaldo/design/index.css'; // tokens + base + components
import { initTheme } from '@lucabonaldo/design';

initTheme();
```

```html
<meta name="theme-color" content="#f5f2ea" />
…
<button class="ds-theme-toggle" type="button"></button>
```

An empty `.ds-theme-toggle` gets its sun/moon icons from `initTheme()`.

### Entry points

| Import                        | What                                                      |
| ----------------------------- | --------------------------------------------------------- |
| `index.css`                   | `tokens.css` + `base.css` + `components.css`              |
| `tokens.css`                  | custom properties only, light and dark                    |
| `base.css`                    | element defaults: box sizing, body, headings, focus, …    |
| `components.css`              | `.ds-*` classes                                           |
| `fonts.css`                   | Fraunces (display) and Inter (text), self-hosted          |
| `@lucabonaldo/design`         | `initTheme`, `setTheme`, `onThemeChange`, `initReveal`, … |
| `@lucabonaldo/design/vite`    | `designSystem()` Vite plugin                              |
| `@lucabonaldo/design/brand/*` | favicon frame and the lucabonaldo.dev icon                |

An app with its own reset can skip `base.css` and import `tokens.css` and `components.css`.

## Rules of the system

- **Everything lives in the `ds` cascade layer.** Unlayered app CSS always wins, whatever its
  specificity, so adopting the package never breaks existing styles.
- **Everything is prefixed.** Custom properties are `--ds-*` and classes are `.ds-*`, so nothing
  collides with an app's own `--accent` or `.button`.
- **Components only use role tokens.** Palette tokens (`--ds-paper`, `--ds-vermilion`, …) are the
  fixed brand colors. Role tokens (`--ds-bg`, `--ds-text`, `--ds-accent`, …) are what themes and
  `.ds-inverse` reassign. Use the roles in app CSS too.
- **Two accents.** `--ds-accent` is for text, icons and rules on the page background (lighter in
  dark mode, for contrast). `--ds-accent-fill` is for filled shapes, always paired with
  `--ds-on-accent`.

## Tokens

| Role                                           | Light                 | Dark                  |
| ---------------------------------------------- | --------------------- | --------------------- |
| `--ds-bg` / `--ds-bg-soft`                     | paper `#f5f2ea`       | ink `#1c1915`         |
| `--ds-surface`                                 | `#fbf9f4`             | `#29241e`             |
| `--ds-text` / `--ds-text-soft`                 | ink `#1a1712` / 64%   | cream `#f0ecdf` / 64% |
| `--ds-line` / `--ds-line-strong`               | ink at 18% / 34%      | cream at 16% / 30%    |
| `--ds-accent`                                  | `#b02e0c`             | `#ec6a45`             |
| `--ds-accent-fill` + `--ds-on-accent`          | `#b02e0c` + `#fff7f0` | same                  |
| `--ds-ok`, `--ds-warn`, `--ds-err` (+ `-soft`) | status colors         | status colors         |

Also: `--ds-font-display | text | mono`, `--ds-text-xs … base`, `--ds-max`, `--ds-gutter`,
`--ds-header-h`, `--ds-radius(-lg)`, `--ds-ease-out`, `--ds-dur(-fast)`, `--ds-shadow`.

## Components

| Class                                                                | Notes                                           |
| -------------------------------------------------------------------- | ----------------------------------------------- |
| `.ds-accent`, `.ds-overline`, `.ds-text-link`                        | typographic helpers                             |
| `.ds-sr-only`, `.ds-skip-link`                                       | accessibility                                   |
| `.ds-button` `--primary` `--quiet` `--small` `--icon`                | on `<button>` or `<a>`                          |
| `.ds-field`, `.ds-label`, `.ds-hint`, `.ds-input`, `.ds-check`       | `.ds-input` works on input, select and textarea |
| `.ds-panel` `--raised`, `.ds-rule`, `.ds-tag` `--accent`             | surfaces                                        |
| `.ds-notice` `--ok` `--warn` `--err`                                 | inline status messages                          |
| `.ds-dialog` (`__title`, `__actions`)                                | for the native `<dialog>`                       |
| `.ds-header` `--wide`, `.ds-wordmark`, `.ds-nav`, `.ds-theme-toggle` | sticky site header                              |
| `.ds-footer`, `.ds-credit`                                           | footer line and the "Made by Luca Bonaldo" link |
| `.ds-inverse`                                                        | ink block on the page; everything inside adapts |
| `.ds-reveal` + `initReveal()`                                        | entrance animation, off with reduced motion     |

## Theme

`html[data-theme]` is the single source of truth. The init script sets it before first paint,
from a stored choice or the system preference. `initTheme()` then:

- wires every `.ds-theme-toggle` (with `aria-pressed`),
- keeps following the system until the visitor makes a choice,
- stores a choice in a `theme` cookie scoped to `.lucabonaldo.dev`, so it follows the visitor
  across every app,
- keeps `<meta name="theme-color">` in step with `--ds-bg`,
- dispatches `themechange` on `document` (or use `onThemeChange(fn)`), e.g. to recolor a canvas.

Without JavaScript, the CSS follows `prefers-color-scheme` and toggles stay hidden.

## Releasing

Semver. Renaming or removing a token or class is a major version bump. Update `CHANGELOG.md`,
bump `version`, tag `vX.Y.Z` and push the tag; apps then bump the tag in their `package.json`.
