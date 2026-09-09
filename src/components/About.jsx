import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProfileCard from './ProfileCard';

gsap.registerPlugin(ScrollTrigger);

const ABOUT_WORDS =
  "I don't just build websites. I build experiences that move people.".split(' ');



export default function About() {
  const sectionRef = useRef(null);
  const bigTextRef = useRef(null);
  const introRef = useRef(null);
  const exploringRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pinned word-by-word text reveal
      const words = bigTextRef.current?.querySelectorAll('.about-word');
      if (words?.length) {
        gsap.fromTo(
          words,
          { opacity: 0.12, y: 0 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            ease: 'none',
            scrollTrigger: {
              trigger: bigTextRef.current,
              start: 'top 80%',
              end: 'bottom 50%',
              scrub: 0.5,
            },
          }
        );
      }

      // Intro block
      gsap.fromTo(
        introRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: introRef.current,
            start: 'top 85%',
          },
        }
      );

      // Exploring items
      const items = exploringRef.current?.querySelectorAll('.explore-item');
      if (items?.length) {
        gsap.fromTo(
          items,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: exploringRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        padding: 'clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 6rem)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-labelledby="about-heading"
    >
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '4rem' }}>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: '#c8ff00',
            boxShadow: '0 0 8px rgba(200,255,0,0.6)',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: '0.65rem',
            fontWeight: 500,
            letterSpacing: '0.2em',
            color: '#444',
            textTransform: 'uppercase',
          }}
          id="about-heading"
        >
          About
        </span>
      </div>

      {/* Large animated text */}
      <div
        ref={bigTextRef}
        style={{
          fontSize: 'clamp(2rem, 5.5vw, 5.5rem)',
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.035em',
          marginBottom: 'clamp(4rem, 8vw, 8rem)',
          maxWidth: '18ch',
        }}
        aria-label="I don't just build websites. I build experiences that move people."
      >
        {ABOUT_WORDS.map((word, i) => (
          <span
            key={i}
            className="about-word"
            style={{
              opacity: 0.12,
              display: 'inline-block',
              marginRight: '0.3em',
              color: word === 'experiences' ? '#c8ff00' : '#eeebe4',
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Two column: intro + exploring */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(3rem, 6vw, 6rem)',
          alignItems: 'start',
        }}
      >
        {/* Left: Introduction */}
        <div ref={introRef} style={{ opacity: 0 }}>
          <p
            style={{
              fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
              color: '#888',
              lineHeight: 1.8,
              marginBottom: '2rem',
            }}
          >
            I'm a frontend developer focused on creating{' '}
            <span style={{ color: '#eeebe4' }}>modern interfaces</span>,{' '}
            <span style={{ color: '#eeebe4' }}>interactive experiences</span> and{' '}
            <span style={{ color: '#eeebe4' }}>performant web applications</span>.
          </p>

          <p
            style={{
              fontSize: 'clamp(0.9rem, 1.3vw, 1rem)',
              color: '#666',
              lineHeight: 1.8,
            }}
          >
            Based in Kerala, India, I combine technical precision with creative thinking
            to deliver digital products that stand out. I believe the best websites
            are the ones you feel before you understand.
          </p>

          {/* Stats */}
          <div
            style={{
              display: 'flex',
              gap: '2rem',
              marginTop: '3rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { num: '10+', label: 'Projects Built' },
              { num: '2+', label: 'Years Learning' },
              { num: '∞', label: 'Curiosity' },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    color: '#c8ff00',
                    lineHeight: 1,
                    marginBottom: '0.25rem',
                  }}
                >
                  {stat.num}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '0.05em' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Profile Card */}
        <div ref={exploringRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ProfileCard
            name="Abhinav"
            title="Frontend Developer"
            handle="abnv-8083"
            status="Available for work"
            contactText="Hire Me"
            avatarUrl="/image-removebg-preview.png"
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={false}
            behindGlowEnabled={true}
            onContactClick={() => {
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        </div>
      </div>

      {/* Decorative element */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 'clamp(200px, 30vw, 400px)',
          height: 'clamp(200px, 30vw, 400px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,255,0,0.03) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
    </section>
  );
}
