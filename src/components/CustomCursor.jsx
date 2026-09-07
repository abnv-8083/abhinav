import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const glowRef = useRef(null);
  const labelRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const posRef = useRef({ x: -300, y: -300 });
  const smoothPos = useRef({ x: -300, y: -300 });
  const stateRef = useRef('default');
  const rafRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const glow = glowRef.current;
    const label = labelRef.current;
    if (!glow || !label) return;

    // Lerp factor — lower = more trailing
    const LERP = 0.11;

    const STATES = {
      default: {
        size: 320,
        opacity: 0.2,
        color: '200, 255, 0',
        label: '',
      },
      hover: {
        size: 420,
        opacity: 0.18,
        color: '200, 255, 0',
        label: '',
      },
      project: {
        size: 380,
        opacity: 0.22,
        color: '200, 255, 0',
        label: 'VIEW PROJECT →',
      },
      external: {
        size: 360,
        opacity: 0.18,
        color: '255, 255, 255',
        label: 'OPEN ↗',
      },
      button: {
        size: 340,
        opacity: 0.2,
        color: '200, 255, 0',
        label: 'CLICK',
      },
      explore: {
        size: 400,
        opacity: 0.2,
        color: '168, 85, 247',
        label: 'EXPLORE',
      },
    };

    let currentSize = STATES.default.size;
    let targetSize = currentSize;
    let currentOpacity = STATES.default.opacity;
    let targetOpacity = currentOpacity;
    let currentColor = STATES.default.color;
    let targetColor = STATES.default.color;

    const animate = () => {
      // Smooth position
      smoothPos.current.x += (posRef.current.x - smoothPos.current.x) * LERP;
      smoothPos.current.y += (posRef.current.y - smoothPos.current.y) * LERP;

      // Smooth size & opacity
      currentSize += (targetSize - currentSize) * 0.1;
      currentOpacity += (targetOpacity - currentOpacity) * 0.1;

      const half = currentSize / 2;
      glow.style.transform = `translate(${smoothPos.current.x - half}px, ${smoothPos.current.y - half}px)`;
      glow.style.width = `${currentSize}px`;
      glow.style.height = `${currentSize}px`;
      glow.style.background = `radial-gradient(circle, rgba(${currentColor}, ${currentOpacity}) 0%, rgba(${currentColor}, ${currentOpacity * 0.4}) 35%, transparent 70%)`;

      // Sync label with glow center
      label.style.transform = `translate(${smoothPos.current.x}px, ${smoothPos.current.y}px) translate(-50%, -50%)`;

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    const onMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const setState = (newState) => {
      if (stateRef.current === newState) return;
      stateRef.current = newState;
      const s = STATES[newState] || STATES.default;
      targetSize = s.size;
      targetOpacity = s.opacity;
      currentColor = s.color;

      if (s.label) {
        label.textContent = s.label;
        label.style.opacity = '1';
        label.style.color = newState === 'external' ? '#080808' : '#080808';
      } else {
        label.style.opacity = '0';
      }
    };

    const onMouseOver = (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        setState(target.dataset.cursor);
      } else if (e.target.closest('a, button')) {
        setState('hover');
      } else {
        setState('default');
      }
    };

    const onClick = () => {
      // Pulse burst on click
      targetSize += 80;
      targetOpacity += 0.12;
      setTimeout(() => {
        const s = STATES[stateRef.current] || STATES.default;
        targetSize = s.size;
        targetOpacity = s.opacity;
      }, 180);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('click', onClick);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Spotlight glow */}
      <div
        ref={glowRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99997,
          borderRadius: '50%',
          willChange: 'transform, width, height, background',
        }}
      />

      {/* Floating label (for project/button states) */}
      <div
        ref={labelRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          fontSize: '0.55rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          opacity: 0,
          color: '#080808',
          background: '#c8ff00',
          padding: '0.3rem 0.7rem',
          borderRadius: '100px',
          transition: 'opacity 0.25s ease',
          whiteSpace: 'nowrap',
        }}
      />
    </>
  );
}
