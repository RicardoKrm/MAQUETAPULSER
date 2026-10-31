import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  Truck,
  ShieldCheck,
  Download,
  Calendar,
  Layers,
  BarChart3,
  Percent
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useCompany } from '../../contexts/CompanyContext';
import { cn } from '../../lib/utils';

export default function DashboardFinanzas() {
  const { currentCompany } = useCompany();
  const [periodo, setPeriodo] = useState('2026-10'); // Octubre 2026
  const [moneda, setMoneda] = useState<'CLP' | 'UF'>('CLP');

  const isGavalDemo = currentCompany?.id === '161a47ac-9c63-435d-ab55-a6163a6805ab' || currentCompany?.name?.toLowerCase().includes('demo');

  // Datos financieros consolidados del mes de Octubre 2026 (Transporte Minero) - Solo para Gaval Demo
  const metricas = isGavalDemo ? {
    ingresosTotales: 148500000,
    costosOperacionales: 94200000,
    margenBruto: 54300000,
    margenBrutoPct: 36.6,
    gastosGA: 12450000,
    ebitda: 41850000,
    ebitdaPct: 28.2,
    kmTotalesMes: 125840,
    costoPorKm: 748, // OPEX / km
    ingresoPorKm: 1180, // Fact / km
    margenPorKm: 432,
    litrosCombustible: 48600,
    rendimientoCombustible: 2.59 // km/L
  } : {
    ingresosTotales: 0,
    costosOperacionales: 0,
    margenBruto: 0,
    margenBrutoPct: 0,
    gastosGA: 0,
    ebitda: 0,
    ebitdaPct: 0,
    kmTotalesMes: 0,
    costoPorKm: 0,
    ingresoPorKm: 0,
    margenPorKm: 0,
    litrosCombustible: 0,
    rendimientoCombustible: 0
  };

  // Desglose de Ingresos por Contrato Minero
  const ingresosPorContrato = isGavalDemo ? [
    {
      contrato: 'Minera Doña Inés de Collahuasi',
      faena: 'Cordillera / Ujina',
      monto: 74200000,
      porcentaje: 50.0,
      flotaAsignada: 14,
      estado: 'Al Día',
      cumplimiento: 98.4
    },
    {
      contrato: 'Minera Teck Quebrada Blanca 2',
      faena: 'Alta Montaña QB2',
      monto: 52800000,
      porcentaje: 35.6,
      flotaAsignada: 10,
      estado: 'Al Día',
      cumplimiento: 96.8
    },
    {
      contrato: 'Servicios Spot & Terminal Patillos',
      faena: 'Costa / Puerto',
      monto: 21500000,
      porcentaje: 14.4,
      flotaAsignada: 6,
      estado: 'Al Día',
      cumplimiento: 95.0
    }
  ] : [];

  // Desglose de Costos Directos OPEX
  const desgloseOpex = isGavalDemo ? [
    { item: 'Combustible Diésel (ENAP / Copec)', monto: 39560000, porcentaje: 42.0, color: '#3b82f6' },
    { item: 'Remuneraciones & Viáticos Tripulación', monto: 20720000, porcentaje: 22.0, color: '#10b981' },
    { item: 'Mantenimiento Preventivo & Correctivo OTs', monto: 16010000, porcentaje: 17.0, color: '#f59e0b' },
    { item: 'Neumáticos Nuevos & Recauchaje Bandag', monto: 10360000, porcentaje: 11.0, color: '#8b5cf6' },
    { item: 'Peajes, TAG & Pesajes MOP', monto: 4710000, porcentaje: 5.0, color: '#ec4899' },
    { item: 'Seguros de Flota & Permisos Mineros', monto: 2840000, porcentaje: 3.0, color: '#64748b' }
  ] : [];

  // Tendencia Mensual Histórica Enero - Octubre 2026
  const evolucionMensual = isGavalDemo ? [
    { mes: 'Ene', ingresos: 122000000, costos: 81000000, margen: 41000000, ebitda: 31000000 },
    { mes: 'Feb', ingresos: 128000000, costos: 83500000, margen: 44500000, ebitda: 33200000 },
    { mes: 'Mar', ingresos: 135000000, costos: 87000000, margen: 48000000, ebitda: 36500000 },
    { mes: 'Abr', ingresos: 131000000, costos: 85200000, margen: 45800000, ebitda: 34800000 },
    { mes: 'May', ingresos: 139000000, costos: 89000000, margen: 50000000, ebitda: 38200000 },
    { mes: 'Jun', ingresos: 142000000, costos: 91500000, margen: 50500000, ebitda: 38900000 },
    { mes: 'Jul', ingresos: 140000000, costos: 90200000, margen: 49800000, ebitda: 38100000 },
    { mes: 'Ago', ingresos: 145000000, costos: 92800000, margen: 52200000, ebitda: 40100000 },
    { mes: 'Sep', ingresos: 143000000, costos: 91200000, margen: 51800000, ebitda: 39800000 },
    { mes: 'Oct', ingresos: 148500000, costos: 94200000, margen: 54300000, ebitda: 41850000 }
  ] : [];

  // Estados de Pago / Facturación Activa
  const estadosDePago = isGavalDemo ? [
    {
      folio: 'EP-COL-2026-10',
      cliente: 'Minera Doña Inés de Collahuasi SCM',
      faena: 'Transporte Concentrado Ujina',
      montoNeto: 74200000,
      iva: 14098000,
      total: 88298000,
      fechaEmision: '2026-10-25',
      fechaVencimiento: '2026-11-25',
      estado: 'APROBADO',
      diasCobro: 30
    },
    {
      folio: 'EP-TECK-2026-10',
      cliente: 'Teck Quebrada Blanca S.A.',
      faena: 'Movimiento Concentrado & Áridos QB2',
      montoNeto: 52800000,
      iva: 10032000,
      total: 62832000,
      fechaEmision: '2026-10-22',
      fechaVencimiento: '2026-11-22',
      estado: 'EN_REVISION',
      diasCobro: 30
    },
    {
      folio: 'EP-PAT-2026-10',
      cliente: 'Consorcio Portuario Patillos SpA',
      faena: 'Servicio Spot Embarque Granel',
      montoNeto: 21500000,
      iva: 4085000,
      total: 25585000,
      fechaEmision: '2026-10-18',
      fechaVencimiento: '2026-11-18',
      estado: 'PAGADO',
      diasCobro: 0
    }
  ] : [];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
            Control Financiero & Rentabilidad ERP
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Estado de resultados integral (P&L), desglose de OPEX de flota, flujo de caja y rentabilidad por contrato minero
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setPeriodo('2026-10')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${periodo === '2026-10' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Octubre 2026
            </button>
            <button
              onClick={() => setPeriodo('2026-09')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${periodo === '2026-09' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Septiembre 2026
            </button>
            <button
              onClick={() => setPeriodo('2026-YTD')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${periodo === '2026-YTD' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Acumulado 2026
            </button>
          </div>
          <Button variant="outline" className="flex items-center gap-2 text-xs font-bold">
            <Download className="w-4 h-4" /> Exportar P&L (Excel)
          </Button>
        </div>
      </div>

      {/* KPI Cards Top Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white border-none shadow-md">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-100 text-xs font-bold uppercase tracking-wider">Ingresos Netos</p>
                <h3 className="text-2xl sm:text-3xl font-black mt-1">
                  ${metricas.ingresosTotales.toLocaleString('es-CL')}
                </h3>
              </div>
              <div className="p-2.5 bg-white/20 rounded-lg">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-emerald-100 font-medium">
              <span className="font-bold text-white bg-white/20 px-1.5 py-0.5 rounded">+14.2%</span>
              <span>vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Costos Directos (OPEX)</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white mt-1">
                  ${metricas.costosOperacionales.toLocaleString('es-CL')}
                </h3>
              </div>
              <div className="p-2.5 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
              <span className="font-bold text-red-600 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded">63.4%</span>
              <span>de los ingresos totales</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Margen Bruto Flota</p>
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                  ${metricas.margenBruto.toLocaleString('es-CL')}
                </h3>
              </div>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                <Percent className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
              <span className="font-black text-emerald-600">{metricas.margenBrutoPct}%</span>
              <span>margen bruto operacional</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">EBITDA Operacional</p>
                <h3 className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                  ${metricas.ebitda.toLocaleString('es-CL')}
                </h3>
              </div>
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                <BarChart3 className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
              <span className="font-black text-blue-600">{metricas.ebitdaPct}%</span>
              <span>margen EBITDA minero</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Unit Economics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-600"><Truck className="w-4 h-4" /></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Km Totales Mes</span>
            <span className="font-black text-slate-800 dark:text-slate-100 text-sm">{metricas.kmTotalesMes.toLocaleString('es-CL')} km</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600"><DollarSign className="w-4 h-4" /></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Ingreso por Km</span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">${metricas.ingresoPorKm} / km</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg text-red-600"><TrendingDown className="w-4 h-4" /></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Costo OPEX por Km</span>
            <span className="font-black text-red-600 dark:text-red-400 text-sm">${metricas.costoPorKm} / km</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg text-purple-600"><TrendingUp className="w-4 h-4" /></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Margen Neto por Km</span>
            <span className="font-black text-purple-600 dark:text-purple-400 text-sm">${metricas.margenPorKm} / km</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Composed Chart: Evolución Ingresos vs Costos vs Margen */}
        <Card className="col-span-full lg:col-span-2 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Evolución de Ingresos, Costos y Margen Bruto (2026)
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Valores expresados en millones de pesos chilenos ($MM)
              </p>
            </div>
            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 text-xs">
              Ene - Oct 2026
            </Badge>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={evolucionMensual} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="mes" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    tickFormatter={(v) => `$${v / 1000000}M`}
                  />
                  <Tooltip 
                    formatter={(v: any) => [`$${Number(v).toLocaleString('es-CL')}`, '']}
                    contentStyle={{ borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="costos" name="Costos OPEX" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="ingresos" name="Ingresos Facturados" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Line type="monotone" dataKey="margen" name="Margen Bruto" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Donut Chart: Distribución del Gasto Operativo (OPEX) */}
        <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-purple-600" />
              Estructura OPEX Flota
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Desglose porcentual del gasto directo
            </p>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={desgloseOpex}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="porcentaje"
                  >
                    {desgloseOpex.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v}%`, 'Participación']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {desgloseOpex.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 dark:text-slate-300 truncate">{item.item}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 dark:text-white">{item.porcentaje}%</span>
                    <span className="text-[10px] text-slate-400 block">${(item.monto / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* P&L Table: Desglose por Contrato Minero */}
      <Card className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            Rentabilidad por Contrato y Centro de Costo (Octubre 2026)
          </CardTitle>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ingresos, flota asignada y nivel de cumplimiento operacional por cliente minero
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Contrato Minero</th>
                  <th className="py-3 px-4">Faena / Destino</th>
                  <th className="py-3 px-4">Flota Dedicada</th>
                  <th className="py-3 px-4">Facturación Mensual</th>
                  <th className="py-3 px-4">Participación</th>
                  <th className="py-3 px-4">Cumplimiento SLA</th>
                  <th className="py-3 px-4">Estado Cobranza</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {ingresosPorContrato.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {c.contrato}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {c.faena}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                        {c.flotaAsignada} Tractocamiones
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white text-sm">
                      ${c.monto.toLocaleString('es-CL')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                      {c.porcentaje}%
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-emerald-600">{c.cumplimiento}%</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 text-[10px] font-bold">
                        {c.estado}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Estados de Pago y Facturación */}
      <Card className="shadow-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Estados de Pago Aprobados & Cartera de Clientes
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Control documental de facturas emitidas, ciclo de aprobación y vencimiento de pago
            </p>
          </div>
          <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200">
            3 Estados de Pago Activos
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Folio EP</th>
                  <th className="py-3 px-4">Cliente / Mandante</th>
                  <th className="py-3 px-4">Servicio Contratado</th>
                  <th className="py-3 px-4">Monto Neto</th>
                  <th className="py-3 px-4">Total c/IVA</th>
                  <th className="py-3 px-4">Fecha Emisión</th>
                  <th className="py-3 px-4">Vencimiento</th>
                  <th className="py-3 px-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {estadosDePago.map((ep, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {ep.folio}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {ep.cliente}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {ep.faena}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      ${ep.montoNeto.toLocaleString('es-CL')}
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white text-sm">
                      ${ep.total.toLocaleString('es-CL')}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {ep.fechaEmision}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {ep.fechaVencimiento}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px]",
                        ep.estado === 'PAGADO' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                        ep.estado === 'APROBADO' ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                        "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      )}>
                        {ep.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
