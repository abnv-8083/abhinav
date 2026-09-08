import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';
import GlassSurface from './GlassSurface';

const navLinks = [
  { label: 'ABOUT', href: '#about' },
  { label: 'WORK', href: '#work' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'CONTACT', href: '#contact' },
];

export default function Navbar() {
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);
  const hidden = useRef(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Initial entrance
    gsap.fromTo(
      nav,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 3 }
    );

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY < 80) {
        if (hidden.current) {
          gsap.to(nav, { y: 0, duration: 0.5, ease: 'power3.out' });
          hidden.current = false;
          setNavHidden(false);
        }
      } else if (delta > 5 && !hidden.current) {
        gsap.to(nav, { y: -100, duration: 0.4, ease: 'power3.in' });
        hidden.current = true;
        setNavHidden(true);
      } else if (delta < -5 && hidden.current) {
        gsap.to(nav, { y: 0, duration: 0.5, ease: 'power3.out' });
        hidden.current = false;
        setNavHidden(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      // Use Lenis if available
      if (window.__lenis) {
        window.__lenis.scrollTo(target, { duration: 1.5 });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => {
      const next = !prev;
      if (next) {
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
        );
      }
      return next;
    });
  };

  return (
    <>
      {/* Floating HIRE ME pill — appears when navbar is hidden */}
      <div
        style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.5rem',
          zIndex: 1001,
          opacity: navHidden ? 1 : 0,
          transform: navHidden ? 'translateY(0) scale(1)' : 'translateY(-12px) scale(0.9)',
          transition: 'opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)',
          pointerEvents: navHidden ? 'auto' : 'none',
        }}
        aria-hidden={!navHidden}
      >
        <GlassSurface
          width="auto"
          height={44}
          borderRadius={100}
          backgroundOpacity={0.08}
          saturation={1.4}
          distortionScale={-140}
          brightness={55}
          blur={10}
          style={{ padding: '0 1.5rem', cursor: 'pointer' }}
        >
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            data-cursor="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#c8ff00',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            HIRE ME
            <span style={{ fontSize: '0.8rem', lineHeight: 1 }}>↗</span>
          </a>
        </GlassSurface>
      </div>

      <header
        ref={navRef}
        style={{
          position: 'fixed',
          top: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          width: 'calc(100% - 3rem)',
          maxWidth: '1200px',
        }}
        role="banner"
      >
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1.5rem',
            background: 'rgba(8,8,8,0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '100px',
          }}
          role="navigation"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            aria-label="ABHINAV A M — Back to top"
          >
            <img
              src="/favicon.svg"
              alt="Abhinav A M"
              style={{
                height: '42px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'brightness(0) saturate(100%) invert(94%) sepia(64%) saturate(500%) hue-rotate(30deg) brightness(105%)',
              }}
            />
          </a>

          {/* Desktop Links */}
          <div
            style={{ alignItems: 'center', gap: '2rem' }}
            className="navbar-links"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                data-cursor="hover"
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  color: '#666',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#eeebe4')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#666')}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right group: HIRE ME + mobile menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* CTA */}
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="navbar-cta"
              data-cursor="button"
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                color: '#080808',
                background: '#c8ff00',
                padding: '0.5rem 1.25rem',
                borderRadius: '100px',
                textDecoration: 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(200,255,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              HIRE ME
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="navbar-mobile-btn"
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '0.5rem',
                color: '#eeebe4',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          ref={mobileMenuRef}
          style={{
            position: 'fixed',
            top: '5rem',
            left: '1.5rem',
            right: '1.5rem',
            zIndex: 999,
            background: 'rgba(8,8,8,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '1.5rem',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
          }}
          role="menu"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              role="menuitem"
              style={{
                fontSize: '1rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                color: '#eeebe4',
                textDecoration: 'none',
                padding: '0.875rem 1rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'block',
                transition: 'color 0.2s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.color = '#c8ff00')}
              onBlur={(e) => (e.currentTarget.style.color = '#eeebe4')}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            style={{
              marginTop: '0.75rem',
              padding: '0.875rem',
              background: '#c8ff00',
              color: '#080808',
              textAlign: 'center',
              borderRadius: '0.75rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              textDecoration: 'none',
            }}
          >
            HIRE ME
          </a>
        </div>
      )}

      {/* Responsive visibility */}
      <style>{`
        .navbar-links      { display: none !important; }
        .navbar-cta        { display: flex; }
        .navbar-mobile-btn { display: flex; }

        @media (min-width: 620px) {
          .navbar-links      { display: flex !important; }
          .navbar-mobile-btn { display: none  !important; }
        }
      `}</style>
    </>
  );
}
