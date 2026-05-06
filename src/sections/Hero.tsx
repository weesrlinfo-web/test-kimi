import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToSection } from '@/lib/scrollToSection';
import { ArrowRight, Zap, Battery, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ── Floating Powerbank ── */
const FloatingPB = ({
  src, size, x, y, duration, delay, className = ''
}: { src: string; size: number; x: string; y: string; duration: number; delay: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: `-=${12 + Math.random() * 10}`, x: `+=${-6 + Math.random() * 12}`, rotation: -1.5 + Math.random() * 3,
        duration, repeat: -1, yoyo: true, ease: 'sine.inOut', delay,
      });
    });
    return () => ctx.revert();
  }, [duration, delay]);

  return (
    <div ref={ref} className={`absolute pointer-events-none ${className}`} style={{ left: x, top: y, width: size, height: size }}>
      <img src={src} alt="" className="w-full h-full object-contain opacity-[0.12]" draggable={false}
        style={{ filter: 'brightness(0.6) contrast(1.15)' }} />
    </div>
  );
};

/* ── Particle Canvas ── */
const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    const count = Math.min(80, Math.floor(w * h / 15000));

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(65, 163, 207, ${p.alpha})`;
        ctx.fill();

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(65, 163, 207, ${0.06 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

/* ── Hero ── */
const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoTiltRef = useRef<HTMLDivElement>(null);
  const logoFadeRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseSmooth = useRef({ x: 0, y: 0 });
  const rafRef = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const base = import.meta.env.BASE_URL;

  /* Loading */
  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 800); return () => clearTimeout(t); }, []);

  /* Smooth mouse RAF */
  const onMove = useCallback((e: MouseEvent) => {
    mouseTarget.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMove, { passive: true });
    const loop = () => {
      const s = mouseSmooth.current, t = mouseTarget.current;
      s.x += (t.x - s.x) * 0.05; s.y += (t.y - s.y) * 0.05;
      if (logoTiltRef.current) {
        logoTiltRef.current.style.transform = `perspective(1000px) rotateY(${s.x * 4}deg) rotateX(${s.y * -3}deg)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(-50%,-50%) translate(${s.x * -20}px,${s.y * -20}px)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(rafRef.current); };
  }, [onMove]);

  /* Entrance + scroll animation */
  useEffect(() => {
    if (isLoading) return;
    const section = sectionRef.current;
    const content = contentRef.current;
    const logoFade = logoFadeRef.current;
    const glow = glowRef.current;
    if (!section || !content || !logoFade || !glow) return;

    const ctx = gsap.context(() => {
      gsap.set([logoFade, '.hero-badge', '.hero-headline', '.hero-sub', '.hero-ctas', '.hero-stats'], { opacity: 0, y: 35, filter: 'blur(10px)' });
      gsap.set(glow, { opacity: 0, scale: 0.6 });

      const tl = gsap.timeline({ delay: 0.25 });
      tl.to(glow, { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' }, 0)
        .to(logoFade, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'expo.out' }, 0.2)
        .to('.hero-badge', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out' }, 0.45)
        .to('.hero-headline', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out' }, 0.55)
        .to('.hero-sub', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.95, ease: 'expo.out' }, 0.7)
        .to('.hero-ctas', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'expo.out' }, 0.82)
        .to('.hero-stats', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'expo.out' }, 0.92);

      /* Glow breathing */
      gsap.to(glow, { scale: 1.12, opacity: 0.5, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2.5 });

      /* Scroll fade — content fades but sections below already visible */
      gsap.to([logoFade, content, glow], {
        y: -40,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top top', end: '+=60%', scrub: 1.5 },
      });

      /* Floating images fade only */
      gsap.to('.float-pb', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: section, start: '40% top', end: '80% top', scrub: 1.5 },
      });
    }, section);
    return () => ctx.revert();
  }, [isLoading]);

  const fbs = [
    { src: `${base}images/powerbank frontale.png`, size: 90, x: '6%', y: '20%', duration: 8, delay: 0 },
    { src: `${base}images/powerbank lato.png`, size: 75, x: '84%', y: '25%', duration: 9, delay: 1.2 },
    { src: `${base}images/powerbank retro.png`, size: 65, x: '10%', y: '65%', duration: 10, delay: 0.6 },
    { src: `${base}images/4.png`, size: 55, x: '88%', y: '60%', duration: 8.5, delay: 0.4 },
    { src: `${base}images/8.png`, size: 80, x: '75%', y: '75%', duration: 9.5, delay: 1.5 },
    { src: `${base}images/12.png`, size: 70, x: '14%', y: '80%', duration: 8, delay: 2 },
  ];

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-[#040408] flex items-center justify-center">
          <img src={`${base}images/logo.png`} alt="PlugHub" className="w-20 h-20 object-contain anim-loader" />
        </div>
      )}

      <section ref={sectionRef} className="relative min-h-[105dvh] flex items-center justify-center overflow-hidden bg-[#040408]">
        {/* Particle constellation */}
        <ParticleField />

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[2]">
          <div className="anim-scan absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#41A3CF]/20 to-transparent" />
        </div>

        {/* Floating powerbanks */}
        {fbs.map((pb, i) => <FloatingPB key={i} {...pb} className="float-pb" />)}

        {/* Central brand glow orb */}
        <div ref={glowRef} className="absolute top-1/2 left-1/2 w-[700px] h-[700px] pointer-events-none anim-breathe"
          style={{
            background: 'radial-gradient(circle, rgba(65,163,207,0.15) 0%, rgba(65,163,207,0.05) 30%, transparent 60%)',
            filter: 'blur(60px)', transform: 'translate(-50%,-50%)', willChange: 'transform',
          }} />

        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-[#41A3CF]/[0.06] rounded-full pointer-events-none anim-spin-slow" style={{ animationDuration: '30s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-[#41A3CF]/[0.03] rounded-full pointer-events-none anim-spin-slow" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#040408] to-transparent pointer-events-none z-[1]" />

        {/* Content */}
        <div className="relative z-10 w-full px-6 lg:px-12 pt-24 pb-16">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
            {/* Logo */}
            <div ref={logoTiltRef} className="relative mb-10 will-change-transform" style={{ perspective: '1000px' }}>
              <div ref={logoFadeRef} className="relative">
                <div className="absolute inset-0 -m-8 rounded-full"
                  style={{ background: 'radial-gradient(circle, rgba(65,163,207,0.25) 0%, transparent 70%)', filter: 'blur(30px)' }} />
                <img src={`${base}images/logo.png`} alt="PlugHub"
                  className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 lg:w-52 lg:h-52 object-contain drop-shadow-2xl" draggable={false} />
              </div>
            </div>

            <div ref={contentRef}>
              {/* Badge */}
              <div className="hero-badge inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#41A3CF]/20 bg-[#41A3CF]/[0.05] backdrop-blur-sm mb-7">
                <Zap className="w-4 h-4 text-[#41A3CF]" />
                <span className="label">IL PRIMO SHARING A RICARICA RAPIDA</span>
              </div>

              {/* Headline */}
              <h1 className="hero-headline text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-5 tracking-tight text-glow">
                <span className="text-[#F0F2F8]">I tuoi clienti</span>
                <span className="block mt-2 text-brand-gradient">sempre carichi</span>
              </h1>

              {/* Subheadline */}
              <p className="hero-sub text-base sm:text-lg text-[#7A8090] mb-10 max-w-lg leading-relaxed">
                <span className="text-[#F0F2F8] font-medium">Trasforma clienti con batteria scarica in clienti soddisfatti.</span>
                <br />
                <span className="text-[#7A8090]">Zero costi, zero gestione.</span>
              </p>

              {/* CTAs */}
              <div className="hero-ctas flex flex-col sm:flex-row gap-3 mb-12">
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
              <div className="hero-stats flex gap-4 justify-center">
                {[
                  { icon: Zap, val: '22.5W', label: 'Potenza' },
                  { icon: Battery, val: '8000mAh', label: 'Capacità' },
                ].map((s, i) => (
                  <div key={i} className="glass glass-hover flex items-center gap-3 px-5 py-3 cursor-default">
                    <div className="w-9 h-9 rounded-xl bg-[#41A3CF]/10 flex items-center justify-center">
                      <s.icon className="w-4.5 h-4.5 text-[#41A3CF]" />
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-[#F0F2F8] font-mono">{s.val}</div>
                      <div className="text-[10px] text-[#4A5060]">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll chevron */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 anim-bounce-gentle">
          <ChevronDown className="w-5 h-5 text-[#41A3CF]/30" />
        </div>
      </section>
    </>
  );
};

export default Hero;
