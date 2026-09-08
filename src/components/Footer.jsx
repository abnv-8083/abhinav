import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const footerRef = useRef(null);
  const topBtnRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRef.current?.querySelectorAll('.footer-item'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 5vw, 6rem)',
      }}
      role="contentinfo"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}
      >
        {/* Logo / name */}
        <div className="footer-item" style={{ opacity: 0 }}>
          <p
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.25rem, 3vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#eeebe4',
              lineHeight: 1,
              marginBottom: '0.25rem',
            }}
          >
            ABHINAV A M
          </p>
          <p style={{ fontSize: '0.75rem', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Creative Web Developer
          </p>
        </div>

        {/* Back to top */}
        <button
          ref={topBtnRef}
          onClick={scrollToTop}
          className="footer-item"
          data-cursor="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1.5rem',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '100px',
            background: 'transparent',
            color: '#888',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'none',
            opacity: 0,
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(200,255,0,0.3)';
            e.currentTarget.style.color = '#c8ff00';
            gsap.to(e.currentTarget.querySelector('svg'), { y: -3, duration: 0.3, ease: 'power2.out' });
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#888';
            gsap.to(e.currentTarget.querySelector('svg'), { y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
          }}
          aria-label="Back to top"
        >
          Back to top <ArrowUp size={14} />
        </button>
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <p
          className="footer-item"
          style={{ fontSize: '0.75rem', color: '#333', opacity: 0 }}
        >
          © 2026 Abhinav A M. All rights reserved.
        </p>

        <div
          className="footer-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.7rem',
            color: '#333',
            opacity: 0,
          }}
        >
          <span>Built with ❤️</span>
        </div>
      </div>
    </footer>
  );
}
