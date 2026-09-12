import React from 'react';
import { ShieldCheck, Users, Briefcase, FileCheck, BookOpen, MessageSquare, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';

const DashboardSSO = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard SSO / Prevención</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Visión general del departamento de Seguridad y Salud Ocupacional</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg font-bold border border-green-200 dark:border-green-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            SSO Score: 96.4%
          </div>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dotación Total</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">148</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">142 habilitados</span>
              <span className="text-gray-300 dark:text-gray-600 mx-2">|</span>
              <span className="text-red-500 font-medium">6 bloqueados</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cumplimiento Documental</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">98.2%</p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <FileCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+2.1%</span>
              <span className="text-gray-500 dark:text-gray-400 ml-2">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Capacitaciones</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">95.6%</p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <BookOpen className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">Cumplimiento general</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Charlas Realizadas</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">42</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">En el mes actual</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas y Notificaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Alertas Críticas</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-400">2 Documentos vencidos</p>
                  <p className="text-sm text-red-600 dark:text-red-500 mt-1">Exámenes pre-ocupacionales y contratos que requieren atención prioritaria.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-400">1 Riesgo crítico sin control</p>
                  <p className="text-sm text-red-600 dark:text-red-500 mt-1">Control de taludes y berma en sector botadero de faena.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800 dark:text-red-400">2 Hallazgos vencidos</p>
                  <p className="text-sm text-red-600 dark:text-red-500 mt-1">Acciones correctivas de taller con plazo cumplido.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Próximos a Vencer (30 días)</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-400">8 Documentos por vencer</p>
                  <p className="text-sm text-orange-600 dark:text-orange-500 mt-1">Licencias de conducir A4/A5 y exámenes de altura física para conductores.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-400">4 Capacitaciones por expirar</p>
                  <p className="text-sm text-orange-600 dark:text-orange-500 mt-1">Recertificaciones de manejo a la defensiva y bloqueo LOTO.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-orange-800 dark:text-orange-400">3 Inspecciones pendientes</p>
                  <p className="text-sm text-orange-600 dark:text-orange-500 mt-1">Inspección de campamento, pañol y fosa de lubricación esta semana.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas Secundarias */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Eventos Registrados (Mes)</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Accidentes (CTP)</span>
                <span className="font-bold text-emerald-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Accidentes (STP)</span>
                <span className="font-bold text-gray-900 dark:text-white">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Cuasi Accidentes</span>
                <span className="font-bold text-amber-500">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Daño Material</span>
                <span className="font-bold text-gray-900 dark:text-white">2</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Gestión de Hallazgos</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Hallazgos Abiertos</span>
                <span className="font-bold text-amber-500">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Acciones Pendientes</span>
                <span className="font-bold text-blue-600">4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Observaciones Prev.</span>
                <span className="font-bold text-gray-900 dark:text-white">38</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Riesgos Críticos Abiertos</span>
                <span className="font-bold text-emerald-600">0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Cumplimientos</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Inspecciones</span>
                <span className="font-bold text-green-600">96%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Entrega EPP</span>
                <span className="font-bold text-green-600">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Controles Críticos</span>
                <span className="font-bold text-green-600">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Charlas de Seguridad</span>
                <span className="font-bold text-green-600">98%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSSO;
