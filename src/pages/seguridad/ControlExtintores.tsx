import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, Search, Filter, Shield, AlertTriangle, CheckCircle2, QrCode } from 'lucide-react';
import { mockExtintores as rawExtintores } from '../../lib/mockSeguridad';

const mockExtintores = rawExtintores.map(e => ({
  ...e,
  codigo: e.id,
  proximaInspeccion: e.vencimiento,
  estado: e.estado === 'Por Vencer' ? 'Observación' : 'Conforme'
}));

const ControlExtintoresSSO = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredExtintores = mockExtintores.filter(e => 
    e.codigo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Conforme':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Conforme</Badge>;
      case 'Observación':
        return <Badge variant="warning" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Observación</Badge>;
      case 'No Conforme':
        return <Badge variant="error" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> No Conforme</Badge>;
      default:
        return <Badge variant="neutral">{estado}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Control de Extintores</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestión de inventario y estado de extintores.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            Escanear
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Extintor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Extintores</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">10</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Conformes</p>
            <p className="text-2xl font-bold text-green-600 mt-1">9</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Próximos a Vencer (30d)</p>
            <p className="text-2xl font-bold text-orange-500 mt-1">1</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No Conformes / Vencidos</p>
            <p className="text-2xl font-bold text-red-600 mt-1">0</p>
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
                placeholder="Buscar por código o ubicación..."
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
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Código</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Tipo / Capacidad</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Ubicación</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Próx. Inspección</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Estado</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredExtintores.map((extintor) => (
                  <tr key={extintor.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-red-500" />
                        {extintor.codigo}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{extintor.tipo} - {extintor.capacidad}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{extintor.ubicacion}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{extintor.proximaInspeccion}</td>
                    <td className="py-3 px-4 text-sm">
                      {getStatusBadge(extintor.estado)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <Button variant="ghost" size="sm" className="text-blue-600">Inspeccionar</Button>
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

export default ControlExtintoresSSO;
