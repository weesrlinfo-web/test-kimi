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
        { y: 35, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.12, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );

      gsap.fromTo(progress, { scaleX: 0 },
        { scaleX: 1, duration: 2, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 55%', toggleActions: 'play none none reverse' },
        }
      );

      const stepEls = stepsEl.querySelectorAll('.step-item');
      gsap.fromTo(stepEls,
        { y: 50, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.85, stagger: 0.12, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 60%', toggleActions: 'play none none reverse' },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative py-28 lg:py-36 overflow-hidden bg-[#06060A]">
      <div className="section-line mb-20" />

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <div ref={titleRef} className="text-center mb-16">
            <span className="reveal-item label block mb-4">COME FUNZIONA</span>
            <h2 className="reveal-item text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FA] mb-5">
              Un servizio in più per i tuoi clienti. <span className="text-brand-gradient">Un pensiero in meno per te</span>
            </h2>
            <p className="reveal-item text-base sm:text-lg text-[#8A8F9D] max-w-xl mx-auto">
              Tre passaggi. Zero complicazioni. Il cliente noleggia in pochi secondi, anche senza app.
            </p>
          </div>

          {/* Progress line — desktop */}
          <div className="relative mb-14 hidden lg:block">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-white/[0.06] -translate-y-1/2" />
            <div ref={progressRef} className="absolute top-1/2 left-0 h-px bg-gradient-to-r from-[#41A3CF] to-[#5BB8E0] -translate-y-1/2 origin-left" style={{ width: '100%' }} />
            <div className="relative flex justify-between">
              {steps.map((_, i) => (
                <button key={i} onMouseEnter={() => setActiveStep(i)}
                  className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${i <= activeStep ? 'bg-[#41A3CF] border-[#41A3CF] shadow-[0_0_12px_rgba(65,163,207,0.5)] scale-125' : 'bg-[#06060A] border-white/20'}`} />
              ))}
            </div>
          </div>

          {/* Steps */}
          <div ref={stepsRef} className="grid lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="step-item group" onMouseEnter={() => setActiveStep(index)}>
                {/* Number badge */}
                <div className="absolute -top-3 left-6 w-9 h-9 bg-[#41A3CF] text-[#06060A] rounded-full flex items-center justify-center font-bold text-sm z-10 shadow-lg shadow-[#41A3CF]/30">
                  {index + 1}
                </div>

                <div className={`relative glass p-7 pt-10 h-full ${index === activeStep ? 'border-[#41A3CF]/30' : ''}`}>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 ${index === activeStep ? 'bg-[#41A3CF]/15 scale-110' : 'bg-[#41A3CF]/8 group-hover:bg-[#41A3CF]/12'}`}>
                    <step.icon className="w-7 h-7 text-[#41A3CF]" />
                  </div>

                  {/* Time badge */}
                  <div className="absolute top-6 right-6">
                    <span className="label text-[10px] bg-[#41A3CF]/10 px-2.5 py-1 rounded-full">{step.time}</span>
                  </div>

                  <h3 className="text-xl font-bold text-[#F4F6FA] mb-0.5">{step.title}</h3>
                  <p className="text-sm text-[#41A3CF] mb-4">{step.subtitle}</p>
                  <p className="text-sm text-[#8A8F9D] leading-relaxed mb-5">{step.description}</p>

                  <ul className="space-y-2">
                    {step.details.map((d, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-[#8A8F9D]">
                        <div className="w-1 h-1 rounded-full bg-[#41A3CF]" /> {d}
                      </li>
                    ))}
                  </ul>

                  <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#41A3CF] to-transparent transition-opacity duration-500 ${index === activeStep ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Payment methods */}
          <div className="mt-14 text-center">
            <p className="text-xs text-[#5A5F6D] mb-5 uppercase tracking-wider">Metodi di pagamento accettati</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { icon: CreditCard, text: 'Visa / Mastercard' },
                { icon: Smartphone, text: 'Apple Pay / Google Pay' },
              ].map((m, i) => (
                <div key={i} className="glass glass-hover flex items-center gap-2.5 px-5 py-2.5">
                  <m.icon className="w-4 h-4 text-[#41A3CF]" />
                  <span className="text-sm text-[#F4F6FA]">{m.text}</span>
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
