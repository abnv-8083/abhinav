import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { experiences } from '../data/experience';

gsap.registerPlugin(ScrollTrigger);

const TYPE_COLORS = {
  learning: '#444',
  growth: '#666',
  milestone: '#c8ff00',
  current: '#c8ff00',
};

export default function Experience() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const glowLineRef = useRef(null);
  const glowBloomRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
        }
      );

      // Timeline items
      const items = sectionRef.current?.querySelectorAll('.timeline-entry');
      items?.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
            },
          }
        );
      });

      // Year labels
      gsap.fromTo(
        '.timeline-year',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'back.out(1.7)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
      // Scroll-driven glow line fill
      const glowLine = glowLineRef.current;
      const glowBloom = glowBloomRef.current;
      const targets = [glowLine, glowBloom].filter(Boolean);
      if (targets.length) {
        gsap.fromTo(
          targets,
          { height: '0%' },
          {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'bottom 30%',
              scrub: 2,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        padding: 'clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 6rem)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
      }}
      aria-labelledby="experience-heading"
    >
      {/* Header */}
      <div
        ref={titleRef}
        style={{ marginBottom: 'clamp(4rem, 8vw, 8rem)', opacity: 0 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8ff00', boxShadow: '0 0 8px rgba(200,255,0,0.6)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase' }}>
            Journey
          </span>
        </div>

        <h2
          id="experience-heading"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 6rem)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 0.9,
            color: '#eeebe4',
          }}
        >
          MY
          <br />
          <span style={{ color: '#c8ff00' }}>JOURNEY</span>
        </h2>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Static base line */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 0,
            bottom: 0,
            width: '1px',
            background: 'rgba(255,255,255,0.06)',
          }}
          aria-hidden="true"
        />

        {/* Scroll-driven glow fill — wrapper clips, inner div grows */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 0,
            bottom: 0,
            width: '3px',
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          {/* Sharp glow line */}
          <div
            ref={glowLineRef}
            style={{
              width: '1px',
              height: '0%',
              margin: '0 auto',
              background: 'linear-gradient(to bottom, transparent 0%, #c8ff00 10%, #c8ff00 90%, transparent 100%)',
              boxShadow: '0 0 6px 2px rgba(200,255,0,0.55), 0 0 18px 4px rgba(200,255,0,0.2)',
              willChange: 'height',
            }}
          />
          {/* Bloom blur */}
          <div
            ref={glowBloomRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '0%',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(200,255,0,0.35) 10%, rgba(200,255,0,0.35) 90%, transparent 100%)',
              filter: 'blur(4px)',
              willChange: 'height',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(3rem, 5vw, 5rem)' }}>
          {experiences.map((exp, i) => (
            <div
              key={exp.year}
              className="timeline-entry"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gap: '2rem',
                alignItems: 'start',
                opacity: 0,
              }}
              role="article"
              aria-label={`${exp.year}: ${exp.title}`}
            >
              {/* Left content — even entries on desktop */}
              <div
                style={{
                  textAlign: 'right',
                  opacity: i % 2 === 0 ? 1 : 0,
                  pointerEvents: i % 2 === 0 ? 'auto' : 'none',
                }}
                aria-hidden={i % 2 !== 0}
              >
                {i % 2 === 0 && <TimelineContent exp={exp} />}
              </div>

              {/* Center dot + year */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  paddingTop: '0.5rem',
                }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: exp.type === 'current' || exp.type === 'milestone' ? '#c8ff00' : '#222',
                    border: `1px solid ${exp.type === 'current' || exp.type === 'milestone' ? '#c8ff00' : '#333'}`,
                    boxShadow: exp.type === 'current' ? '0 0 12px rgba(200,255,0,0.6)' : 'none',
                    flexShrink: 0,
                  }}
                  aria-hidden="true"
                />
                <span
                  className="timeline-year"
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    color: TYPE_COLORS[exp.type],
                    opacity: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {exp.year}
                </span>
              </div>

              {/* Right content — odd entries on desktop, ALL entries on mobile */}
              <div
                style={{
                  opacity: i % 2 !== 0 ? 1 : 0,
                  pointerEvents: i % 2 !== 0 ? 'auto' : 'none',
                }}
                aria-hidden={i % 2 === 0}
              >
                {/* Always rendered so mobile CSS can show it for every entry */}
                <TimelineContent exp={exp} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile timeline — centred single column */}
      <style>{`
        @media (max-width: 640px) {
          .timeline-entry {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
          /* Hide the left placeholder column on mobile */
          .timeline-entry > div:first-child {
            display: none !important;
          }
          /* Make ALL cards visible regardless of even/odd */
          .timeline-entry > div:last-child {
            opacity: 1 !important;
            pointer-events: auto !important;
          }
          /* Center the dot + year */
          .timeline-entry > div:nth-child(2) {
            flex-direction: row !important;
            justify-content: flex-start !important;
            gap: 0.6rem !important;
            padding-top: 0 !important;
          }
        }
      `}</style>
    </section>
  );
}

function TimelineContent({ exp }) {
  return (
    <div
      style={{
        padding: '1.5rem',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '1.25rem',
        background: '#0e0e0e',
        transition: 'border-color 0.3s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(200,255,0,0.2)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span
          style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '100px',
            background: exp.type === 'current' ? 'rgba(200,255,0,0.1)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${exp.type === 'current' ? 'rgba(200,255,0,0.2)' : 'rgba(255,255,255,0.07)'}`,
            fontSize: '0.6rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: exp.type === 'current' ? '#c8ff00' : '#555',
            textTransform: 'uppercase',
          }}
        >
          {exp.role}
        </span>
      </div>

      <h3
        style={{
          fontSize: 'clamp(1rem, 2vw, 1.25rem)',
          fontWeight: 700,
          color: '#eeebe4',
          letterSpacing: '-0.02em',
          marginBottom: '0.75rem',
        }}
      >
        {exp.title}
      </h3>

      <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.7, marginBottom: '1.25rem' }}>
        {exp.description}
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {exp.highlights.map((h) => (
          <span
            key={h}
            style={{
              padding: '0.25rem 0.625rem',
              borderRadius: '100px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.65rem',
              color: '#555',
            }}
          >
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}
