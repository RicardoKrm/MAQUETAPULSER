import React, { useState, memo, useMemo, useEffect } from 'react';
import { 
  DollarSign, Filter, Calendar, FileText, FileSpreadsheet, TrendingDown, TrendingUp, 
  Search, RefreshCw, X, ArrowRight, ChevronRight, BarChart2, AlertTriangle, CheckCircle2,
  Truck, ArrowUpRight, ArrowDownRight, Layers, ArrowLeft, Clock, ShieldAlert,
  Award, Compass, HelpCircle, Activity, Info, ChevronDown, ChevronUp, Cpu, Wrench
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Legend, ComposedChart, Brush,
  ReferenceLine, ReferenceDot
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../../context/AppContext';
import { supabase } from '../../lib/supabase';
import { useCompany } from '../../contexts/CompanyContext';
import { cn } from '../../lib/utils';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
};

const formatCompactNumber = (number: number) => {
  return Intl.NumberFormat('es-CL', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(number);
};

// Función de ordenamiento numérico estricto de menor a mayor por número de unidad / patente
export const parseUnitNumber = (item: any): number => {
  const numInt = item?.numeroInterno ?? item?.numero_interno ?? item?.detalles?.numero_interno;
  if (numInt !== undefined && numInt !== null && String(numInt).trim() !== '') {
    const match = String(numInt).match(/\d+/);
    if (match) {
      const parsed = parseInt(match[0], 10);
      if (!isNaN(parsed)) return parsed;
    }
  }

  const nameStr = String(item?.name || item?.v || item?.displayName || '');
  const hashMatch = nameStr.match(/#(\d+)/);
  if (hashMatch) {
    const parsed = parseInt(hashMatch[1], 10);
    if (!isNaN(parsed)) return parsed;
  }

  const patStr = String(item?.patente || item?.ppu || item?.name || item?.v || '');
  const patMatch = patStr.match(/\d+/);
  if (patMatch) {
    const parsed = parseInt(patMatch[0], 10);
    if (!isNaN(parsed)) return parsed;
  }

  return 999999;
};

export const compareVehiclesNumerically = (a: any, b: any): number => {
  const numA = parseUnitNumber(a);
  const numB = parseUnitNumber(b);

  if (numA !== numB) {
    return numA - numB;
  }

  const strA = String(a?.name || a?.patente || a?.v || a?.ppu || '');
  const strB = String(b?.name || b?.patente || b?.v || b?.ppu || '');
  return strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0]?.payload;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3.5 shadow-2xl z-50 text-xs min-w-[270px]">
        <div className="text-white font-bold text-sm mb-2 border-b border-slate-800 pb-1.5 flex items-center justify-between gap-2">
          <span>{label}</span>
          {dataPoint?.contratoNombre && (
            <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 max-w-[150px] truncate" title={dataPoint.contratoNombre}>
              {dataPoint.contratoNombre}
            </span>
          )}
          {dataPoint?.otsCount !== undefined && dataPoint.otsCount > 0 && (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {dataPoint.otsCount} OT{dataPoint.otsCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Desglose Estratégico de Canales de Ingreso */}
        {dataPoint && (dataPoint.ingresoContrato > 0 || dataPoint.ingresoServicios > 0 || dataPoint.ingresoSpot > 0) && (
          <div className="mb-2 pb-2 border-b border-slate-800/80 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Canales de Ingreso:</span>
            {dataPoint.ingresoContrato > 0 && (
              <div className="flex items-center justify-between text-[11px] text-slate-300 pl-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  <span>Contrato de Clientes:</span>
                </span>
                <span className="font-mono font-bold text-blue-300">{formatCurrency(dataPoint.ingresoContrato)}</span>
              </div>
            )}
            {dataPoint.ingresoServicios > 0 && (
              <div className="flex items-center justify-between text-[11px] text-slate-300 pl-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                  <span>Servicios Programados:</span>
                </span>
                <span className="font-mono font-bold text-indigo-300">{formatCurrency(dataPoint.ingresoServicios)}</span>
              </div>
            )}
            {dataPoint.ingresoSpot > 0 && (
              <div className="flex items-center justify-between text-[11px] text-slate-300 pl-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Servicios SPOT & Rental:</span>
                </span>
                <span className="font-mono font-bold text-amber-300">{formatCurrency(dataPoint.ingresoSpot)}</span>
              </div>
            )}
          </div>
        )}

        {payload.map((entry: any, index: number) => {
          if (entry.value === undefined || entry.value === null) return null;
          const entryKey = entry.dataKey || entry.name || `entry-${index}`;
          const isNegative = entry.value < 0;
          return (
            <div key={`tooltip-${index}-${entryKey}`} className="flex items-center justify-between gap-4 py-0.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-300 font-medium">{entry.name}</span>
              </div>
              <span className="font-mono font-bold" style={{ color: entry.color }}>
                {entry.name.toLowerCase().includes('margen') || entry.name.toLowerCase().includes('ratio')
                  ? `${entry.value}%`
                  : `${isNegative ? '-' : ''}${formatCurrency(Math.abs(entry.value))}`}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

// Tooltip especializado para el Modelo CAUE
const CaueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0]?.payload;
    if (!dataPoint) return null;
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3.5 shadow-2xl z-50 text-xs min-w-[290px]">
        <div className="text-white font-bold text-sm mb-2 border-b border-slate-800 pb-1.5 flex items-center justify-between gap-2">
          <span>{dataPoint.anio} ({dataPoint.km})</span>
          {dataPoint.isOptimal && (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              PUNTO ÓPTIMO (n*)
            </span>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <strong className="text-emerald-400">CAUE (Costo Total Uniforme):</strong>
            </span>
            <span className="font-mono font-black text-emerald-400">{formatCurrency(dataPoint.caue)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span>Costo Capital (Depreciación/WACC):</span>
            </span>
            <span className="font-mono font-bold text-sky-300">{formatCurrency(dataPoint.costoCapital)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>OPEX + Mantención + Downtime:</span>
            </span>
            <span className="font-mono font-bold text-amber-300">{formatCurrency(dataPoint.opexMtto)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Costo Marginal del Período:</span>
            </span>
            <span className="font-mono font-bold text-rose-300">{formatCurrency(dataPoint.costoMarginal)}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Costo Unitario Proyectado:</span>
            <span className="font-mono font-bold text-slate-200">${dataPoint.costoPorKm} / km</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Valor Residual de Rescate S(n):</span>
            <span className="font-mono font-bold text-slate-200">{formatCurrency(dataPoint.valorResidual)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

// Componente interactivo para Rentabilidad (soporta vista por Flota y vista Mensual por Unidad)
const RentabilidadChartInteractive = memo(({ 
  data, 
  showTrendLine,
  isVehicleView = false,
  onSelectVehicle 
}: { 
  data: any[]; 
  showTrendLine: boolean;
  isVehicleView?: boolean;
  onSelectVehicle?: (vehName: string) => void;
}) => {
  const [disabledSeries, setDisabledSeries] = useState<Record<string, boolean>>({});
  
  const handleLegendClick = (dataKey: string) => {
    setDisabledSeries(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  const legendItems = [
    { value: 'Ingresos', id: 'ingresos', color: '#3b82f6', isLine: false },
    { value: 'Costos Fijos', id: 'costoFijo', color: '#0ea5e9', isLine: false },
    { value: 'Costo Variable', id: 'costoVariable', color: '#f59e0b', isLine: false },
    { value: 'Neumáticos', id: 'neumaticos', color: '#8b5cf6', isLine: false },
    { value: 'Mantenimiento Preventivo', id: 'mttoPreventivo', color: '#10b981', isLine: false },
    { value: 'Mantenimiento Correctivo', id: 'mttoCorrectivo', color: '#ef4444', isLine: false },
    ...(showTrendLine ? [{ value: 'Margen Neto (Utilidad)', id: 'margenNeto', color: '#059669', isLine: true }] : [])
  ];

  const count = data ? data.length : 0;
  const needsHorizontalScroll = !isVehicleView && count > 12;
  const chartMinWidth = needsHorizontalScroll ? `${Math.max(count * 68, 900)}px` : '100%';

  return (
    <div className="w-full flex flex-col">
      {needsHorizontalScroll && (
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 px-1">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Flota extensa ({count} unidades) — Desplaza horizontalmente para explorar cada vehículo
          </span>
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
            Desplazamiento horizontal ⇄
          </span>
        </div>
      )}

      {/* Contenedor del gráfico */}
      <div className="w-full overflow-x-auto pb-3 custom-scrollbar">
        <div style={{ minWidth: chartMinWidth, height: '440px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart 
              data={data} 
              margin={{ top: 15, right: 25, left: 10, bottom: isVehicleView ? 20 : 45 }} 
              barGap={2}
              onClick={(e) => {
                if (!isVehicleView && e && e.activeLabel && onSelectVehicle) {
                  onSelectVehicle(String(e.activeLabel));
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" opacity={0.15} />
              <XAxis 
                dataKey="name" 
                axisLine={{ stroke: '#cbd5e1' }} 
                tickLine={false} 
                interval={0}
                angle={isVehicleView ? 0 : -45}
                textAnchor={isVehicleView ? 'middle' : 'end'}
                height={isVehicleView ? 35 : 75}
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: '700' }} 
                dy={isVehicleView ? 6 : 8} 
                dx={isVehicleView ? 0 : -4}
              />
              <YAxis 
                yAxisId="left"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 11, fontWeight: '600' }} 
                tickFormatter={formatCompactNumber} 
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#10b981', fontSize: 11, fontWeight: '600' }}
                tickFormatter={formatCompactNumber}
                hide={!showTrendLine || Boolean(disabledSeries['margenNeto'])}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
              
              {/* Barra 1: Ingresos Generados */}
              <Bar 
                yAxisId="left"
                dataKey="ingresos" 
                fill="#3b82f6" 
                name="Ingresos" 
                radius={[4, 4, 0, 0]}
                maxBarSize={isVehicleView ? 40 : 45}
                hide={disabledSeries['ingresos']} 
              />

              {/* Barras Apiladas: Desglose Real de Costos Directos */}
              <Bar 
                yAxisId="left"
                dataKey="costoFijo" 
                stackId="costos" 
                fill="#0ea5e9" 
                name="Costos Fijos" 
                maxBarSize={isVehicleView ? 40 : 45}
                hide={disabledSeries['costoFijo']} 
              />
              <Bar 
                yAxisId="left"
                dataKey="costoVariable" 
                stackId="costos" 
                fill="#f59e0b" 
                name="Costo Variable" 
                maxBarSize={isVehicleView ? 40 : 45}
                hide={disabledSeries['costoVariable']} 
              />
              <Bar 
                yAxisId="left"
                dataKey="neumaticos" 
                stackId="costos" 
                fill="#8b5cf6" 
                name="Neumáticos" 
                maxBarSize={isVehicleView ? 40 : 45}
                hide={disabledSeries['neumaticos']} 
              />
              <Bar 
                yAxisId="left"
                dataKey="mttoPreventivo" 
                stackId="costos" 
                fill="#10b981" 
                name="Mantenimiento Preventivo" 
                maxBarSize={isVehicleView ? 40 : 45}
                hide={disabledSeries['mttoPreventivo']} 
              />
              <Bar 
                yAxisId="left"
                dataKey="mttoCorrectivo" 
                stackId="costos" 
                fill="#ef4444" 
                name="Mantenimiento Correctivo" 
                radius={[4, 4, 0, 0]}
                maxBarSize={isVehicleView ? 40 : 45}
                hide={disabledSeries['mttoCorrectivo']} 
              />

              {/* Curva de Rentabilidad Neta */}
              {showTrendLine && (
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="margenNeto" 
                  name="Margen Neto (Utilidad)"
                  stroke="#059669" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                  hide={disabledSeries['margenNeto']}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leyenda interactiva fija abajo */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        {legendItems.map(item => {
          const isDisabled = disabledSeries[item.id];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleLegendClick(item.id)}
              className={cn(
                "flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer py-1 px-2 rounded-md",
                isDisabled 
                  ? "opacity-35 line-through hover:opacity-60 bg-slate-100 dark:bg-slate-800 text-slate-400" 
                  : "opacity-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300"
              )}
              title={isDisabled ? `Hacer clic para mostrar ${item.value}` : `Hacer clic para ocultar ${item.value}`}
            >
              {item.isLine ? (
                <span className="w-3.5 h-0.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
              ) : (
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: item.color }} />
              )}
              <span>{item.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default function PanelTco() {
  const { ordenesTrabajo, vehiculos } = useAppContext();
  const { activeCompanyId } = useCompany();
  const [showFilters, setShowFilters] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // Estados de Filtros Avanzados
  const [filtroPeriodo, setFiltroPeriodo] = useState<'todo' | '30d' | '6m' | 'ytd'>('todo');
  const [filtroTipoMantencion, setFiltroTipoMantencion] = useState<'todas' | 'PREVENTIVA' | 'CORRECTIVA'>('todas');
  const [filtroTipoIngreso, setFiltroTipoIngreso] = useState<'todos' | 'CONTRATO' | 'SERVICIO' | 'SPOT'>('todos');
  const [filtroMarca, setFiltroMarca] = useState('todas');
  const [filtroVehiculoSeleccionado, setFiltroVehiculoSeleccionado] = useState<string>('todos');
  const [busquedaVehiculo, setBusquedaVehiculo] = useState('');
  const [showCurvaRentabilidad, setShowCurvaRentabilidad] = useState(true);

  // Estado para el Modo de Visualización del Eje X en Curva TCO
  const [caueXAxisMode, setCaueXAxisMode] = useState<'anios' | 'km'>('anios');
  const [showCaueSideDrawer, setShowCaueSideDrawer] = useState(false);
  const [selectedCurvaInfo, setSelectedCurvaInfo] = useState<'caue' | 'costoCapital' | 'opexMtto' | 'puntoOptimo' | 'posicionActual' | null>(null);
  const [showOtsTable, setShowOtsTable] = useState(true);

  // Datos de bases de datos
  const [combustibleData, setCombustibleData] = useState<any[]>([]);
  const [contratosData, setContratosData] = useState<any[]>([]);
  const [contratoVehiculoLinks, setContratoVehiculoLinks] = useState<any[]>([]);
  const [serviciosData, setServiciosData] = useState<any[]>([]);
  const [registrosFData, setRegistrosFData] = useState<any[]>([]);

  useEffect(() => {
    if (!activeCompanyId) return;

    const fetchRealData = async () => {
      // 1. Combustible directo sin JOIN ambiguo
      const { data: cData } = await supabase
        .from('registro_combustible')
        .select('vehiculo_id, costo_total, fecha, patente')
        .eq('empresa_id', activeCompanyId);
      if (cData) setCombustibleData(cData);

      // 2. Contratos de Clientes
      const { data: coData } = await supabase
        .from('operacion_contrato')
        .select('id, cliente, cliente_razon_social, valor_total, monto_mensual, activo, fecha_inicio, fecha_termino')
        .eq('empresa_id', activeCompanyId);
      if (coData) setContratosData(coData);

      // 3. Vínculos de Vehículos a Contratos
      const { data: cvData } = await supabase
        .from('operacion_contrato_vehiculo')
        .select('contrato_id, vehiculo_id');
      if (cvData) setContratoVehiculoLinks(cvData);

      // 4. Servicios Programados, Especiales y SPOT / Rental
      const { data: sData } = await supabase
        .from('operacion_servicio')
        .select('id, codigo, contrato_id, tipo_carga, subtipo, origen, destino, ingreso_esperado, costo_estimado, vehiculo_id, estado, created_at, fecha_servicio')
        .eq('empresa_id', activeCompanyId);
      if (sData) setServiciosData(sData);
      
      // 5. Registros Financieros from vehiculo and empresa
      let registrosExt: any[] = [];
      const { data: vehData } = await supabase.from('vehiculo').select('id, detalles').eq('empresa_id', activeCompanyId);
      if (vehData) {
        vehData.forEach(v => {
          if (v.detalles?.registros_financieros && Array.isArray(v.detalles.registros_financieros)) {
            v.detalles.registros_financieros.forEach((rf: any) => {
              if (rf.tipo === 'Gasto') {
                registrosExt.push({ ...rf, vehiculo_id: v.id });
              }
            });
          }
        });
      }
      
      const { data: empData } = await supabase.from('empresa').select('id, detalles').eq('id', activeCompanyId).single();
      if (empData && empData.detalles?.registros_financieros && Array.isArray(empData.detalles.registros_financieros)) {
         empData.detalles.registros_financieros.forEach((rf: any) => {
            if (rf.tipo === 'Gasto') {
               registrosExt.push({ ...rf, empresa_id: empData.id });
            }
         });
      }
      setRegistrosFData(registrosExt);
    };

    fetchRealData();
  }, [activeCompanyId]);

  const simulateFiltering = () => {
    setIsFiltering(true);
    setTimeout(() => setIsFiltering(false), 300);
  };

  // Helper para verificar rango de fechas según período
  const isDateInPeriod = (dateStr: string | null | undefined, period: 'todo' | '30d' | '6m' | 'ytd') => {
    if (period === 'todo' || !dateStr) return true;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return true;
    const now = new Date(); // En el sistema es Nov 2026
    if (period === '30d') {
      const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return d >= cutoff;
    }
    if (period === '6m') {
      const cutoff = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
      return d >= cutoff;
    }
    if (period === 'ytd') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return d >= startOfYear;
    }
    return true;
  };

  // Definición de meses activos según el período seleccionado
  const activeMonthsForPeriod = useMemo(() => {
    const allMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    if (filtroPeriodo === '30d') {
      return ['Oct', 'Nov'];
    }
    if (filtroPeriodo === '6m') {
      return ['Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'];
    }
    if (filtroPeriodo === 'ytd') {
      return ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov'];
    }
    return allMonths;
  }, [filtroPeriodo]);

  // Factor de meses equivalente al período para contratos mensuales
  const factorMesesPeriodo = useMemo(() => {
    if (filtroPeriodo === '30d') return 1;
    if (filtroPeriodo === '6m') return 6;
    if (filtroPeriodo === 'ytd') {
      const currentMonth = new Date().getMonth() + 1; // 11 para nov 2026
      return Math.max(1, currentMonth);
    }
    return 12; // 'todo' -> anualizado a 12 meses
  }, [filtroPeriodo]);

  // Mapeo de meses
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const getMonthStr = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    return monthNames[d.getMonth()];
  };

  // Cálculo TCO y Rentabilidad Dinámica
  const {
    kpis,
    rentabilidadVehiculoCompleta,
    rentabilidadVehiculoFiltrada,
    distribucionCostos,
    evolucionMensual,
    proyeccionPresupuesto,
    vehiculoAuditoria,
    rentabilidadVehiculoMensual,
    otsVehiculoSeleccionado
  } = useMemo(() => {
    let costosTotales = 0;
    let mttoPrev = 0;
    let mttoCorr = 0;

    const vStats: Record<string, {
      prev: number, corr: number, totalCosto: number,
      combustible: number, costoVariable: number,
      costoFijo: number, neumaticos: number, otCount: number, corrCount: number
    }> = {};

    vehiculos.forEach(v => {
      vStats[v.id] = { 
        prev: 0, corr: 0, totalCosto: 0, 
        combustible: 0, costoVariable: 0, costoFijo: 0, 
        neumaticos: 0, otCount: 0, corrCount: 0 
      };
    });

    // 1. Procesar Órdenes de Trabajo según período y tipo de mantención
    ordenesTrabajo.forEach(ot => {
      const fechaOt = ot.fechaCreacion || ot.created_at || ot.inicio_proceso || ot.fecha_ot;
      if (!isDateInPeriod(fechaOt, filtroPeriodo)) return;

      const tipoRaw = (ot.tipo || '').toUpperCase();
      const isPreventiva = tipoRaw.includes('PREVENTIV');
      const isCorrectiva = tipoRaw.includes('CORRECTIV') || (!isPreventiva);

      if (filtroTipoMantencion === 'PREVENTIVA' && !isPreventiva) return;
      if (filtroTipoMantencion === 'CORRECTIVA' && !isCorrectiva) return;

      const costo = (ot.costoManoObraTareas || 0) + (ot.costoInsumos || 0) + (ot.costoManoObraHH || 0);
      costosTotales += costo;
      
      if (isPreventiva) {
        mttoPrev += costo;
      } else {
        mttoCorr += costo;
      }

      const vid = ot.vehiculoId || ot.vehiculo_id;
      if (vid && vStats[vid]) {
        vStats[vid].totalCosto += costo;
        vStats[vid].otCount += 1;
        if (isPreventiva) {
          vStats[vid].prev += costo;
        } else {
          vStats[vid].corr += costo;
          vStats[vid].corrCount += 1;
        }
      }
    });

    // 2. Combustible según período
    let totalCombustible = 0;
    combustibleData.forEach(c => {
      if (!isDateInPeriod(c.fecha, filtroPeriodo)) return;
      const costo = Number(c.costo_total || 0);
      totalCombustible += costo;
      costosTotales += costo;
      const targetVid = c.vehiculo_id || (vehiculos.find(v => v.patente === c.patente)?.id);
      if (targetVid && vStats[targetVid]) {
        vStats[targetVid].combustible += costo;
        vStats[targetVid].costoVariable += costo;
        vStats[targetVid].totalCosto += costo;
      }
    });

    // 3. Registros Financieros (Costos Fijos vs Variables) según período
    let totalCostoFijo = 0;
    let totalCostoVariableAdicional = 0;
    let totalNeumaticos = 0;

    registrosFData.forEach(rf => {
      const fechaRf = rf.fecha || rf.created_at;
      if (!isDateInPeriod(fechaRf, filtroPeriodo)) return;

      const monto = Number(rf.monto || 0);
      costosTotales += monto;
      const cat = (rf.categoria || '').toLowerCase();
      
      const applyToVid = (vid: string, field: string) => {
        if (vid && vStats[vid]) {
          (vStats[vid] as any)[field] += monto;
          vStats[vid].totalCosto += monto;
        }
      };

      if (cat.includes('peaje') || cat.includes('estacionamiento') || cat.includes('viático') || cat.includes('colacion')) {
        totalCostoVariableAdicional += monto;
        applyToVid(rf.vehiculo_id, 'costoVariable');
      } else if (cat.includes('sueldo') || cat.includes('salario') || cat.includes('honorario') || cat.includes('seguro') || cat.includes('leasing')) {
        totalCostoFijo += monto;
        applyToVid(rf.vehiculo_id, 'costoFijo');
      } else if (cat.includes('neumático') || cat.includes('neumatico') || cat.includes('llanta')) {
        totalNeumaticos += monto;
        applyToVid(rf.vehiculo_id, 'neumaticos');
      } else {
        totalCostoVariableAdicional += monto;
        applyToVid(rf.vehiculo_id, 'costoVariable');
      }
    });

    // 4. Asignación de Costos Operacionales Estándar Chilenos para Flota Activa
    // Si la empresa o vehículo no tiene vouchers manuales cargados en la BD, se asignan los estándares operativos
    // de faena minera y transporte de Chile (Costos Fijos: conductor/seguro; Neumáticos; Peajes/Viáticos)
    vehiculos.forEach(v => {
      const s = vStats[v.id];
      if (!s) return;
      if (s.costoFijo === 0) {
        // Conductor y seguros obligatorios prorrateados
        const fijoBase = Math.round(920000 * factorMesesPeriodo);
        s.costoFijo = fijoBase;
        s.totalCosto += fijoBase;
        costosTotales += fijoBase;
      }
      if (s.neumaticos === 0) {
        // Desgaste de neumáticos operacional estándar
        const neumBase = Math.round(220000 * factorMesesPeriodo);
        s.neumaticos = neumBase;
        s.totalCosto += neumBase;
        costosTotales += neumBase;
      }
      // Variables operacionales (peajes autopistas y viáticos)
      const varAdic = Math.round(180000 * factorMesesPeriodo);
      s.costoVariable += varAdic;
      s.totalCosto += varAdic;
      costosTotales += varAdic;
    });

    // 5. Mapeo de Contratos y prorrateo ajustado al factor temporal
    const contractVehicleMap: Record<string, string[]> = {};
    contratoVehiculoLinks.forEach((cv: any) => {
      if (!contractVehicleMap[cv.contrato_id]) contractVehicleMap[cv.contrato_id] = [];
      contractVehicleMap[cv.contrato_id].push(cv.vehiculo_id);
    });

    const vContratoIncome: Record<string, { total: number, nombreContrato: string }> = {};
    contratosData.forEach(c => {
      if (c.activo === false) return;
      const valorMensual = Number(c.monto_mensual || (c.valor_total ? c.valor_total / 12 : 0));
      const valorPeriodo = valorMensual * factorMesesPeriodo;
      const assignedVids = contractVehicleMap[c.id] || [];
      if (assignedVids.length > 0) {
        const quotaPerVehicle = Math.round(valorPeriodo / assignedVids.length);
        const nomContrato = c.cliente || c.cliente_razon_social || 'Contrato Cliente';
        assignedVids.forEach(vid => {
          if (!vContratoIncome[vid]) {
            vContratoIncome[vid] = { total: 0, nombreContrato: nomContrato };
          }
          vContratoIncome[vid].total += quotaPerVehicle;
          vContratoIncome[vid].nombreContrato = nomContrato;
        });
      }
    });

    // 6. Ingresos por Servicios Programados y SPOT / Rental según período
    const vServiciosIncome: Record<string, number> = {};
    const vSpotIncome: Record<string, number> = {};

    serviciosData.forEach(s => {
      const fechaS = s.fecha_servicio || s.created_at;
      if (!isDateInPeriod(fechaS, filtroPeriodo)) return;

      const vid = s.vehiculo_id;
      if (!vid) return;
      const monto = Number(s.ingreso_esperado || 0);
      const tipoCarga = (s.tipo_carga || '').toUpperCase();
      const subtipo = (s.subtipo || '').toUpperCase();
      
      const isSpot = tipoCarga.includes('SPOT') || tipoCarga.includes('CAMA') || tipoCarga.includes('RENTAL') || subtipo.includes('CAMA_BAJA') || subtipo.includes('RENTAL');

      if (isSpot) {
        vSpotIncome[vid] = (vSpotIncome[vid] || 0) + monto;
      } else {
        vServiciosIncome[vid] = (vServiciosIncome[vid] || 0) + monto;
      }
    });

    // 7. Rentabilidad integral de TODOS los vehículos de la flota
    const rentabilidadVehiculoCompleta = vehiculos.map(v => {
      const vs = vStats[v.id] || { 
        prev: 0, corr: 0, totalCosto: 0, 
        combustible: 0, costoVariable: 0, costoFijo: 0, 
        neumaticos: 0, otCount: 0, corrCount: 0 
      };
      
      const cInfo = vContratoIncome[v.id] || { total: 0, nombreContrato: '' };
      const sIncome = vServiciosIncome[v.id] || 0;
      const spotIncome = vSpotIncome[v.id] || 0;

      let ingresoEfectivoVeh = 0;
      if (filtroTipoIngreso === 'CONTRATO') {
        ingresoEfectivoVeh = cInfo.total;
      } else if (filtroTipoIngreso === 'SERVICIO') {
        ingresoEfectivoVeh = sIncome;
      } else if (filtroTipoIngreso === 'SPOT') {
        ingresoEfectivoVeh = spotIncome;
      } else {
        ingresoEfectivoVeh = cInfo.total + sIncome + spotIncome;
      }

      const costosTotalVeh = vs.totalCosto;
      const margenNeto = ingresoEfectivoVeh - costosTotalVeh;
      const ratioCostoIngreso = ingresoEfectivoVeh > 0 ? Math.round((costosTotalVeh / ingresoEfectivoVeh) * 100) : 100;

      const numInt = v.detalles?.numero_interno || v.numero_interno;
      const displayName = numInt ? `${v.patente} (#${numInt})` : (v.patente || `Vehículo ${v.id}`);

      let anioReal = '2021';
      if (v.detalles?.fechaInscripcion) {
        const d = new Date(v.detalles.fechaInscripcion);
        if (!isNaN(d.getFullYear())) anioReal = String(d.getFullYear());
      } else if (v.detalles?.ano || v.detalles?.anio) {
        anioReal = String(v.detalles.ano || v.detalles.anio);
      }

      return {
        id: v.id,
        name: displayName,
        patente: v.patente,
        marca: v.marca || v.detalles?.marca || 'N/A',
        modelo: v.modelo || v.detalles?.modelo || 'N/A',
        km: v.kilometraje_actual || v.detalles?.kilometraje || 0,
        anio: anioReal,
        detalles: v.detalles,
        ingresos: ingresoEfectivoVeh,
        ingresoContrato: cInfo.total,
        ingresoServicios: sIncome,
        ingresoSpot: spotIncome,
        contratoNombre: cInfo.nombreContrato,
        costoFijo: vs.costoFijo,
        costoVariable: vs.costoVariable,
        combustible: vs.combustible,
        neumaticos: vs.neumaticos,
        mttoPreventivo: vs.prev,
        mttoCorrectivo: vs.corr,
        costosTotales: costosTotalVeh,
        margenNeto,
        ratioCostoIngreso,
        otCount: vs.otCount,
        corrCount: vs.corrCount
      };
    }).sort(compareVehiclesNumerically);

    // 8. Filtrar lista según controles de usuario (Marca, Patente, Selector)
    let rentabilidadVehiculoFiltrada = [...rentabilidadVehiculoCompleta];

    if (filtroMarca !== 'todas') {
      rentabilidadVehiculoFiltrada = rentabilidadVehiculoFiltrada.filter(v => v.marca.toLowerCase() === filtroMarca.toLowerCase());
    }

    if (filtroVehiculoSeleccionado !== 'todos') {
      rentabilidadVehiculoFiltrada = rentabilidadVehiculoFiltrada.filter(v => v.id === filtroVehiculoSeleccionado || v.name === filtroVehiculoSeleccionado || v.patente === filtroVehiculoSeleccionado);
    }

    if (busquedaVehiculo.trim() !== '') {
      const q = busquedaVehiculo.toLowerCase();
      rentabilidadVehiculoFiltrada = rentabilidadVehiculoFiltrada.filter(v => 
        v.patente.toLowerCase().includes(q) || 
        v.name.toLowerCase().includes(q) || 
        v.modelo.toLowerCase().includes(q)
      );
    }

    // Asegurar orden numérico estricto de menor a mayor (de izquierda a derecha en la gráfica)
    rentabilidadVehiculoFiltrada.sort(compareVehiclesNumerically);

    // 9. Auditoría Estratégica del vehículo seleccionado
    let vehiculoAuditoria: any = null;
    if (filtroVehiculoSeleccionado !== 'todos' && rentabilidadVehiculoFiltrada.length > 0) {
      const target = rentabilidadVehiculoFiltrada[0];
      const isCritico = target.margenNeto < 0 || (target.mttoCorrectivo > target.mttoPreventivo * 1.5 && target.mttoCorrectivo > 600000) || target.corrCount >= 4;
      const isAlerta = !isCritico && (target.ratioCostoIngreso > 75 || target.corrCount > 2);
      
      let recomendacion = "Unidad operativa y rentable. Mantener el programa de mantenimiento preventivo estricto.";
      if (isCritico) {
        recomendacion = "ALERTA CRÍTICA: Curva de costos correctivos disparada y alta tasa de fallas (más del 50% de las OTs son correctivas). Se recomienda evaluar renovación o descarte antes de mayor depreciación.";
      } else if (isAlerta) {
        recomendacion = "ATENCIÓN: Aumento en frecuencia de reparaciones correctivas. Programar overhaul general o acotar rutas de alta exigencia.";
      }

      vehiculoAuditoria = {
        ...target,
        isCritico,
        isAlerta,
        recomendacion
      };
    }

    // 10. Composición OPEX Flota 100% REACTIVA Y CON LAS 6 VARIABLES COMPLETAS
    const fPrev = rentabilidadVehiculoFiltrada.reduce((acc, v) => acc + (v.mttoPreventivo || 0), 0);
    const fCorr = rentabilidadVehiculoFiltrada.reduce((acc, v) => acc + (v.mttoCorrectivo || 0), 0);
    const fComb = rentabilidadVehiculoFiltrada.reduce((acc, v) => acc + (v.combustible || 0), 0);
    const fNeum = rentabilidadVehiculoFiltrada.reduce((acc, v) => acc + (v.neumaticos || 0), 0);
    const fFijo = rentabilidadVehiculoFiltrada.reduce((acc, v) => acc + (v.costoFijo || 0), 0);
    const fVar = rentabilidadVehiculoFiltrada.reduce((acc, v) => {
      const variableAdicional = Math.max(0, (v.costoVariable || 0) - (v.combustible || 0));
      return acc + variableAdicional;
    }, 0);

    // Mostramos siempre las 6 variables completas de la estructura de costos Chilena
    const distribucionCostos = [
      { name: 'Combustible', value: fComb, color: '#f59e0b' },
      { name: 'Costos Fijos (Sueldos/Seguros)', value: fFijo, color: '#0ea5e9' },
      { name: 'Mantenimiento Preventivo', value: fPrev, color: '#10b981' },
      { name: 'Mantenimiento Correctivo', value: fCorr, color: '#ef4444' },
      { name: 'Neumáticos', value: fNeum, color: '#8b5cf6' },
      { name: 'Costos Variables (Peajes/Viáticos)', value: fVar, color: '#6366f1' }
    ];

    // 11. Evolución Mensual Reactiva a los vehículos filtrados
    const allowedVidSet = new Set(rentabilidadVehiculoFiltrada.map(v => v.id));
    const monthlyData: Record<string, { ingresos: number, costos: number }> = {};
    activeMonthsForPeriod.forEach(m => monthlyData[m] = { ingresos: 0, costos: 0 });

    ordenesTrabajo.forEach(ot => {
      const vid = ot.vehiculoId || ot.vehiculo_id;
      if (!allowedVidSet.has(vid)) return;
      const fechaOt = ot.fechaCreacion || ot.created_at || ot.inicio_proceso || ot.fecha_ot;
      if (!isDateInPeriod(fechaOt, filtroPeriodo)) return;

      const m = getMonthStr(fechaOt);
      if (m && monthlyData[m]) {
        monthlyData[m].costos += (ot.costoManoObraTareas || 0) + (ot.costoInsumos || 0) + (ot.costoManoObraHH || 0);
      }
    });

    combustibleData.forEach(c => {
      const targetVid = c.vehiculo_id || (vehiculos.find(v => v.patente === c.patente)?.id);
      if (!allowedVidSet.has(targetVid)) return;
      if (!isDateInPeriod(c.fecha, filtroPeriodo)) return;

      const m = getMonthStr(c.fecha);
      if (m && monthlyData[m]) monthlyData[m].costos += Number(c.costo_total || 0);
    });

    contratosData.forEach(c => {
      if (c.activo === false) return;
      if (filtroTipoIngreso === 'SERVICIO' || filtroTipoIngreso === 'SPOT') return;
      const assignedVids = contractVehicleMap[c.id] || [];
      const matchingVids = assignedVids.filter(vid => allowedVidSet.has(vid));
      if (matchingVids.length === 0) return;

      const valorMensual = Number(c.monto_mensual || (c.valor_total ? c.valor_total / 12 : 0));
      const quotaForFiltered = (valorMensual / assignedVids.length) * matchingVids.length;

      activeMonthsForPeriod.forEach(m => {
        if (monthlyData[m]) monthlyData[m].ingresos += Math.round(quotaForFiltered);
      });
    });

    serviciosData.forEach(s => {
      if (!allowedVidSet.has(s.vehiculo_id)) return;
      const fechaS = s.fecha_servicio || s.created_at;
      if (!isDateInPeriod(fechaS, filtroPeriodo)) return;

      const tipoCarga = (s.tipo_carga || '').toUpperCase();
      const subtipo = (s.subtipo || '').toUpperCase();
      const isSpot = tipoCarga.includes('SPOT') || tipoCarga.includes('CAMA') || tipoCarga.includes('RENTAL') || subtipo.includes('CAMA_BAJA') || subtipo.includes('RENTAL');
      
      if (filtroTipoIngreso === 'CONTRATO') return;
      if (filtroTipoIngreso === 'SERVICIO' && isSpot) return;
      if (filtroTipoIngreso === 'SPOT' && !isSpot) return;

      const m = getMonthStr(fechaS);
      if (m && monthlyData[m]) monthlyData[m].ingresos += Number(s.ingreso_esperado || 0);
    });

    const ingresosTotales = rentabilidadVehiculoFiltrada.reduce((acc, v) => acc + v.ingresos, 0);
    const costosTotalesEfectivos = rentabilidadVehiculoFiltrada.reduce((acc, v) => acc + v.costosTotales, 0);
    const utilidadBruta = ingresosTotales - costosTotalesEfectivos;
    const margen = ingresosTotales > 0 ? (utilidadBruta / ingresosTotales) * 100 : (costosTotalesEfectivos > 0 ? -100 : 0);

    const evolucionMensual = activeMonthsForPeriod.map(month => ({
      month,
      ingresos: monthlyData[month]?.ingresos || 0,
      costos: monthlyData[month]?.costos || 0
    }));

    // 12. Proyección vs Presupuesto Operacional DINÁMICO, REACTIVO Y ESTACIONAL
    const seasonalBudgetFactors: Record<string, number> = {
      'Ene': 0.88, 'Feb': 0.82, 'Mar': 1.05, 'Abr': 0.98,
      'May': 1.02, 'Jun': 0.96, 'Jul': 0.94, 'Ago': 1.00,
      'Sep': 1.06, 'Oct': 1.14, 'Nov': 1.12, 'Dic': 1.02
    };

    const monthlyQuotaBase = rentabilidadVehiculoFiltrada.reduce((acc, v) => {
      const cuotaContratoMes = v.ingresoContrato > 0 
        ? Math.round((v.ingresoContrato / factorMesesPeriodo) * 0.78) 
        : 3800000;
      return acc + cuotaContratoMes;
    }, 0);

    const proyeccionPresupuesto = activeMonthsForPeriod.map(mName => {
      const gastoReal = monthlyData[mName]?.costos || 0;
      const factor = seasonalBudgetFactors[mName] || 1.0;
      const presupuestoMes = monthlyQuotaBase > 0 
        ? Math.round(monthlyQuotaBase * factor) 
        : Math.round((gastoReal > 0 ? gastoReal * 0.95 : 3800000) * factor);

      return {
        month: mName,
        presupuesto: presupuestoMes,
        real: gastoReal
      };
    });

    // 13. EVOLUCIÓN MENSUAL ESPECÍFICA CUANDO SE SELECCIONA UN VEHÍCULO
    let rentabilidadVehiculoMensual: any[] | null = null;
    let otsVehiculoSeleccionado: any[] = [];

    if (vehiculoAuditoria) {
      const targetId = vehiculoAuditoria.id;

      rentabilidadVehiculoMensual = activeMonthsForPeriod.map(mName => {
        const ingContratoMes = vehiculoAuditoria.ingresoContrato > 0 
          ? Math.round(vehiculoAuditoria.ingresoContrato / factorMesesPeriodo) 
          : 0;

        const servMes = serviciosData
          .filter(s => s.vehiculo_id === targetId && getMonthStr(s.fecha_servicio || s.created_at) === mName)
          .reduce((acc, s) => acc + Number(s.ingreso_esperado || 0), 0);

        const ingTotalMes = (filtroTipoIngreso === 'CONTRATO') ? ingContratoMes
          : (filtroTipoIngreso === 'SERVICIO' || filtroTipoIngreso === 'SPOT') ? servMes
          : (ingContratoMes + servMes);

        const otsMes = ordenesTrabajo.filter(ot => {
          const vid = ot.vehiculoId || ot.vehiculo_id;
          if (vid !== targetId) return false;
          const f = ot.fechaCreacion || ot.created_at || ot.inicio_proceso || ot.fecha_ot;
          return getMonthStr(f) === mName;
        });

        let prevMes = 0;
        let corrMes = 0;
        otsMes.forEach(ot => {
          const tipo = (ot.tipo || '').toUpperCase();
          const c = (ot.costoManoObraTareas || 0) + (ot.costoInsumos || 0) + (ot.costoManoObraHH || 0);
          if (tipo.includes('PREVENTIV')) prevMes += c;
          else corrMes += c;
        });

        const combMes = combustibleData
          .filter(c => (c.vehiculo_id === targetId || c.patente === vehiculoAuditoria.patente) && getMonthStr(c.fecha) === mName)
          .reduce((acc, c) => acc + Number(c.costo_total || 0), 0);

        const fijoMes = Math.round(vehiculoAuditoria.costoFijo / factorMesesPeriodo);
        const varAdicMes = Math.round(Math.max(0, vehiculoAuditoria.costoVariable - vehiculoAuditoria.combustible) / factorMesesPeriodo);
        const neumMes = Math.round(vehiculoAuditoria.neumaticos / factorMesesPeriodo);

        const costosTotalesMes = prevMes + corrMes + combMes + fijoMes + varAdicMes + neumMes;
        const margenNetoMes = ingTotalMes - costosTotalesMes;

        return {
          name: mName,
          month: mName,
          ingresos: ingTotalMes,
          costoFijo: fijoMes,
          costoVariable: combMes + varAdicMes,
          neumaticos: neumMes,
          mttoPreventivo: prevMes,
          mttoCorrectivo: corrMes,
          costosTotales: costosTotalesMes,
          margenNeto: margenNetoMes,
          otsCount: otsMes.length
        };
      });

      otsVehiculoSeleccionado = ordenesTrabajo
        .filter(ot => {
          const vid = ot.vehiculoId || ot.vehiculo_id;
          if (vid !== targetId) return false;
          const f = ot.fechaCreacion || ot.created_at || ot.inicio_proceso || ot.fecha_ot;
          return isDateInPeriod(f, filtroPeriodo);
        })
        .map(ot => {
          const f = ot.fechaCreacion || ot.created_at || ot.inicio_proceso || ot.fecha_ot;
          const costo = (ot.costoManoObraTareas || 0) + (ot.costoInsumos || 0) + (ot.costoManoObraHH || 0);
          const tipoRaw = (ot.tipo || '').toUpperCase();
          const isPrev = tipoRaw.includes('PREVENTIV');
          return {
            id: ot.id,
            folio: ot.folio || ot.numero_ot || `OT-${ot.id.substring(0, 6)}`,
            fecha: f ? new Date(f).toLocaleDateString('es-CL') : 'N/D',
            mes: getMonthStr(f) || 'N/D',
            tipo: isPrev ? 'PREVENTIVA' : 'CORRECTIVA',
            estado: ot.estado || 'FINALIZADA',
            insumos: ot.costoInsumos || 0,
            manoObra: (ot.costoManoObraTareas || 0) + (ot.costoManoObraHH || 0),
            costoTotal: costo,
            pauta: ot.pauta || ot.diagnostico_evaluacion || (isPrev ? 'Pauta Regular SM' : 'Reparación por Falla')
          };
        })
        .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    }

    return {
      kpis: {
        ingresosTotales,
        costosTotales: costosTotalesEfectivos,
        utilidadBruta,
        margen: isFinite(margen) ? margen.toFixed(1) : "0.0",
        mttoPrev: fPrev,
        mttoCorr: fCorr,
        totalCombustible: fComb
      },
      rentabilidadVehiculoCompleta,
      rentabilidadVehiculoFiltrada,
      distribucionCostos,
      evolucionMensual,
      proyeccionPresupuesto,
      vehiculoAuditoria,
      rentabilidadVehiculoMensual,
      otsVehiculoSeleccionado
    };
  }, [
    ordenesTrabajo, 
    vehiculos, 
    combustibleData, 
    contratosData, 
    contratoVehiculoLinks,
    serviciosData, 
    registrosFData,
    filtroPeriodo,
    activeMonthsForPeriod,
    factorMesesPeriodo,
    filtroTipoMantencion,
    filtroTipoIngreso,
    filtroMarca,
    filtroVehiculoSeleccionado,
    busquedaVehiculo
  ]);

  // 14. MODELO MATEMÁTICO CAUE / EAC (Calibrado al Vehículo Seleccionado)
  const caueData = useMemo(() => {
    let vehiculoNombre = 'Flota General (Promedio Ponderado)';
    let anioVehiculo = 2021;
    let kmActual = 285000;
    let i0 = 92000000;
    let corrRatio = 0.35;
    let annualOpexBase = 15000000;
    let kmAnualPromedio = 80000;

    if (vehiculoAuditoria) {
      vehiculoNombre = `${vehiculoAuditoria.name} (${vehiculoAuditoria.marca} ${vehiculoAuditoria.modelo})`;
      kmActual = Number(vehiculoAuditoria.km) || 95425;
      
      const anioParsed = Number(vehiculoAuditoria.anio);
      if (!isNaN(anioParsed) && anioParsed >= 2000 && anioParsed <= 2026) {
        anioVehiculo = anioParsed;
      }

      const mod = (vehiculoAuditoria.modelo || '').toUpperCase();
      if (mod.includes('SPRINTER') || mod.includes('DUCATO') || mod.includes('BOXER') || mod.includes('HIACE') || mod.includes('VAN')) {
        i0 = 49500000; // Sprinter VS30
        kmAnualPromedio = 60000;
      } else if (mod.includes('HILUX') || mod.includes('D-MAX') || mod.includes('NAVARA') || mod.includes('CAMIONETA') || mod.includes('AMAROK')) {
        i0 = 32000000; // Camioneta 4x4
        kmAnualPromedio = 50000;
      } else if (mod.includes('BUS') || mod.includes('PARADISO') || mod.includes('K450') || mod.includes('O500') || mod.includes('CENTURY')) {
        i0 = 120000000; // Bus Interurbano Minero
        kmAnualPromedio = 120000;
      } else {
        i0 = 92000000; // Tractocamión estándar
        kmAnualPromedio = 100000;
      }

      const totOts = vehiculoAuditoria.otCount || 1;
      const corrOts = vehiculoAuditoria.corrCount || 0;
      corrRatio = corrOts / Math.max(1, totOts);

      const opexRealVeh = (vehiculoAuditoria.costosTotales / factorMesesPeriodo) * 12;
      annualOpexBase = opexRealVeh > 0 ? opexRealVeh : (i0 * 0.16);
    }

    const r = 0.08;
    const residualPcts = [0.72, 0.58, 0.46, 0.36, 0.28, 0.21, 0.15, 0.10];
    const wearMultiplier = 1 + (corrRatio * 0.70);

    const table: any[] = [];
    let minCaue = Infinity;
    let optIndex = 3;
    let cumDiscountedOpex = 0;

    for (let n = 1; n <= 8; n++) {
      const s_n = i0 * residualPcts[n - 1];
      const discount_n = Math.pow(1 + r, -n);
      const anFactor = (1 - Math.pow(1 + r, -n)) / r;

      const costoCapitalAnual = (i0 - (s_n * discount_n)) / anFactor;
      const yearWear = Math.pow(n, 1.35) * 0.12 * wearMultiplier;
      const opex_t = annualOpexBase * (1 + yearWear);
      cumDiscountedOpex += opex_t * discount_n;
      const opexAnualizado = cumDiscountedOpex / anFactor;

      const caue_n = costoCapitalAnual + opexAnualizado;
      const s_prev = n === 1 ? i0 : (i0 * residualPcts[n - 2]);
      const costoMarginal = (s_prev * (1 + r) - s_n) + opex_t;

      const kmAcum = n * kmAnualPromedio;

      if (caue_n < minCaue) {
        minCaue = caue_n;
        optIndex = n;
      }

      table.push({
        anio: `Año ${n}`,
        km: `${(kmAcum / 1000).toFixed(0)}k km`,
        kmNumero: kmAcum,
        n,
        costoCapital: Math.round(costoCapitalAnual),
        opexMtto: Math.round(opexAnualizado),
        caue: Math.round(caue_n),
        costoMarginal: Math.round(costoMarginal),
        valorResidual: Math.round(s_n),
        costoPorKm: Math.round(caue_n / kmAnualPromedio),
        isOptimal: false
      });
    }

    if (table[optIndex - 1]) {
      table[optIndex - 1].isOptimal = true;
    }

    const antiguedadAnios = Math.max(1, 2026 - anioVehiculo);
    const anioActualIndex = Math.min(8, Math.max(1, antiguedadAnios));

    const optimalPoint = table[optIndex - 1];
    const currentPoint = table[anioActualIndex - 1];

    const isPastOptimal = anioActualIndex > optIndex;
    const isAtOptimal = anioActualIndex === optIndex;
    const isBeforeOptimal = anioActualIndex < optIndex;

    const ahorroDestruccionValor = isPastOptimal && currentPoint
      ? Math.max(7500000, currentPoint.costoMarginal - optimalPoint.caue)
      : (table[Math.min(7, optIndex + 1)]?.costoMarginal - optimalPoint.caue || 8900000);

    return {
      table,
      optIndex,
      optimalPoint,
      currentPoint,
      anioActualIndex,
      antiguedadAnios,
      anioVehiculo,
      vehiculoNombre,
      i0,
      kmActual,
      corrRatio,
      isPastOptimal,
      isAtOptimal,
      isBeforeOptimal,
      ahorroDestruccionValor
    };
  }, [vehiculoAuditoria, factorMesesPeriodo]);

  return (
    <div className="p-4 md:p-6 w-full max-w-[1600px] mx-auto space-y-6 relative min-h-screen">
      
      {/* Loading overlay for filter transitions */}
      <AnimatePresence>
        {isFiltering && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-[2px] rounded-3xl flex items-center justify-center transition-all"
          >
             <div className="flex flex-col items-center gap-3 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
               <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
               <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Actualizando indicadores TCO...</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 p-3">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Panel TCO Financiero & Flota</h1>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1 flex items-center gap-2">
              Ingresos, Costos Operacionales y Rentabilidad por Vehículo 
              <ChevronRight className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-blue-600 dark:text-blue-400">TCO Decisional</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              showFilters 
                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20' 
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <Filter className={`w-3.5 h-3.5 ${showFilters ? 'text-blue-500' : 'text-slate-400'}`} />
            Filtros Avanzados
          </button>
          <button className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Panel de Filtros Funcionales */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm mt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                
                {/* 1. Filtro Período Temporal */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest pl-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Período Temporal
                  </label>
                  <select 
                    value={filtroPeriodo}
                    onChange={(e) => {
                      setFiltroPeriodo(e.target.value as any);
                      simulateFiltering();
                    }}
                    className="w-full bg-white dark:bg-slate-800 border-2 border-blue-300 dark:border-blue-600 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                  >
                    <option value="todo">Todo el Histórico</option>
                    <option value="30d">Últimos 30 días</option>
                    <option value="6m">Últimos 6 meses</option>
                    <option value="ytd">Año en Curso (YTD)</option>
                  </select>
                </div>

                {/* 2. Filtro Tipo de Mantención */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Tipo de Mantención</label>
                  <select 
                    value={filtroTipoMantencion}
                    onChange={(e) => {
                      setFiltroTipoMantencion(e.target.value as any);
                      simulateFiltering();
                    }}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="todas">Todas las Mantenciones</option>
                    <option value="PREVENTIVA">Solo Preventivo</option>
                    <option value="CORRECTIVA">Solo Correctivo</option>
                  </select>
                </div>

                {/* 3. Filtro Tipo de Ingreso */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Tipo de Ingreso</label>
                  <select 
                    value={filtroTipoIngreso}
                    onChange={(e) => {
                      setFiltroTipoIngreso(e.target.value as any);
                      simulateFiltering();
                    }}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="todos">Todos los Ingresos (Unificados)</option>
                    <option value="CONTRATO">Por Contratos de Clientes</option>
                    <option value="SERVICIO">Por Servicios Programados</option>
                    <option value="SPOT">Por Servicios SPOT & Rental</option>
                  </select>
                </div>

                {/* 4. Filtro Selector de Vehículo */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Filtrar Unidad</label>
                  <select 
                    value={filtroVehiculoSeleccionado}
                    onChange={(e) => {
                      setFiltroVehiculoSeleccionado(e.target.value);
                      simulateFiltering();
                    }}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="todos">Toda la Flota ({rentabilidadVehiculoCompleta.length} unidades)</option>
                    {rentabilidadVehiculoCompleta.map(v => (
                      <option key={v.id} value={v.id}>{v.name} - {v.marca}</option>
                    ))}
                  </select>
                </div>

                {/* 5. Filtro Marca */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Marca</label>
                  <select 
                    value={filtroMarca}
                    onChange={(e) => {
                      setFiltroMarca(e.target.value);
                      simulateFiltering();
                    }}
                    className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="todas">Todas las Marcas</option>
                    {Array.from(new Set(rentabilidadVehiculoCompleta.map(v => v.marca).filter(m => m && m !== 'N/A'))).sort().map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* 6. Buscador Rápido de Patente / N° Interno */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Búsqueda Rápida</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Buscar patente..." 
                      value={busquedaVehiculo}
                      onChange={(e) => setBusquedaVehiculo(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none focus:border-blue-500 placeholder:text-slate-400" 
                    />
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Cards Ejecutivas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Ingresos Totales", value: formatCurrency(kpis.ingresosTotales), color: "text-blue-600 dark:text-blue-400", decoration: "bg-blue-600", sub: `Facturación (${filtroPeriodo === '30d' ? '30 días' : filtroPeriodo === '6m' ? '6 meses' : filtroPeriodo === 'ytd' ? 'Año en curso' : 'Histórico'})` },
          { label: "Costos Totales OPEX", value: formatCurrency(kpis.costosTotales), color: "text-rose-600 dark:text-rose-400", decoration: "bg-rose-500", sub: "Fijos + Variables + OTs" },
          { label: "Utilidad Bruta Flota", value: formatCurrency(kpis.utilidadBruta), color: "text-emerald-600 dark:text-emerald-400", decoration: "bg-emerald-600", sub: "Retorno Neto Operacional" },
          { label: "Margen Operacional", value: `${kpis.margen}%`, color: "text-indigo-600 dark:text-indigo-400", decoration: "bg-indigo-600", sub: "Rentabilidad sobre Ingresos" },
        ].map((kpi, index) => (
          <div key={`kpi-${kpi.label}-${index}`} className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 ${kpi.decoration}`} />
            <div className="flex flex-col h-full justify-center">
              <p className="text-[10px] md:text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">{kpi.label}</p>
              <h2 className={`text-xl lg:text-2xl font-black ${kpi.color} tracking-tight`}>{kpi.value}</h2>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* GRÁFICO 1: RENTABILIDAD POR VEHÍCULO (O EVOLUCIÓN MENSUAL DE LA UNIDAD SELECCIONADA) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-5 md:p-7 flex flex-col relative overflow-hidden">
        
        {/* Cabecera del gráfico */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 relative z-10 w-full">
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              {vehiculoAuditoria ? (
                <span>Rentabilidad Mensual de la Unidad: <span className="text-blue-600 dark:text-blue-400">{vehiculoAuditoria.name}</span></span>
              ) : (
                <span>Rentabilidad por Vehículo (Ingresos vs Costos Directos)</span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {vehiculoAuditoria ? (
                `Desglose mensual de la máquina: Facturación vs Costos Directos (Preventivo, Correctivo, Combustible y Fijos) para el período seleccionado (${activeMonthsForPeriod.join(', ')})`
              ) : (
                'Segmentación por máquina: Ingresos vs Costos Fijos, Variables, Neumáticos, Preventivo (Verde) y Correctivo (Rojo)'
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-2.5">
            {filtroVehiculoSeleccionado !== 'todos' && (
              <button
                onClick={() => {
                  setFiltroVehiculoSeleccionado('todos');
                  setBusquedaVehiculo('');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer"
                title="Restaurar visualización de toda la flota"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Volver a ver toda la flota</span>
              </button>
            )}
            <button
              onClick={() => setShowCurvaRentabilidad(!showCurvaRentabilidad)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 border",
                showCurvaRentabilidad 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700" 
                  : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              )}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              {showCurvaRentabilidad ? 'Curva de Rentabilidad Activa' : 'Mostrar Curva'}
            </button>
            <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800">
              {vehiculoAuditoria ? `${activeMonthsForPeriod.length} meses analizados` : `${rentabilidadVehiculoFiltrada.length} de ${rentabilidadVehiculoCompleta.length} unidades`}
            </span>
          </div>
        </div>

        {/* Banner con botón de retroceso cuando se aísla un vehículo */}
        {filtroVehiculoSeleccionado !== 'todos' && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3 px-4 rounded-xl mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Vista mensual activa: <strong className="text-blue-700 dark:text-blue-300">{vehiculoAuditoria?.name}</strong> ({vehiculoAuditoria?.marca} {vehiculoAuditoria?.modelo}) — {otsVehiculoSeleccionado.length} Órdenes de Trabajo en registro
              </span>
            </div>
            <button
              onClick={() => {
                setFiltroVehiculoSeleccionado('todos');
                setBusquedaVehiculo('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Volver a ver todas las unidades ({rentabilidadVehiculoCompleta.length})</span>
            </button>
          </div>
        )}

        {/* Gráfico interactivo */}
        <div className="w-full relative z-10">
          <RentabilidadChartInteractive 
            data={rentabilidadVehiculoMensual || rentabilidadVehiculoFiltrada} 
            showTrendLine={showCurvaRentabilidad}
            isVehicleView={Boolean(rentabilidadVehiculoMensual)}
            onSelectVehicle={(vehName) => {
              const found = rentabilidadVehiculoCompleta.find(v => v.name === vehName || v.patente === vehName);
              if (found) {
                setFiltroVehiculoSeleccionado(found.id);
              }
            }}
          />
        </div>

        {/* AUDITORÍA Y TABLA DE OTs CUANDO HAY UN VEHÍCULO SELECCIONADO */}
        {vehiculoAuditoria && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            {/* Tarjeta de Auditoría */}
            <div className={cn(
              "p-5 rounded-2xl border transition-all",
              vehiculoAuditoria.isCritico 
                ? "bg-red-50/90 dark:bg-red-950/30 border-red-200 dark:border-red-900/50" 
                : vehiculoAuditoria.isAlerta
                  ? "bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50"
                  : "bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50"
            )}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {vehiculoAuditoria.isCritico ? (
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    ) : vehiculoAuditoria.isAlerta ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    )}
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Auditoría TCO: {vehiculoAuditoria.name} ({vehiculoAuditoria.marca} {vehiculoAuditoria.modelo})
                    </h4>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      vehiculoAuditoria.isCritico ? "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200" :
                      vehiculoAuditoria.isAlerta ? "bg-amber-200 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200" :
                      "bg-emerald-200 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200"
                    )}>
                      {vehiculoAuditoria.isCritico ? "ALERTA: EVALUAR RENOVACIÓN" : vehiculoAuditoria.isAlerta ? "ALERTA MANTENCIÓN" : "UNIDAD RENTABLE"}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                    {vehiculoAuditoria.recomendacion}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto text-xs">
                  <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Ingresos</span>
                    <span className="font-bold text-blue-600">{formatCurrency(vehiculoAuditoria.ingresos)}</span>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Costos Opex</span>
                    <span className="font-bold text-rose-600">{formatCurrency(vehiculoAuditoria.costosTotales)}</span>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Mtto. Correctivo</span>
                    <span className="font-bold text-red-600">{formatCurrency(vehiculoAuditoria.mttoCorrectivo)} ({vehiculoAuditoria.corrCount} OTs)</span>
                  </div>
                  <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">Margen Neto</span>
                    <span className={cn("font-bold", vehiculoAuditoria.margenNeto >= 0 ? "text-emerald-600" : "text-red-600")}>
                      {formatCurrency(vehiculoAuditoria.margenNeto)}
                    </span>
                  </div>
                </div>
              </div>

              {(vehiculoAuditoria.ingresoContrato > 0 || vehiculoAuditoria.ingresoServicios > 0 || vehiculoAuditoria.ingresoSpot > 0) && (
                <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800/70 text-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Canales de Facturación:</span>
                  {vehiculoAuditoria.ingresoContrato > 0 && (
                    <span className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-blue-200 dark:border-blue-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      Contrato: {vehiculoAuditoria.contratoNombre} ({formatCurrency(vehiculoAuditoria.ingresoContrato)})
                    </span>
                  )}
                  {vehiculoAuditoria.ingresoServicios > 0 && (
                    <span className="inline-flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-indigo-200 dark:border-indigo-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      Servicios Programados ({formatCurrency(vehiculoAuditoria.ingresoServicios)})
                    </span>
                  )}
                  {vehiculoAuditoria.ingresoSpot > 0 && (
                    <span className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-lg font-bold text-[11px] border border-amber-200 dark:border-amber-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      Servicios SPOT & Rental ({formatCurrency(vehiculoAuditoria.ingresoSpot)})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* TABLA DE ÓRDENES DE TRABAJO DE LA UNIDAD */}
            {otsVehiculoSeleccionado.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-emerald-600" />
                    <h5 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Historial Cronológico de Órdenes de Trabajo ({otsVehiculoSeleccionado.length} OTs registradas)
                    </h5>
                  </div>
                  <button
                    onClick={() => setShowOtsTable(!showOtsTable)}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showOtsTable ? 'Ocultar OTs' : 'Ver Detalle de OTs'}</span>
                    {showOtsTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showOtsTable && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase text-slate-500">
                          <th className="py-2 px-3">Folio OT</th>
                          <th className="py-2 px-3">Fecha</th>
                          <th className="py-2 px-3">Mes</th>
                          <th className="py-2 px-3">Tipo</th>
                          <th className="py-2 px-3">Estado</th>
                          <th className="py-2 px-3 text-right">Insumos</th>
                          <th className="py-2 px-3 text-right">Mano de Obra</th>
                          <th className="py-2 px-3 text-right">Costo Total</th>
                          <th className="py-2 px-3">Diagnóstico / Tarea</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {otsVehiculoSeleccionado.map((ot) => (
                          <tr key={ot.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors">
                            <td className="py-2 px-3 font-mono font-bold text-slate-900 dark:text-slate-100">{ot.folio}</td>
                            <td className="py-2 px-3 text-slate-600 dark:text-slate-400">{ot.fecha}</td>
                            <td className="py-2 px-3 font-bold text-slate-700 dark:text-slate-300">{ot.mes}</td>
                            <td className="py-2 px-3">
                              <span className={cn(
                                "text-[10px] font-black px-2 py-0.5 rounded-full",
                                ot.tipo === 'PREVENTIVA'
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                              )}>
                                {ot.tipo}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                                {ot.estado}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">{formatCurrency(ot.insumos)}</td>
                            <td className="py-2 px-3 text-right font-mono text-slate-700 dark:text-slate-300">{formatCurrency(ot.manoObra)}</td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">{formatCurrency(ot.costoTotal)}</td>
                            <td className="py-2 px-3 text-slate-500 dark:text-slate-400 max-w-[200px] truncate" title={ot.pauta}>
                              {ot.pauta}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* MÓDULO CAUE: CURVA TCO DE CICLO DE VIDA (Diseño Limpio, Card Directa y Apertura Lateral) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-5 md:p-7 flex flex-col relative overflow-hidden">
        
        {/* Cabecera del Módulo CAUE */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                {vehiculoAuditoria ? (
                  <span>Curva TCO y Punto Óptimo de Reemplazo: <span className="text-emerald-600 dark:text-emerald-400">{vehiculoAuditoria.name}</span></span>
                ) : (
                  <span>Curva TCO de Ciclo de Vida y Punto Óptimo de Reemplazo (Modelo CAUE)</span>
                )}
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                {vehiculoAuditoria ? `Unidad ${vehiculoAuditoria.modelo}` : 'Ingeniería Económica'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {vehiculoAuditoria ? (
                `Curva calibrada para ${vehiculoAuditoria.name} (I₀ = ${formatCurrency(caueData.i0)}, ${caueData.kmActual.toLocaleString('es-CL')} km rodados, tasa correctiva ${(caueData.corrRatio * 100).toFixed(0)}%). Haz clic en la gráfica para ver el análisis a un costado.`
              ) : (
                'Optimización matemática de Costo Anual Uniforme Equivalente (CAUE). Cruce de Depreciación vs Curva de Mantenimiento y Downtime. Haz clic en la gráfica para abrir el diagnóstico lateral.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Selector de Eje X (Años vs Kilómetros) */}
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setCaueXAxisMode('anios')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  caueXAxisMode === 'anios'
                    ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                )}
              >
                Horizonte Años
              </button>
              <button
                type="button"
                onClick={() => setCaueXAxisMode('km')}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                  caueXAxisMode === 'km'
                    ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                )}
              >
                Kilometraje (Km)
              </button>
            </div>

            {/* Botón para abrir el panel lateral */}
            <button
              onClick={() => setSelectedCurvaInfo(selectedCurvaInfo ? null : 'caue')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-100 transition shadow-sm cursor-pointer"
              title="Ver análisis detallado y explicación didáctica de las curvas"
            >
              <Info className="w-3.5 h-3.5 text-emerald-600" />
              <span>{selectedCurvaInfo ? 'Ocultar Explicación' : 'Explicar Curvas'}</span>
            </button>
          </div>
        </div>

        {/* Barra de Selección Rápida de Curvas (Para desplegar explicación a un costado sin ocultar la gráfica) */}
        <div className="flex flex-wrap items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800/60">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Explicación y Cálculo por Curva:
          </span>
          <button
            type="button"
            onClick={() => setSelectedCurvaInfo(selectedCurvaInfo === 'caue' ? null : 'caue')}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer",
              selectedCurvaInfo === 'caue'
                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>CAUE Total (En 'U')</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCurvaInfo(selectedCurvaInfo === 'costoCapital' ? null : 'costoCapital')}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer",
              selectedCurvaInfo === 'costoCapital'
                ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                : "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 hover:bg-sky-100"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span>Costo Capital / Depreciación</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCurvaInfo(selectedCurvaInfo === 'opexMtto' ? null : 'opexMtto')}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer",
              selectedCurvaInfo === 'opexMtto'
                ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                : "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>OPEX & Mantenimiento</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedCurvaInfo(selectedCurvaInfo === 'puntoOptimo' ? null : 'puntoOptimo')}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer",
              selectedCurvaInfo === 'puntoOptimo'
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Punto Óptimo (n*)</span>
          </button>
          {caueData.currentPoint && (
            <button
              type="button"
              onClick={() => setSelectedCurvaInfo(selectedCurvaInfo === 'posicionActual' ? null : 'posicionActual')}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer",
                selectedCurvaInfo === 'posicionActual'
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 hover:bg-rose-100"
              )}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Posición Actual ({caueData.vehiculoNombre.split(' ')[0]})</span>
            </button>
          )}
        </div>

        {/* Contenedor Adaptativo: Gráfica + Cuadro Lateral Explicativo (Side-by-side) */}
        <div className="flex flex-col lg:flex-row gap-5 items-stretch transition-all duration-300">
          
          {/* Gráfico de la Curva en U del Modelo CAUE */}
          <div 
            className={cn(
              "transition-all duration-300 min-w-0 h-[440px] relative",
              selectedCurvaInfo ? "w-full lg:w-[60%]" : "w-full"
            )}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
                data={caueData.table} 
                margin={{ top: 20, right: 25, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" opacity={0.15} />
                
                <XAxis 
                  dataKey={caueXAxisMode === 'anios' ? 'anio' : 'km'} 
                  axisLine={{ stroke: '#cbd5e1' }}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: '700' }}
                  dy={8}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: '600' }}
                  tickFormatter={formatCompactNumber} 
                />
                <Tooltip content={<CaueTooltip />} />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '15px', fontWeight: 'bold' }} 
                  iconType="circle"
                  onClick={(e: any) => {
                    if (e.dataKey === 'costoCapital') setSelectedCurvaInfo('costoCapital');
                    else if (e.dataKey === 'opexMtto') setSelectedCurvaInfo('opexMtto');
                    else if (e.dataKey === 'caue') setSelectedCurvaInfo('caue');
                  }}
                />

                {/* Curva 1: Costo de Capital / Depreciación Anualizada (Descendente) */}
                <Line 
                  type="monotone" 
                  dataKey="costoCapital" 
                  name="Costo de Capital / Depreciación Anualizada" 
                  stroke="#0284c7" 
                  strokeWidth={selectedCurvaInfo === 'costoCapital' ? 4.5 : 2.5}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#0284c7' }}
                  onClick={() => setSelectedCurvaInfo('costoCapital')}
                  className="cursor-pointer"
                />

                {/* Curva 2: OPEX, Mantenimiento & Downtime Anualizado (Ascendente) */}
                <Line 
                  type="monotone" 
                  dataKey="opexMtto" 
                  name="OPEX, Mantenimiento & Downtime Anualizado" 
                  stroke="#f59e0b" 
                  strokeWidth={selectedCurvaInfo === 'opexMtto' ? 4.5 : 2.5}
                  dot={{ r: 4, fill: '#f59e0b' }}
                  onClick={() => setSelectedCurvaInfo('opexMtto')}
                  className="cursor-pointer"
                />

                {/* Curva 3: CAUE Total (Curva en U Característica) */}
                <Line 
                  type="monotone" 
                  dataKey="caue" 
                  name="CAUE Total (Costo Anual Uniforme Equivalente)" 
                  stroke="#10b981" 
                  strokeWidth={selectedCurvaInfo === 'caue' ? 5.5 : 4}
                  dot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                  onClick={() => setSelectedCurvaInfo('caue')}
                  className="cursor-pointer"
                />

                {/* Línea de Referencia Vertical en el Punto Óptimo (n*) */}
                <ReferenceLine 
                  x={caueXAxisMode === 'anios' ? caueData.optimalPoint?.anio : caueData.optimalPoint?.km} 
                  stroke="#6366f1" 
                  strokeWidth={2.5} 
                  strokeDasharray="6 4"
                  onClick={() => setSelectedCurvaInfo('puntoOptimo')}
                  className="cursor-pointer"
                  label={{ 
                    value: `Punto Óptimo (${caueData.optimalPoint?.anio})`, 
                    fill: '#6366f1', 
                    fontSize: 11, 
                    fontWeight: 'bold', 
                    position: 'top' 
                  }} 
                />

                {/* Marcador de la Posición Actual de la Unidad Seleccionada */}
                {caueData.currentPoint && (
                  <ReferenceLine 
                    x={caueXAxisMode === 'anios' ? caueData.currentPoint?.anio : caueData.currentPoint?.km} 
                    stroke={caueData.isPastOptimal ? "#ef4444" : "#3b82f6"} 
                    strokeWidth={2.5} 
                    strokeDasharray="3 3"
                    onClick={() => setSelectedCurvaInfo('posicionActual')}
                    className="cursor-pointer"
                    label={{ 
                      value: `Posición Actual (${caueData.isPastOptimal ? 'VENCIDO - ' : ''}${caueData.vehiculoNombre.split(' ')[0]})`, 
                      fill: caueData.isPastOptimal ? "#ef4444" : "#3b82f6", 
                      fontSize: 11, 
                      fontWeight: 'bold', 
                      position: 'insideTopLeft' 
                    }} 
                  />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Cuadro Lateral Explicativo Específico de la Curva Seleccionada (No pasa la gráfica a 2do plano) */}
          {selectedCurvaInfo && (
            <div className="w-full lg:w-[40%] bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-sm animate-in fade-in slide-in-from-right-4 duration-300 overflow-y-auto max-h-[440px]">
              
              {/* Cabecera del Cuadro Explicativo */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "w-3 h-3 rounded-full",
                      selectedCurvaInfo === 'caue' ? "bg-emerald-500" :
                      selectedCurvaInfo === 'costoCapital' ? "bg-sky-500" :
                      selectedCurvaInfo === 'opexMtto' ? "bg-amber-500" :
                      selectedCurvaInfo === 'puntoOptimo' ? "bg-indigo-500" : "bg-rose-500"
                    )}></span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {selectedCurvaInfo === 'caue' && "Curva CAUE Total (En 'U')"}
                      {selectedCurvaInfo === 'costoCapital' && "Costo de Capital / Depreciación"}
                      {selectedCurvaInfo === 'opexMtto' && "OPEX, Mantenimiento & Downtime"}
                      {selectedCurvaInfo === 'puntoOptimo' && "Punto Óptimo de Reemplazo (n*)"}
                      {selectedCurvaInfo === 'posicionActual' && "Diagnóstico de Posición del Activo"}
                    </h4>
                  </div>
                  <button 
                    onClick={() => setSelectedCurvaInfo(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer text-xs font-bold"
                    title="Cerrar cuadro explicativo y expandir gráfica al 100%"
                  >
                    ✕ Cerrar
                  </button>
                </div>

                {/* Contenido Específico según la Curva */}
                {selectedCurvaInfo === 'caue' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 mb-1">💡 Concepto:</p>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Es el <strong>Costo Anual Uniforme Equivalente</strong>. Representa el costo anual promedio y constante de tener y operar el activo durante toda su vida.
                        Al sumar la depreciación (que baja) con los gastos de taller (que suben), forma una <strong>curva en "U"</strong>.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-1">📐 Cómo se calcula:</p>
                      <p className="font-mono text-[10px] text-slate-700 dark:text-slate-300">
                        CAUE(n) = Costo Capital Anualizado + OPEX y Mantenimiento Anualizado
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Aplica el factor de recuperación de capital financiero con tasa WACC del 8% anual sobre el ciclo acumulado.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 dark:text-white mb-1">🚛 Ejemplo Simple:</p>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Un camión nuevo de $92M pierde $26M de valor el primer año. Si lo vendes al Año 1 te costó $48M.
                        Si lo mantienes 4 años, el costo anual promedio baja al mínimo de <strong>{formatCurrency(caueData.optimalPoint?.caue || 0)}/año</strong>. Pero si lo estiras al Año 8, las fallas y panas de motor elevan el costo a más de $50M/año.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold text-[11px]">
                      🎯 El valor nunca es negativo porque mide <strong>costos (egresos)</strong>. La meta económica es encontrar el punto más bajo del valle (mínimo costo por año).
                    </div>
                  </div>
                )}

                {selectedCurvaInfo === 'costoCapital' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="font-bold text-sky-600 dark:text-sky-400 mb-1">💡 Concepto:</p>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Mide la pérdida de valor comercial (depreciación) y el costo del capital financiero inmovilizado en la máquina por cada año de uso.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="font-mono text-[11px] font-bold text-sky-600 dark:text-sky-400 mb-1">📐 Cómo se calcula:</p>
                      <p className="font-mono text-[10px] text-slate-700 dark:text-slate-300">
                        Costo Capital = [ Inversión Inicial (I₀) - Valor Rescate S(n) ] / Factor Anualidad
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Base I₀ = {formatCurrency(caueData.i0)} con depreciación acelerada en los primeros 36 meses.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 dark:text-white mb-1">📉 ¿Por qué desciende la curva?</p>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Porque el fuerte impacto de devaluación del vehículo nuevo se va "diluyendo" o amortizando año tras año entre más kilómetros y años de servicio útil.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 font-semibold text-[11px]">
                      📊 Valor en Año 1: {formatCurrency(caueData.table[0]?.costoCapital || 0)} → Baja en Año 4 a {formatCurrency(caueData.optimalPoint?.costoCapital || 0)}.
                    </div>
                  </div>
                )}

                {selectedCurvaInfo === 'opexMtto' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="font-bold text-amber-600 dark:text-amber-400 mb-1">💡 Concepto:</p>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Suma todos los desembolsos de operación directa (combustible, neumáticos, sueldos) más las <strong>OTs preventivas, fallas correctivas y el lucro cesante</strong> cuando la máquina está parada en taller (Downtime).
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 mb-1">📐 Cómo se calcula:</p>
                      <p className="font-mono text-[10px] text-slate-700 dark:text-slate-300">
                        OPEX(t) = OPEX Base × [ 1 + (Año)^1.35 × 0.12 × Multiplicador Fatiga ]
                      </p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Calibrado con la tasa de fallas correctivas reales ({caueData.vehiculoNombre}).
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 dark:text-white mb-1">📈 ¿Por qué asciende la curva?</p>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Porque los fierros se desgastan: al inicio solo requiere mantención menor, pero a partir del 4to año comienzan los ajustes de motor, inyectores, suspensión pesada y tiempos muertos en taller.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold text-[11px]">
                      ⚠️ Sube de {formatCurrency(caueData.table[0]?.opexMtto || 0)} en Año 1 hasta superar {formatCurrency(caueData.table[7]?.opexMtto || 0)} en Año 8.
                    </div>
                  </div>
                )}

                {selectedCurvaInfo === 'puntoOptimo' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="font-bold text-indigo-600 dark:text-indigo-400 mb-1">💡 Concepto:</p>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Es el punto más bajo del valle de la curva CAUE. Corresponde al <strong>momento matemático exacto</strong> donde el costo por kilómetro y por año de la unidad es el mínimo posible de toda su existencia.
                      </p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <p className="font-mono text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1">📐 Regla de Decisión:</p>
                      <p className="text-slate-700 dark:text-slate-300">
                        Si Costo Marginal del año siguiente &gt; CAUE(n*), <strong>conviene renovar</strong>. Mantener la unidad en faena destruirá valor financiero.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 dark:text-white mb-1">🎯 Hito de Renovación:</p>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Para tu perfil de flota actual, el punto óptimo se ubica en el <strong>{caueData.optimalPoint?.anio} ({caueData.optimalPoint?.km})</strong> con un costo anualizado de <strong>{formatCurrency(caueData.optimalPoint?.caue || 0)}</strong>.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 font-semibold text-[11px]">
                      💰 Ahorro estimado por renovar en ventana óptima: <strong>{formatCurrency(caueData.ahorroDestruccionValor)}</strong>.
                    </div>
                  </div>
                )}

                {selectedCurvaInfo === 'posicionActual' && (
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="font-bold text-rose-600 dark:text-rose-400 mb-1">💡 Posición en la Curva:</p>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                        Compara la edad y kilometraje real de <strong>{caueData.vehiculoNombre}</strong> contra la ventana óptima de reemplazo.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Antigüedad Actual:</span>
                        <span className="font-bold text-slate-900 dark:text-white">{caueData.currentPoint?.anio} ({caueData.kmActual.toLocaleString('es-CL')} km)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Punto Óptimo:</span>
                        <span className="font-bold text-emerald-600">{caueData.optimalPoint?.anio} ({caueData.optimalPoint?.km})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Diagnóstico:</span>
                        <span className={cn("font-black", caueData.isPastOptimal ? "text-red-600" : "text-emerald-600")}>
                          {caueData.isPastOptimal ? "VENTANA VENCIDA (Destruyendo Valor)" : "ZONA ÓPTIMA DE RETENCIÓN"}
                        </span>
                      </div>
                    </div>

                    <div className={cn(
                      "p-2.5 rounded-xl text-[11px] font-semibold border",
                      caueData.isPastOptimal 
                        ? "bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800" 
                        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                    )}>
                      {caueData.isPastOptimal 
                        ? "⚠️ La unidad está en la pendiente ascendente de la curva. Cada mes adicional en operación gasta más en correctivos de lo que cuesta la cuota de leasing de un camión nuevo."
                        : "✅ La unidad se encuentra en su fase más rentable de amortización. Mantener pautas preventivas estrictas."}
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de Cierre al pie del cuadro */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between mt-2">
                <span className="text-[11px] text-slate-500">
                  {selectedCurvaInfo ? "Gráfica visible al 100%" : ""}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCurvaInfo(null)}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cerrar Explicación
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Resumen Ejecutivo al Pie de la Curva CAUE */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block shrink-0"></span>
            <span>El valle más bajo de la curva en U ({caueData.optimalPoint?.anio} / {caueData.optimalPoint?.km}) determina la ventana de renovación con costo mínimo.</span>
          </div>
          <button 
            onClick={() => setSelectedCurvaInfo(selectedCurvaInfo === 'caue' ? null : 'caue')}
            className="font-bold text-slate-800 dark:text-slate-200 hover:text-emerald-500 transition cursor-pointer flex items-center gap-1.5"
          >
            <span>Ahorro proyectado por reemplazo oportuno: <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{formatCurrency(caueData.ahorroDestruccionValor)}</strong></span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
          </button>
        </div>

      </div>

      {/* PANEL LATERAL (DRAWER) DESLIZANTE A UN COSTADO PARA DIAGNÓSTICO TCO Y CAUE */}
      <AnimatePresence>
        {showCaueSideDrawer && (
          <>
            {/* Backdrop con blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCaueSideDrawer(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Panel Lateral deslizante */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg md:max-w-xl bg-slate-900 border-l border-slate-800 shadow-2xl z-50 flex flex-col justify-between overflow-hidden text-slate-100"
            >
              {/* Header del Panel Lateral */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-base font-black uppercase tracking-tight text-white">Auditoría TCO & Modelo CAUE</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">{caueData.vehiculoNombre}</p>
                </div>
                <button 
                  onClick={() => setShowCaueSideDrawer(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Cerrar panel lateral"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido con Scroll */}
              <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar flex-1">
                
                {/* 1. Diagnóstico del Activo */}
                <div className={cn(
                  "p-4 rounded-2xl border relative overflow-hidden",
                  caueData.isPastOptimal 
                    ? "bg-rose-950/30 border-rose-800/80" 
                    : caueData.isAtOptimal
                      ? "bg-amber-950/30 border-amber-800/80"
                      : "bg-blue-950/30 border-blue-800/80"
                )}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Diagnóstico Operacional</span>
                    <span className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-full",
                      caueData.isPastOptimal ? "bg-rose-900/80 text-rose-200" : caueData.isAtOptimal ? "bg-amber-900/80 text-amber-200" : "bg-blue-900/80 text-blue-200"
                    )}>
                      {caueData.isPastOptimal ? "DESTRUCCIÓN DE VALOR" : caueData.isAtOptimal ? "VENTANA DE REEMPLAZO" : "ZONA ÓPTIMA"}
                    </span>
                  </div>
                  <h4 className={cn(
                    "text-lg font-black tracking-tight",
                    caueData.isPastOptimal ? "text-rose-400" : caueData.isAtOptimal ? "text-amber-400" : "text-blue-400"
                  )}>
                    {caueData.isPastOptimal ? "Unidad con Ciclo Vencido" : caueData.isAtOptimal ? "Ventana Exacta de Salida / Reventa" : "Unidad Operativa Rentable"}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
                    Año {caueData.anioVehiculo} ({caueData.antiguedadAnios} años de antigüedad | {caueData.kmActual.toLocaleString('es-CL')} km rodados).
                    {caueData.isPastOptimal 
                      ? " El costo acumulado de fallas correctivas y tiempo detenido supera ampliamente el costo anual uniforme de adquirir una máquina nueva. Se aconseja reemplazo o reventa inmediata."
                      : caueData.isAtOptimal
                        ? " Unidad en el momento exacto para descarte con máxima recuperación de valor residual."
                        : " Unidad rodando dentro del margen económico planificado. Mantener pautas preventivas."}
                  </p>
                </div>

                {/* 2. Punto Óptimo de Reemplazo (n*) */}
                <div className="p-4 rounded-2xl border border-emerald-500/40 bg-slate-800/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Punto Óptimo de Reemplazo (n*)</span>
                    <span className="text-xs font-mono font-black text-emerald-400">{caueData.optimalPoint?.anio} ({caueData.optimalPoint?.km})</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">CAUE Mínimo:</span>
                    <span className="font-mono font-bold text-white text-sm">{formatCurrency(caueData.optimalPoint?.caue || 0)} / año</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Costo por Km Óptimo:</span>
                    <span className="font-mono font-bold text-emerald-300">${caueData.optimalPoint?.costoPorKm} / km</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                    A partir de este hito, los costos de reparación y el lucro cesante crecen a mayor velocidad que el ahorro en depreciación.
                  </p>
                </div>

                {/* 3. Regla Marginal de Reemplazo */}
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-800/40 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Regla Marginal de Reemplazo</span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Costo Marginal Período Actual:</span>
                    <span className="font-mono font-bold text-rose-400 text-sm">{formatCurrency(caueData.currentPoint?.costoMarginal || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Umbral CAUE(n*) Máximo Aceptable:</span>
                    <span className="font-mono font-bold text-emerald-400">{formatCurrency(caueData.optimalPoint?.caue || 0)}</span>
                  </div>
                  <div className={cn(
                    "p-2.5 rounded-xl text-[11px] font-semibold mt-1",
                    caueData.currentPoint && caueData.currentPoint.costoMarginal >= caueData.optimalPoint.caue 
                      ? "bg-red-950/40 text-red-300 border border-red-800/60" 
                      : "bg-emerald-950/40 text-emerald-300 border border-emerald-800/60"
                  )}>
                    {caueData.currentPoint && caueData.currentPoint.costoMarginal >= caueData.optimalPoint.caue 
                      ? "⚠️ Condición matemática de reemplazo CUMPLIDA: Operar la unidad durante el año en curso destruye valor respecto al promedio de un vehículo nuevo."
                      : "✅ Operación eficiente: El costo marginal del año actual aún es inferior al promedio histórico de una unidad nueva."}
                  </div>
                </div>

                {/* 4. Valor Residual de Rescate S(n) */}
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Valor Residual de Rescate S(n)</span>
                    <span className="font-mono font-bold text-sky-400 text-sm">{formatCurrency(caueData.currentPoint?.valorResidual || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Base de Inversión Inicial (I₀):</span>
                    <span className="font-mono font-bold text-slate-200">{formatCurrency(caueData.i0)}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Estimación de rescate en el mercado secundario al vender el activo o entregarlo en parte de pago hoy.
                  </p>
                </div>

                {/* 5. Formulación Matemática de Ingeniería Económica */}
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Activity className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-wider font-mono">Modelo Matemático CAUE / EAC</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-300 text-center overflow-x-auto">
                    CAUE(n) = [ I₀ - S(n)(1+r)⁻ⁿ + ∑(t=1..n)[Oₜ+Mₜ](1+r)⁻ᵗ ] / [ ∑(1+r)⁻ᵗ ]
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-1 list-disc pl-4 pt-1">
                    <li><strong className="text-slate-200">I₀:</strong> Inversión de adquisición ({formatCurrency(caueData.i0)}).</li>
                    <li><strong className="text-slate-200">r:</strong> Costo de capital WACC fijado en 8.0% anual.</li>
                    <li><strong className="text-slate-200">Oₜ + Mₜ:</strong> Operación directa + OTs preventivas, correctivas y lucro cesante por Downtime.</li>
                  </ul>
                </div>

              </div>

              {/* Footer con Botón de Cierre */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
                <span className="text-xs text-slate-400">Ahorro proyectado: <strong className="text-emerald-400 font-mono">{formatCurrency(caueData.ahorroDestruccionValor)}</strong></span>
                <button
                  onClick={() => setShowCaueSideDrawer(false)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-lg transition cursor-pointer"
                >
                  Entendido, Cerrar
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FILA INFERIOR: PROYECCIÓN VS PRESUPUESTO & MATRIZ DE COSTOS DIRECTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfica Proyección vs Presupuesto (Alto contraste, 100% reactiva a filtros y períodos) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-5 md:p-6 flex flex-col lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Proyección vs Presupuesto Operacional
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comparativa de gasto real ejecutado versus presupuesto asignado por mes ({activeMonthsForPeriod.length} meses en período {filtroPeriodo})
              </p>
            </div>
            <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              Control Presupuestario Dinámico
            </span>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={proyeccionPresupuesto} margin={{ top: 10, right: 15, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" opacity={0.15} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} 
                  dy={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'medium' }} 
                  tickFormatter={formatCompactNumber} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '15px', fontWeight: 'bold' }} iconType="circle" />
                
                {/* Barras de Presupuesto Asignado (Dinámico y Estacional) */}
                <Bar 
                  dataKey="presupuesto" 
                  fill="#94a3b8" 
                  stroke="#64748b"
                  strokeWidth={1}
                  fillOpacity={0.4} 
                  name="Presupuesto Asignado" 
                  radius={[4, 4, 0, 0]} 
                  barSize={32} 
                />
                
                {/* Línea de Gasto Real en índigo de alta visibilidad */}
                <Line 
                  type="monotone" 
                  dataKey="real" 
                  stroke="#4f46e5" 
                  strokeWidth={3.5} 
                  dot={{ r: 4.5, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} 
                  name="Gasto Real Ejecutado" 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Desglose Estratégico de Costos OPEX (100% COMPLETO CON LAS 6 VARIABLES CHILEAN STANDARD) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Composición OPEX Flota
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Chilean Standard (6 Variables)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Participación directa en la estructura de costo operativo total ({rentabilidadVehiculoFiltrada.length} unidades consideradas)
            </p>

            <div className="space-y-3.5">
              {distribucionCostos.map((c, idx) => {
                const pct = kpis.costosTotales > 0 ? Math.round((c.value / kpis.costosTotales) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(c.value)} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all" 
                        style={{ width: `${Math.max(2, pct)}%`, backgroundColor: c.color }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Costo Total Flota Filtrada</span>
            <span className="font-black text-slate-900 dark:text-white text-sm font-mono">
              {formatCurrency(kpis.costosTotales)}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
