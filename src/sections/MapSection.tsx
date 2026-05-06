import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Loader2 } from 'lucide-react';
import { StationsList } from '@/components/stations/StationsList';
import { StationListSkeleton } from '@/components/stations/StationListSkeleton';
import { useStations } from '@/hooks/useStations';
import { useGoogleMaps } from '@/hooks/useGoogleMaps';

gsap.registerPlugin(ScrollTrigger);

const MapSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const stations = useStations();
  const { mapRef, isMapLoaded, isMapLoading, hasApiError, requiresConsent } = useGoogleMaps(stations, {
    lat: 42.8333,
    lng: 12.8333,
  });

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        title.querySelectorAll('.reveal-item'),
        { y: 40, opacity: 0, filter: 'blur(10px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        mapContainerRef.current,
        { y: 30, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="map-section" className="relative py-32 lg:py-40 overflow-hidden bg-[#040408]">
      <div className="section-line mb-24" />

      <div className="relative w-full px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div ref={titleRef} className="text-center mb-16">
            <span className="reveal-item label block mb-5">MAPPA DELLE STAZIONI</span>
            <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl font-bold text-[#F0F2F8] mb-6">
              Le stazioni <span className="text-brand-gradient">PlugHub in Italia</span>
            </h2>
            <p className="reveal-item text-lg text-[#7A8090] max-w-xl mx-auto">
              Ogni punto rappresenta un punto di ritiro e restituzione.
            </p>
          </div>

          <div ref={mapContainerRef} className="relative glass overflow-hidden" style={{ height: '500px' }}>
            {/* Map placeholder */}
            <div
              ref={mapRef}
              className="absolute inset-0 z-10"
              style={{ minHeight: '500px' }}
            />

            {/* Loading state */}
            {isMapLoading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#040408]/80 backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-[#41A3CF] animate-spin mb-4" />
                <p className="text-sm text-[#7A8090]">Caricamento mappa...</p>
              </div>
            )}

            {/* Error/Consent state */}
            {!isMapLoading && (hasApiError || requiresConsent) && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#040408]/90 backdrop-blur-sm p-6">
                <p className="text-lg font-semibold text-[#F0F2F8] mb-2">
                  {requiresConsent ? 'Consenso richiesto' : 'Mappa non disponibile'}
                </p>
                <p className="text-sm text-[#7A8090] text-center max-w-md mb-6">
                  {requiresConsent
                    ? 'La mappa richiede il consenso ai cookie di terze parti per funzionare. Puoi comunque vedere l\'elenco delle stazioni qui sotto.'
                    : 'Si è verificato un problema nel caricamento della mappa. L\'elenco delle stazioni è comunque disponibile.'}
                </p>
                {requiresConsent && (
                  <button className="btn-primary text-sm">
                    <span className="relative z-10">Accetta cookie e carica la mappa</span>
                    <span className="shine" />
                  </button>
                )}
              </div>
            )}

            {/* Map overlay */}
            {isMapLoaded && (
              <div className="absolute inset-0 z-5 pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #41A3CF 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.08 }} />
              </div>
            )}
          </div>

          {/* Stations list */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-[#F0F2F8] mb-6">Elenco stazioni</h3>
            {stations.length > 0 ? (
              <StationsList stations={stations} />
            ) : (
              <StationListSkeleton />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
