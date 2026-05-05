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

  useEffect(() => {
    // Smooth scroll behavior
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
    });

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-brand-black min-h-screen overflow-x-hidden">
      {/* Grain overlay */}
      <div className="grain-overlay" />

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
