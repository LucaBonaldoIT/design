import '../src/fonts.css';
import '../src/index.css';
import './docs.css';
import { initTheme, initReveal } from '../src/index.js';

var PALETTE = [
  'paper',
  'paper-soft',
  'paper-raised',
  'ink',
  'ink-deep',
  'ink-page',
  'ink-soft',
  'ink-raised',
  'cream',
  'cream-bright',
  'vermilion',
  'vermilion-deep',
  'vermilion-bright',
  'vermilion-light',
];

var ROLES = [
  'bg',
  'bg-soft',
  'surface',
  'text',
  'text-soft',
  'line',
  'line-strong',
  'accent',
  'accent-fill',
  'accent-soft',
  'ok',
  'ok-soft',
  'warn',
  'warn-soft',
  'err',
  'err-soft',
];

function swatches(id, names, prefix) {
  var host = document.getElementById(id);
  host.innerHTML = names
    .map(function (name) {
      return (
        '<li class="swatch"><span class="swatch__chip" style="background: var(--ds-' +
        name +
        ')"></span><code>' +
        prefix +
        name +
        '</code><span class="swatch__value" data-var="--ds-' +
        name +
        '"></span></li>'
      );
    })
    .join('');
}

function showValues() {
  var style = getComputedStyle(document.documentElement);
  document.querySelectorAll('[data-var]').forEach(function (el) {
    el.textContent = style.getPropertyValue(el.dataset.var).trim();
  });
}

swatches('palette', PALETTE, '--ds-');
swatches('roles', ROLES, '--ds-');

document.addEventListener('themechange', showValues);
initTheme();
initReveal();
showValues();

var dialog = document.getElementById('demo-dialog');
document.getElementById('open-dialog').addEventListener('click', function () {
  dialog.showModal();
});
