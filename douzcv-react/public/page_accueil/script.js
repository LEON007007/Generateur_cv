// ═══════════════════════════════════════════════════════════════════════════
// douzCv • ULTRA-DESIGN JAVASCRIPT ENGINE (VANILLA JS)
// ═══════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. HERO SCROLLYTELLING 236 FRAMES (ULTRA-FAST PRELOADER & CACHE) ─────────
  const TOTAL_FRAMES = 236;
  const imgEl = document.getElementById('anim-img');
  const progressBar = document.getElementById('progress-bar');
  const heroTrack = document.getElementById('hero-track');

  // Pre-computed frame paths cache for zero string allocation during scroll
  const heroPaths = new Array(TOTAL_FRAMES + 1);
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    heroPaths[i] = `/images/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
  }

  function getFramePath(index) {
    return heroPaths[index] || heroPaths[1];
  }

  // Fast In-Memory Image Cache and Bitmap Array
  const heroLoadedMap = new Uint8Array(TOTAL_FRAMES + 1);
  const heroImages = new Array(TOTAL_FRAMES + 1);

  function preloadHeroFrame(index) {
    if (heroLoadedMap[index]) return Promise.resolve();
    return new Promise((resolve) => {
      const img = new Image();
      img.src = heroPaths[index];
      img.onload = () => {
        heroLoadedMap[index] = 1;
        heroImages[index] = img;
        resolve();
      };
      img.onerror = resolve;
    });
  }

  // Instant Closest-Frame Fallback (Prevents any blank screen/lag during quick scroll)
  function getBestAvailableHeroPath(idx) {
    if (heroLoadedMap[idx]) return heroPaths[idx];
    for (let offset = 1; offset < 30; offset++) {
      if (idx - offset >= 1 && heroLoadedMap[idx - offset]) return heroPaths[idx - offset];
      if (idx + offset <= TOTAL_FRAMES && heroLoadedMap[idx + offset]) return heroPaths[idx + offset];
    }
    return heroPaths[1];
  }

  // Concurrency Pipeline: Rapid Preload Pool
  async function runHeroPreloader() {
    // 1. Critical Initial Batch (Frames 1-25)
    for (let i = 1; i <= 25; i++) {
      preloadHeroFrame(i);
    }
    await Promise.all([preloadHeroFrame(1), preloadHeroFrame(2), preloadHeroFrame(3), preloadHeroFrame(4), preloadHeroFrame(5)]);

    // 2. High-Speed Stepped Keyframes (Every 2nd frame across all 236 frames)
    const keyframes = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += 2) {
      if (!heroLoadedMap[i]) keyframes.push(i);
    }

    const CONCURRENCY = 8;
    for (let i = 0; i < keyframes.length; i += CONCURRENCY) {
      const chunk = keyframes.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map(preloadHeroFrame));
    }

    // 3. Fill in remaining intermediate frames
    const remaining = [];
    for (let i = 2; i <= TOTAL_FRAMES; i += 2) {
      if (!heroLoadedMap[i]) remaining.push(i);
    }
    for (let i = 0; i < remaining.length; i += CONCURRENCY) {
      const chunk = remaining.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map(preloadHeroFrame));
    }
  }

  // Start preloader immediately
  runHeroPreloader();


  // ── 1.B ATS SCROLLYTELLING 240 FRAMES (DEFERRED ON-DEMAND PRELOADER) ────────
  const ATS_TOTAL_FRAMES = 240;
  const atsImgEl = document.getElementById('ats-anim-img');
  const atsTrack = document.getElementById('ats-track');

  const atsPaths = new Array(ATS_TOTAL_FRAMES + 1);
  for (let i = 1; i <= ATS_TOTAL_FRAMES; i++) {
    atsPaths[i] = `/images2/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
  }

  function getAtsFramePath(index) {
    return atsPaths[index] || atsPaths[1];
  }

  const atsLoadedMap = new Uint8Array(ATS_TOTAL_FRAMES + 1);
  const atsImages = new Array(ATS_TOTAL_FRAMES + 1);

  function preloadAtsFrame(index) {
    if (atsLoadedMap[index]) return Promise.resolve();
    return new Promise((resolve) => {
      const img = new Image();
      img.src = atsPaths[index];
      img.onload = () => {
        atsLoadedMap[index] = 1;
        atsImages[index] = img;
        resolve();
      };
      img.onerror = resolve;
    });
  }

  function getBestAvailableAtsPath(idx) {
    if (atsLoadedMap[idx]) return atsPaths[idx];
    for (let offset = 1; offset < 30; offset++) {
      if (idx - offset >= 1 && atsLoadedMap[idx - offset]) return atsPaths[idx - offset];
      if (idx + offset <= ATS_TOTAL_FRAMES && atsLoadedMap[idx + offset]) return atsPaths[idx + offset];
    }
    return atsPaths[1];
  }

  let atsPreloaderStarted = false;
  async function runAtsPreloader() {
    if (atsPreloaderStarted) return;
    atsPreloaderStarted = true;

    // Load initial 15 frames of ATS
    for (let i = 1; i <= 15; i++) {
      preloadAtsFrame(i);
    }

    // Keyframes every 2nd frame
    const atsKeyframes = [];
    for (let i = 1; i <= ATS_TOTAL_FRAMES; i += 2) {
      if (!atsLoadedMap[i]) atsKeyframes.push(i);
    }
    const CONCURRENCY = 8;
    for (let i = 0; i < atsKeyframes.length; i += CONCURRENCY) {
      const chunk = atsKeyframes.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map(preloadAtsFrame));
    }

    // Remaining intermediate frames
    const remaining = [];
    for (let i = 2; i <= ATS_TOTAL_FRAMES; i += 2) {
      if (!atsLoadedMap[i]) remaining.push(i);
    }
    for (let i = 0; i < remaining.length; i += CONCURRENCY) {
      const chunk = remaining.slice(i, i + CONCURRENCY);
      await Promise.all(chunk.map(preloadAtsFrame));
    }
  }

  // Defer ATS loading until user scrolls towards ATS section (saves bandwidth)
  if (atsTrack) {
    const atsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runAtsPreloader();
        atsObserver.disconnect();
      }
    }, { rootMargin: '600px 0px' });
    atsObserver.observe(atsTrack);
  }


  // ── 1.C HIGH-PERFORMANCE 60/120 FPS LERP SCROLL ENGINE ─────────────────────
  let currentFrame = 1;
  let targetFrame = 1;
  let lastHeroIdx = -1;

  let currentAtsFrame = 1;
  let targetAtsFrame = 1;
  let lastAtsIdx = -1;

  function handleScroll() {
    // 1. Hero track calculation
    if (heroTrack) {
      const trackRect = heroTrack.getBoundingClientRect();
      const scrollable = heroTrack.offsetHeight - window.innerHeight;

      if (scrollable > 0) {
        const scrolled = -trackRect.top;
        const p = Math.max(0, Math.min(1, scrolled / scrollable));
        const frameProgress = Math.max(0, Math.min(1, p / 0.80));
        targetFrame = 1 + frameProgress * (TOTAL_FRAMES - 1);
      }
    }

    // 2. Global progress bar
    if (progressBar) {
      const totalDocScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalDocScroll > 0) {
        const globalP = Math.max(0, Math.min(1, window.scrollY / totalDocScroll));
        progressBar.style.width = (globalP * 100) + '%';
      }
    }

    // 3. ATS track calculation
    if (atsTrack) {
      const atsRect = atsTrack.getBoundingClientRect();
      const atsScrollable = atsTrack.offsetHeight - window.innerHeight;

      if (atsScrollable > 0) {
        const atsScrolled = -atsRect.top;
        const atsP = Math.max(0, Math.min(1, atsScrolled / atsScrollable));
        const atsFrameProgress = Math.max(0, Math.min(1, atsP / 0.85));
        targetAtsFrame = 1 + atsFrameProgress * (ATS_TOTAL_FRAMES - 1);
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  window.addEventListener('orientationchange', handleScroll, { passive: true });
  handleScroll();

  function loop() {
    // 1. Hero Lerp
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.001) {
      currentFrame += diff * 0.32;
      const idx = Math.max(1, Math.min(TOTAL_FRAMES, Math.round(currentFrame)));
      if (idx !== lastHeroIdx) {
        lastHeroIdx = idx;
        if (imgEl) {
          imgEl.src = getBestAvailableHeroPath(idx);
        }
      }
    }

    // 2. ATS Lerp
    const atsDiff = targetAtsFrame - currentAtsFrame;
    if (Math.abs(atsDiff) > 0.001) {
      currentAtsFrame += atsDiff * 0.32;
      const idxAts = Math.max(1, Math.min(ATS_TOTAL_FRAMES, Math.round(currentAtsFrame)));
      if (idxAts !== lastAtsIdx) {
        lastAtsIdx = idxAts;
        if (atsImgEl) {
          atsImgEl.src = getBestAvailableAtsPath(idxAts);
        }
      }
    }

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);


  // ── 2. ANIMATION 2: WORD-BY-WORD TITLE REVEAL WITH BLUR & STAGGER ─────────
  const revealTitles = document.querySelectorAll('[data-reveal-words]');

  revealTitles.forEach(titleEl => {
    const rawText = titleEl.innerText.trim();
    const words = rawText.split(/\s+/);
    titleEl.innerHTML = '';

    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      span.style.transitionDelay = `${index * 80}ms`;
      titleEl.appendChild(span);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const spans = titleEl.querySelectorAll('.word');
          spans.forEach(s => s.classList.add('in-view'));
          observer.unobserve(titleEl);
        }
      });
    }, { threshold: 0.15 });

    observer.observe(titleEl);
  });


  // ── 3. ANIMATION 3: MORPHING ICON BADGE (1.8s Interval Fade) ──────────────
  const iconBadge = document.querySelector('.icon-badge');
  if (iconBadge) {
    const morphIcons = iconBadge.querySelectorAll('.morph-icon');
    let currentIconIndex = 0;

    if (morphIcons.length > 1) {
      setInterval(() => {
        const currentIcon = morphIcons[currentIconIndex];
        const nextIndex = (currentIconIndex + 1) % morphIcons.length;
        const nextIcon = morphIcons[nextIndex];

        // Fade out current
        currentIcon.classList.remove('active');

        // Fade in next after slight transition overlap
        setTimeout(() => {
          nextIcon.classList.add('active');
          currentIconIndex = nextIndex;
        }, 150);

      }, 1800);
    }
  }


  // ── 4. ANIMATION 4: TEMPLATE CARDS STAGGER REVEAL ────────────────────────
  const templatesContainer = document.getElementById('templates-stagger-container');
  if (templatesContainer) {
    const cards = templatesContainer.querySelectorAll('.template-card');

    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 100}ms`;
            card.classList.add('in-view');
          });
          staggerObserver.unobserve(templatesContainer);
        }
      });
    }, { threshold: 0.2 });

    staggerObserver.observe(templatesContainer);
  }


  // ── 5. INTERACTIVE ATS SIMULATOR ──────────────────────────────────────────
  const stateSelector = document.getElementById('ats-state-selector');
  const stateScanning = document.getElementById('ats-state-scanning');
  const stateResults = document.getElementById('ats-state-results');

  const btnScanClassic = document.getElementById('btn-scan-classic');
  const btnScanDouzcv = document.getElementById('btn-scan-douzcv');
  const btnResetScan = document.getElementById('btn-reset-scan');

  const scanStatus = document.getElementById('scan-status');
  const scanProgressFill = document.getElementById('scan-progress-fill');
  const scanConsole = document.getElementById('scan-console');

  const scoreCircleElement = document.getElementById('score-circle-element');
  const scoreVal = document.getElementById('score-val');
  const scoreBadge = document.getElementById('score-badge');
  const scoreDesc = document.getElementById('score-desc');

  const auditFill1 = document.getElementById('audit-fill-1');
  const auditFill2 = document.getElementById('audit-fill-2');
  const auditFill3 = document.getElementById('audit-fill-3');

  const auditPct1 = document.getElementById('audit-pct-1');
  const auditPct2 = document.getElementById('audit-pct-2');
  const auditPct3 = document.getElementById('audit-pct-3');

  function switchAtsState(stateName) {
    if (!stateSelector || !stateScanning || !stateResults) return;
    [stateSelector, stateScanning, stateResults].forEach(s => s.classList.remove('active'));
    if (stateName === 'selector') stateSelector.classList.add('active');
    if (stateName === 'scanning') stateScanning.classList.add('active');
    if (stateName === 'results') stateResults.classList.add('active');
  }

  function addScanLog(text, delay) {
    setTimeout(() => {
      if (!scanConsole) return;
      const log = document.createElement('div');
      log.textContent = `> ${text}`;
      scanConsole.appendChild(log);
      scanConsole.scrollTop = scanConsole.scrollHeight;
    }, delay);
  }

  function runAuditSimulation(isDouzCv) {
    switchAtsState('scanning');
    if (scanProgressFill) scanProgressFill.style.width = '0%';
    if (scanConsole) scanConsole.innerHTML = '';
    if (scanStatus) scanStatus.textContent = 'Lecture du document...';

    const logs = [
      { t: "Fichier initialisé...", d: 0 },
      { t: "Extraction du flux textuel (Parseur de chaînes)...", d: 400 },
      { t: "Validation structurelle sémantique...", d: 900 },
      { t: isDouzCv ? "[Conforme] Balises et rubriques standards détectées." : "[Attention] Tableaux/Colonnes complexes détectés (risque d'illisibilité).", d: 1300 },
      { t: "Correspondance dictionnaire de mots-clés...", d: 1700 },
      { t: isDouzCv ? "[Succès] Densité de compétences clés élevée (STAR)." : "[Manque] Terminologie métier insuffisante.", d: 2100 },
      { t: "Calcul final du score de compatibilité...", d: 2500 },
      { t: "Génération du rapport d'audit...", d: 2800 }
    ];

    logs.forEach(item => addScanLog(item.t, item.d));

    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      if (scanProgressFill) scanProgressFill.style.width = `${progress}%`;
      if (scanStatus) {
        if (progress >= 30 && progress < 60) scanStatus.textContent = "Analyse sémantique en cours...";
        if (progress >= 60 && progress < 90) scanStatus.textContent = "Indexation des mots-clés...";
        if (progress >= 90) scanStatus.textContent = "Finalisation de l'audit...";
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => displayAuditResults(isDouzCv), 400);
      }
    }, 30);
  }

  function animateCounter(element, target, duration) {
    if (!element) return;
    let start = 0;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = `${target}%`;
        clearInterval(timer);
      } else {
        element.textContent = `${Math.round(start)}%`;
      }
    }, stepTime);
  }

  function displayAuditResults(isDouzCv) {
    switchAtsState('results');

    const data = isDouzCv ? {
      score: 98,
      crit1: 100,
      crit2: 96,
      crit3: 98,
      badge: "EXCELLENT • CANDIDATURE PRIORITAIRE",
      desc: "Votre profil a 3,8x plus de chances d'obtenir un entretien.",
      color: "#10B981",
      bg: "rgba(16, 185, 129, 0.09)",
      shadow: "0 0 24px rgba(16, 185, 129, 0.2)",
      badgeBg: "rgba(16, 185, 129, 0.15)"
    } : {
      score: 54,
      crit1: 45,
      crit2: 60,
      crit3: 55,
      badge: "NON CONFORME • ALERTE REJET",
      desc: "Risque élevé de rejet par les robots de tri ATS (Workday, Taleo, etc.).",
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.09)",
      shadow: "0 0 24px rgba(239, 68, 68, 0.2)",
      badgeBg: "rgba(239, 68, 68, 0.15)"
    };

    if (scoreCircleElement) {
      scoreCircleElement.style.borderColor = data.color;
      scoreCircleElement.style.background = data.bg;
      scoreCircleElement.style.boxShadow = data.shadow;
    }
    if (scoreBadge) {
      scoreBadge.style.background = data.badgeBg;
      scoreBadge.style.color = data.color;
      scoreBadge.textContent = data.badge;
    }
    if (scoreDesc) {
      scoreDesc.textContent = data.desc;
    }

    animateCounter(scoreVal, data.score, 600);
    animateCounter(auditPct1, data.crit1, 600);
    animateCounter(auditPct2, data.crit2, 600);
    animateCounter(auditPct3, data.crit3, 600);

    setTimeout(() => {
      if (auditFill1) { auditFill1.style.width = `${data.crit1}%`; auditFill1.style.background = data.color; }
      if (auditFill2) { auditFill2.style.width = `${data.crit2}%`; auditFill2.style.background = data.color; }
      if (auditFill3) { auditFill3.style.width = `${data.crit3}%`; auditFill3.style.background = data.color; }
    }, 100);
  }

  if (btnScanClassic && btnScanDouzcv && btnResetScan) {
    btnScanClassic.addEventListener('click', () => runAuditSimulation(false));
    btnScanDouzcv.addEventListener('click', () => runAuditSimulation(true));
    btnResetScan.addEventListener('click', () => switchAtsState('selector'));
  }


  // ── 6. FAQ ACCORDION ──────────────────────────────────────────────────────
  const faqCards = document.querySelectorAll('.faq-card');
  faqCards.forEach(card => {
    const toggle = card.querySelector('.faq-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        faqCards.forEach(c => c.classList.remove('open'));
        if (!isOpen) {
          card.classList.add('open');
        }
      });
    }
  });


  // ── 7. SCROLL-REVEAL DIRECTIONAL ENGINE (LEFT / RIGHT / UP) ────────────────
  const revealElements = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, [data-reveal]');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => {
      const delay = el.getAttribute('data-delay');
      if (delay) {
        el.style.transitionDelay = `${delay}ms`;
      }
      revealObserver.observe(el);
    });

    // Check viewport on initial load
    const checkInitialReveal = () => {
      const triggerBottom = window.innerHeight * 0.95;
      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerBottom) {
          el.classList.add('in-view');
          revealObserver.unobserve(el);
        }
      });
    };

    checkInitialReveal();
    window.addEventListener('scroll', checkInitialReveal, { passive: true });
  }

  // ── 8. TYPEWRITER EFFECT ──────────────────────────────────────────────────
  const typeTarget = document.getElementById('typewriter-target');
  if (typeTarget) {
    const phrases = [
      "propulse votre carrière.",
      "décroche l'entretien.",
      "bat les algorithmes ATS.",
      "sublime votre parcours."
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
      const currentPhrase = phrases[phraseIndex];
      
      if (isDeleting) {
        typeTarget.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typeTarget.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
      }

      setTimeout(typeEffect, typingSpeed);
    }
    
    setTimeout(typeEffect, 1000);
  }

});
