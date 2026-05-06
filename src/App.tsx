import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './sections/Header';
import Hero from './sections/Hero';
import WhyInstall from './sections/WhyInstall';
import UseCases from './sections/UseCases';
import HowItWorks from './sections/HowItWorks';
import Products from './sections/Products';
import MapSection from './sections/MapSection';
import FinalCTA from './sections/FinalCTA';
import Contact from './sections/Contact';
import FAQ from './sections/FAQ';
import Footer from './sections/Footer';
import CookieBanner from './sections/CookieBanner';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);

  useEffect(() => {
    ScrollTrigger.defaults({ toggleActions: 'play none none reverse' });
    ScrollTrigger.refresh();
    return () => { ScrollTrigger.getAll().forEach(st => st.kill()); };
  }, []);

  /* Custom cursor glow */
  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;
    if (!cursor || !dot) return;

    const onMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener('mousemove', onMove, { passive: true });

    const animate = () => {
      const s = smoothRef.current;
      const t = mouseRef.current;
      s.x += (t.x - s.x) * 0.08;
      s.y += (t.y - s.y) * 0.08;
      cursor.style.transform = `translate(${s.x - 150}px, ${s.y - 150}px)`;
      dot.style.transform = `translate(${s.x - 3}px, ${s.y - 3}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={mainRef} className="relative min-h-screen overflow-x-hidden bg-[#040408]">
      {/* Cursor glow orb */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-[9998] hidden md:block"
        style={{
          background: 'radial-gradient(circle, rgba(65,163,207,0.07) 0%, rgba(65,163,207,0.02) 40%, transparent 70%)',
          filter: 'blur(50px)',
          willChange: 'transform',
        }}
      />
      {/* Cursor dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          background: 'rgba(65,163,207,0.6)',
          boxShadow: '0 0 8px rgba(65,163,207,0.5)',
          willChange: 'transform',
        }}
      />

      {/* Grain */}
      <div className="grain" />

      {/* Header */}
      <Header />

      {/* Main content */}
      <main className="relative">
        <Hero />
        <WhyInstall />
        <UseCases />
        <HowItWorks />
        <Products />
        <MapSection />
        <FAQ />
        <FinalCTA />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cookie Banner */}
      <CookieBanner />
    </div>
  );
}

export default App;
