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
      var eth = (Math.random() * 2.4 + 0.1).toFixed(4);
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

    // Toast styling via Tailwind classes (no inline styles to avoid clashes)
    toast.className = 'bg-slate-950/95 text-slate-200 px-4 py-3.5 rounded-md border-l-4 border-blue-500 text-sm leading-relaxed font-sans shadow-xl shadow-black/40 translate-x-[120%] transition-all duration-400 ease-out opacity-100';

    container.appendChild(toast);

    // Slide in from right
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.remove('translate-x-[120%]');
        toast.classList.add('translate-x-0');
      });
    });

    // Auto-dismiss after 4 seconds with fade-out
    setTimeout(function () {
      toast.classList.add('opacity-0', 'translate-x-[120%]');
      toast.classList.remove('translate-x-0');
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
