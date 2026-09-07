import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services } from '../data/experience';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Abstract service visuals
const SERVICE_VISUALS = [
  { bg: 'linear-gradient(135deg, #0a1628, #162744)', accent: '#4a9eff' },
  { bg: 'linear-gradient(135deg, #1a0820, #2d0f3a)', accent: '#c084fc' },
  { bg: 'linear-gradient(135deg, #0a1a10, #0f2a18)', accent: '#c8ff00' },
  { bg: 'linear-gradient(135deg, #1a1008, #2a1a0a)', accent: '#fb923c' },
  { bg: 'linear-gradient(135deg, #0a1620, #122030)', accent: '#06b6d4' },
];

export default function Services() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [activeService, setActiveService] = useState(null);
  const bgRef = useRef(null);

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

      // Service rows
      gsap.fromTo(
        '.service-row',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleServiceHover = (service, visual) => {
    setActiveService({ ...service, ...visual });
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  };

  const handleServiceLeave = () => {
    setActiveService(null);
    if (bgRef.current) {
      gsap.to(bgRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    }
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        padding: 'clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 6rem)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-labelledby="services-heading"
    >
      {/* Dynamic background */}
      <div
        ref={bgRef}
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0,
          pointerEvents: 'none',
          background: activeService?.bg || 'transparent',
          transition: 'background 0.5s ease',
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div
        ref={titleRef}
        style={{ marginBottom: 'clamp(3rem, 6vw, 6rem)', opacity: 0, position: 'relative', zIndex: 1 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8ff00', boxShadow: '0 0 8px rgba(200,255,0,0.6)', flexShrink: 0 }} />
          <span style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase' }}>
            Services
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
          <h2
            id="services-heading"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 6rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 0.9,
              color: '#eeebe4',
            }}
          >
            WHAT I
            <br />
            <span style={{ color: '#c8ff00' }}>OFFER</span>
          </h2>

          <p style={{ fontSize: '0.85rem', color: '#555', maxWidth: '30ch', lineHeight: 1.7 }}>
            From concept to deployment — building experiences that create real impact.
          </p>
        </div>
      </div>

      {/* Service list */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {services.map((service, i) => {
          const visual = SERVICE_VISUALS[i] || SERVICE_VISUALS[0];
          const isActive = activeService?.id === service.id;

          return (
            <div
              key={service.id}
              className="service-row"
              role="listitem"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.07)',
                opacity: 0,
              }}
            >
              <div
                onMouseEnter={() => handleServiceHover(service, visual)}
                onMouseLeave={handleServiceLeave}
                data-cursor="hover"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'clamp(1.25rem, 2.5vw, 2rem) 0',
                  cursor: 'none',
                  gap: '2rem',
                }}
              >
                {/* Left: number + title */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(1rem, 3vw, 3rem)', flex: 1 }}>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      letterSpacing: '0.15em',
                      color: isActive ? visual.accent : '#333',
                      transition: 'color 0.3s ease',
                      flexShrink: 0,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                    aria-hidden="true"
                  >
                    {service.id}
                  </span>

                  <span
                    style={{
                      fontSize: 'clamp(1.25rem, 4vw, 3.5rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      color: isActive ? '#eeebe4' : '#333',
                      transition: 'color 0.4s ease, transform 0.4s ease',
                      transform: isActive ? 'translateX(8px)' : 'none',
                      lineHeight: 1.1,
                    }}
                  >
                    {service.title}
                  </span>
                </div>

                {/* Right: tags + arrow */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                      opacity: isActive ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                    aria-hidden={!isActive}
                  >
                    {service.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: '0.25rem 0.625rem',
                          borderRadius: '100px',
                          border: `1px solid ${visual.accent}44`,
                          background: `${visual.accent}11`,
                          fontSize: '0.6rem',
                          fontWeight: 500,
                          letterSpacing: '0.08em',
                          color: visual.accent,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      border: `1px solid ${isActive ? visual.accent : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      color: isActive ? visual.accent : '#444',
                      transform: isActive ? 'rotate(45deg)' : 'none',
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* Last border */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }} />
      </div>

      <style>{`
        @media (max-width: 640px) {
          .service-row > div {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
            padding: 1.25rem 0 !important;
          }
          /* Number + title row stays horizontal but title wraps */
          .service-row > div > div:first-child {
            gap: 0.75rem !important;
            flex-wrap: wrap !important;
          }
          /* Title font size clamped for mobile */
          .service-row > div > div:first-child > span:last-child {
            font-size: clamp(1.1rem, 5.5vw, 1.6rem) !important;
            color: #eeebe4 !important;
            transform: none !important;
          }
          /* Number color always visible */
          .service-row > div > div:first-child > span:first-child {
            color: #555 !important;
          }
          /* Tags always visible on mobile (no hover state) */
          .service-row > div > div:last-child > div:first-child {
            opacity: 1 !important;
            justify-content: flex-start !important;
          }
          /* Right side: left-align tags, hide arrow */
          .service-row > div > div:last-child {
            justify-content: flex-start !important;
            flex-wrap: wrap !important;
            gap: 0.5rem !important;
          }
          /* Hide arrow circle on mobile */
          .service-row > div > div:last-child > div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
