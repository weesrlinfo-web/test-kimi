import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, ArrowRight, Check, Mail, Send } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type FormData = { name: string; business: string; email: string; phone: string; city: string; address: string; message: string; website: string };
const INITIAL: FormData = { name: '', business: '', email: '', phone: '', city: '', address: '', message: '', website: '' };
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || '';

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    const s = sectionRef.current, f = formRef.current, i = infoRef.current;
    if (!s || !f || !i) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(i.querySelectorAll('.reveal-item'), { x: -40, opacity: 0, filter: 'blur(8px)' },
        { x: 0, opacity: 1, filter: 'blur(0px)', duration: 1, stagger: 0.1, ease: 'expo.out',
          scrollTrigger: { trigger: s, start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );
      gsap.fromTo(f, { x: 40, opacity: 0, filter: 'blur(8px)', scale: 0.97 },
        { x: 0, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 1.2, delay: 0.15, ease: 'expo.out',
          scrollTrigger: { trigger: s, start: 'top 75%', toggleActions: 'play none none reverse' },
        }
      );
    }, s);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.business || !form.email || !form.address) {
      setError('Compila i campi obbligatori prima di inviare la richiesta.'); return;
    }
    setSubmitting(true); setError(null);
    if (!ENDPOINT) { setError('Modulo contatti non configurato.'); setSubmitting(false); return; }
    try {
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const payload = await res.json().catch(() => null) as { message?: string } | null;
      if (!res.ok) throw new Error(payload?.message || 'Invio non riuscito.');
      setSubmitted(true); setForm(INITIAL);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Non siamo riusciti a inviare la richiesta. Riprova tra poco.');
    } finally { setSubmitting(false); }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const inputCls = (name: string) =>
    `w-full px-5 py-3.5 bg-white/[0.02] backdrop-blur-sm border rounded-2xl text-[#F0F2F8] placeholder:text-[#4A5060] focus:outline-none transition-all duration-500 ${
      focused === name ? 'border-[#41A3CF] shadow-[0_0_20px_rgba(65,163,207,0.1)] bg-white/[0.04]' : 'border-white/[0.05] hover:border-white/10'
    }`;

  return (
    <section ref={sectionRef} id="contact" className="relative py-32 lg:py-40 overflow-hidden scroll-mt-24 bg-[#040408]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#040408] via-transparent to-[#040408]" />
      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">
            {/* Info */}
            <div ref={infoRef}>
              <span className="reveal-item label block mb-5">CONTATTACI</span>
              <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F0F2F8] mb-6">
                Richiedi <span className="text-brand-gradient">installazione gratuita</span>
              </h2>
              <p className="reveal-item text-lg text-[#7A8090] mb-12 leading-relaxed">
                Compila il modulo e la richiesta viene inviata davvero a info@plughub.it. Ti ricontattiamo entro 24 ore.
              </p>
              <div className="reveal-item glass glass-hover flex items-start gap-5 p-6">
                <div className="w-12 h-12 bg-[#41A3CF]/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#41A3CF]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#F0F2F8] mb-1">Email</h4>
                  <a href="mailto:info@plughub.it" className="text-sm text-[#7A8090] hover:text-[#41A3CF] transition-colors">info@plughub.it</a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div ref={formRef} className="glass p-10 lg:p-12">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-20 h-20 bg-[#41A3CF]/10 rounded-full flex items-center justify-center mb-6">
                    <Check className="w-10 h-10 text-[#41A3CF]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#F0F2F8] mb-3">Richiesta inviata</h3>
                  <p className="text-sm text-[#7A8090] max-w-sm">
                    La tua richiesta è stata inviata correttamente a info@plughub.it. Ti ricontatteremo al più presto.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-8 btn-ghost text-sm">
                    Invia un'altra richiesta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-[#4A5060] mb-2 uppercase tracking-wider">Nome e cognome *</label>
                      <input type="text" name="name" value={form.name} onChange={onChange} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} required
                        className={inputCls('name')} placeholder="Mario Rossi" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#4A5060] mb-2 uppercase tracking-wider">Nome attività *</label>
                      <input type="text" name="business" value={form.business} onChange={onChange} onFocus={() => setFocused('business')} onBlur={() => setFocused(null)} required
                        className={inputCls('business')} placeholder="Bar Centrale" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs text-[#4A5060] mb-2 uppercase tracking-wider">Email *</label>
                      <input type="email" name="email" value={form.email} onChange={onChange} onFocus={() => setFocused('email')} onBlur={() => setFocused(null)} required
                        className={inputCls('email')} placeholder="mario@esempio.it" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#4A5060] mb-2 uppercase tracking-wider">Telefono</label>
                      <input type="tel" name="phone" value={form.phone} onChange={onChange} onFocus={() => setFocused('phone')} onBlur={() => setFocused(null)}
                        className={inputCls('phone')} placeholder="+39 333 123 4567" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-[#4A5060] mb-2 uppercase tracking-wider">Città</label>
                    <input type="text" name="city" value={form.city} onChange={onChange} onFocus={() => setFocused('city')} onBlur={() => setFocused(null)}
                      className={inputCls('city')} placeholder="Milano" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#4A5060] mb-2 uppercase tracking-wider">Indirizzo *</label>
                    <input type="text" name="address" value={form.address} onChange={onChange} onFocus={() => setFocused('address')} onBlur={() => setFocused(null)} required
                      className={inputCls('address')} placeholder="Via Roma 12" />
                  </div>
                  <div className="hidden" aria-hidden="true">
                    <input tabIndex={-1} autoComplete="off" type="text" name="website" value={form.website} onChange={onChange} className={inputCls('website')} />
                  </div>
                  <div>
                    <label className="block text-xs text-[#4A5060] mb-2 uppercase tracking-wider">Messaggio (opzionale)</label>
                    <textarea name="message" value={form.message} onChange={onChange} onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} rows={4}
                      className={`${inputCls('message')} resize-none`} placeholder="Dicci qualcosa del tuo locale..." />
                  </div>

                  {error && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-400/10 bg-red-500/5 px-5 py-4 text-sm text-red-300">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> {error}
                    </div>
                  )}

                  <button type="submit" disabled={submitting}
                    className="group w-full btn-primary justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">{submitting ? 'Invio in corso...' : 'Invia richiesta'}</span>
                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    <span className="shine" />
                  </button>

                  <p className="text-[11px] text-[#4A5060] text-center">
                    * Campi obbligatori: nome, attività, email e indirizzo. L'email viene inviata a info@plughub.it
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
