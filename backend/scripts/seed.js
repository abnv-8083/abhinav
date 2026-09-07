/**
 * Seed script — populates MongoDB with the existing static data from src/data/
 * Run once: node scripts/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

const Project       = require('../models/Project');
const SkillCategory = require('../models/SkillCategory');
const { Experience, Service } = require('../models/Experience');
const About         = require('../models/About');
const SocialLink    = require('../models/SocialLink');

const projects = [
  {
    slug: 'ecommerce-platform', title: 'E-Commerce Platform',
    subtitle: 'Full-stack shopping experience with real-time inventory',
    description: 'A modern, high-performance e-commerce platform built for scalability. Features real-time inventory management, dynamic product filtering, cart persistence, and a seamless checkout flow.',
    problem: 'The client needed a fast, reliable online store that could handle high traffic spikes during sales events while maintaining a premium shopping experience.',
    solution: 'Built a React-based SPA with optimistic UI updates, lazy-loaded product images, and a Node.js backend with Redis caching for inventory data.',
    features: ['Real-time inventory with WebSocket updates','AI-powered product recommendations','Stripe payment integration','Admin dashboard with analytics','Mobile-first responsive design'],
    tech: ['React','Node.js','MongoDB','Redis','Stripe','Tailwind CSS'],
    year: '2025', role: 'Full Stack Developer',
    github: 'https://github.com', live: 'https://example.com',
    color: '#c8ff00', accentColor: 'rgba(200,255,0,0.1)',
    bgGradient: 'linear-gradient(135deg,#0f2027 0%,#203a43 50%,#2c5364 100%)',
    order: 1,
  },
  {
    slug: 'restaurant-delivery', title: 'Restaurant Delivery Platform',
    subtitle: 'Multi-vendor food delivery with live order tracking',
    description: 'A feature-rich food delivery platform connecting restaurants and customers with real-time order tracking, dynamic menus, and driver management.',
    problem: 'Local restaurants lacked a digital presence and a reliable delivery infrastructure during peak hours.',
    solution: 'Developed a React Native app paired with a web dashboard, using Socket.io for real-time order updates and Google Maps API for live driver tracking.',
    features: ['Real-time order tracking','Multi-vendor restaurant management','Dynamic menu builder','Driver dispatch system','Ratings & review system'],
    tech: ['React','React Native','Express','PostgreSQL','Socket.io','Google Maps'],
    year: '2025', role: 'Lead Frontend Developer',
    github: 'https://github.com', live: 'https://example.com',
    color: '#ff6b35', accentColor: 'rgba(255,107,53,0.1)',
    bgGradient: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',
    order: 2,
  },
  {
    slug: 'interactive-experience', title: 'Interactive Web Experience',
    subtitle: 'Immersive creative coding showcase with WebGL',
    description: 'An experimental WebGL-powered digital art installation built for a creative agency.',
    problem: 'The agency wanted to create an unforgettable interactive microsite.',
    solution: 'Built a Three.js-powered experience with custom GLSL shaders, GSAP choreography, and Web Audio API integration.',
    features: ['Custom GLSL vertex & fragment shaders','Audio-reactive particle system','GPU-instanced geometry','GSAP timeline choreography','Mobile touch gestures'],
    tech: ['Three.js','GLSL','GSAP','Web Audio API','React','Vite'],
    year: '2026', role: 'Creative Developer',
    github: 'https://github.com', live: 'https://example.com',
    color: '#a855f7', accentColor: 'rgba(168,85,247,0.1)',
    bgGradient: 'linear-gradient(135deg,#0d0221 0%,#1a0533 50%,#2d0f4f 100%)',
    order: 3,
  },
  {
    slug: 'ai-powered-app', title: 'AI Powered Application',
    subtitle: 'GPT-integrated productivity tool with smart automations',
    description: 'A next-generation productivity application leveraging GPT-4 for intelligent task management.',
    problem: 'Knowledge workers were spending too much time on repetitive writing and organizational tasks.',
    solution: 'Built a React application with streaming OpenAI API integration and a rich text editor.',
    features: ['Streaming AI text generation','Smart task categorization','Document summarization','Multi-workspace support','Export to Notion / Markdown'],
    tech: ['React','TypeScript','OpenAI API','Supabase','Zustand','TipTap'],
    year: '2026', role: 'Frontend Developer',
    github: 'https://github.com', live: 'https://example.com',
    color: '#06b6d4', accentColor: 'rgba(6,182,212,0.1)',
    bgGradient: 'linear-gradient(135deg,#000428 0%,#004e92 100%)',
    order: 4,
  },
  {
    slug: 'design-system', title: 'Component Design System',
    subtitle: 'Scalable UI library with 60+ production-ready components',
    description: 'A comprehensive design system and component library built for a SaaS company.',
    problem: 'The engineering team was rebuilding UI components from scratch across multiple products.',
    solution: 'Designed and built a token-based design system with React components and Storybook documentation.',
    features: ['60+ accessible components','Design token system','Storybook documentation','Visual regression testing','Dark/light mode support'],
    tech: ['React','TypeScript','Storybook','Radix UI','CSS Modules','Chromatic'],
    year: '2026', role: 'UI Engineer',
    github: 'https://github.com', live: 'https://example.com',
    color: '#f43f5e', accentColor: 'rgba(244,63,94,0.1)',
    bgGradient: 'linear-gradient(135deg,#1a0510 0%,#2d0a1e 50%,#1a0510 100%)',
    order: 5,
  },
];

const skillCategories = [
  { category: 'FRONTEND', order: 1, items: [
    { name: 'React', level: 92, desc: 'Component architecture, hooks, context, performance optimization' },
    { name: 'JavaScript', level: 90, desc: 'ES2024+, async/await, closures, prototypal inheritance' },
    { name: 'TypeScript', level: 82, desc: 'Generics, utility types, strict mode, advanced patterns' },
    { name: 'HTML', level: 95, desc: 'Semantic markup, accessibility, ARIA, SEO best practices' },
    { name: 'CSS', level: 90, desc: 'Grid, Flexbox, custom properties, animations, @container' },
    { name: 'Tailwind CSS', level: 88, desc: 'Utility-first, design systems, custom config, v4 features' },
  ]},
  { category: 'ANIMATION', order: 2, items: [
    { name: 'GSAP', level: 88, desc: 'Timeline, ScrollTrigger, SplitText, Draggable, MorphSVG' },
    { name: 'ScrollTrigger', level: 85, desc: 'Pinning, scrubbing, horizontal scroll, parallax' },
    { name: 'Framer Motion', level: 80, desc: 'AnimatePresence, layout animations, gestures' },
    { name: 'CSS Animations', level: 92, desc: 'Keyframes, transitions, clip-path, transform3d' },
  ]},
  { category: '3D / CREATIVE', order: 3, items: [
    { name: 'Three.js', level: 78, desc: 'Scene setup, geometries, materials, loaders, post-processing' },
    { name: 'React Three Fiber', level: 75, desc: 'Declarative Three.js, hooks, performance patterns' },
    { name: 'WebGL / GLSL', level: 65, desc: 'Custom shaders, vertex manipulation, fragment effects' },
    { name: 'Creative Coding', level: 80, desc: 'Generative art, particle systems, algorithmic design' },
  ]},
  { category: 'TOOLS & MORE', order: 4, items: [
    { name: 'Git & GitHub', level: 90, desc: 'Branching strategies, PR workflows, GitHub Actions CI/CD' },
    { name: 'Vite', level: 88, desc: 'Plugin ecosystem, HMR, build optimization, code splitting' },
    { name: 'Figma', level: 78, desc: 'Design handoff, component libraries, auto-layout, prototyping' },
    { name: 'REST APIs', level: 88, desc: 'Fetch, Axios, error handling, caching, authentication' },
    { name: 'Node.js', level: 72, desc: 'Express, REST APIs, middleware, async operations' },
  ]},
];

const experiences = [
  { year: '2024', title: 'The Beginning', role: 'Self-Taught Developer', type: 'learning', order: 1,
    description: 'Started the journey into web development. Mastered HTML, CSS, JavaScript fundamentals.',
    highlights: ['HTML5 & CSS3 Mastery','JavaScript Fundamentals','Responsive Design','Git & Version Control'] },
  { year: '2024–25', title: 'React & Modern Frontend', role: 'Junior Developer', type: 'growth', order: 2,
    description: 'Deep-dived into the React ecosystem. Built real-world applications with modern tooling.',
    highlights: ['React & Hooks','REST API Integration','Tailwind CSS','Vite & Build Tools','First Freelance Projects'] },
  { year: '2025', title: 'Creative Development Era', role: 'Creative Frontend Developer', type: 'milestone', order: 3,
    description: 'Discovered the intersection of code and art. Learned GSAP animations, Three.js, and creative development.',
    highlights: ['GSAP & ScrollTrigger','Three.js & WebGL','React Three Fiber','Interactive Experiences'] },
  { year: '2026', title: 'Advanced Engineering', role: 'Frontend Engineer', type: 'current', order: 4,
    description: 'Focused on performance, scalability, and advanced engineering patterns.',
    highlights: ['TypeScript Mastery','Design Systems','Performance Optimization','Available for Collaboration'] },
];

const services = [
  { title: 'WEB DEVELOPMENT', order: 1, description: 'Modern, performant web applications built with React and cutting-edge tooling.', tags: ['React','TypeScript','Vite','REST APIs'] },
  { title: 'E-COMMERCE DEVELOPMENT', order: 2, description: 'Custom online stores with smooth checkout flows and conversion-focused UX.', tags: ['Shopify','React','Stripe','Headless CMS'] },
  { title: 'INTERACTIVE EXPERIENCES', order: 3, description: 'WebGL-powered, animation-rich websites that create lasting impressions.', tags: ['GSAP','Three.js','WebGL','Creative Coding'] },
  { title: 'UI IMPLEMENTATION', order: 4, description: 'Pixel-perfect design implementation with meticulous attention to detail.', tags: ['Figma to Code','Tailwind CSS','Animations','Design Systems'] },
  { title: 'PERFORMANCE OPTIMIZATION', order: 5, description: 'Turning slow, clunky web apps into lightning-fast, smooth experiences.', tags: ['Core Web Vitals','Code Splitting','Bundle Optimization','Caching'] },
];

const socialLinks = [
  { platform: 'Email', label: 'Email', href: 'mailto:abhinavabhaidev@gmail.com', value: 'abhinavabhaidev@gmail.com', icon: 'Mail', order: 1 },
  { platform: 'GitHub', label: 'GitHub', href: 'https://github.com/abhinavam', value: 'github.com/abhinavam', icon: 'GitFork', order: 2 },
  { platform: 'LinkedIn', label: 'LinkedIn', href: 'https://linkedin.com/in/abhinavam', value: 'linkedin.com/in/abhinavam', icon: 'Globe', order: 3 },
  { platform: 'Instagram', label: 'Instagram', href: 'https://instagram.com/abhinavam', value: '@abhinavam', icon: 'AtSign', order: 4 },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing
  await Promise.all([
    Project.deleteMany({}),
    SkillCategory.deleteMany({}),
    Experience.deleteMany({}),
    Service.deleteMany({}),
    SocialLink.deleteMany({}),
    About.deleteMany({}),
  ]);
  console.log('🗑  Cleared existing data');

  // Insert fresh data
  await Project.insertMany(projects);
  await SkillCategory.insertMany(skillCategories);
  await Experience.insertMany(experiences);
  await Service.insertMany(services);
  await SocialLink.insertMany(socialLinks);
  await About.create({
    name: 'Abhinav A M',
    headline: 'Creative Web Developer',
    bio: 'I build immersive digital experiences where code meets design. Specialising in creative frontend development, interactive animations, and WebGL.',
    location: 'Kerala, India',
    focus: 'Creative Frontend',
    status: 'Open to Work',
    available: true,
  });

  console.log('✅ Seeded: projects, skills, experience, services, social links, about');
  await mongoose.disconnect();
  console.log('👋 Done');
}

seed().catch((err) => { console.error(err); process.exit(1); });
