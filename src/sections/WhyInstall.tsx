import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, TrendingUp, Smile, Ban, Euro, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  { icon: Euro, title: 'Zero costi per il locale', description: 'Nessun costo di installazione o gestione.', highlight: '100% GRATIS', color: '#41A3CF' },
  { icon: Clock, title: 'Zero impatti operativi', description: 'Nessun impegno per lo staff. Nessuna preoccupazione per te.', highlight: 'ZERO PENSIERI', color: '#5BB8E0' },
  { icon: TrendingUp, title: "Aumenta l'offerta del tuo locale", description: 'Un servizio sempre più richiesto da aggiungere alla tua offerta.', highlight: 'PIÙ OFFERTA', color: '#41A3CF' },
  { icon: Smile, title: 'Clienti più soddisfatti', description: "Coccola i tuoi clienti con la ricarica più veloce in Italia", highlight: 'PIÙ ATTENZIONE', color: '#5BB8E0' },
  { icon: Ban, title: 'Meno richieste. Zero responsabilità', description: 'Solleva lo staff da richieste e preoccupazioni senza rinunciare al servizio.', highlight: 'ZERO STRESS', color: '#41A3CF' },
  { icon: Shield, title: 'Qualità certificata', description: 'Stazione PlugHub di ultima geerazione con powerbank a carica rapida.', highlight: 'TOP QUALITY', color: '#5BB8E0' },
];

const WhyInstall = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current, title = titleRef.current, cards = cardsRef.current;
    if (!section || !title || !cards) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(title.querySelectorAll('.reveal-item'),
        { y: 35, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.12, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      const cardEls = cards.querySelectorAll('.benefit-card');
      gsap.fromTo(cardEls,
        { y: 50, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.08, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 65%', toggleActions: 'play none none reverse' },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="why-install" className="relative py-28 lg:py-36 overflow-hidden bg-[#06060A]">
      {/* Section top line */}
      <div className="section-line mb-20" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(65,163,207,0.04) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-16">
            <span className="reveal-item label block mb-4">PERCHÉ INSTALLARE PLUGHUB</span>
            <h2 className="reveal-item text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FA] mb-5">
              Perché installare PlugHub <span className="text-brand-gradient">nel tuo locale</span>
            </h2>
            <p className="reveal-item text-base sm:text-lg text-[#8A8F9D] max-w-xl mx-auto leading-relaxed">
              Offri un servizio utile ai clienti, senza costi e senza gestione.
            </p>
          </div>

          {/* Cards Grid — bento style */}
          <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b, i) => (
              <div key={i} className="benefit-card group"
                onMouseEnter={() => setActiveCard(i)} onMouseLeave={() => setActiveCard(null)}>
                <div className={`relative glass glass-hover p-7 h-full overflow-hidden ${activeCard === i ? 'border-[#41A3CF]/30' : ''}`}>
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${b.color}10 0%, transparent 70%)` }} />

                  {/* Highlight pill */}
                  <div className="absolute top-5 right-5">
                    <span className="label text-[10px] px-2 py-1 rounded-md" style={{ color: b.color, background: `${b.color}12` }}>
                      {b.highlight}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${b.color}12` }}>
                    <b.icon className="w-6 h-6" style={{ color: b.color }} />
                  </div>

                  {/* Text */}
                  <h3 className="text-lg font-semibold text-[#F4F6FA] mb-2 group-hover:text-[#41A3CF] transition-colors duration-300">{b.title}</h3>
                  <p className="text-sm text-[#8A8F9D] leading-relaxed">{b.description}</p>

                  {/* Bottom line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${activeCard === i ? 'opacity-100' : 'opacity-0'}`}
                    style={{ background: `linear-gradient(90deg, transparent, ${b.color}, transparent)` }} />

                  {/* Corner */}
                  <div className={`absolute top-0 right-0 w-6 h-6 transition-opacity duration-300 ${activeCard === i ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute top-3 right-3 w-3 h-px" style={{ background: b.color }} />
                    <div className="absolute top-3 right-3 w-px h-3" style={{ background: b.color }} />
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

export default WhyInstall;
