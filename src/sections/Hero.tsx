import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { scrollToSection } from '@/lib/scrollToSection';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Zap, Battery, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Floating Powerbank Element
const FloatingPowerbank = ({
  src,
  size,
  initialX,
  initialY,
  duration,
  delay,
}: {
  src: string;
  size: number;
  initialX: string;
  initialY: string;
  duration: number;
  delay: number;
}) => {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elRef.current) return;

    gsap.to(elRef.current, {
      y: `-=${20 + Math.random() * 25}`,
      x: `+=${-12 + Math.random() * 24}`,
      rotation: -3 + Math.random() * 6,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay,
    });
  }, [duration, delay]);

  return (
    <div
      ref={elRef}
      className="floating-powerbank absolute pointer-events-none"
      style={{
        left: initialX,
        top: initialY,
        width: size,
        height: size,
        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
      }}
    >
      <img
        src={src}
        alt=""
        className="w-full h-full object-contain opacity-30"
        style={{
          filter: 'brightness(0.8) contrast(1.1)',
        }}
      />
    </div>
  );
};

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const base = import.meta.env.BASE_URL;

  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Entrance animation after loading
  useEffect(() => {
    if (isLoading) return;

    const section = sectionRef.current;
    const content = contentRef.current;
    const logo = logoRef.current;
    const glow = glowRef.current;

    if (!section || !content || !logo || !glow) return;

    const ctx = gsap.context(() => {
      gsap.set(logo, { opacity: 0, scale: 0.8, y: 30 });
      gsap.set('.badge', { opacity: 0, y: 20 });
      gsap.set('.headline', { opacity: 0, y: 30 });
      gsap.set('.subheadline', { opacity: 0, y: 20 });
      gsap.set('.cta-group', { opacity: 0, y: 20 });
      gsap.set('.stats-row', { opacity: 0, y: 20 });
      gsap.set(glow, { opacity: 0, scale: 0.5 });

      const entranceTl = gsap.timeline({ delay: 0.15 });

      entranceTl
        .to(glow, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 0.2)
        .to(logo, { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'expo.out' }, 0.3)
        .to('.badge', { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.5)
        .to('.headline', { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.6)
        .to('.subheadline', { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }, 0.72)
        .to('.cta-group', { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.85)
        .to('.stats-row', { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.95);

      gsap.to(glow, {
        scale: 1.15,
        opacity: 0.55,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.8,
      });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: 0.5,
        },
      });

      scrollTl
        .fromTo(logo, { y: 0 }, { y: -30, ease: 'none' }, 0)
        .fromTo(content, { y: 0 }, { y: -20, ease: 'none' }, 0)
        .fromTo(logo, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.8, ease: 'power2.in' }, 0.4)
        .fromTo('.headline', { opacity: 1, y: 0 }, { opacity: 0, y: -60, ease: 'power2.in' }, 0.42)
        .fromTo('.subheadline', { opacity: 1, y: 0 }, { opacity: 0, y: -40, ease: 'power2.in' }, 0.45)
        .fromTo('.badge', { opacity: 1 }, { opacity: 0, ease: 'power2.in' }, 0.4)
        .fromTo('.cta-group', { opacity: 1, y: 0 }, { opacity: 0, y: -30, ease: 'power2.in' }, 0.48)
        .fromTo('.stats-row', { opacity: 1, y: 0 }, { opacity: 0, y: -20, ease: 'power2.in' }, 0.5)
        .fromTo(glow, { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.8, ease: 'power1.in' }, 0.35)
        .fromTo('.floating-powerbank', { opacity: 0.3 }, { opacity: 0, ease: 'power2.in' }, 0.5);
    }, section);

    return () => ctx.revert();
  }, [isLoading]);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToContact = () => {
    scrollToSection('contact');
  };

  const floatingPowerbanks = [
    {
      src: `${base}images/powerbank frontale.png`,
      size: 100,
      initialX: '5%',
      initialY: '20%',
      duration: 5,
      delay: 0,
    },
    {
      src: `${base}images/powerbank lato.png`,
      size: 80,
      initialX: '88%',
      initialY: '25%',
      duration: 6,
      delay: 0.5,
    },
    {
      src: `${base}images/powerbank retro.png`,
      size: 70,
      initialX: '8%',
      initialY: '65%',
      duration: 7,
      delay: 1,
    },
    {
      src: `${base}images/4.png`,
      size: 60,
      initialX: '90%',
      initialY: '60%',
      duration: 5.5,
      delay: 0.3,
    },
    {
      src: `${base}images/8.png`,
      size: 90,
      initialX: '80%',
      initialY: '75%',
      duration: 6.5,
      delay: 0.8,
    },
    {
      src: `${base}images/12.png`,
      size: 75,
      initialX: '12%',
      initialY: '80%',
      duration: 5,
      delay: 1.2,
    },
  ];

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-brand-black flex items-center justify-center">
          <img
            src={`${base}images/logo.png`}
            alt="PlugHub"
            className="w-24 h-24 object-contain loader-elegant"
          />
        </div>
      )}

      <section
        ref={sectionRef}
        className="relative min-h-screen bg-brand-black flex items-center justify-center overflow-hidden"
      >
        {floatingPowerbanks.map((pb, i) => (
          <FloatingPowerbank key={i} {...pb} />
        ))}

        <div
          className="absolute inset-0 opacity-60 transition-all duration-300"
          style={{
            background: `radial-gradient(ellipse 120% 100% at ${50 + mousePos.x * 10}% ${45 + mousePos.y * 10}%, rgba(46, 233, 255, 0.1) 0%, transparent 50%)`,
            transition: 'background 0.6s ease-out',
          }}
        />

        <div
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]"
          style={{
            background: 'radial-gradient(circle, rgba(46, 233, 255, 0.2) 0%, rgba(65, 163, 207, 0.1) 30%, transparent 60%)',
            filter: 'blur(50px)',
            transform: `translate(-50%, -50%) translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
            transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] border border-brand-cyan/10 rounded-full pointer-events-none"
          style={{
            transform: `translate(-50%, -50%) rotate(${mousePos.x * 5}deg)`,
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-brand-cyan/5 rounded-full pointer-events-none"
          style={{
            transform: `translate(-50%, -50%) rotate(${-mousePos.x * 8}deg)`,
            transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(46, 233, 255, 0.8) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(46, 233, 255, 0.8) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
          }}
        />

        <div className="relative w-full px-6 lg:px-12 pt-20 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div
                ref={logoRef}
                className="relative mb-6"
                style={{
                  perspective: '1000px',
                  transform: `rotateY(${mousePos.x * 3}deg) rotateX(${mousePos.y * -3}deg)`,
                  transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              >
                <div
                  className="absolute inset-0 -m-8 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(46, 233, 255, 0.25) 0%, transparent 70%)',
                    filter: 'blur(30px)',
                  }}
                />

                <img
                  src={`${base}images/logo.png`}
                  alt="PlugHub"
                  className="relative z-10 w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56 object-contain drop-shadow-2xl"
                />


              </div>

              <div ref={contentRef} className="max-w-xl mt-4">
                <div className="badge inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-xl border border-brand-cyan/30 rounded-full mb-5">
                  <Zap className="w-3.5 h-3.5 text-brand-cyan" />
                  <span className="text-xs font-medium text-brand-cyan tracking-wide font-mono">
                    IL PRIMO SHARING A RICARICA RAPIDA
                  </span>
                </div>

                <h1 className="headline text-3xl sm:text-4xl lg:text-5xl font-sora font-bold text-brand-white mb-3 leading-tight">
                  I tuoi clienti
                  <span className="block mt-1 text-gradient">sempre carichi</span>
                </h1>

                <p className="subheadline text-base sm:text-lg text-brand-gray mb-6 leading-relaxed">
                  <span className="text-brand-white font-medium">Trasforma clienti con batteria scarica in clienti soddisfatti.</span>
                  <br />
                  <span className="text-brand-gray">Zero costi, zero gestione.</span>
                </p>

                <div className="cta-group flex flex-col sm:flex-row gap-3 mb-8 justify-center">
                  <button
                    onClick={scrollToContact}
                    className="group relative px-6 py-3 bg-brand-cyan text-brand-black font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(46,233,255,0.4)] hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Installa gratis nel tuo locale
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>

                  <button
                    onClick={() =>
                      scrollToSection('how-it-works')
                    }
                    className="px-6 py-3 border border-white/20 text-brand-white font-medium rounded-full hover:border-brand-cyan/50 hover:text-brand-cyan transition-all duration-300 backdrop-blur-sm bg-white/5"
                  >
                    Scopri come funziona
                  </button>
                </div>

                <div className="stats-row flex gap-4 justify-center">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                    <div className="w-8 h-8 bg-brand-cyan/10 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-brand-white font-mono">22.5W</div>
                      <div className="text-[10px] text-brand-gray">Potenza</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                    <div className="w-8 h-8 bg-brand-cyan/10 rounded-lg flex items-center justify-center">
                      <Battery className="w-4 h-4 text-brand-cyan" />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-brand-white font-mono">
                        8000<span className="text-xs">mAh</span>
                      </div>
                      <div className="text-[10px] text-brand-gray">Capacità</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce-smooth">
          <ChevronDown className="w-5 h-5 text-brand-cyan/60" />
        </div>
      </section>
    </>
  );
};

export default Hero;
