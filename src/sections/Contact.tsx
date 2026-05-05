import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, ArrowRight, Check, Mail, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type ContactFormData = {
  name: string;
  business: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  message: string;
  website: string;
};

const INITIAL_FORM_DATA: ContactFormData = {
  name: '',
  business: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  message: '',
  website: '',
};

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || '';

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const form = formRef.current;
    const info = infoRef.current;

    if (!section || !form || !info) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        info.querySelectorAll('.reveal-item'),
        { x: -40, opacity: 0, filter: 'blur(12px)' },
        {
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      gsap.fromTo(
        form,
        { x: 40, opacity: 0, filter: 'blur(12px)', scale: 0.98 },
        {
          x: 0,
          opacity: 1,
          filter: 'blur(0px)',
          scale: 1,
          duration: 1,
          delay: 0.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      section.querySelectorAll('.float-particle').forEach((particle, i) => {
        gsap.to(particle, {
          y: -20 + Math.random() * 40,
          duration: 4 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.25,
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.name || !formData.business || !formData.email || !formData.address) {
      setSubmitError('Compila i campi obbligatori prima di inviare la richiesta.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    if (!CONTACT_ENDPOINT) {
      setSubmitError('Modulo contatti non configurato.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const payload = (await response.json().catch(() => null)) as
        | { message?: string }
        | null;

      if (!response.ok) {
        throw new Error(payload?.message || 'Invio non riuscito.');
      }

      setIsSubmitted(true);
      setFormData(INITIAL_FORM_DATA);
    } catch (error) {
      console.error(error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Non siamo riusciti a inviare la richiesta. Riprova tra poco.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const inputClassName = (fieldName: string) =>
    `w-full px-4 py-3 bg-white/5 backdrop-blur-sm border rounded-xl text-brand-white placeholder:text-brand-gray/50 focus:outline-none input-premium ${
      focusedField === fieldName
        ? 'border-brand-cyan shadow-[0_0_20px_rgba(46,233,255,0.15)] bg-white/10'
        : 'border-white/10 hover:border-white/20'
    }`;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-brand-charcoal py-32 lg:py-40 overflow-hidden scroll-mt-24"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-transparent to-brand-black" />

      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="float-particle absolute w-1 h-1 bg-brand-cyan/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 6px rgba(46, 233, 255, 0.6)',
            }}
          />
        ))}
      </div>

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div ref={infoRef}>
              <span className="reveal-item inline-block text-caption mb-6 font-mono tracking-widest">
                CONTATTACI
              </span>
              <h2 className="reveal-item text-4xl sm:text-5xl font-sora font-bold text-brand-white mb-6">
                Richiedi <span className="text-gradient">installazione gratuita</span>
              </h2>
              <p className="reveal-item text-lg text-brand-gray mb-12 leading-relaxed">
                Compila il modulo e la richiesta viene inviata davvero a info@plughub.it.
                Ti ricontattiamo entro 24 ore.
              </p>

              <div className="space-y-6">
                <div className="reveal-item flex items-start gap-4 group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:border-brand-cyan/30 hover:bg-white/10 transition-all duration-300">
                  <div className="w-12 h-12 bg-brand-cyan/10 rounded-xl flex items-center justify-center group-hover:bg-brand-cyan/20 transition-colors">
                    <Mail className="w-5 h-5 text-brand-cyan" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brand-white mb-1">Email</h4>
                    <a
                      href="mailto:info@plughub.it"
                      className="text-brand-gray hover:text-brand-cyan transition-colors"
                    >
                      info@plughub.it
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div
              ref={formRef}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 lg:p-10 card-premium"
            >
              {isSubmitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-20 h-20 bg-brand-cyan/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Check className="w-10 h-10 text-brand-cyan" />
                  </div>
                  <h3 className="text-2xl font-sora font-bold text-brand-white mb-3">
                    Richiesta inviata 
                  </h3>
                  <p className="text-brand-gray max-w-md">
                    La tua richiesta è stata inviata correttamente a info@plughub.it. Ti ricontatteremo al più presto.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-6 px-6 py-3 bg-white/5 border border-white/10 text-brand-white rounded-full hover:border-brand-cyan/40 hover:text-brand-cyan transition-all"
                  >
                    Invia un’altra richiesta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="relative">
                      <label className="block text-sm text-brand-gray mb-2">Nome e cognome *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={inputClassName('name')}
                        placeholder="Mario Rossi"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm text-brand-gray mb-2">Nome attività *</label>
                      <input
                        type="text"
                        name="business"
                        value={formData.business}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('business')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={inputClassName('business')}
                        placeholder="Bar Centrale"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="relative">
                      <label className="block text-sm text-brand-gray mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={inputClassName('email')}
                        placeholder="mario@esempio.it"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-sm text-brand-gray mb-2">Telefono</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        className={inputClassName('phone')}
                        placeholder="+39 333 123 4567"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm text-brand-gray mb-2">Città</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('city')}
                      onBlur={() => setFocusedField(null)}
                      className={inputClassName('city')}
                      placeholder="Milano"
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm text-brand-gray mb-2">Indirizzo *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('address')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={inputClassName('address')}
                      placeholder="Via Roma 12"
                    />
                  </div>

                  <div className="relative hidden" aria-hidden="true">
                    <label className="block text-sm text-brand-gray mb-2">Sito web</label>
                    <input
                      tabIndex={-1}
                      autoComplete="off"
                      type="text"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className={inputClassName('website')}
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-sm text-brand-gray mb-2">Messaggio (opzionale)</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      rows={4}
                      className={`w-full px-4 py-3 bg-brand-charcoal border rounded-xl text-brand-white placeholder:text-brand-gray/50 focus:outline-none input-premium resize-none ${
                        focusedField === 'message'
                          ? 'border-brand-cyan shadow-[0_0_20px_rgba(46,233,255,0.15)]'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      placeholder="Dicci qualcosa del tuo locale..."
                    />
                  </div>

                  {submitError && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full bg-brand-cyan text-brand-black font-semibold rounded-xl px-6 py-4 flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(46,233,255,0.4)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    {isSubmitting ? 'Invio in corso...' : 'Invia richiesta'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <p className="text-xs text-brand-gray/60 text-center">
                    * * Campi obbligatori: nome, attività, email e indirizzo. L’email viene inviata a info@plughub.it
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
