import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { projects as staticProjects } from '../data/projects';
import { api } from '../lib/api';
import { ArrowLeft, ExternalLink, GitFork } from 'lucide-react';


function ProjectVisualFull({ project }) {
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
      {/* Cloudinary image */}
      {project.image && (
        <img
          src={project.image}
          alt={project.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
        />
      )}
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: project.image
          ? `linear-gradient(to bottom, transparent 30%, ${project.bgGradient || '#000'} 100%)`
          : `radial-gradient(circle at 30% 50%, ${project.color}22, transparent 60%), radial-gradient(circle at 70% 20%, ${project.color}11, transparent 50%)`,
      }} />
      {!project.image && (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      )}
      {!project.image && (
        <span style={{ fontFamily: "'Space Grotesk'", fontSize: 'clamp(6rem, 20vw, 18rem)', fontWeight: 700, letterSpacing: '-0.05em', color: project.color, opacity: 0.06, userSelect: 'none', lineHeight: 1 }}>
          {project.id}
        </span>
      )}
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const [project, setProject] = useState(() => staticProjects.find(p => p.slug === slug) || null);
  const [loading, setLoading] = useState(true);

  // Fetch live data from API, fall back to static
  useEffect(() => {
    setLoading(true);
    api.project(slug)
      .then(data => {
        setProject(data);
        setLoading(false);
        // Track project view in GA4
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'project_view', {
            project_slug: slug,
            project_title: data?.title || slug,
          });
        }
      })
      .catch(() => {
        const fallback = staticProjects.find(p => p.slug === slug);
        setProject(fallback || null);
        setLoading(false);
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'project_view', {
            project_slug: slug,
            project_title: fallback?.title || slug,
          });
        }
      });
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(
        headerRef.current?.querySelectorAll('.detail-reveal'),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [slug, loading]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #1a1a1a', borderTop: '3px solid #c8ff00', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!project) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          padding: '2rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', color: '#eeebe4' }}>Project not found</h1>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.875rem 2rem',
            background: '#c8ff00',
            color: '#080808',
            border: 'none',
            borderRadius: '100px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Back to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div ref={pageRef} style={{ minHeight: '100vh', opacity: 0 }}>
      {/* Back button */}
      <div
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '1.5rem',
          zIndex: 100,
        }}
      >
        <button
          onClick={() => navigate('/')}
          data-cursor="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            background: 'rgba(8,8,8,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '100px',
            color: '#eeebe4',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.05em',
            cursor: 'none',
            transition: 'border-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
          aria-label="Go back to portfolio"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      {/* Hero image */}
      <div
        style={{
          height: 'clamp(40vh, 60vh, 70vh)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <ProjectVisualFull project={project} />
        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(to top, #080808, transparent)',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div
        ref={headerRef}
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <div
            className="detail-reveal"
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', opacity: 0 }}
          >
            <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', color: project.color, textTransform: 'uppercase' }}>
              {project.id} — {project.year}
            </span>
            <span style={{ width: 1, height: 12, background: '#222' }} />
            <span style={{ fontSize: '0.65rem', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {project.role}
            </span>
          </div>

          <h1
            className="detail-reveal"
            style={{
              fontSize: 'clamp(2rem, 6vw, 5rem)',
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#eeebe4',
              lineHeight: 0.95,
              marginBottom: '1.5rem',
              opacity: 0,
            }}
          >
            {project.title}
          </h1>

          <p
            className="detail-reveal"
            style={{ fontSize: '1.1rem', color: '#888', lineHeight: 1.7, maxWidth: '55ch', opacity: 0 }}
          >
            {project.description}
          </p>

          {/* Tech stack */}
          <div
            className="detail-reveal"
            style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem', opacity: 0 }}
          >
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  padding: '0.35rem 0.875rem',
                  borderRadius: '100px',
                  border: `1px solid ${project.color}33`,
                  background: `${project.color}11`,
                  fontSize: '0.7rem',
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

          {/* Action buttons */}
          <div className="detail-reveal" style={{ display: 'flex', gap: '1rem', marginTop: '2rem', opacity: 0 }}>
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="external"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.75rem',
                background: project.color,
                color: '#080808',
                borderRadius: '100px',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Live Site <ExternalLink size={14} />
            </a>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="external"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.875rem 1.75rem',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '100px',
                color: '#eeebe4',
                textDecoration: 'none',
                fontSize: '0.8rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              <GitFork size={14} /> GitHub
            </a>
          </div>
        </div>

        {/* Problem / Solution */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {[
            { label: 'The Problem', content: project.problem },
            { label: 'The Solution', content: project.solution },
          ].map(({ label, content }) => (
            <div
              key={label}
              style={{
                padding: '1.75rem',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '1.25rem',
                background: '#0e0e0e',
              }}
            >
              <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: '0.875rem' }}>
                {label}
              </p>
              <p style={{ fontSize: '0.95rem', color: '#888', lineHeight: 1.75 }}>{content}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div
          style={{
            marginBottom: '3rem',
            padding: '1.75rem',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '1.25rem',
            background: '#0e0e0e',
          }}
        >
          <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            Key Features
          </p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {project.features.map((f, i) => (
              <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ color: project.color, fontWeight: 700, flexShrink: 0, fontSize: '0.8rem', marginTop: '2px' }}>→</span>
                <span style={{ fontSize: '0.95rem', color: '#888', lineHeight: 1.6 }}>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Navigate to other projects */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: '#444', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Other Projects
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {staticProjects
              .filter((p) => p.slug !== slug)
              .slice(0, 3)
              .map((p) => (
                <button
                  key={p.slug}
                  onClick={() => navigate(`/project/${p.slug}`)}
                  data-cursor="hover"
                  style={{
                    padding: '0.5rem 1.25rem',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '100px',
                    background: 'transparent',
                    color: '#666',
                    fontSize: '0.75rem',
                    cursor: 'none',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${p.color}44`;
                    e.currentTarget.style.color = p.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                    e.currentTarget.style.color = '#666';
                  }}
                >
                  {p.title}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
