import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Shield, Search, Filter, AlertTriangle, CheckCircle2, Clock, Truck, Activity } from 'lucide-react';

const mockEventosSeguridad = [
  {
    id: 'EVT-2026-052',
    tipo: 'Frenada Brusca (>0.45g)',
    vehiculo: 'KHLP-90 (Volvo FH16)',
    conductor: 'Rodrigo Castillo Fuentes',
    fecha: '16/07/2026 11:20',
    ubicacion: 'Sector Botadero Norte',
    descripcion: 'Maniobra preventiva ante ingreso imprevisto de camioneta de supervisión.',
    estado: 'Justificado'
  },
  {
    id: 'EVT-2026-068',
    tipo: 'Sensor Somnolencia / Micropestañeo',
    vehiculo: 'BRTH-44 (Volvo FH16)',
    conductor: 'Mauricio Silva Valenzuela',
    fecha: '02/08/2026 03:45',
    ubicacion: 'Ruta 60-CH Km 72',
    descripcion: 'Cámara infrarroja detecta cierre de párpados >1.8s. Conductor detiene en zona segura para pausa activa de 20 min.',
    estado: 'Atendido en Faena'
  },
  {
    id: 'EVT-2026-079',
    tipo: 'Detención no programada en berma',
    vehiculo: 'JWRS-18 (Mercedes Actros)',
    conductor: 'Felipe Araya Godoy',
    fecha: '19/08/2026 15:10',
    ubicacion: 'Cuesta Chacabuco Km 55',
    descripcion: 'Revisión preventiva por alerta de baja presión en sensor de neumático eje trasero.',
    estado: 'Cerrado'
  },
  {
    id: 'EVT-2026-091',
    tipo: 'Desvío de Corredor Autorizado',
    vehiculo: 'TL-202 (Scania Tolva PRTZ-33)',
    conductor: 'Gonzalo Pavez Castro',
    fecha: '05/09/2026 09:30',
    ubicacion: 'Acceso Planta Chancado',
    descripcion: 'Desvío de 40 metros por trabajos de mantención de camino principal de faena.',
    estado: 'Autorizado'
  },
  {
    id: 'EVT-2026-098',
    tipo: 'Activación Sensor de Viraje Cerrado',
    vehiculo: 'KLLB-92 (Aljibe Mercedes)',
    conductor: 'Rodrigo Castillo Fuentes',
    fecha: '11/09/2026 14:05',
    ubicacion: 'Rampa Acceso Muelle de Carga',
    descripcion: 'Alerta preventiva de balanceo en curva con estanque al 80%. Conductor reduce marcha sin novedad.',
    estado: 'Cerrado'
  }
];

const ControlEventos = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockEventosSeguridad.filter(item =>
    item.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.conductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Control de Eventos de Ruta y Faena</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Registro y gestión de eventos de telemetría, frenadas bruscas, fatiga y desvíos (Julio - Septiembre 2026).
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Exportar Bitácora
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Eventos</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">5</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Eventos Gestionados</p>
                <p className="text-3xl font-bold text-green-600 mt-1">100%</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Eventos Críticos</p>
                <p className="text-3xl font-bold text-green-600 mt-1">0</p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Tiempo Medio Respuesta</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">18 min</p>
              </div>
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por tipo, vehículo, conductor o ubicación..."
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">ID / Tipo</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Vehículo</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Conductor</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Fecha y Hora</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Ubicación</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Detalle</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((evt) => (
                  <tr key={evt.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                      <div>{evt.tipo}</div>
                      <div className="text-xs text-gray-500">{evt.id}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-500" />
                        {evt.vehiculo}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{evt.conductor}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{evt.fecha}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{evt.ubicacion}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">{evt.descripcion}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant="success">{evt.estado}</Badge>
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
};

export default ControlEventos;
