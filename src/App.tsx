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
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    });
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  /* Cursor glow — follows mouse with smooth lerp */
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    const handleMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('mousemove', handleMove, { passive: true });

    const animate = () => {
      const s = smoothRef.current;
      const t = mouseRef.current;
      s.x += (t.x - s.x) * 0.08;
      s.y += (t.y - s.y) * 0.08;
      glow.style.transform = `translate(${s.x - 150}px, ${s.y - 150}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div ref={mainRef} className="relative min-h-screen overflow-x-hidden bg-[#06060A]">
      {/* Cursor glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-[9998] opacity-0 md:opacity-100"
        style={{
          background: 'radial-gradient(circle, rgba(65,163,207,0.08) 0%, rgba(65,163,207,0.03) 40%, transparent 70%)',
          filter: 'blur(40px)',
          willChange: 'transform',
        }}
      />

      {/* Grain overlay */}
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
