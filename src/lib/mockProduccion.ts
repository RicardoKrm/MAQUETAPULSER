/**
 * Mock Data Central de Producción Minera - PULSER
 * Datos ficticios para faenas de extracción y transporte de mineral en Chile.
 * Cobertura de fechas: 01 de Julio de 2026 al 12 de Septiembre de 2026.
 */

// 1. Reportes Diarios de Transporte (produccion_registro_diario)
export interface RegistroDiarioTransporte {
  id: string;
  fecha: string; // YYYY-MM-DD
  turno: 'Día' | 'Noche';
  camion: string;
  chofer: string;
  vueltas: number;
  tonelaje: number;
  petroleo: number;
  supervisor: string;
  novedades?: string;
  transfer?: string;
  suceso?: string;
  tipo?: string;
}

const camionesTransporte = [
  'T-101 (KHLP-90)', 'T-102 (BRTH-44)', 'T-103 (JWRS-18)', 'T-104 (PRTZ-33)',
  'T-105 (HGZX-55)', 'T-106 (FXLK-12)', 'T-107 (STUV-77)', 'T-108 (WXYZ-88)'
];

const choferesNombres = [
  'Rodrigo Castillo Fuentes', 'Roberto Araya Godoy', 'Carlos Mendoza Soto',
  'Guillermo Fuenzalida Paz', 'Cristóbal Valenzuela Ramos', 'Esteban Morales Peña',
  'Manuel Santander Vera', 'Patricio Riquelme Toro'
];

const supervisoresDia = ['Mario Sepúlveda', 'Víctor Salinas'];
const supervisoresNoche = ['Claudio Henríquez', 'Hernán Cortés'];

export const generateMockProduccionTransporte = (): RegistroDiarioTransporte[] => {
  const result: RegistroDiarioTransporte[] = [];
  let idCounter = 1;

  // Fechas: Julio (31 días), Agosto (31 días), Septiembre (12 días)
  const meses = [
    { mes: '2026-07', dias: 31 },
    { mes: '2026-08', dias: 31 },
    { mes: '2026-09', dias: 12 }
  ];

  meses.forEach(({ mes, dias }) => {
    for (let d = 1; d <= dias; d++) {
      const diaStr = String(d).padStart(2, '0');
      const fecha = `${mes}-${diaStr}`;
      const supDia = supervisoresDia[d % supervisoresDia.length];
      const supNoche = supervisoresNoche[d % supervisoresNoche.length];

      // Turno Día (5 a 7 camiones)
      const numCamionesDia = 5 + (d % 3);
      for (let c = 0; c < numCamionesDia; c++) {
        const camion = camionesTransporte[c % camionesTransporte.length];
        const chofer = choferesNombres[c % choferesNombres.length];
        const vueltas = 4 + ((d + c) % 3); // 4, 5 o 6 vueltas
        const tonPorVuelta = 27.5 + ((c * 0.4) % 1.5);
        const tonelaje = Math.round(vueltas * tonPorVuelta * 10) / 10;
        const petroleo = Math.round(130 + vueltas * 18);

        result.push({
          id: `trans-${idCounter++}`,
          fecha,
          turno: 'Día',
          camion,
          chofer,
          vueltas,
          tonelaje,
          petroleo,
          supervisor: supDia,
          novedades: d % 4 === 0 ? 'Demora 15 min en pesaje de báscula' : 'Operación normal sin novedades',
          transfer: 'Balanza 02 -> Planta Concentradora',
          suceso: 'Normal',
          tipo: 'Concentrado de Cobre'
        });
      }

      // Turno Noche (4 a 6 camiones)
      const numCamionesNoche = 4 + (d % 3);
      for (let c = 0; c < numCamionesNoche; c++) {
        const camion = camionesTransporte[(c + 2) % camionesTransporte.length];
        const chofer = choferesNombres[(c + 3) % choferesNombres.length];
        const vueltas = 4 + ((d + c + 1) % 3);
        const tonPorVuelta = 27.2 + ((c * 0.3) % 1.6);
        const tonelaje = Math.round(vueltas * tonPorVuelta * 10) / 10;
        const petroleo = Math.round(125 + vueltas * 18);

        result.push({
          id: `trans-${idCounter++}`,
          fecha,
          turno: 'Noche',
          camion,
          chofer,
          vueltas,
          tonelaje,
          petroleo,
          supervisor: supNoche,
          novedades: d % 5 === 0 ? 'Neblina densa en curva km 18, velocidad reducida a 30 km/h' : 'Ruta despejada, ciclo continuo',
          transfer: 'Frente Norte -> Stockpile 01',
          suceso: 'Normal',
          tipo: 'Mineral Sulfurado'
        });
      }
    }
  });

  return result;
};

export const mockProduccionTransporte = generateMockProduccionTransporte();

// 2. Control SANY SKT90S (produccion_sanny)
export interface SannyTrip {
  id: number;
  capacity: number;
  time: string;
  date: string;
  shift: 'Día' | 'Noche';
  equipo: 's6' | 's7';
}

export const generateMockSannyTrips = (): { s6: any[]; s7: any[] } => {
  const s6: any[] = [];
  const s7: any[] = [];
  let tripId = 1000;

  const meses = [
    { mes: '2026-07', dias: 31 },
    { mes: '2026-08', dias: 31 },
    { mes: '2026-09', dias: 12 }
  ];

  const horasDia = ['08:15', '09:35', '11:00', '12:40', '14:20', '16:05', '17:45'];
  const horasNoche = ['20:30', '22:00', '23:45', '01:30', '03:15', '05:00', '06:30'];

  meses.forEach(({ mes, dias }) => {
    for (let d = 1; d <= dias; d++) {
      const diaStr = String(d).padStart(2, '0');
      const date = `${mes}-${diaStr}`;

      // Vueltas S6 Día
      const vueltasS6Dia = 4 + (d % 3);
      for (let v = 0; v < vueltasS6Dia; v++) {
        s6.push({
          id: tripId++,
          numero_serie: tripId,
          capacity: 60,
          capacidad: 60,
          time: horasDia[v % horasDia.length],
          hora: horasDia[v % horasDia.length],
          date,
          fecha: date,
          shift: 'Día',
          turno: 'Día',
          equipo: 's6'
        });
      }

      // Vueltas S6 Noche
      const vueltasS6Noche = 4 + ((d + 1) % 3);
      for (let v = 0; v < vueltasS6Noche; v++) {
        s6.push({
          id: tripId++,
          numero_serie: tripId,
          capacity: 60,
          capacidad: 60,
          time: horasNoche[v % horasNoche.length],
          hora: horasNoche[v % horasNoche.length],
          date,
          fecha: date,
          shift: 'Noche',
          turno: 'Noche',
          equipo: 's6'
        });
      }

      // Vueltas S7 Día
      const vueltasS7Dia = 4 + ((d + 2) % 3);
      for (let v = 0; v < vueltasS7Dia; v++) {
        s7.push({
          id: tripId++,
          numero_serie: tripId,
          capacity: 60,
          capacidad: 60,
          time: horasDia[v % horasDia.length],
          hora: horasDia[v % horasDia.length],
          date,
          fecha: date,
          shift: 'Día',
          turno: 'Día',
          equipo: 's7'
        });
      }

      // Vueltas S7 Noche
      const vueltasS7Noche = 4 + (d % 3);
      for (let v = 0; v < vueltasS7Noche; v++) {
        s7.push({
          id: tripId++,
          numero_serie: tripId,
          capacity: 60,
          capacidad: 60,
          time: horasNoche[v % horasNoche.length],
          hora: horasNoche[v % horasNoche.length],
          date,
          fecha: date,
          shift: 'Noche',
          turno: 'Noche',
          equipo: 's7'
        });
      }
    }
  });

  return { s6, s7 };
};

export const mockSannyData = generateMockSannyTrips();

// 3. Resumen Mensual Mina (produccion_mina_mensual)
export interface ResumenMinaRow {
  dia: number;
  mes: string;
  supervisor: string;
  supervisor_noche: string;
  
  // Turno Día
  cantidad_caex_dia: string | number;
  caex_dia: string | number;
  operadores_dia: string | number;
  acopio_dia: string | number;
  caex_acopio_dia: string | number;
  planta_dia: string | number;
  caex_planta_dia: string | number;
  vueltas_dia: number;
  pases_cf_dia: number;
  pases_totales_dia: number;
  toneladas_caex_dia: string | number;
  equipo_cf_dia: string;
  produccion_dia: number;
  produccion_cmc_dia: number;
  traspasos_dia: number;

  // Turno Noche
  cantidad_caex_noche: string | number;
  caex_noche: string | number;
  operadores_noche: string | number;
  acopio_noche: string | number;
  caex_acopio_noche: string | number;
  planta_noche: string | number;
  caex_planta_noche: string | number;
  vueltas_noche: number;
  pases_cf_noche: number;
  pases_totales_noche: number;
  toneladas_caex_noche: string | number;
  equipo_cf_noche: string;
  produccion_caex_noche: string | number;
  produccion_noche: number;
  traspasos_noche: number;

  // Totales
  total_imperia: number;
  total_cmc: number;
  diferencia: number;
  
  raw?: any[];
  raw_data?: any;
}

export const generateMockResumenMensualMina = (): ResumenMinaRow[] => {
  const result: ResumenMinaRow[] = [];

  const meses = [
    { mes: '2026-07', dias: 31 },
    { mes: '2026-08', dias: 31 },
    { mes: '2026-09', dias: 12 }
  ];

  meses.forEach(({ mes, dias }) => {
    for (let d = 1; d <= dias; d++) {
      const supDia = supervisoresDia[d % supervisoresDia.length];
      const supNoche = supervisoresNoche[d % supervisoresNoche.length];

      const vueltasDia = 38 + ((d * 2) % 10);
      const prodDia = Math.round(vueltasDia * 58.5);
      const prodCmcDia = prodDia + ((d % 3 === 0) ? -20 : 15);

      const vueltasNoche = 36 + ((d * 3) % 8);
      const prodNoche = Math.round(vueltasNoche * 58.2);

      const totalImp = prodDia + prodNoche;
      const totalCmc = prodCmcDia + prodNoche;
      const dif = totalImp - totalCmc;

      const row: ResumenMinaRow = {
        dia: d,
        mes,
        supervisor: supDia,
        supervisor_noche: supNoche,

        // Turno Día
        cantidad_caex_dia: 7,
        caex_dia: '7',
        operadores_dia: 7,
        acopio_dia: Math.round(prodDia * 0.52).toLocaleString('es-CL'),
        caex_acopio_dia: '4',
        planta_dia: Math.round(prodDia * 0.48).toLocaleString('es-CL'),
        caex_planta_dia: '3',
        vueltas_dia: vueltasDia,
        pases_cf_dia: 18,
        pases_totales_dia: vueltasDia,
        toneladas_caex_dia: prodDia.toLocaleString('es-CL'),
        equipo_cf_dia: 'Pala Hidráulica Komatsu PC2000',
        produccion_dia: prodDia,
        produccion_cmc_dia: prodCmcDia,
        traspasos_dia: 12,

        // Turno Noche
        cantidad_caex_noche: 6,
        caex_noche: '6',
        operadores_noche: 6,
        acopio_noche: Math.round(prodNoche * 0.51).toLocaleString('es-CL'),
        caex_acopio_noche: '3',
        planta_noche: Math.round(prodNoche * 0.49).toLocaleString('es-CL'),
        caex_planta_noche: '3',
        vueltas_noche: vueltasNoche,
        pases_cf_noche: 16,
        pases_totales_noche: vueltasNoche,
        toneladas_caex_noche: prodNoche.toLocaleString('es-CL'),
        equipo_cf_noche: 'Pala Hidráulica Komatsu PC2000',
        produccion_caex_noche: prodNoche.toLocaleString('es-CL'),
        produccion_noche: prodNoche,
        traspasos_noche: 10,

        // Totales
        total_imperia: totalImp,
        total_cmc: totalCmc,
        diferencia: dif,
        raw: []
      };

      row.raw_data = { ...row };
      result.push(row);
    }
  });

  return result;
};

export const mockResumenMensualMina = generateMockResumenMensualMina();

// 4. Horas Máquina y Disponibilidad (horas_maquina)
export interface HorasMaquinaMock {
  id: string;
  fecha: string;
  turno: 'a' | 'b' | string;
  equipo: string;
  horometroInicial: number;
  horometroFinal: number;
  operador: string;
  vueltas: number;
  observacion: string;
  checklist: string;
  horasOperativas: number;
  horasRedondeadas: number;
  combustibleL: number;
  created_at?: string;
}

export const generateMockHorasMaquina = (): HorasMaquinaMock[] => {
  const result: HorasMaquinaMock[] = [];
  const equipos = [
    'Pala Hidráulica Komatsu PC2000',
    'Cargador Frontal CAT 966H',
    'Bulldozer CAT D8R #01',
    'Motoniveladora CAT 140M',
    'Dumper Minero SANY SKT90S #01',
    'Dumper Minero SANY SKT90S #02',
    'Excavadora Komatsu PC200',
    'Camión Tolva Scania R500'
  ];

  const operadores = [
    'Marcos Vera Gallegos', 'Sebastián Muñoz Bravo', 'Juan Carlos Pizarro',
    'Álvaro Carrasco Soto', 'Nelson Díaz Rojas', 'Gabriel Valenzuela'
  ];

  let idCounter = 1;
  const meses = [
    { mes: '2026-07', dias: 31 },
    { mes: '2026-08', dias: 31 },
    { mes: '2026-09', dias: 12 }
  ];

  meses.forEach(({ mes, dias }) => {
    for (let d = 1; d <= dias; d += 2) {
      const diaStr = String(d).padStart(2, '0');
      const fecha = `${mes}-${diaStr}`;

      equipos.forEach((equipo, eqIdx) => {
        const horoBase = 12000 + eqIdx * 1500 + d * 18;
        const horasOp = 9.5 + ((d + eqIdx) % 3) * 0.8;
        const operador = operadores[(d + eqIdx) % operadores.length];
        const vueltas = equipo.includes('Dumper') || equipo.includes('Tolva') ? 5 + (d % 3) : 0;
        const combustible = Math.round(horasOp * 28 + (d % 4) * 10);

        result.push({
          id: `HM-${idCounter++}`,
          fecha,
          turno: d % 2 === 0 ? 'b' : 'a',
          equipo,
          horometroInicial: horoBase,
          horometroFinal: Math.round((horoBase + horasOp) * 10) / 10,
          operador,
          vueltas,
          observacion: (d + eqIdx) % 7 === 0 ? 'Mantenimiento Preventivo 250H' : 'Disponible',
          checklist: 'OK',
          horasOperativas: Math.round(horasOp * 10) / 10,
          horasRedondeadas: Math.round(horasOp),
          combustibleL: combustible,
          created_at: `${fecha}T08:00:00Z`
        });
      });
    }
  });

  return result;
};

export const mockHorasMaquinaRecords = generateMockHorasMaquina();

// 5. Trazabilidad Unificada
export const generateMockTrazabilidad = () => {
  const list: any[] = [];
  let id = 1;

  mockProduccionTransporte.slice(0, 45).forEach((t, idx) => {
    list.push({
      id: `trace-${id++}`,
      area: idx % 2 === 0 ? 'Transporte' : 'Mina',
      fecha: t.fecha,
      hora: `${String(8 + (idx % 10)).padStart(2, '0')}:${String((idx * 17) % 60).padStart(2, '0')}`,
      timestamp: new Date(`${t.fecha}T08:00:00`).getTime() + idx * 3600000,
      unidad: t.camion,
      vuelta: t.vueltas,
      toneladas: t.tonelaje,
      chofer: t.chofer,
      supervisor: t.supervisor,
      suceso: t.suceso || 'Ciclo Completado',
      notas: `${t.novedades || 'Transporte normal'} | Destino: ${t.transfer || 'Planta'}`,
      tipoSal: t.tipo || 'Concentrado de Cobre'
    });
  });

  list.sort((a, b) => b.timestamp - a.timestamp);
  return list;
};

export const mockTrazabilidadUnified = generateMockTrazabilidad();
