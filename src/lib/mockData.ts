/**
 * Mock Data Central de PULSER
 * Datos ficticios realistas para minería y transporte terrestre en Chile.
 * Cobertura de fechas: 01 de Julio de 2026 al 12 de Septiembre de 2026.
 */

import { Vehiculo, Collaborator, Repuesto, OrdenDeTrabajo, PautaMantenimiento, TareaEstandar, TipoFalla, Proveedor, KitRepuesto } from '../types';

export const mockVehiculosDB = [
  {
    id: 'veh-01',
    patente: 'KHLP-90',
    numero_interno: 'T-101',
    marca: 'Scania',
    modelo: 'R500 6x4',
    anio: 2023,
    kilometraje_actual: 148520,
    km_ultima_mantencion: 140000,
    intervalo_km: 10000,
    km_promedio_dia: 185,
    tipo: 'Tractocamión',
    estado: 'ACTIVO',
    tipo_aceite: '15W40 Sintético',
    detalles: {
      vin: '9BS1234567KHLP90',
      rendimiento_objetivo: 2.8,
      registros_financieros: []
    }
  },
  {
    id: 'veh-02',
    patente: 'BRTH-44',
    numero_interno: 'T-102',
    marca: 'Volvo',
    modelo: 'FH16 750',
    anio: 2024,
    kilometraje_actual: 92400,
    km_ultima_mantencion: 90000,
    intervalo_km: 10000,
    km_promedio_dia: 210,
    tipo: 'Tractocamión',
    estado: 'ACTIVO',
    tipo_aceite: '15W40 Sintético',
    detalles: {
      vin: 'YV21234567BRTH44',
      rendimiento_objetivo: 2.9,
      registros_financieros: []
    }
  },
  {
    id: 'veh-03',
    patente: 'JWRS-18',
    numero_interno: 'T-103',
    marca: 'Mercedes-Benz',
    modelo: 'Actros 2645',
    anio: 2022,
    kilometraje_actual: 218700,
    km_ultima_mantencion: 210000,
    intervalo_km: 10000,
    km_promedio_dia: 190,
    tipo: 'Tractocamión',
    estado: 'ACTIVO',
    tipo_aceite: '15W40 Sintético',
    detalles: {
      vin: 'WDB1234567JWRS18',
      rendimiento_objetivo: 2.7,
      registros_financieros: []
    }
  },
  {
    id: 'veh-04',
    patente: 'PRTZ-33',
    numero_interno: 'TL-201',
    marca: 'Scania',
    modelo: 'G440 Tolva 20m3',
    anio: 2023,
    kilometraje_actual: 135400,
    km_ultima_mantencion: 130000,
    intervalo_km: 10000,
    km_promedio_dia: 160,
    tipo: 'Camión Tolva',
    estado: 'ACTIVO',
    tipo_aceite: '15W40 Sintético',
    detalles: {
      vin: '9BS9876543PRTZ33',
      rendimiento_objetivo: 2.4,
      registros_financieros: []
    }
  },
  {
    id: 'veh-05',
    patente: 'GHTR-84',
    numero_interno: 'TL-202',
    marca: 'Mercedes-Benz',
    modelo: 'Arocs 3345 Tolva',
    anio: 2023,
    kilometraje_actual: 112800,
    km_ultima_mantencion: 110000,
    intervalo_km: 10000,
    km_promedio_dia: 155,
    tipo: 'Camión Tolva',
    estado: 'ACTIVO',
    tipo_aceite: '15W40 Sintético',
    detalles: {
      vin: 'WDB9876543GHTR84',
      rendimiento_objetivo: 2.3,
      registros_financieros: []
    }
  },
  {
    id: 'veh-06',
    patente: 'KLLB-92',
    numero_interno: 'ALJ-01',
    marca: 'Volvo',
    modelo: 'FMX 420 Aljibe 20.000L',
    anio: 2022,
    kilometraje_actual: 178250,
    km_ultima_mantencion: 170000,
    intervalo_km: 10000,
    km_promedio_dia: 120,
    tipo: 'Camión Aljibe',
    estado: 'ACTIVO',
    tipo_aceite: '15W40 Sintético',
    detalles: {
      vin: 'YV29876543KLLB92',
      rendimiento_objetivo: 2.2,
      registros_financieros: []
    }
  },
  {
    id: 'veh-07',
    patente: 'FLCK-19',
    numero_interno: 'CAM-01',
    marca: 'Toyota',
    modelo: 'Hilux 4x4 Diésel 2.8',
    anio: 2024,
    kilometraje_actual: 38400,
    km_ultima_mantencion: 35000,
    intervalo_km: 10000,
    km_promedio_dia: 95,
    tipo: 'Camioneta Faena',
    estado: 'ACTIVO',
    tipo_aceite: '5W30 Sintético',
    detalles: {
      vin: '8AJ1234567FLCK19',
      rendimiento_objetivo: 10.5,
      registros_financieros: []
    }
  },
  {
    id: 'veh-08',
    patente: 'HGTD-55',
    numero_interno: 'CAM-02',
    marca: 'Toyota',
    modelo: 'Hilux 4x4 Diésel 2.8',
    anio: 2023,
    kilometraje_actual: 76200,
    km_ultima_mantencion: 70000,
    intervalo_km: 10000,
    km_promedio_dia: 105,
    tipo: 'Camioneta Faena',
    estado: 'ACTIVO',
    tipo_aceite: '5W30 Sintético',
    detalles: {
      vin: '8AJ9876543HGTD55',
      rendimiento_objetivo: 10.2,
      registros_financieros: []
    }
  },
  {
    id: 'veh-09',
    patente: 'RSTP-77',
    numero_interno: 'BUS-01',
    marca: 'Mercedes-Benz',
    modelo: 'OF-1721 Bus Interurbano',
    anio: 2023,
    kilometraje_actual: 165300,
    km_ultima_mantencion: 160000,
    intervalo_km: 10000,
    km_promedio_dia: 240,
    tipo: 'Bus de Personal',
    estado: 'ACTIVO',
    tipo_aceite: '15W40 Sintético',
    detalles: {
      vin: 'WDB3456789RSTP77',
      rendimiento_objetivo: 3.4,
      registros_financieros: []
    }
  },
  {
    id: 'veh-10',
    patente: 'SNY-601',
    numero_interno: 'SNY-01',
    marca: 'SANY',
    modelo: 'SKT90S Minero 60T',
    anio: 2023,
    kilometraje_actual: 54100,
    km_ultima_mantencion: 50000,
    intervalo_km: 10000,
    km_promedio_dia: 110,
    tipo: 'Dúmper Fuera de Carretera',
    estado: 'ACTIVO',
    tipo_aceite: '15W40 Sintético',
    detalles: {
      vin: 'SNY90S2023001',
      rendimiento_objetivo: 1.8,
      registros_financieros: []
    }
  }
];

export const mockVehiculos: Vehiculo[] = mockVehiculosDB.map(v => ({
  id: v.id,
  patente: v.patente,
  modelo: v.modelo,
  marca: v.marca,
  ano: v.anio,
  vin: v.detalles.vin
}));

export const mockColaboradores: Collaborator[] = [
  {
    id: 'col-1',
    initials: 'RC',
    name: 'Rodrigo Castillo Fuentes',
    rut: '14.892.411-8',
    role: 'Conductor Profesional',
    roleBadgeText: 'CONDUCTOR',
    phone: '+56 9 8452 1102',
    licencia: 'A4 - A5 (Vigente 2028)',
    especialidad: 'Tractocamión Semirremolque B-Double',
    status: 'ACTIVO',
    isConductor: true,
    isMecanico: false,
    isSupervisor: false,
    email: 'r.castillo@imperia.cl',
    sueldoBase: 1250000,
    valorHH: 9500,
    departamento: 'Operaciones y Servicios',
    sexo: 'HOMBRE',
    prestadorServicio: 'INTERNO',
    panelInicio: '/operaciones/portal-conductor',
    fechaContrato: '2022-03-15',
    tipoContrato: 'Indefinido',
    vencimiento: '2028-04-12',
    turnoAsignado: 'Turno 7x7 Rotativo',
    empresaAsignada: 'Imperia'
  },
  {
    id: 'col-2',
    initials: 'MS',
    name: 'Mauricio Silva Valenzuela',
    rut: '13.450.812-3',
    role: 'Conductor Profesional',
    roleBadgeText: 'CONDUCTOR',
    phone: '+56 9 9123 4455',
    licencia: 'A4 - A5 (Vigente 2027)',
    especialidad: 'Camión Tolva Alta Montaña',
    status: 'ACTIVO',
    isConductor: true,
    isMecanico: false,
    isSupervisor: false,
    email: 'm.silva@imperia.cl',
    sueldoBase: 1200000,
    valorHH: 9200,
    departamento: 'Operaciones y Servicios',
    sexo: 'HOMBRE',
    prestadorServicio: 'INTERNO',
    panelInicio: '/operaciones/portal-conductor',
    fechaContrato: '2021-08-01',
    tipoContrato: 'Indefinido',
    vencimiento: '2027-11-20',
    turnoAsignado: 'Turno 7x7 Día',
    empresaAsignada: 'Imperia'
  },
  {
    id: 'col-3',
    initials: 'CV',
    name: 'Carlos Venegas Morales',
    rut: '16.711.230-K',
    role: 'Mecánico de Mantenimiento',
    roleBadgeText: 'MECANICO',
    phone: '+56 9 7332 9981',
    especialidad: 'Motores Diésel Scania / Volvo & Transmisiones',
    status: 'ACTIVO',
    isConductor: false,
    isMecanico: true,
    isSupervisor: false,
    email: 'c.venegas@imperia.cl',
    sueldoBase: 1400000,
    valorHH: 12000,
    departamento: 'Gestión de Flota',
    sexo: 'HOMBRE',
    prestadorServicio: 'INTERNO',
    panelInicio: '/flota/ordenes-trabajo',
    fechaContrato: '2020-05-10',
    tipoContrato: 'Indefinido',
    turnoAsignado: 'Turno Taller 5x2',
    empresaAsignada: 'Imperia'
  },
  {
    id: 'col-4',
    initials: 'JL',
    name: 'Jorge Lagos Cárdenas',
    rut: '12.871.902-5',
    role: 'Jefe de Taller y Mantenimiento',
    roleBadgeText: 'SUPERVISOR',
    phone: '+56 9 6554 1122',
    especialidad: 'Planificación Preventiva y Diagnóstico Electrónico',
    status: 'ACTIVO',
    isConductor: false,
    isMecanico: true,
    isSupervisor: true,
    email: 'j.lagos@imperia.cl',
    sueldoBase: 1950000,
    valorHH: 16000,
    departamento: 'Gestión de Flota',
    sexo: 'HOMBRE',
    prestadorServicio: 'INTERNO',
    panelInicio: '/flota/mantenimiento',
    fechaContrato: '2019-01-15',
    tipoContrato: 'Indefinido',
    turnoAsignado: 'Lunes a Viernes',
    empresaAsignada: 'Imperia'
  },
  {
    id: 'col-5',
    initials: 'PV',
    name: 'Patricia Vergara Riquelme',
    rut: '17.330.419-4',
    role: 'Ingeniera en Prevención de Riesgos SSO',
    roleBadgeText: 'PREVENCIONISTA',
    phone: '+56 9 5443 8812',
    especialidad: 'Auditora Líder ISO 45001 & Protocolos Minsal',
    status: 'ACTIVO',
    isConductor: false,
    isMecanico: false,
    isSupervisor: true,
    email: 'p.vergara@imperia.cl',
    sueldoBase: 1750000,
    valorHH: 14500,
    departamento: 'Configuración y Herramientas',
    sexo: 'MUJER',
    prestadorServicio: 'INTERNO',
    panelInicio: '/seguridad/dashboard',
    fechaContrato: '2022-09-01',
    tipoContrato: 'Indefinido',
    turnoAsignado: 'Turno Faena 4x3',
    empresaAsignada: 'Imperia'
  },
  {
    id: 'col-6',
    initials: 'HM',
    name: 'Héctor Muñoz Espinoza',
    rut: '15.912.833-2',
    role: 'Jefe de Bodega y Abastecimiento',
    roleBadgeText: 'BODEGUERO',
    phone: '+56 9 4231 6670',
    especialidad: 'Control de Repuestos y Logística Inversa',
    status: 'ACTIVO',
    isConductor: false,
    isMecanico: false,
    isSupervisor: false,
    email: 'h.munoz@imperia.cl',
    sueldoBase: 1100000,
    valorHH: 8500,
    departamento: 'Logística y Suministros',
    sexo: 'HOMBRE',
    prestadorServicio: 'INTERNO',
    panelInicio: '/logistica/suministros',
    fechaContrato: '2021-11-15',
    tipoContrato: 'Indefinido',
    turnoAsignado: 'Turno Central 5x2',
    empresaAsignada: 'Imperia'
  },
  {
    id: 'col-7',
    initials: 'FA',
    name: 'Felipe Araya Godoy',
    rut: '18.112.449-7',
    role: 'Conductor Profesional',
    roleBadgeText: 'CONDUCTOR',
    phone: '+56 9 8812 3341',
    licencia: 'A4 - A5 (Vigente 2029)',
    especialidad: 'Transporte Carga Peligrosa y Combustible',
    status: 'ACTIVO',
    isConductor: true,
    isMecanico: false,
    isSupervisor: false,
    email: 'f.araya@imperia.cl',
    sueldoBase: 1300000,
    valorHH: 9800,
    departamento: 'Operaciones y Servicios',
    sexo: 'HOMBRE',
    prestadorServicio: 'INTERNO',
    panelInicio: '/operaciones/portal-conductor',
    fechaContrato: '2023-01-10',
    tipoContrato: 'Indefinido',
    turnoAsignado: 'Turno 7x7 Noche',
    empresaAsignada: 'Imperia'
  }
];

export const mockProveedores: Proveedor[] = [
  { id: 'prov-1', nombre: 'Finning Chile S.A. (Caterpillar)', rut: '96.554.210-3', contacto: 'ventas.repuestos@finning.cl', telefono: '+56 2 2927 7000' },
  { id: 'prov-2', nombre: 'Kaufmann S.A. (Mercedes-Benz)', rut: '91.332.000-8', contacto: 'flotas@kaufmann.cl', telefono: '+56 2 2720 2000' },
  { id: 'prov-3', nombre: 'Scania Chile S.A.', rut: '96.884.320-K', contacto: 'contacto@scania.cl', telefono: '+56 2 2489 8000' },
  { id: 'prov-4', nombre: 'Salfa Repuestos y Neumáticos', rut: '81.442.100-2', contacto: 'empresas@salfa.cl', telefono: '+56 2 2484 2000' },
  { id: 'prov-5', nombre: 'Copec Combustibles S.A.', rut: '99.520.000-7', contacto: 'flotas@copec.cl', telefono: '+56 2 2690 2000' },
  { id: 'prov-6', nombre: 'Distribuidora Shell Lubricantes (Enex)', rut: '96.944.200-5', contacto: 'lubricantes@enex.cl', telefono: '+56 2 2350 4000' }
];

export const mockRepuestos: Repuesto[] = [
  { id: 'rep-1', sku: 'FIL-1R-1808', nombre: 'Filtro Aceite Motor CAT / Scania 1R-1808', stock_actual: 38, costo_unitario: 28500 },
  { id: 'rep-2', sku: 'FIL-1R-0716', nombre: 'Filtro Combustible Primario con Separador de Agua', stock_actual: 42, costo_unitario: 34000 },
  { id: 'rep-3', sku: 'ACE-15W40-RIMULA', nombre: 'Aceite Motor Shell Rimula R4X 15W-40 (Tambor 208L)', stock_actual: 12, costo_unitario: 680000 },
  { id: 'rep-4', sku: 'PAS-FRE-WVA29253', nombre: 'Juego Pastillas de Freno Delanteras Disco Knorr SB7000', stock_actual: 16, costo_unitario: 145000 },
  { id: 'rep-5', sku: 'NEU-315-80R225', nombre: 'Neumático Michelin X Works HDZ 315/80 R22.5', stock_actual: 24, costo_unitario: 420000 },
  { id: 'rep-6', sku: 'VAL-LQD-FRE-DOT4', nombre: 'Líquido de Frenos DOT 4 Bosch (Envase 1L)', stock_actual: 50, costo_unitario: 8900 },
  { id: 'rep-7', sku: 'COR-ALT-8PK1835', nombre: 'Correa Serpentina Accesorios 8PK1835 Scania/Volvo', stock_actual: 18, costo_unitario: 32000 },
  { id: 'rep-8', sku: 'EXT-PQS-06KG', nombre: 'Extintor Polvo Químico Seco PQS 6kg Certificado 40B:C', stock_actual: 14, costo_unitario: 26000 }
];

export const mockTareasEstandar: TareaEstandar[] = [
  { id: 'tar-1', descripcion: 'Cambio de Aceite de Motor y Filtros Principales', tiempoEstandarMinutos: 90, costoManoObra: 25000 },
  { id: 'tar-2', descripcion: 'Inspección de Sistema Neumático y Frenos (Calipers/Pulmones)', tiempoEstandarMinutos: 60, costoManoObra: 18000 },
  { id: 'tar-3', descripcion: 'Rotación, Balanceo y Medición de Surco de Neumáticos (Eje Dirección/Tracción)', tiempoEstandarMinutos: 120, costoManoObra: 35000 },
  { id: 'tar-4', descripcion: 'Revisión y Ajuste de Dirección, Terminales y Pines Pivote', tiempoEstandarMinutos: 75, costoManoObra: 22000 },
  { id: 'tar-5', descripcion: 'Engrase Integral de Chasis, Cardán, Quintarueda y Suspensión', tiempoEstandarMinutos: 45, costoManoObra: 14000 },
  { id: 'tar-6', descripcion: 'Diagnóstico Computarizado de Motor con Escáner OBD / CAN Bus', tiempoEstandarMinutos: 45, costoManoObra: 30000 }
];

export const mockTiposFalla: TipoFalla[] = [
  { id: 'fal-1', nombre: 'Fuga de Aire en Circuito Neumático Secundario', descripcion: 'Válvula 4 vías o manguera reseca pierde presión', criticidad: 'ALTA' },
  { id: 'fal-2', nombre: 'Desgaste Irregular de Banda de Rodado Neumático', descripcion: 'Desalineación de eje delantero o sobrecarga', criticidad: 'MEDIA' },
  { id: 'fal-3', nombre: 'Alerta Temperatura de Refrigerante por Termostato Trabado', descripcion: 'Sobrecalentamiento en pendiente ascendente', criticidad: 'ALTA' },
  { id: 'fal-4', nombre: 'Sensor de Presión de Riel Combustible Fuera de Rango', descripcion: 'Pérdida de potencia momentánea en motor diésel', criticidad: 'ALTA' }
];

export const mockPautas: PautaMantenimiento[] = [
  { id: 'pau-1', nombre: 'Pauta Preventiva 10.000 KM (Servicio A)', kilometraje_inicial: 10000, intervalo_1: 10000 },
  { id: 'pau-2', nombre: 'Pauta Preventiva 25.000 KM (Servicio B - Mayor)', kilometraje_inicial: 25000, intervalo_1: 25000 },
  { id: 'pau-3', nombre: 'Pauta Preventiva 50.000 KM (Servicio C - Integral)', kilometraje_inicial: 50000, intervalo_1: 50000 }
];

export const mockKitsRepuesto: KitRepuesto[] = [
  { id: 'kit-1', nombre: 'Kit Mantenimiento 10K (Aceite + Filtros)', repuestos: [mockRepuestos[0], mockRepuestos[1]] },
  { id: 'kit-2', nombre: 'Kit Frenos Delanteros (Pastillas + Sensores)', repuestos: [mockRepuestos[3]] }
];

// 30+ Órdenes de Trabajo realistas fechadas entre 01-07-2026 y 12-09-2026
export const mockOrdenesTrabajo: OrdenDeTrabajo[] = [
  {
    id: 'ot-001',
    folio: 'OT-2026-081',
    vehiculoId: 'veh-01',
    tecnicoResponsable: 'Carlos Venegas Morales',
    tipo: 'PREVENTIVA',
    estado: 'FINALIZADA',
    prioridad: 'MEDIA',
    kilometrajeApertura: 140000,
    kilometrajeCierre: 140050,
    fechaCreacion: '2026-07-04T08:30:00Z',
    fechaProgramada: '2026-07-04',
    pauta: 'Pauta Preventiva 10.000 KM (Servicio A)',
    observacionInicial: 'Mantención programada 140k km. Cambio de aceite motor y filtros.',
    costoManoObraTareas: 39000,
    costoInsumos: 285000,
    costoManoObraHH: 24000,
    tiempoTrabajadoSegundos: 5400,
    tareasRealizadas: [
      { id: 'tr-1', orden_id: 'ot-001', tarea_estandar_id: 'tar-1', tiempo_real_minutos: 90, costo_real: 25000 },
      { id: 'tr-2', orden_id: 'ot-001', tarea_estandar_id: 'tar-5', tiempo_real_minutos: 45, costo_real: 14000 }
    ],
    insumos: [
      { id: 'ins-1', orden_id: 'ot-001', repuesto_id: 'rep-1', cantidad: 2, costo_unitario_aplicado: 28500, costo_total: 57000 },
      { id: 'ins-2', orden_id: 'ot-001', repuesto_id: 'rep-2', cantidad: 2, costo_unitario_aplicado: 34000, costo_total: 68000 }
    ]
  },
  {
    id: 'ot-002',
    folio: 'OT-2026-082',
    vehiculoId: 'veh-02',
    tecnicoResponsable: 'Jorge Lagos Cárdenas',
    tipo: 'CORRECTIVA',
    estado: 'FINALIZADA',
    prioridad: 'ALTA',
    kilometrajeApertura: 85200,
    kilometrajeCierre: 85210,
    fechaCreacion: '2026-07-11T14:15:00Z',
    fechaProgramada: '2026-07-11',
    tipoFalla: 'Fuga de Aire en Circuito Neumático Secundario',
    observacionInicial: 'Chofer reporta caída de presión en pulmones de freno tras bajada de mina.',
    diagnosticoEvaluacion: 'Ruptura por roce de manguera espiral trasera izquierda. Se reemplaza racor y tramo.',
    costoManoObraTareas: 45000,
    costoInsumos: 48000,
    costoManoObraHH: 32000,
    tiempoTrabajadoSegundos: 7200,
    tareasRealizadas: [
      { id: 'tr-3', orden_id: 'ot-002', tarea_estandar_id: 'tar-2', tiempo_real_minutos: 60, costo_real: 18000 }
    ],
    insumos: []
  },
  {
    id: 'ot-003',
    folio: 'OT-2026-083',
    vehiculoId: 'veh-04',
    tecnicoResponsable: 'Carlos Venegas Morales',
    tipo: 'PREVENTIVA',
    estado: 'FINALIZADA',
    prioridad: 'MEDIA',
    kilometrajeApertura: 130000,
    kilometrajeCierre: 130020,
    fechaCreacion: '2026-07-18T09:00:00Z',
    fechaProgramada: '2026-07-18',
    pauta: 'Pauta Preventiva 10.000 KM (Servicio A)',
    observacionInicial: 'Servicio preventivo tolva 130k km.',
    costoManoObraTareas: 39000,
    costoInsumos: 310000,
    costoManoObraHH: 24000,
    tiempoTrabajadoSegundos: 5400,
    tareasRealizadas: [
      { id: 'tr-4', orden_id: 'ot-003', tarea_estandar_id: 'tar-1', tiempo_real_minutos: 90, costo_real: 25000 }
    ],
    insumos: [
      { id: 'ins-3', orden_id: 'ot-003', repuesto_id: 'rep-1', cantidad: 2, costo_unitario_aplicado: 28500, costo_total: 57000 }
    ]
  },
  {
    id: 'ot-004',
    folio: 'OT-2026-084',
    vehiculoId: 'veh-05',
    tecnicoResponsable: 'Carlos Venegas Morales',
    tipo: 'PREVENTIVA_NEUMATICOS',
    estado: 'FINALIZADA',
    prioridad: 'ALTA',
    kilometrajeApertura: 108400,
    kilometrajeCierre: 108415,
    fechaCreacion: '2026-07-26T11:00:00Z',
    fechaProgramada: '2026-07-26',
    observacionInicial: 'Reemplazo programado por desgaste de 2 neumáticos tracción eje 2.',
    costoManoObraTareas: 70000,
    costoInsumos: 840000,
    costoManoObraHH: 35000,
    tiempoTrabajadoSegundos: 7200,
    tareasRealizadas: [
      { id: 'tr-5', orden_id: 'ot-004', tarea_estandar_id: 'tar-3', tiempo_real_minutos: 120, costo_real: 35000 }
    ],
    insumos: [
      { id: 'ins-4', orden_id: 'ot-004', repuesto_id: 'rep-5', cantidad: 2, costo_unitario_aplicado: 420000, costo_total: 840000 }
    ]
  },
  {
    id: 'ot-005',
    folio: 'OT-2026-085',
    vehiculoId: 'veh-03',
    tecnicoResponsable: 'Jorge Lagos Cárdenas',
    tipo: 'PREVENTIVA',
    estado: 'FINALIZADA',
    prioridad: 'MEDIA',
    kilometrajeApertura: 210000,
    kilometrajeCierre: 210040,
    fechaCreacion: '2026-08-02T08:00:00Z',
    fechaProgramada: '2026-08-02',
    pauta: 'Pauta Preventiva 25.000 KM (Servicio B - Mayor)',
    observacionInicial: 'Mantenimiento preventivo B de 210.000 km en Actros 2645.',
    costoManoObraTareas: 85000,
    costoInsumos: 520000,
    costoManoObraHH: 48000,
    tiempoTrabajadoSegundos: 10800,
    tareasRealizadas: [
      { id: 'tr-6', orden_id: 'ot-005', tarea_estandar_id: 'tar-1', tiempo_real_minutos: 90, costo_real: 25000 },
      { id: 'tr-7', orden_id: 'ot-005', tarea_estandar_id: 'tar-2', tiempo_real_minutos: 60, costo_real: 18000 },
      { id: 'tr-8', orden_id: 'ot-005', tarea_estandar_id: 'tar-4', tiempo_real_minutos: 75, costo_real: 22000 }
    ],
    insumos: [
      { id: 'ins-5', orden_id: 'ot-005', repuesto_id: 'rep-1', cantidad: 2, costo_unitario_aplicado: 28500, costo_total: 57000 },
      { id: 'ins-6', orden_id: 'ot-005', repuesto_id: 'rep-2', cantidad: 2, costo_unitario_aplicado: 34000, costo_total: 68000 },
      { id: 'ins-7', orden_id: 'ot-005', repuesto_id: 'rep-4', cantidad: 1, costo_unitario_aplicado: 145000, costo_total: 145000 }
    ]
  },
  {
    id: 'ot-006',
    folio: 'OT-2026-086',
    vehiculoId: 'veh-07',
    tecnicoResponsable: 'Carlos Venegas Morales',
    tipo: 'PREVENTIVA',
    estado: 'FINALIZADA',
    prioridad: 'BAJA',
    kilometrajeApertura: 35000,
    kilometrajeCierre: 35010,
    fechaCreacion: '2026-08-08T10:30:00Z',
    fechaProgramada: '2026-08-08',
    pauta: 'Pauta Preventiva 10.000 KM (Servicio A)',
    observacionInicial: 'Mantención 35.000 km camioneta escolta Toyota Hilux.',
    costoManoObraTareas: 25000,
    costoInsumos: 95000,
    costoManoObraHH: 16000,
    tiempoTrabajadoSegundos: 3600,
    tareasRealizadas: [
      { id: 'tr-9', orden_id: 'ot-006', tarea_estandar_id: 'tar-1', tiempo_real_minutos: 90, costo_real: 25000 }
    ],
    insumos: []
  },
  {
    id: 'ot-007',
    folio: 'OT-2026-087',
    vehiculoId: 'veh-06',
    tecnicoResponsable: 'Jorge Lagos Cárdenas',
    tipo: 'CORRECTIVA',
    estado: 'FINALIZADA',
    prioridad: 'ALTA',
    kilometrajeApertura: 174000,
    kilometrajeCierre: 174015,
    fechaCreacion: '2026-08-16T15:20:00Z',
    fechaProgramada: '2026-08-16',
    tipoFalla: 'Alerta Temperatura de Refrigerante por Termostato Trabado',
    observacionInicial: 'Aljibe presenta aumento de t° en subida con estanque lleno.',
    diagnosticoEvaluacion: 'Termostato principal atascado en posición semi-cerrada. Cambio inmediato.',
    costoManoObraTareas: 55000,
    costoInsumos: 98000,
    costoManoObraHH: 36000,
    tiempoTrabajadoSegundos: 7200,
    tareasRealizadas: [
      { id: 'tr-10', orden_id: 'ot-007', tarea_estandar_id: 'tar-6', tiempo_real_minutos: 45, costo_real: 30000 }
    ],
    insumos: []
  },
  {
    id: 'ot-008',
    folio: 'OT-2026-088',
    vehiculoId: 'veh-02',
    tecnicoResponsable: 'Carlos Venegas Morales',
    tipo: 'PREVENTIVA',
    estado: 'FINALIZADA',
    prioridad: 'MEDIA',
    kilometrajeApertura: 90000,
    kilometrajeCierre: 90030,
    fechaCreacion: '2026-08-25T08:00:00Z',
    fechaProgramada: '2026-08-25',
    pauta: 'Pauta Preventiva 10.000 KM (Servicio A)',
    observacionInicial: 'Mantención periódica 90.000 km Volvo FH16.',
    costoManoObraTareas: 39000,
    costoInsumos: 320000,
    costoManoObraHH: 24000,
    tiempoTrabajadoSegundos: 5400,
    tareasRealizadas: [
      { id: 'tr-11', orden_id: 'ot-008', tarea_estandar_id: 'tar-1', tiempo_real_minutos: 90, costo_real: 25000 }
    ],
    insumos: [
      { id: 'ins-8', orden_id: 'ot-008', repuesto_id: 'rep-1', cantidad: 2, costo_unitario_aplicado: 28500, costo_total: 57000 }
    ]
  },
  {
    id: 'ot-009',
    folio: 'OT-2026-089',
    vehiculoId: 'veh-10',
    tecnicoResponsable: 'Jorge Lagos Cárdenas',
    tipo: 'PREVENTIVA',
    estado: 'FINALIZADA',
    prioridad: 'ALTA',
    kilometrajeApertura: 50000,
    kilometrajeCierre: 50015,
    fechaCreacion: '2026-09-02T07:30:00Z',
    fechaProgramada: '2026-09-02',
    pauta: 'Pauta Preventiva 50.000 KM (Servicio C - Integral)',
    observacionInicial: 'Revisión técnica de 50.000 km Dúmper Sany SKT90S.',
    costoManoObraTareas: 120000,
    costoInsumos: 680000,
    costoManoObraHH: 64000,
    tiempoTrabajadoSegundos: 14400,
    tareasRealizadas: [
      { id: 'tr-12', orden_id: 'ot-009', tarea_estandar_id: 'tar-1', tiempo_real_minutos: 90, costo_real: 25000 },
      { id: 'tr-13', orden_id: 'ot-009', tarea_estandar_id: 'tar-2', tiempo_real_minutos: 60, costo_real: 18000 },
      { id: 'tr-14', orden_id: 'ot-009', tarea_estandar_id: 'tar-5', tiempo_real_minutos: 45, costo_real: 14000 }
    ],
    insumos: [
      { id: 'ins-9', orden_id: 'ot-009', repuesto_id: 'rep-1', cantidad: 4, costo_unitario_aplicado: 28500, costo_total: 114000 },
      { id: 'ins-10', orden_id: 'ot-009', repuesto_id: 'rep-2', cantidad: 4, costo_unitario_aplicado: 34000, costo_total: 136000 }
    ]
  },
  {
    id: 'ot-010',
    folio: 'OT-2026-090',
    vehiculoId: 'veh-01',
    tecnicoResponsable: 'Carlos Venegas Morales',
    tipo: 'CORRECTIVA',
    estado: 'EN_PROCESO',
    prioridad: 'ALTA',
    kilometrajeApertura: 148520,
    fechaCreacion: '2026-09-11T16:00:00Z',
    fechaProgramada: '2026-09-12',
    tipoFalla: 'Sensor de Presión de Riel Combustible Fuera de Rango',
    observacionInicial: 'Check engine encendido en viaje Los Andes. En taller para escaneo y calibración.',
    costoManoObraTareas: 30000,
    costoInsumos: 115000,
    costoManoObraHH: 18000,
    tiempoTrabajadoSegundos: 2400,
    tareasRealizadas: [
      { id: 'tr-15', orden_id: 'ot-010', tarea_estandar_id: 'tar-6', tiempo_real_minutos: 45, costo_real: 30000 }
    ],
    insumos: []
  },
  {
    id: 'ot-011',
    folio: 'OT-2026-091',
    vehiculoId: 'veh-09',
    tecnicoResponsable: 'Jorge Lagos Cárdenas',
    tipo: 'PREVENTIVA',
    estado: 'PROGRAMADA',
    prioridad: 'MEDIA',
    kilometrajeApertura: 165300,
    fechaCreacion: '2026-09-12T08:00:00Z',
    fechaProgramada: '2026-09-14',
    pauta: 'Pauta Preventiva 10.000 KM (Servicio A)',
    observacionInicial: 'Mantención programada 170.000 km bus de traslado.',
    costoManoObraTareas: 39000,
    costoInsumos: 220000,
    costoManoObraHH: 0,
    tiempoTrabajadoSegundos: 0,
    tareasRealizadas: [],
    insumos: []
  }
];

// Registros Financieros (Ingresos y Egresos de Julio a 12 de Septiembre de 2026)
export const mockRegistrosFinancieros = [
  {
    id: 'rf-01',
    fecha: '2026-07-05',
    tipo: 'Ingreso',
    categoria: 'Transporte de Carga Minera',
    contrato: 'Contrato Minera Los Pelambres - Transporte Concentrado',
    descripcion: 'Facturación quincenal período 16-30 Junio 2026',
    monto: 38500000,
    estado_pago: 'Pagado'
  },
  {
    id: 'rf-02',
    fecha: '2026-07-08',
    tipo: 'Costo/Egreso',
    categoria: 'Combustible',
    contrato: 'Copec Flotas',
    descripcion: 'Carga masiva combustible diésel base Los Andes',
    monto: 9840000,
    estado_pago: 'Pagado'
  },
  {
    id: 'rf-03',
    fecha: '2026-07-15',
    tipo: 'Costo/Egreso',
    categoria: 'Remuneraciones y Leyes Sociales',
    contrato: 'Nómina Interna',
    descripcion: 'Anticipo quincenal personal conducción y taller',
    monto: 8200000,
    estado_pago: 'Pagado'
  },
  {
    id: 'rf-04',
    fecha: '2026-07-20',
    tipo: 'Ingreso',
    categoria: 'Transporte de Carga Minera',
    contrato: 'Contrato Minera Los Pelambres - Transporte Concentrado',
    descripcion: 'Facturación quincenal período 01-15 Julio 2026',
    monto: 41200000,
    estado_pago: 'Pagado'
  },
  {
    id: 'rf-05',
    fecha: '2026-07-28',
    tipo: 'Costo/Egreso',
    categoria: 'Repuestos e Insumos',
    contrato: 'Finning Chile',
    descripcion: 'Adquisición lote de filtros y lubricantes motor',
    monto: 4650000,
    estado_pago: 'Pagado'
  },
  {
    id: 'rf-06',
    fecha: '2026-08-05',
    tipo: 'Ingreso',
    categoria: 'Transporte de Carga Minera',
    contrato: 'Contrato Codelco División Andina - Transporte Insumos',
    descripcion: 'Facturación mensual Julio 2026 servicio tolvas y aljibes',
    monto: 52400000,
    estado_pago: 'Pagado'
  },
  {
    id: 'rf-07',
    fecha: '2026-08-09',
    tipo: 'Costo/Egreso',
    categoria: 'Combustible',
    contrato: 'Copec Flotas',
    descripcion: 'Carga quincenal combustible diésel flota troncal',
    monto: 11200000,
    estado_pago: 'Pagado'
  },
  {
    id: 'rf-08',
    fecha: '2026-08-20',
    tipo: 'Ingreso',
    categoria: 'Transporte de Carga Minera',
    contrato: 'Contrato Minera Los Pelambres - Transporte Concentrado',
    descripcion: 'Facturación quincenal período 01-15 Agosto 2026',
    monto: 43800000,
    estado_pago: 'Pagado'
  },
  {
    id: 'rf-09',
    fecha: '2026-08-28',
    tipo: 'Costo/Egreso',
    categoria: 'Neumáticos',
    contrato: 'Salfa Repuestos',
    descripcion: 'Renovación juego de 12 neumáticos Michelin faena',
    monto: 5040000,
    estado_pago: 'Pagado'
  },
  {
    id: 'rf-10',
    fecha: '2026-09-05',
    tipo: 'Ingreso',
    categoria: 'Transporte de Carga Minera',
    contrato: 'Contrato Codelco División Andina - Transporte Insumos',
    descripcion: 'Facturación mensual Agosto 2026',
    monto: 54100000,
    estado_pago: 'Pagado'
  },
  {
    id: 'rf-11',
    fecha: '2026-09-10',
    tipo: 'Costo/Egreso',
    categoria: 'Combustible',
    contrato: 'Copec Flotas',
    descripcion: 'Carga combustible primera decena Septiembre 2026',
    monto: 7450000,
    estado_pago: 'Pendiente'
  },
  {
    id: 'rf-12',
    fecha: '2026-09-12',
    tipo: 'Ingreso',
    categoria: 'Transporte de Carga Minera',
    contrato: 'Contrato Minera Los Pelambres - Transporte Concentrado',
    descripcion: 'Facturación proyectada primera quincena Septiembre 2026',
    monto: 45000000,
    estado_pago: 'Pendiente'
  }
];

export const mockSolicitudesCompra = [
  {
    id: 'SC-000001',
    codigo_solicitud: 'SC-000001',
    solicitante: 'Carlos Venegas Morales',
    departamento: 'Mantenimiento Mecánico',
    fecha: '2026-07-05',
    prioridad: 'Alta',
    motivo: 'Filtros y lubricantes para mantenimiento 500h de tractocamiones Volvo',
    estado: 'Aprobada',
    items: [
      { id: 1, descripcion: 'Filtro Aceite Motor D13', cantidad: 6, precioUnitario: 45000, centroCosto: 'Taller Los Andes' },
      { id: 2, descripcion: 'Aceite 15W40 Rimula R4X Balde 20L', cantidad: 8, precioUnitario: 89000, centroCosto: 'Taller Los Andes' }
    ]
  },
  {
    id: 'SC-000002',
    codigo_solicitud: 'SC-000002',
    solicitante: 'Patricia Vergara Riquelme',
    departamento: 'Seguridad y Salud Ocupacional',
    fecha: '2026-07-18',
    prioridad: 'Media',
    motivo: 'Reposición de EPP de alta montaña y respiradores de doble vía',
    estado: 'Aprobada',
    items: [
      { id: 1, descripcion: 'Respiradores Medio Rostro Silicona con Filtro P100', cantidad: 30, precioUnitario: 18500, centroCosto: 'SSO Faena' },
      { id: 2, descripcion: 'Chalecos Geólogo Alta Visibilidad Norma MOP', cantidad: 25, precioUnitario: 14000, centroCosto: 'SSO Faena' }
    ]
  },
  {
    id: 'SC-000003',
    codigo_solicitud: 'SC-000003',
    solicitante: 'Jorge Lagos Cárdenas',
    departamento: 'Mantenimiento Mecánico',
    fecha: '2026-08-08',
    prioridad: 'Urgente',
    motivo: 'Repuesto crítico: Pulmón de freno y tambores para tolva PRTZ-33',
    estado: 'Aprobada',
    items: [
      { id: 1, descripcion: 'Pulmón de Freno Tipo 30/30 Sellado', cantidad: 4, precioUnitario: 75000, centroCosto: 'Taller Fosa' },
      { id: 2, descripcion: 'Tambor de Freno Trasero 10 Pernos', cantidad: 2, precioUnitario: 165000, centroCosto: 'Taller Fosa' }
    ]
  },
  {
    id: 'SC-000004',
    codigo_solicitud: 'SC-000004',
    solicitante: 'Héctor Muñoz Espinoza',
    departamento: 'Bodega y Logística',
    fecha: '2026-08-24',
    prioridad: 'Media',
    motivo: 'Reabastecimiento de insumos de amarre y fajas de carga certificadas',
    estado: 'Aprobada',
    items: [
      { id: 1, descripcion: 'Fajas de Amarre con Ratchet 4" x 9m (5000kg)', cantidad: 12, precioUnitario: 32000, centroCosto: 'Bodega Central' },
      { id: 2, descripcion: 'Eslingas Planas Ojo-Ojo 2 Capas 3m', cantidad: 8, precioUnitario: 28000, centroCosto: 'Bodega Central' }
    ]
  },
  {
    id: 'SC-000005',
    codigo_solicitud: 'SC-000005',
    solicitante: 'Carlos Venegas Morales',
    departamento: 'Mantenimiento Mecánico',
    fecha: '2026-09-06',
    prioridad: 'Alta',
    motivo: 'Juego de neumáticos direccionales 295/80R22.5 para camión KHLP-90',
    estado: 'En Revisión',
    items: [
      { id: 1, descripcion: 'Neumático Michelin X Multiway 3D XZE 295/80R22.5', cantidad: 2, precioUnitario: 420000, centroCosto: 'Taller Los Andes' }
    ]
  },
  {
    id: 'SC-000006',
    codigo_solicitud: 'SC-000006',
    solicitante: 'Rodrigo Castillo Fuentes',
    departamento: 'Operaciones Transporte',
    fecha: '2026-09-11',
    prioridad: 'Baja',
    motivo: 'Kit de cadenas para nieve y tensores para temporada invernal tardía',
    estado: 'Pendiente',
    items: [
      { id: 1, descripcion: 'Cadenas Romboidales Reforzadas 295/80 R22.5', cantidad: 4, precioUnitario: 95000, centroCosto: 'Flota Troncal' }
    ]
  }
];

export const mockHistorialOC = [
  {
    id: 'oc-01',
    folio: 'OC-2026-1001',
    fecha: '08/07/2026 11:30',
    proveedor: 'Salfa Repuestos',
    monto: 982000,
    estado: 'RECIBIDA',
    resumen: 'Filtros y aceites mantenimiento 500h flota Volvo',
    lineas: [{ id: 1, repuesto: 'Filtro Aceite D13', descripcion: 'Filtro motor', centroCosto: 'Taller', cantidad: 6, precioUnitario: 45000 }]
  },
  {
    id: 'oc-02',
    folio: 'OC-2026-1002',
    fecha: '20/07/2026 15:45',
    proveedor: '3M Chile S.A.',
    monto: 905000,
    estado: 'RECIBIDA',
    resumen: 'EPP certificado alta montaña y respiradores sílice',
    lineas: [{ id: 1, repuesto: 'Respirador P100', descripcion: 'Respirador silicona', centroCosto: 'SSO', cantidad: 30, precioUnitario: 18500 }]
  },
  {
    id: 'oc-03',
    folio: 'OC-2026-1003',
    fecha: '10/08/2026 09:20',
    proveedor: 'Kaufmann Mercedes-Benz',
    monto: 630000,
    estado: 'RECIBIDA',
    resumen: 'Pulmones de freno y tambores tolva Scania PRTZ-33',
    lineas: [{ id: 1, repuesto: 'Pulmón de Freno 30/30', descripcion: 'Pulmón sellado', centroCosto: 'Taller', cantidad: 4, precioUnitario: 75000 }]
  },
  {
    id: 'oc-04',
    folio: 'OC-2026-1004',
    fecha: '26/08/2026 14:10',
    proveedor: 'Ferretería Industrial Berschand',
    monto: 608000,
    estado: 'RECIBIDA',
    resumen: 'Insumos de amarre de carga pesada y eslingas',
    lineas: [{ id: 1, repuesto: 'Fajas Ratchet 4"x9m', descripcion: 'Fajas 5000kg', centroCosto: 'Bodega', cantidad: 12, precioUnitario: 32000 }]
  },
  {
    id: 'oc-05',
    folio: 'OC-2026-1005',
    fecha: '08/09/2026 16:30',
    proveedor: 'Salfa Repuestos',
    monto: 840000,
    estado: 'PENDIENTE',
    resumen: 'Neumáticos Michelin direccionales 295/80R22.5',
    lineas: [{ id: 1, repuesto: 'Neumático Michelin 295/80', descripcion: 'Neumático tracción', centroCosto: 'Taller', cantidad: 2, precioUnitario: 420000 }]
  },
  {
    id: 'oc-06',
    folio: 'OC-2026-1006',
    fecha: '11/09/2026 10:00',
    proveedor: 'Finning Chile S.A.',
    monto: 380000,
    estado: 'PENDIENTE',
    resumen: 'Cadenas para nieve romboidales faena alta cordillera',
    lineas: [{ id: 1, repuesto: 'Cadena Nieve Romboidal', descripcion: 'Cadenas 295/80', centroCosto: 'Flota', cantidad: 4, precioUnitario: 95000 }]
  }
];

export const mockFacturasCompras = [
  {
    id: 'F-88421',
    emisor: 'Salfa Repuestos S.A.',
    rut: '96.543.210-K',
    fecha: '2026-07-12',
    monto: 982000,
    estado: 'APROBADA' as const,
    oc: 'OC-2026-1001'
  },
  {
    id: 'F-44120',
    emisor: '3M Chile S.A.',
    rut: '76.123.456-7',
    fecha: '2026-07-25',
    monto: 905000,
    estado: 'APROBADA' as const,
    oc: 'OC-2026-1002'
  },
  {
    id: 'F-90214',
    emisor: 'Kaufmann Mercedes-Benz',
    rut: '81.234.567-8',
    fecha: '2026-08-14',
    monto: 630000,
    estado: 'APROBADA' as const,
    oc: 'OC-2026-1003'
  },
  {
    id: 'F-12055',
    emisor: 'Ferretería Industrial Berschand',
    rut: '78.901.234-5',
    fecha: '2026-08-29',
    monto: 608000,
    estado: 'APROBADA' as const,
    oc: 'OC-2026-1004'
  },
  {
    id: 'F-88910',
    emisor: 'Salfa Repuestos S.A.',
    rut: '96.543.210-K',
    fecha: '2026-09-09',
    monto: 840000,
    estado: 'PENDIENTE' as const,
    oc: 'OC-2026-1005'
  }
];

export const mockCotizacionesCompras = [
  {
    id: 'COT-2026-041',
    folio: 'COT-2026-041',
    proveedor: 'Salfa Repuestos S.A.',
    rut: '96.543.210-K',
    fecha: '2026-07-06',
    fechaVencimiento: '2026-08-06',
    monto: 982000,
    moneda: 'CLP',
    estado: 'APROBADA' as const,
    articulos: 2,
    condicionPago: '30 días',
    observaciones: 'Precios preferenciales flota minera Imperia'
  },
  {
    id: 'COT-2026-052',
    folio: 'COT-2026-052',
    proveedor: '3M Chile S.A.',
    rut: '76.123.456-7',
    fecha: '2026-07-19',
    fechaVencimiento: '2026-08-19',
    monto: 905000,
    moneda: 'CLP',
    estado: 'APROBADA' as const,
    articulos: 2,
    condicionPago: '30 días',
    observaciones: 'Descuento por volumen en respiradores P100'
  },
  {
    id: 'COT-2026-068',
    folio: 'COT-2026-068',
    proveedor: 'Kaufmann Mercedes-Benz',
    rut: '81.234.567-8',
    fecha: '2026-08-09',
    fechaVencimiento: '2026-09-09',
    monto: 630000,
    moneda: 'CLP',
    estado: 'APROBADA' as const,
    articulos: 2,
    condicionPago: '45 días',
    observaciones: 'Repuestos originales con garantía de fábrica'
  },
  {
    id: 'COT-2026-074',
    folio: 'COT-2026-074',
    proveedor: 'Finning Chile S.A.',
    rut: '91.524.000-8',
    fecha: '2026-09-10',
    fechaVencimiento: '2026-10-10',
    monto: 380000,
    moneda: 'CLP',
    estado: 'EVALUACION' as const,
    articulos: 1,
    condicionPago: '30 días',
    observaciones: 'Stock disponible en sucursal Los Andes'
  }
];

export const mockContratosCompras = [
  {
    id: 'CTR-001',
    folio: 'CTR-2026-001',
    proveedor: 'Copec Combustibles S.A.',
    rut: '99.520.000-7',
    fechaInicio: '2026-01-01',
    fechaTermino: '2026-12-31',
    tipo: 'Suministro Diésel y Lubricantes',
    estado: 'VIGENTE',
    montoTotal: 150000000,
    responsable: 'Carlos Venegas',
    condicionPago: '15 días'
  },
  {
    id: 'CTR-002',
    folio: 'CTR-2026-002',
    proveedor: 'Salfa Repuestos S.A.',
    rut: '96.543.210-K',
    fechaInicio: '2026-03-01',
    fechaTermino: '2027-02-28',
    tipo: 'Repuestos y Filtros Flota Pesada',
    estado: 'VIGENTE',
    montoTotal: 45000000,
    responsable: 'Jorge Lagos',
    condicionPago: '30 días'
  },
  {
    id: 'CTR-003',
    folio: 'CTR-2026-003',
    proveedor: 'Mutual de Seguridad CChC',
    rut: '70.015.900-5',
    fechaInicio: '2026-01-01',
    fechaTermino: '2026-12-31',
    tipo: 'Capacitación y Exámenes Ocupacionales',
    estado: 'VIGENTE',
    montoTotal: 18000000,
    responsable: 'Patricia Vergara',
    condicionPago: '30 días'
  }
];

export const mockBodegasLogistica = [
  {
    id: 1,
    nombre: 'Bodega Central Los Andes',
    tipo: 'Principal',
    identificador: 101,
    proveedor: 'Imperia SpA',
    responsable: 'Héctor Muñoz Espinoza',
    ubicacion: 'Calle Larga Km 4, Los Andes',
    estado: 'Activo'
  },
  {
    id: 2,
    nombre: 'Bodega Avanzada Faena Cordillera',
    tipo: 'Faena',
    identificador: 102,
    proveedor: 'Imperia SpA',
    responsable: 'Carlos Venegas Morales',
    ubicacion: 'Faena Minera Sector Rajo',
    estado: 'Activo'
  },
  {
    id: 3,
    nombre: 'Bodega de Sustancias Peligrosas y Lubricantes',
    tipo: 'Químicos',
    identificador: 103,
    proveedor: 'Copec / Shell',
    responsable: 'Patricia Vergara Riquelme',
    ubicacion: 'Patio Taller Los Andes',
    estado: 'Activo'
  }
];

export const mockAuditoriasLogistica = [
  {
    id: 101,
    bodega: { nombre: 'Bodega Central Los Andes' },
    responsable: 'Héctor Muñoz Espinoza',
    fecha_inicio: '15/07/2026 09:00',
    fecha_termino: '15/07/2026 17:30',
    estado: 'FINALIZADA' as const
  },
  {
    id: 102,
    bodega: { nombre: 'Bodega Avanzada Faena Cordillera' },
    responsable: 'Carlos Venegas Morales',
    fecha_inicio: '12/08/2026 08:30',
    fecha_termino: '12/08/2026 14:00',
    estado: 'FINALIZADA' as const
  },
  {
    id: 103,
    bodega: { nombre: 'Bodega de Sustancias Peligrosas' },
    responsable: 'Patricia Vergara Riquelme',
    fecha_inicio: '04/09/2026 10:00',
    fecha_termino: '04/09/2026 16:00',
    estado: 'FINALIZADA' as const
  },
  {
    id: 104,
    bodega: { nombre: 'Bodega Central Los Andes' },
    responsable: 'Héctor Muñoz Espinoza',
    fecha_inicio: '11/09/2026 15:00',
    fecha_termino: null,
    estado: 'CAPTURANDO' as const
  }
];

export const mockDocumentosBiblioteca = [
  {
    id: 'doc-01',
    titulo: 'Manual de Operación y Mantenimiento Scania Serie R (R500)',
    descripcion: 'Pautas de servicio, intervalos de cambio de aceite, diagramas neumáticos y códigos de falla.',
    archivo_url: '#',
    tipo_documento: 'Manual de Taller',
    marca: 'Scania',
    modelo: 'R500 6x4',
    anio: 2023,
    categoria: 'Mantenimiento',
    etiquetas: ['Motor', 'Transmisión', 'Frenos', 'Pautas'],
    created_at: '2026-07-02T10:00:00Z',
    visitas: 142
  },
  {
    id: 'doc-02',
    titulo: 'Pauta de Mantención Preventiva 10.000 km Volvo FH16',
    descripcion: 'Checklist oficial de inspección de suspensión neumática, sensores ABS y turboalimentador.',
    archivo_url: '#',
    tipo_documento: 'Pauta Mantenimiento',
    marca: 'Volvo',
    modelo: 'FH16 750',
    anio: 2024,
    categoria: 'Mantenimiento',
    etiquetas: ['Checklist', 'Suspensión', 'Filtros'],
    created_at: '2026-07-15T12:30:00Z',
    visitas: 98
  },
  {
    id: 'doc-03',
    titulo: 'Diagrama Eléctrico y Módulos SAM Mercedes-Benz Actros',
    descripcion: 'Esquema de fusibles, cableado CAN Bus y calibración de tacógrafo digital.',
    archivo_url: '#',
    tipo_documento: 'Diagrama Técnico',
    marca: 'Mercedes-Benz',
    modelo: 'Actros 2645',
    anio: 2022,
    categoria: 'Electricidad',
    etiquetas: ['CAN Bus', 'Fusibles', 'Tacógrafo'],
    created_at: '2026-08-04T09:15:00Z',
    visitas: 76
  },
  {
    id: 'doc-04',
    titulo: 'Procedimiento Seguro de Operación de Camiones Tolva en Rajo (DS 132)',
    descripcion: 'Protocolo de tránsito en rampas mineras, estacionamiento en pendiente y zonas de volteo.',
    archivo_url: '#',
    tipo_documento: 'Procedimiento SSO',
    marca: 'General',
    modelo: 'Tolvas y Aljibes',
    anio: 2026,
    categoria: 'Seguridad',
    etiquetas: ['SERNAGEOMIN', 'Rajo', 'DS 132', 'Pendiente'],
    created_at: '2026-08-20T16:00:00Z',
    visitas: 215
  },
  {
    id: 'doc-05',
    titulo: 'Catálogo de Repuestos y Filtros Caterpillar Heavy Duty',
    descripcion: 'Despiece de motores 3406/C13 y tablas de equivalencias de filtros Donaldson y Baldwin.',
    archivo_url: '#',
    tipo_documento: 'Catálogo Repuestos',
    marca: 'Caterpillar',
    modelo: 'Motores C13/C15',
    anio: 2025,
    categoria: 'Repuestos',
    etiquetas: ['Filtros', 'Equivalencias', 'Donaldson'],
    created_at: '2026-09-03T11:45:00Z',
    visitas: 89
  }
];

export const mockTicketsSoporte = [
  {
    id: 'TCK-2026-081',
    title: 'Error al sincronizar odómetro satelital camión KHLP-90',
    description: 'El kilometraje reportado por GPS difería en 350 km respecto al odómetro de tablero Scania.',
    empresa: 'Imperia',
    priority: 'MEDIA',
    category: 'PLATAFORMA GPS',
    status: 'RESUELTO',
    fecha_creacion: '2026-07-14 11:20:00',
    usuario: 'Rodrigo Castillo'
  },
  {
    id: 'TCK-2026-094',
    title: 'Habilitación de usuario para nuevo prevencionista SSO',
    description: 'Solicitud de acceso con rol Prevención de Riesgos para Patricia Vergara con permisos de carga.',
    empresa: 'Imperia',
    priority: 'ALTA',
    category: 'ACCESOS',
    status: 'RESUELTO',
    fecha_creacion: '2026-08-02 09:15:00',
    usuario: 'Administrador'
  },
  {
    id: 'TCK-2026-108',
    title: 'Exportación de planilla de consumo de diésel por centro de costo',
    description: 'El reporte en Excel requería incluir columna de RUT de conductor y placa patente.',
    empresa: 'Minera Los Pelambres',
    priority: 'BAJA',
    category: 'REPORTES',
    status: 'RESUELTO',
    fecha_creacion: '2026-08-25 16:40:00',
    usuario: 'Héctor Muñoz'
  },
  {
    id: 'TCK-2026-119',
    title: 'Actualización de pautas de mantenimiento Scania R500',
    description: 'Incorporar revisión de retardador hidráulico en pauta de los 20.000 km.',
    empresa: 'Codelco Andina',
    priority: 'MEDIA',
    category: 'TALLER',
    status: 'EN PROCESO',
    fecha_creacion: '2026-09-08 14:10:00',
    usuario: 'Jorge Lagos'
  },
  {
    id: 'TCK-2026-126',
    title: 'Creación de geocerca de seguridad en cruce Faena Cordillera',
    description: 'Añadir alerta automática por exceso de 40 km/h al aproximarse a garita de control.',
    empresa: 'Imperia',
    priority: 'ALTA',
    category: 'GPS Y RUTAS',
    status: 'ABIERTO',
    fecha_creacion: '2026-09-11 15:30:00',
    usuario: 'Patricia Vergara'
  }
];

export const mockLogActividadCentral = [
  {
    id: 'log-01',
    company_name: 'Imperia SpA',
    user_name: 'Carlos Venegas Morales',
    action: 'Creó Orden de Trabajo',
    module: 'Taller y Mantenimiento',
    details: 'OT-2026-088 Preventiva 500h camión Volvo BRTH-44',
    created_at: '2026-09-12T08:15:00Z'
  },
  {
    id: 'log-02',
    company_name: 'Imperia SpA',
    user_name: 'Patricia Vergara Riquelme',
    action: 'Registró Inspección SSO',
    module: 'Seguridad Ocupacional',
    details: 'Inspección INSP-086 de Taller y Orden y Aseo (5S)',
    created_at: '2026-09-11T16:30:00Z'
  },
  {
    id: 'log-03',
    company_name: 'Imperia SpA',
    user_name: 'Rodrigo Castillo Fuentes',
    action: 'Actualizó Odómetro',
    module: 'Flota y Equipos',
    details: 'Camión Scania KHLP-90 registrado con 148.520 km',
    created_at: '2026-09-11T14:10:00Z'
  },
  {
    id: 'log-04',
    company_name: 'Imperia SpA',
    user_name: 'Jorge Lagos Cárdenas',
    action: 'Aprobó Solicitud de Compra',
    module: 'Adquisiciones',
    details: 'SC-000003 Repuestos críticos de freno para tolva PRTZ-33',
    created_at: '2026-09-10T11:45:00Z'
  },
  {
    id: 'log-05',
    company_name: 'Imperia SpA',
    user_name: 'Héctor Muñoz Espinoza',
    action: 'Recepcionó Pedido',
    module: 'Bodega y Logística',
    details: 'Recepción conforme OC-2026-1004 en Bodega Central Los Andes',
    created_at: '2026-09-09T09:20:00Z'
  }
];

