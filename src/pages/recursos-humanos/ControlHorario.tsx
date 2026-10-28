import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Users,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  Building,
  MapPin,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  History,
  Timer
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { cn } from '../../lib/utils';

interface RegistroAsistencia {
  id: string;
  rut: string;
  nombre: string;
  cargo: string;
  tipoJornada: '7x7 Faena Minera' | '5x2 Administrativo' | '4x3 Turno';
  horasSemanales: number;
  horasExtras50: number;
  horasExtras100: number;
  atrasoMinutos: number;
  estadoLey40Horas: 'CUMPLE' | 'ALERTA_SOBRETIEMPO' | 'EN_TURNO_7x7';
  ultimoMarcaje: {
    tipo: 'ENTRADA' | 'SALIDA' | 'COLACION_INICIO' | 'COLACION_FIN';
    hora: string;
    fecha: string;
    ubicacion: string;
    geolocalizado: boolean;
  };
  asistenciaSemanal: { dia: string; horas: number; status: 'asistio' | 'descanso' | 'falta' }[];
}

export default function ControlHorario() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroJornada, setFiltroJornada] = useState('TODAS');
  const [selectedTrabajador, setSelectedTrabajador] = useState<RegistroAsistencia | null>(null);

  const trabajadoresAsistencia: RegistroAsistencia[] = [
    {
      id: 'TRAB-01',
      rut: '14.892.341-5',
      nombre: 'Rodrigo Morales Valenzuela',
      cargo: 'Conductor Alta Montaña (Volvo FH)',
      tipoJornada: '7x7 Faena Minera',
      horasSemanales: 42,
      horasExtras50: 4.5,
      horasExtras100: 0,
      atrasoMinutos: 0,
      estadoLey40Horas: 'EN_TURNO_7x7',
      ultimoMarcaje: {
        tipo: 'ENTRADA',
        hora: '07:45:12',
        fecha: '2026-10-28',
        ubicacion: 'Garita Faena Ujina (Collahuasi)',
        geolocalizado: true
      },
      asistenciaSemanal: [
        { dia: 'Lun', horas: 12, status: 'asistio' },
        { dia: 'Mar', horas: 12, status: 'asistio' },
        { dia: 'Mié', horas: 12, status: 'asistio' },
        { dia: 'Jue', horas: 6, status: 'asistio' },
        { dia: 'Vie', horas: 0, status: 'descanso' },
        { dia: 'Sáb', horas: 0, status: 'descanso' },
        { dia: 'Dom', horas: 0, status: 'descanso' }
      ]
    },
    {
      id: 'TRAB-02',
      rut: '16.245.981-2',
      nombre: 'Héctor Valenzuela Garrido',
      cargo: 'Conductor Carretera (Scania R500)',
      tipoJornada: '5x2 Administrativo',
      horasSemanales: 39.5,
      horasExtras50: 1.5,
      horasExtras100: 0,
      atrasoMinutos: 8,
      estadoLey40Horas: 'CUMPLE',
      ultimoMarcaje: {
        tipo: 'ENTRADA',
        hora: '08:08:22',
        fecha: '2026-10-28',
        ubicacion: 'Terminal Central Pozo Almonte',
        geolocalizado: true
      },
      asistenciaSemanal: [
        { dia: 'Lun', horas: 8, status: 'asistio' },
        { dia: 'Mar', horas: 8, status: 'asistio' },
        { dia: 'Mié', horas: 8, status: 'asistio' },
        { dia: 'Jue', horas: 8, status: 'asistio' },
        { dia: 'Vie', horas: 7.5, status: 'asistio' },
        { dia: 'Sáb', horas: 0, status: 'descanso' },
        { dia: 'Dom', horas: 0, status: 'descanso' }
      ]
    },
    {
      id: 'TRAB-03',
      rut: '15.632.119-K',
      nombre: 'Carlos Colque Mamani',
      cargo: 'Conductor Batea Minera',
      tipoJornada: '7x7 Faena Minera',
      horasSemanales: 46,
      horasExtras50: 8.0,
      horasExtras100: 2.0,
      atrasoMinutos: 0,
      estadoLey40Horas: 'ALERTA_SOBRETIEMPO',
      ultimoMarcaje: {
        tipo: 'ENTRADA',
        hora: '07:30:05',
        fecha: '2026-10-28',
        ubicacion: 'Plataforma QB2 Alta Montaña',
        geolocalizado: true
      },
      asistenciaSemanal: [
        { dia: 'Lun', horas: 12, status: 'asistio' },
        { dia: 'Mar', horas: 12, status: 'asistio' },
        { dia: 'Mié', horas: 12, status: 'asistio' },
        { dia: 'Jue', horas: 10, status: 'asistio' },
        { dia: 'Vie', horas: 0, status: 'descanso' },
        { dia: 'Sáb', horas: 0, status: 'descanso' },
        { dia: 'Dom', horas: 0, status: 'descanso' }
      ]
    },
    {
      id: 'TRAB-04',
      rut: '17.112.540-3',
      nombre: 'Alexis Vilches Hidalgo',
      cargo: 'Jefe de Taller & Neumáticos',
      tipoJornada: '5x2 Administrativo',
      horasSemanales: 40.0,
      horasExtras50: 2.0,
      horasExtras100: 0,
      atrasoMinutos: 0,
      estadoLey40Horas: 'CUMPLE',
      ultimoMarcaje: {
        tipo: 'COLACION_FIN',
        hora: '14:02:15',
        fecha: '2026-10-28',
        ubicacion: 'Taller Central Pozo Almonte',
        geolocalizado: true
      },
      asistenciaSemanal: [
        { dia: 'Lun', horas: 8, status: 'asistio' },
        { dia: 'Mar', horas: 8, status: 'asistio' },
        { dia: 'Mié', horas: 8, status: 'asistio' },
        { dia: 'Jue', horas: 8, status: 'asistio' },
        { dia: 'Vie', horas: 8, status: 'asistio' },
        { dia: 'Sáb', horas: 0, status: 'descanso' },
        { dia: 'Dom', horas: 0, status: 'descanso' }
      ]
    },
    {
      id: 'TRAB-05',
      rut: '13.901.884-8',
      nombre: 'Juan Mamani Flores',
      cargo: 'Conductor Tolva / Pesaje Patillos',
      tipoJornada: '4x3 Turno',
      horasSemanales: 38.0,
      horasExtras50: 0,
      horasExtras100: 0,
      atrasoMinutos: 15,
      estadoLey40Horas: 'CUMPLE',
      ultimoMarcaje: {
        tipo: 'ENTRADA',
        hora: '08:15:00',
        fecha: '2026-10-28',
        ubicacion: 'Garita Acceso Puerto Patillos',
        geolocalizado: true
      },
      asistenciaSemanal: [
        { dia: 'Lun', horas: 9.5, status: 'asistio' },
        { dia: 'Mar', horas: 9.5, status: 'asistio' },
        { dia: 'Mié', horas: 9.5, status: 'asistio' },
        { dia: 'Jue', horas: 9.5, status: 'asistio' },
        { dia: 'Vie', horas: 0, status: 'descanso' },
        { dia: 'Sáb', horas: 0, status: 'descanso' },
        { dia: 'Dom', horas: 0, status: 'descanso' }
      ]
    }
  ];

  const filtered = trabajadoresAsistencia.filter(t => {
    const matchesSearch = t.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          t.rut.includes(searchTerm) ||
                          t.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesJornada = filtroJornada === 'TODAS' || t.tipoJornada === filtroJornada;
    return matchesSearch && matchesJornada;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            Control Horario, Asistencia & Ley 40 Horas
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Sistema de registro y fiscalización de asistencia conforme a la normativa DT y jornadas mineras (7x7, 5x2, 4x3)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2 text-xs font-bold">
            <Download className="w-4 h-4" /> Libro de Asistencia DT
          </Button>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm">
            <FileSpreadsheet className="w-4 h-4" /> Sincronizar ERP (Buk/Talana)
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dotación en Turno Hoy</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">28 / 30</h3>
              </div>
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 93.3% Asistencia Efectiva
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cumplimiento Ley 40h</p>
                <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">96.5%</h3>
              </div>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Jornadas reguladas y compensadas</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Horas Extraordinarias</p>
                <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">64.5 hrs</h3>
              </div>
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-600">
                <Timer className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Semana en curso (50% y 100%)</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alertas de Sobretiempo</p>
                <h3 className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">1 caso</h3>
              </div>
              <div className="p-2.5 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-red-600 font-medium mt-2">Supera límite jornada semanal</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              Libro de Registro Horario y Marcaje Biométrico
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Marcajes geolocalizados en garitas y bases operacionales (validado por DT)
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar trabajador o RUT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={filtroJornada}
              onChange={(e) => setFiltroJornada(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="TODAS">Todas las Jornadas</option>
              <option value="7x7 Faena Minera">7x7 Faena Minera</option>
              <option value="5x2 Administrativo">5x2 Administrativo</option>
              <option value="4x3 Turno">4x3 Turno</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Trabajador & RUT</th>
                  <th className="py-3 px-4">Cargo & Jornada</th>
                  <th className="py-3 px-4">Hrs Semanales</th>
                  <th className="py-3 px-4">Horas Extras</th>
                  <th className="py-3 px-4">Atraso</th>
                  <th className="py-3 px-4">Último Marcaje</th>
                  <th className="py-3 px-4">Estado Ley 40h</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{t.nombre}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{t.rut}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{t.cargo}</div>
                      <div className="text-[10px] text-blue-600 font-bold">{t.tipoJornada}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {t.horasSemanales} hrs
                    </td>
                    <td className="py-3.5 px-4">
                      {t.horasExtras50 > 0 ? (
                        <span className="font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-1.5 py-0.5 rounded">
                          +{t.horasExtras50}h (50%)
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {t.atrasoMinutos > 0 ? (
                        <span className="font-bold text-red-600">{t.atrasoMinutos} min</span>
                      ) : (
                        <span className="text-emerald-600 font-bold">0 min</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Badge className="text-[9px] px-1 py-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {t.ultimoMarcaje.tipo}
                        </Badge>
                        <span>{t.ultimoMarcaje.hora}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span className="truncate max-w-[140px]">{t.ultimoMarcaje.ubicacion}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px]",
                        t.estadoLey40Horas === 'CUMPLE' ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300" :
                        t.estadoLey40Horas === 'EN_TURNO_7x7' ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" :
                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 animate-pulse"
                      )}>
                        {t.estadoLey40Horas === 'CUMPLE' ? 'Conforme (40h)' :
                         t.estadoLey40Horas === 'EN_TURNO_7x7' ? 'Turno 7x7 Val.' : 'Sobretiempo (>45h)'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => setSelectedTrabajador(t)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-2 py-1 rounded transition"
                      >
                        Ver Semana
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Detalle Asistencia Semanal */}
      {selectedTrabajador && (
        <Modal
          isOpen={!!selectedTrabajador}
          onClose={() => setSelectedTrabajador(null)}
          title={`Detalle de Jornada: ${selectedTrabajador.nombre}`}
        >
          <div className="space-y-4 p-2 text-sm">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400 block font-bold uppercase">RUT & Jornada</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedTrabajador.rut}</span>
                <span className="text-xs text-blue-600 block font-medium">{selectedTrabajador.tipoJornada}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-bold uppercase">Total Acumulado</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">{selectedTrabajador.horasSemanales} hrs</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Desglose Diario de Asistencia</span>
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {selectedTrabajador.asistenciaSemanal.map((dia, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-2 rounded-lg border text-xs",
                      dia.status === 'asistio' ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300" :
                      dia.status === 'descanso' ? "bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700" :
                      "bg-red-50 border-red-200 text-red-800"
                    )}
                  >
                    <span className="font-bold block">{dia.dia}</span>
                    <span className="font-black text-sm block mt-1">{dia.horas}h</span>
                    <span className="text-[9px] uppercase font-semibold mt-1 block">{dia.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-lg text-xs space-y-1 text-blue-800 dark:text-blue-300">
              <span className="font-bold block">Conformidad Ley de 40 Horas:</span>
              <p>Jornada registrada conforme al dictamen de la Dirección del Trabajo (DT). Registros biométricos validados mediante encriptación y geoposición GPS.</p>
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedTrabajador(null)}>Cerrar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
