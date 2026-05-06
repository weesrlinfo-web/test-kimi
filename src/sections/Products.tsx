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
        <div key={i} className={`w-1 h-4 rounded-sm transition-all duration-300 ${i < Math.ceil(level / 20) ? 'bg-[#41A3CF] shadow-[0_0_6px_rgba(65,163,207,0.6)]' : 'bg-white/[0.06]'}`} />
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
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.12, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
        }
      );
      gsap.fromTo(modular, { y: 50, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' },
        }
      );
      const cardEls = cards.querySelectorAll('.product-card');
      gsap.fromTo(cardEls,
        { y: 80, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, stagger: 0.12, ease: 'expo.out',
          scrollTrigger: { trigger: section, start: 'top 55%', toggleActions: 'play none none reverse' },
        }
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="products" className="relative py-32 lg:py-40 overflow-hidden bg-[#040408]">
      <div className="section-line mb-24" />

      {/* Side glow */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(65,163,207,0.03) 0%, transparent 60%)', filter: 'blur(60px)' }} />

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div ref={titleRef} className="text-center mb-16">
            <span className="reveal-item label block mb-5">IL PRODOTTO</span>
            <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F0F2F8] mb-6">
              Torrette <span className="text-brand-gradient">modulari</span>
            </h2>
            <p className="reveal-item text-lg text-[#7A8090] max-w-xl mx-auto">
              Tre modelli per ogni esigenza. Tutti espandibili e con design premium.
            </p>
          </div>

          {/* Modular banner */}
          <div ref={modularRef} className="relative glass glass-hover p-8 lg:p-10 mb-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#41A3CF]/[0.02] via-transparent to-[#41A3CF]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <div className="flex items-center gap-5">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 bg-[#41A3CF]/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-2 bg-[#41A3CF]/30 rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#F0F2F8] text-xl">Sistema modulare</h3>
                  <p className="text-sm text-[#7A8090]">Inizia piccolo, espandi quando vuoi</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {modularFeatures.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#41A3CF] flex-shrink-0" />
                    <span className="text-sm text-[#7A8090]">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product cards */}
          <div ref={cardsRef} className="grid lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="product-card group"
                onMouseEnter={() => setActiveProduct(p.id)} onMouseLeave={() => setActiveProduct(null)}>
                <div className={`relative glass overflow-hidden ${p.recommended ? 'border-[#41A3CF]/25 ring-1 ring-[#41A3CF]/10' : ''}`}>
                  {/* Recommended badge */}
                  {p.recommended && (
                    <div className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-[#41A3CF]/10 backdrop-blur-sm border border-[#41A3CF]/20 rounded-full px-4 py-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#41A3CF]" />
                      <span className="text-[10px] font-semibold text-[#41A3CF] uppercase tracking-wider">Consigliato</span>
                    </div>
                  )}

                  {/* Image area */}
                  <div className="relative h-60 bg-gradient-to-b from-[#08080F] to-[#040408] flex items-center justify-center p-8 overflow-hidden">
                    <div className={`absolute inset-0 transition-opacity duration-700 ${activeProduct === p.id ? 'opacity-100' : 'opacity-0'}`}
                      style={{ background: 'radial-gradient(circle at 50% 50%, rgba(65,163,207,0.1) 0%, transparent 70%)' }} />
                    <img src={colors[p.id] === 'black' ? p.image : p.imageSide} alt={p.name}
                      className="relative z-10 max-h-full w-auto object-contain transition-transform duration-700 group-hover:scale-110" draggable={false} />

                    {/* Color toggle */}
                    <div className="absolute top-5 right-5 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-xl rounded-full p-1.5 border border-white/6">
                      <button onClick={() => toggle(p.id)} className={`w-6 h-6 rounded-full border-2 transition-all ${colors[p.id] === 'black' ? 'border-[#41A3CF] bg-black shadow-[0_0_8px_rgba(65,163,207,0.4)]' : 'border-white/15 bg-black'}`} title="Nero" />
                      <button onClick={() => toggle(p.id)} className={`w-6 h-6 rounded-full border-2 transition-all ${colors[p.id] === 'white' ? 'border-[#41A3CF] bg-white shadow-[0_0_8px_rgba(65,163,207,0.4)]' : 'border-white/15 bg-white'}`} title="Bianco" />
                    </div>

                    {/* Slot badge */}
                    <div className="absolute bottom-5 left-5 bg-[#41A3CF]/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-[#41A3CF]/15">
                      <span className="text-sm font-semibold text-[#41A3CF]">{p.slots} slot</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-7">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-[#F0F2F8]">{p.name}</h3>
                      <EnergyBar level={p.energy} />
                    </div>
                    <p className="text-sm text-[#7A8090] mb-5">{p.description}</p>
                    <ul className="space-y-2 mb-6">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-[#7A8090]">
                          <Check className="w-4 h-4 text-[#41A3CF]" /> {f}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-5 border-t border-white/[0.04] flex items-center justify-between">
                      <span className="text-xs text-[#41A3CF] font-mono">{p.dimensions}</span>
                      <button onClick={() => scrollToSection('contact')}
                        className={`flex items-center gap-1 text-sm font-medium transition-all duration-500 ${activeProduct === p.id ? 'text-[#41A3CF] gap-2' : 'text-[#4A5060]'}`}>
                        Richiedi <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Hover gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#41A3CF]/[0.03] to-transparent transition-opacity duration-700 pointer-events-none ${activeProduct === p.id ? 'opacity-100' : 'opacity-0'}`} />
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
