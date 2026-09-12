import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, Search, Filter, AlertTriangle, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';

const mockRiesgos = [
  {
    id: 'RSG-01',
    proceso: 'Transporte Carretero de Carga Pesada',
    actividad: 'Conducción en ruta cordillerana con pendientes pronunciadas',
    peligro: 'Curvas cerradas, hielo o baja visibilidad',
    riesgo: 'Pérdida de control, desbarrancamiento o choque frontal',
    riesgoInherente: 'Crítico',
    riesgoResidual: 'Bajo'
  },
  {
    id: 'RSG-02',
    proceso: 'Mantenimiento Mecánico en Taller',
    actividad: 'Intervención de motor y transmisión en fosa',
    peligro: 'Energía mecánica, térmica y eléctrica remanente',
    riesgo: 'Atrapamiento, quemaduras por fluidos a alta presión',
    riesgoInherente: 'Alto',
    riesgoResidual: 'Bajo'
  },
  {
    id: 'RSG-03',
    proceso: 'Abastecimiento de Combustible Diésel',
    actividad: 'Carga de combustible en isla con dispensador de alto flujo',
    peligro: 'Descarga electrostática y presencia de vapores inflamables',
    riesgo: 'Ignición, amago de incendio o explosión localizada',
    riesgoInherente: 'Crítico',
    riesgoResidual: 'Bajo'
  },
  {
    id: 'RSG-04',
    proceso: 'Maniobras y Estacionamiento en Patio',
    actividad: 'Retroceso de tractocamión hacia muelle de carga',
    peligro: 'Puntos ciegos de la cabina y tránsito peatonal cruzado',
    riesgo: 'Atropellamiento o colisión con instalaciones fijas',
    riesgoInherente: 'Crítico',
    riesgoResidual: 'Bajo'
  }
];

const mockControles = [
  {
    id: 'CTR-01',
    riesgo: 'Pérdida de Control de Tractocamión en Bajada',
    control: 'Sistema de telemetría GPS con corte automático por exceso y freno motor retardador activo',
    responsable: 'Carlos Venegas (Mantenimiento)',
    estado: 'Efectivo'
  },
  {
    id: 'CTR-02',
    riesgo: 'Atrapamiento en Intervención de Maquinaria',
    control: 'Bloqueo y tarjeteo LOTO obligatorio con candado personal',
    responsable: 'Jorge Lagos (Jefe Taller)',
    estado: 'Efectivo'
  },
  {
    id: 'CTR-03',
    riesgo: 'Incendio en Carga de Diésel',
    control: 'Puesta a tierra obligatoria con tenaza y extintor PQS 50kg certificado',
    responsable: 'Héctor Muñoz (Bodega y Patio)',
    estado: 'Efectivo'
  },
  {
    id: 'CTR-04',
    riesgo: 'Atropello en Patio de Maniobras',
    control: 'Cámaras traseras 360°, sensor de proximidad sonoro y senda peatonal segregada',
    responsable: 'Patricia Vergara (SSO)',
    estado: 'Parcial'
  }
];

const GestionRiesgosSSO = () => {
  const [activeTab, setActiveTab] = useState<'matriz' | 'criticos'>('matriz');
  const [searchTerm, setSearchTerm] = useState('');

  const getRiesgoBadge = (nivel: string) => {
    switch (nivel) {
      case 'Bajo': return <Badge variant="success">Bajo</Badge>;
      case 'Medio': return <Badge variant="warning">Medio</Badge>;
      case 'Alto': return <Badge variant="error" className="bg-orange-100 text-orange-700">Alto</Badge>;
      case 'Crítico': return <Badge variant="error">Crítico</Badge>;
      default: return <Badge variant="neutral">{nivel}</Badge>;
    }
  };

  const getControlBadge = (estado: string) => {
    switch (estado) {
      case 'Efectivo': return <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Efectivo</Badge>;
      case 'Parcial': return <Badge variant="warning" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Parcial</Badge>;
      case 'Inefectivo': return <Badge variant="error" className="flex items-center gap-1"><XCircle className="w-3 h-3" /> Inefectivo</Badge>;
      default: return <Badge variant="neutral">{estado}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Riesgos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Matriz IPER/MIPER y monitoreo de Controles Críticos.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {activeTab === 'matriz' ? 'Nuevo Riesgo' : 'Nuevo Control'}
        </Button>
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 mb-6">
        <button
          onClick={() => setActiveTab('matriz')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'matriz'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Matriz IPER
        </button>
        <button
          onClick={() => setActiveTab('criticos')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'criticos'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Controles Críticos
        </button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por proceso, riesgo o control..."
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
            {activeTab === 'matriz' ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Proceso / Actividad</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Peligro</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Riesgo / Consecuencia</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-center">Riesgo Inherente</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-center">Riesgo Residual</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRiesgos.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-sm">
                        <div className="font-medium text-gray-900 dark:text-gray-300">{item.proceso}</div>
                        <div className="text-gray-500">{item.actividad}</div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{item.peligro}</td>
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-300 font-medium">{item.riesgo}</td>
                      <td className="py-3 px-4 text-sm text-center">{getRiesgoBadge(item.riesgoInherente)}</td>
                      <td className="py-3 px-4 text-sm text-center">{getRiesgoBadge(item.riesgoResidual)}</td>
                      <td className="py-3 px-4 text-sm text-right">
                        <Button variant="ghost" size="sm" className="text-blue-600">Ver Detalles</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Riesgo Crítico Asociado</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Control Crítico</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Responsable</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Estado de Eficacia</th>
                    <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {mockControles.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-300 font-medium">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-orange-500" />
                          {item.riesgo}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{item.control}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{item.responsable}</td>
                      <td className="py-3 px-4 text-sm">
                        {getControlBadge(item.estado)}
                        {item.estado === 'Inefectivo' && (
                          <p className="text-xs text-red-500 mt-1">Generó hallazgo #405</p>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-right">
                        <Button variant="ghost" size="sm" className="text-blue-600">Evaluar</Button>
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

export default GestionRiesgosSSO;
