// ── Year
document.getElementById('year').textContent = new Date().getFullYear();

// ── Network packet rain background
(function () {
  var canvas = document.getElementById('binary-canvas');
  var ctx    = canvas.getContext('2d');
  var cols, drops, colStrings;
  var fontSize = 12;
  var colWidth = 160;
  var SPEED    = 0.4;
  var TAIL_LEN = 10;

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function randIP() {
    var pools = [
      '10.'      + randInt(0,255) + '.' + randInt(0,255) + '.' + randInt(1,254),
      '192.168.' + randInt(0,5)   + '.' + randInt(1,254),
      '172.16.'  + randInt(0,31)  + '.' + randInt(1,254),
    ];
    return pools[randInt(0, pools.length - 1)];
  }
  function randPort() {
    var wellKnown = [22, 23, 25, 53, 80, 110, 143, 443, 445, 3389, 8080, 8443];
    return Math.random() < 0.4
      ? wellKnown[randInt(0, wellKnown.length - 1)]
      : randInt(1024, 65535);
  }
  function randFlags() {
    var flags = ['SYN', 'SYN ACK', 'ACK', 'FIN ACK', 'RST', 'PSH ACK', 'URG'];
    return flags[randInt(0, flags.length - 1)];
  }
  function randProto() {
    var p = ['TCP', 'UDP', 'ICMP', 'TLS', 'DNS', 'HTTP', 'SSH', 'FTP'];
    return p[randInt(0, p.length - 1)];
  }
  function randTTL() { return [32, 64, 128, 255][randInt(0, 3)]; }
  function randLen() { return randInt(40, 1500); }

  function buildColumn() {
    var len = Math.floor(canvas.height / fontSize) + TAIL_LEN + 5;
    var arr = [];
    for (var j = 0; j < len; j++) {
      var proto = randProto();
      var src   = randIP() + ':' + randPort();
      var dst   = randIP() + ':' + randPort();
      var line;
      if (proto === 'ICMP') {
        line = proto + ' ' + randIP() + ' > ' + randIP() + ' TTL=' + randTTL();
      } else if (proto === 'DNS') {
        line = proto + ' ' + randIP() + ' QRY ' + randInt(1, 65535);
      } else {
        line = proto + ' ' + src + ' > ' + dst + ' ' + randFlags() + ' len=' + randLen();
      }
      arr.push(line);
    }
    return arr;
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols       = Math.floor(canvas.width / colWidth);
    drops      = [];
    colStrings = [];
    var rowsOnScreen = Math.floor(canvas.height / fontSize);
    for (var i = 0; i < cols; i++) {
      // Spread drops across the full screen height so it's populated from load
      drops[i]      = randInt(0, rowsOnScreen);
      colStrings[i] = buildColumn();
    }
  }

  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    for (var i = 0; i < cols; i++) {
      var headRow = Math.floor(drops[i]);
      var col     = colStrings[i];

      for (var t = 0; t <= TAIL_LEN; t++) {
        var row = headRow - t;
        var y   = row * fontSize;
        if (y < -fontSize || y > canvas.height) continue;

        var charIdx = ((row % col.length) + col.length) % col.length;
        var text    = col[charIdx];

        var ratio = 1 - (t / TAIL_LEN);
        var alpha = ratio * ratio * (t === 0 ? 0.45 : 0.22);
        var r = Math.round(30  + ratio * 44);
        var g = Math.round(100 + ratio * 100);
        var b = Math.round(210 + ratio * 45);
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';

        ctx.fillText(text, i * colWidth, y);
      }

      drops[i] += SPEED;
      if ((drops[i] - TAIL_LEN) * fontSize > canvas.height) {
        drops[i]      = -TAIL_LEN;
        colStrings[i] = buildColumn();
      }
    }
  }

  var lastTime = 0;
  var INTERVAL = 50; // ms between draws — ~20fps, matches original setInterval feel

  function loop(ts) {
    if (ts - lastTime >= INTERVAL) {
      lastTime = ts;
      draw();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

// ── Scroll progress bar
var progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', function () {
  var total = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / total * 100) + '%';
}, { passive: true });

// ── Typewriter
var phrases = [
  'Cybersecurity graduate from the University of Michigan.',
  'Investigating threats through log correlation and forensics.',
  'Building real-world defensive security skills.',
];
var phraseIndex = 0, charIndex = 0, deleting = false;
var tw = document.getElementById('typewriter-text');

function typeLoop() {
  var phrase = phrases[phraseIndex];
  if (!deleting) {
    charIndex++;
    tw.textContent = phrase.slice(0, charIndex);
    if (charIndex === phrase.length) {
      deleting = true;
      setTimeout(typeLoop, 2200);
      return;
    }
  } else {
    charIndex--;
    tw.textContent = phrase.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 32 : 52);
}
setTimeout(typeLoop, 900);

// ── Bidirectional scroll fade with directional stagger
var lastScrollY = window.scrollY;
var scrollDir   = 'down';

window.addEventListener('scroll', function () {
  scrollDir   = window.scrollY > lastScrollY ? 'down' : 'up';
  lastScrollY = window.scrollY;
}, { passive: true });

var fadeObserver = new IntersectionObserver(function (entries) {
  // Collect entering and leaving elements separately
  var entering = [], leaving = [];
  entries.forEach(function (e) {
    if (e.isIntersecting) {
      entering.push(e.target);
    } else {
      leaving.push(e.target);
    }
  });

  // When scrolling down: fade in top-to-bottom (natural order)
  // When scrolling up:   fade in bottom-to-top, fade out top-to-bottom
  if (scrollDir === 'up') {
    // Reverse enter order so bottom elements appear first
    entering.sort(function (a, b) {
      return b.getBoundingClientRect().top - a.getBoundingClientRect().top;
    });
    // Leaving elements exit top-to-bottom (top ones go first)
    leaving.sort(function (a, b) {
      return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });
  } else {
    // Scrolling down: entering top-to-bottom
    entering.sort(function (a, b) {
      return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
    });
  }

  entering.forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.07) + 's';
    el.classList.add('visible');
  });

  leaving.forEach(function (el, i) {
    el.style.transitionDelay = (i * 0.07) + 's';
    el.classList.remove('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(function (el) {
  fadeObserver.observe(el);
});

// ── Animated stat counters
var counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    var el     = entry.target;
    var target = parseInt(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var current = 0;
    var step = Math.ceil(target / 40);
    var tick = setInterval(function () {
      current += step;
      if (current >= target) { current = target; clearInterval(tick); }
      el.textContent = current + suffix;
    }, 35);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-number[data-target]').forEach(function (el) {
  counterObserver.observe(el);
});

// ── Active nav on scroll
var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('.nav-links a');

function onScroll() {
  var current = 'hero';
  sections.forEach(function (sec) {
    if (window.scrollY >= sec.offsetTop - window.innerHeight * 0.4) {
      current = sec.id;
    }
  });
  navLinks.forEach(function (a) {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Contact form
function handleSubmit(e) {
  e.preventDefault();
  var status = document.getElementById('form-status');
  status.style.display = 'block';
  e.target.reset();
  setTimeout(function () { status.style.display = 'none'; }, 4000);
}
// ── Hamburger / mobile nav drawer
(function () {
  var btn    = document.getElementById('nav-hamburger');
  var drawer = document.getElementById('nav-drawer');
  if (!btn || !drawer) return;

  function closeDrawer() {
    btn.classList.remove('open');
    drawer.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function () {
    var isOpen = drawer.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close when a drawer link is tapped
  drawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeDrawer);
  });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (!btn.contains(e.target) && !drawer.contains(e.target)) {
      closeDrawer();
    }
  });
})();
