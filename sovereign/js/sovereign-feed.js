/**
 * sovereign-feed.js
 * Simulates live node capture events in the #node-feed container.
 */
(function () {
  'use strict';

  var feed = document.getElementById('node-feed');
  if (!feed) return;

  // Styling handled by .terminal-feed class in HTML/CSS — no inline overrides

  var MAX_LINES = 20;

  var cities = ['台北', '新竹', '台中', '高雄', '台南', '桃園', '基隆', '花蓮'];

  function pad(n) {
    return n < 10 ? '0' + n : '' + n;
  }

  function timestamp() {
    var now = new Date();
    return pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randFloat(min, max, decimals) {
    return (Math.random() * (max - min) + min).toFixed(decimals);
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function generateLine() {
    var ts = timestamp();
    var type = Math.random();
    var node = randInt(100, 999);

    if (type < 0.45) {
      var city = pickRandom(cities);
      var eth = randFloat(0.1, 2.5, 4);
      return '[' + ts + '] Node #' + node + ' (' + city + ') captured ' + eth + ' ETH in MEV';
    } else if (type < 0.80) {
      var city2 = pickRandom(cities);
      var latency = randFloat(0.28, 0.45, 2);
      return '[' + ts + '] Node #' + node + ' (' + city2 + ') latency: ' + latency + 's \u2014 target acquired';
    } else {
      var operators = randInt(120, 487);
      return '[' + ts + '] Sovereign Network: ' + operators + ' active operators';
    }
  }

  function addLine() {
    var line = document.createElement('div');
    line.textContent = generateLine();
    feed.appendChild(line);

    // Remove oldest lines beyond MAX_LINES
    while (feed.children.length > MAX_LINES) {
      feed.removeChild(feed.firstChild);
    }

    // Auto-scroll to bottom
    feed.scrollTop = feed.scrollHeight;

    // Schedule next line: random 2-4 seconds
    var delay = randInt(2000, 4000);
    setTimeout(addLine, delay);
  }

  // Seed with a few initial lines
  for (var i = 0; i < 5; i++) {
    var seedLine = document.createElement('div');
    seedLine.textContent = generateLine();
    feed.appendChild(seedLine);
  }
  feed.scrollTop = feed.scrollHeight;

  // Start the feed loop
  var initialDelay = randInt(2000, 4000);
  setTimeout(addLine, initialDelay);
})();
