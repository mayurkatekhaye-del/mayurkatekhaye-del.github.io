/* Mayur Katekhaye portfolio interactions — vanilla JavaScript, no dependencies. */
(() => {
  'use strict';

  const body = document.body;
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const year = document.getElementById('year');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  body.classList.add('js-enabled');
  if (year) year.textContent = String(new Date().getFullYear());

  // Mobile navigation: keep the button state in sync with the menu.
  const setMenuOpen = (isOpen) => {
    if (!menuToggle || !navLinks) return;
    navLinks.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.innerHTML = isOpen ? '✕ <span>Close</span>' : '☰ <span>Menu</span>';
  };

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
      setMenuOpen(isOpen);
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('click', (event) => {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        setMenuOpen(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });
  }

  // Highlight the navigation link for the section currently in view.
  const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
  const sections = navAnchors
    .map((anchor) => document.querySelector(anchor.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((anchor) => {
          const active = anchor.getAttribute('href') === `#${entry.target.id}`;
          if (active) anchor.setAttribute('aria-current', 'location');
          else anchor.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  // Subtle reveal effect with accessibility fallback for reduced motion.
  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealItems = document.querySelectorAll(
      '.section-heading, .panel, .profile-card'
    );
    revealItems.forEach((item) => item.classList.add('reveal-on-scroll'));

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

    revealItems.forEach((item) => revealObserver.observe(item));
  }

  // Contact form validates locally and prepares a message in the visitor's email app.
  // No form values are uploaded or stored by this static website.
  if (contactForm && formNote) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const data = new FormData(contactForm);
      const senderName = String(data.get('name') || '').trim();
      const senderEmail = String(data.get('email') || '').trim();
      const message = String(data.get('message') || '').trim();

      if (!senderName || !senderEmail || !message) {
        formNote.textContent = 'Please complete all fields before continuing.';
        formNote.classList.remove('disclaimer');
        return;
      }

      const subject = encodeURIComponent(`Portfolio contact from ${senderName}`);
      const bodyText = encodeURIComponent(
        `Name: ${senderName}\nEmail: ${senderEmail}\n\nMessage:\n${message}`
      );
      formNote.classList.remove('disclaimer');
      formNote.textContent = 'Opening your email app with the message drafted. Review it and send it from there.';
      window.location.href = `mailto:mayurkatekhaye13@gmail.com?subject=${subject}&body=${bodyText}`;
    });
  }
})();
