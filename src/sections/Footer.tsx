import { ArrowUpRight, Instagram, Mail } from 'lucide-react';
import { baseUrl, cookiePolicyUrl, cookiePreferencesUrl, privacyPolicyUrl } from '@/lib/sitePaths';
import { scrollToSection } from '@/lib/scrollToSection';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#040408] border-t border-white/[0.04] overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#41A3CF]/[0.015] rounded-full blur-[100px]" />

      <div className="relative w-full px-6 lg:px-12 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <a href={baseUrl} className="inline-flex items-center gap-2.5 mb-6 group">
                <img src={`${baseUrl}images/logo.png`} alt="PlugHub" className="h-10 w-auto" draggable={false} />
                <span className="text-[#F0F2F8] font-bold text-xl group-hover:text-[#41A3CF] transition-colors">PlugHub</span>
              </a>
              <p className="text-sm text-[#7A8090] mb-8 max-w-sm leading-relaxed">
                Power bank sharing per locali. Installazione gratuita, zero gestione, massimo valore per i tuoi clienti.
              </p>
              <div className="flex items-center gap-3">
                <a href="mailto:info@plughub.it" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#7A8090] hover:text-[#040408] hover:bg-[#41A3CF] hover:border-[#41A3CF] transition-all duration-300">
                  <Mail className="w-4.5 h-4.5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#7A8090] hover:text-[#040408] hover:bg-[#41A3CF] hover:border-[#41A3CF] transition-all duration-300">
                  <Instagram className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>

            {/* Nav */}
            <div>
              <h4 className="font-semibold text-[#F0F2F8] mb-6 text-sm">Navigazione</h4>
              <ul className="space-y-3">
                {[
                  { label: 'Perché PlugHub', id: 'why-install' },
                  { label: "Casi d'uso", id: 'use-cases' },
                  { label: 'Come funziona', id: 'how-it-works' },
                  { label: 'Prodotti', id: 'products' },
                  { label: 'Contatti', id: 'contact' },
                ].map(item => (
                  <li key={item.id}>
                    <button onClick={() => scrollToSection(item.id)} className="text-sm text-[#7A8090] hover:text-[#41A3CF] transition-colors flex items-center gap-1 group">
                      {item.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contacts */}
            <div>
              <h4 className="font-semibold text-[#F0F2F8] mb-6 text-sm">Contatti</h4>
              <ul className="space-y-3">
                <li><a href="mailto:info@plughub.it" className="text-sm text-[#7A8090] hover:text-[#41A3CF] transition-colors">info@plughub.it</a></li>
                <li><a href={cookiePreferencesUrl} className="text-sm text-[#7A8090] hover:text-[#41A3CF] transition-colors">Rivedi preferenze cookie</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#4A5060]">© {year} PlugHub. Tutti i diritti riservati.</p>
            <div className="flex items-center gap-6">
              <a href={privacyPolicyUrl} className="text-xs text-[#4A5060] hover:text-[#41A3CF] transition-colors">Privacy Policy</a>
              <a href={cookiePolicyUrl} className="text-xs text-[#4A5060] hover:text-[#41A3CF] transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
