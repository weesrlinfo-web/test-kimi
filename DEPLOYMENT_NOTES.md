# PlugHub - note di deploy

## 1) Google Maps
Imposta queste variabili per il frontend:

- `VITE_GOOGLE_MAPS_API_KEY`
- `VITE_GOOGLE_MAPS_MAP_ID` (facoltativa, `DEMO_MAP_ID` va bene per iniziare)

## 2) Email serverless Aruba
Imposta queste variabili nell'ambiente runtime delle funzioni serverless:

- `ARUBA_SMTP_HOST=smtps.aruba.it`
- `ARUBA_SMTP_PORT=465`
- `ARUBA_SMTP_USER=info@plughub.it`
- `ARUBA_SMTP_PASS=LA_PASSWORD_DELLA_CASELLA`
- `CONTACT_TO=info@plughub.it`
- `CONTACT_FROM=info@plughub.it`

## 3) Deploy
Questa versione è predisposta per Netlify Functions (`netlify/functions/contact.ts`).

Per testarla in locale, usa Netlify Dev invece del solo server Vite.
