import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Marquee from '../components/Marquee';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Services from '../components/Services';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <About />
      <Marquee />
      <Skills />
      <Projects />
      <Experience />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}
