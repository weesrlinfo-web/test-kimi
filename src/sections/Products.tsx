import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { scrollToSection } from '@/lib/scrollToSection';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const modularFeatures = [
  'Aggiungi moduli in qualsiasi momento',
  'Design moderno e premium',
  'Installazione rapida: 10 minuti',
  'Si integra con qualsiasi arredamento',
];

// Energy level indicator
const EnergyIndicator = ({ level }: { level: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={`w-1.5 h-4 rounded-sm transition-all duration-300 ${
            i < Math.ceil(level / 20)
              ? 'bg-brand-cyan shadow-[0_0_8px_rgba(46,233,255,0.8)]'
              : 'bg-white/10'
          }`}
        />
      ))}
    </div>
    <Zap className="w-4 h-4 text-brand-cyan" />
  </div>
);

type Product = {
  id: string;
  name: string;
  slots: number;
  image: string;
  imageSide: string;
  description: string;
  features: string[];
  bestFor: string;
  dimensions: string;
  energy: number;
  recommended?: boolean;
};

const Products = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const modularRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const [colorVariants, setColorVariants] = useState<Record<string, 'black' | 'white'>>({
    compact: 'black',
    standard: 'black',
    maxi: 'black',
  });

  const base = import.meta.env.BASE_URL;

  const products: Product[] = [
    {
      id: 'compact',
      name: 'Compact',
      slots: 4,
      image: `${base}images/t4n.png`,
      imageSide: `${base}images/t4b.png`,
      description: 'Ideale per piccoli locali',
      features: ['4 powerbank', 'Display touch 15"', 'Multi-lingua', 'Pubblicità integrata'],
      bestFor: 'Bar, tabacchi',
      dimensions: '45 × 35 × 25 cm',
      energy: 40,
    },
    {
      id: 'standard',
      name: 'Standard',
      slots: 8,
      image: `${base}images/t8n.png`,
      imageSide: `${base}images/t8b.png`,
      description: 'La scelta che si adatta alla maggior parte dei locali',
      features: ['8 powerbank', 'Display touch 15"', 'Multi-lingua', 'Pubblicità integrata'],
      bestFor: 'Ristoranti, hotel',
      dimensions: '55 × 45 × 30 cm',
      energy: 70,
      recommended: true,
    },
    {
      id: 'maxi',
      name: 'Maxi',
      slots: 12,
      image: `${base}images/t12n.png`,
      imageSide: `${base}images/t12b.png`,
      description: 'Per location ad alto traffico ed eventi',
      features: ['12 powerbank', 'Display touch 15"', 'Multi-lingua', 'Pubblicità integrata'],
      bestFor: 'Centri commerciali',
      dimensions: '65 × 55 × 35 cm',
      energy: 100,
    },
  ];

  const toggleColor = (id: string) => {
    setColorVariants((prev) => ({
      ...prev,
      [id]: prev[id] === 'black' ? 'white' : 'black',
    }));
  };

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const modular = modularRef.current;
    const cards = cardsRef.current;

    if (!section || !title || !modular || !cards) return;

    const ctx = gsap.context(() => {
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

      gsap.fromTo(
        modular,
        { y: 50, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 68%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const cardElements = cards.querySelectorAll('.product-card');
      gsap.fromTo(
        cardElements,
        {
          y: 80,
          opacity: 0,
          rotateY: (i: number) => (i === 0 ? -15 : i === 2 ? 15 : 0),
          scale: 0.96,
        },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          scale: 1,
          duration: 1.1,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="products"
      className="relative bg-brand-black py-32 lg:py-40 overflow-hidden"
    >
      <div className="absolute inset-0">
        <div
          className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(46, 233, 255, 0.05) 0%, transparent 60%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-brand-cyan/50 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: '0 0 8px rgba(46, 233, 255, 0.8)',
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
      `}</style>

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div ref={titleRef} className="text-center mb-16">
            <span className="reveal-item inline-block text-caption mb-6 font-mono tracking-widest">
              IL PRODOTTO
            </span>
            <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl font-sora font-bold text-brand-white mb-6">
              Torrette <span className="text-gradient">modulari</span>
            </h2>
            <p className="reveal-item text-lg text-brand-gray max-w-2xl mx-auto">
              Tre modelli per ogni esigenza. Tutti espandibili e con design premium.
            </p>
          </div>

          <div
            ref={modularRef}
            className="relative mb-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 overflow-hidden group hover:border-brand-cyan/30 hover:bg-white/10 card-premium"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan/5 via-transparent to-brand-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="absolute top-1/2 left-8 -translate-y-1/2 w-16 h-16">
              <div className="absolute inset-0 bg-brand-cyan/20 rounded-full animate-ping" />
              <div className="absolute inset-2 bg-brand-cyan/30 rounded-full animate-pulse" />
            </div>

            <div className="relative flex flex-col lg:flex-row items-center gap-8 pl-20">
              <div>
                <h3 className="font-sora font-semibold text-brand-white text-xl mb-1">
                  Sistema modulare
                </h3>
                <p className="text-brand-gray">Inizia piccolo, espandi quando vuoi</p>
              </div>
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {modularFeatures.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-brand-cyan flex-shrink-0" />
                    <span className="text-sm text-brand-gray">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={cardsRef}
            className="grid lg:grid-cols-3 gap-6"
            style={{ perspective: '1200px' }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="product-card group relative"
                onMouseEnter={() => setActiveProduct(product.id)}
                onMouseLeave={() => setActiveProduct(null)}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div
                  className={`relative bg-brand-charcoal/40 border rounded-3xl overflow-hidden card-premium ${
                    product.recommended
                      ? 'border-brand-cyan/50 ring-1 ring-brand-cyan/30 shadow-[0_0_30px_rgba(46,233,255,0.1)]'
                      : 'border-white/[0.06] hover:border-brand-cyan/30'
                  }`}
                >


                  <div className="relative h-64 bg-gradient-to-b from-brand-charcoal to-brand-black flex items-center justify-center p-6 overflow-hidden">
                    <div
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        activeProduct === product.id ? 'opacity-100' : 'opacity-0'
                      }`}
                      style={{
                        background:
                          'radial-gradient(circle at 50% 50%, rgba(46, 233, 255, 0.15) 0%, transparent 70%)',
                      }}
                    />

                    <img
                      src={colorVariants[product.id] === 'black' ? product.image : product.imageSide}
                      alt={product.name}
                      className="relative z-10 max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                    />

                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-xl rounded-full p-1.5 z-20 border border-white/10">
                      <button
                        onClick={() => toggleColor(product.id)}
                        className={`w-5 h-5 rounded-full border-2 transition-all ${
                          colorVariants[product.id] === 'black'
                            ? 'border-brand-cyan bg-black shadow-[0_0_8px_rgba(46,233,255,0.5)]'
                            : 'border-white/30 bg-black'
                        }`}
                        title="Nero"
                      />
                      <button
                        onClick={() => toggleColor(product.id)}
                        className={`w-5 h-5 rounded-full border-2 transition-all ${
                          colorVariants[product.id] === 'white'
                            ? 'border-brand-cyan bg-white shadow-[0_0_8px_rgba(46,233,255,0.5)]'
                            : 'border-white/30 bg-white'
                        }`}
                        title="Bianco"
                      />
                    </div>

                    <div className="absolute bottom-4 left-4 bg-brand-cyan/20 backdrop-blur-xl rounded-full px-4 py-1.5 border border-brand-cyan/30">
                      <span className="text-sm font-semibold text-brand-cyan">{product.slots} slot</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-sora font-bold text-brand-white group-hover:text-brand-cyan transition-colors">
                        {product.name}
                      </h3>
                      <EnergyIndicator level={product.energy} />
                    </div>

                    <p className="text-brand-gray text-sm mb-4">{product.description}</p>

                    <ul className="space-y-2 mb-5">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-brand-gray/80">
                          <Check className="w-4 h-4 text-brand-cyan" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-brand-cyan font-mono">{product.dimensions}</span>
                      <button
                        onClick={() =>
                          scrollToSection('contact')
                        }
                        className={`flex items-center gap-1 text-sm font-medium transition-all duration-300 ${
                          activeProduct === product.id ? 'text-brand-cyan gap-2' : 'text-brand-gray'
                        }`}
                      >
                        Richiedi
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-brand-cyan/5 to-transparent transition-opacity duration-500 pointer-events-none ${
                      activeProduct === product.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
