/* ============================================
   BIDHAN RATNA PORTFOLIO – SCRIPT.JS
   ============================================ */

'use strict';

/* ---------- THEME TOGGLE ---------- */
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

function getStoredTheme() {
  return localStorage.getItem('portfolio-theme') || 'dark';
}

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
}

// Init theme
setTheme(getStoredTheme());

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});


/* ---------- NAVBAR ---------- */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');

// Scroll behavior
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  updateActiveNav();
}, { passive: true });

// Hamburger
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close nav on link click (mobile)
navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Active nav link highlight
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

    if (navLink) {
      if (scrollPos >= top && scrollPos < bottom) {
        navLink.classList.add('active');
      } else {
        navLink.classList.remove('active');
      }
    }
  });
}


/* ---------- SCROLL REVEAL ANIMATIONS ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Once revealed, stop observing
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});


/* ---------- SKILL BAR ANIMATIONS ---------- */
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bars = entry.target.querySelectorAll('.bar-fill');
      bars.forEach((bar, i) => {
        const targetWidth = bar.getAttribute('data-width');
        setTimeout(() => {
          bar.style.width = targetWidth + '%';
        }, i * 150);
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-group').forEach(group => {
  barObserver.observe(group);
});


/* ---------- PARTICLE CANVAS ---------- */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let animFrameId;
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    buildParticles();
  }, { passive: true });

  resize();

  function getParticleColor() {
    const theme = html.getAttribute('data-theme');
    return theme === 'dark'
      ? 'rgba(99, 102, 241, '
      : 'rgba(99, 102, 241, ';
  }

  function buildParticles() {
    const count = Math.floor((W * H) / 14000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.1,
      alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.003,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const theme = html.getAttribute('data-theme');
    const alphaMultiplier = theme === 'dark' ? 1 : 0.6;

    particles.forEach((p, i) => {
      // Update
      p.x += p.vx;
      p.y += p.vy;
      p.alpha += p.alphaDir;
      if (p.alpha > 0.6 || p.alpha < 0.05) p.alphaDir *= -1;

      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha * alphaMultiplier})`;
      ctx.fill();

      // Draw connecting lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const lineAlpha = (1 - dist / 120) * 0.15 * alphaMultiplier;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    animFrameId = requestAnimationFrame(draw);
  }

  buildParticles();
  draw();

  // Pause when hero is not visible (performance)
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          cancelAnimationFrame(animFrameId);
        } else {
          draw();
        }
      });
    }, { threshold: 0 });
    heroObserver.observe(heroSection);
  }
})();


/* ---------- MOUSE PARALLAX ON HERO ---------- */
(function initParallax() {
  const hero = document.querySelector('.hero-content');
  const shapes = document.querySelectorAll('.shape');
  if (!hero) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
    const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;
    targetX = xRatio;
    targetY = yRatio;
  }, { passive: true });

  function animate() {
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    shapes.forEach((shape, i) => {
      const depth = (i + 1) * 8;
      shape.style.transform = `translate(${currentX * depth}px, ${currentY * depth}px)`;
    });

    rafId = requestAnimationFrame(animate);
  }

  animate();
})();


/* ---------- CONTACT FORM ---------- */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = 'Sending...';
    btn.disabled = true;

    // Simulate send (no backend)
    setTimeout(() => {
      btn.textContent = 'Sent!';
      formSuccess.classList.add('show');
      contactForm.reset();

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
        formSuccess.classList.remove('show');
      }, 4000);
    }, 1000);
  });
}


/* ---------- SMOOTH SECTION COUNTER (stats) ---------- */
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = isDecimal ? value.toFixed(2) : Math.floor(value);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = isDecimal ? target.toFixed(2) : target;
  }

  requestAnimationFrame(step);
}

// Observe stat values and animate on entry
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent.replace(/[^0-9.]/g, '');
      const suffix = el.textContent.replace(/[0-9.]/g, '');
      const target = parseFloat(raw);

      if (!isNaN(target)) {
        animateCounter(el, target);
        // Re-attach suffix after animation
        setTimeout(() => {
          if (suffix) el.textContent = el.textContent + suffix;
        }, 1250);
      }
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.8 });

document.querySelectorAll('.stat-value').forEach(el => {
  statObserver.observe(el);
});


/* ---------- CURSOR GLOW EFFECT (desktop only) ---------- */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch

  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(glow);

  let mx = 0, my = 0;
  let gx = 0, gy = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    glow.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });

  function animateGlow() {
    gx += (mx - gx) * 0.1;
    gy += (my - gy) * 0.1;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(animateGlow);
  }

  animateGlow();
})();


/* ---------- TYPING EFFECT ON HERO TAGLINE ---------- */
(function initTypingEffect() {
  const tagline = document.querySelector('.hero-tagline');
  if (!tagline) return;

  const phrases = [
    'Computer Science Senior & AI/ML Enthusiast',
    'Deep Learning Researcher',
    'Full-Stack Developer',
    'Cybersecurity Learner',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  // Only start after the element has revealed
  const taglineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(typeLoop, 2000);
        taglineObserver.unobserve(tagline);
      }
    });
  }, { threshold: 0.5 });

  taglineObserver.observe(tagline);

  function typeLoop() {
    const phrase = phrases[phraseIndex];

    if (isPaused) {
      isPaused = false;
      isDeleting = true;
      setTimeout(typeLoop, 80);
      return;
    }

    if (isDeleting) {
      tagline.textContent = phrase.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex <= 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        charIndex = 0;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 45);
    } else {
      tagline.textContent = phrase.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === phrase.length) {
        isPaused = true;
        setTimeout(typeLoop, 2200);
        return;
      }
      setTimeout(typeLoop, 70);
    }
  }
})();


/* ---------- NAVBAR LOGO CLICK TO TOP ---------- */
document.querySelector('.nav-logo')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ---------- PAGE LOAD ANIMATION ---------- */
(function initPageLoad() {
  document.body.classList.add('page-loading');

  function onLoad() {
    document.body.classList.remove('page-loading');
    document.body.classList.add('page-loaded');
  }

  if (document.readyState === 'complete') {
    requestAnimationFrame(onLoad);
  } else {
    window.addEventListener('load', () => requestAnimationFrame(onLoad), { once: true });
  }
})();


/* ---------- SCROLL TO TOP BUTTON ---------- */
(function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ---------- SECTION TITLE GLOW ON SCROLL ---------- */
(function initTitleGlow() {
  const titles = document.querySelectorAll('.section-title');
  if (!titles.length) return;

  const glowObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('glow-active');
      }
    });
  }, { threshold: 0.5 });

  titles.forEach(t => glowObserver.observe(t));
})();


/* ---------- JEEP HINT TOOLTIP ---------- */
(function initJeepHint() {
  const hint = document.getElementById('jeep-hint');
  if (!hint) return;

  // Show hint a few seconds after page load
  setTimeout(() => {
    hint.classList.add('show');
    // Hide after 6 seconds
    setTimeout(() => {
      hint.classList.remove('show');
    }, 6000);
  }, 3500);
})();


/* ---------- JEEP NAVIGATOR ---------- */
(function initJeepNavigator() {
  const jeep = document.getElementById('jeep-navigator');
  const toggleBtn = document.getElementById('jeep-toggle-btn');
  const exhaust = document.getElementById('jeep-exhaust');
  if (!jeep || !toggleBtn) return;

  let jeepActive = false;
  let jeepX = 80;
  let jeepY = window.innerHeight - 160;
  const JEEP_W = 90;
  const JEEP_H = 52;
  const SPEED = 3.5;

  // Keys currently held
  const keys = {};

  let animId;
  let dustTimer = 0;

  function getViewport() {
    return { w: window.innerWidth, h: window.innerHeight };
  }

  function clampPos(x, y) {
    const { w, h } = getViewport();
    return {
      x: Math.max(0, Math.min(w - JEEP_W, x)),
      y: Math.max(60, Math.min(h - JEEP_H - 10, y))
    };
  }

  function setJeepPosition(x, y) {
    jeep.style.left = x + 'px';
    jeep.style.top  = y + 'px';
    jeep.style.bottom = 'auto';
  }

  function spawnDustPuff(x, y) {
    if (!exhaust) return;
    const puff = document.createElement('div');
    puff.className = 'dust-puff';
    const size = 8 + Math.random() * 10;
    const hue  = [30, 50, 200, 300][Math.floor(Math.random() * 4)];
    puff.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: hsla(${hue}, 70%, 60%, 0.55);
      left: -${size / 2}px;
      top: -${size / 2}px;
    `;
    exhaust.appendChild(puff);
    // Remove after animation
    setTimeout(() => {
      if (puff.parentNode) puff.parentNode.removeChild(puff);
    }, 900);
  }

  function jeepLoop() {
    if (!jeepActive) return;

    let dx = 0, dy = 0;
    if (keys['arrowup']    || keys['w']) dy -= SPEED;
    if (keys['arrowdown']  || keys['s']) dy += SPEED;
    if (keys['arrowleft']  || keys['a']) dx -= SPEED;
    if (keys['arrowright'] || keys['d']) dx += SPEED;

    const moving = dx !== 0 || dy !== 0;

    // Rotate jeep to face direction of travel
    let rotate = 0;
    let flipX = 1;
    if (dx !== 0 || dy !== 0) {
      if (Math.abs(dx) >= Math.abs(dy)) {
        // Horizontal dominant — face left or right
        rotate = 0;
        flipX = dx < 0 ? -1 : 1;
      } else {
        // Vertical dominant — rotate 90deg to face up/down
        rotate = dy > 0 ? 90 : -90;
        flipX = 1;
      }
    }
    jeep.style.transform = `scaleX(${flipX}) rotate(${rotate}deg)`;

    // Wheel spin
    const wheels = jeep.querySelectorAll('.jeep-wheel');
    wheels.forEach(w => {
      if (moving) w.classList.add('spinning');
      else        w.classList.remove('spinning');
    });

    // Bob animation pause when still
    if (moving) jeep.classList.remove('still');
    else        jeep.classList.add('still');

    // Move jeep position
    jeepX += dx;
    jeepY += dy;
    const clamped = clampPos(jeepX, jeepY);
    jeepX = clamped.x;
    jeepY = clamped.y;
    setJeepPosition(jeepX, jeepY);

    // Scroll the page along with vertical movement
    if (dy !== 0) window.scrollBy({ top: dy * 2, behavior: 'instant' });

    // Dust puffs
    if (moving) {
      dustTimer++;
      if (dustTimer % 5 === 0) {
        spawnDustPuff(jeepX, jeepY + JEEP_H / 2);
      }
    }

    animId = requestAnimationFrame(jeepLoop);
  }

  function enableJeep() {
    jeepActive = true;
    jeep.classList.add('active');
    toggleBtn.classList.add('active');
    setJeepPosition(jeepX, jeepY);
    animId = requestAnimationFrame(jeepLoop);
  }

  function disableJeep() {
    jeepActive = false;
    jeep.classList.remove('active');
    toggleBtn.classList.remove('active');
    cancelAnimationFrame(animId);
    // Clear wheels
    jeep.querySelectorAll('.jeep-wheel').forEach(w => w.classList.remove('spinning'));
    jeep.classList.remove('still');
  }

  toggleBtn.addEventListener('click', () => {
    if (jeepActive) disableJeep();
    else enableJeep();
  });

  // Keyboard handlers — only fire when jeep is active, not in input fields
  document.addEventListener('keydown', (e) => {
    if (!jeepActive) return;
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    const key = e.key.toLowerCase();
    if (['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(key)) {
      e.preventDefault();
      keys[key] = true;
    }

    if (key === 'escape') disableJeep();
  }, { passive: false });

  document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  // Update clamp on resize
  window.addEventListener('resize', () => {
    if (jeepActive) {
      const clamped = clampPos(jeepX, jeepY);
      jeepX = clamped.x;
      jeepY = clamped.y;
      setJeepPosition(jeepX, jeepY);
    }
  }, { passive: true });
})();


/* ---------- INIT ---------- */
// Trigger nav active state on load
updateActiveNav();
