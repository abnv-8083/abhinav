import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects as staticProjects } from '../data/projects';
import { api } from '../lib/api';
import { ArrowUpRight, GitFork, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DepthCarousel from './DepthCarousel';

gsap.registerPlugin(ScrollTrigger);

// Fetch projects from API, fall back to static data
function useProjects() {
  const [projects, setProjects] = useState(staticProjects);
  useEffect(() => {
    api.projects()
      .then(data => { if (data?.length) setProjects(data); })
      .catch(() => {}); // silently use static fallback
  }, []);
  return projects;
}

// Gradient SVG used as fallback image when a project has no Cloudinary image
function gradientDataUrl(bgGradient, color) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='${color}22'/><stop offset='100%' stop-color='%230d0d0d'/></linearGradient></defs><rect width='600' height='800' fill='%230d0d0d'/><rect width='600' height='800' fill='url(%23g)'/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Generates a visually rich project preview — shows Cloudinary image or CSS gradient
function ProjectVisual({ project }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: project.bgGradient || '#0d0d0d',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      {/* Cloudinary image — shown when available */}
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.85,
            transition: 'opacity 0.4s ease',
          }}
        />
      )}

      {/* Gradient overlay — always present for readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: project.image
            ? `linear-gradient(to top, ${project.bgGradient || '#000'} 0%, transparent 60%)`
            : `radial-gradient(circle at 20% 50%, ${project.color}22 0%, transparent 50%),
               radial-gradient(circle at 80% 20%, ${project.color}11 0%, transparent 50%)`,
        }}
      />

      {/* Grid pattern — only when no image */}
      {!project.image && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      )}

      {/* Project number overlay — only when no image */}
      {!project.image && (
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(6rem, 15vw, 15rem)',
            fontWeight: 700,
            letterSpacing: '-0.05em',
            color: project.color,
            opacity: 0.08,
            lineHeight: 1,
            userSelect: 'none',
            position: 'absolute',
            bottom: '-1rem',
            right: '-1rem',
          }}
        >
          {project.id}
        </span>
      )}

      {/* Tech stack badges */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '1.5rem',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
        }}
      >
        {project.tech.slice(0, 4).map((t) => (
          <span
            key={t}
            style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '100px',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${project.color}33`,
              fontSize: '0.6rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: project.color,
              textTransform: 'uppercase',
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();

  const handleViewProject = () => {
    navigate(`/project/${project.slug}`);
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // 3D tilt on mouse
    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      gsap.to(card.querySelector('.card-inner'), {
        rotateY: x * 5,
        rotateX: -y * 5,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    };

    const handleLeave = () => {
      gsap.to(card.querySelector('.card-inner'), {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    card.addEventListener('mousemove', handleMove);
    card.addEventListener('mouseleave', handleLeave);

    return () => {
      card.removeEventListener('mousemove', handleMove);
      card.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <article
      ref={cardRef}
      style={{
        minWidth: 'clamp(340px, 42vw, 600px)',
        height: 'clamp(480px, 65vh, 700px)',
        flexShrink: 0,
        marginRight: '2rem',
        position: 'relative',
        perspective: '1200px',
      }}
      aria-label={`Project: ${project.title}`}
    >
      <div
        className="card-inner"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '1.5rem',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          flexDirection: 'column',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
          background: '#0e0e0e',
        }}
      >
        {/* Image area */}
        <div
          ref={imageRef}
          data-cursor="project"
          onClick={handleViewProject}
          style={{
            flex: '0 0 60%',
            overflow: 'hidden',
            position: 'relative',
            cursor: 'none',
          }}
        >
          <ProjectVisual project={project} />

          {/* Hover overlay */}
          <div
            className="view-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.3s ease',
            }}
          />
        </div>

        {/* Content area */}
        <div
          style={{
            flex: '0 0 40%',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  color: project.color,
                  textTransform: 'uppercase',
                }}
              >
                {project.id} — {project.year}
              </span>
              <span
                style={{
                  fontSize: '0.6rem',
                  color: '#444',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {project.role}
              </span>
            </div>

            <h3
              style={{
                fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: '#eeebe4',
                lineHeight: 1.1,
                marginBottom: '0.75rem',
              }}
            >
              {project.title}
            </h3>

            <p
              style={{
                fontSize: '0.85rem',
                color: '#666',
                lineHeight: 1.6,
              }}
            >
              {project.subtitle}
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleViewProject}
              data-cursor="project"
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: project.color,
                color: '#080808',
                border: 'none',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = `0 0 20px ${project.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              aria-label={`View ${project.title} project details`}
            >
              View Project <ArrowUpRight size={14} />
            </button>

            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="external"
              style={{
                padding: '0.75rem',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '0.75rem',
                color: '#888',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'none',
                transition: 'border-color 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.color = '#eeebe4';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = '#888';
              }}
              aria-label={`${project.title} GitHub repository`}
            >
                                <GitFork size={16} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects() {
  const projects = useProjects();
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);
  const trackRef = useRef(null);
  const titleRef = useRef(null);
  const progressRef = useRef(null);

  // Title animation — runs once
  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Horizontal scroll — re-runs whenever the project list changes
  useEffect(() => {
    // Wait one frame so React has rendered the updated cards
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        const track = trackRef.current;
        const cards = track?.querySelectorAll('article');
        if (!track || !cards?.length) return;

        const totalWidth = Array.from(cards).reduce((acc, c) => acc + c.offsetWidth + 32, 0);
        const scrollDist = Math.max(0, totalWidth - window.innerWidth + 100);

        if (scrollDist <= 0) return; // not enough cards to scroll

        gsap.to(track, {
          x: -scrollDist,
          ease: 'none',
          scrollTrigger: {
            trigger: triggerRef.current,
            pin: true,
            scrub: 1,
            end: () => `+=${scrollDist}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressRef.current) {
                progressRef.current.style.width = `${self.progress * 100}%`;
              }
            },
          },
        });

        // Card reveals
        gsap.fromTo(
          cards,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: triggerRef.current,
              start: 'top 80%',
            },
          }
        );
      }, sectionRef);

      return () => ctx.revert();
    }, 50);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [projects.length]);

  return (
    <section
      id="work"
      ref={sectionRef}
      style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      aria-labelledby="projects-heading"
    >
      {/* Header — outside of pin */}
      <div
        ref={titleRef}
        style={{
          padding: 'clamp(5rem, 8vw, 8rem) clamp(1.5rem, 5vw, 6rem) 3rem',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2rem',
          opacity: 0,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#c8ff00', boxShadow: '0 0 8px rgba(200,255,0,0.6)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.65rem', fontWeight: 500, letterSpacing: '0.2em', color: '#444', textTransform: 'uppercase' }}>
              Selected Work
            </span>
          </div>

          <h2
            id="projects-heading"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 7rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              lineHeight: 0.88,
              color: '#eeebe4',
            }}
          >
            SELECTED
            <br />
            <span style={{ color: '#c8ff00' }}>WORK</span>
          </h2>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#555', maxWidth: '30ch', lineHeight: 1.7 }}>
          A curated collection of projects that showcase my approach to frontend engineering and creative development.
        </p>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 clamp(1.5rem, 5vw, 6rem)', marginBottom: '2rem' }}>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', borderRadius: '1px', overflow: 'hidden' }}>
          <div
            ref={progressRef}
            style={{ height: '100%', width: '0%', background: '#c8ff00', transition: 'none', boxShadow: '0 0 6px rgba(200,255,0,0.5)' }}
            role="progressbar"
            aria-label="Project scroll progress"
          />
        </div>
      </div>

      {/* Horizontal scroll trigger wrapper — hidden on mobile via .desktop-projects-scroll */}
      <div ref={triggerRef} className="desktop-projects-scroll" style={{ height: '100vh', overflow: 'hidden' }}>
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 clamp(1.5rem, 5vw, 6rem)',
            height: '100%',
            willChange: 'transform',
          }}
        >
          {projects.map((project, i) => (
            <ProjectCard key={project._id || project.id} project={project} index={i} />
          ))}
          {/* End spacer */}
          <div style={{ minWidth: 'clamp(1.5rem, 5vw, 6rem)', flexShrink: 0 }} />
        </div>
      </div>{/* end .desktop-projects-scroll */}

      {/* Mobile: DepthCarousel — hidden on desktop, shown only on ≤768px */}
      <div className="mobile-projects-carousel" style={{ display: 'none' }}>
        <MobileProjectCarousel projects={projects} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          #work .mobile-projects-carousel { display: block !important; }
          #work .desktop-projects-scroll  { display: none  !important; }
        }
      `}</style>
    </section>
  );
}

/* ── Mobile carousel + active project info ── */
function MobileProjectCarousel({ projects }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();
  const active = projects[activeIdx] || projects[0];

  const carouselItems = projects.map(p => ({
    image: p.image || gradientDataUrl(p.bgGradient, p.color || '#c8ff00'),
    alt: p.title,
  }));

  return (
    <div style={{ padding: '2rem 1.25rem 3rem' }}>
      {/* Carousel */}
      <div style={{ height: '380px', position: 'relative', marginBottom: '2rem' }}>
        <DepthCarousel
          items={carouselItems}
          cardWidth={240}
          cardHeight={320}
          depth={180}
          spread={70}
          tilt={20}
          tiltDirection="right"
          perspective={1200}
          visibleCards={3}
          falloff={0.25}
          blur={5}
          autoplay
          autoplayDelay={3500}
          loop
          radius={16}
          showIndicators={true}
          showControls={true}
          onChange={(idx) => setActiveIdx(idx)}
        />
      </div>

      {/* Active project info card */}
      {active && (
        <div
          key={active._id || active.id}
          style={{
            background: '#0e0e0e',
            border: `1px solid ${active.color}33`,
            borderRadius: '1.25rem',
            padding: '1.5rem',
            transition: 'border-color 0.3s ease',
          }}
        >
          {/* Label */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.15em', color: active.color, textTransform: 'uppercase' }}>
              {active.year} — {active.role || 'Project'}
            </span>
            <span style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.1em' }}>
              {String(activeIdx + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
            </span>
          </div>

          {/* Title */}
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#eeebe4', letterSpacing: '-0.02em', marginBottom: '0.5rem', lineHeight: 1.2 }}>
            {active.title}
          </h3>

          {/* Subtitle */}
          <p style={{ fontSize: '0.82rem', color: '#666', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            {active.subtitle}
          </p>

          {/* Tech tags */}
          {active.tech?.length > 0 && (
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              {active.tech.slice(0, 4).map(t => (
                <span key={t} style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.08em', padding: '0.25rem 0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '100px', color: '#888', textTransform: 'uppercase' }}>
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => navigate(`/project/${active.slug}`)}
              style={{ flex: 1, padding: '0.8rem', background: active.color, color: '#080808', border: 'none', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              VIEW PROJECT <ArrowUpRight size={14} />
            </button>
            {active.github && (
              <a
                href={active.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '0.8rem 1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                <GitFork size={16} />
              </a>
            )}
            {active.live && (
              <a
                href={active.live}
                target="_blank"
                rel="noopener noreferrer"
                style={{ padding: '0.8rem 1rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
