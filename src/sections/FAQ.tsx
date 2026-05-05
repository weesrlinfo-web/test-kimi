import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: 'Come funziona?',
    answer: 'Il cliente ritira un powerbank e lo restituisce quando vuole. Paga in base al tempo.',
  },
  {
    question: 'Devo installare un\'app?',
    answer: 'Dipende dal flusso di pagamento scelto. In generale puoi pagare con carta / Apple Pay / Google Pay.',
  },
  {
    question: 'La mappa non si vede: perché?',
    answer: 'La mappa usa Google Maps e richiede il consenso ai cookie di terze parti. La lista delle stazioni rimane sempre visibile anche senza accettare i cookie.',
  },
  {
    question: 'Cosa succede se non riconsegno il powerbank?',
    answer: 'Se il powerbank non viene riconsegnato entro 24 ore dal prelievo, verrà addebitata automaticamente sulla carta utilizzata una penale di 30€.',
  },
  {
    question: 'Quanto dura la batteria del powerbank?',
    answer: 'I nostri powerbank a ricarica rapida hanno una capacità di 8000mAh, sufficiente per ricaricare completamente la maggior parte degli smartphone più di 2 volte.',
  },
  {
    question: 'Posso usare il powerbank con qualsiasi dispositivo?',
    answer: 'Sì! I nostri powerbank a ricarica rapida includono due cavi: USB Type-C e Lightning. Puoi ricaricare smartphone, tablet, auricolari e altri dispositivi compatibili.',
  },
];

const FAQ = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const items = itemsRef.current;

    if (!section || !title || !items) return;

    const ctx = gsap.context(() => {
      // Title entrance
      gsap.fromTo(
        title,
        { opacity: 0, y: 35, filter: 'blur(8px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // FAQ items staggered entrance
      const faqItems = items.querySelectorAll('.faq-item');
      gsap.fromTo(
        faqItems,
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative bg-brand-black py-24 lg:py-32"
    >
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-brand-blue/5 to-transparent pointer-events-none" />

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div ref={titleRef} className="text-center mb-12">
            <span className="text-caption mb-4 block">DOMANDE FREQUENTI</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sora font-bold text-brand-white mb-4">
              FAQ
            </h2>
            <p className="text-brand-gray text-lg">
              Risposte rapide alle domande più comuni.
            </p>
          </div>

          {/* FAQ Items */}
          <div ref={itemsRef} className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="faq-item bg-brand-charcoal/50 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-sora font-semibold text-brand-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-brand-cyan flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden faq-answer ${
                    openIndex === index ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="px-5 pb-5 text-brand-gray">{faq.answer}</p>
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
