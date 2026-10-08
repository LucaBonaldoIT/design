/**
 * Entrance reveals for .ds-reveal elements (styles in components/motion.css).
 * With reduced motion or no IntersectionObserver, everything is shown at once.
 */
export function initReveal(selector) {
  var targets = document.querySelectorAll(selector || '.ds-reveal');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (reduced.matches || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) {
      el.classList.add('is-in');
    });
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
  );

  targets.forEach(function (el) {
    io.observe(el);
  });
}
