import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hand, RotateCcw, CreditCard, Smartphone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    icon: CreditCard,
    title: 'Paga',
    subtitle: 'contactless',
    description: 'Il cliente paga direttamente con carta o smartphone.',
    time: 'Facile',
    details: ['Nessuna app obbligatoria', 'Pagamento contactless', 'Sblocco istantaneo'],
  },
  {
    icon: Hand,
    title: 'Ritira',
    subtitle: 'il powerbank',
    description: 'Lo scomparto si apre automaticamente. Due cavi inclusi: Type-C e Lightning.',
    time: 'Veloce',
    details: ['8000mAh capacità', '2 cavi universali', 'Ricarica rapida'],
  },
  {
    icon: RotateCcw,
    title: 'Restituisci',
    subtitle: 'dove vuoi',
    description: 'Quando ha finito, il cliente restituisce il powerbank in qualsiasi stazione PlugHub.',
    time: 'Flessibile',
    details: ['Qualsiasi stazione', 'Senza vincoli', 'Flessibilità totale'],
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const steps = stepsRef.current;
    const progress = progressRef.current;

    if (!section || !title || !steps || !progress) return;

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

      // Progress line animation
      gsap.fromTo(
        progress,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 2.5,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Steps reveal with smooth 3D effect
      const stepElements = steps.querySelectorAll('.step-item');
      gsap.fromTo(
        stepElements,
        { y: 60, opacity: 0, rotateX: 12, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          },
        }
      );

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
      id="how-it-works"
      className="relative bg-brand-black py-32 lg:py-40 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cyan/[0.02] via-transparent to-brand-cyan/[0.02]" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
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

      {/* Energy wave line */}
      <svg className="absolute top-0 left-0 w-full h-24 opacity-20" viewBox="0 0 1200 96" preserveAspectRatio="none">
        <path
          d="M0,48 Q200,0 400,48 T800,48 T1200,48"
          fill="none"
          stroke="url(#energyGradient2)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="energyGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#2EE9FF" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-20">
            <span className="reveal-item inline-block text-caption mb-6 font-mono tracking-widest">COME FUNZIONA</span>
            <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl font-sora font-bold text-brand-white mb-6">
              Un servizio in più per i tuoi clienti. <span className="text-gradient">Un pensiero in meno per te</span>
            </h2>
            <p className="reveal-item text-lg text-brand-gray max-w-2xl mx-auto">
              Tre passaggi. Zero complicazioni. Il cliente noleggia in pochi secondi, anche senza app.
            </p>
          </div>

          {/* Progress Line */}
          <div className="relative mb-16 hidden lg:block">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2" />
            <div 
              ref={progressRef}
              className="absolute top-1/2 left-0 h-px bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-cyan -translate-y-1/2 origin-left"
              style={{ width: '100%' }}
            />
            <div className="relative flex justify-between">
              {steps.map((_, i) => (
                <div 
                  key={i}
                  className={`w-5 h-5 rounded-full border-2 transition-all duration-500 cursor-pointer ${
                    i <= activeStep 
                      ? 'bg-brand-cyan border-brand-cyan scale-125 shadow-[0_0_15px_rgba(46,233,255,0.6)]' 
                      : 'bg-brand-black border-white/30'
                  }`}
                  onMouseEnter={() => setActiveStep(i)}
                />
              ))}
            </div>
          </div>

          {/* Steps */}
          <div 
            ref={stepsRef} 
            className="grid lg:grid-cols-3 gap-8"
            style={{ perspective: '1000px' }}
          >
            {steps.map((step, index) => (
              <div
                key={index}
                className="step-item group"
                onMouseEnter={() => setActiveStep(index)}
              >
                {/* Step number */}
                <div className="absolute -top-4 left-6 w-10 h-10 bg-brand-cyan text-brand-black rounded-full flex items-center justify-center font-bold text-lg z-10 shadow-lg shadow-brand-cyan/40">
                  {index + 1}
                </div>

                <div 
                  className={`relative bg-white/5 backdrop-blur-xl border rounded-3xl p-8 pt-12 transition-all duration-500 ${
                    index === activeStep 
                      ? 'border-brand-cyan/50 bg-white/10 shadow-[0_0_30px_rgba(46,233,255,0.2)]' 
                      : 'border-white/10 hover:border-brand-cyan/20'
                  }`}
                >
                  {/* Icon */}
                  <div 
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${
                      index === activeStep 
                        ? 'bg-brand-cyan/20 scale-110 shadow-[0_0_20px_rgba(46,233,255,0.3)]' 
                        : 'bg-brand-cyan/10 group-hover:bg-brand-cyan/15'
                    }`}
                  >
                    <step.icon className="w-8 h-8 text-brand-cyan" />
                  </div>

                  {/* Time badge */}
                  <div className="absolute top-6 right-6">
                    <span className="text-xs font-mono text-brand-cyan bg-brand-cyan/10 px-3 py-1.5 rounded-full">
                      {step.time}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-sora font-bold text-brand-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-brand-cyan mb-4">{step.subtitle}</p>

                  {/* Description */}
                  <p className="text-brand-gray leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Details list */}
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-brand-gray/80">
                        <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full" />
                        {detail}
                      </li>
                    ))}
                  </ul>

                  {/* Active indicator */}
                  <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-cyan to-transparent transition-opacity duration-500 ${
                    index === activeStep ? 'opacity-100' : 'opacity-0'
                  }`} />
                </div>
              </div>
            ))}
          </div>

          {/* Payment methods */}
          <div className="mt-16 text-center">
            <p className="text-sm text-brand-gray mb-6">Metodi di pagamento accettati</p>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 hover:border-brand-cyan/30 hover:bg-white/10 transition-all duration-300">
                <CreditCard className="w-5 h-5 text-brand-cyan" />
                <span className="text-brand-white">Visa / Mastercard</span>
              </div>
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 hover:border-brand-cyan/30 hover:bg-white/10 transition-all duration-300">
                <Smartphone className="w-5 h-5 text-brand-cyan" />
                <span className="text-brand-white">Apple Pay / Google Pay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
