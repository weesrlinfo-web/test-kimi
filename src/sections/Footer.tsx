import { ArrowUpRight, Instagram, Mail } from 'lucide-react';
import {
  baseUrl,
  cookiePolicyUrl,
  cookiePreferencesUrl,
  privacyPolicyUrl,
} from '@/lib/sitePaths';
import { scrollToSection } from '@/lib/scrollToSection';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-brand-black border-t border-white/5 overflow-hidden anim-fade-in-up">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-cyan/[0.03] rounded-full blur-[100px]" />

      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-brand-cyan/30 rounded-full animate-pulse"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full px-6 lg:px-12 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <a href={baseUrl} className="inline-flex items-center gap-2 mb-6 group">
                <img src={`${baseUrl}images/logo.png`} alt="PlugHub" className="h-10 w-auto" />
                <span className="text-brand-white font-sora font-bold text-xl group-hover:text-brand-cyan transition-colors">
                  PlugHub
                </span>
              </a>
              <p className="text-brand-gray mb-8 max-w-sm leading-relaxed">
                Power bank sharing per locali. Installazione gratuita, zero gestione, massimo valore per i tuoi clienti.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="mailto:info@plughub.it"
                  className="w-10 h-10 bg-brand-charcoal rounded-xl flex items-center justify-center text-brand-gray hover:bg-brand-cyan hover:text-brand-black card-premium hover:scale-110"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-brand-charcoal rounded-xl flex items-center justify-center text-brand-gray hover:bg-brand-cyan hover:text-brand-black card-premium hover:scale-110"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-sora font-semibold text-brand-white mb-6">Navigazione</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Perché PlugHub', id: 'why-install' },
                  { label: 'Casi d\'uso', id: 'use-cases' },
                  { label: 'Come funziona', id: 'how-it-works' },
                  { label: 'Prodotti', id: 'products' },
                  { label: 'Contatti', id: 'contact' },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToSection(item.id)}
                      className="footer-link text-sm text-brand-gray hover:text-brand-cyan flex items-center gap-1 group"
                    >
                      {item.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-sora font-semibold text-brand-white mb-6">Contatti</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:info@plughub.it"
                    className="text-sm text-brand-gray hover:text-brand-cyan transition-colors"
                  >
                    info@plughub.it
                  </a>
                </li>
                <li>
                  <a
                    href={cookiePreferencesUrl}
                    className="text-sm text-brand-gray hover:text-brand-cyan transition-colors"
                  >
                    Rivedi preferenze cookie
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-brand-gray/60">© {currentYear} PlugHub. Tutti i diritti riservati.</p>
            <div className="flex items-center gap-6">
              <a
                href={privacyPolicyUrl}
                className="text-sm text-brand-gray/60 hover:text-brand-cyan transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href={cookiePolicyUrl}
                className="text-sm text-brand-gray/60 hover:text-brand-cyan transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
