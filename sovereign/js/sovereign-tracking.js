/**
 * sovereign-tracking.js
 * Anti-bot CTA activation + Evadav postback.
 *
 * BOT PROTECTION:
 *   - CTA is dead on page load (href="javascript:void(0)", pointer-events:none)
 *   - Only after JS executes + 2.5s delay, the click handler is attached
 *   - Offer URL assembled from parts at runtime (not in HTML source)
 *   - Bots that don't run JS see an inert link
 */
(function () {
  'use strict';

  // --- Obfuscated offer URL (assembled at runtime) ---
  var _p = ['https://t', '.me/', 'markr', 'aar'];
  function _offerUrl() { return _p.join(''); }

  document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(window.location.search);
    var cid = params.get('cid');

    var ctaButton = document.getElementById('cta-sovereign');
    if (!ctaButton) return;

    // CTA starts DEAD — no click handler, visually muted
    ctaButton.style.pointerEvents = 'none';
    ctaButton.style.opacity = '0.6';
    ctaButton.removeAttribute('href');
    ctaButton.setAttribute('href', 'javascript:void(0)');

    // --- Activate CTA after delay (anti-bot) ---
    setTimeout(function () {
      // Enable the button
      ctaButton.style.pointerEvents = 'auto';
      ctaButton.style.opacity = '1';
      ctaButton.style.transition = 'opacity 0.5s ease';

      ctaButton.addEventListener('click', function (e) {
        e.preventDefault();

        if (cid) {
          // Fire Evadav postback (correct format)
          fetch('https://evadav.com/phpb?goal=1&click_id=' + encodeURIComponent(cid), {
            method: 'GET',
            mode: 'no-cors',
            keepalive: true
          });
        }

        // Update button state
        ctaButton.textContent = '\u90E8\u7F72\u4E2D...';
        ctaButton.style.pointerEvents = 'none';
        ctaButton.style.opacity = '0.5';

        // Redirect after 500ms to ensure postback fires
        setTimeout(function () {
          window.location.href = _offerUrl();
        }, 500);
      });
    }, 2500); // 2.5 second anti-bot delay
  });
})();
