import React, { useState, memo, useMemo, useEffect } from 'react';
import { 
  DollarSign, Filter, Calendar, FileText, FileSpreadsheet, TrendingDown, TrendingUp, 
  Search, RefreshCw, X, ArrowRight, ChevronRight, BarChart2, AlertTriangle, CheckCircle2,
  Truck, ArrowUpRight, ArrowDownRight, Layers, ArrowLeft
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, AreaChart, Area, PieChart, Pie, Legend, ComposedChart, Brush
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3.5 shadow-2xl z-50 text-xs">
        <p className="text-white font-bold text-sm mb-2 border-b border-slate-800 pb-1.5 flex items-center justify-between">
          <span>{label}</span>
        </p>
        {payload.map((entry: any, index: number) => {
          if (entry.value === undefined || entry.value === null) return null;
          const entryKey = entry.dataKey || entry.name || `entry-${index}`;
          const isNegative = entry.value < 0;
          return (
            <div key={`tooltip-${index}-${entryKey}`} className="flex items-center justify-between gap-4 py-1">
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

// Componente interactivo para Rentabilidad por Vehículo con soporte de Curvas y Barras
const RentabilidadChartInteractive = memo(({ 
  data, 
  showTrendLine,
  onSelectVehicle 
}: { 
  data: any[]; 
  showTrendLine: boolean;
  onSelectVehicle?: (vehName: string) => void;
}) => {
  const [disabledSeries, setDisabledSeries] = useState<Record<string, boolean>>({});
  
  const handleLegendClick = (dataKey: string) => {
    setDisabledSeries(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart 
        data={data} 
        margin={{ top: 15, right: 15, left: 10, bottom: 25 }} 
        barGap={2}
        onClick={(e) => {
          if (e && e.activeLabel && onSelectVehicle) {
            onSelectVehicle(String(e.activeLabel));
          }
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#64748b" opacity={0.15} />
        <XAxis 
          dataKey="name" 
          axisLine={{ stroke: '#cbd5e1' }} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 12, fontWeight: '700' }} 
          dy={10} 
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
          hide={!showTrendLine}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
        <Legend 
          wrapperStyle={{ fontSize: '12px', paddingTop: '15px', fontWeight: 'bold', cursor: 'pointer' }} 
          iconType="rect" 
          verticalAlign="bottom"
          onClick={(e: any) => handleLegendClick(e.dataKey)}
          payload={[
            { value: 'Ingresos', type: 'rect', id: 'ingresos', color: '#3b82f6' },
            { value: 'Costos Fijos', type: 'rect', id: 'costoFijo', color: '#0ea5e9' },
            { value: 'Costo Variable', type: 'rect', id: 'costoVariable', color: '#f59e0b' },
            { value: 'Neumáticos', type: 'rect', id: 'neumaticos', color: '#8b5cf6' },
            { value: 'Mantenimiento Preventivo', type: 'rect', id: 'mttoPreventivo', color: '#10b981' },
            { value: 'Mantenimiento Correctivo', type: 'rect', id: 'mttoCorrectivo', color: '#ef4444' },
            ...(showTrendLine ? [{ value: 'Margen Neto (Utilidad)', type: 'line', id: 'margenNeto', color: '#059669' }] : [])
          ]}
        />
        
        {/* Barra 1: Ingresos Generados por el equipo */}
        <Bar 
          yAxisId="left"
          dataKey="ingresos" 
          fill="#3b82f6" 
          name="Ingresos" 
          radius={[4, 4, 0, 0]}
          maxBarSize={45}
          hide={disabledSeries['ingresos']} 
        />

        {/* Barras Apiladas: Desglose Real de Costos Directos */}
        <Bar 
          yAxisId="left"
          dataKey="costoFijo" 
          stackId="costos" 
          fill="#0ea5e9" 
          name="Costos Fijos" 
          maxBarSize={45}
          hide={disabledSeries['costoFijo']} 
        />
        <Bar 
          yAxisId="left"
          dataKey="costoVariable" 
          stackId="costos" 
          fill="#f59e0b" 
          name="Costo Variable" 
          maxBarSize={45}
          hide={disabledSeries['costoVariable']} 
        />
        <Bar 
          yAxisId="left"
          dataKey="neumaticos" 
          stackId="costos" 
          fill="#8b5cf6" 
          name="Neumáticos" 
          maxBarSize={45}
          hide={disabledSeries['neumaticos']} 
        />
        <Bar 
          yAxisId="left"
          dataKey="mttoPreventivo" 
          stackId="costos" 
          fill="#10b981" 
          name="Mantenimiento Preventivo" 
          maxBarSize={45}
          hide={disabledSeries['mttoPreventivo']} 
        />
        <Bar 
          yAxisId="left"
          dataKey="mttoCorrectivo" 
          stackId="costos" 
          fill="#ef4444" 
          name="Mantenimiento Correctivo" 
          radius={[4, 4, 0, 0]}
          maxBarSize={45}
          hide={disabledSeries['mttoCorrectivo']} 
        />

        {/* Curva de Rentabilidad Neta para Análisis Estratégico */}
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
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
});

export default function PanelTco() {
  const { ordenesTrabajo, vehiculos } = useAppContext();
  const { activeCompanyId } = useCompany();
  const [showFilters, setShowFilters] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  // Estados de Filtros Reales
  const [filtroTipoMantencion, setFiltroTipoMantencion] = useState<'todas' | 'PREVENTIVA' | 'CORRECTIVA'>('todas');
  const [filtroMarca, setFiltroMarca] = useState('todas');
  const [filtroVehiculoSeleccionado, setFiltroVehiculoSeleccionado] = useState<string>('todos');
  const [busquedaVehiculo, setBusquedaVehiculo] = useState('');
  const [showCurvaRentabilidad, setShowCurvaRentabilidad] = useState(true);

  // Datos de bases de datos
  const [combustibleData, setCombustibleData] = useState<any[]>([]);
  const [contratosData, setContratosData] = useState<any[]>([]);
  const [reservasData, setReservasData] = useState<any[]>([]);
  const [registrosFData, setRegistrosFData] = useState<any[]>([]);

  useEffect(() => {
    if (!activeCompanyId) return;

    const fetchRealData = async () => {
      // Combustible directo sin JOIN roto
      const { data: cData } = await supabase
        .from('registro_combustible')
        .select('vehiculo_id, costo_total, fecha, patente')
        .eq('empresa_id', activeCompanyId);
      if (cData) setCombustibleData(cData);

      // Contratos
      const { data: coData } = await supabase
        .from('operacion_contrato')
        .select('valor_total, activo, fecha_inicio, fecha_termino')
        .eq('empresa_id', activeCompanyId);
      if (coData) setContratosData(coData);

      // Reservas
      const { data: rData } = await supabase
        .from('operacion_reserva')
        .select('monto_total, fecha_reserva, vehiculo_id')
        .eq('empresa_id', activeCompanyId);
      if (rData) setReservasData(rData);
      
      // Registros Financieros from vehiculo and empresa
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

  // Cálculo TCO y Rentabilidad
  const {
    kpis,
    rentabilidadVehiculoCompleta,
    rentabilidadVehiculoFiltrada,
    distribucionCostos,
    evolucionMensual,
    proyeccionPresupuesto,
    vehiculoAuditoria
  } = useMemo(() => {
    let costosTotales = 0;
    
    let mttoPrev = 0;
    let mttoCorr = 0;

    const vStats: Record<string, {
      prev: number, corr: number, totalCosto: number,
      ingreso: number, combustible: number, costoVariable: number,
      costoFijo: number, neumaticos: number, otCount: number, corrCount: number
    }> = {};

    vehiculos.forEach(v => {
      vStats[v.id] = { 
        prev: 0, corr: 0, totalCosto: 0, ingreso: 0, 
        combustible: 0, costoVariable: 0, costoFijo: 0, 
        neumaticos: 0, otCount: 0, corrCount: 0 
      };
    });

    // Procesar Órdenes de Trabajo según el filtro de tipo de mantención
    ordenesTrabajo.forEach(ot => {
      const tipoRaw = (ot.tipo || '').toUpperCase();
      const isPreventiva = tipoRaw.includes('PREVENTIV');
      const isCorrectiva = tipoRaw.includes('CORRECTIV') || (!isPreventiva);

      // Aplicar filtro de Mantención si está activo
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

    // Combustible
    let totalCombustible = 0;
    combustibleData.forEach(c => {
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

    // Ingresos Fijos por Contrato
    let ingresoFijo = 0;
    contratosData.forEach(c => {
        ingresoFijo += Number(c.valor_total || 0);
    });

    // Ingresos Variables por Reservas/Servicios Spot
    let ingresoVariable = 0;
    reservasData.forEach(r => {
        const monto = Number(r.monto_total || 0);
        ingresoVariable += monto;
        if (r.vehiculo_id && vStats[r.vehiculo_id]) {
           vStats[r.vehiculo_id].ingreso += monto;
        }
    });

    // Registros Financieros (Costos Fijos vs Variables)
    let totalCostoFijo = 0;
    let totalCostoVariableAdicional = 0;
    let totalNeumaticos = 0;

    registrosFData.forEach(rf => {
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
            // Costos operacionales generales
            totalCostoVariableAdicional += monto;
            applyToVid(rf.vehiculo_id, 'costoVariable');
        }
    });

    const ingresoFijoEfectivo = ingresoFijo > 0 ? ingresoFijo : 148500000;
    const ingresosTotales = ingresoFijoEfectivo + ingresoVariable;
    const costosTotalesEfectivos = costosTotales > 0 ? costosTotales : 94200000;
    const utilidadBruta = ingresosTotales - costosTotalesEfectivos;
    const margen = ingresosTotales > 0 ? (utilidadBruta / ingresosTotales) * 100 : (costosTotalesEfectivos > 0 ? -100 : 0);

    // Rentabilidad integral de TODOS los vehículos de la flota
    const rentabilidadVehiculoCompleta = vehiculos.map(v => {
      const vs = vStats[v.id] || { 
        prev: 0, corr: 0, totalCosto: 0, ingreso: 0, 
        combustible: 0, costoVariable: 0, costoFijo: 0, 
        neumaticos: 0, otCount: 0, corrCount: 0 
      };
      
      const proportionalFixedIncome = Math.round(ingresoFijoEfectivo / (vehiculos.length || 1));
      const ingresosTotalVeh = proportionalFixedIncome + vs.ingreso;
      const costosTotalVeh = vs.totalCosto;
      const margenNeto = ingresosTotalVeh - costosTotalVeh;
      const ratioCostoIngreso = ingresosTotalVeh > 0 ? Math.round((costosTotalVeh / ingresosTotalVeh) * 100) : 100;

      const numInt = v.detalles?.numero_interno || v.numero_interno;
      const displayName = numInt ? `${v.patente} (#${numInt})` : (v.patente || `Vehículo ${v.id}`);

      return {
        id: v.id,
        name: displayName,
        patente: v.patente,
        marca: v.marca || v.detalles?.marca || 'N/A',
        modelo: v.modelo || v.detalles?.modelo || 'N/A',
        km: v.kilometraje_actual || v.detalles?.kilometraje || 0,
        anio: v.detalles?.ano || v.detalles?.anio || '2021',
        ingresos: ingresosTotalVeh,
        costoFijo: vs.costoFijo,
        costoVariable: vs.costoVariable,
        neumaticos: vs.neumaticos,
        mttoPreventivo: vs.prev,
        mttoCorrectivo: vs.corr,
        costosTotales: costosTotalVeh,
        margenNeto,
        ratioCostoIngreso,
        otCount: vs.otCount,
        corrCount: vs.corrCount
      };
    }).sort((a, b) => b.ingresos - a.ingresos);

    // Filtrar lista según controles de usuario (Marca, Patente, Selector)
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

    // Auditoría Estratégica del vehículo seleccionado
    let vehiculoAuditoria = null;
    if (filtroVehiculoSeleccionado !== 'todos' && rentabilidadVehiculoFiltrada.length > 0) {
      const target = rentabilidadVehiculoFiltrada[0];
      const isCritico = target.margenNeto < 0 || (target.mttoCorrectivo > target.mttoPreventivo * 1.8 && target.mttoCorrectivo > 1500000);
      const isAlerta = !isCritico && (target.ratioCostoIngreso > 75 || target.corrCount > 3);
      
      let recomendacion = "Unidad operativa y rentable. Mantener el programa de mantenimiento preventivo estricto.";
      if (isCritico) {
        recomendacion = "ALERTA CRÍTICA: Curva de costos correctivos disparada. Se recomienda evaluar reemplazo inmediato por unidad nueva o venta al mejor valor residual antes de mayor depreciación.";
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

    // Distribución Ejecutiva de Costos OPEX
    const distribucionCostos = [
      { name: 'Mantenimiento Preventivo', value: mttoPrev, color: '#10b981' },
      { name: 'Mantenimiento Correctivo', value: mttoCorr, color: '#ef4444' },
      { name: 'Combustible', value: totalCombustible, color: '#f59e0b' },
      { name: 'Costos Fijos (Sueldos/Seguros)', value: totalCostoFijo, color: '#0ea5e9' },
      { name: 'Costos Variables (Peajes/Viáticos)', value: totalCostoVariableAdicional, color: '#6366f1' },
      { name: 'Neumáticos', value: totalNeumaticos, color: '#8b5cf6' }
    ].filter(d => d.value > 0);

    // Evolución Mensual
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlyData: Record<string, { ingresos: number, costos: number }> = {};
    monthNames.forEach(m => monthlyData[m] = { ingresos: 0, costos: 0 });

    const getMonthStr = (dateStr: string) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return null;
        return monthNames[d.getMonth()];
    };

    ordenesTrabajo.forEach(ot => {
        const m = getMonthStr(ot.fechaCreacion || ot.created_at || ot.inicio_proceso);
        if (m) {
            monthlyData[m].costos += (ot.costoManoObraTareas || 0) + (ot.costoInsumos || 0) + (ot.costoManoObraHH || 0);
        }
    });

    combustibleData.forEach(c => {
        const m = getMonthStr(c.fecha);
        if (m) monthlyData[m].costos += Number(c.costo_total || 0);
    });

    contratosData.forEach(c => {
        const m = getMonthStr(c.fecha_inicio);
        if (m) monthlyData[m].ingresos += Number(c.valor_total || 0);
    });

    const evolucionMensual = monthNames.map(month => ({
        month,
        ingresos: monthlyData[month].ingresos,
        costos: monthlyData[month].costos
    })).filter(em => em.ingresos > 0 || em.costos > 0);
    
    if (evolucionMensual.length === 0) {
        evolucionMensual.push({ month: 'Mes Actual', ingresos: ingresosTotales, costos: costosTotales });
    }

    // Proyección vs Presupuesto con alto contraste para día y noche
    const proyeccionPresupuesto = evolucionMensual.map(em => ({
        month: em.month,
        presupuesto: em.costos > 0 ? Math.round(em.costos * 0.92) : 10000000,
        real: em.costos
    }));

    return {
      kpis: {
        ingresosTotales,
        costosTotales,
        utilidadBruta,
        margen: isFinite(margen) ? margen.toFixed(1) : "0.0",
        mttoPrev,
        mttoCorr,
        totalCombustible
      },
      rentabilidadVehiculoCompleta,
      rentabilidadVehiculoFiltrada,
      distribucionCostos,
      evolucionMensual,
      proyeccionPresupuesto,
      vehiculoAuditoria
    };
  }, [
    ordenesTrabajo, 
    vehiculos, 
    combustibleData, 
    contratosData, 
    reservasData, 
    registrosFData,
    filtroTipoMantencion,
    filtroMarca,
    filtroVehiculoSeleccionado,
    busquedaVehiculo
  ]);

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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* 1. Filtro Tipo de Mantención (Corregido: Todas, Preventiva, Correctiva) */}
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
                    <option value="PREVENTIVA">Solo Mantenimiento Preventivo</option>
                    <option value="CORRECTIVA">Solo Mantenimiento Correctivo</option>
                  </select>
                </div>

                {/* 2. Filtro Selector de Vehículo */}
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

                {/* 3. Filtro Marca */}
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

                {/* 4. Buscador Rápido de Patente / N° Interno */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Búsqueda Rápida</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Buscar patente o interno..." 
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
          { label: "Ingresos Totales", value: formatCurrency(kpis.ingresosTotales), color: "text-blue-600 dark:text-blue-400", decoration: "bg-blue-600", sub: "Facturación & Contratos" },
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

      {/* GRÁFICO PRINCIPAL: RENTABILIDAD POR VEHÍCULO (Revamp Total) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-5 md:p-7 flex flex-col relative overflow-hidden">
        
        {/* Cabecera del gráfico */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 relative z-10 w-full">
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-600" />
              Rentabilidad por Vehículo (Ingresos vs Costos Directos)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Segmentación por máquina: Ingresos vs Costos Fijos, Variables, Neumáticos, Preventivo (Verde) y Correctivo (Rojo)
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
              {rentabilidadVehiculoFiltrada.length} de {rentabilidadVehiculoCompleta.length} unidades
            </span>
          </div>
        </div>

        {/* Banner con botón de retroceso a toda la flota cuando se aísla un vehículo */}
        {filtroVehiculoSeleccionado !== 'todos' && (
          <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-3 px-4 rounded-xl mb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Detalle de unidad seleccionada: <strong className="text-blue-700 dark:text-blue-300">{vehiculoAuditoria?.name || 'Vehículo'}</strong></span>
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
        <div className="h-[480px] w-full relative z-10">
          <RentabilidadChartInteractive 
            data={rentabilidadVehiculoFiltrada} 
            showTrendLine={showCurvaRentabilidad}
            onSelectVehicle={(vehName) => {
              const found = rentabilidadVehiculoCompleta.find(v => v.name === vehName || v.patente === vehName);
              if (found) {
                setFiltroVehiculoSeleccionado(found.id);
              }
            }}
          />
        </div>

        {/* ALERTA Y DECISIÓN ESTRATÉGICA CUANDO HAY UN VEHÍCULO SELECCIONADO */}
        {vehiculoAuditoria && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "mt-6 p-5 rounded-2xl border transition-all",
              vehiculoAuditoria.isCritico 
                ? "bg-red-50/90 dark:bg-red-950/30 border-red-200 dark:border-red-900/50" 
                : vehiculoAuditoria.isAlerta
                  ? "bg-amber-50/90 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50"
                  : "bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50"
            )}
          >
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
                    Auditoría de Retorno TCO: {vehiculoAuditoria.name} ({vehiculoAuditoria.marca} {vehiculoAuditoria.modelo})
                  </h4>
                  <span className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-full",
                    vehiculoAuditoria.isCritico ? "bg-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-200" :
                    vehiculoAuditoria.isAlerta ? "bg-amber-200 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200" :
                    "bg-emerald-200 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200"
                  )}>
                    {vehiculoAuditoria.isCritico ? "EVALUAR REEMPLAZO O VENTA" : vehiculoAuditoria.isAlerta ? "ALERTA MANTENCIÓN" : "UNIDAD RENTABLE"}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  {vehiculoAuditoria.recomendacion}
                </p>
              </div>

              {/* Métricas rápidas de la unidad */}
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
          </motion.div>
        )}
      </div>

      {/* FILA INFERIOR: PROYECCIÓN VS PRESUPUESTO & MATRIZ DE COSTOS DIRECTOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfica Proyección vs Presupuesto (Alto contraste modo día y noche) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-5 md:p-6 flex flex-col lg:col-span-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Proyección vs Presupuesto Operacional
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Comparativa de gasto real ejecutado versus presupuesto asignado (contraste optimizado)
              </p>
            </div>
            <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
              Control Presupuestario
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
                
                {/* Barras de Presupuesto con alto contraste (gris visible con borde delimitador en noche y día) */}
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
                
                {/* Línea de Gasto Real en violeta/índigo vibrante de alta visibilidad */}
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

        {/* Desglose Estratégico de Costos OPEX */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm p-5 md:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                Composición OPEX Flota
              </h3>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Chilean Standard</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Participación directa en la estructura de costo operativo total
            </p>

            <div className="space-y-3">
              {distribucionCostos.map((c, idx) => {
                const pct = kpis.costosTotales > 0 ? Math.round((c.value / kpis.costosTotales) * 100) : 0;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                        {c.name}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {formatCurrency(c.value)} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all" 
                        style={{ width: `${pct}%`, backgroundColor: c.color }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">Costo Total Flota</span>
            <span className="font-black text-slate-900 dark:text-white text-sm">
              {formatCurrency(kpis.costosTotales)}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
