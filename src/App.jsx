import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import WhatsAppButton from './components/WhatsAppButton';

gsap.registerPlugin(ScrollTrigger);

// Lenis smooth scroll setup
function useLenis() {
  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: !prefersReducedMotion,
    });

    // Expose globally for Navbar scroll-to
    window.__lenis = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const gsapTicker = gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      window.__lenis = null;
      gsap.ticker.remove(gsapTicker);
    };
  }, []);
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    }
    ScrollTrigger.refresh();

    // Track SPA page navigation in GA4
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: pathname,
        page_title: document.title,
      });
    }
  }, [pathname]);
  return null;
}

function AppContent() {
  const [loaded, setLoaded] = useState(false);
  const [pageEntered, setPageEntered] = useState(false);

  useLenis();

  const handleLoaderComplete = () => {
    setLoaded(true);
    // One frame delay ensures React has painted the content before we trigger the blur-in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPageEntered(true);
        setTimeout(() => ScrollTrigger.refresh(), 600);
      });
    });
  };

  return (
    <>
      {/* Admin route — fully standalone, no loader/navbar/cursor */}
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={
          <>
            {/* Noise overlay */}
            <div className="noise-overlay" aria-hidden="true" />

            {/* Custom cursor */}
            <CustomCursor />

            {/* WhatsApp floating button */}
            <WhatsAppButton />

            {/* Skip link for accessibility */}
            <a
              href="#main-content"
              style={{
                position: 'fixed',
                top: '-100px',
                left: '1rem',
                zIndex: 99999,
                padding: '0.5rem 1rem',
                background: '#c8ff00',
                color: '#080808',
                borderRadius: '4px',
                fontWeight: 700,
                textDecoration: 'none',
                fontSize: '0.85rem',
                transition: 'top 0.2s ease',
              }}
              onFocus={(e) => (e.currentTarget.style.top = '1rem')}
              onBlur={(e) => (e.currentTarget.style.top = '-100px')}
            >
              Skip to main content
            </a>

            {/* Loader */}
            {!loaded && <Loader onComplete={handleLoaderComplete} />}

            {/* Blur entrance overlay — sits on top, fades away, never touches content stacking context */}
            {loaded && !pageEntered && (
              <div
                aria-hidden="true"
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 99980,
                  backdropFilter: 'blur(18px)',
                  WebkitBackdropFilter: 'blur(18px)',
                  background: 'rgba(8,8,8,0.6)',
                  pointerEvents: 'none',
                  transition: 'opacity 0.7s ease',
                }}
              />
            )}

            {/* Main app — plain opacity only, no filter so ScrollTrigger pins work correctly */}
            {loaded && (
              <div
                style={{
                  opacity: pageEntered ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                }}
              >
                <ScrollToTop />
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/project/:slug" element={<ProjectDetail />} />
                </Routes>
              </div>
            )}
          </>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
