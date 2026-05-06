import { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, Zap } from 'lucide-react';
import { scrollToSection } from '@/lib/scrollToSection';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const base = import.meta.env.BASE_URL;

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Vantaggi', id: 'why-install' },
    { label: "Casi d'uso", id: 'use-cases' },
    { label: 'Come funziona', id: 'how-it-works' },
    { label: 'Prodotti', id: 'products' },
    { label: 'Mappa', id: 'map-section' },
    { label: 'Contatti', id: 'contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 anim-header-in transition-all duration-500 ${
        isScrolled ? 'bg-[#06060A]/70 backdrop-blur-2xl border-b border-white/[0.06]' : 'bg-transparent'}
      `}>
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-18">
            {/* Logo */}
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2.5 group">
              <img src={`${base}images/logo.png`} alt="PlugHub" className="h-9 w-auto" draggable={false} />
              <span className="text-[#F4F6FA] font-sora font-bold text-lg group-hover:text-[#41A3CF] transition-colors duration-300">
                PlugHub
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollToSection(item.id)}
                  className="relative text-sm text-[#8A8F9D] hover:text-[#F4F6FA] transition-colors duration-300 group">
                  {item.label}
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-px bg-[#41A3CF] group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <button onClick={() => scrollToSection('contact')} className="btn-primary text-sm py-2.5 px-5">
                <Zap className="w-4 h-4" />
                <span className="relative z-10">Installa gratis</span>
                <span className="shine" />
              </button>
            </div>

            {/* Mobile toggle */}
            <button onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 text-[#F4F6FA] hover:text-[#41A3CF] transition-colors">
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
        isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}>
        <div className="absolute inset-0 bg-[#06060A]/90 backdrop-blur-2xl" onClick={() => setIsMobileOpen(false)} />
        <nav className="relative flex flex-col items-center justify-center h-full gap-6">
          {navItems.map((item, i) => (
            <button key={item.id} onClick={() => { scrollToSection(item.id); setIsMobileOpen(false); }}
              className="text-2xl font-sora font-semibold text-[#F4F6FA] hover:text-[#41A3CF] transition-colors"
              style={{ animationDelay: `${0.08 + i * 0.05}s` }}>
              {item.label}
            </button>
          ))}
          <button onClick={() => { scrollToSection('contact'); setIsMobileOpen(false); }}
            className="mt-4 btn-primary">
            <Zap className="w-5 h-5" /> Richiedi installazione <ArrowRight className="w-5 h-5" />
            <span className="shine" />
          </button>
        </nav>
      </div>
    </>
  );
};

export default Header;
