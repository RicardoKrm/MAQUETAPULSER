import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Plus, 
  Trash2, 
  Wrench, 
  Fuel, 
  BarChart3, 
  X, 
  FileText,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

interface RegistroContable {
  id: string;
  fecha: string;
  tipo_registro: 'INGRESO' | 'COSTO';
  categoria: string;
  descripcion: string;
  monto: number;
  created_at?: string;
}

interface ModalCostosTendenciasProps {
  isOpen: boolean;
  onClose: () => void;
  vehiculo: any;
  empresaId: string;
  onVehicleUpdated?: (updatedVehicle: any) => void;
}

const CATEGORIAS_INGRESO = [
  { value: 'CONTRATO', label: 'Ingreso por Contrato' },
  { value: 'OPERACION_VARIABLE', label: 'Ingreso Variable (Viaje, KM)' },
  { value: 'OTROS_INGRESOS', label: 'Otros Ingresos' }
];

const CATEGORIAS_COSTO = [
  { value: 'COMBUSTIBLE', label: 'Combustible' },
  { value: 'MANTENIMIENTO', label: 'Mantenimiento y Reparaciones' },
  { value: 'NEUMATICOS', label: 'Neumáticos' },
  { value: 'PEAJES', label: 'Peajes y Estacionamiento' },
  { value: 'COSTO_FIJO', label: 'Costo Fijo (Seguros, Salarios)' },
  { value: 'FLUIDOS', label: 'Lubricantes y Fluidos' },
  { value: 'COSTO_EXTRAORDINARIO', label: 'Costo Extraordinario (Multas)' },
  { value: 'OTROS_COSTOS', label: 'Otros Costos' }
];

export const ModalCostosTendencias: React.FC<ModalCostosTendenciasProps> = ({
  isOpen,
  onClose,
  vehiculo,
  empresaId,
  onVehicleUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'contable' | 'ots' | 'tendencia'>('contable');
  const [registros, setRegistros] = useState<RegistroContable[]>([]);
  const [otsVehiculo, setOtsVehiculo] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Form State
  const [fechaForm, setFechaForm] = useState(new Date().toISOString().split('T')[0]);
  const [tipoForm, setTipoForm] = useState<'INGRESO' | 'COSTO'>('COSTO');
  const [categoriaForm, setCategoriaForm] = useState('COMBUSTIBLE');
  const [descripcionForm, setDescripcionForm] = useState('');
  const [montoForm, setMontoForm] = useState('');

  useEffect(() => {
    if (!isOpen || !vehiculo) return;

    // 1. Cargar registros contables desde vehiculo.detalles.registros_contables
    const currentDetalles = vehiculo.detalles || {};
    const regList: RegistroContable[] = currentDetalles.registros_contables || [];
    setRegistros([...regList].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()));

    // 2. Cargar OTs finalizadas de este vehículo desde Supabase
    const fetchOts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orden_de_trabajo')
          .select('id, folio, numero_ot, tipo, tipo_mantenimiento, estado, pauta, costo_total, costo_insumos, costo_mano_obra_tareas, costo_mano_obra_hh, fecha_creacion, termino_proceso, fecha_cierre, kilometraje_cierre')
          .eq('empresa_id', empresaId)
          .or(`vehiculo_id.eq.${vehiculo.id},patente.eq.${vehiculo.patente || vehiculo.ppu}`)
          .in('estado', ['FINALIZADA', 'CERRADA_POR_MECANICO', 'CERRADA'])
          .order('termino_proceso', { ascending: false });

        if (!error && data) {
          setOtsVehiculo(data);
        }
      } catch (err) {
        console.error('Error cargando OTs del vehículo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOts();
    setMostrarFormulario(false);
  }, [isOpen, vehiculo, empresaId]);

  // Cambiar categoría por defecto al cambiar tipo de registro
  const handleTipoChange = (nuevoTipo: 'INGRESO' | 'COSTO') => {
    setTipoForm(nuevoTipo);
    if (nuevoTipo === 'INGRESO') {
      setCategoriaForm(CATEGORIAS_INGRESO[0].value);
    } else {
      setCategoriaForm(CATEGORIAS_COSTO[0].value);
    }
  };

  // Cálculos de KPIs
  const totalIngresos = useMemo(() => {
    return registros
      .filter(r => r.tipo_registro === 'INGRESO')
      .reduce((acc, r) => acc + (Number(r.monto) || 0), 0);
  }, [registros]);

  const totalCostosContables = useMemo(() => {
    return registros
      .filter(r => r.tipo_registro === 'COSTO')
      .reduce((acc, r) => acc + (Number(r.monto) || 0), 0);
  }, [registros]);

  const totalCostosOts = useMemo(() => {
    return otsVehiculo.reduce((acc, ot) => {
      const c = Number(ot.costo_total) || (Number(ot.costo_insumos || 0) + Number(ot.costo_mano_obra_tareas || 0) + Number(ot.costo_mano_obra_hh || 0));
      return acc + c;
    }, 0);
  }, [otsVehiculo]);

  // Costo total consolidado (OTs + Costos operacionales contables)
  const totalCostos = totalCostosContables + totalCostosOts;
  const utilidadNeta = totalIngresos - totalCostos;
  
  const kmActualVal = Number(vehiculo?.kmActual || vehiculo?.kilometrajeActual || 0);
  const costoPorKm = kmActualVal > 0 ? (totalCostos / kmActualVal) : 0;

  // Guardar nuevo registro contable
  const handleGuardarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    const montoNum = parseFloat(montoForm.replace(/\./g, '').replace(/,/g, '.'));
    if (isNaN(montoNum) || montoNum <= 0) {
      Swal.fire('Atención', 'Por favor ingrese un monto numérico positivo válido.', 'warning');
      return;
    }
    if (!descripcionForm.trim()) {
      Swal.fire('Atención', 'Por favor ingrese una descripción del registro.', 'warning');
      return;
    }

    setGuardando(true);
    try {
      const nuevoReg: RegistroContable = {
        id: 'reg_' + Date.now(),
        fecha: fechaForm,
        tipo_registro: tipoForm,
        categoria: categoriaForm,
        descripcion: descripcionForm.trim(),
        monto: montoNum,
        created_at: new Date().toISOString()
      };

      const updatedRegistros = [nuevoReg, ...registros];

      // Actualizar en Supabase
      const currentDetalles = vehiculo.detalles || {};
      const updatedDetalles = {
        ...currentDetalles,
        registros_contables: updatedRegistros
      };

      const { error } = await supabase
        .from('vehiculo')
        .update({ detalles: updatedDetalles })
        .eq('id', vehiculo.id);

      if (error) throw error;

      setRegistros(updatedRegistros);
      setDescripcionForm('');
      setMontoForm('');
      setMostrarFormulario(false);

      if (onVehicleUpdated) {
        onVehicleUpdated({
          ...vehiculo,
          detalles: updatedDetalles
        });
      }

      Swal.fire({
        title: '¡Registro Guardado!',
        text: `Se añadió el registro de ${tipoForm === 'INGRESO' ? 'Ingreso' : 'Costo'} exitosamente.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (err: any) {
      console.error('Error guardando registro:', err);
      Swal.fire('Error', 'No se pudo guardar el registro: ' + (err.message || ''), 'error');
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar un registro contable
  const handleEliminarRegistro = async (id: string) => {
    const confirm = await Swal.fire({
      title: '¿Eliminar registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    try {
      const updatedRegistros = registros.filter(r => r.id !== id);
      const currentDetalles = vehiculo.detalles || {};
      const updatedDetalles = {
        ...currentDetalles,
        registros_contables: updatedRegistros
      };

      const { error } = await supabase
        .from('vehiculo')
        .update({ detalles: updatedDetalles })
        .eq('id', vehiculo.id);

      if (error) throw error;

      setRegistros(updatedRegistros);
      if (onVehicleUpdated) {
        onVehicleUpdated({
          ...vehiculo,
          detalles: updatedDetalles
        });
      }

      Swal.fire('Eliminado', 'El registro contable fue eliminado.', 'success');
    } catch (err: any) {
      console.error('Error al eliminar registro:', err);
      Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
    }
  };

  // Agrupación mensual para la pestaña de Tendencia
  const tendenciaMensual = useMemo(() => {
    const mesesMap: { [key: string]: { ingresos: number; costosOts: number; costosContables: number; totalCostos: number } } = {};

    // Sumar OTs
    for (const ot of otsVehiculo) {
      const d = ot.termino_proceso || ot.fecha_cierre || ot.fecha_creacion;
      if (!d) continue;
      const ym = d.substring(0, 7); // YYYY-MM
      if (!mesesMap[ym]) mesesMap[ym] = { ingresos: 0, costosOts: 0, costosContables: 0, totalCostos: 0 };
      const c = Number(ot.costo_total) || (Number(ot.costo_insumos || 0) + Number(ot.costo_mano_obra_tareas || 0));
      mesesMap[ym].costosOts += c;
      mesesMap[ym].totalCostos += c;
    }

    // Sumar Registros
    for (const r of registros) {
      if (!r.fecha) continue;
      const ym = r.fecha.substring(0, 7);
      if (!mesesMap[ym]) mesesMap[ym] = { ingresos: 0, costosOts: 0, costosContables: 0, totalCostos: 0 };
      if (r.tipo_registro === 'INGRESO') {
        mesesMap[ym].ingresos += Number(r.monto) || 0;
      } else {
        mesesMap[ym].costosContables += Number(r.monto) || 0;
        mesesMap[ym].totalCostos += Number(r.monto) || 0;
      }
    }

    const meses = Object.keys(mesesMap).sort().reverse();
    return meses.map(m => {
      const parts = m.split('-');
      const nombresMes = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const mesNombre = `${nombresMes[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
      const d = mesesMap[m];
      return {
        mesRaw: m,
        mesNombre,
        ...d,
        utilidad: d.ingresos - d.totalCostos
      };
    });
  }, [registros, otsVehiculo]);

  if (!isOpen || !vehiculo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
        
        {/* Header Modal */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                  Costos y Tendencias del Vehículo
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    N° {vehiculo.numeroInterno || '—'}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  Patente: <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{vehiculo.patente || vehiculo.ppu}</span> • {vehiculo.marca || ''} {vehiculo.modelo || ''}
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* KPIs Principales Header */}
        <div className="px-6 pt-5 pb-3 grid grid-cols-2 lg:grid-cols-4 gap-3.5 bg-slate-50/30 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800/60">
          {/* 1. Total Ingresos */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" /> Total Ingresos
            </span>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              ${totalIngresos.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Contratos y servicios</span>
          </div>

          {/* 2. Total Costos */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" /> Total Costos
            </span>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              ${totalCostos.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Mantenimiento + Operación</span>
          </div>

          {/* 3. Utilidad Neta */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-blue-500" /> Utilidad Neta
            </span>
            <p className={`text-2xl font-bold mt-1 ${utilidadNeta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              ${utilidadNeta.toLocaleString('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Balance financiero global</span>
          </div>

          {/* 4. Costo por KM */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-amber-500" /> Costo por KM
            </span>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
              ${costoPorKm.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-xs font-normal text-slate-400 ml-1">/ km</span>
            </p>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Sobre {kmActualVal.toLocaleString('es-CL')} km actuales</span>
          </div>
        </div>

        {/* Navegación por Pestañas */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('contable')}
            className={`py-3 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'contable'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Registros Contables y Finanzas ({registros.length})
          </button>
          <button
            onClick={() => setActiveTab('ots')}
            className={`py-3 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'ots'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Órdenes de Trabajo de Mantenimiento ({otsVehiculo.length})
          </button>
          <button
            onClick={() => setActiveTab('tendencia')}
            className={`py-3 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === 'tendencia'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Tendencia Mensual
          </button>
        </div>

        {/* Contenido Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: REGISTROS CONTABLES */}
          {activeTab === 'contable' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Historial Contable del Vehículo
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ingresos por contratos de transporte y gastos operacionales directos (combustible, peajes, seguros, etc.)
                  </p>
                </div>
                <Button
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  {mostrarFormulario ? 'Ocultar Formulario' : 'Añadir Nuevo Registro'}
                </Button>
              </div>

              {/* Formulario Añadir Registro */}
              {mostrarFormulario && (
                <form 
                  onSubmit={handleGuardarRegistro}
                  className="p-5 bg-slate-50 dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 animate-in slide-in-from-top-2 duration-150"
                >
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                    Nuevo Registro Financiero para {vehiculo.patente || vehiculo.ppu}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Fecha */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Fecha</label>
                      <input
                        type="date"
                        required
                        value={fechaForm}
                        onChange={(e) => setFechaForm(e.target.value)}
                        className="w-full p-2 text-sm border rounded-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      />
                    </div>

                    {/* Tipo Registro */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tipo de Registro</label>
                      <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-200 dark:bg-slate-900 rounded-lg">
                        <button
                          type="button"
                          onClick={() => handleTipoChange('COSTO')}
                          className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                            tipoForm === 'COSTO'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Costo / Egreso
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTipoChange('INGRESO')}
                          className={`py-1.5 text-xs font-bold rounded-md transition-all ${
                            tipoForm === 'INGRESO'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                          }`}
                        >
                          Ingreso
                        </button>
                      </div>
                    </div>

                    {/* Categoría */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Categoría</label>
                      <select
                        value={categoriaForm}
                        onChange={(e) => setCategoriaForm(e.target.value)}
                        className="w-full p-2 text-sm border rounded-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      >
                        {(tipoForm === 'INGRESO' ? CATEGORIAS_INGRESO : CATEGORIAS_COSTO).map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Monto */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Monto ($)</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 250000"
                        value={montoForm}
                        onChange={(e) => setMontoForm(e.target.value)}
                        className="w-full p-2 text-sm border rounded-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 font-bold"
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Descripción / Glosa</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Factura de peajes A-5, Carga de 75 Lts Diesel, Contrato traslado personal..."
                      value={descripcionForm}
                      onChange={(e) => setDescripcionForm(e.target.value)}
                      className="w-full p-2 text-sm border rounded-lg dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMostrarFormulario(false)}
                      className="text-xs h-8"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={guardando}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 font-bold"
                    >
                      {guardando ? 'Guardando...' : 'Guardar Registro'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Tabla de Registros Contables */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Fecha</th>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4">Descripción</th>
                      <th className="py-3 px-4 text-right">Monto</th>
                      <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {registros.length > 0 ? (
                      registros.map((reg) => (
                        <tr key={reg.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-2.5 px-4 font-mono font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {reg.fecha ? new Date(reg.fecha + 'T00:00:00').toLocaleDateString('es-CL') : '—'}
                          </td>
                          <td className="py-2.5 px-4 whitespace-nowrap">
                            {reg.tipo_registro === 'INGRESO' ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                <ArrowUpRight className="w-3 h-3 mr-0.5" /> Ingreso
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                                <ArrowDownRight className="w-3 h-3 mr-0.5" /> Costo
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {reg.categoria}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate" title={reg.descripcion}>
                            {reg.descripcion}
                          </td>
                          <td className={`py-2.5 px-4 text-right font-bold font-mono whitespace-nowrap ${
                            reg.tipo_registro === 'INGRESO' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            {reg.tipo_registro === 'COSTO' ? '-' : '+'}${Number(reg.monto || 0).toLocaleString('es-CL')}
                          </td>
                          <td className="py-2.5 px-4 text-center">
                            <button
                              onClick={() => handleEliminarRegistro(reg.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors"
                              title="Eliminar registro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No hay registros contables ingresados para este vehículo. Puedes registrar ingresos por contrato o costos operacionales con el botón superior.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ÓRDENES DE TRABAJO (MANTENIMIENTO) */}
          {activeTab === 'ots' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Órdenes de Trabajo de Mantenimiento ({otsVehiculo.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Historial de mantenimiento preventivo y correctivo finalizado de este vehículo con su desglose exacto de costos
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-right">
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase block">Total Mantenimiento OTs</span>
                  <span className="text-base font-bold text-blue-700 dark:text-blue-300 font-mono">
                    ${totalCostosOts.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">N° OT</th>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Pauta / Tarea</th>
                      <th className="py-3 px-4">Fecha Cierre</th>
                      <th className="py-3 px-4 text-right">Repuestos ($)</th>
                      <th className="py-3 px-4 text-right">Mano Obra ($)</th>
                      <th className="py-3 px-4 text-right font-bold">Costo Total ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          Cargando órdenes de trabajo...
                        </td>
                      </tr>
                    ) : otsVehiculo.length > 0 ? (
                      otsVehiculo.map((ot) => {
                        const insumos = Number(ot.costo_insumos || 0);
                        const manoObra = Number(ot.costo_mano_obra_tareas || ot.costo_mano_obra_hh || 0);
                        const total = Number(ot.costo_total) || (insumos + manoObra);
                        const isPrev = (ot.tipo || ot.tipo_mantenimiento || '').toUpperCase().includes('PREVENTIV');

                        return (
                          <tr key={ot.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition-colors">
                            <td className="py-2.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                              {ot.numero_ot || ot.folio || `OT-${ot.id}`}
                            </td>
                            <td className="py-2.5 px-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isPrev
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}>
                                {ot.tipo || ot.tipo_mantenimiento || 'CORRECTIVA'}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 font-medium text-slate-700 dark:text-slate-300 max-w-xs truncate">
                              {ot.pauta || 'Mantenimiento General'}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                              {ot.termino_proceso || ot.fecha_cierre
                                ? new Date(ot.termino_proceso || ot.fecha_cierre).toLocaleDateString('es-CL')
                                : '—'}
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                              ${insumos.toLocaleString('es-CL')}
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                              ${manoObra.toLocaleString('es-CL')}
                            </td>
                            <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                              ${total.toLocaleString('es-CL')}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400">
                          Este vehículo no tiene órdenes de trabajo de mantenimiento finalizadas registradas en el sistema.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TENDENCIA MENSUAL */}
          {activeTab === 'tendencia' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  Evolución y Tendencia de Costos Mensuales
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Desglose mensual consolidado de ingresos, costos de taller y gastos de operación
                </p>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-800">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Mes</th>
                      <th className="py-3 px-4 text-right">Ingresos ($)</th>
                      <th className="py-3 px-4 text-right">Costos OTs ($)</th>
                      <th className="py-3 px-4 text-right">Costos Operación ($)</th>
                      <th className="py-3 px-4 text-right font-bold">Total Costos ($)</th>
                      <th className="py-3 px-4 text-right font-bold">Utilidad Neta ($)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {tendenciaMensual.length > 0 ? (
                      tendenciaMensual.map((m) => (
                        <tr key={m.mesRaw} className="hover:bg-slate-50/70 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="py-2.5 px-4 font-bold text-slate-700 dark:text-slate-200">
                            {m.mesNombre}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            ${m.ingresos.toLocaleString('es-CL')}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                            ${m.costosOts.toLocaleString('es-CL')}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                            ${m.costosContables.toLocaleString('es-CL')}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400">
                            ${m.totalCostos.toLocaleString('es-CL')}
                          </td>
                          <td className={`py-2.5 px-4 text-right font-mono font-bold ${
                            m.utilidad >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                          }`}>
                            ${m.utilidad.toLocaleString('es-CL')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          No hay datos históricos mensuales acumulados para este vehículo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-800/40">
          <Button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs h-9"
          >
            Cerrar Panel
          </Button>
        </div>

      </div>
    </div>
  );
};
