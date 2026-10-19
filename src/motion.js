/**
 * Ivson Ferreira — V5 scroll motion.
 * Entrances start at the actual viewport boundary; no pre-observer with huge root margins.
 * Keep content visibly present before JS starts and keep the existing green 3D journey intact.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia('(pointer: fine) and (min-width: 1100px)').matches;
const compact = window.matchMedia('(max-width: 700px)').matches;
const safari = /Safari/i.test(navigator.userAgent) && !/Chrome|Chromium|CriOS|Edg/i.test(navigator.userAgent);
const saveData = navigator.connection?.saveData === true;
let smoothScroll = null;
let smoothTicker = null;

// Lenis only on capable desktop browsers. Native touch scrolling is faster, and Safari
// already has an optimized inertial scroll; do not block either with a fake scroll layer.
if (fine && !safari && !reduce && !saveData) {
  import('lenis').then(({ default: Lenis }) => {
    smoothScroll = new Lenis({ duration: 0.72, smoothWheel: true, wheelMultiplier: 1 });
    smoothScroll.on('scroll', ScrollTrigger.update);
    smoothTicker = (time) => smoothScroll?.raf(time * 1000);
    gsap.ticker.add(smoothTicker);
    gsap.ticker.lagSmoothing(0);
  }).catch((error) => console.warn('Rolagem nativa utilizada:', error));
}

if (!reduce) {
  // The headline animation is visible on load, and finishes quickly.
  if (document.querySelector('.hero')) {
    const revealHero = gsap.timeline({ defaults: { ease: 'power3.out' } });
    revealHero
      .fromTo('.hero .eyebrow', { opacity: .5, y: 12 }, { opacity: 1, y: 0, duration: .46 }, 0)
      .fromTo('.hero h1 span', { opacity: .46, y: 33, rotateX: 5 },
        { opacity: 1, y: 0, rotateX: 0, duration: .72, stagger: .09, clearProps: 'transform' }, .06)
      .fromTo('.hero-sub', { opacity: .4, y: 15 }, { opacity: 1, y: 0, duration: .62 }, .19)
      .fromTo('.hero-buttons > *', { opacity: .5, y: 13 }, { opacity: 1, y: 0, duration: .53, stagger: .1 }, .27);

    if (fine) {
      gsap.fromTo('.hero-picture', { yPercent: -1.2 }, { yPercent: 3.2, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .35 } });
    }
  }

  // GSAP owns all scroll reveals.
  // Never pop or snap visible elements: elements below viewport fade in smoothly upon entering.
  const revealNodes = Array.from(document.querySelectorAll('[data-reveal]'));
  revealNodes.forEach((node) => {
    const isCard = node.classList.contains('project-card');
    const visual = isCard ? (node.querySelector('.project-photo') || node) : node;
    const rect = node.getBoundingClientRect();
    const inInitialView = rect.top < window.innerHeight && rect.bottom > 0;

    if (!inInitialView) {
      gsap.set(visual, { opacity: 0, y: compact ? 16 : 24 });
    }

    ScrollTrigger.create({
      trigger: node,
      start: compact ? 'top 95%' : 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(visual, {
          opacity: 1,
          y: 0,
          duration: compact ? 0.55 : 0.8,
          ease: 'power2.out',
          overwrite: 'auto',
          clearProps: 'opacity,transform'
        });
      }
    });
  });

  // Additional entrances between sections: subtle, editorial, zero flicker.
  const extras = [
    '.intro-top', '.projects-intro .eyebrow', '.projects-intro .text-link',
    '.material-head', '.steps-head', '.cta-end h2', '.cta-end .btn',
    '.footer-identity .footer-manifesto', '.footer-primary-link',
    '.footer-right', '.portfolio-hero', '.detail-story',
    '.contact-left .eyebrow', '.form-shell', '.step-row', '.material-item'
  ];
  const alreadyRevealed = new Set(revealNodes);
  document.querySelectorAll(extras.join(',')).forEach((element) => {
    if (alreadyRevealed.has(element) || element.closest('.journey')) return;
    const rect = element.getBoundingClientRect();
    const inInitialView = rect.top < window.innerHeight && rect.bottom > 0;

    if (!inInitialView) {
      gsap.set(element, { opacity: 0, y: compact ? 14 : 20 });
    }

    ScrollTrigger.create({
      trigger: element,
      start: compact ? 'top 95%' : 'top 90%',
      once: true,
      onEnter: () => {
        gsap.to(element, {
          opacity: 1,
          y: 0,
          duration: compact ? 0.5 : 0.72,
          ease: 'power2.out',
          overwrite: 'auto',
          clearProps: 'opacity,transform'
        });
      }
    });
  });

  // Divider animations respond to the user's motion while crossing between blocks.
  document.querySelectorAll('.story-transition .story-transition-line').forEach((line) => {
    gsap.fromTo(line, { scaleX: .12, transformOrigin: 'left center' }, {
      scaleX: 1, ease: 'none',
      scrollTrigger: {
        trigger: line.closest('.story-transition'),
        start: 'top 97%', end: 'bottom 65%', scrub: .4
      }
    });
  });

  // Micro parallax only on desktop and only while a photographic section is on screen.
  // This does not run any animation loop when the section is outside the viewport.
  if (fine && !saveData) {
    document.querySelectorAll('.intro-portrait .image-reveal img, .portrait-band img')
      .forEach((img) => {
        gsap.fromTo(img, { yPercent: -3 }, {
          yPercent: 3, ease: 'none',
          scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: .55 }
        });
      });
  }
}

const refresh = () => ScrollTrigger.refresh();
window.addEventListener('load', refresh, { once: true });
window.addEventListener('pageshow', refresh);
if (document.fonts?.ready) document.fonts.ready.then(refresh).catch(() => {});

window.addEventListener('pagehide', () => {
  if (smoothTicker) gsap.ticker.remove(smoothTicker);
  smoothScroll?.destroy();
  smoothScroll = null;
}, { once: true });
