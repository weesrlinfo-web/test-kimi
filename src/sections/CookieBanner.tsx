import { useEffect, useState } from 'react';
import { Cookie, X } from 'lucide-react';
import { cookiePolicyUrl } from '@/lib/sitePaths';

export const COOKIE_CONSENT_KEY = 'plugHubCookieConsent';
export const COOKIE_CONSENT_EVENT = 'plughub:cookie-consent-changed';

interface CookieBannerProps {
  onConsentChange?: (accepted: boolean) => void;
}

const notifyConsentChange = (accepted: boolean) => {
  window.dispatchEvent(
    new CustomEvent(COOKIE_CONSENT_EVENT, {
      detail: { accepted },
    }),
  );
};

const persistConsent = (value: 'accepted' | 'rejected') => {
  localStorage.setItem(COOKIE_CONSENT_KEY, value);
  notifyConsentChange(value === 'accepted');
};

const CookieBanner = ({ onConsentChange }: CookieBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const shouldOpenBanner = url.searchParams.get('openCookieBanner') === '1';

    if (shouldOpenBanner) {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
      url.searchParams.delete('openCookieBanner');
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      setIsVisible(true);
      return;
    }

    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = window.setTimeout(() => {
        setIsVisible(true);
      }, 700);

      return () => window.clearTimeout(timer);
    }

    setIsVisible(false);
  }, []);

  const acceptCookies = () => {
    persistConsent('accepted');
    setIsVisible(false);
    onConsentChange?.(true);
  };

  const rejectCookies = () => {
    persistConsent('rejected');
    setIsVisible(false);
    onConsentChange?.(false);
  };

  const closeBanner = () => {
    if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
      persistConsent('rejected');
      onConsentChange?.(false);
    }

    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-brand-charcoal/95 backdrop-blur-xl border-t border-white/10 cookie-enter">
      <div className="w-full px-6 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-cyan/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cookie className="w-5 h-5 text-brand-cyan" />
              </div>
              <div className="text-sm text-brand-gray">
                <p className="text-brand-white font-medium mb-1">Informativa breve:</p>
                <p>
                  Questo sito usa strumenti tecnici necessari e Google Maps solo dopo il tuo consenso.
                  Se rifiuti, la lista delle stazioni resta disponibile ma la mappa interattiva non viene caricata.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 flex-shrink-0">
              <button
                onClick={acceptCookies}
                className="px-6 py-2.5 bg-brand-cyan text-brand-black font-semibold rounded-full hover:shadow-[0_0_20px_rgba(46,233,255,0.4)] card-premium"
              >
                Accetta
              </button>
              <button
                onClick={rejectCookies}
                className="px-6 py-2.5 bg-white/5 border border-white/20 text-brand-white font-medium rounded-full hover:border-brand-cyan/50 hover:text-brand-cyan card-premium"
              >
                Rifiuta
              </button>
              <a
                href={cookiePolicyUrl}
                className="text-brand-cyan hover:underline text-sm font-medium"
              >
                Cookie Policy
              </a>
              <button
                onClick={closeBanner}
                className="text-brand-gray hover:text-brand-white transition-colors ml-2"
                aria-label="Chiudi"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

export const hasCookieConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
};

export const resetCookieConsent = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(COOKIE_CONSENT_KEY);
  notifyConsentChange(false);
};

export const acceptCookieConsent = (): void => {
  if (typeof window === 'undefined') return;
  persistConsent('accepted');
};
