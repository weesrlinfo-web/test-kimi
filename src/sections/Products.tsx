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

const EnergyBar = ({ level }: { level: number }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex gap-[3px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={`w-1 h-3.5 rounded-sm transition-all duration-300 ${i < Math.ceil(level / 20) ? 'bg-[#41A3CF] shadow-[0_0_6px_rgba(65,163,207,0.6)]' : 'bg-white/[0.08]'}`} />
      ))}
    </div>
    <Zap className="w-3.5 h-3.5 text-[#41A3CF]" />
  </div>
);

type Product = { id: string; name: string; slots: number; image: string; imageSide: string; description: string; features: string[]; bestFor: string; dimensions: string; energy: number; recommended?: boolean };

const Products = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const modularRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const [colors, setColors] = useState<Record<string, 'black'|'white'>>({ compact: 'black', standard: 'black', maxi: 'black' });
  const base = import.meta.env.BASE_URL;

  const products: Product[] = [
    { id: 'compact', name: 'Compact', slots: 4, image: `${base}images/t4n.png`, imageSide: `${base}images/t4b.png`, description: 'Ideale per piccoli locali', features: ['4 powerbank', 'Display touch 15"', 'Multi-lingua', 'Pubblicità integrata'], bestFor: 'Bar, tabacchi', dimensions: '45 × 35 × 25 cm', energy: 40 },
    { id: 'standard', name: 'Standard', slots: 8, image: `${base}images/t8n.png`, imageSide: `${base}images/t8b.png`, description: 'La scelta che si adatta alla maggior parte dei locali', features: ['8 powerbank', 'Display touch 15"', 'Multi-lingua', 'Pubblicità integrata'], bestFor: 'Ristoranti, hotel', dimensions: '55 × 45 × 30 cm', energy: 70, recommended: true },
    { id: 'maxi', name: 'Maxi', slots: 12, image: `${base}images/t12n.png`, imageSide: `${base}images/t12b.png`, description: 'Per location ad alto traffico ed eventi', features: ['12 powerbank', 'Display touch 15"', 'Multi-lingua', 'Pubblicità integrata'], bestFor: 'Centri commerciali', dimensions: '65 × 55 × 35 cm', energy: 100 },
  ];

  const toggle = (id: string) => setColors(p => ({ ...p, [id]: p[id] === 'black' ? 'white' : 'black' }));

  useEffect(() => {
    const section = sectionRef.current, title = titleRef.current, modular = modularRef.current, cards = cardsRef.current;
    if (!section || !title || !modular || !cards) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(title.querySelectorAll('.reveal-item'),
        { y: 35, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.9, stagger: 0.12, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );
      gsap.fromTo(modular, { y: 40, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' },
        }
      );
      const cardEls = cards.querySelectorAll('.product-card');
      gsap.fromTo(cardEls,
        { y: 60, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.1, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 55%', toggleActions: 'play none none reverse' },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="products" className="relative py-28 lg:py-36 overflow-hidden bg-[#06060A]">
      <div className="section-line mb-20" />

      {/* Side glow */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] -translate-y-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(65,163,207,0.04) 0%, transparent 60%)', filter: 'blur(50px)' }} />

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div ref={titleRef} className="text-center mb-14">
            <span className="reveal-item label block mb-4">IL PRODOTTO</span>
            <h2 className="reveal-item text-3xl sm:text-4xl lg:text-5xl font-bold text-[#F4F6FA] mb-5">
              Torrette <span className="text-brand-gradient">modulari</span>
            </h2>
            <p className="reveal-item text-base sm:text-lg text-[#8A8F9D] max-w-xl mx-auto">
              Tre modelli per ogni esigenza. Tutti espandibili e con design premium.
            </p>
          </div>

          {/* Modular banner */}
          <div ref={modularRef} className="relative glass glass-hover p-6 lg:p-8 mb-14 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#41A3CF]/[0.03] via-transparent to-[#41A3CF]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 bg-[#41A3CF]/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-2 bg-[#41A3CF]/30 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F4F6FA] text-lg">Sistema modulare</h3>
                  <p className="text-sm text-[#8A8F9D]">Inizia piccolo, espandi quando vuoi</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
                {modularFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#41A3CF] flex-shrink-0" />
                    <span className="text-sm text-[#8A8F9D]">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product cards */}
          <div ref={cardsRef} className="grid lg:grid-cols-3 gap-5">
            {products.map((p) => (
              <div key={p.id} className="product-card group"
                onMouseEnter={() => setActiveProduct(p.id)} onMouseLeave={() => setActiveProduct(null)}>
                <div className={`relative glass overflow-hidden ${p.recommended ? 'border-[#41A3CF]/30 ring-1 ring-[#41A3CF]/15' : ''}`}>
                  {/* Recommended badge */}
                  {p.recommended && (
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#41A3CF]/15 backdrop-blur-sm border border-[#41A3CF]/25 rounded-full px-3 py-1">
                      <Zap className="w-3 h-3 text-[#41A3CF]" />
                      <span className="text-[10px] font-semibold text-[#41A3CF] uppercase tracking-wider">Consigliato</span>
                    </div>
                  )}

                  {/* Image area */}
                  <div className="relative h-56 bg-gradient-to-b from-[#0A0A12] to-[#06060A] flex items-center justify-center p-6 overflow-hidden">
                    <div className={`absolute inset-0 transition-opacity duration-500 ${activeProduct === p.id ? 'opacity-100' : 'opacity-0'}`}
                      style={{ background: 'radial-gradient(circle at 50% 50%, rgba(65,163,207,0.12) 0%, transparent 70%)' }} />
                    <img src={colors[p.id] === 'black' ? p.image : p.imageSide} alt={p.name}
                      className="relative z-10 max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110" draggable={false} />

                    {/* Color toggle */}
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/50 backdrop-blur-xl rounded-full p-1 border border-white/8">
                      <button onClick={() => toggle(p.id)} className={`w-5 h-5 rounded-full border-2 transition-all ${colors[p.id] === 'black' ? 'border-[#41A3CF] bg-black shadow-[0_0_8px_rgba(65,163,207,0.4)]' : 'border-white/20 bg-black'}`} title="Nero" />
                      <button onClick={() => toggle(p.id)} className={`w-5 h-5 rounded-full border-2 transition-all ${colors[p.id] === 'white' ? 'border-[#41A3CF] bg-white shadow-[0_0_8px_rgba(65,163,207,0.4)]' : 'border-white/20 bg-white'}`} title="Bianco" />
                    </div>

                    {/* Slot badge */}
                    <div className="absolute bottom-4 left-4 bg-[#41A3CF]/15 backdrop-blur-sm rounded-full px-3 py-1 border border-[#41A3CF]/25">
                      <span className="text-xs font-semibold text-[#41A3CF]">{p.slots} slot</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-[#F4F6FA] group-hover:text-[#41A3CF] transition-colors">{p.name}</h3>
                      <EnergyBar level={p.energy} />
                    </div>
                    <p className="text-sm text-[#8A8F9D] mb-4">{p.description}</p>
                    <ul className="space-y-1.5 mb-5">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[#8A8F9D]">
                          <Check className="w-3.5 h-3.5 text-[#41A3CF]" /> {f}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
                      <span className="text-xs text-[#41A3CF] font-mono">{p.dimensions}</span>
                      <button onClick={() => scrollToSection('contact')}
                        className={`flex items-center gap-1 text-sm font-medium transition-all duration-300 ${activeProduct === p.id ? 'text-[#41A3CF] gap-2' : 'text-[#5A5F6D]'}`}>
                        Richiedi <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Hover gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#41A3CF]/[0.04] to-transparent transition-opacity duration-500 pointer-events-none ${activeProduct === p.id ? 'opacity-100' : 'opacity-0'}`} />
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
