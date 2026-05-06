import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { scrollToSection } from '@/lib/scrollToSection';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Beer, Building2, Dumbbell, Calendar, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const useCases = [
  { icon: Beer, title: 'Locali', description: 'Un dettaglio che i clienti notano e ricordano. Migliora l\'esperienza e genera valore per il locale.', stat: 'Più', statLabel: 'offerta', accent: '#E87B3C' },
  { icon: Building2, title: 'Hotel', description: 'Un servizio aggiuntivo per gli ospiti, disponibile 24/7.', stat: 'Servizio', statLabel: 'internazionale', accent: '#5B8DEF' },
  { icon: Dumbbell, title: 'Palestre & SPA', description: 'Perfetto mentre si fa sport o ci si rilassa, senza interrompere l\'esperienza.', stat: 'TOP', statLabel: 'servizio', accent: '#4ECB71' },
  { icon: Calendar, title: 'Eventi & Congressi', description: 'Installazione temporanea per fiere, concerti e conferenze. Un servizio utile per i partecipanti.', stat: 'Fast', statLabel: 'setup', accent: '#B76CFD' },
];

const UseCases = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current, title = titleRef.current, cards = cardsRef.current;
    if (!section || !title || !cards) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(title.querySelectorAll('.reveal-item'),
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.12, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      const cardEls = cards.querySelectorAll('.usecase-card');
      cardEls.forEach((card, i) => {
        gsap.fromTo(card,
          { x: i % 2 === 0 ? -40 : 40, opacity: 0, scale: 0.97 },
          { x: 0, opacity: 1, scale: 1, duration: 1, delay: i * 0.12, ease: 'expo.out',
            scrollTrigger: { trigger: section, start: 'top 60%', toggleActions: 'play none none reverse' },
          }
        );
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="use-cases" className="relative py-32 lg:py-40 overflow-hidden bg-[#040408]">
      <div className="section-line mb-24" />

      {/* Side glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(65,163,207,0.03) 0%, transparent 60%)', filter: 'blur(60px)' }} />

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div ref={titleRef} className="text-center mb-20">
            <span className="reveal-item label block mb-5">DOVE INSTALLARE PLUGHUB</span>
            <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F0F2F8] mb-6">
              Perfetto in <span className="text-brand-gradient">ogni tipo di contesto</span>
            </h2>
            <p className="reveal-item text-lg text-[#7A8090] max-w-xl mx-auto">
              PlugHub non è mai fuori posto.
            </p>
          </div>

          <div ref={cardsRef} className="grid md:grid-cols-2 gap-5">
            {useCases.map((uc, i) => (
              <div key={i} className="usecase-card group"
                onMouseEnter={() => setActiveCard(i)} onMouseLeave={() => setActiveCard(null)}>
                <div className={`relative glass glass-hover p-10 overflow-hidden min-h-[280px] flex flex-col ${activeCard === i ? 'border-[#41A3CF]/15' : ''}`}>
                  {/* Accent gradient on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `linear-gradient(135deg, ${uc.accent}06 0%, transparent 50%)` }} />

                  <div className="relative flex items-start justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                      style={{ background: `${uc.accent}10`, boxShadow: `0 0 24px ${uc.accent}15` }}>
                      <uc.icon className="w-7 h-7" style={{ color: uc.accent }} />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold" style={{ color: uc.accent }}>{uc.stat}</div>
                      <div className="text-[10px] text-[#4A5060] uppercase tracking-wider">{uc.statLabel}</div>
                    </div>
                  </div>

                  <h3 className="relative text-2xl font-bold text-[#F0F2F8] mb-4">{uc.title}</h3>
                  <p className="relative text-sm text-[#7A8090] leading-relaxed flex-1">{uc.description}</p>

                  <button onClick={() => scrollToSection('contact')}
                    className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#41A3CF] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    Richiedi info <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${activeCard === i ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="h-full bg-gradient-to-r from-transparent via-[#41A3CF]/30 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
