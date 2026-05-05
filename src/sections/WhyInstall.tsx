import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, TrendingUp, Smile, Ban, Euro, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: Euro,
    title: 'Zero costi per il locale',
    description: 'Nessun costo di installazione o gestione.',
    highlight: '100% GRATIS',
    color: '#2EE9FF',
  },
  {
    icon: Clock,
    title: 'Zero impatti operativi',
    description: 'Nessun impegno per lo staff. Nessuna preoccupazione per te.',
    highlight: 'ZERO PENSIERI',
    color: '#41A3CF',
  },
  {
    icon: TrendingUp,
    title: "Aumenta l'offerta del tuo locale",
    description: 'Un servizio sempre più richiesto da aggiungere alla tua offerta.',
    highlight: 'PIÙ OFFERTA',
    color: '#2EE9FF',
  },
  {
    icon: Smile,
    title: 'Clienti più soddisfatti',
    description: "Coccola i tuoi clienti con la ricarica più veloce in Italia",
    highlight: 'PIÙ ATTENZIONE',
    color: '#41A3CF',
  },
  {
    icon: Ban,
    title: 'Meno richieste. Zero responsabilità',
    description: 'Solleva lo staff da richieste e preoccupazioni senza rinunciare al servizio.',
    highlight: 'ZERO STRESS',
    color: '#2EE9FF',
  },
  {
    icon: Shield,
    title: 'Qualità certificata',
    description: 'Stazione PlugHub di ultima geerazione con powerbank a carica rapida.',
    highlight: 'TOP QUALITY',
    color: '#41A3CF',
  },
];

const WhyInstall = () => {
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
      const titleItems = title.querySelectorAll('.reveal-item');
      gsap.fromTo(
        titleItems,
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

      // Cards reveal with smooth 3D perspective
      const cardElements = cards.querySelectorAll('.benefit-card');
      gsap.fromTo(
        cardElements,
        {
          y: 60,
          opacity: 0,
          rotateX: 12,
          scale: 0.96,
          transformPerspective: 1000,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Floating particles in background
      const particles = section.querySelectorAll('.float-particle');
      particles.forEach((particle, i) => {
        gsap.to(particle, {
          y: -20 + Math.random() * 40,
          x: -12 + Math.random() * 24,
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
      id="why-install"
      className="relative bg-brand-black py-32 lg:py-40 overflow-hidden"
    >
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="float-particle absolute w-1 h-1 bg-brand-cyan/40 rounded-full"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              boxShadow: '0 0 6px rgba(46, 233, 255, 0.6)',
            }}
          />
        ))}
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-cyan/[0.02] to-transparent" />

      {/* Energy wave line */}
      <svg className="absolute top-0 left-0 w-full h-20 opacity-30" viewBox="0 0 1200 80" preserveAspectRatio="none">
        <path
          d="M0,40 Q300,0 600,40 T1200,40"
          fill="none"
          stroke="url(#energyGradient)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#2EE9FF" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-20">
            <span className="reveal-item inline-block text-caption mb-6 font-mono tracking-widest">PERCHÉ INSTALLARE PLUGHUB</span>
            <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl font-sora font-bold text-brand-white mb-6">
              Perché installare PlugHub <span className="text-gradient">nel tuo locale</span>
            </h2>
            <p className="reveal-item text-lg text-brand-gray max-w-2xl mx-auto leading-relaxed">
              Offri un servizio utile ai clienti, senza costi e senza gestione.
            </p>
          </div>

          {/* Benefits Grid */}
          <div 
            ref={cardsRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ perspective: '1000px' }}
          >
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="benefit-card group relative"
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div 
                  className={`relative bg-white/5 backdrop-blur-xl border rounded-2xl p-8 overflow-hidden card-premium ${
                    activeCard === index 
                      ? 'border-brand-cyan/50 bg-white/10 scale-[1.02] shadow-[0_0_30px_rgba(46,233,255,0.15)]' 
                      : 'border-white/10 hover:border-brand-cyan/30'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Energy glow on hover */}
                  <div 
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${benefit.color}15 0%, transparent 70%)`,
                    }}
                  />

                  {/* Highlight badge with glitch effect */}
                  <div className="absolute top-4 right-4">
                    <span 
                      className="text-[10px] font-mono tracking-wider px-2 py-1 rounded"
                      style={{ 
                        color: benefit.color,
                        background: `${benefit.color}15`,
                      }}
                    >
                      {benefit.highlight}
                    </span>
                  </div>

                  {/* Icon with energy ring */}
                  <div className="relative w-14 h-14 mb-6">
                    <div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `radial-gradient(circle, ${benefit.color}30 0%, transparent 70%)`,
                        filter: 'blur(8px)',
                      }}
                    />
                    <div 
                      className="relative w-full h-full rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ background: `${benefit.color}15` }}
                    >
                      <benefit.icon className="w-7 h-7" style={{ color: benefit.color }} />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-sora font-semibold text-brand-white mb-3 group-hover:text-brand-cyan transition-colors duration-300">
                    {benefit.title}
                  </h3>
                  <p className="text-brand-gray leading-relaxed text-sm">
                    {benefit.description}
                  </p>

                  {/* Bottom energy line */}
                  <div 
                    className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-500 ${
                      activeCard === index ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{
                      background: `linear-gradient(90deg, transparent, ${benefit.color}, transparent)`,
                    }}
                  />

                  {/* Corner accent */}
                  <div className={`absolute top-0 right-0 w-8 h-8 transition-opacity duration-300 ${activeCard === index ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute top-3 right-3 w-4 h-px" style={{ background: benefit.color }} />
                    <div className="absolute top-3 right-3 w-px h-4" style={{ background: benefit.color }} />
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
