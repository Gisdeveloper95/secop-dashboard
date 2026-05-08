// Respuestas precomputadas vía Socrata SoQL — Ronda 1 y Ronda 2.
// Cada item incluye la query SoQL real que se ejecutó para validar.

export interface Respuesta {
  numero: number;
  pregunta: string;
  respuesta: string;
  unidad?: string;
  query?: string;
  detalle?: string;
}

export const RONDA_1: Respuesta[] = [
  {
    numero: 3,
    pregunta: "Cantidad total de registros del dataset",
    respuesta: "5,614,448",
    query: "SELECT count(*) FROM jbjy-vk9h",
  },
  {
    numero: 4,
    pregunta: "Cantidad total de variables del dataset",
    respuesta: "84",
    query: "GET /api/views/jbjy-vk9h.json → columns.length",
  },
  {
    numero: 5,
    pregunta: "Variables tipo fecha (calendar_date)",
    respuesta: "7",
    detalle: "fecha_de_firma, fecha_de_inicio_del_contrato, fecha_de_fin_del_contrato, ultima_actualizacion, fecha_inicio_liquidacion, fecha_fin_liquidacion, fecha_de_notificaci_n_de_prorrogaci_n",
  },
  {
    numero: 6,
    pregunta: "Variables tipo numérico (number)",
    respuesta: "19",
    detalle: "nit_entidad, valor_del_contrato, valor_de_pago_adelantado, valor_facturado, valor_pendiente_de_pago, valor_pagado, valor_amortizado, valor_pendiente_de, valor_pendiente_de_ejecucion, saldo_cdp, saldo_vigencia, dias_adicionados, presupuesto_general_de_la_nacion_pgn, sistema_general_de_participaciones, sistema_general_de_regal_as, recursos_propios_alcald_as_gobernaciones_y_resguardos_ind_genas_, recursos_de_credito, recursos_propios, codigo_entidad",
  },
  {
    numero: 7,
    pregunta: "Variables tipo texto (text)",
    respuesta: "57",
  },
  {
    numero: 8,
    pregunta: "Variable con mayor cantidad de registros nulos",
    respuesta: "Presupuesto General de la Nación – PGN",
    detalle: "5 columnas empatadas al 100% nulos: presupuesto_general_de_la_nacion_pgn, sistema_general_de_participaciones, sistema_general_de_regal_as, recursos_de_credito, recursos_propios",
  },
  {
    numero: 9,
    pregunta: "Porcentaje de nulos en Fecha de Firma",
    respuesta: "7.17",
    unidad: "%",
    query: "SELECT count(*) WHERE fecha_de_firma IS NULL  → 402,830 / 5,614,448 = 7.1749%",
  },
  {
    numero: 10,
    pregunta: "Cantidad de nulos en Fecha Inicio Liquidación",
    respuesta: "5,004,413",
    query: "SELECT count(*) WHERE fecha_inicio_liquidacion IS NULL",
  },
  {
    numero: 11,
    pregunta: "Valor máximo de Días adicionados",
    respuesta: "730,533",
    query: "SELECT max(dias_adicionados)",
  },
  {
    numero: 12,
    pregunta: "Valor más alto de Valor del Contrato",
    respuesta: "9,974,265,138,436",
    unidad: "COP",
    query: "SELECT valor_del_contrato ORDER BY valor_del_contrato DESC LIMIT 1",
  },
  {
    numero: 13,
    pregunta: "Séptimo valor más alto de Valor del Contrato",
    respuesta: "9,645,115,773,936",
    unidad: "COP",
    detalle: "Considerando duplicados en orden simple DESC. Si se piden distintos: 9,610,000,000,000.",
  },
  {
    numero: 14,
    pregunta: "Mínimo y máximo de Fecha de Firma",
    respuesta: "2015-06-11 → 2026-05-04",
    query: "SELECT min(fecha_de_firma), max(fecha_de_firma)",
  },
];

export const RONDA_2_DMGG: Respuesta[] = [
  {
    numero: 15,
    pregunta: "Total de registros del dataset dmgg-8hin",
    respuesta: "17,353,029",
    query: "SELECT count(*) FROM dmgg-8hin",
  },
  {
    numero: 16,
    pregunta: "Cantidad de columnas del dataset",
    respuesta: "11",
  },
  {
    numero: 17,
    pregunta: "Valores nulos en el campo descripción",
    respuesta: "238",
    query: "SELECT count(*) WHERE descripci_n IS NULL",
  },
  {
    numero: 18,
    pregunta: "Valores nulos en el campo proceso",
    respuesta: "0",
    query: "SELECT count(*) WHERE proceso IS NULL",
  },
  {
    numero: 19,
    pregunta: "Columnas tipo int64 (number)",
    respuesta: "id_documento, tamanno_archivo, nit_entidad",
  },
  {
    numero: 20,
    pregunta: "Columnas tipo str (text)",
    respuesta: "n_mero_de_contrato, proceso, nombre_archivo, extensi_n, descripci_n, entidad, url_descarga_documento",
  },
  {
    numero: 21,
    pregunta: "ID Documento — min/max/media/mediana",
    respuesta: "min: 563,041,734 | max: 757,010,598 | media: 658,560,206.52 | mediana: 656,263,760",
  },
  {
    numero: 22,
    pregunta: "Tamaño archivo — min/max/media/mediana (bytes)",
    respuesta: "min: 1 | max: 52,428,800 | media: 1,383,901.19 | mediana: 331,149",
  },
  {
    numero: 23,
    pregunta: "NIT entidad — min/max/media/mediana",
    respuesta: "min: 4,653,184 | max: 9,020,109,854 | media: 1,454,719,639.59 | mediana: 890,907,241",
  },
  {
    numero: 24,
    pregunta: "Fecha carga — mínimo y máximo",
    respuesta: "2024-12-31 → 2026-02-24",
  },
  {
    numero: 25,
    pregunta: "Rango de fecha (diferencia)",
    respuesta: "420 días (1 año, 1 mes y 24 días)",
  },
  {
    numero: 26,
    pregunta: "Para ID Documento = 756926574 → nombre_archivo y fecha_carga",
    respuesta: "SOLICITUD COTIZACIoN ITEMS NO PREVISTOS MUJER.XLSX | 2026-02-24",
  },
];

export const RONDA_2_CSV: Respuesta[] = [
  {
    numero: 3,
    pregunta: "Número de registros (CSV snapshot 2025-05-06)",
    respuesta: "1,003,902",
    query: "SELECT count(*) FROM contratos_csv",
  },
  {
    numero: 4,
    pregunta: "Número de variables",
    respuesta: "84",
  },
  {
    numero: 5,
    pregunta: "Registros del año 2025",
    respuesta: "999,490",
    query: "SELECT count(*) WHERE strftime('%Y', fecha_de_firma) = '2025'",
  },
  {
    numero: 6,
    pregunta: "Proporción de contratos a Pymes",
    respuesta: "13.20",
    unidad: "%",
  },
  {
    numero: 7,
    pregunta: "Número de contratos a Pymes",
    respuesta: "132,479",
  },
  {
    numero: 8,
    pregunta: "Top 10 departamentos por # contratos",
    respuesta: "Distrito Capital de Bogotá, Valle del Cauca, Antioquia, Cundinamarca, Santander, Magdalena, Bolívar, Atlántico, Boyacá, Tolima",
  },
  {
    numero: 9,
    pregunta: "# contratos del departamento en posición 6 (Magdalena)",
    respuesta: "32,097",
  },
  {
    numero: 10,
    pregunta: "Modalidad de contratación preferida",
    respuesta: "Contratación directa",
  },
  {
    numero: 11,
    pregunta: "# contratos de la modalidad preferida",
    respuesta: "759,993",
  },
  {
    numero: 12,
    pregunta: "Top 3 entidades que más ejecutaron dinero",
    respuesta: "1) DISTRITO ESPECIAL DE CIENCIA TECNOLOGIA E INNOVACION DE MEDELLIN — 7,192,818,196,456 COP | 2) MINISTERIO DE MINAS Y ENERGIA — 5,117,844,982,872 | 3) DEPARTAMENTO DE ANTIOQUIA — 3,842,869,199,771",
  },
  {
    numero: 13,
    pregunta: "Top 5 tipos de contrato",
    respuesta: "1) Prestación de servicios — 860,913 | 2) Decreto 092 de 2017 — 41,384 | 3) Otro — 37,616 | 4) Suministros — 22,669 | 5) Compraventa — 16,845",
  },
  {
    numero: 14,
    pregunta: "% del tipo de contrato top 1",
    respuesta: "85.76",
    unidad: "%",
  },
  {
    numero: 15,
    pregunta: "Top 3 valores anómalos financieros",
    detalle: "1) MINMINAS — $4.205.027.751.839 (Programa Colombia Solar) → FALSO/error de captura | 2) MINCIT — $2.846.224.257.835 (arrendamiento zona franca) → FALSO | 3) RNEC — $2.553.311.282.500 (logística elecciones 2025-2026) → VERÍDICO",
    respuesta: "Ver detalle",
  },
  {
    numero: 16,
    pregunta: "% contratos con pago adelantado",
    respuesta: "0.0753",
    unidad: "%",
  },
  {
    numero: 17,
    pregunta: "# contratos con obligaciones ambientales",
    respuesta: "21,347",
  },
  {
    numero: 18,
    pregunta: "Cumple Pareto (80/20)",
    respuesta: "NO. La concentración es mucho mayor: 285 entidades (7.25% de 3,932) concentran el 80% del dinero ejecutado.",
  },
  {
    numero: 19,
    pregunta: "Brecha de género financiera",
    respuesta: "SÍ existe brecha. Mujeres firman 14.7% más contratos pero reciben 21.9% del dinero vs hombres 32.1%. Promedio: hombres $141M / mujeres $84M (-41%).",
  },
  {
    numero: 20,
    pregunta: "Anomalías de tipo de dato (≥5)",
    respuesta: "Valor del Contrato (str → float64), Valor Facturado, Valor Pagado, Fecha de Firma (str → datetime64), Fecha Inicio/Fin Contrato, columnas booleanas Si/No (Es Pyme, Habilita Pago Adelantado, Obligación Ambiental → bool)",
  },
];
