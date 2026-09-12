import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Gauge, Search, Filter, AlertTriangle, CheckCircle2, MapPin, Calendar, Truck } from 'lucide-react';

const mockEventosVelocidad = [
  {
    id: 'VEL-2026-031',
    vehiculo: 'KHLP-90 (Volvo FH16 540)',
    conductor: 'Rodrigo Castillo Fuentes',
    velocidad: 68,
    limite: 60,
    tramo: 'Cuesta Caracoles - Km 14 (Bajada)',
    fecha: '11/08/2026 14:22',
    severidad: 'Leve (+8 km/h)',
    estado: 'Notificado y Corregido'
  },
  {
    id: 'VEL-2026-032',
    vehiculo: 'BRTH-44 (Scania R500 V8)',
    conductor: 'Mauricio Silva Valenzuela',
    velocidad: 56,
    limite: 50,
    tramo: 'Faena Cordillera - Rampa Botadero',
    fecha: '04/09/2026 10:15',
    severidad: 'Leve (+6 km/h)',
    estado: 'Notificado y Corregido'
  },
  {
    id: 'VEL-2026-033',
    vehiculo: 'JWRS-18 (Mercedes Actros 2645)',
    conductor: 'Felipe Araya Godoy',
    velocidad: 74,
    limite: 60,
    tramo: 'Ruta 60-CH Sector Curva El Viento',
    fecha: '09/09/2026 16:40',
    severidad: 'Moderada (+14 km/h)',
    estado: 'En Revisión Telemetría'
  }
];

const ControlVelocidades = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockEventosVelocidad.filter(item =>
    item.vehiculo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.conductor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tramo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Control de Velocidades y Telemetría</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Monitoreo satelital GPS continuo y registro de excesos por geocercas en ruta (Julio - Septiembre 2026).
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            Mapa en Vivo
          </Button>
          <Button className="flex items-center gap-2">
            Descargar Reporte GPS
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Cumplimiento Velocidad</p>
                <p className="text-3xl font-bold text-green-600 mt-1">99.1%</p>
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
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Excesos Registrados</p>
                <p className="text-3xl font-bold text-orange-500 mt-1">3</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vel. Promedio Flota</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">46.8 km/h</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Gauge className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vehículos Activos GPS</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">10 / 10</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Truck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
                placeholder="Buscar por patente, conductor o tramo..."
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
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Vehículo</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Conductor</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Velocidad / Límite</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Tramo / Geocerca</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Fecha y Hora</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Severidad</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((evt) => (
                  <tr key={evt.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-200">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-500" />
                        {evt.vehiculo}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{evt.conductor}</td>
                    <td className="py-3 px-4 text-sm font-semibold">
                      <span className="text-red-600">{evt.velocidad} km/h</span>{' '}
                      <span className="text-gray-400 text-xs">(Límite: {evt.limite} km/h)</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {evt.tramo}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {evt.fecha}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant={evt.severidad.includes('Moderada') ? 'warning' : 'neutral'}>
                        {evt.severidad}
                      </Badge>
                    </td>
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

export default ControlVelocidades;
