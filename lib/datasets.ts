// Catálogo de los 3 datasets del hackathon
export const DATASETS = {
  d1: {
    id: "jbjy-vk9h",
    nombre: "SECOP II — Contratos Electrónicos",
    fuente: "Socrata API",
    url_dataset: "https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Contratos-Electr-nicos/jbjy-vk9h",
    api_resource: "https://www.datos.gov.co/resource/jbjy-vk9h.json",
    api_metadata: "https://www.datos.gov.co/api/views/jbjy-vk9h.json",
  },
  d2: {
    id: "dmgg-8hin",
    nombre: "SECOP II — Archivos Descarga Desde 2025",
    fuente: "Socrata API",
    url_dataset: "https://www.datos.gov.co/Estad-sticas-Nacionales/SECOP-II-Archivos-Descarga-Desde-2025/dmgg-8hin",
    api_resource: "https://www.datos.gov.co/resource/dmgg-8hin.json",
    api_metadata: "https://www.datos.gov.co/api/views/dmgg-8hin.json",
  },
  d3: {
    id: "csv-2025",
    nombre: "SECOP II — Contratos Electrónicos (CSV snapshot 2025-05-06)",
    fuente: "Turso (libSQL)",
    url_dataset: "Snapshot local del dataset jbjy-vk9h filtrado a contratos firmados en 2025",
    api_resource: "/api/turso/contratos",
    api_metadata: "/api/turso/schema",
  },
};
