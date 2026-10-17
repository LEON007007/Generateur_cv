document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progressBar = document.getElementById('progress-bar');
  const stories = [
    { track: document.getElementById('hero-track'), image: document.getElementById('anim-img'), total: 236, path: '/images/ezgif-frame-' },
    { track: document.getElementById('letter-track'), image: document.getElementById('letter-img'), total: 240, path: '/images2/ezgif-frame-' }
  ].filter((story) => story.track && story.image);

  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Ouvrir le menu');
    mobileMenu.classList.remove('is-open');
    mobileMenu.inert = true;
    document.body.classList.remove('menu-open');
  };

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
        return;
      }
      menuButton.setAttribute('aria-expanded', 'true');
      menuButton.setAttribute('aria-label', 'Fermer le menu');
      mobileMenu.classList.add('is-open');
      mobileMenu.inert = false;
      document.body.classList.add('menu-open');
      mobileMenu.querySelector('a')?.focus();
    });
    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
        menuButton.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) closeMenu();
    }, { passive: true });
  }

  document.querySelectorAll('[data-reveal-words]').forEach((title) => {
    let wordIndex = 0;
    title.querySelectorAll('[data-word-line]').forEach((line) => {
      const words = line.textContent.trim().split(/\s+/);
      line.replaceChildren();
      words.forEach((word) => {
        const wordElement = document.createElement('span');
        wordElement.className = 'word';
        wordElement.textContent = word;
        wordElement.style.transitionDelay = `${wordIndex * 65}ms`;
        line.append(wordElement, document.createTextNode(' '));
        wordIndex += 1;
      });
    });

    const revealTitle = () => title.classList.add('is-visible');
    if (reduceMotion) revealTitle();
    else window.setTimeout(revealTitle, 40);
  });

  const iconBadge = document.querySelector('.icon-badge');
  if (iconBadge && !reduceMotion) {
    const morphIcons = [...iconBadge.querySelectorAll('.morph-icon')];
    let activeIcon = 0;
    let morphTimer = 0;

    const startMorph = () => {
      if (morphTimer || document.hidden || morphIcons.length < 2) return;
      morphTimer = window.setInterval(() => {
        morphIcons[activeIcon].classList.remove('active');
        activeIcon = (activeIcon + 1) % morphIcons.length;
        morphIcons[activeIcon].classList.add('active');
      }, 1800);
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        window.clearInterval(morphTimer);
        morphTimer = 0;
      } else {
        startMorph();
      }
    });
    startMorph();
  }

  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((element) => revealObserver.observe(element));
  }

  let activeStories = new Set();
  if ('IntersectionObserver' in window) {
    const storyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeStories.add(entry.target);
        else activeStories.delete(entry.target);
      });
    }, { rootMargin: '100% 0px' });
    stories.forEach(({ track }) => storyObserver.observe(track));
  } else {
    activeStories = new Set(stories.map(({ track }) => track));
  }

  let frameRequest = 0;
  const displayedFrames = new WeakMap();
  const updateOnScroll = () => {
    frameRequest = 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
    if (reduceMotion) return;

    activeStories.forEach((track) => {
      const story = stories.find((item) => item.track === track);
      if (!story) return;
      const distance = track.offsetHeight - window.innerHeight;
      if (distance <= 0) return;
      const scrolled = Math.min(distance, Math.max(0, -track.getBoundingClientRect().top));
      const frame = Math.min(story.total, Math.max(1, Math.round(1 + (scrolled / distance) * (story.total - 1))));
      if (displayedFrames.get(story.image) === frame) return;
      displayedFrames.set(story.image, frame);
      story.image.src = `${story.path}${String(frame).padStart(3, '0')}.jpg`;
    });
  };

  const requestUpdate = () => {
    if (!frameRequest) frameRequest = window.requestAnimationFrame(updateOnScroll);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });

  if (reduceMotion) {
    stories.forEach(({ image, total, path }) => {
      const midpoint = Math.ceil(total / 2);
      image.src = `${path}${String(midpoint).padStart(3, '0')}.jpg`;
    });
  }
  requestUpdate();
});