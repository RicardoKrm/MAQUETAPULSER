import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Search, Filter, FileCheck, Upload, AlertCircle, Clock, CheckCircle2, ChevronDown } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

const mockDocumentos = [
  { id: 'DOC-01', tipo: 'Examen Ocupacional Gran Altura Geográfica', entidad: 'Rodrigo Castillo Fuentes', categoria: 'trabajadores', fechaEmision: '10/04/2026', fechaVencimiento: '10/04/2027', estado: 'Vigente' },
  { id: 'DOC-02', tipo: 'Licencia Profesional A5 / Hoja de Vida', entidad: 'Mauricio Silva Valenzuela', categoria: 'trabajadores', fechaEmision: '15/01/2026', fechaVencimiento: '15/01/2028', estado: 'Vigente' },
  { id: 'DOC-03', tipo: 'Inducción SSO y Pasaporte Faena Cordillera', entidad: 'Carlos Venegas Morales', categoria: 'trabajadores', fechaEmision: '02/07/2026', fechaVencimiento: '02/07/2027', estado: 'Vigente' },
  { id: 'DOC-04', tipo: 'Certificación LOTO y Trabajo en Altura', entidad: 'Jorge Lagos Cárdenas', categoria: 'trabajadores', fechaEmision: '18/07/2026', fechaVencimiento: '18/07/2027', estado: 'Vigente' },
  { id: 'DOC-05', tipo: 'Examen Psicosensotécnico Riguroso', entidad: 'Gonzalo Pavez Castro', categoria: 'trabajadores', fechaEmision: '20/09/2025', fechaVencimiento: '20/09/2026', estado: 'Próximo a Vencer' },
  { id: 'DOC-06', tipo: 'Certificado F30-1 Cumplimiento Laboral', entidad: 'Servicios Mineros del Norte SpA', categoria: 'empresas', fechaEmision: '01/08/2026', fechaVencimiento: '30/09/2026', estado: 'Vigente' },
  { id: 'DOC-07', tipo: 'Póliza Responsabilidad Civil y Daños Faena', entidad: 'Imperia SpA', categoria: 'empresas', fechaEmision: '01/01/2026', fechaVencimiento: '31/12/2026', estado: 'Vigente' },
  { id: 'DOC-08', tipo: 'Certificado de Afiliación y Tasa Siniestralidad ACHS', entidad: 'Imperia SpA', categoria: 'empresas', fechaEmision: '01/07/2026', fechaVencimiento: '31/12/2026', estado: 'Vigente' }
];

const ControlDocumentalSSO = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'todos' | 'trabajadores' | 'empresas'>('todos');

  const filteredDocumentos = mockDocumentos.filter(doc => {
    const matchesSearch = doc.tipo.toLowerCase().includes(searchTerm.toLowerCase()) || doc.entidad.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'todos' || doc.categoria === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'Vigente':
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Vigente</Badge>;
      case 'Próximo a Vencer':
        return <Badge variant="warning" className="flex items-center gap-1"><Clock className="w-3 h-3" /> Próximo a Vencer</Badge>;
      case 'Vencido':
        return <Badge variant="error" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Vencido</Badge>;
      default:
        return <Badge variant="neutral">{estado}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Control Documental</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gestión de documentos, certificaciones y expedientes.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Subir Documento
        </Button>
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 mb-6">
        <button
          onClick={() => setActiveTab('todos')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'todos'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setActiveTab('trabajadores')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'trabajadores'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Trabajadores
        </button>
        <button
          onClick={() => setActiveTab('empresas')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'empresas'
              ? 'border-blue-500 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
        >
          Empresas
        </button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por tipo de documento o entidad..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                Estado <ChevronDown className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Tipo de Documento</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Entidad</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Emisión</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Vencimiento</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Estado</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocumentos.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-blue-500" />
                        {doc.tipo}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{doc.entidad}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{doc.fechaEmision}</td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{doc.fechaVencimiento}</td>
                    <td className="py-3 px-4 text-sm">
                      {getStatusBadge(doc.estado)}
                    </td>
                    <td className="py-3 px-4 text-sm text-right">
                      <Button variant="ghost" size="sm" className="text-blue-600">
                        Ver Archivo
                      </Button>
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

export default ControlDocumentalSSO;
