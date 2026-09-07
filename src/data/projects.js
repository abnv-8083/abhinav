export const projects = [
  {
    id: '01',
    slug: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    subtitle: 'Full-stack shopping experience with real-time inventory',
    description:
      'A modern, high-performance e-commerce platform built for scalability. Features real-time inventory management, dynamic product filtering, cart persistence, and a seamless checkout flow.',
    problem:
      'The client needed a fast, reliable online store that could handle high traffic spikes during sales events while maintaining a premium shopping experience.',
    solution:
      'Built a React-based SPA with optimistic UI updates, lazy-loaded product images, and a Node.js backend with Redis caching for inventory data.',
    features: [
      'Real-time inventory with WebSocket updates',
      'AI-powered product recommendations',
      'Stripe payment integration',
      'Admin dashboard with analytics',
      'Mobile-first responsive design',
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Redis', 'Stripe', 'Tailwind CSS'],
    year: '2025',
    role: 'Full Stack Developer',
    github: 'https://github.com',
    live: 'https://example.com',
    color: '#c8ff00',
    accentColor: 'rgba(200, 255, 0, 0.1)',
    bgGradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  },
  {
    id: '02',
    slug: 'restaurant-delivery',
    title: 'Restaurant Delivery Platform',
    subtitle: 'Multi-vendor food delivery with live order tracking',
    description:
      'A feature-rich food delivery platform connecting restaurants and customers with real-time order tracking, dynamic menus, and driver management.',
    problem:
      'Local restaurants lacked a digital presence and a reliable delivery infrastructure during peak hours.',
    solution:
      'Developed a React Native app paired with a web dashboard, using Socket.io for real-time order updates and Google Maps API for live driver tracking.',
    features: [
      'Real-time order tracking',
      'Multi-vendor restaurant management',
      'Dynamic menu builder',
      'Driver dispatch system',
      'Ratings & review system',
    ],
    tech: ['React', 'React Native', 'Express', 'PostgreSQL', 'Socket.io', 'Google Maps'],
    year: '2025',
    role: 'Lead Frontend Developer',
    github: 'https://github.com',
    live: 'https://example.com',
    color: '#ff6b35',
    accentColor: 'rgba(255, 107, 53, 0.1)',
    bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  },
  {
    id: '03',
    slug: 'interactive-experience',
    title: 'Interactive Web Experience',
    subtitle: 'Immersive creative coding showcase with WebGL',
    description:
      'An experimental WebGL-powered digital art installation built for a creative agency. Features particle systems, custom shaders, and real-time audio visualization.',
    problem:
      'The agency wanted to create an unforgettable interactive microsite that showcased their creative capabilities.',
    solution:
      'Built a Three.js-powered experience with custom GLSL shaders, GSAP choreography, and Web Audio API integration for music-reactive visuals.',
    features: [
      'Custom GLSL vertex & fragment shaders',
      'Audio-reactive particle system',
      'GPU-instanced geometry',
      'GSAP timeline choreography',
      'Mobile touch gestures',
    ],
    tech: ['Three.js', 'GLSL', 'GSAP', 'Web Audio API', 'React', 'Vite'],
    year: '2026',
    role: 'Creative Developer',
    github: 'https://github.com',
    live: 'https://example.com',
    color: '#a855f7',
    accentColor: 'rgba(168, 85, 247, 0.1)',
    bgGradient: 'linear-gradient(135deg, #0d0221 0%, #1a0533 50%, #2d0f4f 100%)',
  },
  {
    id: '04',
    slug: 'ai-powered-app',
    title: 'AI Powered Application',
    subtitle: 'GPT-integrated productivity tool with smart automations',
    description:
      'A next-generation productivity application leveraging GPT-4 for intelligent task management, content generation, and workflow automation.',
    problem:
      'Knowledge workers were spending too much time on repetitive writing and organizational tasks.',
    solution:
      'Built a React application with streaming OpenAI API integration, custom prompt engineering, and a rich text editor with AI-assisted writing.',
    features: [
      'Streaming AI text generation',
      'Smart task categorization',
      'Document summarization',
      'Multi-workspace support',
      'Export to Notion / Markdown',
    ],
    tech: ['React', 'TypeScript', 'OpenAI API', 'Supabase', 'Zustand', 'TipTap'],
    year: '2026',
    role: 'Frontend Developer',
    github: 'https://github.com',
    live: 'https://example.com',
    color: '#06b6d4',
    accentColor: 'rgba(6, 182, 212, 0.1)',
    bgGradient: 'linear-gradient(135deg, #000428 0%, #004e92 100%)',
  },
  {
    id: '05',
    slug: 'design-system',
    title: 'Component Design System',
    subtitle: 'Scalable UI library with 60+ production-ready components',
    description:
      'A comprehensive design system and component library built for a SaaS company, featuring 60+ accessible components with full Storybook documentation.',
    problem:
      'The engineering team was rebuilding UI components from scratch across multiple products, causing inconsistency and slowing development.',
    solution:
      'Designed and built a token-based design system with React components, automated visual regression testing, and a comprehensive Storybook documentation site.',
    features: [
      '60+ accessible components',
      'Design token system',
      'Storybook documentation',
      'Visual regression testing',
      'Dark/light mode support',
    ],
    tech: ['React', 'TypeScript', 'Storybook', 'Radix UI', 'CSS Modules', 'Chromatic'],
    year: '2026',
    role: 'UI Engineer',
    github: 'https://github.com',
    live: 'https://example.com',
    color: '#f43f5e',
    accentColor: 'rgba(244, 63, 94, 0.1)',
    bgGradient: 'linear-gradient(135deg, #1a0510 0%, #2d0a1e 50%, #1a0510 100%)',
  },
];
