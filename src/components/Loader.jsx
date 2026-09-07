import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete }) {
  const containerRef = useRef(null);
  const counterRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const progressBarRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        },
      });

      // Initial state
      gsap.set([titleRef.current, subtitleRef.current, counterRef.current, progressBarRef.current], {
        opacity: 0,
        y: 30,
      });

      // Reveal title
      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      tl.to(
        subtitleRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
        },
        '-=0.4'
      );

      tl.to(
        [counterRef.current, progressBarRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
        },
        '-=0.3'
      );

      // Count from 0 to 100
      const obj = { val: 0 };
      tl.to(
        obj,
        {
          val: 100,
          duration: 1.8,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(Math.round(obj.val)).padStart(2, '0');
            }
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${obj.val}%`;
            }
          },
        },
        '-=0.1'
      );

      // Brief pause at 100
      tl.to({}, { duration: 0.3 });


      // Exit: simply fade out — new blur entrance takes over from here
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#080808',
        zIndex: 99990,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(2rem, 5vw, 6rem)',
        overflow: 'hidden',
      }}
      role="status"
      aria-label="Loading portfolio"
    >
      {/* Background accent glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,255,0,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Small label */}
      <p
        ref={subtitleRef}
        style={{
          fontSize: '0.65rem',
          fontWeight: 500,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#444',
          marginBottom: '1.5rem',
        }}
        aria-hidden="true"
      >
        Portfolio — 2026
      </p>

      {/* Main headline */}
      <h1
        ref={titleRef}
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(2rem, 6vw, 5rem)',
          fontWeight: 700,
          lineHeight: 1.0,
          letterSpacing: '-0.04em',
          color: '#eeebe4',
          marginBottom: '3rem',
        }}
      >
        HELLO, I'M
        <br />
        <span style={{ color: '#c8ff00' }}>ABHINAV A M</span>
      </h1>

      {/* Progress area */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem' }}>
        {/* Progress bar */}
        <div
          style={{
            flex: 1,
            height: '1px',
            background: 'rgba(255,255,255,0.08)',
            position: 'relative',
          }}
        >
          <div
            ref={progressBarRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              background: '#c8ff00',
              width: '0%',
              boxShadow: '0 0 8px rgba(200,255,0,0.6)',
            }}
          />
        </div>

        {/* Counter */}
        <span
          ref={counterRef}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            color: '#eeebe4',
            lineHeight: 1,
            minWidth: '3ch',
            textAlign: 'right',
          }}
          aria-hidden="true"
        >
          00
        </span>
      </div>

      {/* Decorative bottom line */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(200,255,0,0.3), transparent)',
        }}
      />
    </div>
  );
}
