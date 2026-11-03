import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useCompany } from '../../contexts/CompanyContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  Search, Filter, Plus, FileSpreadsheet, AlertTriangle, 
  CheckCircle, Clock, Truck, ChevronRight, Activity, Wrench,
  MoreVertical, Edit3, History, TrendingUp, Trash2,
  Table as TableIcon, List, Eye, ArrowLeft, Wifi, Power, RefreshCw, CheckCircle2, AlertCircle, XCircle
} from 'lucide-react';
import Swal from 'sweetalert2';
import { CrearOTModal } from '../../components/flota/CrearOTModal';
import { CrearVehiculoModal } from '../../components/flota/CrearVehiculoModal';
import { Modal } from '../../components/ui/Modal';
import { ModalCostosTendencias } from '../../components/flota/ModalCostosTendencias';
import { calcularDatosPizarra, FilaPizarraMantenimiento, generarSecuenciaParaPauta, HitoSecuencia, obtenerPautasSecuenciaParaVehiculo, formatearDiaMesAno, mapearVehiculoDB } from '../../lib/mantenimientoLogica';
import { useAppContext } from '../../context/AppContext';
import { usePermissions } from '../../hooks/usePermissions';
import { exportToExcel } from '../../lib/excelExport';

export const obtenerSoloModelo = (modeloRaw?: string, marcaRaw?: string): string => {
  if (!modeloRaw || !modeloRaw.trim()) return '--';
  let mod = modeloRaw.trim();
  if (mod.includes('/')) {
    const parts = mod.split('/');
    mod = parts[parts.length - 1].trim();
  }
  if (marcaRaw && marcaRaw.trim()) {
    const cleanMarca = marcaRaw.trim().toLowerCase();
    if (mod.toLowerCase().startsWith(cleanMarca)) {
      mod = mod.substring(cleanMarca.length).trim();
      mod = mod.replace(/^[-/:\s]+/, '').trim();
    }
  }
  return mod || modeloRaw || '--';
};

export default function PizarraMantenimiento() {
  const { currentCompany } = useCompany();
  const { ordenesTrabajo } = useAppContext();
  const { hasPermission } = usePermissions();
  const canCrearOT = hasPermission('Módulo de Mantenimiento:Crear Órdenes');
  const canVerVehiculos = hasPermission('Módulo de Flota:Ver Vehículos');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | number | null>(null);
  const [modalOTOpen, setModalOTOpen] = useState(false);
  const [vehiculoSeleccionadoOT, setVehiculoSeleccionadoOT] = useState<string | undefined>();
  const [selectedVehicleRow, setSelectedVehicleRow] = useState<string | number | null>(null);
  const [vistaTabla, setVistaTabla] = useState(false);
  const [fichaTecnicaVehiculo, setFichaTecnicaVehiculo] = useState<any | null>(null);
  const [isEditingFicha, setIsEditingFicha] = useState(false);
  const [modalCostosOpen, setModalCostosOpen] = useState(false);
  const [vehiculoCostosSeleccionado, setVehiculoCostosSeleccionado] = useState<any | null>(null);
  const [isSyncingGpsId, setIsSyncingGpsId] = useState<string | number | null>(null);
  const [filtroEstadoOperativo, setFiltroEstadoOperativo] = useState<'ACTIVOS' | 'DADOS_DE_BAJA' | 'TODOS'>('ACTIVOS');
  const [editFichaData, setEditFichaData] = useState<any>({
    marca: '',
    modelo: '',
    ano: '',
    fechaMatriculacion: '',
    chasis: '',
    motor: '',
    norma: '',
    aplicacion: '',
    tipoAceite: '',
    intervaloMantenimiento: 10000,
    tipoIntervalo: 'KM',
    enOperacionActiva: true
  });

  useEffect(() => {
    if (fichaTecnicaVehiculo) {
      setIsEditingFicha(false);
      setEditFichaData({
        marca: fichaTecnicaVehiculo.marca || '',
        modelo: fichaTecnicaVehiculo.modelo || '',
        ano: fichaTecnicaVehiculo.ano || fichaTecnicaVehiculo.anio || '',
        fechaMatriculacion: fichaTecnicaVehiculo.detalles?.fecha_matriculacion || fichaTecnicaVehiculo.fecha_matriculacion || '',
        chasis: fichaTecnicaVehiculo.chasis || '',
        motor: fichaTecnicaVehiculo.motor || '',
        norma: fichaTecnicaVehiculo.norma || '',
        aplicacion: fichaTecnicaVehiculo.aplicacion || '',
        tipoAceite: fichaTecnicaVehiculo.tipoAceite || '',
        intervaloMantenimiento: fichaTecnicaVehiculo.intervaloMantencionKm || fichaTecnicaVehiculo.intervaloMantenimiento || fichaTecnicaVehiculo.detalles?.intervalo_mantencion_km || 10000,
        tipoIntervalo: fichaTecnicaVehiculo.tipoIntervalo || 'KM',
        enOperacionActiva: fichaTecnicaVehiculo.en_operacion_activa !== false && fichaTecnicaVehiculo.estado !== 'DE_BAJA' && fichaTecnicaVehiculo.detalles?.activo !== false
      });
    }
  }, [fichaTecnicaVehiculo]);

  const [historialVehiculo, setHistorialVehiculo] = useState<any | null>(null);
  const [otsDirectasVehiculo, setOtsDirectasVehiculo] = useState<any[]>([]);

  useEffect(() => {
    if (!historialVehiculo?.id) {
      setOtsDirectasVehiculo([]);
      return;
    }
    const fetchOTsDirectas = async () => {
      try {
        const { data, error } = await supabase
          .from('orden_de_trabajo')
          .select('*')
          .eq('vehiculo_id', historialVehiculo.id)
          .order('fecha_creacion', { ascending: false });

        if (data && !error) {
          setOtsDirectasVehiculo(data.map(d => ({
            id: d.id,
            folio: d.folio,
            tipo: d.tipo,
            prioridad: d.prioridad,
            estado: d.estado,
            fechaCreacion: d.fecha_creacion,
            fechaCierre: d.termino_proceso || d.fecha_creacion,
            costoInsumos: Number(d.costo_insumos || 0),
            costoManoObraHH: Number(d.costo_mano_obra_hh || 0),
            costoManoObraTareas: Number(d.costo_mano_obra_tareas || 0),
            vehiculoId: d.vehiculo_id,
            pauta: d.pauta
          })));
        }
      } catch (err) {
        console.warn("Error cargando OTs directas para historial:", err);
      }
    };
    fetchOTsDirectas();
  }, [historialVehiculo]);

  const navigate = useNavigate();
  
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActionMenuOpen(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [listaPautas, setListaPautas] = useState<any[]>([]);
  const [listaModelosBD, setListaModelosBD] = useState<any[]>([]);
  const [otsDirectasEmpresa, setOtsDirectasEmpresa] = useState<any[]>([]);
  const [dataFlota, setDataFlota] = useState<FilaPizarraMantenimiento[]>([]);

  // Modelos dinámicos reales de la empresa activa
  const modelos = useMemo(() => {
    const modelosMap = new Map<string, string>();

    const agregarModelo = (nombre?: string | null, marca?: string | null) => {
      if (!nombre) return;
      const clean = obtenerSoloModelo(nombre, marca);
      const trimmed = clean !== '--' ? clean.trim() : String(nombre).trim();
      if (!trimmed || trimmed === '--' || trimmed === 'N/A') return;
      const key = trimmed.toLowerCase();
      if (!modelosMap.has(key)) {
        modelosMap.set(key, trimmed);
      }
    };

    // 1. Modelos desde vehículos cargados en dataFlota de la empresa activa
    dataFlota.forEach(v => {
      agregarModelo(v.modelo, v.marca);
      if (v.detalles?.modelo) agregarModelo(v.detalles.modelo, v.marca || v.detalles?.marca);
    });

    // 2. Modelos configurados en mantenimiento_modelo_vehiculo
    listaModelosBD.forEach(m => {
      agregarModelo(m.nombre, m.marca);
    });

    // 3. Modelos vinculados a las pautas
    listaPautas.forEach(p => {
      agregarModelo(p.modelo?.nombre || p.nombre_modelo_vehiculo || p.modelo_nombre);
    });

    return Array.from(modelosMap.values()).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [dataFlota, listaModelosBD, listaPautas]);

  // Tipos de mantenimiento / Pautas dinámicas reales de la empresa activa
  const tiposMantenimiento = useMemo(() => {
    const tiposMap = new Map<string, string>();

    const agregarTipo = (tipo?: string | null) => {
      if (!tipo) return;
      const trimmed = String(tipo).trim();
      if (
        !trimmed || 
        trimmed === '--' || 
        trimmed === 'N/A' || 
        trimmed === '—' ||
        trimmed === 'Siguiente Pauta' || 
        trimmed === 'Todos los tipos' ||
        trimmed === 'Sin Pauta' ||
        trimmed.toUpperCase().includes('GENERICO')
      ) return;
      const key = trimmed.toLowerCase();
      if (!tiposMap.has(key)) {
        tiposMap.set(key, trimmed);
      }
    };

    // 1. Pautas configuradas en la BD de la empresa activa
    listaPautas.forEach(p => {
      agregarTipo(p.nombre);
    });

    // 2. Tipos e hitos presentes en la flota actual
    dataFlota.forEach(v => {
      agregarTipo(v.tipoUltimoMantencion);
      agregarTipo(v.tipoProximoMantencion);
      if (v.pautaVencida) {
        v.pautaVencida.split(',').forEach(pv => agregarTipo(pv));
      }
      if (v.pautasSecuencia && Array.isArray(v.pautasSecuencia)) {
        v.pautasSecuencia.forEach(h => agregarTipo(h.nombre));
      }
    });

    // 3. Tipos/Pautas presentes en las OTs de la empresa
    ordenesTrabajo.forEach(o => {
      if (o.pauta) {
        agregarTipo(o.pauta);
      }
    });

    return Array.from(tiposMap.values()).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
  }, [listaPautas, dataFlota, ordenesTrabajo]);

  const [filtroModelo, setFiltroModelo] = useState('');
  const [filtroTipoMant, setFiltroTipoMant] = useState('');
  const [soloProximosOVencidos, setSoloProximosOVencidos] = useState(false);
  const [modalVehiculoOpen, setModalVehiculoOpen] = useState(false);

  // States for Actualizar KM
  const [modalKMOpen, setModalKMOpen] = useState(false);
  const [vehiculoSeleccionadoKM, setVehiculoSeleccionadoKM] = useState<FilaPizarraMantenimiento | null>(null);
  const [nuevoKM, setNuevoKM] = useState('');
  const [fechaRegistroKM, setFechaRegistroKM] = useState('');

  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const fetchVehiculos = async () => {
    if (!currentCompany?.id) return;
    try {
      const [
        { data: vehiculosData, error: vehiculosError },
        { data: pautasData },
        { data: modelosBdData },
        { data: otsData }
      ] = await Promise.all([
        supabase.from('vehiculo').select('*').eq('empresa_id', currentCompany.id),
        supabase.from('mantenimiento_pauta').select('*, modelo:mantenimiento_modelo_vehiculo(nombre)').eq('empresa_id', currentCompany.id),
        supabase.from('mantenimiento_modelo_vehiculo').select('nombre, marca').eq('empresa_id', currentCompany.id),
        supabase.from('orden_de_trabajo').select('id, folio, vehiculo_id, tipo, estado, pauta, costo_total, costo_insumos, costo_mano_obra_tareas, costo_mano_obra_hh, kilometraje_apertura, kilometraje_cierre, fecha_creacion, termino_proceso').eq('empresa_id', currentCompany.id)
      ]);

      if (vehiculosError) throw vehiculosError;
      if (pautasData) setListaPautas(pautasData);
      if (modelosBdData) setListaModelosBD(modelosBdData);
      if (otsData) setOtsDirectasEmpresa(otsData);
      
      console.log("FETCHED VEHICULOS DB:", vehiculosData, "OTs DB:", otsData?.length);
      if (vehiculosData) {
        const otsParaCalculo = (otsData && otsData.length > 0) ? otsData : (ordenesTrabajo || []);
        const vehiculosDb = vehiculosData.map(v => mapearVehiculoDB(v, pautasData || [], otsParaCalculo));

        const pizarraData = vehiculosDb.map(v => calcularDatosPizarra(v));
        pizarraData.sort((a,b) => String(a.numeroInterno).localeCompare(String(b.numeroInterno), undefined, {numeric: true}));
        setDataFlota(pizarraData);
        return vehiculosData;
      }
    } catch (err) {
      console.error('Error fetching vehiculos for Pizarra:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchVehiculos();
    
    // Auto-refresh the Pizarra every 1 minute to reflect background GPS updates
    const intervalId = setInterval(() => {
      fetchVehiculos();
    }, 60000);

    const handleSync = (e?: any) => {
      const detail = e?.detail;
      if (detail && detail.vehiculoId) {
        setDataFlota(prev => {
          return prev.map(fila => {
            if (String(fila.id) === String(detail.vehiculoId)) {
              const rawKmCierre = detail.kmCierre !== undefined ? Number(detail.kmCierre || 0) : (fila.kmUltimoMantencion || fila.kmUltimaMantencion || 0);
              const rawKmActual = detail.kmActual !== undefined ? Number(detail.kmActual || 0) : (fila.kmActual || fila.kilometrajeActual || 0);
              const rawFechaMant = detail.fechaMant ? new Date(detail.fechaMant) : fila.fechaUltimaMantencion;
              const rawFechaKm = detail.fechaActualizacionKm ? new Date(detail.fechaActualizacionKm) : fila.fechaActualizacionKm;
              const rawTipo = detail.tipoMant || fila.tipoUltimoMantencion || fila.tipoUltimaPauta;
              const vehActualizado: any = {
                ...fila,
                kilometrajeActual: rawKmActual,
                kmActual: rawKmActual,
                fechaActualizacionKm: rawFechaKm,
                kmUltimaMantencion: rawKmCierre,
                fechaUltimaMantencion: rawFechaMant,
                tipoUltimoMantencion: rawTipo,
                tipoUltimaPauta: rawTipo,
                detalles: {
                  ...(fila.detalles || {}),
                  km_ultima_mantencion: rawKmCierre,
                  fecha_ultima_mantencion: detail.fechaMant || fila.detalles?.fecha_ultima_mantencion,
                  fecha_actualizacion_km: detail.fechaActualizacionKm || fila.detalles?.fecha_actualizacion_km,
                  tipo_ultimo_mant: rawTipo
                }
              };
              const calculos = calcularDatosPizarra(vehActualizado);
              return {
                ...vehActualizado,
                ...calculos,
                kilometrajeActual: rawKmActual,
                kmActual: rawKmActual,
                fechaActualizacionKm: rawFechaKm,
                kmUltimaMantencion: rawKmCierre,
                fechaUltimaMantencion: rawFechaMant,
                tipoUltimoMantencion: rawTipo,
                tipoUltimaPauta: rawTipo
              };
            }
            return fila;
          });
        });
      }
      if (!detail?.source || detail.source !== 'local') {
        fetchVehiculos();
      }
    };

    window.addEventListener('vehiculo-actualizado', handleSync);
    window.addEventListener('ot-actualizada', handleSync);
    window.addEventListener('focus', handleSync);
    
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('vehiculo-actualizado', handleSync);
      window.removeEventListener('ot-actualizada', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [currentCompany?.id]);

  // Actualización reactiva inmediata de la Pizarra cuando cambian las órdenes de trabajo
  useEffect(() => {
    if (currentCompany?.id) {
      fetchVehiculos();
    }
  }, [ordenesTrabajo]);

  const handleGuardarKM = async () => {
    if (!vehiculoSeleccionadoKM || !nuevoKM || !fechaRegistroKM) return;
    
    // Remove dots or commas if user typed thousands separator, then parse int
    const cleanNuevoKM = nuevoKM.replace(/\./g, '').replace(/,/g, '');
    const newKmVal = parseInt(cleanNuevoKM, 10);
    
    if (isNaN(newKmVal) || newKmVal < 0) {
        Swal.fire('Atención', 'Por favor ingrese un kilometraje numérico válido.', 'warning');
        return;
    }

    const oldKmVal = Number(vehiculoSeleccionadoKM.kmActual || vehiculoSeleccionadoKM.kilometrajeActual || 0);
    
    // get dates
    const newDate = new Date(fechaRegistroKM);
    const oldDateStr = vehiculoSeleccionadoKM.fechaActualizacionKm;
    const oldDate = oldDateStr instanceof Date ? oldDateStr : new Date(oldDateStr || new Date());
    
    // calc differences
    const diffTime = Math.abs(newDate.getTime() - oldDate.getTime());
    // Evitar que diffDays sea 0 para que siempre actualice el promedio si el KM cambió el mismo día
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    
    let baseKmPromedio = vehiculoSeleccionadoKM.kmPromedioDia || 0;

    if (newKmVal > oldKmVal) {
        const diffKm = newKmVal - oldKmVal;
        baseKmPromedio = Math.round(diffKm / diffDays);
        if (baseKmPromedio <= 0) baseKmPromedio = 51;
    } else if (baseKmPromedio === 0) {
        baseKmPromedio = 51;
    }

    // 1. ACTUALIZACIÓN OPTIMISTA INMEDIATA EN MEMORIA (0 ms)
    const kmUltimoRef = vehiculoSeleccionadoKM.kmUltimoMantencion || vehiculoSeleccionadoKM.kmUltimaMantencion || 0;
    const fechaUltMantRef = vehiculoSeleccionadoKM.fechaUltimaMantencion || (vehiculoSeleccionadoKM.fechaUltimoMantencion ? new Date(vehiculoSeleccionadoKM.fechaUltimoMantencion) : null);
    const tipoUltPautaRef = vehiculoSeleccionadoKM.tipoUltimaPauta || vehiculoSeleccionadoKM.tipoUltimoMantencion || 'N/A';

    setDataFlota(prev => prev.map(fila => {
      if (String(fila.id) === String(vehiculoSeleccionadoKM.id)) {
        const vehActualizado: any = {
          ...fila,
          kilometrajeActual: newKmVal,
          kmActual: newKmVal,
          fechaActualizacionKm: newDate,
          kmUltimaMantencion: kmUltimoRef,
          fechaUltimaMantencion: fechaUltMantRef,
          tipoUltimaPauta: tipoUltPautaRef,
          kmPromedioDia: baseKmPromedio,
          detalles: {
            ...(fila.detalles || {}),
            fecha_actualizacion_km: newDate.toISOString(),
            kmPromedioDia: baseKmPromedio
          }
        };
        const calculos = calcularDatosPizarra(vehActualizado);
        return {
          ...vehActualizado,
          ...calculos,
          kilometrajeActual: newKmVal,
          kmActual: newKmVal,
          fechaActualizacionKm: newDate,
          fechaKmActual: formatearDiaMesAno(newDate)
        };
      }
      return fila;
    }));

    setModalKMOpen(false);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `Odómetro de ${vehiculoSeleccionadoKM.numeroInterno || vehiculoSeleccionadoKM.patente} actualizado a ${newKmVal.toLocaleString('es-CL')} km`,
      showConfirmButton: false,
      timer: 2000
    });

    // 2. PERSISTENCIA EN SUPABASE EN SEGUNDO PLANO
    try {
        const { data } = await supabase.from('vehiculo').select('detalles').eq('id', vehiculoSeleccionadoKM.id).maybeSingle();
        const existingDetalles = data?.detalles || {};
        if (baseKmPromedio > 0) {
            existingDetalles.kmPromedioDia = baseKmPromedio;
        }
        const nowIso = new Date().toISOString();
        existingDetalles.fecha_actualizacion_km = newDate.toISOString();
        existingDetalles.odometro_manual = true;
        existingDetalles.fecha_odometro_manual = nowIso;
        existingDetalles.km_manual = newKmVal;

        const payload: any = {
            kilometraje_actual: newKmVal,
            fecha_actualizacion_km: newDate.toISOString(),
            km_promedio_dia: baseKmPromedio,
            detalles: existingDetalles
        };

        const { error } = await supabase.from('vehiculo').update(payload).eq('id', vehiculoSeleccionadoKM.id);
        if (error) {
            console.warn("Reintentando actualización de odómetro con payload básico:", error);
            await supabase.from('vehiculo').update({
                kilometraje_actual: newKmVal,
                fecha_actualizacion_km: newDate.toISOString(),
                detalles: existingDetalles
            }).eq('id', vehiculoSeleccionadoKM.id);
        }

        // 3. DISPARAR EVENTO GLOBAL EN TIEMPO REAL DESPUÉS DE LA PERSISTENCIA EXITOSA
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('vehiculo-actualizado', {
            detail: {
              vehiculoId: vehiculoSeleccionadoKM.id,
              kmActual: newKmVal,
              fechaActualizacionKm: newDate.toISOString(),
              source: 'local'
            }
          }));
        }
    } catch (e: any) {
        console.error('Error al persistir KM en Supabase:', e);
    }
  };

  const handleExportarExcel = () => {
    if (!vehiculosFiltrados || vehiculosFiltrados.length === 0) {
      Swal.fire({
        title: 'Sin datos para exportar',
        text: 'No hay vehículos en la pizarra con los filtros seleccionados.',
        icon: 'info',
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    const dataToExport = vehiculosFiltrados.map((v) => ({
      'N° Int.': v.numeroInterno || '—',
      'PPU': v.ppu || '—',
      'Marca': v.marca || '—',
      'Modelo': v.modelo || '—',
      'KM Últ. Mant.': v.kmUltimoMantencion || 0,
      'F. Últ. Mant.': v.fechaUltimoMantencion || '—',
      'Tipo Mant.': v.tipoUltimoMantencion || '—',
      'Cumplimiento': v.cumplimiento || '—',
      'Estatus': v.estatus === 'REALIZAR_MANT' || v.estatus === 'EN_TIEMPO' ? 'REALIZAR MANT.' : v.estatus === 'PROXIMO' ? 'MANT. PRÓXIMO' : v.estatus === 'VENCIDO' ? 'MANT. VENCIDO' : 'NORMALIDAD',
      'KM Vencido': v.kmVencido !== null && v.kmVencido !== undefined ? v.kmVencido : '—',
      'Pauta Vencida': v.pautaVencida || '—',
      'KM Actual': v.kmActual || 0,
      'Fecha KM Actual': v.fechaKmActual || '—',
      'KM Próx. Mant.': v.kmProximoMantencion || '—',
      'Tipo Próx. Mant.': v.tipoProximoMantencion || '—',
      'Fecha Próx. Mant.': v.fechaProximaMantencion || '—',
      'Intervalo KM': v.intervaloMantencionKm || 10000,
      'KM Promedio Día': v.kmPromedioDia || 0
    }));

    const fechaStr = new Date().toISOString().split('T')[0];
    exportToExcel(dataToExport, `Pizarra_Mantenimiento_${fechaStr}`, 'PizarraMantenimiento');
  };

  const handleSaveFicha = async () => {
    if (!fichaTecnicaVehiculo) return;
    try {
      // Get existing details
      const { data, error: selectErr } = await supabase
        .from('vehiculo')
        .select('detalles')
        .eq('id', fichaTecnicaVehiculo.id)
        .single();
        
      const existingDetalles = data?.detalles || {};
      
      let cleanMarca = editFichaData.marca?.trim() || '';
      let cleanModelo = editFichaData.modelo?.trim() || '';
      
      if (cleanModelo.includes('/')) {
        const parts = cleanModelo.split('/');
        if (!cleanMarca) cleanMarca = parts[0]?.trim();
        cleanModelo = parts.slice(1).join('/').trim();
      } else if (cleanModelo && cleanMarca && cleanModelo.toLowerCase().startsWith(cleanMarca.toLowerCase())) {
        cleanModelo = cleanModelo.substring(cleanMarca.length).replace(/^[-/:\s]+/, '').trim();
      }

      const isActivo = editFichaData.enOperacionActiva !== false;
      const nuevoIntervalo = parseInt(String(editFichaData.intervaloMantenimiento || '10000').replace(/[^0-9]+/g, ''), 10) || 10000;
      const nuevoTipoIntervalo = editFichaData.tipoIntervalo || 'KM';

      const payload: any = {
        marca: cleanMarca,
        modelo: cleanModelo,
        anio: parseInt(editFichaData.ano || '0', 10) || null,
        chasis: editFichaData.chasis,
        motor: editFichaData.motor,
        norma_euro: editFichaData.norma,
        aplicacion: editFichaData.aplicacion,
        tipo_aceite: editFichaData.tipoAceite,
        intervalo_mantencion_km: nuevoIntervalo,
        intervalo_km: nuevoIntervalo,
        en_operacion_activa: isActivo,
        estado: isActivo ? 'OPERATIVO' : 'DE_BAJA',
        detalles: {
          ...existingDetalles,
          marca: cleanMarca,
          modelo: cleanModelo,
          ano: editFichaData.ano,
          anio: editFichaData.ano,
          chasis: editFichaData.chasis,
          motor: editFichaData.motor,
          norma: editFichaData.norma,
          norma_euro: editFichaData.norma,
          aplicacion: editFichaData.aplicacion,
          tipoAceite: editFichaData.tipoAceite,
          tipo_aceite: editFichaData.tipoAceite,
          intervalo_mantencion_km: nuevoIntervalo,
          intervalo_km: nuevoIntervalo,
          intervaloMantenimiento: nuevoIntervalo,
          tipo_intervalo: nuevoTipoIntervalo,
          fecha_matriculacion: editFichaData.fechaMatriculacion,
          en_operacion_activa: isActivo,
          activo: isActivo
        }
      };

      const { error } = await supabase
        .from('vehiculo')
        .update(payload)
        .eq('id', fichaTecnicaVehiculo.id);

      if (error) throw error;

      // Update local modal state
      setFichaTecnicaVehiculo({
        ...fichaTecnicaVehiculo,
        marca: cleanMarca,
        modelo: cleanModelo,
        ano: editFichaData.ano,
        anio: editFichaData.ano,
        chasis: editFichaData.chasis,
        motor: editFichaData.motor,
        norma: editFichaData.norma,
        aplicacion: editFichaData.aplicacion,
        tipoAceite: editFichaData.tipoAceite,
        intervaloMantencionKm: nuevoIntervalo,
        intervaloMantenimiento: nuevoIntervalo,
        tipoIntervalo: nuevoTipoIntervalo,
        fecha_matriculacion: editFichaData.fechaMatriculacion,
        en_operacion_activa: isActivo,
        estado: isActivo ? 'OPERATIVO' : 'DE_BAJA',
        detalles: payload.detalles
      });
      
      // Update dataFlota reactively (0 ms) with newly recalculated future milestones
      setDataFlota(prev => prev.map(item => {
        if (String(item.id) === String(fichaTecnicaVehiculo.id)) {
          const vehiculoActualizado = mapearVehiculoDB(
            {
              ...fichaTecnicaVehiculo,
              ...payload,
              id: fichaTecnicaVehiculo.id,
              intervalo_mantencion_km: nuevoIntervalo,
              intervalo_km: nuevoIntervalo,
              detalles: payload.detalles
            },
            listaPautas || [],
            otsDirectasEmpresa || []
          );
          return calcularDatosPizarra(vehiculoActualizado);
        }
        return item;
      }));

      setIsEditingFicha(false);

      Swal.fire({
        title: 'Ficha Guardada',
        text: isActivo 
          ? `Ficha técnica actualizada. Nuevo intervalo de ${nuevoIntervalo.toLocaleString('es-CL')} KM aplicado al cronograma.` 
          : 'El vehículo ha sido dado de baja. Ya no aparecerá en la pizarra activa ni generará cálculos de costos o GPS.',
        icon: 'success',
        timer: 2500,
        showConfirmButton: false
      });

      // Refresh database records
      fetchVehiculos();
    } catch (e: any) {
      console.error('Error saving technical sheet:', e);
      Swal.fire({
        title: 'Error al Guardar',
        text: e.message || 'No se pudieron guardar los cambios en la base de datos.',
        icon: 'error'
      });
    }
  };

  const [kpiModal, setKpiModal] = useState<string | null>(null);

  const parseFechaString = (fStr?: string | null): Date | null => {
    if (!fStr || fStr === '—' || fStr === '--') return null;
    const parts = fStr.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        const d = new Date(fStr);
        return isNaN(d.getTime()) ? null : d;
      } else {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return isNaN(d.getTime()) ? null : d;
      }
    }
    const d = new Date(fStr);
    return isNaN(d.getTime()) ? null : d;
  };

  // Calcular órdenes de trabajo efectivas de la empresa (declarado antes de los filtros)
  const otsEfectivas = useMemo(() => {
    if (otsDirectasEmpresa && otsDirectasEmpresa.length > 0) return otsDirectasEmpresa;
    return ordenesTrabajo || [];
  }, [otsDirectasEmpresa, ordenesTrabajo]);

  const vehiculosFiltrados = dataFlota.filter(v => {
    // Filtro por Estado Operativo (Activos / Dados de Baja / Todos)
    const isActivo = v.en_operacion_activa !== false && v.estado !== 'DE_BAJA' && v.detalles?.activo !== false;
    if (filtroEstadoOperativo === 'ACTIVOS' && !isActivo) return false;
    if (filtroEstadoOperativo === 'DADOS_DE_BAJA' && isActivo) return false;

    if (busqueda && !(v.ppu || '').toLowerCase().includes(busqueda.toLowerCase()) && !v.numeroInterno.toLowerCase().includes(busqueda.toLowerCase())) {
      return false;
    }
    if (filtroModelo) {
      const modFiltro = filtroModelo.toLowerCase().trim();
      const vMod = (v.modelo || '').toLowerCase().trim();
      const vDetMod = ((v.detalles && v.detalles.modelo) || '').toLowerCase().trim();
      const vMarca = (v.marca || '').toLowerCase().trim();
      const match = vMod === modFiltro || 
                    vMod.includes(modFiltro) || 
                    modFiltro.includes(vMod) ||
                    vDetMod.includes(modFiltro) ||
                    `${vMarca} ${vMod}`.includes(modFiltro);
      if (!match) return false;
    }
    if (filtroTipoMant && filtroTipoMant !== 'Todos los tipos') {
      const target = filtroTipoMant.toLowerCase().trim();
      const prox = (v.tipoProximoMantencion || '').toLowerCase();
      const ult = (v.tipoUltimoMantencion || '').toLowerCase();
      const venc = (v.pautaVencida || '').toLowerCase();
      const enSecuencia = (v.pautasSecuencia || []).some(h => (h.nombre || '').toLowerCase().includes(target));

      if (!prox.includes(target) && !ult.includes(target) && !venc.includes(target) && !enSecuencia) {
        return false;
      }
    }
    if (soloProximosOVencidos && v.estatus === 'NORMAL') return false;

    if (fechaDesde || fechaHasta) {
      const dUlt = v.fechaUltimaMantencion ? new Date(v.fechaUltimaMantencion) : parseFechaString(v.fechaUltimoMantencion);
      const dUltStr = dUlt instanceof Date && !isNaN(dUlt.getTime()) ? dUlt.toISOString().split('T')[0] : null;

      const tieneOtEnRango = otsEfectivas.some((ot: any) => {
        const vId = String(ot.vehiculo_id || ot.vehiculoId || '');
        const pat = String(ot.patente || '').trim().toUpperCase();
        const match = (vId && vId === String(v.id)) || (pat && pat === (v.ppu || v.patente || '').trim().toUpperCase());
        if (!match) return false;

        const rawDate = ot.termino_proceso || ot.fecha_cierre || ot.fecha_creacion || ot.fechaProgramada;
        if (!rawDate) return false;
        const dStr = String(rawDate).substring(0, 10);
        if (fechaDesde && dStr < fechaDesde) return false;
        if (fechaHasta && dStr > fechaHasta) return false;
        return true;
      });

      const ultMantEnRango = dUltStr && (!fechaDesde || dUltStr >= fechaDesde) && (!fechaHasta || dUltStr <= fechaHasta);

      if (!tieneOtEnRango && !ultMantEnRango) return false;
    }
    
    return true;
  });

  const vehiculosIdsVisibles = useMemo(() => new Set(vehiculosFiltrados.map(v => String(v.id))), [vehiculosFiltrados]);
  const patentesVisibles = useMemo(() => new Set(vehiculosFiltrados.map(v => (v.ppu || v.patente || '').trim().toUpperCase()).filter(Boolean)), [vehiculosFiltrados]);

  const otsVisibles = useMemo(() => {
    return otsEfectivas.filter((ot: any) => {
      const vId = String(ot.vehiculo_id || ot.vehiculoId || '');
      if (vId && vehiculosIdsVisibles.has(vId)) {
        // match
      } else {
        const pat = String(ot.patente || '').trim().toUpperCase();
        if (!pat || !patentesVisibles.has(pat)) return false;
      }

      if (fechaDesde || fechaHasta) {
        const rawDate = ot.termino_proceso || ot.fecha_cierre || ot.fecha_creacion || ot.fechaProgramada;
        if (!rawDate) return false;
        const dStr = String(rawDate).substring(0, 10);
        if (fechaDesde && dStr < fechaDesde) return false;
        if (fechaHasta && dStr > fechaHasta) return false;
      }

      return true;
    });
  }, [otsEfectivas, vehiculosIdsVisibles, patentesVisibles, fechaDesde, fechaHasta]);

  const getOtCost = (ot: any): number => {
    const rawTotal = Number(ot.costo_total ?? ot.costoTotal);
    if (!isNaN(rawTotal) && rawTotal > 0) return rawTotal;
    const insumos = Number(ot.costo_insumos ?? ot.costoInsumos) || 0;
    const tareas = Number(ot.costo_mano_obra_tareas ?? ot.costoManoObraTareas) || 0;
    const hh = Number(ot.costo_mano_obra_hh ?? ot.costoManoObraHH) || 0;
    return insumos + tareas + hh;
  };

  const otsVisiblesFinalizadas = useMemo(() => {
    return otsVisibles.filter((ot: any) => {
      const est = String(ot.estado || '').toUpperCase();
      return est === 'FINALIZADA' || est === 'CERRADA_POR_MECANICO' || est === 'CERRADA';
    });
  }, [otsVisibles]);

  const costoPreventivo = useMemo(() => otsVisiblesFinalizadas
    .filter((ot: any) => (ot.tipo || '').toUpperCase().includes('PREVENTIV'))
    .reduce((acc: number, ot: any) => acc + getOtCost(ot), 0), [otsVisiblesFinalizadas]);

  const costoCorrectivo = useMemo(() => otsVisiblesFinalizadas
    .filter((ot: any) => (ot.tipo || '').toUpperCase().includes('CORRECTIV'))
    .reduce((acc: number, ot: any) => acc + getOtCost(ot), 0), [otsVisiblesFinalizadas]);

  const costoEvaluativo = useMemo(() => otsVisiblesFinalizadas
    .filter((ot: any) => {
      const t = (ot.tipo || '').toUpperCase();
      return !t.includes('PREVENTIV') && !t.includes('CORRECTIV');
    })
    .reduce((acc: number, ot: any) => acc + getOtCost(ot), 0), [otsVisiblesFinalizadas]);

  const costoTotal = costoPreventivo + costoCorrectivo + costoEvaluativo;

  const totalKmAcumulados = vehiculosFiltrados.reduce((acc, v) => acc + (Number(v.kilometrajeActual) || 0), 0);
  const costoKm = totalKmAcumulados > 0 ? (costoTotal / totalKmAcumulados).toFixed(2) : '0';

  const kpis = {
    vehiculosFiltrados: vehiculosFiltrados.length,
    porcentajeFlota: dataFlota.length > 0 ? Math.round((vehiculosFiltrados.length / dataFlota.length) * 100) : 0,
    nivelCumplimiento: dataFlota.length > 0 ? Math.round((dataFlota.filter(v => v.cumplimiento === 'NORMAL' || v.cumplimiento === 'EN RANGO' || v.cumplimiento === 'ANTICIPADO').length / (dataFlota.filter(v => v.cumplimiento && v.cumplimiento !== 'N/A').length || dataFlota.length)) * 100) : 0,
    costoTotal,
    costoPreventivo,
    costoCorrectivo,
    costoEvaluativo,
    totalKmAcumulados,
    costoKm
  };

  const handleActualizarGpsVehiculo = async (vehiculo: any) => {
    setActionMenuOpen(null);
    setIsSyncingGpsId(vehiculo.id);

    Swal.fire({
      title: 'Consultando GPS en tiempo real...',
      html: `Obteniendo odómetro fresco para la patente <b>${vehiculo.patente || vehiculo.ppu}</b>...`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // 1. Obtener datos frescos del vehículo y empresa
      const [vehRes, empRes] = await Promise.all([
        supabase.from('vehiculo').select('id, patente, kilometraje_actual, km_ultima_mantencion, detalles').eq('id', vehiculo.id).single(),
        supabase.from('empresa').select('detalles').eq('id', currentCompany?.id).single()
      ]);

      const vehData = vehRes.data || vehiculo;
      const detalles = vehData.detalles || {};
      const apiKeys = empRes.data?.detalles?.gps_config || {};
      const prov = detalles.gps_proveedor || (apiKeys.gpsglobal ? 'gpsglobal' : apiKeys.traccar_url ? 'traccar' : null);

      if (!prov && !apiKeys.gpsglobal && !apiKeys.traccar_url && !apiKeys.samm) {
        Swal.fire({
          title: 'Sin proveedor GPS',
          text: 'Este vehículo no tiene un proveedor de GPS configurado. Puedes asignarlo en Configuración > Integración GPS o en la Ficha Técnica.',
          icon: 'info'
        });
        return;
      }

      let nuevoKm: number | null = null;
      let fechaGps: string | null = null;

      if (prov === 'gpsglobal' || apiKeys.gpsglobal) {
        const token = apiKeys.gpsglobal || 'CjilvA2OzouXtdV2gTApfCE5ftYFPIxc';
        const cleanPatente = (vehData.patente || '').trim().toUpperCase();
        
        const res = await fetch('/api/gps/sync-gps1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patente: cleanPatente, token })
        });

        if (!res.ok) throw new Error('Error al consultar GPS Global');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const ultimo = data.reduce((max: any, item: any) => (!max || (item.fecha && item.fecha > max.fecha)) ? item : max, null);
          const rawOdo = ultimo?.odometro_vehiculo || ultimo?.odometro_gps;
          if (rawOdo) {
            let km = parseFloat(String(rawOdo));
            const kmBaseRef = Number(vehData.km_ultima_mantencion || detalles?.km_ultima_mantencion || vehData.kilometraje_actual || 0);
            if (kmBaseRef > 1000 && km > (kmBaseRef * 4) && Math.abs((km / 10) - kmBaseRef) < kmBaseRef) {
              km = Math.round((km / 10) * 100) / 100;
            }
            nuevoKm = km;
            fechaGps = ultimo.fecha;
          }
        }
      } else if (prov === 'traccar' && apiKeys.traccar_url) {
        const res = await fetch('/api/gps/sync-gps2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: apiKeys.traccar_url,
            username: apiKeys.traccar_user,
            password: apiKeys.traccar_pass
          })
        });
        if (res.ok) {
          const parsed = await res.json();
          const registro = parsed.find((x: any) => x.plateNumber === vehData.patente);
          if (registro && registro.odometer) {
            nuevoKm = parseFloat(registro.odometer);
            fechaGps = registro.timestamp;
          }
        }
      } else if (prov === 'dominio' && apiKeys.samm) {
        const hoy = new Date().toISOString().split('T')[0];
        const res = await fetch('/api/gps/dominio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patente: vehData.patente,
            desde: hoy + ' 00:00:00',
            hasta: hoy + ' 23:59:59',
            token: apiKeys.samm
          })
        });
        if (res.ok) {
          const d = await res.json();
          if (d.totalKm) {
            nuevoKm = (Number(vehData.kilometraje_actual) || 0) + Number(d.totalKm);
            fechaGps = d.lastTimestamp;
          }
        }
      }

      if (nuevoKm === null || isNaN(nuevoKm)) {
        Swal.fire({
          title: 'Sin datos recientes',
          text: `No se encontraron lecturas telemétricas nuevas para la patente ${vehData.patente} en el servidor GPS.`,
          icon: 'warning'
        });
        return;
      }

      nuevoKm = Math.round(nuevoKm * 100) / 100;

      // Actualizar en Supabase
      const fechaActualizacion = fechaGps && !isNaN(new Date(fechaGps).getTime())
        ? new Date(fechaGps).toISOString()
        : new Date().toISOString();

      const updatedDetalles = {
        ...detalles,
        fecha_actualizacion_km: fechaActualizacion
      };

      const { error: updateErr } = await supabase
        .from('vehiculo')
        .update({
          kilometraje_actual: nuevoKm,
          fecha_actualizacion_km: fechaActualizacion,
          detalles: updatedDetalles
        })
        .eq('id', vehData.id);

      if (updateErr) throw updateErr;

      // Actualizar estado local inmediatamente
      setDataFlota(prev => prev.map(fila => {
        if (fila.id === vehData.id) {
          const kmFaltante = (fila.intervaloMantenimiento || 10000) - (nuevoKm - (fila.kmUltimaMantencion || 0));
          return {
            ...fila,
            kmActual: nuevoKm,
            kilometrajeActual: nuevoKm,
            kmFaltante,
            fechaActualizacionKm: fechaActualizacion
          };
        }
        return fila;
      }));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vehiculo-actualizado', {
          detail: {
            vehiculoId: vehData.id,
            kmActual: nuevoKm,
            fechaActualizacionKm: fechaActualizacion
          }
        }));
      }

      Swal.fire({
        title: '¡Odómetro GPS Actualizado!',
        html: `
          <div class="text-left space-y-2 text-sm">
            <p><b>Vehículo:</b> ${vehData.patente} (${vehiculo.numeroInterno ? 'N° ' + vehiculo.numeroInterno : ''})</p>
            <p><b>Nuevo Kilometraje:</b> <span class="text-emerald-600 font-bold text-base">${nuevoKm.toLocaleString('es-CL')} KM</span></p>
            <p><b>Fecha Telemetría:</b> ${fechaGps || new Date().toLocaleString('es-CL')}</p>
          </div>
        `,
        icon: 'success'
      });
    } catch (err: any) {
      console.error('Error al actualizar GPS individual:', err);
      Swal.fire('Error', 'No se pudo conectar con el servicio GPS o procesar la lectura: ' + (err.message || ''), 'error');
    } finally {
      setIsSyncingGpsId(null);
    }
  };

  const handleAbrirCostosTendencias = (vehiculo: any) => {
    setActionMenuOpen(null);
    setVehiculoCostosSeleccionado(vehiculo);
    setModalCostosOpen(true);
  };

  const handleVehicleCostosUpdated = (updatedVehicle: any) => {
    setDataFlota(prev => prev.map(v => v.id === updatedVehicle.id ? { ...v, detalles: updatedVehicle.detalles } : v));
    if (fichaTecnicaVehiculo && fichaTecnicaVehiculo.id === updatedVehicle.id) {
      setFichaTecnicaVehiculo({ ...fichaTecnicaVehiculo, detalles: updatedVehicle.detalles });
    }
  };

  const handleDeletePermanent = async (id: string | number) => {
    const result = await Swal.fire({
      title: '¿Eliminar vehículo definitivamente?',
      text: "Esta acción no se puede deshacer y podría fallar si el vehículo tiene historial asociado.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('vehiculo').delete().eq('id', id);
        if (error) throw error;
        
        setDataFlota(dataFlota.filter(v => v.id !== id));
        setActionMenuOpen(null);
        
        Swal.fire('Eliminado', 'El vehículo ha sido eliminado.', 'success');
      } catch (err: any) {
        console.error("Error al eliminar vehículo:", err);
        Swal.fire('Error', 'No se pudo eliminar el vehículo. Es posible que tenga registros asociados.', 'error');
      }
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'NORMAL':
        return <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-sm uppercase"><CheckCircle className="w-3 h-3 mr-1" /> NORMALIDAD</div>;
      case 'PROXIMO':
        return <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-sm uppercase"><Clock className="w-3 h-3 mr-1" /> MANT. PRÓXIMO</div>;
      case 'EN_TIEMPO':
      case 'REALIZAR_MANT':
        return <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-sm uppercase"><CheckCircle className="w-3 h-3 mr-1" /> REALIZAR MANT.</div>;
      case 'VENCIDO':
        return <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-sm uppercase"><AlertTriangle className="w-3 h-3 mr-1" /> MANT. VENCIDO</div>;
      default:
        return <div className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500 text-white shadow-sm uppercase">{estado}</div>;
    }
  };

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'NORMAL': return <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />;
      case 'PROXIMO': return <div className="h-3 w-3 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />;
      case 'EN_TIEMPO':
      case 'REALIZAR_MANT': return <div className="h-3 w-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />;
      case 'VENCIDO': return <div className="h-3 w-3 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse" />;
      default: return null;
    }
  };

  const getCumplimientoBadge = (cump: string) => {
    switch (cump) {
      case 'ANTICIPADO':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 uppercase">
            ANTICIPADO
          </span>
        );
      case 'EN RANGO':
      case 'NORMAL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700 uppercase">
            EN RANGO
          </span>
        );
      case 'RETRASADO':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border border-red-300 dark:border-red-700 uppercase">
            RETRASADO
          </span>
        );
      default:
        return <span className="text-slate-400 dark:text-slate-500 font-medium">—</span>;
    }
  };

  const opcionesFecha: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fechaTexto = new Date().toLocaleDateString('es-ES', opcionesFecha);
  const fechaHoy = fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1);

  const renderTablaDensa = () => (
    <Card className="shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] text-center border-collapse">
          <thead className="bg-[#f8f9fa] dark:bg-slate-900 border-b border-b-slate-200 dark:border-b-slate-700 text-slate-600 dark:text-slate-400 font-semibold whitespace-nowrap">
            <tr>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">N° Int. ▲</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">PPU</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">KM Últ. Mant.</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">F. Últ. Mant.</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">Tipo Mant.</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">Cumplimiento</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">Estatus</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">Km Vencido</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">Pauta Vencida</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">KM Actual</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">Fecha KM Actual</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">KM Próx. Mant.</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">Tipo Próx. Mant.</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">Semáf.</th>
              <th className="px-2 py-3 border-r border-slate-200 dark:border-slate-800">Fecha Próx. Mant.</th>
              <th className="px-2 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-300 bg-white dark:bg-slate-900">
            {vehiculosFiltrados.map((vehiculo) => {
              return (
                <tr 
                  key={`dense-${vehiculo.id}`} 
                  onClick={() => setSelectedVehicleRow(String(vehiculo.id))}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${selectedVehicleRow === String(vehiculo.id) ? 'bg-blue-50 dark:bg-slate-800/50' : ''}`}
                >
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 font-bold text-blue-900 dark:text-blue-100 whitespace-nowrap">{vehiculo.numeroInterno}</td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-slate-500 whitespace-nowrap">{vehiculo.ppu || '—'}</td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800">{vehiculo.kmUltimoMantencion ? vehiculo.kmUltimoMantencion.toLocaleString('es-CL') : '—'}</td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-slate-500 whitespace-nowrap">{vehiculo.fechaUltimoMantencion || '—'}</td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 font-medium whitespace-nowrap">{vehiculo.tipoUltimoMantencion || 'N/A'}</td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800">
                    <div className="flex justify-center">
                      {getCumplimientoBadge(vehiculo.cumplimiento)}
                    </div>
                  </td>
                  <td className="px-1 py-1 border-r border-slate-200 dark:border-slate-800">
                    <div className="flex justify-center w-full transform scale-90">
                      {getStatusBadge(vehiculo.estatus)}
                    </div>
                  </td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-slate-500">{vehiculo.kmVencido ? vehiculo.kmVencido.toLocaleString('es-CL') : '—'}</td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-slate-500 whitespace-nowrap">{vehiculo.pautaVencida || '—'}</td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800">
                    <div>{vehiculo.kmActual ? vehiculo.kmActual.toLocaleString('es-CL') : '—'}</div>
                    {vehiculo.inconsistenciaKm && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20 mt-0.5" title={vehiculo.mensajeInconsistencia}>
                        ⚠ Inconsistencia
                      </span>
                    )}
                    {(vehiculo as any).tipo_intervalo === 'Horas' && (vehiculo as any).factor_conversion_horas && (
                      <div className="text-[10px] text-slate-500 mt-0.5" title="Horas Trabajadas Estimadas">
                        {Math.round((vehiculo.kmActual) / (vehiculo as any).factor_conversion_horas).toLocaleString('es-CL')} Hrs
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-slate-500 whitespace-nowrap">{vehiculo.fechaKmActual || '—'}</td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800">
                    <div>{vehiculo.kmProximoMantencion ? vehiculo.kmProximoMantencion.toLocaleString('es-CL') : '—'}</div>
                    {(vehiculo as any).tipo_intervalo === 'Horas' && (vehiculo as any).factor_conversion_horas && (
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {Math.round(vehiculo.kmProximoMantencion! / (vehiculo as any).factor_conversion_horas).toLocaleString('es-CL')} Hrs
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 font-medium whitespace-nowrap">{vehiculo.tipoProximoMantencion}</td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800">
                    <div className="flex justify-center">
                      <div className={`h-3 w-3 rounded-full ${vehiculo.semaforoPeligro10Dias ? 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'}`} />
                    </div>
                  </td>
                  <td className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 text-slate-500 whitespace-nowrap">{vehiculo.fechaProximaMantencion || '—'}</td>
                  <td className="px-2 py-2 relative text-right">
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={(e) => { e.stopPropagation(); setActionMenuOpen(actionMenuOpen === vehiculo.id ? null : vehiculo.id); }}>
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                    {actionMenuOpen === vehiculo.id && (
                      <div 
                        ref={menuRef}
                        className="absolute right-8 top-10 w-56 bg-white dark:bg-slate-900 rounded-md shadow-lg border border-slate-200 dark:border-slate-800 z-[100] overflow-hidden text-left"
                      >
                        <div className="py-1">
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center font-bold"
                            onClick={() => {
                              setVehiculoSeleccionadoOT(vehiculo.id.toString());
                              setModalOTOpen(true);
                              setActionMenuOpen(null);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Crear OT
                          </button>
                          <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center font-medium"
                            onClick={() => {
                              setFichaTecnicaVehiculo(vehiculo);
                              setActionMenuOpen(null);
                            }}
                          >
                            <FileSpreadsheet className="w-4 h-4 mr-2 text-slate-500" /> Ficha Técnica
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVehiculoSeleccionadoKM(vehiculo);
                              setNuevoKM((vehiculo.kmActual || vehiculo.kilometrajeActual)?.toString() || '');
                              setFechaRegistroKM(new Date().toISOString().split('T')[0]);
                              setModalKMOpen(true);
                              setActionMenuOpen(null);
                            }}
                          >
                            <Edit3 className="w-4 h-4 mr-2 text-blue-500" /> Actualizar KM Manual
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActualizarGpsVehiculo(vehiculo);
                            }}
                          >
                            <Wifi className="w-4 h-4 mr-2 text-indigo-500" /> Actualizar KM GPS
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center"
                            onClick={() => {
                              setHistorialVehiculo(vehiculo);
                              setActionMenuOpen(null);
                            }}
                          >
                            <History className="w-4 h-4 mr-2" /> Ver Historial
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAbrirCostosTendencias(vehiculo);
                            }}
                          >
                            <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" /> Costos y Tendencias
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
            {vehiculosFiltrados.length === 0 && (
              <tr>
                <td colSpan={16} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">
                  No se encontraron vehículos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );

  const getRealOTs = (vehiculo: any) => {
    if (!vehiculo) return [];
    const fromContext = ordenesTrabajo.filter(o => String(o.vehiculoId) === String(vehiculo.id));
    const merged = [...otsDirectasVehiculo];
    fromContext.forEach(ctxOt => {
      if (!merged.some(m => m.id === ctxOt.id || m.folio === ctxOt.folio)) {
        merged.push(ctxOt);
      }
    });

    // Línea Base Histórica Automática: si no hay OTs en la BD pero el vehículo tiene km_ultima_mantencion > 0
    const rawKmVal = Number(vehiculo.kmUltimaMantencion || vehiculo.kmUltimoMantencion || vehiculo.km_ultima_mantencion || 0);
    if (merged.length === 0 && rawKmVal > 0) {
      const kmMant = rawKmVal;
      const fechaMant = vehiculo.fechaUltimaMantencion || vehiculo.fecha_ultima_mantencion || new Date();
      const pautaMant = vehiculo.tipoUltimoMantencion || vehiculo.tipoUltimaPauta || vehiculo.tipo_ultimo_mant || 'SM1';

      merged.push({
        id: `ot-base-${vehiculo.id}`,
        folio: `OT-INI-${vehiculo.numeroInterno || vehiculo.ppu || vehiculo.patente || '01'}`,
        tipo: 'PREVENTIVA',
        prioridad: 'NORMAL',
        estado: 'FINALIZADA',
        fechaCreacion: fechaMant,
        fechaCierre: fechaMant,
        costoInsumos: 0,
        costoManoObraHH: 0,
        costoManoObraTareas: 0,
        vehiculoId: vehiculo.id,
        pauta: pautaMant
      });
    }

    return merged.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime());
  };

  if (historialVehiculo) {
    const otsVehiculo = getRealOTs(historialVehiculo);
    return (
      <div className="space-y-6">
         <div className="flex justify-between items-start pt-2">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 mb-1">Historial de Mantenimiento</h1>
              <p className="text-base text-slate-600 dark:text-slate-400">Vehículo: {historialVehiculo.numeroInterno} ({historialVehiculo.patente})</p>
            </div>
            <button onClick={() => setHistorialVehiculo(null)} className="inline-flex items-center justify-center rounded-md border border-transparent bg-slate-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-600 focus:outline-none dark:bg-slate-700 dark:hover:bg-slate-600">
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver
            </button>
         </div>
         <Card className="border-none shadow-sm overflow-hidden bg-white dark:bg-slate-900 rounded-xl">
           <CardContent className="p-0">
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-center">
                  <thead className="bg-white dark:bg-slate-900 border-b border-b-slate-100 dark:border-b-slate-800 text-slate-700 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-widest leading-loose">
                    <tr>
                      <th className="px-6 py-6 whitespace-nowrap">Folio</th>
                      <th className="px-6 py-6 whitespace-nowrap">Tipo</th>
                      <th className="px-6 py-6 whitespace-nowrap">Prioridad</th>
                      <th className="px-6 py-6 whitespace-nowrap">Estado</th>
                      <th className="px-6 py-6 whitespace-nowrap">Fecha Creación</th>
                      <th className="px-6 py-6 whitespace-nowrap">Fecha Cierre</th>
                      <th className="px-6 py-6 whitespace-nowrap">Costo Total</th>
                      <th className="px-6 py-6 whitespace-nowrap">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {otsVehiculo.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-slate-500">No hay órdenes de trabajo en el historial.</td>
                      </tr>
                    )}
                    {otsVehiculo.map(ot => (
                      <tr key={ot.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors h-16">
                        <td className="px-6 whitespace-nowrap font-medium text-slate-800 dark:text-slate-300">{ot.folio}</td>
                        <td className="px-6 whitespace-nowrap text-slate-600 dark:text-slate-400">{ot.tipo}</td>
                        <td className="px-6 whitespace-nowrap text-slate-600 dark:text-slate-400">{ot.prioridad}</td>
                        <td className="px-6 whitespace-nowrap justify-center p-0 align-middle">
                          <div className="flex justify-center items-center h-full w-full">
                            <span className={`inline-flex items-center px-4 py-1 rounded-full text-[11px] font-bold text-white shadow-sm ${ot.estado === 'FINALIZADA' ? 'bg-[#10b981]' : ot.estado === 'ABIERTA' || ot.estado === 'PROGRAMADA' ? 'bg-blue-500' : 'bg-amber-500'}`}>
                              {ot.estado.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 whitespace-nowrap text-slate-600 dark:text-slate-400">{new Date(ot.fechaCreacion).toLocaleDateString()}</td>
                        <td className="px-6 whitespace-nowrap text-slate-600 dark:text-slate-400">{ot.estado === 'FINALIZADA' || ot.estado === 'CERRADA_POR_MECANICO' ? new Date(ot.fechaCreacion).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-6 whitespace-nowrap text-slate-600 dark:text-slate-400">
                          ${((ot.costoInsumos || 0) + (ot.costoManoObraHH || 0) + (ot.costoManoObraTareas || 0)).toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 whitespace-nowrap text-center">
                          <div className="flex justify-center">
                            <Button
                              variant="default"
                              size="sm"
                              className="w-[42px] h-[26px] p-0 bg-[#38bdf8] hover:bg-[#0ea5e9] text-white shadow-sm border-none rounded justify-center items-center flex"
                              onClick={() => navigate(`/flota/ordenes-trabajo/${ot.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
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
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Pizarra de Mantenimiento</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="default" className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 border-blue-200 shadow-sm border dark:border-slate-800 font-medium px-2.5 py-0.5">
              <Clock className="w-3 h-3 mr-1.5" />
              {fechaHoy}
            </Badge>
            <p className="text-sm text-slate-500 dark:text-slate-400">Visión general del estado de la flota y próximos mantenimientos</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 shadow-sm"
            onClick={handleExportarExcel}
            title="Exportar pizarra de mantenimiento a Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
            Exportar Excel
          </Button>
          <Button 
            variant="outline" 
            className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            onClick={() => setVistaTabla(!vistaTabla)}
          >
            {vistaTabla ? (
              <><List className="w-4 h-4 mr-2" /> Vista Tarjetas</>
            ) : (
              <><TableIcon className="w-4 h-4 mr-2" /> Vista Tabla</>
            )}
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            onClick={() => {
              setModalVehiculoOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Vehículo
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-all">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vehículos Visualizados</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{kpis.vehiculosFiltrados}</h3>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">({kpis.porcentajeFlota}%)</span>
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600">
              <Truck className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          onClick={() => setKpiModal('cumplimiento')}
        >
          <CardContent className="p-4 flex items-center justify-between relative">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cumplimiento del Cronograma</p>
              <h3 className={`text-2xl font-bold mt-1 ${kpis.nivelCumplimiento >= 80 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{kpis.nivelCumplimiento}%</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          onClick={() => setKpiModal('costo_total')}
        >
          <CardContent className="p-4 flex items-center justify-between relative">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Costo Total Mant. <span className="text-[10px]">(PREV. + CORR)</span></p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">${kpis.costoTotal.toLocaleString('es-CL')}</h3>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card 
          className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-all cursor-pointer group"
          onClick={() => setKpiModal('costo_promedio')}
        >
          <CardContent className="p-4 flex items-center justify-between relative">
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Costo Promedio / KM</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">${kpis.costoKm}</h3>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Buscador */}
      <Card className="shadow-sm border border-slate-200 dark:border-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 dark:text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por equipo, patente o modelo..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:bg-slate-900 transition-colors"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Segmented Control para Estado de Flota */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setFiltroEstadoOperativo('ACTIVOS')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                    filtroEstadoOperativo === 'ACTIVOS'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                  }`}
                >
                  Activos ({dataFlota.filter(v => v.en_operacion_activa !== false && v.estado !== 'DE_BAJA' && v.detalles?.activo !== false).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroEstadoOperativo('DADOS_DE_BAJA')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                    filtroEstadoOperativo === 'DADOS_DE_BAJA'
                      ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                  }`}
                >
                  Dados de Baja ({dataFlota.filter(v => v.en_operacion_activa === false || v.estado === 'DE_BAJA' || v.detalles?.activo === false).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroEstadoOperativo('TODOS')}
                  className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                    filtroEstadoOperativo === 'TODOS'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
                  }`}
                >
                  Todos ({dataFlota.length})
                </button>
              </div>

              <Button 
                variant={mostrarFiltros ? "default" : "outline"} 
                className={mostrarFiltros ? "bg-blue-600 hover:bg-blue-700 h-9" : "bg-white dark:bg-slate-900 h-9"}
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros Avanzados
              </Button>
            </div>
          </div>

          {mostrarFiltros && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Modelo</label>
                <select 
                  className="w-full bg-white dark:bg-slate-700 dark:text-slate-100 dark:border-slate-700 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-b dark:border-slate-800lue-500"
                  value={filtroModelo}
                  onChange={(e) => setFiltroModelo(e.target.value)}
                >
                  <option value="">Todos los modelos</option>
                  {modelos.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tipo de Mantenimiento</label>
                <select 
                  className="w-full bg-white dark:bg-slate-700 dark:text-slate-100 dark:border-slate-700 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-b dark:border-slate-800lue-500"
                  value={filtroTipoMant}
                  onChange={(e) => setFiltroTipoMant(e.target.value)}
                >
                  <option value="">Todos los tipos</option>
                  {tiposMantenimiento.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Fecha Desde</label>
                <input 
                  type="date" 
                  className="w-full bg-white dark:bg-slate-700 dark:text-slate-100 dark:border-slate-700 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-b dark:border-slate-800lue-500" 
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Fecha Hasta</label>
                  {(fechaDesde || fechaHasta) && (
                    <button 
                      type="button" 
                      onClick={() => { setFechaDesde(''); setFechaHasta(''); }}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Limpiar fechas
                    </button>
                  )}
                </div>
                <input 
                  type="date" 
                  className="w-full bg-white dark:bg-slate-700 dark:text-slate-100 dark:border-slate-700 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-b dark:border-slate-800lue-500" 
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />
              </div>
              <div className="space-y-1 md:col-span-4 flex items-end">
                <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/30 border dark:border-slate-800 border-orange-200 rounded-lg w-full">
                  <input 
                    type="checkbox" 
                    id="proximos_alerta" 
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300 dark:border-slate-700 dark:text-slate-100" 
                    checked={soloProximosOVencidos}
                    onChange={(e) => setSoloProximosOVencidos(e.target.checked)}
                  />
                  <label htmlFor="proximos_alerta" className="text-sm font-medium text-orange-800 cursor-pointer w-full h-full block">
                    Mostrar solo vehículos con mantenimientos PRÓXIMOS o VENCIDOS
                  </label>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabla Maestro de Flota */}
      {vistaTabla ? (
        renderTablaDensa()
      ) : (
        <Card className="shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
                <tr>
                <th className="px-5 py-4 w-12 text-center"></th>
                <th className="px-5 py-4 w-12 text-center">STS</th>
                <th className="px-5 py-4">Vehículo</th>
                <th className="px-5 py-4">KM Actual</th>
                <th className="px-5 py-4">Último Mantenimiento</th>
                <th className="px-5 py-4">Próximo Mantenimiento</th>
                <th className="px-5 py-4">Estado</th>
                <th className="px-5 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {vehiculosFiltrados.map((vehiculo) => (
                <tr 
                  key={vehiculo.id} 
                  onClick={() => setSelectedVehicleRow(String(vehiculo.id))}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer ${selectedVehicleRow === String(vehiculo.id) ? 'bg-blue-50 dark:bg-slate-800/50' : 'dark:bg-slate-900/50'}`}
                >
                  <td className="px-5 py-4 text-center">
                    <input 
                      type="radio" 
                      name="selectedVehicle"
                      className="w-4 h-4 text-blue-600 rounded-full focus:ring-blue-500 border-slate-300 dark:border-slate-700 cursor-pointer"
                      checked={selectedVehicleRow === String(vehiculo.id)}
                      onChange={() => setSelectedVehicleRow(String(vehiculo.id))}
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center">
                      {getStatusIcon(vehiculo.estatus)}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">{vehiculo.numeroInterno}</span>
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{vehiculo.ppu || '—'}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors uppercase mt-0.5">{(vehiculo as any).marca} {(vehiculo as any).modelo}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="font-mono text-slate-900 dark:text-slate-100 font-semibold bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded inline-block w-fit">
                        {vehiculo.kmActual ? vehiculo.kmActual.toLocaleString('es-CL') : '—'} km
                      </div>
                      {(vehiculo as any).tipo_intervalo === 'Horas' && (vehiculo as any).factor_conversion_horas && (
                        <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {Math.round((vehiculo.kmActual) / (vehiculo as any).factor_conversion_horas).toLocaleString('es-CL')} Hrs.
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-900 dark:text-slate-100 font-medium">
                        <CheckCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        {vehiculo.kmUltimoMantencion ? vehiculo.kmUltimoMantencion.toLocaleString('es-CL') : '—'} km
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        {vehiculo.fechaUltimoMantencion || '—'}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-1.5 py-0.5 rounded w-fit uppercase">
                          {vehiculo.tipoUltimoMantencion || 'N/A'}
                        </span>
                        {getCumplimientoBadge(vehiculo.cumplimiento)}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                        <Activity className="w-3.5 h-3.5" />
                        Próx. Mant.: {vehiculo.kmProximoMantencion ? vehiculo.kmProximoMantencion.toLocaleString('es-CL') : '—'} km
                      </div>
                      <div className="text-xs font-medium text-slate-500">
                        (Faltan: {vehiculo.kmProximoMantencion ? (vehiculo.kmProximoMantencion - vehiculo.kmActual).toLocaleString('es-CL') : 0} km)
                      </div>
                      <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        Fecha Próx.: {vehiculo.fechaProximaMantencion || '—'}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 px-1.5 py-0.5 rounded w-fit uppercase">
                          Tipo: {vehiculo.tipoProximoMantencion}
                        </span>
                      </div>
                      
                      {/* Mostrar pauta vencida si es VENCIDO */}
                      {vehiculo.estatus === 'VENCIDO' && vehiculo.pautaVencida && (
                        <div className="mt-2 p-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                           <div className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase mb-0.5">
                             Pauta Vencida: {vehiculo.pautaVencida}
                           </div>
                           <div className="text-[10px] font-medium text-red-600 dark:text-red-500">
                             Excedido por: {vehiculo.kmVencido?.toLocaleString('es-CL')} km
                           </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {getStatusBadge(vehiculo.estatus)}
                  </td>
                  <td className="px-5 py-4 text-right relative">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-500"
                      onClick={() => setActionMenuOpen(actionMenuOpen === vehiculo.id ? null : vehiculo.id)}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                    {actionMenuOpen === vehiculo.id && (
                      <div 
                        ref={menuRef}
                        className="absolute right-8 top-10 w-56 bg-white dark:bg-slate-900 rounded-md shadow-lg border border-slate-200 dark:border-slate-800 z-50 overflow-hidden text-left"
                      >
                        <div className="py-1">
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center font-bold"
                            onClick={() => {
                              setVehiculoSeleccionadoOT(vehiculo.id.toString());
                              setModalOTOpen(true);
                              setActionMenuOpen(null);
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Crear OT
                          </button>
                          <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center font-medium"
                            onClick={() => {
                              setFichaTecnicaVehiculo(vehiculo);
                              setActionMenuOpen(null);
                            }}
                          >
                            <FileSpreadsheet className="w-4 h-4 mr-2 text-slate-500" /> Ficha Técnica
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setVehiculoSeleccionadoKM(vehiculo);
                              setNuevoKM((vehiculo.kmActual || vehiculo.kilometrajeActual)?.toString() || '');
                              setFechaRegistroKM(new Date().toISOString().split('T')[0]);
                              setModalKMOpen(true);
                              setActionMenuOpen(null);
                            }}
                          >
                            <Edit3 className="w-4 h-4 mr-2 text-blue-500" /> Actualizar KM Manual
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActualizarGpsVehiculo(vehiculo);
                            }}
                          >
                            <Wifi className="w-4 h-4 mr-2 text-indigo-500" /> Actualizar KM GPS
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setHistorialVehiculo(vehiculo);
                              setActionMenuOpen(null);
                            }}
                          >
                            <History className="w-4 h-4 mr-2" /> Ver Historial
                          </button>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 flex items-center font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAbrirCostosTendencias(vehiculo);
                            }}
                          >
                            <TrendingUp className="w-4 h-4 mr-2 text-emerald-500" /> Costos y Tendencias
                          </button>
                          <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                          <button 
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                            onClick={() => handleDeletePermanent(vehiculo.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar Definitivamente
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {vehiculosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-slate-500 dark:text-slate-400">
                    No se encontraron vehículos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        </Card>
      )}
      {modalOTOpen && (
        <CrearOTModal 
          isOpen={modalOTOpen} 
          onClose={() => {
            setModalOTOpen(false);
            fetchVehiculos();
          }} 
          vehiculoPreseleccionadoId={vehiculoSeleccionadoOT}
        />
      )}
      {modalVehiculoOpen && (
        <CrearVehiculoModal 
          isOpen={modalVehiculoOpen} 
          onClose={() => setModalVehiculoOpen(false)} 
        />
      )}
      <Modal isOpen={kpiModal === 'cumplimiento'} onClose={() => setKpiModal(null)} title="Detalle KPI: Cumplimiento del Cronograma">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Este KPI mide la <b>ejecución del plan de mantenimiento en el tiempo pasado (ANTES)</b>. Evalúa si las mantenciones realizadas se ejecutaron dentro del rango de tolerancia programado (En Rango o Anticipado a ±10%) o si tuvieron retraso en su ejecución en taller.
          </p>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-3 text-sm">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-md shadow-sm border border-slate-100 dark:border-slate-700/50">
              <span className="font-medium text-slate-700 dark:text-slate-300">Total Mantenciones Evaluadas</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{dataFlota.length}</span>
            </div>
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-md shadow-sm border border-slate-100 dark:border-slate-700/50">
              <span className="font-medium text-slate-700 dark:text-slate-300">Mantenciones a Tiempo (En Rango / Anticipado)</span>
              <span className="font-bold text-emerald-600">{dataFlota.filter(v => v.cumplimiento === 'NORMAL' || v.cumplimiento === 'EN RANGO' || v.cumplimiento === 'ANTICIPADO').length}</span>
            </div>
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-3 rounded-md shadow-sm border border-slate-100 dark:border-slate-700/50">
              <span className="font-medium text-slate-700 dark:text-slate-300">Mantenciones con Retraso</span>
              <span className="font-bold text-red-600">{dataFlota.filter(v => v.cumplimiento === 'RETRASADO').length}</span>
            </div>
            <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-md shadow-sm border border-emerald-100 dark:border-emerald-800/30">
              <span className="font-bold text-emerald-800 dark:text-emerald-300">Nivel de Cumplimiento Histórico</span>
              <span className={`font-extrabold text-2xl ${kpis.nivelCumplimiento >= 80 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{kpis.nivelCumplimiento}%</span>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={kpiModal === 'costo_total'} onClose={() => setKpiModal(null)} title="Detalle KPI: Costo Total Mantenimiento">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">Desglose acumulado de los gastos en órdenes de trabajo registradas para la flota visible.</p>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300">Mantenimiento Preventivo</span>
              <span className="font-bold font-mono text-blue-600 dark:text-blue-400">
                ${kpis.costoPreventivo.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300">Mantenimiento Correctivo</span>
              <span className="font-bold font-mono text-rose-600 dark:text-rose-400">
                ${kpis.costoCorrectivo.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            {kpis.costoEvaluativo > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-700 dark:text-slate-300">Evaluativo / Otros</span>
                <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ${kpis.costoEvaluativo.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
            <div className="border-t border-slate-200 dark:border-slate-700 my-2 pt-2 flex justify-between items-center text-base">
              <span className="font-bold text-slate-800 dark:text-slate-200">Total Acumulado ({otsVisibles.length} OTs)</span>
              <span className="font-bold font-mono text-orange-600 dark:text-orange-400">
                ${kpis.costoTotal.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={kpiModal === 'costo_promedio'} onClose={() => setKpiModal(null)} title="Detalle KPI: Costo Promedio por KM">
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">Este valor se calcula al dividir el costo total de los mantenimientos sobre los kilómetros totales acumulados de los vehículos seleccionados.</p>
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300">Costo Total Mant.</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                ${kpis.costoTotal.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300">KM Acumulados Flota</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">
                {kpis.totalKmAcumulados.toLocaleString('es-CL')} km
              </span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-700 my-2 pt-2 flex justify-between items-center text-base">
              <span className="font-bold text-slate-800 dark:text-slate-200">Costo Promedio</span>
              <span className="font-bold font-mono text-purple-600 dark:text-purple-400">
                ${kpis.costoKm} / km
              </span>
            </div>
          </div>
        </div>
      </Modal>

      {fichaTecnicaVehiculo && (
        <Modal 
          isOpen={!!fichaTecnicaVehiculo} 
          onClose={() => setFichaTecnicaVehiculo(null)} 
          title={`Ficha Técnica - ${fichaTecnicaVehiculo.numeroInterno} (${fichaTecnicaVehiculo.patente})`}
        >
          <div className="space-y-6 text-sm">
            {!isEditingFicha ? (
              <>
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado en Flota</span>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      {fichaTecnicaVehiculo.en_operacion_activa !== false && fichaTecnicaVehiculo.estado !== 'DE_BAJA' && fichaTecnicaVehiculo.detalles?.activo !== false
                        ? 'Vehículo activo en la flota y en operación continua.'
                        : 'Vehículo dado de baja (retirado de la pizarra activa, pronósticos y GPS).'}
                    </span>
                  </div>
                  <div>
                    {fichaTecnicaVehiculo.en_operacion_activa !== false && fichaTecnicaVehiculo.estado !== 'DE_BAJA' && fichaTecnicaVehiculo.detalles?.activo !== false ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Activo / En Operación
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-sm">
                        <Power className="w-4 h-4 text-rose-600 dark:text-rose-400" /> Dado de Baja / Inactivo
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Modelo</span>
                    <span className="font-bold">{obtenerSoloModelo(fichaTecnicaVehiculo.modelo, fichaTecnicaVehiculo.marca)}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Año de Fabricación</span>
                    <span className="font-bold">{fichaTecnicaVehiculo.ano || '--'}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Patente (PPU)</span>
                    <span className="font-bold">{fichaTecnicaVehiculo.patente || '--'}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Fecha de Matriculación</span>
                    <span className="font-bold">{fichaTecnicaVehiculo.fecha_matriculacion || '--'}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">N° de Chasis (VIN)</span>
                    <span className="font-bold font-mono">{fichaTecnicaVehiculo.chasis || '--'}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Motorización</span>
                    <span className="font-bold">{fichaTecnicaVehiculo.motor || '--'}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Norma de Emisión</span>
                    <span className="font-bold">{fichaTecnicaVehiculo.norma || '--'}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Aplicación Operativa</span>
                    <span className="font-bold">{fichaTecnicaVehiculo.aplicacion || '--'}</span>
                  </div>
                  <div className="col-span-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tipo de Aceite</span>
                    <span className="font-bold">{fichaTecnicaVehiculo.tipoAceite || '--'}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button 
                    onClick={() => setIsEditingFicha(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> Editar Ficha Técnica
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/90 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    id="enOperacionActivaCheckbox" 
                    checked={editFichaData.enOperacionActiva} 
                    onChange={(e) => setEditFichaData({ ...editFichaData, enOperacionActiva: e.target.checked })} 
                    className="mt-1 h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600" 
                  />
                  <label htmlFor="enOperacionActivaCheckbox" className="cursor-pointer select-none">
                    <span className="block font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {editFichaData.enOperacionActiva ? 'Vehículo en Operación Activa' : 'Vehículo Dado de Baja / Inactivo'}
                    </span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      Marque esta casilla para mantener el vehículo activo en la flota. Al desmarcarla, el vehículo se <b>da de baja</b>: sus datos e historial permanecen intactos en el sistema, pero se retira de la pizarra operativa activa, pronósticos de mantenimiento, cálculo de costos y sincronización GPS.
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Marca</label>
                    <input 
                      type="text" 
                      value={editFichaData.marca} 
                      onChange={(e) => setEditFichaData({ ...editFichaData, marca: e.target.value })} 
                      className="w-full p-2 border rounded rounded-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Modelo</label>
                    <input 
                      type="text" 
                      value={editFichaData.modelo} 
                      onChange={(e) => setEditFichaData({ ...editFichaData, modelo: e.target.value })} 
                      className="w-full p-2 border rounded rounded-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Año de Fabricación</label>
                    <input 
                      type="number" 
                      value={editFichaData.ano} 
                      onChange={(e) => setEditFichaData({ ...editFichaData, ano: e.target.value })} 
                      className="w-full p-2 border rounded rounded-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Fecha de Matriculación</label>
                    <input 
                      type="date" 
                      value={editFichaData.fechaMatriculacion} 
                      onChange={(e) => setEditFichaData({ ...editFichaData, fechaMatriculacion: e.target.value })} 
                      className="w-full p-2 border rounded rounded-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">N° de Chasis (VIN)</label>
                    <input 
                      type="text" 
                      value={editFichaData.chasis} 
                      onChange={(e) => setEditFichaData({ ...editFichaData, chasis: e.target.value })} 
                      className="w-full p-2 border rounded rounded-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Motorización</label>
                    <input 
                      type="text" 
                      value={editFichaData.motor} 
                      onChange={(e) => setEditFichaData({ ...editFichaData, motor: e.target.value })} 
                      className="w-full p-2 border rounded rounded-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Norma de Emisión</label>
                    <input 
                      type="text" 
                      value={editFichaData.norma} 
                      onChange={(e) => setEditFichaData({ ...editFichaData, norma: e.target.value })} 
                      className="w-full p-2 border rounded rounded-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Aplicación Operativa</label>
                    <input 
                      type="text" 
                      value={editFichaData.aplicacion} 
                      onChange={(e) => setEditFichaData({ ...editFichaData, aplicacion: e.target.value })} 
                      className="w-full p-2 border rounded rounded-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tipo de Aceite</label>
                    <input 
                      type="text" 
                      value={editFichaData.tipoAceite} 
                      onChange={(e) => setEditFichaData({ ...editFichaData, tipoAceite: e.target.value })} 
                      className="w-full p-2 border rounded rounded-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-1 flex items-center justify-between">
                      <span>Intervalo Mantención</span>
                      <span className="text-[10px] lowercase text-slate-400 font-normal">({editFichaData.tipoIntervalo || 'KM'})</span>
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        step="1000"
                        min="1000"
                        value={editFichaData.intervaloMantenimiento} 
                        onChange={(e) => setEditFichaData({ ...editFichaData, intervaloMantenimiento: e.target.value })} 
                        className="w-full p-2 border-2 border-blue-200 dark:border-blue-800 rounded rounded-md dark:bg-slate-800 dark:text-slate-100 font-bold text-blue-700 dark:text-blue-300 focus:ring-2 focus:ring-blue-500" 
                        placeholder="Ej: 10000 o 15000"
                      />
                      <select
                        value={editFichaData.tipoIntervalo || 'KM'}
                        onChange={(e) => setEditFichaData({ ...editFichaData, tipoIntervalo: e.target.value })}
                        className="p-2 border rounded rounded-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 text-xs font-bold"
                      >
                        <option value="KM">KM</option>
                        <option value="Horas">Horas</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-2 px-3 py-2 bg-blue-50/70 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <Wrench className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>
                      <b>Recálculo Inteligente:</b> Al editar el intervalo, el sistema mantiene intacto el orden cronológico de las pautas del cronograma por marca/modelo y recalcula los KMs futuros proyectándolos desde el número redondo del último mantenimiento.
                    </span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t dark:border-slate-700">
                  <Button 
                    onClick={() => setIsEditingFicha(false)}
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSaveFicha}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Plan de Mantenimiento Preventivo
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-500 uppercase">Intervalo Base</span>
                  <span className="font-bold text-lg">
                    {fichaTecnicaVehiculo.intervaloMantenimiento?.toLocaleString('es-CL') || '--'} {fichaTecnicaVehiculo.tipoIntervalo}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-slate-500 uppercase">Avanzado Actual</span>
                  <span className="font-bold text-lg">
                    {fichaTecnicaVehiculo.kmActual.toLocaleString('es-CL')} KM
                  </span>
                </div>
                {fichaTecnicaVehiculo.tipoIntervalo === 'Horas' && fichaTecnicaVehiculo.factorConversionHoras && (
                  <div className="col-span-2 mt-2 pt-2 border-t border-blue-200 dark:border-blue-800/50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Factor de Conversión:</span>
                      <span className="font-bold">{fichaTecnicaVehiculo.factorConversionHoras} Km/h (Estimado)</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
                      <span className="font-semibold text-slate-600 dark:text-slate-400">Total Horas Trabajadas:</span>
                      <span className="font-bold text-orange-600 dark:text-orange-400">
                        {Math.round(fichaTecnicaVehiculo.kmActual / fichaTecnicaVehiculo.factorConversionHoras).toLocaleString('es-CL')} Hrs.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
      
      {modalKMOpen && vehiculoSeleccionadoKM && (
        <Modal 
          isOpen={modalKMOpen} 
          onClose={() => setModalKMOpen(false)} 
          title={`Actualizar KM para N° ${vehiculoSeleccionadoKM.numeroInterno || vehiculoSeleccionadoKM.patente}`}
          size="sm"
        >
          <div className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nuevo Kilometraje
                </label>
                <input
                  type="text"
                  className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  placeholder="Ej: 276.167 o 276167"
                  value={nuevoKM}
                  onChange={(e) => setNuevoKM(e.target.value)}
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Fecha del Registro
                </label>
                <input
                  type="date"
                  className="w-full h-10 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  value={fechaRegistroKM}
                  onChange={(e) => setFechaRegistroKM(e.target.value)}
                />
             </div>
             <div className="flex justify-end gap-3 mt-6">
                <Button variant="secondary" onClick={() => setModalKMOpen(false)}>
                   Cancelar
                </Button>
                <Button onClick={handleGuardarKM}>
                   Guardar
                </Button>
             </div>
          </div>
        </Modal>
      )}

      {modalCostosOpen && vehiculoCostosSeleccionado && currentCompany && (
        <ModalCostosTendencias
          isOpen={modalCostosOpen}
          onClose={() => {
            setModalCostosOpen(false);
            setVehiculoCostosSeleccionado(null);
          }}
          vehiculo={vehiculoCostosSeleccionado}
          empresaId={currentCompany.id}
          onVehicleUpdated={handleVehicleCostosUpdated}
        />
      )}
    </div>
  );
}
