import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { scrollToSection } from '@/lib/scrollToSection';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Beer, Building2, Dumbbell, Calendar, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const useCases = [
  {
    icon: Beer,
    title: 'Locali',
    description: 'Un dettaglio che i clienti notano e ricordano. Migliora l’esperienza e genera valore per il locale.',
    stat: 'Più',
    statLabel: 'offerta',
    gradient: 'from-orange-500/10 via-red-500/5 to-transparent',
    accent: '#f97316',
  },
  {
    icon: Building2,
    title: 'Hotel',
    description: 'Un servizio aggiuntivo per gli ospiti, disponibile 24/7.',
    stat: 'Servizio',
    statLabel: 'internazionale',
    gradient: 'from-blue-500/10 via-cyan-500/5 to-transparent',
    accent: '#3b82f6',
  },
  {
    icon: Dumbbell,
    title: 'Palestre & SPA',
    description: 'Perfetto mentre si fa sport o ci si rilassa, senza interrompere l\'esperienza.',
    stat: 'TOP',
    statLabel: 'servizio',
    gradient: 'from-green-500/10 via-emerald-500/5 to-transparent',
    accent: '#22c55e',
  },
  {
    icon: Calendar,
    title: 'Eventi & Congressi',
    description: 'Installazione temporanea per fiere, concerti e conferenze. Un servizio utile per i partecipanti.',
    stat: 'Fast',
    statLabel: 'setup',
    gradient: 'from-purple-500/10 via-pink-500/5 to-transparent',
    accent: '#a855f7',
  },
];

const UseCases = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current;

    if (!section || !title || !cards) return;

    const ctx = gsap.context(() => {
      // Title reveal with smooth blur fade
      gsap.fromTo(
        title.querySelectorAll('.reveal-item'),
        { y: 40, opacity: 0, filter: 'blur(12px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards reveal with smooth slide + scale
      const cardElements = cards.querySelectorAll('.usecase-card');
      cardElements.forEach((card, i) => {
        const direction = i % 2 === 0 ? -40 : 40;

        gsap.fromTo(
          card,
          { x: direction, opacity: 0, scale: 0.97 },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: i * 0.12,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Floating particles
      const particles = section.querySelectorAll('.float-particle');
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          y: -15 + Math.random() * 30,
          duration: 4 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.25,
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="use-cases"
      className="relative bg-brand-black py-32 lg:py-40 overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2">
        <div 
          className="w-full h-full"
          style={{
            background: 'radial-gradient(circle, rgba(46, 233, 255, 0.05) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="float-particle absolute w-1 h-1 bg-brand-cyan/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 6px rgba(46, 233, 255, 0.6)',
            }}
          />
        ))}
      </div>

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-20">
            <span className="reveal-item inline-block text-caption mb-6 font-mono tracking-widest">DOVE INSTALLARE PLUGHUB</span>
            <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl font-sora font-bold text-brand-white mb-6">
              Perfetto in <span className="text-gradient">ogni tipo di contesto</span>
            </h2>
            <p className="reveal-item text-lg text-brand-gray max-w-2xl mx-auto">
              PlugHub non è mai fuori posto.
            </p>
          </div>

          {/* Use Cases Grid */}
          <div ref={cardsRef} className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="usecase-card group relative"
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div 
                  className={`relative overflow-hidden bg-white/5 backdrop-blur-xl border rounded-3xl p-8 card-premium ${
                    activeCard === index 
                      ? 'border-brand-cyan/40 scale-[1.02] bg-white/10 shadow-[0_0_30px_rgba(46,233,255,0.15)]' 
                      : 'border-white/10 hover:border-brand-cyan/20'
                  }`}
                >
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-6">
                      <div 
                        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                        style={{ background: `${useCase.accent}15` }}
                      >
                        <useCase.icon className="w-7 h-7" style={{ color: useCase.accent }} />
                      </div>
                      <div className="text-right">
                        <div 
                          className="text-3xl font-sora font-bold"
                          style={{ color: useCase.accent }}
                        >
                          {useCase.stat}
                        </div>
                        <div className="text-xs text-brand-gray uppercase tracking-wider">{useCase.statLabel}</div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-sora font-bold text-brand-white mb-3 group-hover:text-brand-cyan transition-colors">
                      {useCase.title}
                    </h3>
                    <p className="text-brand-gray leading-relaxed mb-6">
                      {useCase.description}
                    </p>

                    <button 
                      onClick={() => scrollToSection('contact')}
                      className="inline-flex items-center gap-2 text-brand-cyan font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    >
                      Richiedi info
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Corner accent */}
                  <div className={`absolute top-0 right-0 w-20 h-20 transition-opacity duration-500 ${activeCard === index ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute top-4 right-4 w-8 h-px bg-brand-cyan/50" />
                    <div className="absolute top-4 right-4 w-px h-8 bg-brand-cyan/50" />
                  </div>

                  {/* Bottom glow line */}
                  <div className={`absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500 ${activeCard === index ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="h-full bg-gradient-to-r from-transparent via-brand-cyan/50 to-transparent" />
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
