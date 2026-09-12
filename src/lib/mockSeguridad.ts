/**
 * Datos Mock de Seguridad y Salud Ocupacional (SSO)
 * Período: 01 de Julio de 2026 al 12 de Septiembre de 2026.
 */

export const mockAccionesSSO = [
  {
    id: 'AC-2026-081',
    hallazgoRef: 'HAL-2026-042',
    descripcion: 'Instalar protección metálica perimetral en polea de compresor principal de taller',
    responsable: 'Carlos Venegas (Mantenimiento)',
    plazo: '15/07/2026',
    estado: 'Completada'
  },
  {
    id: 'AC-2026-082',
    hallazgoRef: 'HAL-2026-048',
    descripcion: 'Demarcar franja de tránsito peatonal y cruce seguro en patio de maniobras',
    responsable: 'Patricia Vergara (SSO)',
    plazo: '28/07/2026',
    estado: 'Completada'
  },
  {
    id: 'AC-2026-083',
    hallazgoRef: 'HAL-2026-053',
    descripcion: 'Reemplazo de mangueras de aire comprimido con desgaste exterior en fosa 2',
    responsable: 'Jorge Lagos (Jefe Taller)',
    plazo: '12/08/2026',
    estado: 'Completada'
  },
  {
    id: 'AC-2026-084',
    hallazgoRef: 'HAL-2026-061',
    descripcion: 'Instalación de sensor de retroceso y baliza estroboscópica auxiliar en tolva TL-202',
    responsable: 'Carlos Venegas (Mantenimiento)',
    plazo: '25/08/2026',
    estado: 'Completada'
  },
  {
    id: 'AC-2026-085',
    hallazgoRef: 'HAL-2026-069',
    descripcion: 'Capacitación de refuerzo en procedimiento de acuñamiento y detención en pendiente',
    responsable: 'Patricia Vergara (SSO)',
    plazo: '08/09/2026',
    estado: 'En Revisión SSO'
  },
  {
    id: 'AC-2026-086',
    hallazgoRef: 'HAL-2026-074',
    descripcion: 'Reparación de iluminación antiexplosiva en bodega de almacenamiento de lubricantes',
    responsable: 'Héctor Muñoz (Bodega)',
    plazo: '18/09/2026',
    estado: 'En Ejecución'
  },
  {
    id: 'AC-2026-087',
    hallazgoRef: 'HAL-2026-077',
    descripcion: 'Actualización de señalética de uso obligatorio de respirador doble vía en chancador',
    responsable: 'Patricia Vergara (SSO)',
    plazo: '20/09/2026',
    estado: 'Asignada'
  }
];

export const mockAuditoriasSSO = [
  {
    id: 'AUD-2026-01',
    nombre: 'Auditoría Interna Sistema de Gestión SSO (ISO 45001)',
    tipo: 'Interna',
    fecha: '14/07/2026',
    alcance: 'Taller Central Los Andes y Flota Troncal',
    cumplimiento: 95.8,
    estado: 'Cerrada'
  },
  {
    id: 'AUD-2026-02',
    nombre: 'Inspección Reglamentaria SERNAGEOMIN DS 132',
    tipo: 'Externa',
    fecha: '05/08/2026',
    alcance: 'Operaciones de Transporte en Rajo Abierto y Botadero',
    cumplimiento: 98.2,
    estado: 'Cerrada'
  },
  {
    id: 'AUD-2026-03',
    nombre: 'Auditoría Protocolo Sílice & Ruido Mutual de Seguridad',
    tipo: 'Externa',
    fecha: '22/08/2026',
    alcance: 'Dosimetrías y Puestos de Trabajo de Operadores de Tolva',
    cumplimiento: 94.0,
    estado: 'Cerrada'
  },
  {
    id: 'AUD-2026-04',
    nombre: 'Auditoría de Control de Sustancias Peligrosas (DS 43)',
    tipo: 'Interna',
    fecha: '08/09/2026',
    alcance: 'Bodega Central de Químicos y Estación de Diésel',
    cumplimiento: 92.5,
    estado: 'Con Hallazgos Abiertos'
  },
  {
    id: 'AUD-2026-05',
    nombre: 'Auditoría Trimestral Comité Paritario de Higiene y Seguridad',
    tipo: 'Interna',
    fecha: '25/09/2026',
    alcance: 'Instalaciones Administrativas y Servicios Higiénicos',
    cumplimiento: null,
    estado: 'Programada'
  }
];

export const mockCharlasSSO = [
  {
    id: 'CH-2026-081',
    titulo: 'Conducción a la Defensiva en Condiciones de Baja Visibilidad y Neblina',
    fecha: '02/07/2026',
    turno: 'Turno Día',
    relator: 'Patricia Vergara',
    asistentes: 24,
    area: 'Transporte Troncal',
    duracionMinutos: 10,
    cumplimiento: '100%'
  },
  {
    id: 'CH-2026-085',
    titulo: 'Procedimiento de Aislación y Bloqueo Eléctrico/Mecánico (LOTO)',
    fecha: '09/07/2026',
    turno: 'Turno Día',
    relator: 'Jorge Lagos',
    asistentes: 14,
    area: 'Taller Mecánico',
    duracionMinutos: 15,
    cumplimiento: '100%'
  },
  {
    id: 'CH-2026-092',
    titulo: 'Control de Fatiga y Somnolencia en Ruta de Alta Montaña',
    fecha: '18/07/2026',
    turno: 'Turno Noche',
    relator: 'Rodrigo Castillo',
    asistentes: 18,
    area: 'Operaciones Mina',
    duracionMinutos: 10,
    cumplimiento: '100%'
  },
  {
    id: 'CH-2026-099',
    titulo: 'Inspección Pre-Uso de Neumáticos y Torque de Tuercas de Rueda',
    fecha: '29/07/2026',
    turno: 'Turno Día',
    relator: 'Carlos Venegas',
    asistentes: 26,
    area: 'Transporte Troncal',
    duracionMinutos: 10,
    cumplimiento: '100%'
  },
  {
    id: 'CH-2026-105',
    titulo: 'Uso Correcto y Mantención de Protección Respiratoria para Polvo de Sílice',
    fecha: '06/08/2026',
    turno: 'Turno Día',
    relator: 'Patricia Vergara',
    asistentes: 32,
    area: 'Rajo y Botadero',
    duracionMinutos: 10,
    cumplimiento: '100%'
  },
  {
    id: 'CH-2026-112',
    titulo: 'Protocolo de Emergencia ante Derrame de Hidrocarburos en Faena',
    fecha: '15/08/2026',
    turno: 'Turno Día',
    relator: 'Patricia Vergara',
    asistentes: 20,
    area: 'Abastecimiento Combustible',
    duracionMinutos: 15,
    cumplimiento: '100%'
  },
  {
    id: 'CH-2026-119',
    titulo: 'Distancia Segura de Seguimiento y Puntos Ciegos de Camiones Tolva',
    fecha: '24/08/2026',
    turno: 'Turno Día',
    relator: 'Mauricio Silva',
    asistentes: 28,
    area: 'Transporte y Movimiento de Tierra',
    duracionMinutos: 10,
    cumplimiento: '100%'
  },
  {
    id: 'CH-2026-125',
    titulo: 'Ergonomía en la Cabina y Pausas Activas durante la Jornada',
    fecha: '03/09/2026',
    turno: 'Turno Día',
    relator: 'Patricia Vergara',
    asistentes: 25,
    area: 'Flota Liviana y Pesada',
    duracionMinutos: 10,
    cumplimiento: '100%'
  },
  {
    id: 'CH-2026-130',
    titulo: 'Protocolo de Comunicación Radial en Caminos Mineros y Prioridades de Paso',
    fecha: '10/09/2026',
    turno: 'Turno Día',
    relator: 'Felipe Araya',
    asistentes: 27,
    area: 'Operaciones Mina',
    duracionMinutos: 10,
    cumplimiento: '100%'
  },
  {
    id: 'CH-2026-132',
    titulo: 'Revisión Diaria del Extintor Portátil y Cortacorriente del Vehículo',
    fecha: '12/09/2026',
    turno: 'Turno Día',
    relator: 'Patricia Vergara',
    asistentes: 29,
    area: 'Todos los Conductores',
    duracionMinutos: 10,
    cumplimiento: '100%'
  }
];

export const mockCursosSSO = [
  {
    id: 'CAP-2026-01',
    nombre: 'Manejo a la Defensiva en Alta Montaña y Caminos no Pavimentados',
    relator: 'Escuela de Conductores del Norte',
    fecha: '08/07/2026',
    horas: 16,
    asistentes: 18,
    aprobados: 18,
    estado: 'Finalizado',
    notaPromedio: 6.8
  },
  {
    id: 'CAP-2026-02',
    nombre: 'Primeros Auxilios Básicos y Reanimación Cardiopulmonar (RCP)',
    relator: 'Mutual de Seguridad CChC',
    fecha: '22/07/2026',
    horas: 8,
    asistentes: 22,
    aprobados: 22,
    estado: 'Finalizado',
    notaPromedio: 6.9
  },
  {
    id: 'CAP-2026-03',
    nombre: 'Uso y Manejo Seguro de Extintores de Incendio con Fuego Real',
    relator: 'Cuerpo de Bomberos Los Andes',
    fecha: '12/08/2026',
    horas: 4,
    asistentes: 30,
    aprobados: 30,
    estado: 'Finalizado',
    notaPromedio: 7.0
  },
  {
    id: 'CAP-2026-04',
    nombre: 'Aislación, Bloqueo y Etiquetado de Fuentes de Energía (LOTO)',
    relator: 'Consultores Mineros SpA',
    fecha: '28/08/2026',
    horas: 8,
    asistentes: 12,
    aprobados: 12,
    estado: 'Finalizado',
    notaPromedio: 6.7
  },
  {
    id: 'CAP-2026-05',
    nombre: 'Transporte Terrestre de Sustancias Peligrosas (DS 298)',
    relator: 'Asociación de Industriales',
    fecha: '09/09/2026',
    horas: 16,
    asistentes: 15,
    aprobados: 15,
    estado: 'Finalizado',
    notaPromedio: 6.8
  }
];

export const mockExtintores = [
  { id: 'EXT-001', ubicacion: 'Taller Fosa 1', tipo: 'PQS 6kg', capacidad: '6 kg', vencimiento: '18/11/2026', estado: 'Vigente', presion: 'Normal' },
  { id: 'EXT-002', ubicacion: 'Taller Fosa 2', tipo: 'PQS 6kg', capacidad: '6 kg', vencimiento: '18/11/2026', estado: 'Vigente', presion: 'Normal' },
  { id: 'EXT-003', ubicacion: 'Bodega Central de Repuestos', tipo: 'CO2 5kg', capacidad: '5 kg', vencimiento: '24/12/2026', estado: 'Vigente', presion: 'Normal' },
  { id: 'EXT-004', ubicacion: 'Estación de Combustible Diésel', tipo: 'Rodante PQS 50kg', capacidad: '50 kg', vencimiento: '05/02/2027', estado: 'Vigente', presion: 'Normal' },
  { id: 'EXT-005', ubicacion: 'Camión KHLP-90 (Cabina)', tipo: 'PQS 2kg', capacidad: '2 kg', vencimiento: '14/10/2026', estado: 'Vigente', presion: 'Normal' },
  { id: 'EXT-006', ubicacion: 'Camión BRTH-44 (Cabina)', tipo: 'PQS 2kg', capacidad: '2 kg', vencimiento: '14/10/2026', estado: 'Vigente', presion: 'Normal' },
  { id: 'EXT-007', ubicacion: 'Camión JWRS-18 (Chasis Externo)', tipo: 'PQS 10kg', capacidad: '10 kg', vencimiento: '30/11/2026', estado: 'Vigente', presion: 'Normal' },
  { id: 'EXT-008', ubicacion: 'Tolva PRTZ-33 (Chasis)', tipo: 'PQS 10kg', capacidad: '10 kg', vencimiento: '08/01/2027', estado: 'Vigente', presion: 'Normal' },
  { id: 'EXT-009', ubicacion: 'Aljibe KLLB-92 (Cabina)', tipo: 'PQS 6kg', capacidad: '6 kg', vencimiento: '19/09/2026', estado: 'Por Vencer', presion: 'Normal' },
  { id: 'EXT-010', ubicacion: 'Oficina Prevención SSO', tipo: 'CO2 5kg', capacidad: '5 kg', vencimiento: '15/03/2027', estado: 'Vigente', presion: 'Normal' }
];

export const mockContratistasSSO = [
  {
    id: 'CONT-01',
    razonSocial: 'Servicios Mineros del Norte SpA',
    rut: '76.890.123-4',
    servicio: 'Transporte de Áridos y Movimiento de Tierra',
    dotacion: 28,
    cumplimientoDocumental: 98.5,
    estado: 'Habilitado',
    contacto: 'operaciones@smnorte.cl'
  },
  {
    id: 'CONT-02',
    razonSocial: 'Vulcanización y Servicios El Minero Ltda.',
    rut: '77.345.678-9',
    servicio: 'Mantenimiento de Neumáticos OTR y Pesados en Faena',
    dotacion: 8,
    cumplimientoDocumental: 96.0,
    estado: 'Habilitado',
    contacto: 'contacto@vulcanizacionelminero.cl'
  },
  {
    id: 'CONT-03',
    razonSocial: 'Mantenciones Electromecánicas del Cobre',
    rut: '76.120.456-2',
    servicio: 'Reparación de Sistemas Hidráulicos y Motores',
    dotacion: 12,
    cumplimientoDocumental: 92.0,
    estado: 'Habilitado con Observación',
    contacto: 'taller@electromecanicacobre.cl'
  }
];

export const mockEppSSO = [
  { id: 'EPP-01', trabajador: 'Rodrigo Castillo', rut: '14.892.411-8', elemento: 'Calzado de Seguridad con Puntera Composite', fechaEntrega: '05/07/2026', estado: 'Entregado', firma: 'Digital' },
  { id: 'EPP-02', trabajador: 'Mauricio Silva', rut: '13.450.812-3', elemento: 'Chaleco Geólogo Reflectante con Normativa MOP', fechaEntrega: '12/07/2026', estado: 'Entregado', firma: 'Digital' },
  { id: 'EPP-03', trabajador: 'Carlos Venegas', rut: '16.711.230-K', elemento: 'Guantes de Cabritilla Antiestáticos y Guantes de Nitrilo', fechaEntrega: '20/07/2026', estado: 'Entregado', firma: 'Digital' },
  { id: 'EPP-04', trabajador: 'Felipe Araya', rut: '18.112.449-7', elemento: 'Lentes de Seguridad Fotocromáticos Anti-Impacto', fechaEntrega: '03/08/2026', estado: 'Entregado', firma: 'Digital' },
  { id: 'EPP-05', trabajador: 'Jorge Lagos', rut: '12.871.902-5', elemento: 'Protector Auditivo Tipo Fono para Casco SNR 28dB', fechaEntrega: '18/08/2026', estado: 'Entregado', firma: 'Digital' },
  { id: 'EPP-06', trabajador: 'Héctor Muñoz', rut: '15.912.833-2', elemento: 'Respirador Medio Rostro Silicona con Filtros P100 Sílice', fechaEntrega: '02/09/2026', estado: 'Entregado', firma: 'Digital' }
];

export const mockEquiposEmergencia = [
  { id: 'EQ-01', nombre: 'Desfibrilador Externo Automático (DEA)', ubicacion: 'Recepción Taller Central', estado: 'Operativo', bateria: '98%', ultRevision: '01/09/2026' },
  { id: 'EQ-02', nombre: 'Camilla Rígida Espinal de Rescate', ubicacion: 'Enfermería Móvil Taller', estado: 'Operativo', accesorios: 'Completo', ultRevision: '01/09/2026' },
  { id: 'EQ-03', nombre: 'Estación Lavaojos de Emergencia Presurizada', ubicacion: 'Zona de Baterías Taller', estado: 'Operativo', aguaLimpia: 'Sí', ultRevision: '08/09/2026' },
  { id: 'EQ-04', nombre: 'Kit para Control de Derrames de Hidrocarburos 240L', ubicacion: 'Isla de Combustible', estado: 'Operativo', stockPads: '100%', ultRevision: '05/09/2026' },
  { id: 'EQ-05', nombre: 'Botiquín de Trauma Avanzado Faena', ubicacion: 'Camioneta de Rescate CAM-01', estado: 'Operativo', insumos: 'Completos', ultRevision: '11/09/2026' }
];

export const mockRiesgosSSO = [
  { id: 'RSG-01', proceso: 'Transporte de Carga Pesada en Ruta', peligro: 'Curvas pronunciadas y pendientes en alta montaña', riesgo: 'Volcamiento o desbarrancamiento', evaluacionPura: 'Crítico', control: 'Velocímetro GPS calibrado max 60 km/h, frenos auxiliares Jake Brake y retardador activo', evaluacionResidual: 'Bajo' },
  { id: 'RSG-02', proceso: 'Mantenimiento de Motores en Fosa', peligro: 'Puntos calientes y piezas móviles', riesgo: 'Quemaduras y atrapamiento', evaluacionPura: 'Alto', control: 'Protocolo de enfriamiento de motor previo y bloqueo LOTO de encendido', evaluacionResidual: 'Bajo' },
  { id: 'RSG-03', proceso: 'Carga de Diésel en Estación', peligro: 'Vapores inflamables y electricidad estática', riesgo: 'Incendio o explosión', evaluacionPura: 'Crítico', control: 'Conexión a tierra obligatoria, prohibición de celulares y extintor PQS 50kg al alcance', evaluacionResidual: 'Bajo' },
  { id: 'RSG-04', proceso: 'Tránsito en Patio de Maniobras', peligro: 'Puntos ciegos de tractocamiones', riesgo: 'Atropello a peatón', evaluacionPura: 'Crítico', control: 'Segregación física peatonal, chaleco reflectante obligatorio y bocina de marcha atrás', evaluacionResidual: 'Bajo' }
];

export const mockHallazgosSSO = [
  { id: 'HAL-2026-061', fecha: '22/08/2026', area: 'Patio de Maniobras', tipo: 'Condición Subestándar', criticidad: 'Media', descripcion: 'Baliza estroboscópica trasera de tolva TL-202 con ampolleta quemada.', estado: 'Cerrado', accionId: 'AC-2026-084' },
  { id: 'HAL-2026-069', fecha: '01/09/2026', area: 'Rampa de Descarga', tipo: 'Acción Subestándar', criticidad: 'Alta', descripcion: 'Camión estacionado en pendiente con solo un acuñador colocado.', estado: 'En Corrección', accionId: 'AC-2026-085' },
  { id: 'HAL-2026-074', fecha: '07/09/2026', area: 'Bodega Lubricantes', tipo: 'Condición Subestándar', criticidad: 'Media', descripcion: 'Tubo fluorescente con parpadeo continuo en sector de fraccionamiento.', estado: 'En Corrección', accionId: 'AC-2026-086' },
  { id: 'HAL-2026-077', fecha: '11/09/2026', area: 'Planta Chancado', tipo: 'Condición Subestándar', criticidad: 'Baja', descripcion: 'Cartel informativo de uso de respirador descolorido por radiación solar.', estado: 'Abierto', accionId: 'AC-2026-087' }
];

export const mockIncidentesSSO = [
  {
    id: 'INC-2026-01',
    fecha: '16/07/2026',
    tipo: 'Cuasi-Accidente (Near Miss)',
    titulo: 'Roce menor de neumático contra pretil de seguridad al retroceder',
    lugar: 'Sector Botadero Norte - Minera Los Pelambres',
    vehiculo: 'KHLP-90 (Tractocamión)',
    conductor: 'Rodrigo Castillo',
    lesionados: 0,
    diasPerdidos: 0,
    estado: 'Investigado y Cerrado'
  },
  {
    id: 'INC-2026-02',
    fecha: '19/08/2026',
    tipo: 'Daño Material Menor',
    titulo: 'Fisura en parabrisas por proyección de gravilla desde vehículo menor',
    lugar: 'Ruta 60-CH km 45',
    vehiculo: 'BRTH-44 (Volvo FH16)',
    conductor: 'Mauricio Silva',
    lesionados: 0,
    diasPerdidos: 0,
    estado: 'Investigado y Cerrado'
  },
  {
    id: 'INC-2026-03',
    fecha: '05/09/2026',
    tipo: 'Derrame Menor Controlado',
    titulo: 'Goteo de 1.5 litros de aceite hidráulico en bandeja colectora de fosa',
    lugar: 'Taller Central Fosa 1',
    vehiculo: 'PRTZ-33 (Tolva Scania)',
    conductor: 'N/A (Taller)',
    lesionados: 0,
    diasPerdidos: 0,
    estado: 'Investigado y Cerrado'
  }
];

export const mockReportesFlash = [
  {
    id: 'FLS-2026-03',
    fecha: '05/09/2026 11:30',
    titulo: 'Derrame menor de aceite en fosa de lubricación',
    severidad: 'Baja',
    area: 'Taller Mecánico',
    resumen: 'Se activó kit antiderrames de inmediato con arena absorbente. Cero impacto ambiental ni personal.',
    leccionAprendida: 'Verificar acople de manguera de retorno antes de conectar bomba neumática.'
  },
  {
    id: 'FLS-2026-02',
    fecha: '19/08/2026 09:15',
    titulo: 'Impacto de piedra en parabrisas de camión en ruta',
    severidad: 'Baja',
    area: 'Transporte Carretera',
    resumen: 'Lámina de seguridad evitó el astillado al interior de la cabina. Conductor sin lesiones.',
    leccionAprendida: 'Mantener distancia mínima de 50 metros respecto a vehículos que circulan adelante.'
  }
];

export const mockTrabajadoresSSO = [
  { id: 'trab-1', nombre: 'Rodrigo Castillo Fuentes', rut: '14.892.411-8', cargo: 'Conductor Profesional', empresa: 'Imperia', estado: 'Habilitado', examenOcupacional: 'Vigente hasta 04/2027', mutual: 'ACHS', induccionFaena: 'Aprobada' },
  { id: 'trab-2', nombre: 'Mauricio Silva Valenzuela', rut: '13.450.812-3', cargo: 'Conductor Profesional', empresa: 'Imperia', estado: 'Habilitado', examenOcupacional: 'Vigente hasta 11/2026', mutual: 'ACHS', induccionFaena: 'Aprobada' },
  { id: 'trab-3', nombre: 'Carlos Venegas Morales', rut: '16.711.230-K', cargo: 'Mecánico de Mantenimiento', empresa: 'Imperia', estado: 'Habilitado', examenOcupacional: 'Vigente hasta 05/2027', mutual: 'ACHS', induccionFaena: 'Aprobada' },
  { id: 'trab-4', nombre: 'Jorge Lagos Cárdenas', rut: '12.871.902-5', cargo: 'Jefe de Taller', empresa: 'Imperia', estado: 'Habilitado', examenOcupacional: 'Vigente hasta 01/2027', mutual: 'ACHS', induccionFaena: 'Aprobada' },
  { id: 'trab-5', nombre: 'Patricia Vergara Riquelme', rut: '17.330.419-4', cargo: 'Prevencionista de Riesgos', empresa: 'Imperia', estado: 'Habilitado', examenOcupacional: 'Vigente hasta 09/2027', mutual: 'ACHS', induccionFaena: 'Aprobada' },
  { id: 'trab-6', nombre: 'Héctor Muñoz Espinoza', rut: '15.912.833-2', cargo: 'Jefe de Bodega', empresa: 'Imperia', estado: 'Habilitado', examenOcupacional: 'Vigente hasta 11/2026', mutual: 'ACHS', induccionFaena: 'Aprobada' },
  { id: 'trab-7', nombre: 'Felipe Araya Godoy', rut: '18.112.449-7', cargo: 'Conductor Profesional', empresa: 'Imperia', estado: 'Habilitado', examenOcupacional: 'Vigente hasta 01/2027', mutual: 'ACHS', induccionFaena: 'Aprobada' },
  { id: 'trab-8', nombre: 'Gonzalo Pavez Castro', rut: '19.455.120-1', cargo: 'Conductor Reserva', empresa: 'Servicios Mineros del Norte', estado: 'Observación', examenOcupacional: 'Vence en 15 días', mutual: 'Mutual CChC', induccionFaena: 'Aprobada' }
];

export const mockInspeccionesSSO = [
  { id: 'INSP-081', fecha: '04/07/2026', tipo: 'Inspección de Fosa y Herramientas', responsable: 'Patricia Vergara', score: 98, hallazgos: 1, estado: 'Cerrada' },
  { id: 'INSP-082', fecha: '15/07/2026', tipo: 'Inspección de Flota en Ruta', responsable: 'Patricia Vergara', score: 96, hallazgos: 2, estado: 'Cerrada' },
  { id: 'INSP-083', fecha: '02/08/2026', tipo: 'Inspección de Equipos de Emergencia', responsable: 'Jorge Lagos', score: 100, hallazgos: 0, estado: 'Cerrada' },
  { id: 'INSP-084', fecha: '18/08/2026', tipo: 'Inspección de Almacenamiento de Químicos', responsable: 'Patricia Vergara', score: 92, hallazgos: 2, estado: 'Cerrada' },
  { id: 'INSP-085', fecha: '02/09/2026', tipo: 'Inspección Pre-Uso de Cabinas y Tacógrafos', responsable: 'Rodrigo Castillo', score: 97, hallazgos: 1, estado: 'Cerrada' },
  { id: 'INSP-086', fecha: '11/09/2026', tipo: 'Inspección Semanal de Taller y Patio', responsable: 'Patricia Vergara', score: 95, hallazgos: 1, estado: 'En Corrección' }
];

export const mockObservacionesSSO = [
  { id: 'OBS-01', fecha: '08/07/2026', observador: 'Patricia Vergara', observado: 'Rodrigo Castillo', tipo: 'Conducta Segura', descripcion: 'Uso impecable de tres puntos de apoyo al descender de cabina de camión.', estado: 'Reconocimiento' },
  { id: 'OBS-02', fecha: '24/07/2026', observador: 'Jorge Lagos', observado: 'Carlos Venegas', tipo: 'Conducta Segura', descripcion: 'Colocación preventiva de bandeja colectora de fluidos antes de soltar tapón de cárter.', estado: 'Reconocimiento' },
  { id: 'OBS-03', fecha: '14/08/2026', observador: 'Patricia Vergara', observado: 'Conductor Contratista', tipo: 'Desvío Corregido', descripcion: 'Caminar por patio sin chaleco reflectante abrochado. Se entrega retroalimentación inmediata.', estado: 'Corregido en el Acto' },
  { id: 'OBS-04', fecha: '04/09/2026', observador: 'Patricia Vergara', observado: 'Mauricio Silva', tipo: 'Conducta Segura', descripcion: 'Verificación meticulosa de presión en manómetro de neumáticos antes de salir a ruta.', estado: 'Reconocimiento' }
];

export const mockEmergenciasSSO = [
  { id: 'PLN-01', nombre: 'Plan General de Respuesta ante Emergencias Faena Minera', version: 'v3.2 (2026)', brigadaActiva: 'Sí (12 miembros)', vigencia: 'Diciembre 2026' },
  { id: 'PLN-02', nombre: 'Procedimiento Específico ante Derrames de Diésel y Sustancias Nocivas', version: 'v2.1', brigadaActiva: 'Sí', vigencia: 'Noviembre 2026' },
  { id: 'PLN-03', nombre: 'Protocolo de Rescate Vehicular y Asistencia Médica en Carretera', version: 'v4.0', brigadaActiva: 'Sí', vigencia: 'Enero 2027' }
];

export const mockSimulacrosSSO = [
  { id: 'SIM-01', fecha: '18/07/2026', tipo: 'Evacuación por Alarma Sísmica', duracionMinutos: 4.2, participantes: 48, evaluacion: 'Sobresaliente (100% zona segura en <5 min)' },
  { id: 'SIM-02', fecha: '26/08/2026', tipo: 'Derrame Mayor Simulado en Estación de Diésel', duracionMinutos: 11.5, participantes: 14, evaluacion: 'Conforme (Barreras desplegadas y fosa cerrada)' }
];

export const mockNormativasSSO = [
  { id: 'NORM-01', codigo: 'DS 594', nombre: 'Condiciones Sanitarias y Ambientales Básicas en Lugares de Trabajo', cumplimiento: '100%', estado: 'Conforme' },
  { id: 'NORM-02', codigo: 'DS 132', nombre: 'Reglamento de Seguridad Minera (SERNAGEOMIN)', cumplimiento: '98.5%', estado: 'Conforme' },
  { id: 'NORM-03', codigo: 'Ley 16.744', nombre: 'Seguro Social contra Riesgos de Accidentes del Trabajo y Enfermedades Profesionales', cumplimiento: '100%', estado: 'Conforme' },
  { id: 'NORM-04', codigo: 'DS 40', nombre: 'Reglamento sobre Prevención de Riesgos Profesionales (Derecho a Saber)', cumplimiento: '100%', estado: 'Conforme' },
  { id: 'NORM-05', codigo: 'DS 298', nombre: 'Reglamento de Transporte de Cargas Peligrosas por Calles y Caminos', cumplimiento: '100%', estado: 'Conforme' }
];

export const mockReportesMensualesSSO = [
  { id: 'REP-2026-07', periodo: 'Julio 2026', dotacion: 146, hht: 25400, if: 0.0, ig: 0.0, charlasRealizadas: 42, inspecciones: 18, scoreGlobal: '96.2%' },
  { id: 'REP-2026-08', periodo: 'Agosto 2026', dotacion: 148, hht: 26100, if: 0.0, ig: 0.0, charlasRealizadas: 45, inspecciones: 20, scoreGlobal: '97.0%' },
  { id: 'REP-2026-09', periodo: 'Septiembre 2026 (al 12)', dotacion: 148, hht: 10400, if: 0.0, ig: 0.0, charlasRealizadas: 19, inspecciones: 8, scoreGlobal: '96.8%' }
];
