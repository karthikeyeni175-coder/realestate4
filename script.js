/* ==============================
   LuxEstate – Main Script
============================== */

/* ---- LOADER ---- */
(function () {
  const loader = document.getElementById('loader');
  const fill = document.getElementById('loaderFill');
  const loaderTx = document.getElementById('loaderText');
  const msgs = ['Loading...', 'Preparing listings...', 'Almost ready...', 'Welcome!'];
  let progress = 0;
  let msgIdx = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) progress = 100;
    fill.style.width = progress + '%';
    loaderTx.textContent = msgs[Math.min(msgIdx++, msgs.length - 1)];
    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
  }, 180);
})();

/* ---- CUSTOM CURSOR ---- */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top = my + 'px';
});
(function animCursor() {
  cx += (mx - cx) * 0.12;
  cy += (my - cy) * 0.12;
  cursor.style.left = cx + 'px';
  cursor.style.top = cy + 'px';
  requestAnimationFrame(animCursor);
})();

// Hover grow
document.querySelectorAll('a, button, .feature-card, .prop-card, .location-card, .agent-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

/* ---- PARTICLES ---- */
(function spawnParticles() {
  const container = document.getElementById('particles');
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 1;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 40}%;
      width: ${size}px;
      height: ${size}px;
      --dur: ${Math.random() * 12 + 6}s;
      --delay: ${Math.random() * 8}s;
      --tx: ${(Math.random() - 0.5) * 120}px;
      opacity: 0;
    `;
    container.appendChild(p);
  }
})();

/* ---- NAVBAR SCROLL ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  // active link
  updateActiveLink();
});

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    const top = sec.offsetTop;
    const bot = top + sec.offsetHeight;
    link.classList.toggle('active', scrollY >= top && scrollY < bot);
  });
}

/* ---- HAMBURGER ---- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});
navLinks.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});



/* ---- REVEAL ON SCROLL ---- */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* ---- STATS SPEEDOMETER SYSTEM ---- */
(function initSpeedometers() {
  const section = document.getElementById('statsSection');
  if (!section) return;
  const cards = section.querySelectorAll('.stats-card');

  // --- Create shared SVG gradient definition ---
  const svgNS = 'http://www.w3.org/2000/svg';
  const firstSvg = section.querySelector('.sc-gauge');
  if (firstSvg) {
    const defs = document.createElementNS(svgNS, 'defs');
    const grad = document.createElementNS(svgNS, 'linearGradient');
    grad.setAttribute('id', 'gaugeGrad');
    grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
    grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '0%');
    const stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('offset', '0%'); stop1.setAttribute('stop-color', '#c9a84c');
    const stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('offset', '50%'); stop2.setAttribute('stop-color', '#e5c76b');
    const stop3 = document.createElementNS(svgNS, 'stop');
    stop3.setAttribute('offset', '100%'); stop3.setAttribute('stop-color', '#22c55e');
    grad.appendChild(stop1); grad.appendChild(stop2); grad.appendChild(stop3);
    defs.appendChild(grad);
    firstSvg.insertBefore(defs, firstSvg.firstChild);
  }

  // --- Generate tick marks for each gauge ---
  const arcLength = 251.33; // length of the semi-circular arc path
  cards.forEach(card => {
    const ticksGroup = card.querySelector('.sc-ticks');
    if (!ticksGroup) return;
    const cx = 100, cy = 100, r = 80;
    for (let i = 0; i <= 10; i++) {
      const angle = Math.PI + (Math.PI * i / 10); // 180° to 360°
      const x1 = cx + Math.cos(angle) * (r - 4);
      const y1 = cy + Math.sin(angle) * (r - 4);
      const tickLen = i % 5 === 0 ? 10 : 5;
      const x2 = cx + Math.cos(angle) * (r - 4 - tickLen);
      const y2 = cy + Math.sin(angle) * (r - 4 - tickLen);
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', x1); line.setAttribute('y1', y1);
      line.setAttribute('x2', x2); line.setAttribute('y2', y2);
      if (i % 5 === 0) {
        line.style.stroke = 'rgba(201, 168, 76, 0.4)';
        line.style.strokeWidth = '2';
      }
      ticksGroup.appendChild(line);
    }
  });

  // --- Counter animation ---
  function animateCounter(el, target, duration = 2000) {
    el.classList.add('counting');
    const start = performance.now();
    const step = ts => {
      const progress = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
        setTimeout(() => el.classList.remove('counting'), 400);
      }
    };
    requestAnimationFrame(step);
  }

  // --- Animate a single card ---
  function animateCard(card) {
    card.classList.add('visible');

    const pct = (+card.dataset.pct || 80) / 100;
    const gaugeFill = card.querySelector('.sc-gauge-fill');
    const needle = card.querySelector('.sc-needle');
    const numEl = card.querySelector('.sc-num');
    const target = +card.dataset.target || 0;

    // Gauge arc fill
    if (gaugeFill) {
      const fillOffset = arcLength * (1 - pct);
      gaugeFill.style.strokeDashoffset = fillOffset;
    }

    // Needle rotation: -90deg (left) to +90deg (right)
    if (needle) {
      const needleAngle = -90 + (pct * 180);
      needle.style.transform = `rotate(${needleAngle}deg)`;
    }

    // Number counter
    if (numEl) {
      numEl.textContent = '0';
      animateCounter(numEl, target, 2200);
    }
  }

  // --- Reset a single card ---
  function resetCard(card) {
    card.classList.remove('visible');

    const gaugeFill = card.querySelector('.sc-gauge-fill');
    const needle = card.querySelector('.sc-needle');
    const numEl = card.querySelector('.sc-num');

    if (gaugeFill) {
      gaugeFill.style.transition = 'none';
      gaugeFill.style.strokeDashoffset = arcLength;
      requestAnimationFrame(() => {
        gaugeFill.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    }

    if (needle) {
      needle.style.transition = 'none';
      needle.style.transform = 'rotate(-90deg)';
      requestAnimationFrame(() => {
        needle.style.transition = 'transform 2.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
      });
    }

    if (numEl) {
      numEl.textContent = '0';
      numEl.classList.remove('counting');
    }
  }

  // --- Intersection Observer ---
  let hasAnimated = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        cards.forEach((card, i) => {
          setTimeout(() => animateCard(card), i * 150);
        });
      } else if (!e.isIntersecting && hasAnimated) {
        hasAnimated = false;
        cards.forEach(card => resetCard(card));
      }
    });
  }, { threshold: 0.25 });

  observer.observe(section);
})();



/* ---- PROPERTY FILTER ---- */
const propTabs = document.querySelectorAll('.prop-tab');
propTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    propTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.prop-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'fadeUp 0.5s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ---- WISHLIST TOGGLE ---- */
document.querySelectorAll('.prop-wishlist').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
    btn.style.background = btn.classList.contains('active') ? '#e74c3c' : '';
  });
});

/* ---- BOOKING MODAL ---- */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

/* ---- DETAILS MODAL ---- */
const detailsModalOverlay = document.getElementById('detailsModalOverlay');
const detailsModalClose = document.getElementById('detailsModalClose');

function openModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.add('active');
  modalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('active');
  modalOverlay.style.display = 'none';
  document.body.style.overflow = '';
}

function openDetailsModal() {
  if (!detailsModalOverlay) return;
  detailsModalOverlay.classList.add('active');
  detailsModalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeDetailsModal() {
  if (!detailsModalOverlay) return;
  detailsModalOverlay.classList.remove('active');
  detailsModalOverlay.style.display = 'none';
  document.body.style.overflow = '';
}

// Populate property details into modal then open
function populateAndOpenPropertyModal(cardEl) {
  if (!cardEl) { openModal(); return; }

  const title = cardEl.querySelector('.prop-title')?.textContent?.trim() || '';
  const loc = cardEl.querySelector('.prop-location')?.textContent?.trim() || '';
  const price = cardEl.querySelector('.prop-price')?.textContent?.trim() || '';
  const imgSrc = cardEl.querySelector('.prop-img-wrap img')?.getAttribute('src') || '';

  const infoWrap = document.getElementById('modalPropertyInfo');
  const titleEl = document.getElementById('modalPropertyTitle');
  const locEl = document.getElementById('modalPropertyLoc');
  const priceEl = document.getElementById('modalPropertyPrice');
  const imgEl = document.getElementById('modalPropertyImg');
  const inputEl = document.getElementById('modalPropertyInput');

  if (titleEl) titleEl.textContent = title || 'Property';
  if (locEl) locEl.textContent = loc || '';
  if (priceEl) priceEl.textContent = price || '';
  if (imgEl) {
    if (imgSrc) { imgEl.src = imgSrc; imgEl.style.display = ''; }
    else imgEl.style.display = 'none';
  }
  if (inputEl) inputEl.value = title || '';
  if (infoWrap) infoWrap.style.display = 'block';

  openModal();
}

// Attach to Enquire buttons (Booking Modal)
document.querySelectorAll('.prop-cta').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const card = btn.closest('.prop-card');
    populateAndOpenPropertyModal(card);
  });
});

// Attach to View Details buttons (Details Modal)
document.querySelectorAll('.prop-view-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const card = btn.closest('.prop-card');
    populateAndOpenDetailsModal(card);
  });
});

// Populate Details Modal
function populateAndOpenDetailsModal(cardEl) {
  if (!cardEl || !detailsModalOverlay) return;
  
  const title = cardEl.querySelector('.prop-title')?.textContent?.trim() || 'Property Details';
  const loc = cardEl.querySelector('.prop-location')?.textContent?.trim() || '';
  const price = cardEl.querySelector('.prop-price')?.textContent?.trim() || '';
  const imgSrc = cardEl.querySelector('.prop-img-wrap img')?.getAttribute('src') || '';
  const rating = cardEl.querySelector('.prop-rating')?.textContent?.trim() || '';
  const badge = cardEl.querySelector('.prop-badge')?.textContent?.trim() || 'Featured';
  
  // Clone specs
  const specsHtml = cardEl.querySelector('.prop-specs')?.innerHTML || '';
  
  document.getElementById('detailsModalTitle').textContent = title;
  document.getElementById('detailsModalLoc').textContent = loc;
  document.getElementById('detailsModalPrice').textContent = price;
  document.getElementById('detailsModalImg').src = imgSrc;
  document.getElementById('detailsModalRating').textContent = rating;
  document.getElementById('detailsModalBadge').textContent = badge;
  document.getElementById('detailsModalSpecs').innerHTML = specsHtml;
  
  // Connect Book button from Details modal to Booking modal
  const bookBtn = document.getElementById('detailsModalBookBtn');
  if (bookBtn) {
    bookBtn.onclick = (e) => {
      e.preventDefault();
      closeDetailsModal();
      populateAndOpenPropertyModal(cardEl);
    };
  }

  openDetailsModal();
}

document.getElementById('listBtn')?.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });

detailsModalClose?.addEventListener('click', closeDetailsModal);
detailsModalOverlay?.addEventListener('click', e => { if (e.target === detailsModalOverlay) closeDetailsModal(); });

/* ---- SIGN IN MODAL ---- */
const loginModalOverlay = document.getElementById('loginModalOverlay');
const loginModalClose = document.getElementById('loginModalClose');

function openLoginModal() {
  loginModalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
  loginModalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('loginBtn')?.addEventListener('click', openLoginModal);
document.getElementById('heroLoginBtn')?.addEventListener('click', openLoginModal);
loginModalClose?.addEventListener('click', closeLoginModal);
loginModalOverlay?.addEventListener('click', e => { if (e.target === loginModalOverlay) closeLoginModal(); });

document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (loginModalOverlay?.classList.contains('active')) closeLoginModal();
  else closeModal();
});

/* ---- MODAL FORM ---- */
document.getElementById('modalForm').addEventListener('submit', e => {
  e.preventDefault();
  closeModal();
  showToast('✓ Viewing booked! We\'ll confirm within 2 hours.');
});

document.getElementById('loginForm')?.addEventListener('submit', e => {
  e.preventDefault();
  closeLoginModal();
  showToast('✓ Signed in successfully! Welcome back.');
});

/* ---- TESTIMONIAL SLIDER ---- */
const track = document.getElementById('testiTrack');
const dots = document.querySelectorAll('.testi-dot');
const cards = document.querySelectorAll('.testi-card');
let current = 0;
let autoSlideInt = null;

function getCardsPerView() {
  return window.innerWidth < 900 ? 1 : window.innerWidth < 1100 ? 2 : 3;
}
function getMaxIndex() {
  return Math.max(0, cards.length - getCardsPerView());
}
function slideTo(idx) {
  const maxIdx = getMaxIndex();
  current = Math.max(0, Math.min(idx, maxIdx));
  const cardW = track.parentElement.offsetWidth / getCardsPerView();
  track.style.transform = `translateX(-${current * (cardW + 24)}px)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}
function nextSlide() { slideTo(current >= getMaxIndex() ? 0 : current + 1); }
function prevSlide() { slideTo(current <= 0 ? getMaxIndex() : current - 1); }

document.getElementById('testiNext').addEventListener('click', () => { nextSlide(); resetAuto(); });
document.getElementById('testiPrev').addEventListener('click', () => { prevSlide(); resetAuto(); });
dots.forEach(d => d.addEventListener('click', () => { slideTo(+d.dataset.index); resetAuto(); }));

function resetAuto() {
  clearInterval(autoSlideInt);
  autoSlideInt = setInterval(nextSlide, 5000);
}
autoSlideInt = setInterval(nextSlide, 5000);
window.addEventListener('resize', () => slideTo(current));

/* ---- CONTACT FORM ---- */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.querySelector('span').textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.querySelector('span').textContent = '✓ Message Sent!';
    btn.style.background = '#22c55e';
    showToast('🎉 Message received! We\'ll be in touch soon.');
    e.target.reset();
    setTimeout(() => {
      btn.querySelector('span').textContent = 'Send Message';
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1500);
});

/* ---- PARALLAX HERO IMAGE ---- */
window.addEventListener('scroll', () => {
  const hero = document.getElementById('heroImg');
  const scrollY = window.scrollY;
  if (hero && scrollY < window.innerHeight) {
    hero.style.transform = `scale(1.05) translateY(${scrollY * 0.2}px)`;
  }
});

/* ---- LOAD MORE BUTTON ---- */
document.getElementById('loadMoreBtn').addEventListener('click', function () {
  this.textContent = 'No more listings right now';
  this.style.opacity = '0.5';
  this.disabled = true;
  showToast('📋 All current listings are shown. Check back soon!');
});



/* ---- TOAST NOTIFICATION ---- */
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 5rem; left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: rgba(13,31,60,0.97);
    border: 1px solid rgba(201,168,76,0.4);
    color: #fff;
    padding: 0.85rem 1.8rem;
    border-radius: 99px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    z-index: 9999;
    backdrop-filter: blur(16px);
    box-shadow: 0 10px 40px rgba(0,0,0,0.4);
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s;
    opacity: 0;
    white-space: nowrap;
    max-width: 90vw;
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ---- NEWSLETTER ---- */
document.querySelector('.newsletter-input button').addEventListener('click', () => {
  const input = document.getElementById('newsletterEmail');
  if (input.value.includes('@')) {
    showToast('📬 Subscribed successfully! Welcome aboard.');
    input.value = '';
  } else {
    showToast('⚠️ Please enter a valid email address.');
  }
});

/* ---- SMOOTH SCROLL for nav links ---- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- HERO SCROLL PARALLAX for badge / title ---- */
const heroTextElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    const yOffset = window.scrollY * 0.08;
    const opacityVal = 1 - window.scrollY / (window.innerHeight * 0.6);
    heroTextElements.forEach(el => {
      el.style.transform = `translateY(${yOffset}px)`;
      el.style.opacity = opacityVal;
    });
  }
});

/* ============================================
   LIVE MARKET PULSE
============================================ */
(function initMarketPulse() {

  /* --- Ticker Data --- */
  const tickerData = [
    { name: 'Burj Vista', price: 2450000, change: +1.8 },
    { name: 'Marina Gate', price: 1850000, change: -0.5 },
    { name: 'Emaar Beachfront', price: 3200000, change: +2.4 },
    { name: 'DIFC Living', price: 5100000, change: +0.9 },
    { name: 'JVC Garden', price: 890000, change: -1.2 },
    { name: 'Downtown Views', price: 4750000, change: +3.1 },
    { name: 'Palm Residence', price: 9800000, change: +0.3 },
    { name: 'Creek Harbour', price: 2100000, change: -0.7 },
    { name: 'Bluewaters', price: 6500000, change: +1.5 },
    { name: 'Mirdif Hills', price: 1350000, change: +0.8 },
  ];

  // Build ticker (doubled for seamless loop)
  const inner = document.getElementById('tickerInner');
  if (!inner) return;
  const buildTicker = () => {
    [...tickerData, ...tickerData].forEach(d => {
      const span = document.createElement('span');
      span.className = 'tick-item';
      const dir = d.change >= 0 ? '▲' : '▼';
      span.innerHTML = `
        <span class="tick-name">${d.name}</span>
        <span class="tick-price">AED ${d.price.toLocaleString()}</span>
        <span class="tick-chg ${d.change >= 0 ? 'up' : 'down'}">${dir} ${Math.abs(d.change)}%</span>
        <span style="color:rgba(255,255,255,0.2);margin:0 0.5rem">|</span>
      `;
      inner.appendChild(span);
    });
  };
  buildTicker();

  /* --- Live Stats Fluctuation --- */
  let mktIdx = 2847, avgPx = 1342, txCnt = 148, vol = 892;
  function updateStats() {
    mktIdx += (Math.random() - 0.48) * 8;
    avgPx += (Math.random() - 0.48) * 5;
    txCnt += Math.floor(Math.random() * 3);
    vol += (Math.random() - 0.48) * 3;

    const mktEl = document.getElementById('mktIndex');
    const avgEl = document.getElementById('avgPrice');
    const txEl = document.getElementById('txCount');
    const volEl = document.getElementById('totalVol');
    if (!mktEl) return;

    mktEl.textContent = Math.round(mktIdx).toLocaleString();
    avgEl.textContent = `AED ${Math.round(avgPx).toLocaleString()}`;
    txEl.textContent = txCnt;
    volEl.textContent = `AED ${vol.toFixed(0)}M`;

    // Flash animation
    [mktEl, avgEl, txEl, volEl].forEach(el => {
      el.style.color = '#e5c76b';
      setTimeout(() => { el.style.color = ''; }, 300);
    });
  }
  setInterval(updateStats, 2800);

  /* --- Market Chart (Canvas) --- */
  const canvas = document.getElementById('marketChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let chartData = Array.from({ length: 60 }, (_, i) => 2600 + Math.sin(i * 0.3) * 120 + Math.random() * 80);

  // Tooltip elements
  const chartTooltip  = document.getElementById('chartTooltip');
  const cttTime       = document.getElementById('cttTime');
  const cttBadge      = document.getElementById('cttBadge');
  const cttPrice      = document.getElementById('cttPrice');
  const cttChange     = document.getElementById('cttChange');

  // Create crosshair line and hover dot DOM elements
  const crosshair = document.createElement('div');
  crosshair.className = 'chart-crosshair';
  const hoverDot = document.createElement('div');
  hoverDot.className = 'chart-hover-dot';
  const chartWrap = canvas.parentElement;
  chartWrap.appendChild(crosshair);
  chartWrap.appendChild(hoverDot);

  // Store computed chart coordinates for hit-testing
  let chartCoords = { min: 0, max: 0, W: 0, H: 0, canvasTop: 0 };

  function drawChart() {
    canvas.width = canvas.offsetWidth || 600;
    canvas.height = 220;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const W = canvas.width, H = canvas.height;
    const min = Math.min(...chartData) - 30;
    const max = Math.max(...chartData) + 30;
    const toY = v => H - 20 - ((v - min) / (max - min)) * (H - 40);
    const toX = i => (i / (chartData.length - 1)) * W;

    // Save for tooltip hit-testing
    chartCoords = { min, max, W, H, toY, toX };

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = 10 + (i / 4) * (H - 20);
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(201,168,76,0.3)');
    grad.addColorStop(1, 'rgba(201,168,76,0)');

    ctx.beginPath();
    chartData.forEach((v, i) => {
      const x = toX(i), y = toY(v);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    // Line
    ctx.beginPath();
    chartData.forEach((v, i) => {
      const x = toX(i), y = toY(v);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#c9a84c'; ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round'; ctx.stroke();

    // Live dot at end
    const lx = toX(chartData.length - 1);
    const ly = toY(chartData[chartData.length - 1]);
    ctx.beginPath();
    ctx.arc(lx, ly, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#e5c76b'; ctx.fill();
  }

  /* --- Chart hover tooltip logic --- */
  function getCanvasRelativeX(e) {
    const rect = canvas.getBoundingClientRect();
    return (e.clientX - rect.left) * (canvas.width / rect.width);
  }
  function getCanvasRelativeY(e) {
    const rect = canvas.getBoundingClientRect();
    return (e.clientY - rect.top) * (canvas.height / rect.height);
  }

  // Generate time labels based on current period
  function getTimeLabel(idx, total) {
    const now = new Date();
    const period = document.querySelector('.pcw-tab.active')?.dataset.period || '1D';
    if (period === '1D') {
      const minsAgo = Math.round((1 - idx / (total - 1)) * 480); // 8h window
      const t = new Date(now - minsAgo * 60000);
      return t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (period === '1W') {
      const daysAgo = Math.round((1 - idx / (total - 1)) * 7);
      const t = new Date(now - daysAgo * 86400000);
      return t.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    } else if (period === '1M') {
      const daysAgo = Math.round((1 - idx / (total - 1)) * 30);
      const t = new Date(now - daysAgo * 86400000);
      return t.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      const monthsAgo = Math.round((1 - idx / (total - 1)) * 12);
      const t = new Date(now - monthsAgo * 30 * 86400000);
      return t.toLocaleDateString([], { month: 'short', year: '2-digit' });
    }
  }

  canvas.addEventListener('mousemove', e => {
    if (!chartCoords.W) return;

    const relX = getCanvasRelativeX(e);
    const { min, max, W, H, toY, toX } = chartCoords;

    // Find nearest data index
    const ratio = relX / W;
    const idx = Math.max(0, Math.min(chartData.length - 1, Math.round(ratio * (chartData.length - 1))));
    const val = chartData[idx];
    const prev = chartData[Math.max(0, idx - 1)];
    const chgAbs = val - prev;
    const chgPct = prev !== 0 ? ((chgAbs / prev) * 100).toFixed(2) : '0.00';
    const isUp = chgAbs >= 0;

    // Canvas pixel coords of the data point
    const dotCanvasX = toX(idx);
    const dotCanvasY = toY(val);

    // Convert canvas coords → wrap-relative px
    const rect = canvas.getBoundingClientRect();
    const wrapRect = chartWrap.getBoundingClientRect();
    const scaleX = rect.width / canvas.width;
    const scaleY = rect.height / canvas.height;
    const dotWrapX = (rect.left - wrapRect.left) + dotCanvasX * scaleX;
    const dotWrapY = (rect.top  - wrapRect.top)  + dotCanvasY * scaleY;
    const lineHeight = rect.height; // full canvas height

    // Position crosshair
    crosshair.style.left   = dotWrapX + 'px';
    crosshair.style.top    = (rect.top - wrapRect.top) + 'px';
    crosshair.style.height = lineHeight + 'px';
    crosshair.classList.add('visible');

    // Position and style hover dot
    hoverDot.style.left = dotWrapX + 'px';
    hoverDot.style.top  = dotWrapY + 'px';
    hoverDot.className  = 'chart-hover-dot visible ' + (isUp ? 'up' : 'down');

    // Populate tooltip content
    cttTime.textContent  = getTimeLabel(idx, chartData.length);
    cttBadge.textContent = isUp ? '▲ UP' : '▼ DOWN';
    cttBadge.className   = 'ctt-badge ' + (isUp ? 'up' : 'down');
    cttPrice.textContent = 'Index ' + Math.round(val).toLocaleString();
    cttChange.textContent = (isUp ? '▲ +' : '▼ ') + chgPct + '%  vs prev';
    cttChange.className  = 'ctt-change ' + (isUp ? 'up' : 'down');

    // Smart tooltip positioning (flip if near right edge)
    const TOOLTIP_W = 165;
    const TOOLTIP_OFFSET = 14;
    let ttLeft = dotWrapX + TOOLTIP_OFFSET;
    let ttTop  = dotWrapY - 75;
    if (ttLeft + TOOLTIP_W > wrapRect.width - 10) {
      ttLeft = dotWrapX - TOOLTIP_W - TOOLTIP_OFFSET;
    }
    if (ttTop < 8) ttTop = 8;

    chartTooltip.style.left = ttLeft + 'px';
    chartTooltip.style.top  = ttTop  + 'px';
    chartTooltip.classList.add('visible');
  });

  canvas.addEventListener('mouseleave', () => {
    chartTooltip.classList.remove('visible');
    crosshair.classList.remove('visible');
    hoverDot.classList.remove('visible');
  });

  // Live chart update
  function pushChartPoint() {
    const last = chartData[chartData.length - 1];
    chartData.push(last + (Math.random() - 0.47) * 25);
    if (chartData.length > 80) chartData.shift();
    drawChart();
  }
  setInterval(pushChartPoint, 2000);
  window.addEventListener('resize', drawChart);
  setTimeout(drawChart, 100);

  // Chart period tabs
  document.querySelectorAll('.pcw-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pcw-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const periods = { '1D': 60, '1W': 120, '1M': 200, '1Y': 365 };
      const pts = periods[tab.dataset.period] || 60;
      chartData = Array.from({ length: pts }, (_, i) => 2400 + Math.sin(i * 0.2) * 200 + Math.random() * 100);
      drawChart();
    });
  });


  /* --- Area Heatmap --- */
  const areas = [
    { name: 'Downtown', val: 92, price: '+4.2%' },
    { name: 'DIFC', val: 88, price: '+3.8%' },
    { name: 'Marina', val: 75, price: '+2.1%' },
    { name: 'JBR', val: 68, price: '+1.5%' },
    { name: 'JVC', val: 55, price: '+0.8%' },
    { name: 'Mirdif', val: 42, price: '-0.3%' },
    { name: 'Sports City', val: 38, price: '-0.5%' },
    { name: 'Palm', val: 96, price: '+5.1%' },
    { name: 'Business Bay', val: 80, price: '+2.7%' },
  ];

  const heatGrid = document.getElementById('heatmapGrid');
  if (heatGrid) {
    areas.forEach(a => {
      const cell = document.createElement('div');
      cell.className = 'hm-cell';
      const r = Math.round(a.val * 2.3), g = Math.round(a.val * 1.8), b = 200 - a.val;
      cell.style.background = `rgba(${r},${g},${b},0.6)`;
      cell.innerHTML = `<span class="hm-cell-name">${a.name}</span><span class="hm-cell-val">${a.price}</span>`;
      cell.title = `${a.name}: Heat score ${a.val}/100`;
      heatGrid.appendChild(cell);
    });
  }

  /* --- Live Transactions Order Book --- */
  const txData = [
    { name: 'The Atlantis', area: 'Palm', type: 'Penthouse', price: 9800000, chg: +2.1 },
    { name: 'Marina Gate I', area: 'Marina', type: 'Apartment', price: 1850000, chg: -0.4 },
    { name: 'DIFC Central', area: 'DIFC', type: 'Office', price: 4200000, chg: +1.7 },
    { name: 'JVC Garden Villa', area: 'JVC', type: 'Villa', price: 3600000, chg: +0.9 },
    { name: 'Emaar Beachfront', area: 'JBR', type: 'Apartment', price: 2800000, chg: +3.4 },
    { name: 'Burj Vista', area: 'Downtown', type: 'Apartment', price: 5500000, chg: -1.1 },
    { name: 'Bluewaters Res.', area: 'JBR', type: 'Villa', price: 7200000, chg: +2.8 },
    { name: 'Creek Horizon', area: 'Creek', type: 'Apartment', price: 1950000, chg: +0.6 },
  ];

  const obBody = document.getElementById('obBody');
  let txIdx = 0;
  function addTxRow() {
    if (!obBody) return;
    const d = txData[txIdx % txData.length];
    txIdx++;
    const row = document.createElement('div');
    row.className = 'ob-row';
    const dir = d.chg >= 0 ? '▲' : '▼';
    row.innerHTML = `
      <span class="prop-name">${d.name}</span>
      <span class="area">${d.area}</span>
      <span class="type">${d.type}</span>
      <span class="price">${(d.price).toLocaleString()}</span>
      <span class="change ${d.chg >= 0 ? 'up' : 'down'}">${dir} ${Math.abs(d.chg)}%</span>
    `;
    obBody.insertBefore(row, obBody.firstChild);
    if (obBody.children.length > 6) obBody.removeChild(obBody.lastChild);
  }
  // Seed initial rows
  for (let i = 0; i < 5; i++) addTxRow();
  setInterval(addTxRow, 3500);

})();

/* ============================================
   AI DREAM HOME MATCHER
============================================ */
(function initAIMatcher() {

  const answers = {};
  let currentCard = 0;

  const personas = {
    urban: { name: 'The City Maverick', badge: '🏙️', desc: 'You live for the buzz of the city. High-rise, central, connected — your ideal home towers above it all.', img: 'difc.png', prop: 'DIFC Skyline Apartment', loc: '📍 DIFC, Dubai', price: 'From AED 1,200,000', pct: 94, traits: ['Central Location', 'Modern High-Rise', 'City Views', 'Smart Home'] },
    serene: { name: 'The Waterfront Soul', badge: '🌊', desc: 'Peace is your priority. Waterfront living, morning sea breezes, and sunsets over the marina await you.', img: 'marina.png', prop: 'Marina Heights', loc: '📍 Dubai Marina, Dubai', price: 'From AED 1,850,000', pct: 91, traits: ['Waterfront Views', 'Marina Access', 'Quiet Community', 'Sunsets'] },
    elite: { name: 'The Luxury Connoisseur', badge: '👑', desc: 'Nothing but the finest. Palm Jumeirah, private pools, world-class amenities — you demand the extraordinary.', img: 'penthouse.png', prop: 'Palm Penthouse', loc: '📍 Palm Jumeirah, Dubai', price: 'From AED 4,750,000', pct: 97, traits: ['Ultra-Luxury', 'Private Pool', 'Concierge', 'Iconic Address'] },
    investor: { name: 'The Smart Strategist', badge: '📊', desc: 'ROI drives your decisions. High yield zones, growth corridors, and off-plan opportunities match your mindset.', img: 'jumeirah.png', prop: 'JVC Garden Villa', loc: '📍 JVC, Dubai', price: 'From AED 3,600,000', pct: 89, traits: ['High ROI', 'Growth Area', 'Rental Yield 7%+', 'Off-Plan Available'] },
  };

  function goToCard(index) {
    const allCards = document.querySelectorAll('.am-card');
    allCards.forEach(c => {
      c.classList.remove('active', 'exit');
      if (+c.dataset.card === currentCard) c.classList.add('exit');
    });
    currentCard = index;
    const target = document.querySelector(`.am-card[data-card="${index}"]`);
    if (target) {
      setTimeout(() => {
        document.querySelectorAll('.am-card').forEach(c => c.classList.remove('exit'));
        target.classList.add('active');
      }, 50);
    }
    // Progress bar
    const prog = index === 0 ? 0 : index === 'result' ? 100 : (index / 3) * 100;
    const bar = document.getElementById('amProgBar');
    const txt = document.getElementById('amProgText');
    if (bar) bar.style.width = prog + '%';
    if (txt) txt.textContent = index === 0 ? 'Step 0 of 3' : index === 'result' ? 'Complete!' : `Step ${index} of 3`;
  }

  // Start button
  const startBtn = document.getElementById('amStartBtn');
  if (startBtn) startBtn.addEventListener('click', () => goToCard(1));

  // Option selection
  document.querySelectorAll('.am-options').forEach(group => {
    group.querySelectorAll('.am-opt').forEach(opt => {
      opt.addEventListener('click', () => {
        const q = group.dataset.q;
        const val = opt.dataset.val;
        answers[q] = val;

        // Highlight selected
        group.querySelectorAll('.am-opt').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');

        // Auto-advance with delay
        setTimeout(() => {
          if (+q < 3) {
            goToCard(+q + 1);
          } else {
            showAnalyzing();
          }
        }, 500);
      });
    });
  });

  function showAnalyzing() {
    // Create analyzing overlay if not exists
    let overlay = document.querySelector('.am-analyzing');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'am-analyzing';
      overlay.innerHTML = `
        <div class="am-analyzing-ring"></div>
        <div class="am-analyzing-text">Analyzing your profile...</div>
        <div class="am-analyzing-sub">Matching 5,000+ properties</div>
      `;
      document.querySelector('.am-wrapper').appendChild(overlay);
    }
    overlay.classList.add('active');

    const msgs = ['Analyzing your profile...', 'Cross-referencing market data...', 'Calculating match score...', 'Almost there...'];
    let mi = 0;
    const msgInt = setInterval(() => {
      overlay.querySelector('.am-analyzing-text').textContent = msgs[mi++ % msgs.length];
    }, 600);

    setTimeout(() => {
      clearInterval(msgInt);
      overlay.classList.remove('active');
      showResult();
    }, 2800);
  }

  function showResult() {
    // Determine persona from Q1 answer
    const pKey = answers['1'] || 'urban';
    const persona = personas[pKey];

    const badgeEl = document.getElementById('amResultBadge');
    const nameEl = document.getElementById('amResultName');
    const descEl = document.getElementById('amResultDesc');
    const imgEl = document.getElementById('amResultImg');
    const propEl = document.getElementById('amResultProp');
    const locEl = document.getElementById('amResultLoc');
    const priceEl = document.getElementById('amResultPrice');
    const pctEl = document.getElementById('amMatchPct');
    const traitsEl = document.getElementById('amTraits');

    if (badgeEl) badgeEl.textContent = persona.badge;
    if (nameEl) nameEl.textContent = persona.name;
    if (descEl) descEl.textContent = persona.desc;
    if (imgEl) imgEl.src = persona.img;
    if (propEl) propEl.textContent = persona.prop;
    if (locEl) locEl.textContent = persona.loc;
    if (priceEl) priceEl.textContent = persona.price;
    if (pctEl) pctEl.textContent = persona.pct + '% Match';
    
    if (traitsEl) {
      traitsEl.innerHTML = persona.traits.map(t => `<span class="am-trait">${t}</span>`).join('');
    }

    goToCard('result');
    setTimeout(launchConfetti, 400);
  }

  // Retry
  const retryBtn = document.getElementById('amRetryBtn');
  if (retryBtn) retryBtn.addEventListener('click', () => {
    Object.keys(answers).forEach(k => delete answers[k]);
    document.querySelectorAll('.am-opt').forEach(o => o.classList.remove('selected'));
    goToCard(0);
  });

  // Enquire
  const enquireBtn = document.getElementById('amEnquireBtn');
  if (enquireBtn) enquireBtn.addEventListener('click', openModal);

  /* --- Confetti Explosion --- */
  function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const colors = ['#c9a84c', '#e5c76b', '#22c55e', '#3b82f6', '#ec4899', '#f59e0b', '#fff'];
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -10,
      w: Math.random() * 8 + 4,
      h: Math.random() * 16 + 6,
      r: Math.random() * Math.PI * 2,
      dr: (Math.random() - 0.5) * 0.2,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
    }));

    let frame = 0;
    function animConfetti() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.r += p.dr;
        p.vy += 0.08;
        if (frame > 80) p.alpha -= 0.012;
        if (p.alpha > 0 && p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.r);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });
      frame++;
      if (alive) requestAnimationFrame(animConfetti);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    animConfetti();
  }

})();

/* ---- GALLERY EXPANDING CARDS ---- */
(function initGalleryAuto() {
  const galleryPanels = document.querySelectorAll('.g-panel');
  if (!galleryPanels.length) return;

  let activeIndex = 0;
  let autoPlayInterval;

  function setActivePanel(index) {
    galleryPanels.forEach(p => p.classList.remove('active'));
    galleryPanels[index].classList.add('active');
    activeIndex = index;
  }

  function nextPanel() {
    let nextIndex = activeIndex + 1;
    if (nextIndex >= galleryPanels.length) nextIndex = 0;
    setActivePanel(nextIndex);
  }

  function startAutoPlay() {
    autoPlayInterval = setInterval(nextPanel, 3500); // Changes every 3.5 seconds
  }

  function stopAutoPlay() {
    clearInterval(autoPlayInterval);
  }

  galleryPanels.forEach((panel, index) => {
    panel.addEventListener('mouseenter', () => {
      stopAutoPlay();
      setActivePanel(index);
    });
    
    panel.addEventListener('mouseleave', () => {
      startAutoPlay();
    });
  });

  // Start autoplay initially
  startAutoPlay();
})();


/* ---- MODALS & MYSTERY BOX LOGIC ---- */
(function initModals() {
  // Elements
  const loginModalOverlay = document.getElementById('loginModalOverlay');
  const loginModalClose = document.getElementById('loginModalClose');
  const loginForm = document.getElementById('loginForm');
  
  const propertyModalOverlay = document.getElementById('modalOverlay');
  const propertyModalClose = document.getElementById('modalClose');
  const propertyForm = document.getElementById('modalForm');

  // Buttons
  const listBtn = document.getElementById('listBtn'); // "Book Now"
  const loginBtn = document.getElementById('loginBtn'); // Navbar Sign In
  const heroLoginBtn = document.getElementById('heroLoginBtn'); // Hero Sign In
  const unlockBtn = document.getElementById('unlockBtn'); // Mystery Box Unlock
  const mysteryBookBtn = document.getElementById('mysteryBookBtn'); // Book inside revealed box

  // Mystery Box Elements
  const mysteryCard = document.getElementById('mysteryCard');
  const mysteryLocked = document.getElementById('mysteryLocked');
  const mysteryUnlocked = document.getElementById('mysteryUnlocked');

  // 3D Tilt Effect for Mystery Card
  if (mysteryCard) {
    mysteryCard.addEventListener('mousemove', (e) => {
      const rect = mysteryCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg
      const rotateY = ((x - centerX) / centerX) * 5;  // max 5 deg
      
      mysteryCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    mysteryCard.addEventListener('mouseleave', () => {
      mysteryCard.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  }

  // Helpers
  const openModal = (modal) => { if(modal) { modal.classList.add('active'); modal.style.display = 'flex'; } };
  const closeModal = (modal) => { if(modal) { modal.classList.remove('active'); modal.style.display = 'none'; } };

  // Setup Initial State for Modals (ensure they are hidden)
  closeModal(loginModalOverlay);
  closeModal(propertyModalOverlay);

  // Book Now Button
  if (listBtn) {
    listBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(propertyModalOverlay);
    });
  }

  // Mystery Book Btn
  if (mysteryBookBtn) {
    mysteryBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(propertyModalOverlay);
    });
  }

  // Login Buttons
  const openLogin = (e) => { e.preventDefault(); openModal(loginModalOverlay); };
  if (loginBtn) loginBtn.addEventListener('click', openLogin);
  if (heroLoginBtn) heroLoginBtn.addEventListener('click', openLogin);
  if (unlockBtn) unlockBtn.addEventListener('click', openLogin);

  // Close Buttons
  if (loginModalClose) loginModalClose.addEventListener('click', () => closeModal(loginModalOverlay));
  if (propertyModalClose) propertyModalClose.addEventListener('click', () => closeModal(propertyModalOverlay));

  // Close on Outside Click
  window.addEventListener('click', (e) => {
    if (e.target === loginModalOverlay) closeModal(loginModalOverlay);
    if (e.target === propertyModalOverlay) closeModal(propertyModalOverlay);
  });

  // Handle Login Form Submit (Simulates Login and Unlocks Mystery Box)
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate login process (Show loader or just instantly login)
      const btn = loginForm.querySelector('button');
      const originalText = btn.textContent;
      btn.textContent = "Authenticating...";
      
      setTimeout(() => {
        closeModal(loginModalOverlay);
        btn.textContent = originalText;
        
        // Trigger Mystery Box Unlock Animation!
        if (mysteryLocked && mysteryUnlocked && mysteryCard) {
          // Scroll to mystery box
          document.getElementById('mystery').scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          setTimeout(() => {
            // Hide locked (keyhole scales up massively and fades)
            mysteryLocked.classList.add('hide-locked');
            
            // Show unlocked
            setTimeout(() => {
              mysteryUnlocked.classList.remove('hidden');
              
              // Golden Particle Explosion (Confetti)
              for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                const size = Math.random() * 6 + 4;
                particle.style.cssText = `
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  width: ${size}px;
                  height: ${size}px;
                  background: ${Math.random() > 0.5 ? '#c9a84c' : '#e5c76b'};
                  border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
                  pointer-events: none;
                  z-index: 100;
                  box-shadow: 0 0 10px rgba(201,168,76,0.5);
                  transition: transform 1s cubic-bezier(0.25, 1, 0.5, 1), opacity 1s ease-out;
                  transform: translate(-50%, -50%) scale(0);
                  opacity: 1;
                `;
                mysteryCard.appendChild(particle);
                
                // Animate
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 300 + 100;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                const rot = Math.random() * 360;
                
                requestAnimationFrame(() => {
                  particle.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${rot}deg) scale(1)`;
                  particle.style.opacity = '0';
                });
                
                // Cleanup
                setTimeout(() => particle.remove(), 1000);
              }
              
            }, 600); // Wait for keyhole to zoom through
          }, 500); // Short delay after scrolling
        }
      }, 800);
    });
  }

  // Handle Property Booking Form Submit
  if (propertyForm) {
    propertyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = propertyForm.querySelector('button');
      const originalText = btn.textContent;
      btn.textContent = "Booking Confirmed! ✓";
      btn.style.backgroundColor = "#2d9f6a";
      
      setTimeout(() => {
        closeModal(propertyModalOverlay);
        btn.textContent = originalText;
        btn.style.backgroundColor = "";
        propertyForm.reset();
      }, 2000);
    });
  }
})();

/* ---- CONTACT SECTION ANIMATIONS ---- */
(function initContactAnimations() {

  // 1. Stagger-in contact items when section enters view
  const contactItems = document.querySelectorAll('.ci-animate');
  if (contactItems.length) {
    const ciObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          ciObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    contactItems.forEach(item => ciObserver.observe(item));
  }

  // 2. Animated trust number counters
  const trustNumbers = document.querySelectorAll('.trust-number');
  if (trustNumbers.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          const duration = 1800;
          const step = target / (duration / 16);
          let current = 0;

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = Math.floor(current).toLocaleString();
          }, 16);

          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    trustNumbers.forEach(el => countObserver.observe(el));
  }

  // 3. Ripple effect on submit button
  const submitBtn = document.getElementById('submitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', function(e) {
      const ripple = this.querySelector('.submit-ripple');
      if (!ripple) return;
      const rect = this.getBoundingClientRect();
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top  = (e.clientY - rect.top) + 'px';
    });
  }

  // 4. Contact form submit with loading state
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.contact-submit');
      const textEl = btn?.querySelector('.submit-text');
      const iconEl = btn?.querySelector('.submit-icon');

      if (btn) {
        btn.disabled = true;
        if (textEl) textEl.textContent = 'Sending...';
        if (iconEl) iconEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-dasharray="31" stroke-dashoffset="31" style="animation: dashSpin 1s linear infinite;"/></svg>`;

        setTimeout(() => {
          if (textEl) textEl.textContent = '✓ Message Sent!';
          if (iconEl) iconEl.innerHTML = '';
          btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

          setTimeout(() => {
            btn.disabled = false;
            if (textEl) textEl.textContent = 'Send Message';
            if (iconEl) iconEl.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4z"/><path d="M22 2 11 13"/></svg>`;
            btn.style.background = '';
            contactForm.reset();
          }, 2500);
        }, 1800);
      }
    });
  }
})();