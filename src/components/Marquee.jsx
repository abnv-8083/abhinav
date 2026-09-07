import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { techStack } from '../data/skills';

// Duplicate items enough to fill screen
const ITEMS_ROW1 = [...techStack, ...techStack, ...techStack];
const ITEMS_ROW2 = [...techStack.slice().reverse(), ...techStack.slice().reverse(), ...techStack.slice().reverse()];

function MarqueeRow({ items, direction = 1, speed = 40 }) {
  const wrapperRef = useRef(null);
  const track1Ref = useRef(null);
  const track2Ref = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const t1 = track1Ref.current;
    const t2 = track2Ref.current;
    if (!wrapper || !t1 || !t2) return;

    // Position the two tracks side by side
    const itemWidth = t1.scrollWidth;
    gsap.set(t2, { x: direction > 0 ? itemWidth : -itemWidth });

    const tween = gsap.to([t1, t2], {
      x: direction > 0 ? `-=${itemWidth}` : `+=${itemWidth}`,
      duration: itemWidth / speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => {
          if (direction > 0) {
            return parseFloat(x) % itemWidth;
          } else {
            return ((parseFloat(x) % itemWidth) + itemWidth) % itemWidth - itemWidth;
          }
        }),
      },
    });

    // Hover pause
    const pause = () => tween.pause();
    const resume = () => tween.play();
    wrapper.addEventListener('mouseenter', pause);
    wrapper.addEventListener('mouseleave', resume);

    return () => {
      tween.kill();
      wrapper.removeEventListener('mouseenter', pause);
      wrapper.removeEventListener('mouseleave', resume);
    };
  }, [direction, speed]);

  const renderItems = (items) =>
    items.map((item, i) => (
      <span
        key={`${item}-${i}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
          padding: '0 1.5rem',
        }}
      >
        <span
          style={{
            fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
            fontWeight: 600,
            letterSpacing: '0.15em',
            color: i % techStack.length === 0 ? '#c8ff00' : '#2a2a2a',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#eeebe4')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = i % techStack.length === 0 ? '#c8ff00' : '#2a2a2a')
          }
        >
          {item}
        </span>
        <span
          style={{
            display: 'inline-block',
            width: 3,
            height: 3,
            borderRadius: '50%',
            background: '#1a1a1a',
            margin: '0 1.5rem',
            flexShrink: 0,
          }}
          aria-hidden="true"
        />
      </span>
    ));

  return (
    <div
      ref={wrapperRef}
      style={{
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
      }}
    >
      {/* Fade edges */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: 'linear-gradient(to right, #080808, transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '120px',
          background: 'linear-gradient(to left, #080808, transparent)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <div style={{ display: 'flex', padding: '0.875rem 0', willChange: 'transform' }}>
        <div
          ref={track1Ref}
          style={{ display: 'inline-flex', flexShrink: 0 }}
        >
          {renderItems(items)}
        </div>
        <div
          ref={track2Ref}
          style={{ display: 'inline-flex', flexShrink: 0, position: 'absolute' }}
        >
          {renderItems(items)}
        </div>
      </div>
    </div>
  );
}

export default function Marquee() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 90%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: 'clamp(2.5rem, 4vw, 4rem) 0',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden',
        opacity: 0,
      }}
      aria-label="Technology stack"
    >
      <MarqueeRow items={ITEMS_ROW1} direction={1} speed={40} />
      <MarqueeRow items={ITEMS_ROW2} direction={-1} speed={30} />
    </section>
  );
}
