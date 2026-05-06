import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  { question: 'Come funziona?', answer: 'Il cliente ritira un powerbank e lo restituisce quando vuole. Paga in base al tempo.' },
  { question: 'Devo installare un\'app?', answer: 'Dipende dal flusso di pagamento scelto. In generale puoi pagare con carta / Apple Pay / Google Pay.' },
  { question: 'La mappa non si vede: perché?', answer: 'La mappa usa Google Maps e richiede il consenso ai cookie di terze parti. La lista delle stazioni rimane sempre visibile anche senza accettare i cookie.' },
  { question: 'Cosa succede se non riconsegno il powerbank?', answer: 'Se il powerbank non viene riconsegnato entro 24 ore dal prelievo, verrà addebitata automaticamente sulla carta utilizzata una penale di 30€.' },
  { question: 'Quanto dura la batteria del powerbank?', answer: 'I nostri powerbank a ricarica rapida hanno una capacità di 8000mAh, sufficiente per ricaricare completamente la maggior parte degli smartphone più di 2 volte.' },
  { question: 'Posso usare il powerbank con qualsiasi dispositivo?', answer: 'Sì! I nostri powerbank a ricarica rapida includono due cavi: USB Type-C e Lightning. Puoi ricaricare smartphone, tablet, auricolari e altri dispositivi compatibili.' },
];

const FAQ = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const s = sectionRef.current, t = titleRef.current, i = itemsRef.current;
    if (!s || !t || !i) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(t.querySelectorAll('.reveal-item'), { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'expo.out',
          scrollTrigger: { trigger: s, start: 'top 85%', toggleActions: 'play none none reverse' },
        }
      );
      const items = i.querySelectorAll('.faq-item');
      gsap.fromTo(items, { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: 'expo.out',
          scrollTrigger: { trigger: s, start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );
    }, s);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="faq" className="relative py-28 lg:py-36 bg-[#040408]">
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#41A3CF]/[0.015] to-transparent pointer-events-none" />
      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <div ref={titleRef} className="text-center mb-14">
            <span className="reveal-item label block mb-4">DOMANDE FREQUENTI</span>
            <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F0F2F8] mb-4">FAQ</h2>
            <p className="reveal-item text-base text-[#7A8090]">Risposte rapide alle domande più comuni.</p>
          </div>

          <div ref={itemsRef} className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="faq-item">
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left glass glass-hover">
                  <span className="font-semibold text-[#F0F2F8] pr-4 text-sm sm:text-base">{f.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#41A3CF] flex-shrink-0 transition-transform duration-500 ${open === i ? 'rotate-180' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${open === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-6 pb-5 pt-1 text-sm text-[#7A8090] leading-relaxed">{f.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
