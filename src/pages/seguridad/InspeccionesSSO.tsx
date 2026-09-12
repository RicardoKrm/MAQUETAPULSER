import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, Search, Filter, ClipboardCheck, Calendar, User, ListChecks } from 'lucide-react';

const mockInspecciones = [
  { id: 'INSP-081', tipo: 'Inspección de Fosa y Herramientas Eléctricas', area: 'Taller Central', fecha: '04/07/2026', responsable: 'Patricia Vergara', estado: 'Realizada', hallazgos: 1 },
  { id: 'INSP-082', tipo: 'Inspección de Flota Pesada en Ruta', area: 'Ruta 60-CH', fecha: '15/07/2026', responsable: 'Patricia Vergara', estado: 'Realizada', hallazgos: 2 },
  { id: 'INSP-083', tipo: 'Inspección de Equipos Contra Incendio', area: 'Todas las Instalaciones', fecha: '02/08/2026', responsable: 'Jorge Lagos', estado: 'Realizada', hallazgos: 0 },
  { id: 'INSP-084', tipo: 'Inspección de Bodega de Sustancias Peligrosas', area: 'Bodega Central', fecha: '18/08/2026', responsable: 'Patricia Vergara', estado: 'Realizada', hallazgos: 2 },
  { id: 'INSP-085', tipo: 'Inspección Pre-Uso de Tacógrafos y Cabinas', area: 'Patio Troncal', fecha: '02/09/2026', responsable: 'Rodrigo Castillo', estado: 'Realizada', hallazgos: 1 },
  { id: 'INSP-086', tipo: 'Inspección Semanal de Taller y Orden y Aseo (5S)', area: 'Taller Fosa 1 y 2', fecha: '11/09/2026', responsable: 'Patricia Vergara', estado: 'Realizada', hallazgos: 1 }
];

const mockChecklists = [
  { id: 'CHK-01', nombre: 'Checklist Pre-Uso Diario de Camión Tolva', categoria: 'Equipos Móviles', preguntas: 24, ultimaEdicion: '01/07/2026' },
  { id: 'CHK-02', nombre: 'Pauta de Inspección de Fosa y Bloqueo LOTO', categoria: 'Mantenimiento', preguntas: 18, ultimaEdicion: '15/07/2026' },
  { id: 'CHK-03', nombre: 'Auditoría Rápida de Sustancias Peligrosas y EPP', categoria: 'SSO y Medioambiente', preguntas: 32, ultimaEdicion: '10/08/2026' },
  { id: 'CHK-04', nombre: 'Checklist de Extintores y Red Húmeda', categoria: 'Emergencias', preguntas: 15, ultimaEdicion: '01/09/2026' }
];

const InspeccionesSSO = () => {
  const [activeTab, setActiveTab] = useState<'inspecciones' | 'constructor'>('inspecciones');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inspecciones en Terreno</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestión de inspecciones programadas y constructor de checklists.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {activeTab === 'inspecciones' ? 'Nueva Inspección' : 'Nuevo Checklist'}
        </Button>
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 mb-6">
        <button
          onClick={() => setActiveTab('inspecciones')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'inspecciones'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Inspecciones
        </button>
        <button
          onClick={() => setActiveTab('constructor')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'constructor'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Constructor Checklists
        </button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={activeTab === 'inspecciones' ? "Buscar por tipo o área..." : "Buscar checklist..."}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
          </div>

          <div className="overflow-x-auto">
            {activeTab === 'inspecciones' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Tipo Inspección</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Área</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Fecha</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Responsable</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Estado</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-center">Hallazgos</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInspecciones.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <ClipboardCheck className="w-4 h-4 text-blue-500" />
                          {item.tipo}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{item.area}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {item.fecha}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          {item.responsable}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {item.estado === 'Realizada' ? (
                          <Badge variant="success">Realizada</Badge>
                        ) : (
                          <Badge variant="warning">Pendiente</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-center">
                        {item.hallazgos !== null ? (
                          <span className={`font-bold ${item.hallazgos > 0 ? 'text-orange-500' : 'text-green-500'}`}>
                            {item.hallazgos}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <Button variant="ghost" size="sm" className="text-blue-600">Ver Informe</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Nombre de Checklist</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Categoría</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-center">Nº Preguntas</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Última Edición</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mockChecklists.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <ListChecks className="w-4 h-4 text-purple-500" />
                          {item.nombre}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{item.categoria}</td>
                      <td className="py-3 px-4 text-sm text-center text-gray-600 dark:text-gray-400">{item.preguntas}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{item.ultimaEdicion}</td>
                      <td className="py-3 px-4 text-sm text-right">
                        <Button variant="ghost" size="sm" className="text-blue-600 mr-2">Editar</Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400">Duplicar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InspeccionesSSO;
