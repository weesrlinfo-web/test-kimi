import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToSection } from '@/lib/scrollToSection';
import { ArrowRight, Zap, Battery, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ── Floating Powerbank ── */
const FloatingPB = ({
  src, size, x, y, duration, delay,
}: { src: string; size: number; x: string; y: string; duration: number; delay: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: `-=${14 + Math.random() * 12}`, x: `+=${-8 + Math.random() * 16}`, rotation: -2 + Math.random() * 4,
        duration, repeat: -1, yoyo: true, ease: 'sine.inOut', delay,
      });
    });
    return () => ctx.revert();
  }, [duration, delay]);

  return (
    <div ref={ref} className="absolute pointer-events-none" style={{ left: x, top: y, width: size, height: size }}>
      <img src={src} alt="" className="w-full h-full object-contain opacity-[0.18]" draggable={false}
        style={{ filter: 'brightness(0.7) contrast(1.1)' }} />
    </div>
  );
};

/* ── Hero ── */
const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseSmooth = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const base = import.meta.env.BASE_URL;

  /* Loading */
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 600); return () => clearTimeout(t); }, []);

  /* Smooth mouse RAF */
  const onMove = useCallback((e: MouseEvent) => {
    mouseTarget.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
  }, []);
  useEffect(() => {
    window.addEventListener('mousemove', onMove, { passive: true });
    const loop = () => {
      const s = mouseSmooth.current, t = mouseTarget.current;
      s.x += (t.x - s.x) * 0.05; s.y += (t.y - s.y) * 0.05;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(-50%,-50%) translate(${s.x * -16}px,${s.y * -16}px)`;
      }
      if (logoRef.current) {
        logoRef.current.style.transform = `perspective(1000px) rotateY(${s.x * 3}deg) rotateX(${s.y * -3}deg)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current); };
  }, [onMove]);

  /* Entrance + scroll fade */
  useEffect(() => {
    if (isLoading) return;
    const section = sectionRef.current, content = contentRef.current, logo = logoRef.current, glow = glowRef.current;
    if (!section || !content || !logo || !glow) return;

    const ctx = gsap.context(() => {
      gsap.set([logo, '.hero-badge', '.hero-headline', '.hero-sub', '.hero-ctas', '.hero-stats'], { opacity: 0, y: 30 });
      gsap.set(glow, { opacity: 0, scale: 0.7 });

      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(glow, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 0)
        .to(logo, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, 0.2)
        .to('.hero-badge', { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.4)
        .to('.hero-headline', { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.5)
        .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.62)
        .to('.hero-ctas', { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.74)
        .to('.hero-stats', { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.84);

      /* Glow breathing */
      gsap.to(glow, { scale: 1.1, opacity: 0.55, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2 });

      /* Scroll fade — NO PIN, just gentle fade */
      gsap.to([logo, content, glow], {
        y: -50, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1.5 },
      });
      gsap.to('.float-pb', { opacity: 0, y: -30, ease: 'none',
        scrollTrigger: { trigger: section, start: '50% top', end: 'bottom top', scrub: 1.5 },
      });
    }, section);
    return () => ctx.revert();
  }, [isLoading]);

  const fbs = [
    { src: `${base}images/powerbank frontale.png`, size: 90, x: '4%', y: '18%', duration: 7, delay: 0 },
    { src: `${base}images/powerbank lato.png`, size: 75, x: '86%', y: '22%', duration: 8, delay: 1 },
    { src: `${base}images/powerbank retro.png`, size: 65, x: '7%', y: '62%', duration: 9, delay: 0.5 },
    { src: `${base}images/4.png`, size: 55, x: '90%', y: '58%', duration: 7.5, delay: 0.3 },
    { src: `${base}images/8.png`, size: 80, x: '78%', y: '72%', duration: 8.5, delay: 1.2 },
    { src: `${base}images/12.png`, size: 70, x: '10%', y: '78%', duration: 7, delay: 1.8 },
  ];

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#06060A] flex items-center justify-center">
          <img src={`${base}images/logo.png`} alt="PlugHub" className="w-20 h-20 object-contain anim-loader" />
        </div>
      )}

      <section ref={sectionRef} className="relative min-h-[105dvh] flex items-center justify-center overflow-hidden bg-[#06060A]">
        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
          <div className="anim-scan absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#41A3CF]/30 to-transparent" />
        </div>

        {/* Floating powerbanks */}
        {fbs.map((pb, i) => <div key={i} className="float-pb"><FloatingPB {...pb} /></div>)}

        {/* Central brand glow orb */}
        <div ref={glowRef} className="absolute top-1/2 left-1/2 w-[650px] h-[650px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(65,163,207,0.18) 0%, rgba(65,163,207,0.06) 35%, transparent 65%)',
            filter: 'blur(50px)', transform: 'translate(-50%,-50%)', willChange: 'transform',
          }} />

        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] border border-[#41A3CF]/[0.07] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] border border-[#41A3CF]/[0.04] rounded-full pointer-events-none" />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{ backgroundImage: 'radial-gradient(circle, #41A3CF 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

        {/* Bottom gradient fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#06060A] to-transparent pointer-events-none z-[1]" />

        {/* Content */}
        <div ref={contentRef} className="relative z-10 w-full px-6 lg:px-12 pt-24 pb-16">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            {/* Logo */}
            <div ref={logoRef} className="relative mb-8 will-change-transform">
              <div className="absolute inset-0 -m-6 rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(65,163,207,0.2) 0%, transparent 70%)', filter: 'blur(24px)' }} />
              <img src={`${base}images/logo.png`} alt="PlugHub"
                className="relative z-10 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-contain drop-shadow-2xl" draggable={false} />
            </div>

            {/* Badge */}
            <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#41A3CF]/25 bg-[#41A3CF]/[0.06] backdrop-blur-sm mb-6">
              <Zap className="w-3.5 h-3.5 text-[#41A3CF]" />
              <span className="label">IL PRIMO SHARING A RICARICA RAPIDA</span>
            </div>

            {/* Headline */}
            <h1 className="hero-headline text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
              <span className="text-[#F4F6FA]">I tuoi clienti</span>
              <span className="block mt-2 text-brand-gradient">sempre carichi</span>
            </h1>

            {/* Subheadline */}
            <p className="hero-sub text-base sm:text-lg text-[#8A8F9D] mb-8 max-w-lg leading-relaxed">
              <span className="text-[#F4F6FA] font-medium">Trasforma clienti con batteria scarica in clienti soddisfatti.</span>
              <br />
              <span className="text-[#8A8F9D]">Zero costi, zero gestione.</span>
            </p>

            {/* CTAs */}
            <div className="hero-ctas flex flex-col sm:flex-row gap-3 mb-10">
              <button onClick={() => scrollToSection('contact')} className="btn-primary">
                <span className="relative z-10 flex items-center gap-2">
                  Installa gratis nel tuo locale <ArrowRight className="w-4 h-4" />
                </span>
                <span className="shine" />
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="btn-ghost">
                Scopri come funziona
              </button>
            </div>

            {/* Stats */}
            <div className="hero-stats flex gap-3 justify-center">
              {[
                { icon: Zap, val: '22.5W', label: 'Potenza' },
                { icon: Battery, val: '8000mAh', label: 'Capacità' },
              ].map((s, i) => (
                <div key={i} className="glass glass-hover flex items-center gap-3 px-4 py-2.5 cursor-default">
                  <div className="w-8 h-8 rounded-lg bg-[#41A3CF]/10 flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-[#41A3CF]" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-[#F4F6FA] font-mono">{s.val}</div>
                    <div className="text-[10px] text-[#5A5F6D]">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll chevron */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 anim-bounce-gentle">
          <ChevronDown className="w-5 h-5 text-[#41A3CF]/40" />
        </div>
      </section>
    </>
  );
};

export default Hero;
