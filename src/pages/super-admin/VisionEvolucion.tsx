import React, { useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import { Shield, CheckCircle, AlertTriangle, TrendingUp, Filter, Info, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

export default function SuperAdminVisionEvolucion() {
  const { companies } = useCompany();
  const [selectedCompanyIdForDashboard, setSelectedCompanyIdForDashboard] = useState<string>('GLOBAL');
  
  const selectedDashboardCompany = companies.find(c => c.id === selectedCompanyIdForDashboard);
  const dashboardData = [
    { mes: 'Jul 2026', incidentes: 14, resueltos: 13, disponibilidad: 94.5, cumplimiento: 96.8, horasHombre: 3840 },
    { mes: 'Ago 2026', incidentes: 9, resueltos: 9, disponibilidad: 96.8, cumplimiento: 98.5, horasHombre: 4120 },
    { mes: 'Sep 2026', incidentes: 4, resueltos: 4, disponibilidad: 98.2, cumplimiento: 99.4, horasHombre: 1650 }
  ];

  const isGlobal = selectedCompanyIdForDashboard === 'GLOBAL';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
            Visión de Evolución
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Analiza el progreso y la eficiencia operativa de las empresas en el tiempo (Julio - 12 Septiembre 2026).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={selectedCompanyIdForDashboard}
              onChange={(e) => setSelectedCompanyIdForDashboard(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 py-2 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Development Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 rounded-xl p-4 flex items-start gap-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Monitoreo Período Julio - Septiembre 2026</h4>
          <p className="text-xs text-blue-600/80 dark:text-blue-400/80 mt-1">
            Visualización consolidada de cumplimiento de metas operacionales, resolución de hallazgos y disponibilidad de flota.
          </p>
        </div>
      </div>

      {/* Panel Analítico */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Visión de Evolución: {selectedDashboardCompany?.name || 'Consolidado General'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isGlobal 
                ? 'Historial agregado de todas las empresas afiliadas desde el 01 de Julio al 12 de Septiembre de 2026.' 
                : `Analítica de problemas operativos vs resoluciones desde ${selectedDashboardCompany?.joinDate || '01 Julio 2026'}.`}
            </p>
          </div>
        </div>

        <div>
          {/* Highlight Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Resolución de Incidentes</span>
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">96.3%</div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">26 de 27 eventos cerrados exitosamente</p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/50 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">Disponibilidad de Flota</span>
                <Shield className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">98.2%</div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 font-semibold">+3.7% sobre meta contractual</p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Horas Hombre Seguras</span>
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">9.610 hrs</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-semibold">Cero días perdidos (Jul - Sep 2026)</p>
            </div>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-4">Incidentes Reportados vs Resueltos</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboardData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="mes" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="incidentes" name="Incidentes Totales" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resueltos" name="Resueltos / Cerrados" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-4">Evolución de Disponibilidad Operacional (%)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="mes" stroke="#94a3b8" />
                    <YAxis domain={[90, 100]} stroke="#94a3b8" />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="disponibilidad" name="Disponibilidad (%)" stroke="#6366f1" fill="#818cf8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
