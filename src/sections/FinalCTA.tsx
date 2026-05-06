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
      gsap.to(glow, { scale: 1.3, opacity: 0.5, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });

      gsap.fromTo(content.querySelectorAll('.reveal-item'),
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.12, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden bg-[#06060A]">
      {/* Central glow */}
      <div ref={glowRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(65,163,207,0.15) 0%, rgba(65,163,207,0.05) 30%, transparent 60%)', filter: 'blur(70px)' }} />

      {/* Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-[350px] h-[350px] border border-[#41A3CF]/[0.07] rounded-full" />
        <div className="absolute inset-3 w-[326px] h-[326px] border border-[#41A3CF]/[0.04] rounded-full" />
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.012]"
        style={{ backgroundImage: 'radial-gradient(circle, #41A3CF 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      <div className="relative w-full px-6 lg:px-12">
        <div ref={contentRef} className="max-w-3xl mx-auto text-center">
          <h2 className="reveal-item text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#F4F6FA] mb-6 leading-tight">
            Porta ora PlugHub<br /><span className="text-brand-gradient">nel tuo locale</span>
          </h2>
          <p className="reveal-item text-base sm:text-lg text-[#8A8F9D] max-w-lg mx-auto mb-10">
            Offri un servizio utile ai tuoi clienti, senza costi e senza gestione.
          </p>

          {/* Benefit pills */}
          <div className="reveal-item flex flex-wrap justify-center gap-2.5 mb-10">
            {benefits.map((b, i) => (
              <div key={i} className="glass glass-hover flex items-center gap-2 px-4 py-2 group">
                <Check className="w-3.5 h-3.5 text-[#41A3CF] group-hover:scale-110 transition-transform" />
                <span className="text-sm text-[#F4F6FA]">{b}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="reveal-item">
            <button onClick={() => scrollToSection('contact')} className="btn-primary text-base px-10 py-5">
              <Zap className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Installa gratis nel tuo locale</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <span className="shine" />
            </button>
          </div>

          <p className="reveal-item mt-8 text-xs text-[#5A5F6D] font-mono">
            Risposta entro 24 ore • Nessun impegno • Installazione in 10 minuti
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
