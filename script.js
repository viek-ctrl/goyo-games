/* =================================================================
   GOYO GAMES — Script
   Vanilla JS: nav behavior, scroll reveals, animated counters,
   parallax blobs, back-to-top. Respects prefers-reduced-motion.
   ================================================================= */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Header scroll state ---------------- */
  var header = document.getElementById('siteHeader');
  var backToTop = document.getElementById('backToTop');

  function onScroll() {
    var scrolled = window.scrollY > 40;
    header.classList.toggle('is-scrolled', scrolled);

    if (backToTop) {
      var showBtn = window.scrollY > 600;
      backToTop.classList.toggle('is-visible', showBtn);
      backToTop.hidden = !showBtn;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------------- Mobile nav toggle ---------------- */
  var navToggle = document.getElementById('navToggle');
  var mobileNav = document.getElementById('mobileNav');

  function closeMobileNav() {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    mobileNav.hidden = true;
  }

  function openMobileNav() {
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    mobileNav.hidden = false;
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var expanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMobileNav();
    });
  }

  /* ---------------- Close mobile menu on resize to desktop ---------------- */
  window.addEventListener('resize', function () {
    if (window.innerWidth > 760) closeMobileNav();
  });

  /* ---------------- Scroll reveal animations ---------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            // small stagger for elements revealed together
            var delay = Math.min(i * 60, 240);
            setTimeout(function () {
              entry.target.classList.add('is-visible');
            }, delay);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // No IntersectionObserver support, or user prefers reduced motion:
    // show everything immediately.
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ---------------- Animated stat counters ---------------- */
  var statNumbers = document.querySelectorAll('.stat-number');

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduceMotion) {
      el.textContent = target + suffix;
      return;
    }

    var duration = 1600;
    var startTime = null;

    function step(timestamp) {
      if (startTime === null) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // ease-out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  if (statNumbers.length) {
    if ('IntersectionObserver' in window) {
      var statObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              statObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      statNumbers.forEach(function (el) {
        statObserver.observe(el);
      });
    } else {
      statNumbers.forEach(animateCount);
    }
  }

  /* ---------------- Subtle parallax on hero blobs ---------------- */
  var heroBlobsContainer = document.querySelector('.hero-blobs');

  if (heroBlobsContainer && !reduceMotion && window.matchMedia('(min-width: 760px)').matches) {
    var blobs = heroBlobsContainer.querySelectorAll('.blob');
    var ticking = false;
    var pointerX = 0;
    var pointerY = 0;

    window.addEventListener('mousemove', function (e) {
      pointerX = (e.clientX / window.innerWidth) - 0.5;
      pointerY = (e.clientY / window.innerHeight) - 0.5;

      if (!ticking) {
        requestAnimationFrame(function () {
          blobs.forEach(function (blob, i) {
            var depth = (i + 1) * 6;
            blob.style.translate = (pointerX * depth) + 'px ' + (pointerY * depth) + 'px';
          });
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ---------------- Smooth-scroll fallback for older browsers ---------------- */
  if (!('scrollBehavior' in document.documentElement.style)) {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId.length > 1) {
          var targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }
})();
