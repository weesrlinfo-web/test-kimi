import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, TrendingUp, Smile, Ban, Euro, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  { icon: Euro, title: 'Zero costi per il locale', description: 'Nessun costo di installazione o gestione.', highlight: '100% GRATIS', color: '#41A3CF' },
  { icon: Clock, title: 'Zero impatti operativi', description: 'Nessun impegno per lo staff. Nessuna preoccupazione per te.', highlight: 'ZERO PENSIERI', color: '#6BC8F0' },
  { icon: TrendingUp, title: "Aumenta l'offerta del tuo locale", description: 'Un servizio sempre più richiesto da aggiungere alla tua offerta.', highlight: 'PIÙ OFFERTA', color: '#41A3CF' },
  { icon: Smile, title: 'Clienti più soddisfatti', description: "Coccola i tuoi clienti con la ricarica più veloce in Italia", highlight: 'PIÙ ATTENZIONE', color: '#6BC8F0' },
  { icon: Ban, title: 'Meno richieste. Zero responsabilità', description: 'Solleva lo staff da richieste e preoccupazioni senza rinunciare al servizio.', highlight: 'ZERO STRESS', color: '#41A3CF' },
  { icon: Shield, title: 'Qualità certificata', description: 'Stazione PlugHub di ultima geerazione con powerbank a carica rapida.', highlight: 'TOP QUALITY', color: '#6BC8F0' },
];

const WhyInstall = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
    setActiveCard(index);
  };

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

      const cardEls = cards.querySelectorAll('.benefit-card');
      gsap.fromTo(cardEls,
        { y: 60, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.08, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 65%', toggleActions: 'play none none reverse' },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="why-install" className="relative py-32 lg:py-40 overflow-hidden bg-[#040408]">
      <div className="section-line mb-24" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(65,163,207,0.03) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-20">
            <span className="reveal-item label block mb-5">PERCHÉ INSTALLARE PLUGHUB</span>
            <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F0F2F8] mb-6">
              Perché installare PlugHub <span className="text-brand-gradient">nel tuo locale</span>
            </h2>
            <p className="reveal-item text-lg text-[#7A8090] max-w-xl mx-auto leading-relaxed">
              Offri un servizio utile ai clienti, senza costi e senza gestione.
            </p>
          </div>

          {/* Bento Grid */}
          <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <div key={i} className="benefit-card">
                <div
                  className={`relative glass glass-hover p-8 h-full overflow-hidden border-glow spotlight ${activeCard === i ? 'border-[#41A3CF]/20' : ''}`}
                  onMouseMove={(e) => handleMouseMove(e, i)}
                  onMouseLeave={() => setActiveCard(null)}
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${b.color}08 0%, transparent 70%)` }} />

                  {/* Highlight pill */}
                  <div className="absolute top-6 right-6">
                    <span className="label text-[10px] px-3 py-1.5 rounded-lg" style={{ color: b.color, background: `${b.color}10` }}>
                      {b.highlight}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 hover:scale-110"
                    style={{ background: `${b.color}10`, boxShadow: `0 0 20px ${b.color}15` }}>
                    <b.icon className="w-7 h-7" style={{ color: b.color }} />
                  </div>

                  {/* Text */}
                  <h3 className="text-xl font-bold text-[#F0F2F8] mb-3">{b.title}</h3>
                  <p className="text-sm text-[#7A8090] leading-relaxed">{b.description}</p>

                  {/* Bottom line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${activeCard === i ? 'opacity-100' : 'opacity-0'}`}
                    style={{ background: `linear-gradient(90deg, transparent, ${b.color}, transparent)` }} />
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
