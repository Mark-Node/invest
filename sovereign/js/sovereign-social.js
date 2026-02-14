/**
 * sovereign-social.js
 * Shows toast notifications simulating other users joining/earning.
 */
(function () {
  'use strict';

  var container = document.getElementById('toast-container');
  if (!container) return;

  // Styling handled by Tailwind classes in HTML — no inline overrides

  var MAX_TOASTS = 3;

  var names = ['志明', '淑芬', '柏翰', '雅婷', '建宏', '美玲', '家豪', '怡君'];

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randHex(len) {
    var chars = '0123456789abcdef';
    var result = '';
    for (var i = 0; i < len; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  function formatNTD(amount) {
    return 'NT$' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  /**
   * Box-Muller transform for Gaussian-distributed jitter.
   * Returns a value centered around `mean` with given `stddev`,
   * clamped between `min` and `max`.
   */
  function gaussianRandom(mean, stddev, min, max) {
    var u1 = Math.random();
    var u2 = Math.random();
    var z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    var value = mean + z * stddev;
    if (value < min) value = min;
    if (value > max) value = max;
    return value;
  }

  function generateMessage() {
    var type = Math.random();

    if (type < 0.4) {
      var hex = randHex(4);
      var eth = (Math.random() * 2.4 + 0.1).toFixed(2);
      return '運營商 0x' + hex + ' 的節點剛剛提取了 ' + eth + ' ETH';
    } else if (type < 0.7) {
      var node = randInt(100, 999);
      return '新運營商加入！節點 #' + node + ' 已在台北上線';
    } else {
      var name = pickRandom(names);
      // Random amount between 12000 and 180000, rounded to nearest 1000
      var amount = Math.round(randInt(12, 180) * 1000);
      return '運營商 ' + name + ' 確認收到 ' + formatNTD(amount) + ' 收益';
    }
  }

  function showToast() {
    // Enforce max visible toasts — remove oldest if at limit
    while (container.children.length >= MAX_TOASTS) {
      container.removeChild(container.firstChild);
    }

    var toast = document.createElement('div');
    toast.textContent = generateMessage();

    // Toast styling
    toast.style.background = 'rgba(15, 15, 25, 0.95)';
    toast.style.color = '#e2e8f0';
    toast.style.padding = '14px 18px';
    toast.style.borderRadius = '6px';
    toast.style.borderLeft = '4px solid #3b82f6';
    toast.style.fontSize = '14px';
    toast.style.lineHeight = '1.5';
    toast.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    toast.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
    toast.style.transform = 'translateX(120%)';
    toast.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease';
    toast.style.opacity = '1';

    container.appendChild(toast);

    // Slide in from right
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.style.transform = 'translateX(0)';
      });
    });

    // Auto-dismiss after 4 seconds with fade-out
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(120%)';
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }, 4000);

    // Schedule next toast with Gaussian jitter: mean 10s, stddev 2.5s, clamped 5-15s
    var delay = gaussianRandom(10, 2.5, 5, 15) * 1000;
    setTimeout(showToast, delay);
  }

  // Start after an initial short delay
  var firstDelay = gaussianRandom(3, 1, 2, 5) * 1000;
  setTimeout(showToast, firstDelay);
})();
