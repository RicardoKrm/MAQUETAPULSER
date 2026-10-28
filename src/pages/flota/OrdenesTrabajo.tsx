import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Plus, Search, Filter, Wrench, Calendar, CheckCircle, Clock, AlertTriangle, FileDown, Eye, Edit, Trash, XCircle, RotateCcw, SlidersHorizontal, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CrearOTModal } from '../../components/flota/CrearOTModal';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

export default function OrdenesTrabajo() {
  const { ordenesTrabajo, vehiculos, eliminarOrdenTrabajo } = useAppContext();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [filtroVehiculo, setFiltroVehiculo] = useState('Todos');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [filtroDesde, setFiltroDesde] = useState('');
  const [filtroHasta, setFiltroHasta] = useState('');
  const [mostrarAvanzados, setMostrarAvanzados] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otToEdit, setOtToEdit] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const estadoParam = params.get('estado');
    const vehiculoParam = params.get('vehiculo');
    const tipoParam = params.get('tipo');

    if (estadoParam) setFiltroEstado(estadoParam);
    if (vehiculoParam) setFiltroVehiculo(vehiculoParam);
    if (tipoParam) setFiltroTipo(tipoParam);
    if (params.get('nuevo') === '1') {
      setOtToEdit(null);
      setIsModalOpen(true);
    }
  }, [location.search]);

  const otsFiltradas = ordenesTrabajo.filter((ot) => {
    const vehiculo = vehiculos.find(v => String(v.id) === String(ot.vehiculoId));
    
    const matchVehiculo = filtroVehiculo === 'Todos' || 
      (ot.vehiculoId === filtroVehiculo || String(ot.vehiculoId) === filtroVehiculo) ||
      (vehiculo && (vehiculo.patente === filtroVehiculo || String(vehiculo.id) === filtroVehiculo));

    const matchTipo = (() => {
      if (filtroTipo === 'Todos') return true;
      const otTipo = (ot.tipo || '').toUpperCase().trim();
      const fTipo = filtroTipo.toUpperCase().trim();

      if (fTipo === 'PREVENTIVA') {
        return otTipo.includes('PREVENTIV') || otTipo.includes('INSPECC') || otTipo.includes('DIAGNOST');
      }
      if (fTipo === 'PREVENTIVA_MANTENIMIENTO') {
        return (otTipo.includes('PREVENTIV') && !otTipo.includes('NEUMAT')) || Boolean(ot.pauta);
      }
      if (fTipo === 'PREVENTIVA_INSPECCION_NEUMATICOS') {
        return otTipo.includes('NEUMAT') || Boolean(ot.inspeccionTrenMotriz) || otTipo === 'PREVENTIVA_INSPECCION_NEUMATICOS';
      }
      if (fTipo === 'PREVENTIVA_DIAGNOSTICO') {
        return otTipo.includes('DIAGNOST') || (Boolean(ot.diagnosticoEvaluacion) && !otTipo.includes('CORRECTIV'));
      }

      if (fTipo === 'CORRECTIVA') {
        return otTipo.includes('CORRECTIV') || otTipo.includes('REPARAC');
      }
      if (fTipo === 'CORRECTIVA_REPARACION') {
        return otTipo.includes('CORRECTIV') || otTipo.includes('REPARAC') || Boolean(ot.tipoFalla);
      }

      return otTipo.includes(fTipo) || fTipo.includes(otTipo);
    })();

    const matchEstado = (() => {
      if (filtroEstado === 'Todos') return true;
      const otEstado = (ot.estado || '').toUpperCase().trim();
      const fEstado = filtroEstado.toUpperCase().trim();
      
      if (fEstado === 'PENDIENTE') {
        return otEstado === 'PENDIENTE' || otEstado === 'ABIERTA';
      }
      if (fEstado === 'PROGRAMADA') {
        return otEstado === 'PROGRAMADA';
      }
      if (fEstado === 'EN_PROCESO') {
        return otEstado === 'EN_PROCESO' || otEstado === 'EN PROCESO';
      }
      if (fEstado === 'PAUSADA') {
        return otEstado === 'PAUSADA';
      }
      if (fEstado === 'FINALIZADA') {
        return otEstado === 'FINALIZADA' || otEstado === 'CERRADA' || otEstado === 'CERRADA_POR_MECANICO';
      }
      if (fEstado === 'CANCELADA') {
        return otEstado === 'CANCELADA';
      }
      return otEstado === fEstado;
    })();
    
    // Date filtering logic
    const fechaOTStr = ot.fechaCreacion || (ot as any).created_at || (ot as any).fecha_creacion;
    const fechaOT = fechaOTStr ? new Date(fechaOTStr) : null;
    let matchDesde = true;
    let matchHasta = true;
    if (filtroDesde && fechaOT) {
      const dDesde = new Date(filtroDesde + 'T00:00:00');
      matchDesde = fechaOT >= dDesde;
    }
    if (filtroHasta && fechaOT) {
      const dHasta = new Date(filtroHasta + 'T23:59:59');
      matchHasta = fechaOT <= dHasta;
    }
    
    return matchVehiculo && matchTipo && matchEstado && matchDesde && matchHasta;
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;
  
  const otsPaginadas = otsFiltradas.slice((paginaActual - 1) * itemsPorPagina, paginaActual * itemsPorPagina);
  const totalPaginas = Math.ceil(otsFiltradas.length / itemsPorPagina);
  const isJefatura = profile?.rol?.nombre === 'Supervisor' || profile?.rol?.nombre === 'Administrador' || profile?.rol?.nombre === 'Súper Admin' || profile?.rol?.nombre === 'Dueño';

  const getOtCosto = (ot: any) => {
    const rawTotal = Number(ot.costoTotal || (ot as any).costo_total);
    if (!isNaN(rawTotal) && rawTotal > 0) return rawTotal;
    return (Number(ot.costoInsumos) || 0) + (Number(ot.costoManoObraTareas) || 0) + (Number(ot.costoManoObraHH) || 0);
  };

  const costoTotal = otsFiltradas.reduce((acc, ot) => acc + getOtCosto(ot), 0);

  const costoPreventivas = otsFiltradas
    .filter(ot => (ot.tipo || '').toUpperCase().includes('PREVENTIV'))
    .reduce((acc, ot) => acc + getOtCosto(ot), 0);

  const costoCorrectivas = otsFiltradas
    .filter(ot => (ot.tipo || '').toUpperCase().includes('CORRECTIV'))
    .reduce((acc, ot) => acc + getOtCosto(ot), 0);

  const costoNeumaticos = otsFiltradas
    .filter(ot => {
      const t = (ot.tipo || '').toUpperCase();
      return t.includes('NEUMAT') || Boolean(ot.inspeccionTrenMotriz);
    })
    .reduce((acc, ot) => acc + getOtCosto(ot), 0);

  const getTipoLabel = (tipoRaw: string) => {
    const raw = (tipoRaw || '').toUpperCase();
    if (raw === 'PREVENTIVA_MANTENIMIENTO') return 'Preventiva (Mantenimiento)';
    if (raw === 'PREVENTIVA_INSPECCION_NEUMATICOS') return 'Preventiva (Insp. Neumáticos)';
    if (raw === 'PREVENTIVA_DIAGNOSTICO') return 'Preventiva (Diagnóstico)';
    if (raw === 'CORRECTIVA_REPARACION') return 'Correctiva (Reparación)';
    if (raw.includes('PREVENTIVA') && raw.includes('NEUMAT')) return 'Preventiva (Insp. Neumáticos)';
    if (raw.includes('CORRECTIVA') && raw.includes('NEUMAT')) return 'Correctiva (Reparación Neumáticos)';
    if (raw.includes('PREVENTIV')) return 'Preventiva';
    if (raw.includes('CORRECTIV')) return 'Correctiva';
    if (raw.includes('INSPECC')) return 'Preventiva (Inspección)';
    if (raw.includes('EVALUA')) return 'Preventiva (Diagnóstico)';
    return tipoRaw ? tipoRaw.replace(/_/g, ' ') : 'General';
  };

  const getTrabajoDetalle = (ot: any) => {
    if (ot.pauta) return `Pauta: ${ot.pauta}`;
    if (ot.tipoFalla) return `Falla: ${ot.tipoFalla}${ot.sintomas ? ` (${ot.sintomas})` : ''}`;
    if (ot.sintomas) return `Síntomas: ${ot.sintomas}`;
    if (ot.diagnosticoEvaluacion) return `Diagnóstico: ${ot.diagnosticoEvaluacion}`;
    if (ot.inspeccionTrenMotriz) return `Tren Motriz: ${ot.inspeccionTrenMotriz}${ot.eje ? ` (Eje ${ot.eje})` : ''}`;
    if ((ot.tipo || '').toUpperCase().includes('NEUMAT')) return `Inspección / Cambio de Neumáticos`;
    if (ot.observacionInicial && !ot.observacionInicial.includes('Falla reportada en operación')) return ot.observacionInicial;
    if (ot.observacionInicial) return ot.observacionInicial;
    return 'Servicio de mantenimiento';
  };

  const getEstadoColor = (estado: string) => {
    switch(estado) {
        case 'PAUSADA': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'PROGRAMADA': return 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800';
        case 'FINALIZADA': return 'bg-green-100 text-green-700 border-green-200';
        case 'CERRADA_POR_MECANICO': return 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800';
        case 'ABIERTA': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        default: return 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800';
    }
  }

  const getTipoColor = (tipoRaw: string) => {
    const tipo = (tipoRaw || '').toUpperCase().replace(/_/g, ' ').trim();

    if (tipo.includes('PREVENTIVA NEUMATICO') || tipo.includes('PREVENTIVO NEUMATICO') || tipo.includes('PREVENTIVA NEUMÁTICO') || tipo.includes('PREVENTIVO NEUMÁTICO')) {
       return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900';
    }
    if (tipo.includes('CORRECTIVA NEUMATICO') || tipo.includes('CORRECTIVO NEUMATICO') || tipo.includes('CORRECTIVA NEUMÁTICO') || tipo.includes('CORRECTIVO NEUMÁTICO')) {
       return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900';
    }
    if (tipo.includes('EVALUATIVA NEUMATICO') || tipo.includes('EVALUATIVO NEUMATICO') || tipo.includes('EVALUATIVA NEUMÁTICO') || tipo.includes('EVALUATIVO NEUMÁTICO')) {
       return 'bg-[#fcf8f2] text-[#c29153] border-[#e8dfd3] dark:bg-stone-900/40 dark:text-[#dfb278] dark:border-stone-800';
    }

    if (tipo.includes('PREVENTIV')) {
       return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900';
    }
    if (tipo.includes('CORRECTIV')) {
       return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900';
    }
    if (tipo.includes('EVALUA') || tipo.includes('EVALUAC')) {
       return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-900';
    }
    if (tipo.includes('INSPECC')) {
       return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900';
    }

    switch(tipoRaw) {
        case 'PREVENTIVA': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900';
        case 'CORRECTIVA': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900';
        case 'INSPECCION': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900';
        default: return 'bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800';
    }
  }

  const handleExportExcel = () => {
    if (otsFiltradas.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Sin datos para exportar',
        text: 'No hay órdenes de trabajo que coincidan con los filtros actuales.',
        confirmButtonColor: '#0891b2'
      });
      return;
    }

    const dataParaExcel = otsFiltradas.map((ot) => {
      const vehiculo = vehiculos.find(v => String(v.id) === String(ot.vehiculoId));
      const costoFila = (ot.costoInsumos || 0) + (ot.costoManoObraTareas || 0) + (ot.costoManoObraHH || 0);
      const fechaCreacion = ot.fechaCreacion || (ot as any).created_at || (ot as any).fecha_creacion;
      
      return {
        'Folio': ot.folio,
        'Vehículo (Patente)': vehiculo?.patente || ot.vehiculoId || 'N/A',
        'N° Interno': vehiculo?.numero || 'S/N',
        'Modelo': vehiculo?.modelo || 'N/A',
        'Tipo OT': getTipoLabel(ot.tipo),
        'Trabajo / Detalle': getTrabajoDetalle(ot),
        'Estado': ot.estado ? ot.estado.replace(/_/g, ' ') : 'N/A',
        'Prioridad': ot.prioridad || 'MEDIA',
        'Técnico Responsable': ot.tecnicoResponsable || 'Sin asignar',
        'KM Apertura': ot.kilometrajeApertura || 0,
        'Costo Insumos ($)': ot.costoInsumos || 0,
        'Costo MO Tareas ($)': ot.costoManoObraTareas || 0,
        'Costo MO Horas ($)': ot.costoManoObraHH || 0,
        'Costo Total ($)': costoFila,
        'Fecha Creación': fechaCreacion ? new Date(fechaCreacion).toLocaleDateString('es-CL') : 'N/A',
        'Fecha Programada': ot.fechaProgramada || 'N/A',
        'Observación Inicial': ot.observacionInicial || 'N/A'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataParaExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Órdenes de Trabajo');

    const columnWidths = [
      { wch: 16 }, // Folio
      { wch: 20 }, // Vehiculo
      { wch: 12 }, // N Interno
      { wch: 18 }, // Modelo
      { wch: 26 }, // Tipo
      { wch: 35 }, // Detalle
      { wch: 15 }, // Estado
      { wch: 12 }, // Prioridad
      { wch: 22 }, // Tecnico
      { wch: 14 }, // KM
      { wch: 16 }, // Costo Insumos
      { wch: 18 }, // Costo MO Tareas
      { wch: 18 }, // Costo MO Horas
      { wch: 16 }, // Costo Total
      { wch: 15 }, // Fecha Creacion
      { wch: 16 }, // Fecha Programada
      { wch: 35 }  // Observacion
    ];
    worksheet['!cols'] = columnWidths;

    const fechaHoy = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Ordenes_Trabajo_${fechaHoy}.xlsx`);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Reporte Excel generado con éxito',
      showConfirmButton: false,
      timer: 2500
    });
  };

  const handleLimpiarFiltros = () => {
    setFiltroVehiculo('Todos');
    setFiltroTipo('Todos');
    setFiltroEstado('Todos');
    setFiltroDesde('');
    setFiltroHasta('');
    setPaginaActual(1);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'info',
      title: 'Filtros restablecidos',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const handleEliminarConConfirmacion = (otId: string, folio: string) => {
    Swal.fire({
      title: '¿Eliminar Orden de Trabajo?',
      text: `¿Estás seguro de que deseas eliminar la orden de trabajo ${folio}? Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarOrdenTrabajo(otId, true);
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `OT ${folio} eliminada correctamente`,
            showConfirmButton: false,
            timer: 2000
          });
        } catch (err) {
          console.error("Error al eliminar OT:", err);
          Swal.fire('Error', 'No se pudo eliminar la orden de trabajo.', 'error');
        }
      }
    });
  };

  const canCrearOT = true;

  return (
    <div className="space-y-6">
      {/* Header con Título y Botones de Acción */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-slate-800 gap-4 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Órdenes de Trabajo</h1>
          <p className="text-xs text-slate-500 mt-1">Gestión operativa, control de estados y costos de mantenimiento de la flota</p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={handleExportExcel}
            className="border-green-600 text-green-600 hover:bg-green-50 dark:bg-green-900/30 font-medium"
            title="Descargar listado en formato Excel (.xlsx)"
          >
            <FileDown className="w-4 h-4 mr-2 text-green-600" /> Exportar Excel
          </Button>
          {canCrearOT && (
            <Button className="bg-cyan-600 hover:bg-cyan-700 font-medium" onClick={() => { setOtToEdit(null); setIsModalOpen(true); }}>
              <Plus className="w-4 h-4 mr-2" /> Crear Nueva Orden de Trabajo
            </Button>
          )}
        </div>
      </div>

      {/* Casillas de Costos según Filtros Aplicados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Costo Total OTs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl shrink-0">
            $
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Costo Total OTs
            </p>
            <p className="text-xl md:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 truncate">
              ${costoTotal.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] text-slate-500 font-medium">
              {otsFiltradas.length} órdenes filtradas
            </span>
          </div>
        </div>

        {/* Preventivas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/70 border border-blue-300 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl shrink-0">
            🛡️
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Mant. Preventivas
            </p>
            <p className="text-xl md:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 truncate">
              ${costoPreventivas.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] text-slate-500 font-medium">
              {otsFiltradas.filter(ot => (ot.tipo || '').toUpperCase().includes('PREVENTIV')).length} órdenes
            </span>
          </div>
        </div>

        {/* Correctivas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/70 border border-rose-300 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold text-xl shrink-0">
            🔧
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Mant. Correctivas
            </p>
            <p className="text-xl md:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 truncate">
              ${costoCorrectivas.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] text-slate-500 font-medium">
              {otsFiltradas.filter(ot => (ot.tipo || '').toUpperCase().includes('CORRECTIV')).length} órdenes
            </span>
          </div>
        </div>

        {/* Neumáticos & Inspección */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold text-xl shrink-0">
            🛞
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              OTs Neumáticos
            </p>
            <p className="text-xl md:text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 truncate">
              ${costoNeumaticos.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-[11px] text-slate-500 font-medium">
              {otsFiltradas.filter(ot => (ot.tipo || '').toUpperCase().includes('NEUMAT') || Boolean(ot.inspeccionTrenMotriz)).length} órdenes
            </span>
          </div>
        </div>
      </div>
      
      <CrearOTModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} otToEdit={otToEdit} />
      
      {/* Sección de Filtros Dinámicos */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
            <Filter className="text-cyan-600 w-5 h-5"/> Filtros de Órdenes
          </h2>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLimpiarFiltros} 
              className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Limpiar
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMostrarAvanzados(!mostrarAvanzados)} 
              className={`text-xs ${mostrarAvanzados ? 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40' : 'text-slate-500'}`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-1" /> {mostrarAvanzados ? 'Ocultar Avanzados' : 'Más Filtros'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Vehículo</label>
            <select 
              className="w-full p-2.5 border rounded-md dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500" 
              value={filtroVehiculo} 
              onChange={(e) => { setFiltroVehiculo(e.target.value); setPaginaActual(1); }}
            >
              <option value="Todos">Todos los Vehículos</option>
              {vehiculos.map(v => (
                <option key={v.id} value={v.patente}>
                  {v.numero ? `${v.numero} - ${v.patente}` : v.patente} {v.modelo ? `(${v.modelo})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Tipo</label>
            <select 
              className="w-full p-2.5 border rounded-md dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500 font-medium" 
              value={filtroTipo} 
              onChange={(e) => { setFiltroTipo(e.target.value); setPaginaActual(1); }}
            >
              <option value="Todos">Todos los Tipos</option>
              <optgroup label="── PREVENTIVAS ──">
                <option value="PREVENTIVA">Todas las Preventivas</option>
                <option value="PREVENTIVA_MANTENIMIENTO">↳ Servicio de Mantenimiento (Pautas periódicas)</option>
                <option value="PREVENTIVA_INSPECCION_NEUMATICOS">↳ Inspección de Neumáticos (Pauta de Inspección)</option>
                <option value="PREVENTIVA_DIAGNOSTICO">↳ Diagnóstico (Síntomas no detienen equipo)</option>
              </optgroup>
              <optgroup label="── CORRECTIVAS ──">
                <option value="CORRECTIVA">Todas las Correctivas</option>
                <option value="CORRECTIVA_REPARACION">↳ Servicio de Reparación (Fallas / Cambio componentes & neumáticos)</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Estado</label>
            <select 
              className="w-full p-2.5 border rounded-md dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500" 
              value={filtroEstado} 
              onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
            >
              <option value="Todos">Todos los Estados</option>
              <option value="PENDIENTE">Pendientes / Abiertas</option>
              <option value="PROGRAMADA">Programadas</option>
              <option value="EN_PROCESO">En Proceso</option>
              <option value="PAUSADA">Pausadas</option>
              <option value="FINALIZADA">Finalizadas / Cerradas</option>
              <option value="CANCELADA">Canceladas</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Fecha Desde</label>
            <input 
              type="date" 
              className="w-full p-2.5 border rounded-md dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500" 
              value={filtroDesde} 
              onChange={(e) => { setFiltroDesde(e.target.value); setPaginaActual(1); }} 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Fecha Hasta</label>
            <input 
              type="date" 
              className="w-full p-2.5 border rounded-md dark:border-slate-800 dark:bg-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-cyan-500" 
              value={filtroHasta} 
              onChange={(e) => { setFiltroHasta(e.target.value); setPaginaActual(1); }} 
            />
          </div>
        </div>

        {mostrarAvanzados && (
          <div className="mt-4 pt-4 border-t dark:border-slate-800 animate-in fade-in duration-200">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span className="font-medium">
                Mostrando {otsFiltradas.length} órdenes de trabajo encontradas según los filtros.
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLimpiarFiltros}
                className="text-xs"
              >
                Restablecer todos los filtros
              </Button>
            </div>
          </div>
        )}

        <div className="overflow-auto mt-6">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b dark:border-slate-800 uppercase text-xs text-slate-500 dark:text-slate-400">
                    <tr>
                        <th className="p-4">Folio</th>
                        <th className="p-4">Vehículo</th>
                        <th className="p-4">Tipo y Trabajo</th>
                        <th className="p-4">Estado</th>
                        <th className="p-4 text-right">Costo Total</th>
                        <th className="p-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {otsPaginadas.map((ot) => {
                        const vehiculo = vehiculos.find(v => String(v.id) === String(ot.vehiculoId));
                        const costoFila = (ot.costoInsumos || 0) + (ot.costoManoObraTareas || 0) + (ot.costoManoObraHH || 0);
                        return (
                            <tr key={ot.id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 dark:bg-slate-900/50 transition-colors">
                                <td className="p-4">
                                  <div className="font-bold text-slate-900 dark:text-slate-100">{ot.folio}</div>
                                  {ot.tecnicoResponsable && (
                                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-normal">
                                      <User className="w-3 h-3 text-slate-400" /> {ot.tecnicoResponsable}
                                    </div>
                                  )}
                                </td>
                                <td className="p-4">
                                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                                      {vehiculo ? `${vehiculo.numero ? vehiculo.numero + ' - ' : ''}${vehiculo.patente}` : (ot.vehiculoId || 'N/A')}
                                    </div>
                                    {vehiculo?.modelo && <div className="text-xs text-slate-500">{vehiculo.modelo}</div>}
                                </td>
                                <td className="p-4">
                                  <div className="flex flex-col gap-1">
                                    <div>
                                      <Badge className={`${getTipoColor(ot.tipo)} border dark:border-slate-800 text-[11px] font-bold`}>
                                        {getTipoLabel(ot.tipo)}
                                      </Badge>
                                    </div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400 font-medium line-clamp-1 max-w-[280px]" title={getTrabajoDetalle(ot)}>
                                      {getTrabajoDetalle(ot)}
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4"><Badge className={`${getEstadoColor(ot.estado)} border dark:border-slate-800`}>{ot.estado ? ot.estado.replace(/_/g, ' ') : ''}</Badge></td>
                                <td className="p-4 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                                  ${costoFila.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="p-4 text-right">
                                    <Button size="sm" variant="ghost" className="mr-2 text-cyan-600 hover:text-cyan-700" onClick={() => { setOtToEdit(ot); setIsModalOpen(true); }}><Edit className="w-4 h-4"/></Button>
                                    <Button size="sm" variant="outline" className="mr-2" onClick={() => navigate(`/flota/ordenes-trabajo/${ot.id}`)}>Ver</Button>
                                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => handleEliminarConConfirmacion(ot.id, ot.folio)}><Trash className="w-4 h-4"/></Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
            {totalPaginas > 1 && (
                <div className="flex justify-center items-center gap-2 p-4 border-t dark:border-slate-800">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled={paginaActual === 1}
                      onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                    >
                      Anterior
                    </Button>
                    <span className="text-xs text-slate-500">
                      Página {paginaActual} de {totalPaginas}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled={paginaActual === totalPaginas}
                      onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                    >
                      Siguiente
                    </Button>
                </div>
            )}
        </div>
      </Card>
    </div>
  );
}
