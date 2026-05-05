import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { scrollToSection } from '@/lib/scrollToSection';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  'Installazione gratuita',
  'Nessun canone mensile',
  'Zero gestione',
  'Assistenza gratuita',
];

const FinalCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const glow = glowRef.current;

    if (!section || !content || !glow) return;

    const ctx = gsap.context(() => {
      // Pulsing glow animation
      gsap.to(glow, {
        scale: 1.35,
        opacity: 0.45,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Content reveal with smooth energy effect
      gsap.fromTo(
        content.querySelectorAll('.reveal-item'),
        { y: 45, opacity: 0, filter: 'blur(12px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Floating particles animation
      const particles = section.querySelectorAll('.float-particle');
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          y: -30 + Math.random() * 60,
          x: -20 + Math.random() * 40,
          duration: 5 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.3,
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToContact = () => {
    scrollToSection('contact');
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-brand-black py-32 lg:py-40 overflow-hidden"
    >
      {/* Central glow orb */}
      <div 
        ref={glowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]"
        style={{
          background: 'radial-gradient(circle, rgba(46, 233, 255, 0.2) 0%, rgba(65, 163, 207, 0.1) 30%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="float-particle absolute w-1.5 h-1.5 bg-brand-cyan/50 rounded-full"
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              boxShadow: '0 0 10px rgba(46, 233, 255, 0.8)',
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(46, 233, 255, 0.8) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(46, 233, 255, 0.8) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Energy rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[400px] h-[400px] border border-brand-cyan/10 rounded-full animate-pulse" />
        <div className="absolute inset-4 w-[368px] h-[368px] border border-brand-cyan/5 rounded-full" />
      </div>

      <div className="relative w-full px-6 lg:px-12">
        <div ref={contentRef} className="max-w-4xl mx-auto text-center">
          {/* Headline */}
          <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-sora font-bold text-brand-white mb-6 leading-tight">
            Porta ora PlugHub<br />
            <span className="text-gradient">nel tuo locale</span>
          </h2>

          {/* Subheadline */}
          <p className="reveal-item text-lg sm:text-xl text-brand-gray max-w-2xl mx-auto mb-12">
            Offri un servizio utile ai tuoi clienti, senza costi e senza gestione.
          </p>

          {/* Benefits */}
          <div className="reveal-item flex flex-wrap justify-center gap-3 mb-12">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 hover:border-brand-cyan/30 hover:bg-white/10 card-premium group"
              >
                <Check className="w-4 h-4 text-brand-cyan group-hover:scale-110 transition-transform" />
                <span className="text-sm text-brand-white">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="reveal-item">
            <button
              onClick={scrollToContact}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-brand-cyan text-brand-black font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_60px_rgba(46,233,255,0.6)] hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              <span className="relative z-10">Installa gratis nel tuo locale</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>

          {/* Trust text */}
          <p className="reveal-item mt-10 text-sm text-brand-gray/60 font-mono">
            Risposta entro 24 ore • Nessun impegno • Installazione in 10 minuti
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
