import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crosshair, MapPin, Minus, Navigation, Plus, X } from 'lucide-react';
import {
  COOKIE_CONSENT_EVENT,
  acceptCookieConsent,
  hasCookieConsent,
} from './CookieBanner';
import { cookiePolicyUrl } from '@/lib/sitePaths';

gsap.registerPlugin(ScrollTrigger);

type Station = {
  id: string;
  nome: string;
  lat: number;
  lng: number;
  indirizzo: string;
  orari: string;
  tariffa: string;
  pagamento: string;
  powerbank_disponibili: number;
};

const stations: Station[] = [
  {
    id: 'venezia-bacaro',
    nome: 'Venezia',
    lat: 45.438,
    lng: 12.3358,
    indirizzo: 'Campo San Polo, Venezia VE, Italia',
    orari: '11:00 – 23:00',
    tariffa: '1€ / 30 min',
    pagamento: 'Carta, App',
    powerbank_disponibili: 4,
  },
  {
    id: 'milano-duomo',
    nome: 'Milano',
    lat: 45.4642,
    lng: 9.19,
    indirizzo: 'Piazza del Duomo, Milano MI, Italia',
    orari: '08:00 – 20:00',
    tariffa: '1€ / 30 min',
    pagamento: 'Carta, App',
    powerbank_disponibili: 8,
  },
];


const GOOGLE_MAPS_API_KEY = 'AIzaSyDDFfAuCP6wglFjfk-Dyt0ClhUAlm5kGNw';
const GOOGLE_MAPS_MAP_ID = 'DEMO_MAP_ID';

const loadGoogleMapsApi = async () => {
  if (window.google?.maps) return window.google;
  if (window.__plughubGoogleMapsPromise) return window.__plughubGoogleMapsPromise;

  if (!GOOGLE_MAPS_API_KEY) {
    throw new Error('Chiave Google Maps mancante.');
  }

  window.__plughubGoogleMapsPromise = new Promise((resolve, reject) => {
    window.__plughubGoogleMapsInit = () => {
      if (window.google?.maps) {
        resolve(window.google);
        return;
      }

      reject(new Error('Google Maps non disponibile dopo il caricamento dello script.'));
    };

    const existingScript = document.getElementById('plughub-google-maps-script') as HTMLScriptElement | null;
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'plughub-google-maps-script';
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      GOOGLE_MAPS_API_KEY,
    )}&loading=async&callback=__plughubGoogleMapsInit&libraries=marker&v=weekly&language=it`;
    script.onerror = () => {
      window.__plughubGoogleMapsPromise = undefined;
      reject(new Error('Errore nel caricamento delle Google Maps JavaScript API.'));
    };

    document.head.appendChild(script);
  });

  return window.__plughubGoogleMapsPromise;
};

const fitAllStations = (map: any, googleMaps: typeof google) => {
  const bounds = new googleMaps.maps.LatLngBounds();

  stations.forEach((station) => {
    bounds.extend({ lat: station.lat, lng: station.lng });
  });

  map.fitBounds(bounds, 80);

  window.setTimeout(() => {
    const currentZoom = map.getZoom();
    if (typeof currentZoom === 'number' && currentZoom > 16) {
      map.setZoom(16);
    }
  }, 250);
};

type StationMapCanvasProps = {
  mapEnabled: boolean;
  selectedStation: Station | null;
  onSelectStation: (station: Station) => void;
  className?: string;
};

const StationMapCanvas = ({
  mapEnabled,
  selectedStation,
  onSelectStation,
  className = '',
}: StationMapCanvasProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapEnabled) return;

    let isCancelled = false;

    const setupMap = async () => {
      try {
        setMapError(null);
        const googleMaps = await loadGoogleMapsApi();

        if (isCancelled || !mapContainerRef.current) return;

        const mapOptions: google.maps.MapOptions = {
          center: { lat: stations[0].lat, lng: stations[0].lng },
          zoom: 6,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: false,
          gestureHandling: 'cooperative',
        };

        if (GOOGLE_MAPS_MAP_ID) {
          mapOptions.mapId = GOOGLE_MAPS_MAP_ID;
        }

        const map = new googleMaps.maps.Map(mapContainerRef.current, mapOptions);

        mapRef.current = map;
        markersRef.current.clear();

        const pin = new googleMaps.maps.marker.PinElement({
          background: '#41A3CF',
          borderColor: '#0B0C10',
          glyphColor: '#0B0C10',
        });

        stations.forEach((station) => {
          const marker = new googleMaps.maps.marker.AdvancedMarkerElement({
            map,
            position: { lat: station.lat, lng: station.lng },
            title: station.nome,
            content: pin.element.cloneNode(true) as Node,
          });

          marker.addListener('click', () => {
            onSelectStation(station);
          });

          markersRef.current.set(station.id, marker);
        });

        fitAllStations(map, googleMaps);
      } catch (error) {
        console.error(error);
        setMapError(
          error instanceof Error ? error.message : 'Impossibile inizializzare la mappa.',
        );
      }
    };

    void setupMap();

    return () => {
      isCancelled = true;
      markersRef.current.forEach((marker) => {
        marker.map = null;
      });
      markersRef.current.clear();
      mapRef.current = null;
    };
  }, [mapEnabled, onSelectStation]);

  useEffect(() => {
    if (!selectedStation || !mapRef.current) return;
    
    mapRef.current.panTo({ lat: selectedStation.lat, lng: selectedStation.lng });
    const currentZoom = mapRef.current.getZoom();
    if (typeof currentZoom === 'number' && currentZoom < 13) {
      mapRef.current.setZoom(13);
    }
  }, [selectedStation]);
  
  const zoomIn = () => {
    if (!mapRef.current) return;
    mapRef.current.setZoom((mapRef.current.getZoom() ?? 12) + 1);
  };
  
  const zoomOut = () => {
    if (!mapRef.current) return;
    mapRef.current.setZoom((mapRef.current.getZoom() ?? 12) - 1);
  };
  
  const recenter = async () => {
    if (!mapRef.current) return;
    const googleMaps = await loadGoogleMapsApi();
    fitAllStations(mapRef.current, googleMaps);
  };

  return (
    <div className={`absolute inset-0 ${className}`}>
      <div ref={mapContainerRef} className="absolute inset-0" />

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A12]/95 p-6 text-center z-20">
          <div>
            <div className="w-16 h-16 bg-[#41A3CF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-[#41A3CF]" />
            </div>
            <h3 className="text-xl font-semibold text-[#F4F6FA] mb-2">Mappa non configurata</h3>
            <p className="text-[#8A8F9D] max-w-md">
              {mapError} Controlla che la chiave Google Maps sia valida e che le restrizioni del dominio siano corrette.
            </p>
          </div>
        </div>
      )}

      {!mapError && mapEnabled && (
        <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
          <button
            onClick={zoomIn}
            className="w-10 h-10 bg-[#0A0A12] border border-white/10 rounded-xl flex items-center justify-center text-[#F4F6FA] hover:text-[#41A3CF] hover:border-[#41A3CF]/50 transition-all"
            aria-label="Zoom avanti"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={zoomOut}
            className="w-10 h-10 bg-[#0A0A12] border border-white/10 rounded-xl flex items-center justify-center text-[#F4F6FA] hover:text-[#41A3CF] hover:border-[#41A3CF]/50 transition-all"
            aria-label="Zoom indietro"
          >
            <Minus className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              void recenter();
            }}
            className="w-10 h-10 bg-[#0A0A12] border border-white/10 rounded-xl flex items-center justify-center text-[#F4F6FA] hover:text-[#41A3CF] hover:border-[#41A3CF]/50 transition-all"
            aria-label="Centra tutte le stazioni"
          >
            <Crosshair className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

const MapOverlay = () => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A12]/90 z-20 p-6 text-center">
    <div className="w-16 h-16 bg-[#41A3CF]/10 rounded-2xl flex items-center justify-center mb-4">
      <MapPin className="w-8 h-8 text-[#41A3CF]" />
    </div>
    <h3 className="text-xl font-semibold text-[#F4F6FA] mb-2">Mappa disattivata</h3>
    <p className="text-[#8A8F9D] max-w-md mb-6">
      Per visualizzare la mappa interattiva, accetta i cookie di terze parti legati a Google Maps.
      La lista dei locali resta sempre disponibile.
    </p>
    <button
      onClick={acceptCookieConsent}
      className="px-6 py-3 bg-[#41A3CF] text-[#06060A] font-semibold rounded-full hover:shadow-[0_0_20px_rgba(65,163,207,0.35)] transition-all duration-300"
    >
      Accetta e visualizza la mappa
    </button>
    <a href={cookiePolicyUrl} className="text-[#41A3CF] hover:underline text-sm mt-4">
      Leggi la Cookie Policy
    </a>
  </div>
);

const MapSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(stations[0] ?? null);
  const [mapEnabled, setMapEnabled] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    setMapEnabled(hasCookieConsent());

    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ accepted?: boolean }>;
      setMapEnabled(Boolean(customEvent.detail?.accepted));
    };

    const handleStorageChange = () => {
      setMapEnabled(hasCookieConsent());
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange as EventListener);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;

    if (!section || !title) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        title.querySelectorAll('.reveal-item'),
        { y: 40, opacity: 0, filter: 'blur(12px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          stagger: 0.12,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none reverse',
          },
        },
      );

      gsap.fromTo(
        section.querySelector('.reveal-item.relative'),
        { y: 30, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSelectStation = useCallback((station: Station) => {
    setSelectedStation(station);
  }, []);

  const openDirections = (station: Station) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <section
        ref={sectionRef}
        id="map-section"
        className="relative bg-[#06060A] py-32 lg:py-40 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#41A3CF]/[0.02] via-transparent to-[#41A3CF]/[0.02]" />

        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#41A3CF]/40 rounded-full"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                boxShadow: '0 0 6px rgba(46, 233, 255, 0.6)',
              }}
            />
          ))}
        </div>

        <div className="relative w-full px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <div ref={titleRef} className="text-center mb-12">
              <span className="reveal-item inline-block label mb-6 font-mono tracking-widest">
                DOVE TROVARCI
              </span>
              <h2 className="reveal-item text-4xl sm:text-5xl lg:text-6xl font-sans font-bold text-[#F4F6FA] mb-6">
                Stazioni <span className="text-gradient">PlugHub</span>
              </h2>
              <p className="reveal-item text-lg text-[#8A8F9D] max-w-2xl mx-auto">
                Lista a sinistra, mappa a destra. Clicca un locale per vedere i dettagli e aprire le indicazioni.
              </p>
            </div>

            <div className="reveal-item relative bg-[#0A0A12]/50 border border-white/10 rounded-3xl overflow-hidden">
              <div className="flex flex-col lg:flex-row h-[600px]">
                <div className="w-full lg:w-[380px] bg-[#0A0A12] border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-[#F4F6FA]">Locali</div>
                      <div className="text-xs text-[#8A8F9D]">{stations.length} totali</div>
                    </div>
                    <div className="mt-2 text-xs text-[#8A8F9D]/60">
                      Seleziona una stazione per centrare la mappa e aprire i dettagli.
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {stations.map((station) => (
                      <button
                        key={station.id}
                        onClick={() => handleSelectStation(station)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                          selectedStation?.id === station.id
                            ? 'border-[#41A3CF]/50 bg-[#41A3CF]/10'
                            : 'border-white/10 bg-white/5 hover:border-[#41A3CF]/30'
                        }`}
                      >
                        <div className="font-semibold text-[#F4F6FA] mb-1">{station.nome}</div>
                        <div className="text-xs text-[#8A8F9D] mb-2">{station.indirizzo}</div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs text-[#41A3CF] bg-[#41A3CF]/10 px-2 py-1 rounded-full">
                            {station.tariffa}
                          </span>
                          <span className="text-xs text-[#8A8F9D] text-right">
                            {station.powerbank_disponibili} powerbank disponibili
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 relative bg-[#06060A] min-h-[360px]">
                  {mapEnabled ? (
                    <StationMapCanvas
                      mapEnabled={mapEnabled}
                      selectedStation={selectedStation}
                      onSelectStation={handleSelectStation}
                    />
                  ) : (
                    <MapOverlay />
                  )}

                  {selectedStation && (
                    <div className="absolute left-1/2 top-4 -translate-x-1/2 w-[360px] max-w-[calc(100%-24px)] bg-[#0A0A12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-30">
                      <div className="relative p-5">
                        <button
                          onClick={() => setSelectedStation(null)}
                          className="absolute top-3 right-3 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[#8A8F9D] hover:text-[#F4F6FA] hover:bg-white/20 transition-all"
                          aria-label="Chiudi dettagli stazione"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <h3 className="text-lg font-semibold text-[#F4F6FA] mb-3 pr-8">
                          {selectedStation.nome}
                        </h3>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-[#8A8F9D] mt-0.5 flex-shrink-0" />
                            <span className="text-[#8A8F9D]">{selectedStation.indirizzo}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[#8A8F9D]">Tariffa:</span>
                            <span className="text-[#41A3CF]">{selectedStation.tariffa}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[#8A8F9D]">Pagamento:</span>
                            <span className="text-[#F4F6FA]">{selectedStation.pagamento}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[#8A8F9D]">Orari:</span>
                            <span className="text-[#F4F6FA]">{selectedStation.orari}</span>
                          </div>

                          <div className="flex items-center gap-2 text-[#41A3CF]">
                            <span className="w-1.5 h-1.5 bg-[#41A3CF] rounded-full" />
                            <span>{selectedStation.powerbank_disponibili} powerbank disponibili</span>
                          </div>
                        </div>

                        <button
                          onClick={() => openDirections(selectedStation)}
                          className="w-full mt-4 py-3 bg-[#41A3CF] text-[#06060A] font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(65,163,207,0.35)] transition-all"
                        >
                          <Navigation className="w-4 h-4" />
                          Indicazioni
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <button
        onClick={() => setShowMapModal(true)}
        className="fixed bottom-24 right-6 z-40 w-14 h-14 bg-[#41A3CF] text-[#06060A] rounded-full shadow-lg shadow-[#41A3CF]/30 flex items-center justify-center hover:scale-110 hover:shadow-[0_0_30px_rgba(46,233,255,0.5)] transition-all duration-300"
        aria-label="Apri mappa"
      >
        <MapPin className="w-6 h-6" />
      </button>

      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowMapModal(false)}
          />
          <div className="relative w-full max-w-6xl h-[80vh] bg-[#0A0A12] border border-white/10 rounded-3xl overflow-hidden">
            <div className="absolute top-4 right-4 z-30">
              <button
                onClick={() => setShowMapModal(false)}
                className="w-10 h-10 bg-[#0A0A12] border border-white/10 rounded-xl flex items-center justify-center text-[#F4F6FA] hover:text-[#41A3CF] hover:border-[#41A3CF]/50 transition-all"
                aria-label="Chiudi mappa"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-full flex flex-col lg:flex-row">
              <div className="w-full lg:w-[320px] bg-[#06060A] border-b lg:border-b-0 lg:border-r border-white/10 p-4 overflow-y-auto">
                <h3 className="font-semibold text-[#F4F6FA] mb-4">Stazioni</h3>
                <div className="space-y-3">
                  {stations.map((station) => (
                    <button
                      key={station.id}
                      onClick={() => handleSelectStation(station)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedStation?.id === station.id
                          ? 'border-[#41A3CF]/50 bg-[#41A3CF]/10'
                          : 'border-white/10 bg-white/5 hover:border-[#41A3CF]/30'
                      }`}
                    >
                      <div className="font-medium text-[#F4F6FA] text-sm">{station.nome}</div>
                      <div className="text-xs text-[#8A8F9D] mt-1">{station.indirizzo}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 relative bg-[#06060A] min-h-[360px]">
                {mapEnabled ? (
                  <StationMapCanvas
                    mapEnabled={mapEnabled}
                    selectedStation={selectedStation}
                    onSelectStation={handleSelectStation}
                  />
                ) : (
                  <MapOverlay />
                )}
              
                {selectedStation && (
                  <div className="absolute left-1/2 top-4 -translate-x-1/2 w-[360px] max-w-[calc(100%-24px)] bg-[#0A0A12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-30">
                    <div className="relative p-5">
                      <button
                        onClick={() => setSelectedStation(null)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-[#8A8F9D] hover:text-[#F4F6FA] hover:bg-white/20 transition-all"
                        aria-label="Chiudi dettagli stazione"
                      >
                        <X className="w-4 h-4" />
                      </button>
                
                      <h3 className="text-lg font-semibold text-[#F4F6FA] mb-3 pr-8">
                        {selectedStation.nome}
                      </h3>
                
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#8A8F9D] mt-0.5 flex-shrink-0" />
                          <span className="text-[#8A8F9D]">{selectedStation.indirizzo}</span>
                        </div>
                
                        <div className="flex items-center gap-2">
                          <span className="text-[#8A8F9D]">Tariffa:</span>
                          <span className="text-[#41A3CF]">{selectedStation.tariffa}</span>
                        </div>
                
                        <div className="flex items-center gap-2">
                          <span className="text-[#8A8F9D]">Pagamento:</span>
                          <span className="text-[#F4F6FA]">{selectedStation.pagamento}</span>
                        </div>
                
                        <div className="flex items-center gap-2">
                          <span className="text-[#8A8F9D]">Orari:</span>
                          <span className="text-[#F4F6FA]">{selectedStation.orari}</span>
                        </div>
                
                        <div className="flex items-center gap-2 text-[#41A3CF]">
                          <span className="w-1.5 h-1.5 bg-[#41A3CF] rounded-full" />
                          <span>{selectedStation.powerbank_disponibili} powerbank disponibili</span>
                        </div>
                      </div>
                
                      <button
                        onClick={() => openDirections(selectedStation)}
                        className="w-full mt-4 py-3 bg-[#41A3CF] text-[#06060A] font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(65,163,207,0.35)] transition-all"
                      >
                        <Navigation className="w-4 h-4" />
                        Indicazioni
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MapSection;
