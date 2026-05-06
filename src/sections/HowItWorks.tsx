import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hand, RotateCcw, CreditCard, Smartphone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { icon: CreditCard, title: 'Paga', subtitle: 'contactless', description: 'Il cliente paga direttamente con carta o smartphone.', time: 'Facile', details: ['Nessuna app obbligatoria', 'Pagamento contactless', 'Sblocco istantaneo'] },
  { icon: Hand, title: 'Ritira', subtitle: 'il powerbank', description: 'Lo scomparto si apre automaticamente. Due cavi inclusi: Type-C e Lightning.', time: 'Veloce', details: ['8000mAh capacità', '2 cavi universali', 'Ricarica rapida'] },
  { icon: RotateCcw, title: 'Restituisci', subtitle: 'dove vuoi', description: 'Quando ha finito, il cliente restituisce il powerbank in qualsiasi stazione PlugHub.', time: 'Flessibile', details: ['Qualsiasi stazione', 'Senza vincoli', 'Flessibilità totale'] },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const section = sectionRef.current, title = titleRef.current, stepsEl = stepsRef.current, progress = progressRef.current;
    if (!section || !title || !stepsEl || !progress) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(title.querySelectorAll('.reveal-item'),
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.12, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.fromTo(progress, { scaleX: 0 },
        { scaleX: 1, duration: 2.5, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 55%', toggleActions: 'play none none reverse' },
        }
      );

      const stepEls = stepsEl.querySelectorAll('.step-item');
      gsap.fromTo(stepEls,
        { y: 60, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.15, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 60%', toggleActions: 'play none none reverse' },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative py-32 lg:py-40 overflow-hidden bg-[#040408]">
      <div className="section-line mb-24" />

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div ref={titleRef} className="text-center mb-20">
            <span className="reveal-item label block mb-5">COME FUNZIONA</span>
            <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F0F2F8] mb-6">
              Un servizio in più per i tuoi clienti. <span className="text-brand-gradient">Un pensiero in meno per te</span>
            </h2>
            <p className="reveal-item text-lg text-[#7A8090] max-w-xl mx-auto">
              Tre passaggi. Zero complicazioni. Il cliente noleggia in pochi secondi, anche senza app.
            </p>
          </div>

          {/* Energy beam progress — desktop */}
          <div className="relative mb-16 hidden lg:block">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/[0.04] -translate-y-1/2" />
            <div ref={progressRef} className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-[#41A3CF] via-[#7DD3FC] to-[#41A3CF] -translate-y-1/2 origin-left shadow-[0_0_12px_rgba(65,163,207,0.4)]" style={{ width: '100%' }} />
            <div className="relative flex justify-between">
              {steps.map((_, i) => (
                <button key={i} onMouseEnter={() => setActiveStep(i)}
                  className={`relative w-5 h-5 rounded-full border-2 transition-all duration-500 ${i <= activeStep ? 'bg-[#41A3CF] border-[#41A3CF] shadow-[0_0_16px_rgba(65,163,207,0.6)] scale-125' : 'bg-[#040408] border-white/15'}`}>
                  {i <= activeStep && <div className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(65,163,207,0.3)', animationDuration: '2s' }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div ref={stepsRef} className="grid lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="step-item group" onMouseEnter={() => setActiveStep(index)}>
                <div className={`relative glass p-8 pt-12 h-full ${index === activeStep ? 'border-[#41A3CF]/20' : ''}`}>
                  {/* Number badge */}
                  <div className="absolute -top-4 left-8 w-10 h-10 bg-[#41A3CF] text-[#040408] rounded-full flex items-center justify-center font-bold text-sm z-10 shadow-lg shadow-[#41A3CF]/30">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 ${index === activeStep ? 'bg-[#41A3CF]/15 scale-110' : 'bg-[#41A3CF]/8 group-hover:bg-[#41A3CF]/12'}`}>
                    <step.icon className="w-8 h-8 text-[#41A3CF]" />
                  </div>

                  {/* Time badge */}
                  <div className="absolute top-8 right-8">
                    <span className="label text-[10px] bg-[#41A3CF]/8 px-3 py-1.5 rounded-full">{step.time}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#F0F2F8] mb-1">{step.title}</h3>
                  <p className="text-sm text-[#41A3CF] mb-5">{step.subtitle}</p>
                  <p className="text-sm text-[#7A8090] leading-relaxed mb-6">{step.description}</p>

                  <ul className="space-y-3">
                    {step.details.map((d, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-xs text-[#7A8090]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#41A3CF] shadow-[0_0_4px_rgba(65,163,207,0.5)]" /> {d}
                      </li>
                    ))}
                  </ul>

                  <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#41A3CF] to-transparent transition-opacity duration-500 ${index === activeStep ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Payment methods */}
          <div className="mt-16 text-center">
            <p className="text-xs text-[#4A5060] mb-6 uppercase tracking-wider">Metodi di pagamento accettati</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { icon: CreditCard, text: 'Visa / Mastercard' },
                { icon: Smartphone, text: 'Apple Pay / Google Pay' },
              ].map((m, i) => (
                <div key={i} className="glass glass-hover flex items-center gap-3 px-6 py-3">
                  <m.icon className="w-4 h-4 text-[#41A3CF]" />
                  <span className="text-sm text-[#F0F2F8]">{m.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
