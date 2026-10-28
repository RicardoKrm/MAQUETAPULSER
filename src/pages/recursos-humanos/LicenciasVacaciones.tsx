import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  FileText,
  Calendar,
  Users,
  Search,
  Filter,
  Download,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HeartPulse,
  Palmtree,
  FileCheck,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { cn } from '../../lib/utils';

interface LicenciaMedica {
  id: string;
  codigoLicencia: string;
  rut: string;
  trabajador: string;
  cargo: string;
  entidadSalud: 'FONASA' | 'Isapre Consalud' | 'Isapre Banmédica' | 'Isapre Colmena';
  tipoLicencia: 'Enfermedad Común' | 'Accidente de Trabajo (Mutual)' | 'Maternal' | 'Patología Laboral';
  fechaInicio: string;
  fechaTermino: string;
  diasOtorgados: number;
  diasRestantes: number;
  estado: 'TRAMITADA_COMPIN' | 'PAGADA' | 'EN_REVISION';
  reemplazoAsignado: string;
}

interface SolicitudVacacion {
  id: string;
  rut: string;
  trabajador: string;
  cargo: string;
  diasAcumulados: number;
  diasSolicitados: number;
  saldoRestante: number;
  fechaInicio: string;
  fechaRetorno: string;
  estado: 'APROBADA' | 'PENDIENTE' | 'RECHAZADA';
  fechaSolicitud: string;
}

export default function LicenciasVacaciones() {
  const [tabActiva, setTabActiva] = useState<'licencias' | 'vacaciones' | 'permisos'>('licencias');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLicencia, setSelectedLicencia] = useState<LicenciaMedica | null>(null);
  const [selectedVacacion, setSelectedVacacion] = useState<SolicitudVacacion | null>(null);

  const licencias: LicenciaMedica[] = [
    {
      id: 'LIC-01',
      codigoLicencia: 'MED-7489201',
      rut: '14.892.341-5',
      trabajador: 'Rodrigo Morales Valenzuela',
      cargo: 'Conductor Alta Montaña',
      entidadSalud: 'FONASA',
      tipoLicencia: 'Enfermedad Común',
      fechaInicio: '2026-10-15',
      fechaTermino: '2026-10-29',
      diasOtorgados: 15,
      diasRestantes: 2,
      estado: 'TRAMITADA_COMPIN',
      reemplazoAsignado: 'Pedro Araya (Conductor Reserva)'
    },
    {
      id: 'LIC-02',
      codigoLicencia: 'MED-8910432',
      rut: '16.890.123-4',
      trabajador: 'Claudio Barraza Lagos',
      cargo: 'Conductor Batea Minera',
      entidadSalud: 'Isapre Consalud',
      tipoLicencia: 'Accidente de Trabajo (Mutual)',
      fechaInicio: '2026-10-20',
      fechaTermino: '2026-11-04',
      diasOtorgados: 15,
      diasRestantes: 8,
      estado: 'TRAMITADA_COMPIN',
      reemplazoAsignado: 'Nelson Carvajal (Conductor Faena)'
    },
    {
      id: 'LIC-03',
      codigoLicencia: 'MED-9021455',
      rut: '17.345.678-9',
      trabajador: 'Jorge Pizarro Araya',
      cargo: 'Mecánico de Mantenimiento',
      entidadSalud: 'Isapre Banmédica',
      tipoLicencia: 'Enfermedad Común',
      fechaInicio: '2026-10-26',
      fechaTermino: '2026-10-31',
      diasOtorgados: 6,
      diasRestantes: 4,
      estado: 'EN_REVISION',
      reemplazoAsignado: 'Taller Central Pozo Almonte'
    }
  ];

  const vacaciones: SolicitudVacacion[] = [
    {
      id: 'VAC-01',
      rut: '16.245.981-2',
      trabajador: 'Héctor Valenzuela Garrido',
      cargo: 'Conductor Carretera',
      diasAcumulados: 22,
      diasSolicitados: 10,
      saldoRestante: 12,
      fechaInicio: '2026-11-02',
      fechaRetorno: '2026-11-16',
      estado: 'APROBADA',
      fechaSolicitud: '2026-10-20'
    },
    {
      id: 'VAC-02',
      rut: '17.112.540-3',
      trabajador: 'Alexis Vilches Hidalgo',
      cargo: 'Jefe de Taller & Neumáticos',
      diasAcumulados: 18,
      diasSolicitados: 5,
      saldoRestante: 13,
      fechaInicio: '2026-11-09',
      fechaRetorno: '2026-11-16',
      estado: 'PENDIENTE',
      fechaSolicitud: '2026-10-24'
    },
    {
      id: 'VAC-03',
      rut: '15.632.119-K',
      trabajador: 'Carlos Colque Mamani',
      cargo: 'Conductor Tolva Cordillera',
      diasAcumulados: 15,
      diasSolicitados: 7,
      saldoRestante: 8,
      fechaInicio: '2026-12-01',
      fechaRetorno: '2026-12-10',
      estado: 'APROBADA',
      fechaSolicitud: '2026-10-18'
    }
  ];

  const filteredLicencias = licencias.filter(l =>
    l.trabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.codigoLicencia.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.rut.includes(searchTerm)
  );

  const filteredVacaciones = vacaciones.filter(v =>
    v.trabajador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.rut.includes(searchTerm)
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <HeartPulse className="h-6 w-6 text-red-600 dark:text-red-500" />
            Licencias Médicas, Vacaciones & Permisos
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Gestión y control de ausentismo laboral, saldo de vacaciones legales y reemplazos operacionales de flota
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setTabActiva('licencias')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition",
              tabActiva === 'licencias' ? "bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <HeartPulse className="w-4 h-4" /> Licencias Médicas ({licencias.length})
          </button>
          <button
            onClick={() => setTabActiva('vacaciones')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition",
              tabActiva === 'vacaciones' ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Palmtree className="w-4 h-4" /> Vacaciones Legales ({vacaciones.length})
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Licencias Activas</p>
                <h3 className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">3 vigentes</h3>
              </div>
              <div className="p-2.5 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">100% con reemplazo asignado</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Índice de Ausentismo</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">3.4%</h3>
              </div>
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-2">Bajo el promedio del sector minero (5.2%)</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vacaciones Solicitadas</p>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">22 días</h3>
              </div>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                <Palmtree className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Planificación de Noviembre y Diciembre</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cobertura de Flota</p>
                <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">100%</h3>
              </div>
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">0 camiones detenidos por personal</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab: Licencias Médicas */}
      {tabActiva === 'licencias' && (
        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Registro de Licencias Médicas Activas & Tramitación
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Seguimiento de licencias FONASA/ISAPRE, días de reposo y asignación de chofer de relevo
              </p>
            </div>
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por código, trabajador o RUT..."
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
                    <th className="py-3 px-4">Código & Salud</th>
                    <th className="py-3 px-4">Trabajador & RUT</th>
                    <th className="py-3 px-4">Tipo de Licencia</th>
                    <th className="py-3 px-4">Período de Reposo</th>
                    <th className="py-3 px-4">Días Otorgados</th>
                    <th className="py-3 px-4">Días Restantes</th>
                    <th className="py-3 px-4">Reemplazo en Faena</th>
                    <th className="py-3 px-4">Estado COMPIN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredLicencias.map((lic) => (
                    <tr key={lic.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block">{lic.codigoLicencia}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{lic.entidadSalud}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{lic.trabajador}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{lic.rut}</div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700 dark:text-slate-300">
                        {lic.tipoLicencia}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 dark:text-slate-200 font-bold">{lic.fechaInicio} al {lic.fechaTermino}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {lic.diasOtorgados} días
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded font-bold text-xs",
                          lic.diasRestantes <= 3 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" :
                          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                        )}>
                          {lic.diasRestantes} días
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block">{lic.reemplazoAsignado}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge className={cn(
                          "text-[10px] font-bold",
                          lic.estado === 'TRAMITADA_COMPIN' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" :
                          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        )}>
                          {lic.estado}
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

      {/* Tab: Vacaciones Legales */}
      {tabActiva === 'vacaciones' && (
        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Control de Vacaciones Legales & Progresivas (Chile)
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Saldo de días devengados, solicitudes aprobadas y programación de descanso
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
                    <th className="py-3 px-4">Días Acumulados</th>
                    <th className="py-3 px-4">Días Solicitados</th>
                    <th className="py-3 px-4">Saldo Remanente</th>
                    <th className="py-3 px-4">Período de Salida</th>
                    <th className="py-3 px-4">Fecha Retorno</th>
                    <th className="py-3 px-4">Estado Solicitud</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {filteredVacaciones.map((vac) => (
                    <tr key={vac.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">{vac.trabajador}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{vac.rut}</div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                        {vac.cargo}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-blue-600 dark:text-blue-400">
                        {vac.diasAcumulados} días hábiles
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        {vac.diasSolicitados} días
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        {vac.saldoRestante} días
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                        {vac.fechaInicio}
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                        {vac.fechaRetorno}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge className={cn(
                          "text-[10px] font-bold",
                          vac.estado === 'APROBADA' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" :
                          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        )}>
                          {vac.estado}
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
    </div>
  );
}
