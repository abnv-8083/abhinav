import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills } from '../data/skills';
import InfiniteSpiral from './InfiniteSpiral';

gsap.registerPlugin(ScrollTrigger);

// Tech logos via Devicons CDN
const DEVICONS = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const spiralItems = [
  { src: `${DEVICONS}/react/react-original.svg`,         alt: 'React' },
  { src: `${DEVICONS}/javascript/javascript-original.svg`, alt: 'JavaScript' },
  { src: `${DEVICONS}/typescript/typescript-original.svg`, alt: 'TypeScript' },
  { src: `${DEVICONS}/html5/html5-original.svg`,          alt: 'HTML5' },
  { src: `${DEVICONS}/css3/css3-original.svg`,            alt: 'CSS3' },
  { src: `${DEVICONS}/tailwindcss/tailwindcss-original.svg`, alt: 'Tailwind CSS' },
  { src: `${DEVICONS}/vitejs/vitejs-original.svg`,        alt: 'Vite' },
  { src: `${DEVICONS}/threejs/threejs-original.svg`,      alt: 'Three.js' },
  { src: `${DEVICONS}/git/git-original.svg`,              alt: 'Git' },
  { src: `${DEVICONS}/github/github-original.svg`,        alt: 'GitHub' },
  { src: `${DEVICONS}/figma/figma-original.svg`,          alt: 'Figma' },
  { src: `${DEVICONS}/nodejs/nodejs-original.svg`,        alt: 'Node.js' },
  { src: `${DEVICONS}/gsap/gsap-original.svg`,            alt: 'GSAP' },
  { src: `${DEVICONS}/framermotion/framermotion-original.svg`, alt: 'Framer Motion' },
  { src: `${DEVICONS}/redux/redux-original.svg`,          alt: 'Redux' },
  { src: `${DEVICONS}/webpack/webpack-original.svg`,      alt: 'Webpack' },
];

function SkillItem({ item, isActive, onHover, onLeave }) {
  return (
    <div
      onMouseEnter={() => onHover(item)}
      onMouseLeave={onLeave}
      data-cursor="hover"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.1rem 1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid',
        borderColor: isActive ? 'rgba(200,255,0,0.3)' : 'rgba(255,255,255,0.05)',
        background: isActive ? 'rgba(200,255,0,0.04)' : 'transparent',
        transition: 'all 0.3s ease',
        cursor: 'none',
        gap: '1rem',
      }}
      role="listitem"
      tabIndex={0}
      onFocus={() => onHover(item)}
      onBlur={onLeave}
      aria-label={`${item.name} — ${item.level}% proficiency`}
    >
      <span
        style={{
          fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
          fontWeight: isActive ? 600 : 400,
          color: isActive ? '#eeebe4' : '#666',
          transition: 'all 0.3s ease',
        }}
      >
        {item.name}
      </span>

      {/* Level bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        <div
          style={{
            width: '80px',
            height: '2px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '1px',
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          <div
            style={{
              height: '100%',
              width: `${isActive ? item.level : 20}%`,
              background: '#c8ff00',
              borderRadius: '1px',
              transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
              boxShadow: isActive ? '0 0 6px rgba(200,255,0,0.5)' : 'none',
            }}
          />
        </div>
        <span
          style={{
            fontSize: '0.65rem',
            color: isActive ? '#c8ff00' : '#333',
            fontWeight: 500,
            transition: 'color 0.3s ease',
            minWidth: '2.5ch',
          }}
        >
          {item.level}%
        </span>
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [activeSkill, setActiveSkill] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);
  const descRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
        }
      );

      // Category tabs
      gsap.fromTo(
        '.skill-tab',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
        }
      );

      // Skill items
      gsap.fromTo(
        '.skill-item-wrap',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const currentCategory = skills[activeCategory];

  return (
    <section
      id="skills"
      ref={sectionRef}
      style={{
        padding: 'clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 6rem)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
      }}
      aria-labelledby="skills-heading"
    >
      {/* Header: headline left — InfiniteSpiral right */}
      <div
        ref={titleRef}
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center',
          marginBottom: 'clamp(3rem, 5vw, 5rem)',
          opacity: 0,
        }}
      >
        {/* Left: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8ff00', boxShadow: '0 0 8px rgba(200,255,0,0.6)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase' }}>
              Skills
            </span>
          </div>

          <h2
            id="skills-heading"
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
            <span style={{ color: '#c8ff00' }}>WORK WITH</span>
          </h2>

          <p style={{ fontSize: '0.9rem', color: '#444', lineHeight: 1.7, maxWidth: '32ch', marginTop: '0.5rem' }}>
            A curated stack of tools I reach for to craft performant, interactive digital experiences.
          </p>
        </div>

        {/* Right: InfiniteSpiral of tech logos */}
        <div
          style={{ height: '420px', position: 'relative' }}
          data-cursor="explore"
          aria-label="Tech stack spiral"
        >
          <InfiniteSpiral
            items={spiralItems}
            animationMode="all"
            speed={0.45}
            radius={130}
            cardWidth={72}
            cardHeight={72}
            verticalSpacing={52}
            perspective={900}
            cardRadius={16}
            centerScale={1.25}
            edgeBlur={5}
            cardsPerTurn={6}
            pauseOnHover
            imageFit="contain"
            grayscale={0.3}
          />
          {/* Edge fade top/bottom */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, #080808 0%, transparent 18%, transparent 82%, #080808 100%)',
              pointerEvents: 'none',
              zIndex: 10,
            }}
            aria-hidden="true"
          />
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'start',
        }}
      >
        {/* Left: Category selector + skill list */}
        <div>
          {/* Category tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
            }}
            role="tablist"
            aria-label="Skill categories"
          >
            {skills.map((cat, i) => (
              <button
                key={cat.category}
                className="skill-tab"
                onClick={() => setActiveCategory(i)}
                role="tab"
                aria-selected={activeCategory === i}
                aria-controls={`skillpanel-${i}`}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '100px',
                  border: '1px solid',
                  borderColor: activeCategory === i ? '#c8ff00' : 'rgba(255,255,255,0.1)',
                  background: activeCategory === i ? '#c8ff00' : 'transparent',
                  color: activeCategory === i ? '#080808' : '#666',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'none',
                  transition: 'all 0.3s ease',
                  opacity: 0,
                }}
                data-cursor="button"
              >
                {cat.category}
              </button>
            ))}
          </div>

          {/* Skill list */}
          <div
            id={`skillpanel-${activeCategory}`}
            role="tabpanel"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
            aria-label={currentCategory.category}
          >
            {currentCategory.items.map((item) => (
              <div
                key={item.name}
                className="skill-item-wrap"
                style={{ opacity: 0 }}
              >
                <SkillItem
                  item={item}
                  isActive={activeSkill?.name === item.name}
                  onHover={setActiveSkill}
                  onLeave={() => setActiveSkill(null)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active skill detail */}
        <div
          ref={descRef}
          style={{
            position: 'sticky',
            top: '8rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {activeSkill ? (
            <div
              style={{
                padding: '2rem',
                border: '1px solid rgba(200,255,0,0.15)',
                borderRadius: '1.5rem',
                background: 'rgba(200,255,0,0.02)',
                animation: 'fadeIn 0.3s ease',
              }}
              role="region"
              aria-label={`${activeSkill.name} details`}
            >
              <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                Currently hovering
              </p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', color: '#c8ff00', marginBottom: '1rem', lineHeight: 1 }}>
                {activeSkill.name}
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                {activeSkill.desc}
              </p>
              <div>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Proficiency
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${activeSkill.level}%`,
                        background: 'linear-gradient(to right, #c8ff00, #80ff00)',
                        borderRadius: '2px',
                        transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
                        boxShadow: '0 0 10px rgba(200,255,0,0.4)',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c8ff00', letterSpacing: '-0.03em' }}>
                    {activeSkill.level}%
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '2rem',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
              }}
            >
              <p style={{ fontSize: '0.85rem', color: '#333', textAlign: 'center' }}>
                Hover a skill to see details
              </p>
            </div>
          )}

          {/* Summary */}
          <div>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: '1rem' }}>
              In this category
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {currentCategory.items.map((item) => (
                <span
                  key={item.name}
                  style={{
                    padding: '0.35rem 0.875rem',
                    borderRadius: '100px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '0.7rem',
                    color: '#666',
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 768px) {
          #skills .skills-header {
            grid-template-columns: 1fr !important;
          }
          #skills .spiral-col {
            height: 280px !important;
          }
        }
      `}</style>
    </section>
  );
}
