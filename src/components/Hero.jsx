import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown } from 'lucide-react';
import AeroShards from './AeroShards';
import BlurText from './BlurText';
import { api } from '../lib/api';

gsap.registerPlugin(ScrollTrigger);

const DEFAULTS = {
  statusBadge:   'Available for freelance',
  name:          'Abhinav A M',
  headlineLine1: 'CREATIVE',
  headlineLine2: 'WEB',
  headlineLine3: 'DEVELOPER.',
  subtitle:      'I build immersive digital experiences where code, motion and design meet.',
  location:      'Kerala, India',
  focus:         'Creative Frontend',
  status:        'Open to Work',
};

export default function Hero() {
  const sectionRef     = useRef(null);
  const headlineRef    = useRef(null);
  const metaRef        = useRef(null);
  const scrollRef      = useRef(null);
  const shardsWrapRef  = useRef(null);

  const [heroData, setHeroData] = useState(null);
  useEffect(() => { api.hero().then(setHeroData).catch(() => {}); }, []);

  const d = (key) => heroData?.[key] || DEFAULTS[key];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger headline lines
      const lines = headlineRef.current?.querySelectorAll('.hero-line');
      if (lines?.length) {
        gsap.fromTo(
          lines,
          { y: '100%', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power4.out',
            stagger: 0.12,
            delay: 0.3,
          }
        );
      }

      gsap.fromTo(
        [metaRef.current, scrollRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          delay: 0.8,
        }
      );

      // Fade in the shards panel
      gsap.fromTo(
        shardsWrapRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.8, ease: 'power2.out', delay: 2.4 }
      );

      // Parallax on scroll
      if (headlineRef.current) {
        gsap.to(headlineRef.current, {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        padding: 'clamp(6rem, 10vw, 10rem) clamp(1.5rem, 5vw, 6rem) clamp(3rem, 5vw, 5rem)',
        position: 'relative',
        overflow: 'hidden',
        gap: '2rem',
      }}
      aria-label="Hero section"
    >
      {/* AeroShards — absolute fill, right-side placement so text remains readable */}
      <div
        ref={shardsWrapRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        <AeroShards
          backgroundColor="#080808"
          shardColor="#896ABD"
          accentColor="#A855F7"
          placement="right"
          flow="stream"
          material="pearl"
          detail="balanced"
          effect="none"
          scale={1}
          spread={1}
          depth={1}
          speed={1}
          spin={1}
          interaction="repel"
          density={1.5}
          shardSize={1.1}
          stretch={1}
          turbulence={1}
          glow={1}
          edgeSoftness={2}
          bloom={0.5}
          grain={0.05}
          chromaticAberration={0.0075}
          transitionDuration={1}
          interactionRadius={1.5}
          interactionStrength={0.5}
          rippleIntensity={1}
          holdToGather={true}
          onError={(err) => console.warn('AeroShards WebGPU error:', err.message)}
        />
      </div>

      {/* Left — text content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Status badge */}
        <div
          ref={metaRef}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            border: '1px solid rgba(200,255,0,0.2)',
            borderRadius: '100px',
            marginBottom: '2rem',
            opacity: 0,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#c8ff00',
              boxShadow: '0 0 8px rgba(200,255,0,0.8)',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontSize: '0.65rem',
              fontWeight: 500,
              letterSpacing: '0.15em',
              color: '#888',
              textTransform: 'uppercase',
            }}
          >
          {d('statusBadge')}
          </span>
        </div>

        {/* Name — BlurText reveal */}
        <BlurText
          text={d('name')}
          animateBy="letters"
          direction="top"
          delay={60}
          stepDuration={0.45}
          threshold={0.1}
          style={{ margin: 0 }}
          className="hero-name"
        />

        {/* Main Headline */}
        <h1
          ref={headlineRef}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            lineHeight: 0.88,
            letterSpacing: '-0.04em',
            fontSize: 'clamp(3.5rem, 9vw, 9rem)',
            marginBottom: '2rem',
          }}
          aria-label={[d('headlineLine1'), d('headlineLine2'), d('headlineLine3')].join(' ')}
        >
          {[d('headlineLine1'), d('headlineLine2'), d('headlineLine3')].map((word, i) => (
            <span key={i} style={{ display: 'block', overflow: 'hidden' }}>
              <span
                className="hero-line"
                style={{
                  display: 'block',
                  color: i === 1 ? '#c8ff00' : '#eeebe4',
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Sub — BlurText reveal */}
        <BlurText
          text={d('subtitle')}
          animateBy="words"
          direction="bottom"
          delay={80}
          stepDuration={0.4}
          threshold={0.1}
          className="hero-subtitle"
        />

        {/* Meta info */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            opacity: 0,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Location
            </p>
            <p style={{ fontSize: '0.85rem', color: '#eeebe4', fontWeight: 500 }}>{d('location')}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Focus
            </p>
            <p style={{ fontSize: '0.85rem', color: '#eeebe4', fontWeight: 500 }}>{d('focus')}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
              Status
            </p>
            <p style={{ fontSize: '0.85rem', color: '#c8ff00', fontWeight: 500 }}>{d('status')}</p>
          </div>
        </div>
      </div>

      {/* Right column — transparent, shards show through from absolute layer */}
      <div style={{ position: 'relative', zIndex: 1 }} aria-hidden="true" />

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          left: 'clamp(1.5rem, 5vw, 6rem)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          opacity: 0,
          zIndex: 1,
        }}
        aria-label="Scroll to explore"
      >
        <div className="scroll-line" />
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase' }}>
          Scroll to Explore
        </span>
        <ArrowDown size={12} style={{ color: '#444' }} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          #hero {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
            padding-top: 8rem !important;
          }
          #hero > div:nth-child(3) { display: none; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
