import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Zap, Shield, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL;

const features = [
  'Nessun abbonamento',
  'Nessuna commissione nascosta',
  'Restituisci in qualsiasi stazione',
  'Cavo incluso (Micro, Type-C, Lightning)',
  'Supporto 24/7',
];

const Pricing = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const image = imageRef.current;
    const line = lineRef.current;

    if (!section || !card || !image || !line) return;

    const ctx = gsap.context(() => {
      // Scroll-driven animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0-30%)
      scrollTl.fromTo(
        card,
        { opacity: 0, x: '-60vw' },
        { opacity: 1, x: 0, ease: 'none' },
        0
      );

      scrollTl.fromTo(
        image,
        { opacity: 0, x: '55vw' },
        { opacity: 1, x: 0, ease: 'none' },
        0.08
      );

      // Line draw
      const lineLength = line.getTotalLength();
      gsap.set(line, {
        strokeDasharray: lineLength,
        strokeDashoffset: lineLength,
      });
      scrollTl.to(
        line,
        { strokeDashoffset: 0, ease: 'none' },
        0.1
      );

      // Price animation
      const priceEl = card.querySelector('.price-big');
      if (priceEl) {
        scrollTl.fromTo(
          priceEl,
          { scale: 0.92, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'none' },
          0.14
        );
      }

      // SETTLE (30-70%): Hold

      // EXIT (70-100%)
      scrollTl.fromTo(
        card,
        { opacity: 1 },
        { opacity: 0, x: '-14vw', ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        image,
        { opacity: 1 },
        { opacity: 0, x: '12vw', ease: 'power2.in' },
        0.7
      );

      scrollTl.fromTo(
        line,
        { opacity: 1 },
        { opacity: 0, ease: 'power2.in' },
        0.75
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="section-pinned bg-brand-black flex items-center justify-center"
    >
      {/* Neon line */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={lineRef}
          d="M 8 50 Q 25 45, 54 50 Q 70 54, 90 50"
          fill="none"
          stroke="#2EE9FF"
          strokeWidth="0.1"
          className="neon-line"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative w-full px-6 lg:px-12 pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            {/* Pricing Card */}
            <div
              ref={cardRef}
              className="card-glass card-shadow p-8 lg:p-12 relative overflow-hidden"
            >
              {/* Badge */}
              <div className="absolute top-0 right-0 bg-brand-cyan text-brand-black text-xs font-bold px-4 py-2 rounded-bl-2xl font-mono uppercase tracking-wider">
                Paga e Usa
              </div>

              <span className="text-caption mb-4 block">PREZZI TRASPARENTI</span>

              <h2 className="text-3xl sm:text-4xl font-sora font-bold text-brand-white mb-6">
                Tariffe semplici
              </h2>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="price-big text-7xl lg:text-8xl font-sora font-bold text-gradient">
                  €1
                </span>
              </div>
              <p className="text-lg text-brand-gray mb-8">
                ogni 30 minuti
              </p>

              <p className="text-brand-gray mb-8">
                Nessun abbonamento. Nessuna commissione nascosta. Paghi solo per il tempo che utilizzi.
              </p>

              <ul className="space-y-3 mb-8">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-brand-gray">
                    <Check className="w-5 h-5 text-brand-cyan flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="btn-filled w-full sm:w-auto">
                Inizia a noleggiare
              </button>

              {/* Decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-brand-cyan/10 rounded-full blur-3xl" />
            </div>

            {/* Image Card */}
            <div
              ref={imageRef}
              className="card-glass card-shadow overflow-hidden relative h-[500px] lg:h-[600px]"
            >
              <img
                src={`${base}images/powerbank lato.png`}
                alt="PlugHub Power Bank"
                className="absolute inset-0 w-full h-full object-contain p-8"
              />

              {/* Overlay stats */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
                <div className="bg-brand-black/80 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Zap className="w-5 h-5 text-brand-cyan mx-auto mb-2" />
                  <span className="text-lg font-bold text-brand-white">10W</span>
                  <span className="text-xs text-brand-gray block">Ricarica</span>
                </div>
                <div className="bg-brand-black/80 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Shield className="w-5 h-5 text-brand-cyan mx-auto mb-2" />
                  <span className="text-lg font-bold text-brand-white">Sicuro</span>
                  <span className="text-xs text-brand-gray block">Certificato</span>
                </div>
                <div className="bg-brand-black/80 backdrop-blur-sm rounded-xl p-4 text-center">
                  <Clock className="w-5 h-5 text-brand-cyan mx-auto mb-2" />
                  <span className="text-lg font-bold text-brand-white">2h</span>
                  <span className="text-xs text-brand-gray block">Ricarica</span>
                </div>
              </div>

              {/* Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
