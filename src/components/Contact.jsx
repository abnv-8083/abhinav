import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GitFork, Globe, AtSign, Mail, ArrowUpRight } from 'lucide-react';
import { useMagnetic } from '../animations/magnetic';

gsap.registerPlugin(ScrollTrigger);

const SOCIAL_LINKS = [
  { icon: Mail, label: 'Email', href: 'mailto:abhinavabhaidev@gmail.com', value: 'abhinavabhaidev@gmail.com' },
  { icon: GitFork, label: 'GitHub', href: 'https://github.com/abhinavam', value: 'github.com/abhinavam' },
  { icon: Globe, label: 'LinkedIn', href: 'https://linkedin.com/in/abhinavam', value: 'linkedin.com/in/abhinavam' },
  { icon: AtSign, label: 'Instagram', href: 'https://instagram.com/abhinavam', value: '@abhinavam' },
];

function MagneticButton() {
  const btnRef = useMagnetic(0.5);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: 'clamp(3rem, 5vw, 5rem) 0' }}>
      <div
        ref={btnRef}
        style={{ display: 'inline-block' }}
        onMouseEnter={(e) => {
          gsap.to(e.currentTarget.querySelector('.btn-circle'), {
            scale: 1.12,
            duration: 0.4,
            ease: 'power2.out',
          });
        }}
        onMouseLeave={(e) => {
          gsap.to(e.currentTarget.querySelector('.btn-circle'), {
            scale: 1,
            duration: 0.7,
            ease: 'elastic.out(1, 0.5)',
          });
        }}
      >
        <a
          href="mailto:abhinavabhaidev@gmail.com"
          className="btn-circle"
          data-cursor="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '0.5rem',
            width: 'clamp(180px, 20vw, 220px)',
            height: 'clamp(180px, 20vw, 220px)',
            borderRadius: '50%',
            background: '#c8ff00',
            color: '#080808',
            textDecoration: 'none',
            transition: 'box-shadow 0.4s ease',
            boxShadow: '0 0 0 0 rgba(200,255,0,0)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 0 60px rgba(200,255,0,0.35), 0 0 120px rgba(200,255,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 0 rgba(200,255,0,0)';
          }}
          aria-label="Start a project — Send email to abhinavabhaidev@gmail.com"
        >
          <span
            style={{
              fontSize: 'clamp(0.7rem, 1.2vw, 0.9rem)',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            START A
            <br />
            PROJECT
          </span>
          <ArrowUpRight size={20} />
        </a>
      </div>
    </div>
  );
}

export default function Contact() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Headline words
      const words = titleRef.current?.querySelectorAll('.contact-word');
      if (words?.length) {
        gsap.fromTo(
          words,
          { y: '100%', opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
          }
        );
      }

      // Social links
      gsap.fromTo(
        linksRef.current?.querySelectorAll('.social-link'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: linksRef.current, start: 'top 85%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      style={{
        padding: 'clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 6rem)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      aria-labelledby="contact-heading"
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          bottom: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(200,255,0,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8ff00', boxShadow: '0 0 8px rgba(200,255,0,0.6)', flexShrink: 0 }} />
        <span style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase' }}>
          Get in Touch
        </span>
      </div>

      {/* Headline */}
      <div
        ref={titleRef}
        style={{
          fontSize: 'clamp(3rem, 9vw, 9rem)',
          fontWeight: 700,
          letterSpacing: '-0.04em',
          lineHeight: 0.88,
          marginBottom: '2rem',
        }}
        aria-label="Let's build something unforgettable."
      >
        {["LET'S BUILD", 'SOMETHING', 'UNFORGETTABLE.'].map((line, li) => (
          <div key={li} style={{ overflow: 'hidden' }}>
            {line.split(' ').map((word, wi) => (
              <span
                key={`${li}-${wi}`}
                className="contact-word"
                style={{
                  display: 'inline-block',
                  opacity: 0,
                  marginRight: '0.25em',
                  color: word === 'SOMETHING' ? '#c8ff00' : '#eeebe4',
                }}
              >
                {word}
              </span>
            ))}
          </div>
        ))}
      </div>

      <p
        style={{
          fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
          color: '#555',
          maxWidth: '50ch',
          lineHeight: 1.7,
          marginBottom: '1rem',
        }}
      >
        Have a project in mind? Looking for a creative developer? Let's collaborate and create something extraordinary together.
      </p>

      {/* Magnetic CTA button */}
      <MagneticButton />

      {/* Social links */}
      <div
        ref={linksRef}
        style={{
          display: 'flex',
          gap: 'clamp(1rem, 3vw, 3rem)',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {SOCIAL_LINKS.map(({ icon: Icon, label, href, value }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('mailto') ? '_self' : '_blank'}
            rel="noopener noreferrer"
            className="social-link"
            data-cursor="external"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem 1.5rem',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '0.875rem',
              textDecoration: 'none',
              color: '#666',
              opacity: 0,
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(200,255,0,0.25)';
              e.currentTarget.style.background = 'rgba(200,255,0,0.03)';
              e.currentTarget.style.color = '#c8ff00';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#666';
            }}
            aria-label={`${label}: ${value}`}
          >
            <Icon size={16} />
            <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{value}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
