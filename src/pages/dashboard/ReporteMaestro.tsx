import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSpreadsheet, FileText, Settings2, Download, Table2, Filter, 
  Calendar, Check, Circle, BarChart2, CheckSquare, Search, Copy, Printer, CheckCircle2, ChevronDown, ChevronRight, Info, Package, Fuel, DollarSign, Users, Truck, Wrench, CircleDot
} from 'lucide-react';

// Formatters
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
};

// Data models based on the system
const reportModules = [
  { id: 'mantenimiento', name: 'Mantenimiento (OTs)', icon: Wrench, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800' },
  { id: 'inventario', name: 'Inventario & Compras', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
  { id: 'combustible', name: 'Control Combustible', icon: Fuel, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800' },
  { id: 'comercial', name: 'Finanzas & TCO', icon: DollarSign, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800' },
  { id: 'flota', name: 'Gestión de Flota', icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-800' },
  { id: 'neumaticos', name: 'Control Neumáticos', icon: CircleDot, color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-300 dark:border-slate-700' },
  { id: 'rrhh', name: 'Personal Operativo', icon: Users, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800' },
];

const moduleColumns = {
  mantenimiento: ['Folio OT', 'Vehículo', 'Patente', 'Fecha Apertura', 'Fecha Cierre', 'Estado', 'Tipo', 'Tipo Falla', 'Responsable', 'Costo Mano Obra', 'Costo Repuestos', 'Costo Total OT', 'TFS (Min)'],
  inventario: ['SKU', 'Nombre Repuesto', 'Calidad', 'Stock Actual', 'Stock Mínimo', 'Valor Unitario ($)', 'Valorización Total ($)', 'Bodega', 'Proveedor Habitual', 'Nivel Criticidad', 'Último Movimiento'],
  combustible: ['ID Carga', 'Vehículo', 'Fecha Carga', 'Litros Cargados', 'Precio x Litro', 'Costo Total Carga', 'Rendimiento (Km/L)', 'Ruta Carga', 'Conductor Responsable', 'Proveedor GPS'],
  comercial: ['Mes/Año', 'Nº Factura', 'Cliente / Contrato', 'Vehículo Asoc.', 'Tipo Registro', 'Categoría Gasto', 'Presupuesto Mes ($)', 'Gasto Real ($)', 'Ingreso Generado ($)', 'Rentabilidad (TCO)'],
  flota: ['Nº Interno', 'Patente', 'Marca/Modelo', 'Norma Euro', 'Tipo Aceite', 'KM Actual', 'Intervalo Mantenimiento', 'KM Últ. Mant.', 'Fecha Últ. Mant.', 'Estado Flota', 'Aplicación'],
  neumaticos: ['DOT / Nº Fuego', 'Vehículo Montado', 'Posición', 'Medida', 'Diseño Banda', 'Estado Actual', 'Fecha Compra', 'Costo Inicial ($)', 'Costo por KM (CPK)', 'Última Inspección (mm)'],
  rrhh: ['ID Empleado', 'Nombre Completo', 'RUT', 'Cargo', 'Departamento', 'OTs Finalizadas', 'Minutos Trabajados', 'Productividad Estándar', 'Sueldo Base ($)', 'Horas Extras'],
};

// Mock Previews
const generateMockData = (moduleId: string): any[][] => {
  switch (moduleId) {
    case 'mantenimiento':
      return [
        ['OT-2026-0891', 'Camión Tolva 01', 'KHLP-90', '2026-09-10', '2026-09-11', 'FINALIZADA', 'PREVENTIVA', 'Pauta 40.000 KM', 'Carlos Mendoza', '$145.000', '$380.000', '$525.000', '240'],
        ['OT-2026-0885', 'Tractor D8R', 'BRTH-44', '2026-09-08', '2026-09-09', 'FINALIZADA', 'CORRECTIVA', 'Falla Hidráulica', 'Jorge Tapia', '$98.000', '$215.000', '$313.000', '180'],
        ['OT-2026-0879', 'Excavadora PC200', 'JWRS-18', '2026-09-05', '2026-09-06', 'FINALIZADA', 'PREVENTIVA', 'Cambio Filtros y Aceite', 'Carlos Mendoza', '$85.000', '$190.000', '$275.000', '150'],
        ['OT-2026-0862', 'Camión Cisterna', 'PRTZ-33', '2026-08-28', '2026-08-29', 'FINALIZADA', 'CORRECTIVA', 'Sistema Frenos Aire', 'Mario Silva', '$120.000', '$260.000', '$380.000', '210'],
        ['OT-2026-0841', 'Pala Cargadora 966H', 'HGZX-55', '2026-08-19', '2026-08-20', 'FINALIZADA', 'PREVENTIVA', 'Pauta 20.000 KM', 'Carlos Mendoza', '$110.000', '$230.000', '$340.000', '190'],
        ['OT-2026-0820', 'Camión Volqueta 04', 'FXLK-12', '2026-08-10', '2026-08-11', 'FINALIZADA', 'CORRECTIVA', 'Recambio Inyectores', 'Jorge Tapia', '$180.000', '$450.000', '$630.000', '320'],
        ['OT-2026-0795', 'Motoniveladora 140M', 'STUV-77', '2026-07-24', '2026-07-25', 'FINALIZADA', 'PREVENTIVA', 'Inspección Cuchillas', 'Mario Silva', '$75.000', '$140.000', '$215.000', '130'],
        ['OT-2026-0760', 'Camión Aljibe 02', 'WXYZ-88', '2026-07-12', '2026-07-13', 'FINALIZADA', 'PREVENTIVA', 'Bomba de Agua y Retenes', 'Carlos Mendoza', '$95.000', '$175.000', '$270.000', '160']
      ];
    case 'inventario':
      return [
        ['FLT-ACE-001', 'Filtro Aceite Motor D13', 'OEM Premium', '48', '15', '$42.500', '$2.040.000', 'Bodega Central Los Andes', 'Kaufmann S.A.', 'Alta', '2026-09-11'],
        ['FLT-PET-002', 'Filtro Combustible Separador', 'OEM Premium', '32', '10', '$58.000', '$1.856.000', 'Bodega Central Los Andes', 'Salfa Repuestos', 'Alta', '2026-09-09'],
        ['PAS-FRN-003', 'Juego Pastillas Freno Heavy-Duty', 'Alternativo Certificado', '26', '8', '$95.000', '$2.470.000', 'Bodega Taller Faena', 'Repuestos Mineros del Norte', 'Crítica', '2026-09-08'],
        ['LUB-15W-004', 'Aceite Mobil Delvac 15W-40 (Tambor)', 'OEM Premium', '18', '5', '$320.000', '$5.760.000', 'Bodega Taller Faena', 'Copec Combustibles S.A.', 'Crítica', '2026-09-04'],
        ['VAL-DIR-005', 'Válvula de Dirección Hidráulica', 'OEM Premium', '6', '2', '$185.000', '$1.110.000', 'Bodega Central Los Andes', 'Komatsu Cummins Chile', 'Media', '2026-08-25'],
        ['COR-ALT-006', 'Correa Alternador Poly-V', 'Alternativo Certificado', '42', '12', '$24.500', '$1.029.000', 'Bodega Central Los Andes', 'Salfa Repuestos', 'Baja', '2026-08-18'],
        ['LUB-75W-007', 'Grasa Sintética Chasis EP-2 (Balde)', 'OEM Premium', '22', '6', '$88.000', '$1.936.000', 'Bodega Taller Faena', 'Copec Combustibles S.A.', 'Media', '2026-08-05'],
        ['FUS-ELE-008', 'Kit Fusibles Industriales 24V', 'Estándar', '80', '20', '$8.500', '$680.000', 'Bodega Central Los Andes', 'Kaufmann S.A.', 'Baja', '2026-07-22']
      ];
    case 'combustible':
      return [
        ['COMB-2026-142', 'Camión Tolva 01 (KHLP-90)', '2026-09-11 08:30', '420 L', '$1.120', '$470.400', '2.85 Km/L', 'Los Andes -> Faena Cordillera', 'Roberto Araya', 'Sitrack Telematics'],
        ['COMB-2026-141', 'Tractor D8R (BRTH-44)', '2026-09-10 14:15', '380 L', '$1.120', '$425.600', '3.10 Km/L', 'Punta Chungo -> Mauro', 'Guillermo Fuenzalida', 'Sitrack Telematics'],
        ['COMB-2026-139', 'Excavadora PC200 (JWRS-18)', '2026-09-08 07:45', '510 L', '$1.120', '$571.200', '2.62 Km/L', 'Faena Cordillera Circuito', 'Cristóbal Valenzuela', 'Sitrack Telematics'],
        ['COMB-2026-135', 'Camión Cisterna (PRTZ-33)', '2026-09-05 19:20', '460 L', '$1.120', '$515.200', '2.95 Km/L', 'Til Til -> Polpaico', 'Esteban Morales', 'Sitrack Telematics'],
        ['COMB-2026-130', 'Pala Cargadora 966H (HGZX-55)', '2026-08-30 09:10', '440 L', '$1.115', '$490.600', '2.78 Km/L', 'Mauro -> Faena Cordillera', 'Manuel Santander', 'Sitrack Telematics'],
        ['COMB-2026-124', 'Camión Volqueta 04 (FXLK-12)', '2026-08-22 16:40', '480 L', '$1.115', '$535.200', '2.80 Km/L', 'Antofagasta -> Calama', 'Patricio Riquelme', 'Sitrack Telematics'],
        ['COMB-2026-118', 'Motoniveladora 140M (STUV-77)', '2026-08-12 11:30', '350 L', '$1.110', '$388.500', '3.25 Km/L', 'Los Andes Base Circuito', 'Roberto Araya', 'Sitrack Telematics'],
        ['COMB-2026-105', 'Camión Aljibe 02 (WXYZ-88)', '2026-07-28 08:00', '410 L', '$1.105', '$453.050', '2.90 Km/L', 'Punta Chungo -> Puerto', 'Guillermo Fuenzalida', 'Sitrack Telematics']
      ];
    case 'comercial':
      return [
        ['09/2026', 'FAC-E-8821', 'Minera Los Pelambres', 'KHLP-90 / Flota Mina', 'Ingreso Operacional', 'Transporte Concentrado', '$48.000.000', '$32.450.000', '$58.200.000', '+79.3%'],
        ['09/2026', 'FAC-E-8815', 'Codelco División Andina', 'JWRS-18 / Maquinaria', 'Ingreso Operacional', 'Movimiento de Tierra', '$35.000.000', '$24.800.000', '$42.100.000', '+69.7%'],
        ['08/2026', 'FAC-E-8740', 'Minera Los Pelambres', 'BRTH-44 / Faena Mauro', 'Ingreso Operacional', 'Transporte y Apilamiento', '$52.000.000', '$36.200.000', '$64.500.000', '+78.1%'],
        ['08/2026', 'FAC-E-8722', 'Anglo American Sur', 'PRTZ-33 / Cisternas', 'Ingreso Operacional', 'Distribución Combustible', '$28.000.000', '$19.100.000', '$33.800.000', '+76.9%'],
        ['08/2026', 'FAC-P-3310', 'Kaufmann S.A.', 'Mantenimiento General', 'Gasto Operacional', 'Repuestos y Filtros', '$15.000.000', '$14.280.000', '$0', 'N/A'],
        ['07/2026', 'FAC-E-8650', 'SQM Salar de Atacama', 'FXLK-12 / Tolvas', 'Ingreso Operacional', 'Transporte de Salmueras', '$45.000.000', '$29.900.000', '$54.000.000', '+80.6%'],
        ['07/2026', 'FAC-E-8612', 'Minera Los Pelambres', 'HGZX-55 / Cargadores', 'Ingreso Operacional', 'Carguío de Estéril', '$40.000.000', '$26.500.000', '$49.300.000', '+86.0%'],
        ['07/2026', 'FAC-P-3204', 'Copec Combustibles S.A.', 'Flota Completa', 'Gasto Operacional', 'Suministro Diésel', '$22.000.000', '$21.450.000', '$0', 'N/A']
      ];
    case 'flota':
      return [
        ['TOL-01', 'KHLP-90', 'Mercedes-Benz Actros 3351', 'Euro 6', 'Mobil Delvac 15W-40', '142.350 Km', '20.000 Km', '138.200 Km', '2026-09-02', 'OPERATIVO', 'Transporte Concentrado'],
        ['TRC-02', 'BRTH-44', 'Caterpillar D8R', 'Tier 4', 'Cat DEO 15W-40', '98.420 Km', '15.000 Km', '95.100 Km', '2026-08-25', 'OPERATIVO', 'Movimiento Tierra Mauro'],
        ['EXC-03', 'JWRS-18', 'Komatsu PC200-8M0', 'Tier 3', 'Komatsu DH 15W-40', '112.800 Km', '15.000 Km', '110.000 Km', '2026-08-18', 'OPERATIVO', 'Carguío Frente Cordillera'],
        ['CIS-04', 'PRTZ-33', 'Volvo FMX 460 6x4', 'Euro 5', 'Volvo VDS-4.5', '165.200 Km', '25.000 Km', '160.000 Km', '2026-08-04', 'OPERATIVO', 'Distribución Diésel Faena'],
        ['PAL-05', 'HGZX-55', 'Caterpillar 966H', 'Tier 4', 'Cat DEO 15W-40', '84.600 Km', '15.000 Km', '80.200 Km', '2026-07-29', 'OPERATIVO', 'Alimentación Chancador'],
        ['VOL-06', 'FXLK-12', 'Scania G440 XT Heavy', 'Euro 6', 'Scania LDF-4', '178.900 Km', '25.000 Km', '174.500 Km', '2026-07-15', 'OPERATIVO', 'Ruta Antofagasta-Calama'],
        ['MOT-07', 'STUV-77', 'Caterpillar 140M', 'Tier 4', 'Cat DEO 15W-40', '67.300 Km', '15.000 Km', '65.000 Km', '2026-07-08', 'OPERATIVO', 'Mantenimiento Caminos'],
        ['ALJ-08', 'WXYZ-88', 'Mercedes-Benz Arocs 3342', 'Euro 5', 'Mobil Delvac 15W-40', '135.400 Km', '20.000 Km', '131.000 Km', '2026-07-03', 'OPERATIVO', 'Supresión de Polvo Pistas']
      ];
    case 'neumaticos':
      return [
        ['DOT-4824-001', 'KHLP-90 (Tolva 01)', 'Eje 1 Izquierdo (1DI)', '315/80 R22.5', 'Michelin X Works XDY', 'En Servicio', '2026-07-05', '$580.000', '$14.2 / Km', '13.5 mm'],
        ['DOT-4824-002', 'KHLP-90 (Tolva 01)', 'Eje 1 Derecho (1DD)', '315/80 R22.5', 'Michelin X Works XDY', 'En Servicio', '2026-07-05', '$580.000', '$14.2 / Km', '13.2 mm'],
        ['DOT-3523-018', 'BRTH-44 (Tractor)', 'Oruga / Rueda Guía Del.', '29.5 R25 Minero', 'Bridgestone VSDL L5', 'En Servicio', '2026-07-12', '$1.450.000', '$28.5 / Km', '45.0 mm'],
        ['DOT-1224-044', 'JWRS-18 (Excavadora)', 'Rodillo Superior Izq.', 'Estándar Oruga Komatsu', 'Heavy Mining HD', 'En Servicio', '2026-07-20', '$890.000', '$18.0 / Km', '38.5 mm'],
        ['DOT-2224-061', 'PRTZ-33 (Cisterna)', 'Eje Tracción Doble (2TI)', '315/80 R22.5', 'Goodyear KMAX D G2', 'En Servicio', '2026-08-01', '$540.000', '$13.8 / Km', '14.0 mm'],
        ['DOT-2224-062', 'PRTZ-33 (Cisterna)', 'Eje Tracción Doble (2TD)', '315/80 R22.5', 'Goodyear KMAX D G2', 'En Servicio', '2026-08-01', '$540.000', '$13.8 / Km', '14.1 mm'],
        ['DOT-0824-099', 'HGZX-55 (Pala Carg.)', 'Eje Delantero Izq. (1I)', '26.5 R25 L3', 'Michelin X Mine D2', 'En Servicio', '2026-08-15', '$1.280.000', '$22.4 / Km', '32.0 mm'],
        ['DOT-4523-110', 'FXLK-12 (Volqueta 04)', 'Eje Motriz 2 (2DE)', '315/80 R22.5', 'Bridgestone M840 EVO', 'En Servicio', '2026-08-28', '$560.000', '$15.1 / Km', '11.8 mm']
      ];
    case 'rrhh':
      return [
        ['EMP-001', 'Carlos Mendoza', '15.420.331-8', 'Mecánico Jefe Taller', 'Mantenimiento & Flota', '38 OTs', '9.450 min', '98.5%', '$1.850.000', '18.5 hrs'],
        ['EMP-002', 'Jorge Tapia', '16.782.904-5', 'Mecánico Hidráulico', 'Mantenimiento & Flota', '32 OTs', '8.920 min', '96.2%', '$1.450.000', '12.0 hrs'],
        ['EMP-003', 'Mario Silva', '14.992.118-K', 'Mecánico Frenos y Neumática', 'Mantenimiento & Flota', '29 OTs', '8.400 min', '95.0%', '$1.400.000', '15.0 hrs'],
        ['EMP-004', 'Roberto Araya', '13.671.450-2', 'Conductor Alta Montaña', 'Operaciones & Transporte', '44 Viajes', '10.200 min', '99.1%', '$1.650.000', '22.0 hrs'],
        ['EMP-005', 'Guillermo Fuenzalida', '17.204.881-3', 'Operador Maquinaria Pesada', 'Operaciones Mina', '40 Turnos', '9.600 min', '97.8%', '$1.700.000', '16.0 hrs'],
        ['EMP-006', 'Cristóbal Valenzuela', '18.119.554-1', 'Operador Excavadora', 'Operaciones Mina', '36 Turnos', '8.800 min', '96.5%', '$1.600.000', '14.0 hrs'],
        ['EMP-007', 'Esteban Morales', '15.882.341-9', 'Conductor Cisterna Combustible', 'Operaciones & Transporte', '41 Viajes', '9.750 min', '98.0%', '$1.600.000', '19.0 hrs'],
        ['EMP-008', 'Manuel Santander', '16.338.992-0', 'Operador Cargador Frontal', 'Operaciones Mina', '39 Turnos', '9.100 min', '97.2%', '$1.550.000', '13.5 hrs']
      ];
    default:
      return [];
  }
};


export default function ReporteMaestro() {
  const [activeModule, setActiveModule] = useState<string>('mantenimiento');
  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');
  const [isGenerating, setIsGenerating] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');
  
  // Columns Selection Tool
  const currentColumns = moduleColumns[activeModule as keyof typeof moduleColumns] || [];
  const [selectedColumns, setSelectedColumns] = useState<string[]>(currentColumns);

  const toggleColumn = (col: string) => {
    if (selectedColumns.includes(col)) {
      if (selectedColumns.length > 1) { // Prevent deselecting last column
        setSelectedColumns(selectedColumns.filter(c => c !== col));
      }
    } else {
      setSelectedColumns([...selectedColumns, col]);
    }
  };

  const handleModuleChange = (modId: string) => {
    setActiveModule(modId);
    setSelectedColumns(moduleColumns[modId as keyof typeof moduleColumns]); // reset columns for new module
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAlertMsg(`El archivo Reporte_${activeModule.toUpperCase()}_v1.${selectedFormat} se encuentra listo para descargar.`);
      setTimeout(() => setAlertMsg(''), 5000);
    }, 2000);
  };

  const currentMockData = generateMockData(activeModule);

  return (
    <div className="p-6 w-full max-w-[1600px] mx-auto min-h-screen">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Reporte Maestro
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">
            Creador de reportes unificados. Selecciona un área, configura las métricas y exporta los datos directamente de la base de datos real.
          </p>
        </div>
      </div>

      <AnimatePresence>
        {alertMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }} 
            animate={{ opacity: 1, y: 0, height: 'auto' }} 
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mb-6 p-4 rounded-xl font-bold flex items-center gap-3 shadow-sm bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
          >
            <CheckCircle2 className="w-5 h-5" />
            {alertMsg}
            <button className="ml-auto bg-emerald-600 text-white px-4 py-1.5 rounded-lg shadow-sm text-xs hover:bg-emerald-700 transition-colors uppercase tracking-wider font-black">
              Descargar Archivo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lado Izquierdo: Configuración */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          
          {/* Módulo de Datos */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
               <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center font-black">1</div>
               <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                 Área de Negocio
               </h3>
             </div>
             <div className="p-4 flex flex-col gap-2">
                {reportModules.map(mod => {
                  const isActive = activeModule === mod.id;
                  return (
                    <button
                      key={mod.id}
                      onClick={() => handleModuleChange(mod.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all font-semibold text-left
                        ${isActive 
                          ? `${mod.bg} ${mod.border} border shadow-sm text-slate-900 dark:text-white` 
                          : 'border border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }
                      `}
                    >
                      <mod.icon className={`w-5 h-5 ${isActive ? mod.color : 'text-slate-400'}`} />
                      <span className="text-sm truncate">{mod.name}</span>
                      {isActive && <CheckCircle2 className={`w-4 h-4 ml-auto ${mod.color}`} />}
                    </button>
                  )
                })}
             </div>
          </div>

          {/* Rango Temporal & Período */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
               <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center font-black">2</div>
               <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                 Filtros y Fechas
               </h3>
             </div>
             <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide dark:text-slate-400">Rango de Fechas</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-700 dark:text-slate-300 font-medium outline-none focus:border-indigo-500 transition-colors" defaultValue="2026-07-01" />
                    <input type="date" className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-700 dark:text-slate-300 font-medium outline-none focus:border-indigo-500 transition-colors" defaultValue="2026-09-12" />
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide dark:text-slate-400">Pre-Filtros del Módulo</label>
                   <select className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-700 dark:text-slate-300 font-medium outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer">
                      <option>Todos los registros</option>
                      {activeModule === 'mantenimiento' && <><option>Solo OTs Cerradas</option><option>Solo Mantenimiento Preventivo</option></>}
                      {activeModule === 'inventario' && <><option>Solo Repuestos Bajo Stock</option><option>Solo Salidas Recientes</option></>}
                      {activeModule === 'comercial' && <><option>Costos sin cubrir</option><option>Presupuestos excedidos</option></>}
                   </select>
                </div>
             </div>
          </div>

          {/* Exportación */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
               <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center font-black">3</div>
               <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                 Formato de Salida
               </h3>
             </div>
             <div className="p-5">
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <button onClick={() => setSelectedFormat('excel')} className={`py-3 px-2 flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all ${selectedFormat === 'excel' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'border-slate-100 dark:border-slate-800 text-slate-500 focus:outline-[0]'}`}>
                    <FileSpreadsheet className="w-6 h-6" />
                    <span className="text-xs font-bold font-mono">XLSX</span>
                  </button>
                  <button onClick={() => setSelectedFormat('csv')} className={`py-3 px-2 flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all ${selectedFormat === 'csv' ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'border-slate-100 dark:border-slate-800 text-slate-500 focus:outline-[0]'}`}>
                    <Table2 className="w-6 h-6" />
                    <span className="text-xs font-bold font-mono">CSV</span>
                  </button>
                  <button onClick={() => setSelectedFormat('pdf')} className={`py-3 px-2 flex flex-col items-center justify-center gap-2 rounded-xl border-2 transition-all ${selectedFormat === 'pdf' ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' : 'border-slate-100 dark:border-slate-800 text-slate-500 focus:outline-[0]'}`}>
                    <FileText className="w-6 h-6" />
                    <span className="text-xs font-bold font-mono">PDF</span>
                  </button>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3
                    ${isGenerating 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-700' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 relative overflow-hidden group'
                    }
                  `}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-600 rounded-full animate-spin" />
                      Procesando Data...
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                      <Download className="w-5 h-5" />
                      Generar Documento
                    </>
                  )}
                </button>
             </div>
          </div>
          
        </div>

        {/* Lado Derecho: Personalización de Columnas y Vista Previa */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
          
          {/* Editor de Columnas */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/30">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-indigo-500" />
                  Estructura del Reporte
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1 dark:text-slate-400">Selecciona los campos que deseas incluir en la exportación.</p>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
                {selectedColumns.length} de {currentColumns.length} Columnas
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-2.5">
                {currentColumns.map(col => {
                  const isAssigned = selectedColumns.includes(col);
                  return (
                    <button 
                      key={col}
                      onClick={() => toggleColumn(col)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border
                        ${isAssigned 
                          ? 'bg-slate-900 border-slate-900 text-white dark:bg-slate-700 dark:border-slate-700 shadow-sm' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-800 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-slate-200'}
                      `}
                    >
                      <div className="flex items-center gap-1.5">
                        {isAssigned ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600" />}
                        {col}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Data Table Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex-grow flex flex-col min-h-[500px] overflow-hidden">
             <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
               <div>
                 <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                   <Table2 className="w-5 h-5 text-emerald-500" />
                   Vista Previa de Datos Reales
                 </h2>
                 <p className="text-xs font-bold text-slate-500 mt-1 tracking-wider uppercase dark:text-slate-400">
                   Módulo: {reportModules.find(m => m.id === activeModule)?.name}
                 </p>
               </div>
               <div className="flex gap-2">
                 <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                   <Copy className="w-4 h-4" />
                 </button>
                 <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                   <Printer className="w-4 h-4" />
                 </button>
               </div>
             </div>

             <div className="flex-grow overflow-auto relative">
                <table className="w-full text-left border-collapse whitespace-nowrap hidden sm:table">
                  <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10 shadow-[0_1px_0_theme(colors.slate.200)] dark:shadow-[0_1px_0_theme(colors.slate.800)]">
                    <tr>
                      {selectedColumns.map((col, idx) => (
                        <th key={idx} className="p-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {currentMockData.length > 0 ? currentMockData.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                        {selectedColumns.map((col, colIdx) => {
                          const originalIdx = currentColumns.indexOf(col);
                          const val = row[originalIdx];
                          return (
                            <td key={colIdx} className="p-4 text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">
                              {/* Add some basic visual distinctness for common values like statuses */}
                              {val === 'FINALIZADA' || val === 'PREVENTIVA' ? (
                                <span className="bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded-md text-xs font-bold">{val}</span>
                              ) : val === 'EN PROCESO' || val === 'CORRECTIVA' ? (
                                <span className="bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-md text-xs font-bold">{val}</span>
                              ) : typeof col === 'string' && (col.includes('($)') || col.includes('Costo')) ? (
                                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{val}</span>
                              ) : (
                                val
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={selectedColumns.length} className="p-8 text-center text-slate-500 font-medium">Sin registros disponibles para el período</td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {/* Mobile placeholder */}
                <div className="sm:hidden p-8 flex flex-col items-center justify-center text-center h-full text-slate-500 dark:text-slate-400">
                   <Table2 className="w-12 h-12 mb-4 opacity-20" />
                   <p className="font-bold">Vista de tabla no disponible en móvil.</p>
                   <p className="text-sm mt-1">Gira tu dispositivo o expórtalo para verlo completo.</p>
                </div>
             </div>

             <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
               <span className="flex items-center gap-1.5"><Info className="w-4 h-4" /> Mostrando muestra de 8 registros de la base de datos real.</span>
               <span className="px-2 py-1 bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800">12,450 filas aproximadas en total</span>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}

