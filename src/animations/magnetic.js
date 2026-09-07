import gsap from 'gsap';

/**
 * Magnetic button effect
 * Call on mouseenter/mousemove/mouseleave
 */
export function createMagneticEffect(element, strength = 0.4) {
  if (!element) return;

  const handleMouseMove = (e) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    gsap.to(element, {
      x: distX * strength,
      y: distY * strength,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}

/**
 * React hook for magnetic button
 */
import { useEffect, useRef } from 'react';

export function useMagnetic(strength = 0.4) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const cleanup = createMagneticEffect(el, strength);
    return cleanup;
  }, [strength]);

  return ref;
}
