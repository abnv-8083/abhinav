import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Fade up animation with stagger support
 */
export function fadeUp(targets, options = {}) {
  const {
    duration = 0.9,
    ease = 'power3.out',
    stagger = 0.08,
    delay = 0,
    y = 50,
    scrollTrigger,
  } = options;

  return gsap.fromTo(
    targets,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      ease,
      stagger,
      delay,
      scrollTrigger,
    }
  );
}

/**
 * Reveal text word by word
 * Splits text into spans and animates each
 */
export function splitTextReveal(element, options = {}) {
  if (!element) return;

  const {
    duration = 0.8,
    ease = 'power3.out',
    stagger = 0.05,
    scrollTrigger,
    delay = 0,
  } = options;

  const text = element.textContent;
  const words = text.split(' ');

  element.innerHTML = words
    .map(
      (word) =>
        `<span class="word-wrap"><span class="word">${word}</span></span>`
    )
    .join(' ');

  const wordEls = element.querySelectorAll('.word');

  return gsap.to(wordEls, {
    y: 0,
    opacity: 1,
    duration,
    ease,
    stagger,
    delay,
    scrollTrigger,
  });
}

/**
 * Image reveal with clip-path
 */
export function imageReveal(element, options = {}) {
  if (!element) return;

  const {
    duration = 1.2,
    ease = 'power4.inOut',
    scrollTrigger,
    delay = 0,
    direction = 'left',
  } = options;

  const clipStart =
    direction === 'left'
      ? 'inset(0 100% 0 0)'
      : direction === 'right'
      ? 'inset(0 0 0 100%)'
      : direction === 'top'
      ? 'inset(100% 0 0 0)'
      : 'inset(0 0 100% 0)';

  return gsap.fromTo(
    element,
    { clipPath: clipStart, scale: 1.1 },
    {
      clipPath: 'inset(0 0% 0 0)',
      scale: 1,
      duration,
      ease,
      delay,
      scrollTrigger,
    }
  );
}

/**
 * Parallax effect
 */
export function parallax(element, { speed = 0.3, scrollTrigger } = {}) {
  if (!element) return;

  return gsap.to(element, {
    y: () => `${speed * 100}%`,
    ease: 'none',
    scrollTrigger: {
      ...scrollTrigger,
      scrub: true,
    },
  });
}

/**
 * Horizontal scroll section
 */
export function horizontalScroll(container, panels, options = {}) {
  if (!container || !panels.length) return;

  const { triggerEl } = options;

  const totalWidth = panels.reduce((acc, el) => acc + el.offsetWidth, 0);

  return gsap.to(panels, {
    x: () => -(totalWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: triggerEl || container,
      pin: true,
      scrub: 1,
      end: () => `+=${totalWidth - window.innerWidth}`,
      invalidateOnRefresh: true,
    },
  });
}

/**
 * Scale + fade entrance
 */
export function scaleIn(targets, options = {}) {
  const {
    duration = 0.8,
    ease = 'power3.out',
    stagger = 0.1,
    scale = 0.85,
    scrollTrigger,
    delay = 0,
  } = options;

  return gsap.fromTo(
    targets,
    { opacity: 0, scale },
    {
      opacity: 1,
      scale: 1,
      duration,
      ease,
      stagger,
      delay,
      scrollTrigger,
    }
  );
}

/**
 * Clip-path wipe reveal (left to right)
 */
export function clipReveal(targets, options = {}) {
  const { duration = 1, ease = 'power4.inOut', stagger = 0.1, scrollTrigger, delay = 0 } = options;

  return gsap.fromTo(
    targets,
    { clipPath: 'inset(0 100% 0 0)' },
    {
      clipPath: 'inset(0 0% 0 0)',
      duration,
      ease,
      stagger,
      delay,
      scrollTrigger,
    }
  );
}

/**
 * Line draw / counter animation
 */
export function countUp(element, { from = 0, to = 100, duration = 2, ease = 'power2.out', onUpdate } = {}) {
  if (!element) return;

  const obj = { val: from };
  return gsap.to(obj, {
    val: to,
    duration,
    ease,
    onUpdate: () => {
      if (onUpdate) {
        onUpdate(Math.round(obj.val));
      } else {
        element.textContent = String(Math.round(obj.val)).padStart(2, '0');
      }
    },
  });
}

export { gsap, ScrollTrigger };
