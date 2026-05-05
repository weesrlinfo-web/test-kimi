import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { scrollToSection } from '@/lib/scrollToSection';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Store, TrendingUp, Zap, Check, Mail, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: Store,
    title: 'Attrai clienti',
    description: 'Aumenta il traffico nel tuo locale con un servizio utile e richiesto.',
  },
  {
    icon: TrendingUp,
    title: 'Guadagno condiviso',
    description: 'Entrate su ogni noleggio senza investimenti iniziali.',
  },
  {
    icon: Zap,
    title: 'Zero gestione',
    description: 'Lo staff non deve fare nulla. PlugHub gestisce tutto automaticamente.',
  },
];

const requirements = [
  'Un punto vicino alla cassa (visibile)',
  'Una presa di corrente',
  'Nessuna gestione da parte dello staff',
];

const Partnership = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    const cards = cardsRef.current;

    if (!section || !content || !cards) return;

    const ctx = gsap.context(() => {
      // Flowing section animation
      gsap.fromTo(
        content,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const cardElements = cards.querySelectorAll('.benefit-card');
      cardElements.forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);


  const scrollToContact = () => {
    scrollToSection('contact');
  };

  const scrollToMap = () => {
    scrollToSection('map-section');
  };

  return (
    <section
      ref={sectionRef}
      id="partnership"
      className="relative bg-brand-black py-24 lg:py-32"
    >
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-brand-cyan/5 to-transparent pointer-events-none" />

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div ref={contentRef} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Content */}
            <div>
              <span className="text-caption mb-4 block">PER I LOCALI</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-bold text-brand-white mb-6">
                Diventa partner PlugHub
              </h2>
              <p className="text-lg text-brand-gray mb-8">
                Offri un servizio utile ai tuoi clienti e genera entrate extra. 
                Installiamo la stazione, gestiamo tutto noi.
              </p>

              {/* Benefits */}
              <div ref={cardsRef} className="space-y-4 mb-10">
                {benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="benefit-card flex items-start gap-4 p-5 bg-brand-charcoal/50 border border-white/5 rounded-2xl hover:border-brand-cyan/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-brand-cyan/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-brand-cyan" />
                    </div>
                    <div>
                      <h3 className="font-sora font-semibold text-brand-white mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-brand-gray">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToContact}
                  className="btn-filled flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  Contattaci
                </button>
                <button
                  onClick={scrollToMap}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  Vedi la mappa
                </button>
              </div>
            </div>

            {/* Right: Requirements Card */}
            <div className="card-glass card-shadow p-8 lg:p-10">
              <h3 className="text-2xl font-sora font-bold text-brand-white mb-6">
                Cosa serve?
              </h3>

              <ul className="space-y-4 mb-8">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-cyan/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <span className="text-brand-gray">{req}</span>
                  </li>
                ))}
              </ul>

              <div className="p-6 bg-brand-black/50 rounded-2xl border border-white/5">
                <p className="text-sm text-brand-gray mb-2">
                  <span className="text-brand-cyan font-semibold">Tempo di installazione:</span> 30 minuti
                </p>
                <p className="text-sm text-brand-gray mb-2">
                  <span className="text-brand-cyan font-semibold">Manutenzione:</span> Gestita da PlugHub
                </p>
                <p className="text-sm text-brand-gray">
                  <span className="text-brand-cyan font-semibold">Pagamento:</span> Entrate mensili
                </p>
              </div>

              <p className="text-sm text-brand-gray/70 mt-6 text-center">
                Scrivici e ti mandiamo una proposta in 2 minuti.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partnership;
