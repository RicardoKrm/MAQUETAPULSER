import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  DollarSign,
  FileText,
  Download,
  Users,
  Search,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Building,
  Calendar,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { cn } from '../../lib/utils';

interface LiquidacionSueldo {
  id: string;
  rut: string;
  trabajador: string;
  cargo: string;
  afp: string;
  salud: string;
  sueldoBase: number;
  gratificacion: number;
  bonoProduccionMinera: number;
  viaticoRuta: number;
  totalHaberes: number;
  totalDescuentos: number;
  liquidoPagar: number;
  estado: 'PAGADA' | 'POR_PAGAR';
  fechaPago: string;
}

interface PrestamoEmpresa {
  id: string;
  rut: string;
  trabajador: string;
  montoSolicitado: number;
  cuotasTotales: number;
  cuotasPagadas: number;
  valorCuota: number;
  saldoPendiente: number;
  motivo: string;
  estado: 'ACTIVO' | 'PAGADO';
  fechaInicio: string;
}

export default function RemuneracionesPrestamos() {
  const [tabActiva, setTabActiva] = useState<'liquidaciones' | 'prestamos'>('liquidaciones');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLiquidacion, setSelectedLiquidacion] = useState<LiquidacionSueldo | null>(null);

  const liquidaciones: LiquidacionSueldo[] = [
    {
      id: 'LIQ-01',
      rut: '14.892.341-5',
      trabajador: 'Rodrigo Morales Valenzuela',
      cargo: 'Conductor Alta Montaña (7x7)',
      afp: 'AFP Cuprum (11.44%)',
      salud: 'FONASA (7%)',
      sueldoBase: 950000,
      gratificacion: 215000,
      bonoProduccionMinera: 380000,
      viaticoRuta: 250000,
      totalHaberes: 1795000,
      totalDescuentos: 320000,
      liquidoPagar: 1475000,
      estado: 'PAGADA',
      fechaPago: '2026-10-05'
    },
    {
      id: 'LIQ-02',
      rut: '16.245.981-2',
      trabajador: 'Héctor Valenzuela Garrido',
      cargo: 'Conductor Carretera (5x2)',
      afp: 'AFP Habitat (11.27%)',
      salud: 'Isapre Consalud',
      sueldoBase: 850000,
      gratificacion: 215000,
      bonoProduccionMinera: 280000,
      viaticoRuta: 180000,
      totalHaberes: 1525000,
      totalDescuentos: 285000,
      liquidoPagar: 1240000,
      estado: 'PAGADA',
      fechaPago: '2026-10-05'
    },
    {
      id: 'LIQ-03',
      rut: '15.632.119-K',
      trabajador: 'Carlos Colque Mamani',
      cargo: 'Conductor Batea Minera',
      afp: 'AFP Provida (11.45%)',
      salud: 'FONASA (7%)',
      sueldoBase: 920000,
      gratificacion: 215000,
      bonoProduccionMinera: 340000,
      viaticoRuta: 220000,
      totalHaberes: 1695000,
      totalDescuentos: 305000,
      liquidoPagar: 1390000,
      estado: 'PAGADA',
      fechaPago: '2026-10-05'
    },
    {
      id: 'LIQ-04',
      rut: '17.112.540-3',
      trabajador: 'Alexis Vilches Hidalgo',
      cargo: 'Jefe de Taller & Neumáticos',
      afp: 'AFP PlanVital (11.16%)',
      salud: 'Isapre Banmédica',
      sueldoBase: 1100000,
      gratificacion: 215000,
      bonoProduccionMinera: 250000,
      viaticoRuta: 100000,
      totalHaberes: 1665000,
      totalDescuentos: 310000,
      liquidoPagar: 1355000,
      estado: 'PAGADA',
      fechaPago: '2026-10-05'
    }
  ];

  const prestamos: PrestamoEmpresa[] = [
    {
      id: 'PREST-01',
      rut: '14.892.341-5',
      trabajador: 'Rodrigo Morales Valenzuela',
      montoSolicitado: 800000,
      cuotasTotales: 8,
      cuotasPagadas: 5,
      valorCuota: 100000,
      saldoPendiente: 300000,
      motivo: 'Emergencia Médica Familiar',
      estado: 'ACTIVO',
      fechaInicio: '2026-05-01'
    },
    {
      id: 'PREST-02',
      rut: '15.632.119-K',
      trabajador: 'Carlos Colque Mamani',
      montoSolicitado: 600000,
      cuotasTotales: 6,
      cuotasPagadas: 6,
      valorCuota: 100000,
      saldoPendiente: 0,
      motivo: 'Matrícula Universitaria Hijo',
      estado: 'PAGADO',
      fechaInicio: '2026-03-01'
    },
    {
      id: 'PREST-03',
      rut: '16.245.981-2',
      trabajador: 'Héctor Valenzuela Garrido',
      montoSolicitado: 500000,
      cuotasTotales: 5,
      cuotasPagadas: 2,
      valorCuota: 100000,
      saldoPendiente: 300000,
      motivo: 'Reparación Vivienda',
      estado: 'ACTIVO',
      fechaInicio: '2026-08-01'
    }
  ];

  const totalNominaLiquida = liquidaciones.reduce((sum, l) => sum + l.liquidoPagar, 0);
  const totalCarteraPrestamos = prestamos.reduce((sum, p) => sum + p.saldoPendiente, 0);

  const filteredLiquidaciones = liquidaciones.filter(l =>
    l.trabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.rut.includes(searchTerm)
  );

  const filteredPrestamos = prestamos.filter(p =>
    p.trabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.rut.includes(searchTerm)
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
            Remuneraciones, Liquidaciones & Préstamos
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Nómina de sueldos, haberes de faena minera, viáticos, descuentos legales y préstamos de empresa
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2 text-xs font-bold">
            <Download className="w-4 h-4" /> Exportar Previred
          </Button>
          <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm">
            <FileSpreadsheet className="w-4 h-4" /> Integración ERP (Buk/Talana)
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 w-fit">
        <button
          onClick={() => setTabActiva('liquidaciones')}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs transition",
            tabActiva === 'liquidaciones' ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500 hover:text-slate-800"
          )}
        >
          <FileText className="w-4 h-4" /> Liquidaciones de Sueldo ({liquidaciones.length})
        </button>
        <button
          onClick={() => setTabActiva('prestamos')}
          className={cn(
            "flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs transition",
            tabActiva === 'prestamos' ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-800"
          )}
        >
          <CreditCard className="w-4 h-4" /> Préstamos & Anticipos ({prestamos.length})
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nómina Líquida Mensual</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                  ${(totalNominaLiquida * 6.8).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </h3>
              </div>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Pagada al día
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cartera Préstamos Activa</p>
                <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                  ${totalCarteraPrestamos.toLocaleString('es-CL')}
                </h3>
              </div>
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Deducción mensual por planilla</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Viáticos de Faena Minera</p>
                <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">$4.850.000</h3>
              </div>
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Colación y alojamiento en ruta</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leyes Sociales Previred</p>
                <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">Declaradas</h3>
              </div>
              <div className="p-2.5 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600">
                <Building className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-2">Sin deudas previsionales</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab: Liquidaciones de Sueldo */}
      {tabActiva === 'liquidaciones' && (
        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Liquidaciones de Sueldo (Octubre 2026)
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Haberes imponibles, bonos de producción, viáticos de ruta y descuentos de ley
              </p>
            </div>
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar trabajador o RUT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Trabajador & RUT</th>
                    <th className="py-3 px-4">Cargo</th>
                    <th className="py-3 px-4">Previsión / Salud</th>
                    <th className="py-3 px-4">Sueldo Base</th>
                    <th className="py-3 px-4">Bono Minero</th>
                    <th className="py-3 px-4">Viático Ruta</th>
                    <th className="py-3 px-4">Líquido a Pago</th>
                    <th className="py-3 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredLiquidaciones.map((liq) => (
                    <tr key={liq.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{liq.trabajador}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{liq.rut}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {liq.cargo}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-700 dark:text-slate-300">{liq.afp}</div>
                        <div className="text-[10px] text-slate-400">{liq.salud}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        ${liq.sueldoBase.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        +${liq.bonoProduccionMinera.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-blue-600">
                        +${liq.viaticoRuta.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3.5 px-4 font-black text-slate-900 dark:text-white text-sm">
                        ${liq.liquidoPagar.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedLiquidacion(liq)}
                          className="px-2.5 py-1 text-xs font-bold text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-lg transition"
                        >
                          Ver Liquidación
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab: Préstamos de Empresa */}
      {tabActiva === 'prestamos' && (
        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Control de Préstamos y Anticipos de Empresa
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Seguimiento de cuotas pactadas, amortización y saldo deudor de trabajadores
              </p>
            </div>
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar trabajador o RUT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Trabajador & RUT</th>
                    <th className="py-3 px-4">Motivo Préstamo</th>
                    <th className="py-3 px-4">Monto Solicitado</th>
                    <th className="py-3 px-4">Progreso Cuotas</th>
                    <th className="py-3 px-4">Valor Cuota Mensual</th>
                    <th className="py-3 px-4">Saldo Pendiente</th>
                    <th className="py-3 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredPrestamos.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{p.trabajador}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{p.rut}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {p.motivo}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        ${p.montoSolicitado.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-blue-600">
                          {p.cuotasPagadas} de {p.cuotasTotales} cuotas
                        </span>
                        <div className="w-20 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                          <div 
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${(p.cuotasPagadas / p.cuotasTotales) * 100}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        ${p.valorCuota.toLocaleString('es-CL')} / mes
                      </td>
                      <td className="py-3.5 px-4 font-black text-red-600 dark:text-red-400">
                        ${p.saldoPendiente.toLocaleString('es-CL')}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge className={cn(
                          "text-[10px] font-bold",
                          p.estado === 'PAGADO' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" :
                          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        )}>
                          {p.estado}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal Liquidación Detallada */}
      {selectedLiquidacion && (
        <Modal
          isOpen={!!selectedLiquidacion}
          onClose={() => setSelectedLiquidacion(null)}
          title={`Liquidación de Sueldo: ${selectedLiquidacion.trabajador}`}
        >
          <div className="space-y-4 p-2 text-sm">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase block">Trabajador</span>
                <span className="font-bold text-slate-900 dark:text-white text-base block">{selectedLiquidacion.trabajador}</span>
                <span className="text-xs font-mono text-slate-500">{selectedLiquidacion.rut} | {selectedLiquidacion.cargo}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-bold uppercase block">Período</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Octubre 2026</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Haberes */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block border-b pb-1">
                  1. Haberes Imponibles & No Imponibles
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Sueldo Base</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">${selectedLiquidacion.sueldoBase.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Gratificación Legal</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">${selectedLiquidacion.gratificacion.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Bono Producción Minera</span>
                    <span className="font-bold text-emerald-600">${selectedLiquidacion.bonoProduccionMinera.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Viático de Ruta</span>
                    <span className="font-bold text-blue-600">${selectedLiquidacion.viaticoRuta.toLocaleString('es-CL')}</span>
                  </div>
                  <div className="border-t pt-1.5 flex justify-between font-black text-slate-900 dark:text-white text-xs">
                    <span>Total Haberes:</span>
                    <span>${selectedLiquidacion.totalHaberes.toLocaleString('es-CL')}</span>
                  </div>
                </div>
              </div>

              {/* Descuentos */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-2">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider block border-b pb-1">
                  2. Descuentos Previsionales & Ley
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">{selectedLiquidacion.afp}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">$132.800</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">{selectedLiquidacion.salud}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">$81.550</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Seguro Cesantía (AFC 0.6%)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">$6.990</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Impuesto Único 2da Cat.</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">$18.660</span>
                  </div>
                  <div className="border-t pt-1.5 flex justify-between font-black text-red-600 text-xs">
                    <span>Total Descuentos:</span>
                    <span>${selectedLiquidacion.totalDescuentos.toLocaleString('es-CL')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Líquido */}
            <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-xs text-emerald-700 dark:text-emerald-300 font-bold uppercase block">Alcance Líquido a Transferir</span>
                <span className="text-[11px] text-slate-500">Banco Santander | Cuenta Corriente</span>
              </div>
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                ${selectedLiquidacion.liquidoPagar.toLocaleString('es-CL')}
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedLiquidacion(null)}>Cerrar</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5">
                <Printer className="w-4 h-4" /> Descargar PDF Firmado
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
