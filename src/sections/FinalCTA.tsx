import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { scrollToSection } from '@/lib/scrollToSection';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Check, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const benefits = ['Installazione gratuita', 'Nessun canone mensile', 'Zero gestione', 'Assistenza gratuita'];

const FinalCTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current, content = contentRef.current, glow = glowRef.current;
    if (!section || !content || !glow) return;

    const ctx = gsap.context(() => {
      gsap.to(glow, { scale: 1.3, opacity: 0.45, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut' });

      gsap.fromTo(content.querySelectorAll('.reveal-item'),
        { y: 50, opacity: 0, filter: 'blur(12px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.2, stagger: 0.14, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-36 lg:py-44 overflow-hidden bg-[#040408]">
      {/* Central glow */}
      <div ref={glowRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(65,163,207,0.12) 0%, rgba(65,163,207,0.04) 30%, transparent 55%)', filter: 'blur(80px)' }} />

      {/* Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[400px] h-[400px] border border-[#41A3CF]/[0.06] rounded-full" />
        <div className="absolute inset-4 w-[368px] h-[368px] border border-[#41A3CF]/[0.03] rounded-full" />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.01]"
        style={{ backgroundImage: 'radial-gradient(circle, #41A3CF 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

      <div className="relative w-full px-6 lg:px-12">
        <div ref={contentRef} className="max-w-3xl mx-auto text-center">
          <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#F0F2F8] mb-8 leading-tight text-glow">
            Porta ora PlugHub<br /><span className="text-brand-gradient">nel tuo locale</span>
          </h2>
          <p className="reveal-item text-lg text-[#7A8090] max-w-lg mx-auto mb-12">
            Offri un servizio utile ai tuoi clienti, senza costi e senza gestione.
          </p>

          {/* Benefit pills */}
          <div className="reveal-item flex flex-wrap justify-center gap-3 mb-12">
            {benefits.map((b, i) => (
              <div key={i} className="glass glass-hover flex items-center gap-2.5 px-5 py-2.5 group">
                <Check className="w-4 h-4 text-[#41A3CF] group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-[#F0F2F8]">{b}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="reveal-item">
            <button onClick={() => scrollToSection('contact')} className="btn-primary text-base px-12 py-5">
              <Zap className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Installa gratis nel tuo locale</span>
              <ArrowRight className="w-5 h-5 relative z-10" />
              <span className="shine" />
            </button>
          </div>

          <p className="reveal-item mt-10 text-xs text-[#4A5060] font-mono uppercase tracking-wider">
            Risposta entro 24 ore • Nessun impegno • Installazione in 10 minuti
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
