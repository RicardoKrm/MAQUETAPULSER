import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Users,
  Clock,
  HeartPulse,
  DollarSign,
  Palmtree,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Building,
  Calendar,
  Briefcase
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function DashboardRRHH() {
  const dotacionPorJornada = [
    { name: '7x7 Faena Minera (Cordillera)', cantidad: 18, color: '#3b82f6' },
    { name: '5x2 Carretera / Distribución', cantidad: 8, color: '#10b981' },
    { name: '4x3 Turno Especial Patillos', cantidad: 4, color: '#f59e0b' },
    { name: 'Administración & Taller', cantidad: 5, color: '#8b5cf6' }
  ];

  const horasExtrasPorSemana = [
    { semana: 'Sem 1', ordinarias: 1240, extras: 58 },
    { semana: 'Sem 2', ordinarias: 1250, extras: 64 },
    { semana: 'Sem 3', ordinarias: 1235, extras: 52 },
    { semana: 'Sem 4', ordinarias: 1260, extras: 64.5 }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            Recursos Humanos & Control de Dotación
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Gestión integral de personal, control horario DT, ley 40 horas, licencias, vacaciones y liquidaciones
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2 text-xs font-bold">
            <FileSpreadsheet className="w-4 h-4" /> Integración Buk / Talana
          </Button>
        </div>
      </div>

      {/* KPI Cards Top Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dotación Total Flota</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">35 Colaboradores</h3>
              </div>
              <div className="p-2.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 30 Conductores + 5 Staff Taller
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cumplimiento Ley 40h</p>
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">96.5%</h3>
              </div>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Jornadas 7x7 mineras autorizadas por DT</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Licencias Médicas</p>
                <h3 className="text-2xl sm:text-3xl font-black text-red-600 dark:text-red-400 mt-1">3 activas</h3>
              </div>
              <div className="p-2.5 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600">
                <HeartPulse className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">100% con relevos en faena</p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nómina Líquida Mensual</p>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">$44.8M</h3>
              </div>
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Pagada al día con leyes sociales</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Panels Grid */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
          Módulos y Paneles de Recursos Humanos
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/recursos-humanos/control-horario"
            className="group p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Control Horario & 40h</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Marcajes biométricos, horas trabajadas por semana, horas extras y libro de asistencia DT.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>Abrir Panel</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/recursos-humanos/licencias-vacaciones"
            className="group p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-red-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Licencias & Vacaciones</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Control de licencias médicas COMPIN, saldos de vacaciones legales y reemplazos operacionales.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-red-600 dark:text-red-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>Abrir Panel</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/recursos-humanos/remuneraciones-prestamos"
            className="group p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Sueldos & Préstamos</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Liquidaciones de sueldo mensuales, bonos de producción, viáticos de ruta y amortización de préstamos.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>Abrir Panel</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/recursos-humanos/turnos"
            className="group p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-xl w-fit mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Planificación de Turnos</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Mallas de turnos mineros (7x7, 5x2, 4x3), rotaciones de conductores y relevos programados.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-purple-600 dark:text-purple-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span>Abrir Panel</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="col-span-full lg:col-span-2 shadow-sm border border-slate-200 dark:border-slate-800">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Horas Ordinarias vs Horas Extraordinarias (Octubre 2026)
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Cumplimiento semanal y control de horas extraordinarias al 50%
              </p>
            </div>
            <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 text-xs font-bold">
              Ley 40 Horas
            </Badge>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={horasExtrasPorSemana} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="semana" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip formatter={(v: any) => [`${v} hrs`, '']} />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Bar dataKey="ordinarias" name="Horas Ordinarias" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={35} />
                  <Bar dataKey="extras" name="Horas Extras (50%)" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
              Distribución de Dotación
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Personal por régimen de jornada laboral
            </p>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dotacionPorJornada}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="cantidad"
                  >
                    {dotacionPorJornada.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any) => [`${v} trabajadores`, 'Dotación']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-2 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {dotacionPorJornada.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pt-1.5">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                  </div>
                  <span className="font-black text-slate-900 dark:text-white shrink-0">{item.cantidad}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
