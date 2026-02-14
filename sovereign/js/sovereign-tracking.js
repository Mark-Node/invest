/**
 * sovereign-tracking.js
 * Captures Evadav click ID and fires postback on CTA click.
 */
(function () {
  'use strict';

  var OFFER_URL = 'https://offer-url.com';

  document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(window.location.search);
    var cid = params.get('cid');

    var ctaButton = document.getElementById('cta-sovereign');
    if (!ctaButton) return;

    ctaButton.addEventListener('click', function (e) {
      e.preventDefault();

      if (cid) {
        // Fire Evadav postback
        fetch('https://ad.evadav.com/click?cid=' + encodeURIComponent(cid) + '&action=lead', {
          method: 'GET',
          mode: 'no-cors',
          keepalive: true
        });

        // Update button state
        ctaButton.textContent = '部署中...';
        ctaButton.disabled = true;
        ctaButton.style.opacity = '0.7';
        ctaButton.style.cursor = 'not-allowed';

        // Redirect after 500ms
        setTimeout(function () {
          window.location.href = OFFER_URL;
        }, 500);
      } else {
        // No cid — redirect immediately
        window.location.href = OFFER_URL;
      }
    });
  });
})();
