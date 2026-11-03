export interface PautaEstructura {
    id: string;
    nombre: string;
    kilometraje_inicial: number;
    intervalo_1: number;
    intervalo_2?: number | null;
    tipo_aplicacion?: string;
}

export interface HitoSecuencia {
    iteracion_km: number;
    nombre: string;
}

/**
 * Genera la secuencia matemática de hitos kilométricos para una pauta preventiva específica.
 * Replica exactamente la lógica cíclica de Pulser V2.
 */
export function generarSecuenciaParaPauta(pauta: PautaEstructura, kilometrajeActual: number): HitoSecuencia[] {
    const secuencia: HitoSecuencia[] = [];
    
    const kmInicial = Number(pauta.kilometraje_inicial) || 0;
    const int1 = Number(pauta.intervalo_1) || 0;
    const int2 = pauta.intervalo_2 ? Number(pauta.intervalo_2) : 0;
    const pautaName = pauta.nombre || '';

    // 1. Agregar siempre el hito inicial
    secuencia.push({ iteracion_km: kmInicial, nombre: pautaName });

    // 2. Validar si es pauta de rodaje/inicial (las pautas de rodaje no se repiten)
    const nameUpper = pautaName.toUpperCase().trim();
    const isRodaje = nameUpper.startsWith('SI') || 
                     nameUpper.startsWith('R') || 
                     nameUpper.includes('INICIAL') || 
                     (pauta.tipo_aplicacion && pauta.tipo_aplicacion.toUpperCase().includes('INICIAL'));

    if (isRodaje || int1 <= 0) {
        return secuencia; // Retorna solo el hito inicial
    }

    // 3. Generar secuencia cíclica hasta el límite (KM Actual + 500k)
    let currentKm = kmInicial;
    let usarInt1 = true;
    const limiteKm = kilometrajeActual + 500000;

    while (currentKm < limiteKm) {
        if (int2 > 0) {
            currentKm += usarInt1 ? int1 : int2;
            usarInt1 = !usarInt1; // Alternar para el próximo salto
        } else {
            currentKm += int1;
        }

        // Agregar el hito solo si no supera el límite de proyección
        if (currentKm < limiteKm) {
            secuencia.push({ iteracion_km: currentKm, nombre: pautaName });
        }
    }

    return secuencia;
}

export function normalizeTexto(s: any): string {
    return String(s || '')
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toUpperCase();
}

export function obtenerCategoriaAceite(aceite: any): string {
    const o = normalizeTexto(aceite);
    if (!o) return 'UNKNOWN';
    if (o.includes('SINTET') || o.includes('SYNTH') || o === '5W30' || o === '5W40' || o === '0W20' || o === '0W30' || o === '0W40') {
        return 'SINTETICO';
    }
    if (o.includes('SEMI') || o === '10W40' || o === '10W30') {
        return 'SEMI-SINTETICO';
    }
    if (o.includes('MINER') || o === '15W40' || o === '20W50') {
        return 'MINERAL';
    }
    return o;
}

export function limpiarNombreModelo(modelo: any): string {
    let s = normalizeTexto(modelo);
    if (s.includes('/')) s = s.split('/').pop()!.trim();
    // Remover marcas comunes si vienen pegadas al modelo
    s = s.replace(/^(M\.\s*BENZ|M\.BENZ|MERCEDES\s*BENZ|MERCEDES-BENZ|MERCEDES|MB|HYUNDAI|TOYOTA|VOLVO|SCANIA|CHEVROLET|FORD|PEUGEOT|CITROEN|FIAT|VOLKSWAGEN|VW|MAXUS|RAM|MITSUBISHI|SSANGYONG)\s+/i, '');
    return s.trim();
}

/**
 * Obtiene la secuencia consolidada y ordenada de pautas de mantenimiento para un vehículo específico,
 * resolviendo compatibilidad de modelo y tipo/viscosidad de aceite.
 * 
 * Si el vehículo cuenta con un intervalo personalizado (ej: editado en su ficha técnica de 10.000 a 15.000 km),
 * el sistema preserva el orden cronológico estricto de las pautas del cronograma (SM1, SM2, SM1, SM3...)
 * y proyecta los KMs de los futuros hitos sumando el nuevo intervalo al número redondo del último mantenimiento realizado.
 */
export function obtenerPautasSecuenciaParaVehiculo(
    vehiculoModelo: any,
    vehiculoAceite: any,
    kmsActuales: number,
    todasLasPautas: any[],
    intervaloCustomKm?: number,
    kmUltimaMantencion?: number,
    tipoUltimaPauta?: string
): HitoSecuencia[] {
    if (!todasLasPautas || todasLasPautas.length === 0) return [];

    const vMod = limpiarNombreModelo(vehiculoModelo);
    const vOilCat = obtenerCategoriaAceite(vehiculoAceite);

    const pautasCompatibles = todasLasPautas.filter(p => {
        const pMod = limpiarNombreModelo(p.modelo?.nombre || p.nombre_modelo_vehiculo || p.modelo_nombre || '');
        const pOilCat = obtenerCategoriaAceite(p.tipo_aceite);

        // 1. Compatibilidad de Modelo (con verificación de subversión como VS30.1 vs VS30.2)
        const vSub = vMod.match(/\.([0-9]+)/)?.[1];
        const pSub = pMod.match(/\.([0-9]+)/)?.[1];
        let modelMatch = false;
        if (vSub || pSub) {
            modelMatch = (vSub === pSub) && (vMod === pMod || vMod.includes(pMod) || pMod.includes(vMod));
        } else {
            modelMatch = vMod === pMod || (vMod && pMod && (vMod.includes(pMod) || pMod.includes(vMod)));
        }
        if (!modelMatch) return false;

        // 2. Compatibilidad de Aceite
        // Si la pauta no especifica aceite o el vehículo no lo tiene, es compatible
        if (!p.tipo_aceite || !vehiculoAceite) return true;
        // Si coinciden en categoría de aceite (ej: 5W30 -> SINTETICO)
        if (vOilCat === pOilCat) return true;

        // Si la categoría difiere pero el modelo en la BD no tiene pautas específicas para el otro aceite,
        // se asume que las pautas existentes del modelo aplican
        const pautasHermanas = todasLasPautas.filter(sib => {
            const sibMod = limpiarNombreModelo(sib.modelo?.nombre || sib.nombre_modelo_vehiculo || sib.modelo_nombre || '');
            return sibMod === pMod || (sibMod && pMod && (sibMod.includes(pMod) || pMod.includes(sibMod)));
        });
        const existePautaEspecificaAceite = pautasHermanas.some(sib => obtenerCategoriaAceite(sib.tipo_aceite) === vOilCat);
        if (!existePautaEspecificaAceite) {
            return true;
        }

        return false;
    });

    let pautasSecuencia: HitoSecuencia[] = [];
    pautasCompatibles.forEach(p => {
        const estructura: PautaEstructura = {
            id: String(p.id || ''),
            nombre: p.nombre || p.nombre_pauta || '',
            kilometraje_inicial: Number(p.kilometraje_inicial ?? p.kilometraje_pauta ?? p.cronograma_en_km ?? 0),
            intervalo_1: Number(p.intervalo_1 ?? p.intervalo_km ?? 0),
            intervalo_2: p.intervalo_2 !== undefined ? (p.intervalo_2 ? Number(p.intervalo_2) : null) : (p['intervalo_km 2'] ? Number(p['intervalo_km 2']) : null),
            tipo_aplicacion: p.tipo_aplicacion || p['tipo_aplicación'] || ''
        };
        const seq = generarSecuenciaParaPauta(estructura, kmsActuales);
        pautasSecuencia = [...pautasSecuencia, ...seq];
    });

    // Ordenar matemáticamente de menor a mayor KM
    pautasSecuencia.sort((a, b) => a.iteracion_km - b.iteracion_km);

    // Desduplicar conservando el primer hito de cada KM
    const uniqueKms = new Set<number>();
    const secuenciaBase = pautasSecuencia.filter(item => {
        if (!uniqueKms.has(item.iteracion_km)) {
            uniqueKms.add(item.iteracion_km);
            return true;
        }
        return false;
    });

    // Si no hay intervalo personalizado o la secuencia base está vacía, retornar la base
    if (!intervaloCustomKm || intervaloCustomKm <= 0 || secuenciaBase.length === 0) {
        return secuenciaBase;
    }

    // --- RECALCULAR HITOS FUTUROS CON INTERVALO PERSONALIZADO Y NÚMERO REDONDO BASE ---
    const kmUltimo = kmUltimaMantencion || 0;
    let kmRoundBase = 0;

    if (kmUltimo > 0) {
        // Encontrar el hito redondo teórico del último mantenimiento realizado.
        // Si el camión entró al taller a 101.547 km, su hito redondo programado era 100.000 km.
        let closest = secuenciaBase[0]?.iteracion_km || 0;
        let minDiff = Math.abs(closest - kmUltimo);
        for (const p of secuenciaBase) {
            const diff = Math.abs(p.iteracion_km - kmUltimo);
            if (diff < minDiff) {
                minDiff = diff;
                closest = p.iteracion_km;
            }
        }
        // Si la diferencia con el hito más cercano es razonable, usar ese hito redondo;
        // de lo contrario, redondear al múltiplo más cercano del intervalo
        if (minDiff <= (intervaloCustomKm * 1.5)) {
            kmRoundBase = closest;
        } else {
            kmRoundBase = Math.round(kmUltimo / intervaloCustomKm) * intervaloCustomKm;
        }
    }

    // Extraer la cola de pautas programadas del modelo después del hito redondo base
    const pautasEnCola = secuenciaBase
        .filter(p => p.iteracion_km > kmRoundBase)
        .filter(p => {
            const n = (p.nombre || '').toUpperCase().trim();
            return !(n.startsWith('SI') || n.startsWith('SL') || n.startsWith('R') || n.includes('INICIAL'));
        })
        .map(p => p.nombre);

    const cicloRegular = secuenciaBase
        .filter(p => {
            const n = (p.nombre || '').toUpperCase().trim();
            return !(n.startsWith('SI') || n.startsWith('SL') || n.startsWith('R') || n.includes('INICIAL'));
        })
        .map(p => p.nombre);

    const colaFinal = pautasEnCola.length > 0 ? pautasEnCola : (cicloRegular.length > 0 ? cicloRegular : ['SM1']);

    // Preservar los hitos pasados hasta el número redondo del último mantenimiento
    const pasados = secuenciaBase.filter(p => p.iteracion_km <= kmRoundBase);

    // Proyectar los hitos futuros sumando el nuevo intervalo al número redondo base
    const futuros: HitoSecuencia[] = [];
    let currentKm = kmRoundBase;
    const limiteKm = Math.max(kmsActuales, kmRoundBase) + 500000;
    let idx = 0;

    while (currentKm < limiteKm) {
        currentKm += intervaloCustomKm;
        futuros.push({
            iteracion_km: currentKm,
            nombre: colaFinal[idx % colaFinal.length]
        });
        idx++;
    }

    return [...pasados, ...futuros];
}

// 1. Datos de entrada (Lo que viene de tu Base de Datos)
export interface VehiculoDB {
    id: string | number;
    numeroInterno: string;
    patente: string; // PPU
    kilometrajeActual: number;
    fechaActualizacionKm: Date;
    intervaloMantencionKm: number;
    kmPromedioDia: number;
    // Datos del último mantenimiento (Viene de la última OT o del registro manual)
    kmUltimaMantencion: number;
    fechaUltimaMantencion: Date | null;
    tipoUltimaPauta: string;
    pautasSecuencia?: { iteracion_km: number; nombre: string }[];
    
    // Tech sheet data integration
    marca?: string;
    modelo?: string;
    ano?: string | number;
    chasis?: string;
    motor?: string;
    norma?: string;
    aplicacion?: string;
    tipoAceite?: string;
    fecha_matriculacion?: string;
    detalles?: any;
    intervaloMantenimiento?: number;
    tipoIntervalo?: string;
    factorConversionHoras?: number | null;
    en_operacion_activa?: boolean;
    estado?: string;
}

// 2. Estructura exacta de las 16 columnas de salida para la tabla
export interface FilaPizarraMantenimiento {
    id: string | number; // Added so we can uniquely identify
    // Identificación
    numeroInterno: string;          // 1. N° Int.
    ppu: string;                    // 2. PPU
    
    // Historial
    kmUltimoMantencion: number;     // 3. KM Últ. Mant.
    fechaUltimoMantencion: string;  // 4. F. Últ. Mant.
    tipoUltimoMantencion: string;   // 5. Tipo Mant.
    
    // Análisis de Desviación
    cumplimiento: "EN RANGO" | "ANTICIPADO" | "RETRASADO" | "NORMAL" | "N/A"; // 6. Cumplimiento
    estatus: "NORMAL" | "PROXIMO" | "EN_TIEMPO" | "REALIZAR_MANT" | "VENCIDO";     // 7. Estatus
    kmVencido: number | null;                                    // 8. Km Vencido
    pautaVencida: string | null;                                 // 9. Pauta Vencida
    
    // Estado Actual
    kmActual: number;               // 10. KM Actual
    fechaKmActual: string;          // 11. Fecha KM Actual
    
    // Proyección Futura
    kmProximoMantencion: number | null;    // 12. KM Próx. Mant.
    tipoProximoMantencion: string;         // 13. Tipo Próx. Mant.
    semaforoPeligro10Dias: boolean;        // 14. Semáf. (Rojo=true, Verde=false)
    fechaProximaMantencion: string | null; // 15. Fecha Próx. Mant.
    inconsistenciaKm?: boolean;             // Alerta: KM Actual < KM Última Mantención
    mensajeInconsistencia?: string;
    
    // 16. Acciones es UI (HTML/Botones), no requiere lógica de datos aquí.

    // Tech sheet data integration
    marca?: string;
    modelo?: string;
    ano?: string | number;
    chasis?: string;
    motor?: string;
    norma?: string;
    aplicacion?: string;
    tipoAceite?: string;
    fecha_matriculacion?: string;
    detalles?: any;
    intervaloMantenimiento?: number;
    tipoIntervalo?: string;
    factorConversionHoras?: number | null;
    en_operacion_activa?: boolean;
    estado?: string;
}

export function formatearDiaMesAno(d: Date | string | null): string | null {
    if (!d) return null;
    if (typeof d === 'string') {
        const clean = d.split('T')[0];
        const parts = clean.split('-');
        if (parts.length === 3 && parts[0].length === 4) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
    }
    const date = (d instanceof Date) ? d : new Date(d);
    if (isNaN(date.getTime())) return null;
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}-${month}-${year}`;
}

/**
 * Procesa un vehículo y devuelve las columnas calculadas para la Pizarra.
 */
export function calcularDatosPizarra(vehiculo: VehiculoDB): FilaPizarraMantenimiento {
    const hoy = new Date();
    
    // --- INICIALIZACIÓN DE VARIABLES BASE ---
    const kmActual = vehiculo.kilometrajeActual;
    const kmUltimo = vehiculo.kmUltimaMantencion;
    const intervalo = vehiculo.intervaloMantencionKm;
    
    let cumplimiento: "EN RANGO" | "ANTICIPADO" | "RETRASADO" | "NORMAL" | "N/A" = "N/A";
    let estatus: "NORMAL" | "PROXIMO" | "EN_TIEMPO" | "REALIZAR_MANT" | "VENCIDO" = "NORMAL";
    let kmVencido: number | null = null;
    let kmProximo: number | null = null;
    let fechaProxima: Date | null = null;
    let semaforo10Dias = false;

    let tipoProximoMantencion = "Siguiente Pauta";
    let pautaVencidaStr: string | null = null;

    // --- 1. ENCONTRAR PRÓXIMO HITO Y VENCIDOS BASADOS EN PAUTAS O INTERVALO GENÉRICO ---
    let proximoHitoVencimiento = 0;
    
    if (vehiculo.pautasSecuencia && vehiculo.pautasSecuencia.length > 0) {
        // Encontrar hito base del último mantenimiento realizado
        let kmRoundBase = 0;
        if (kmUltimo > 0) {
            let closest = vehiculo.pautasSecuencia[0]?.iteracion_km || 0;
            let minDiff = Math.abs(closest - kmUltimo);
            for (const p of vehiculo.pautasSecuencia) {
                const diff = Math.abs(p.iteracion_km - kmUltimo);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = p.iteracion_km;
                }
            }
            kmRoundBase = (intervalo > 0 && minDiff <= (intervalo * 1.5)) ? closest : (intervalo > 0 ? Math.round(kmUltimo / intervalo) * intervalo : kmUltimo);
        }

        // Hitos futuros estrictamente posteriores al último mantenimiento
        let hitosFuturos = vehiculo.pautasSecuencia.filter(p => p.iteracion_km > kmRoundBase);
        
        // Excluir pautas de rodaje/inicial si el vehículo ya superó la fase inicial
        const hasHistoryOrPastPhase = kmUltimo > 0 || kmActual > (intervalo * 1.5);
        if (hasHistoryOrPastPhase && hitosFuturos.length > 0) {
            const hitosSinRodaje = hitosFuturos.filter(p => {
                const name = (p.nombre || '').toUpperCase().trim();
                return !(name.startsWith('SI') || name.startsWith('R') || name.includes('INICIAL'));
            });
            if (hitosSinRodaje.length > 0) {
                hitosFuturos = hitosSinRodaje;
            }
        }

        const hitoProximo = hitosFuturos.length > 0 ? hitosFuturos[0] : vehiculo.pautasSecuencia[vehiculo.pautasSecuencia.length - 1];
        proximoHitoVencimiento = hitoProximo.iteracion_km;
        tipoProximoMantencion = hitoProximo.nombre.split('-')[0].trim();

        const intEfectivo = intervalo > 0 ? intervalo : 10000;
        const tolerancia10 = intEfectivo * 0.10; // Rango operativo +/- 10%
        const aviso20 = intEfectivo * 0.20;      // Aviso preventivo 20% antes del hito

        const limiteSuperior = proximoHitoVencimiento + tolerancia10; // Hito + 10%
        const limiteInferior = proximoHitoVencimiento - tolerancia10; // Hito - 10%
        const limiteAviso = proximoHitoVencimiento - aviso20;         // Hito - 20%

        if (kmActual > limiteSuperior) {
            // Supera el límite superior (+10% de tolerancia): MANT. VENCIDO
            estatus = "VENCIDO";
            kmVencido = Math.round(kmActual - limiteSuperior);
            pautaVencidaStr = tipoProximoMantencion;
        } else if (kmActual >= limiteInferior) {
            // Dentro del rango de realización de mantenimiento +/- 10%: REALIZAR MANT.
            estatus = "REALIZAR_MANT";
            kmVencido = null;
            pautaVencidaStr = null;
        } else if (kmActual >= limiteAviso) {
            // Entre 20% y 10% antes del hito: MANT. PRÓXIMO
            estatus = "PROXIMO";
            kmVencido = null;
            pautaVencidaStr = null;
        } else {
            // Antes del 20% de aviso previo: NORMALIDAD
            estatus = "NORMAL";
            kmVencido = null;
            pautaVencidaStr = null;
        }
    } else {
        // --- LÓGICA DE FALLBACK (SI NO HAY SECUENCIA PAUTAS) ---
        if (kmUltimo > 0 && intervalo > 0) {
            const kmUltimoRedondeado = Math.round(kmUltimo / intervalo) * intervalo;
            const primerHito = kmUltimoRedondeado + intervalo;
            const tolerancia10 = intervalo * 0.10;
            const aviso20 = intervalo * 0.20;

            const limiteSuperior = primerHito + tolerancia10;
            const limiteInferior = primerHito - tolerancia10;
            const limiteAviso = primerHito - aviso20;

            proximoHitoVencimiento = primerHito;
            if (kmActual > limiteSuperior) {
                kmVencido = Math.round(kmActual - limiteSuperior);
                estatus = "VENCIDO";
                pautaVencidaStr = `Mant. de ${primerHito.toLocaleString('es-CL')} km`;
            } else if (kmActual >= limiteInferior) {
                estatus = "REALIZAR_MANT";
                kmVencido = null;
                pautaVencidaStr = null;
            } else if (kmActual >= limiteAviso) {
                estatus = "PROXIMO";
                kmVencido = null;
                pautaVencidaStr = null;
            } else {
                estatus = "NORMAL";
                kmVencido = null;
                pautaVencidaStr = null;
            }
        }
    }
    
    kmProximo = proximoHitoVencimiento > 0 ? proximoHitoVencimiento : null;

    // --- 2. CÁLCULO DE CUMPLIMIENTO (Tolerancia +/- 10% respecto al hito teórico) ---
    if (kmUltimo > 0 && intervalo > 0) {
        let hitoIdeal = Math.round(kmUltimo / intervalo) * intervalo;
        if (vehiculo.pautasSecuencia && vehiculo.pautasSecuencia.length > 0) {
            let closest = vehiculo.pautasSecuencia[0].iteracion_km;
            let minDiff = Math.abs(closest - kmUltimo);
            for (const p of vehiculo.pautasSecuencia) {
                const diff = Math.abs(p.iteracion_km - kmUltimo);
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = p.iteracion_km;
                }
            }
            if (minDiff <= (intervalo * 1.5)) {
                hitoIdeal = closest;
            }
        }
        const tolerancia = intervalo * 0.10; // 10% de tolerancia

        if (kmUltimo < (hitoIdeal - tolerancia)) {
            cumplimiento = "ANTICIPADO";
        } else if (kmUltimo > (hitoIdeal + tolerancia)) {
            cumplimiento = "RETRASADO";
        } else {
            cumplimiento = "EN RANGO";
        }
    }

    // --- 3. PROYECCIÓN DE FECHA Y SEMÁFORO (Predicción con KM/Día) ---
    if (kmProximo !== null && kmProximo > 0) {
        // Paso 2: Calcular KMs faltantes
        const kmsFaltantes = kmProximo - kmActual;
        
        // Paso 3: Promedio KM Diario con condición de seguridad
        const kmPromDia = (vehiculo.kmPromedioDia && vehiculo.kmPromedioDia > 0) ? vehiculo.kmPromedioDia : 25;
        
        if (kmsFaltantes <= 0) {
            // Paso 6: Caso Vencido
            fechaProxima = new Date(hoy);
        } else {
            // Paso 4: Calcular días restantes
            const diasRestantes = Math.round(kmsFaltantes / kmPromDia);
            
            // Paso 5: Proyectar la fecha exacta
            fechaProxima = new Date(hoy);
            fechaProxima.setDate(fechaProxima.getDate() + diasRestantes);
        }
    } else {
        // Si no hay km_prox_mant
        fechaProxima = null;
    }

    if (fechaProxima) {
        const diffTime = fechaProxima.getTime() - hoy.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 10) {
            semaforo10Dias = true;
        }
    }

    if (!tipoProximoMantencion || tipoProximoMantencion === "Siguiente Pauta") {
        tipoProximoMantencion = vehiculo.tipoUltimaPauta || "N/A";
    }

    return {
        ...vehiculo,
        id: vehiculo.id,
        numeroInterno: vehiculo.numeroInterno,
        ppu: vehiculo.patente,
        kmUltimoMantencion: kmUltimo,
        fechaUltimoMantencion: vehiculo.fechaUltimaMantencion ? formatearDiaMesAno(vehiculo.fechaUltimaMantencion) || "—" : "—",
        tipoUltimoMantencion: vehiculo.tipoUltimaPauta || "N/A",
        
        cumplimiento: cumplimiento,
        estatus: estatus,
        kmVencido: kmVencido,
        pautaVencida: pautaVencidaStr,
        
        kmActual: kmActual,
        fechaKmActual: formatearDiaMesAno(vehiculo.fechaActualizacionKm) as string,
        
        kmProximoMantencion: kmProximo,
        tipoProximoMantencion: tipoProximoMantencion,
        semaforoPeligro10Dias: semaforo10Dias,
        fechaProximaMantencion: formatearDiaMesAno(fechaProxima),
        inconsistenciaKm: (kmUltimo > 0 && kmActual > 0 && kmActual < (kmUltimo - 100)),
        mensajeInconsistencia: (kmUltimo > 0 && kmActual > 0 && kmActual < (kmUltimo - 100))
            ? `Inconsistencia: KM actual (${kmActual.toLocaleString('es-CL')} km) es menor a última mantención (${kmUltimo.toLocaleString('es-CL')} km)`
            : undefined
    };
}


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

export function mapearVehiculoDB(v: any, pautasData: any[], ordenesTrabajo: any[]): VehiculoDB {
  const detalles = v.detalles || {};
  let kmsActuales = typeof v.kilometraje_actual === 'number' ? v.kilometraje_actual : parseFloat(String(v.kilometraje_actual).replace(/[^0-9.-]+/g, '')) || 0;
  
  const rawKmUlt = (v.km_ultima_mantencion !== undefined && v.km_ultima_mantencion !== null && v.km_ultima_mantencion !== '')
    ? v.km_ultima_mantencion
    : (detalles.km_ultima_mantencion !== undefined && detalles.km_ultima_mantencion !== null ? detalles.km_ultima_mantencion : 0);
  let kmUltMant = typeof rawKmUlt === 'number' ? rawKmUlt : parseFloat(String(rawKmUlt).replace(/[^0-9.-]+/g, '')) || 0;

  if (kmUltMant > 1000 && kmsActuales > (kmUltMant * 4) && Math.abs((kmsActuales / 10) - kmUltMant) < kmUltMant) {
    kmsActuales = Math.round((kmsActuales / 10) * 100) / 100;
  }

  if (detalles?.odometro_manual && typeof detalles?.km_manual === 'number') {
    if (kmsActuales < detalles.km_manual || (kmsActuales > (detalles.km_manual * 4))) {
      kmsActuales = detalles.km_manual;
    }
  }
  
  const rawInterval = (v.intervalo_mantencion_km !== undefined && v.intervalo_mantencion_km !== null)
    ? v.intervalo_mantencion_km
    : ((v.intervalo_km !== undefined && v.intervalo_km !== null)
      ? v.intervalo_km
      : (detalles.intervalo_mantencion_km !== undefined && detalles.intervalo_mantencion_km !== null ? detalles.intervalo_mantencion_km : (detalles.intervalo_km || 15000)));
  const kmInterv = typeof rawInterval === 'number' ? rawInterval : parseFloat(String(rawInterval).replace(/[^0-9.-]+/g, '')) || 15000;
  
  let pautasSecuenciaStr = v.tipo_ultimo_mant || v.tipo_ult_pauta || detalles.tipo_ultimo_mant || detalles.tipo_ult_pauta || '';
  if (pautasSecuenciaStr && pautasSecuenciaStr.includes('-')) {
    pautasSecuenciaStr = pautasSecuenciaStr.split('-')[0].trim();
  }
  let fechaUltMant = v.fecha_ultima_mantencion || v.fecha_ult_mantencion || detalles.fecha_ultima_mantencion || null;

  const otsFinalizadas = (ordenesTrabajo || []).filter((o: any) =>
    (String(o.vehiculoId || o.vehiculo_id) === String(v.id) || (v.patente && o.patente === v.patente)) &&
    (o.estado === 'FINALIZADA' || o.estado === 'CERRADA_POR_MECANICO') &&
    String(o.tipo || o.tipo_mantenimiento || '').toUpperCase().includes('PREVENTIV')
  );

  if (otsFinalizadas.length > 0) {
    const sortedOts = [...otsFinalizadas].sort((a, b) => {
      const kmB = Number(b.kilometrajeCierre || b.kilometraje_cierre || b.kilometrajeApertura || 0);
      const kmA = Number(a.kilometrajeCierre || a.kilometraje_cierre || a.kilometrajeApertura || 0);
      if (kmB !== kmA) return kmB - kmA;
      const timeB = new Date(b.termino_proceso || b.fechaProgramada || b.fechaCreacion || 0).getTime();
      const timeA = new Date(a.termino_proceso || a.fechaProgramada || a.fechaCreacion || 0).getTime();
      return timeB - timeA;
    });

    const topOt = sortedOts[0];
    const otKm = Number(topOt.kilometrajeCierre || topOt.kilometraje_cierre || topOt.kilometrajeApertura || 0);
    if (otKm >= kmUltMant) {
      kmUltMant = otKm;
      const f = topOt.termino_proceso || topOt.fechaProgramada || topOt.fechaCreacion;
      if (f) fechaUltMant = f;
      if (topOt.pauta && !topOt.pauta.toLowerCase().includes('inicial') && topOt.pauta.trim() !== '') {
        pautasSecuenciaStr = topOt.pauta.split('-')[0].trim();
      }
    }
  }

  if (kmsActuales <= 0 && kmUltMant > 0) {
    kmsActuales = kmUltMant;
  }

  const vehOil = v.tipo_aceite || detalles.tipo_aceite || '';
  const pautasSecuencia: HitoSecuencia[] = pautasData
    ? obtenerPautasSecuenciaParaVehiculo(
        v.modelo || detalles.modelo, 
        vehOil, 
        kmsActuales, 
        pautasData,
        kmInterv,
        kmUltMant,
        pautasSecuenciaStr
      )
    : [];

  // Deducción automática de última pauta si venía vacía, como inicial o no reconocida:
  if (!pautasSecuenciaStr || pautasSecuenciaStr.toLowerCase().includes('inicial') || pautasSecuenciaStr === 'N/A' || pautasSecuenciaStr === 'Mantenimiento Preventivo') {
    if (pautasSecuencia && pautasSecuencia.length > 0 && kmUltMant > 0) {
      let closestHito = pautasSecuencia[0];
      let minDiff = Math.abs(pautasSecuencia[0].iteracion_km - kmUltMant);
      for (const h of pautasSecuencia) {
        const diff = Math.abs(h.iteracion_km - kmUltMant);
        if (diff < minDiff) {
          minDiff = diff;
          closestHito = h;
        }
      }
      pautasSecuenciaStr = closestHito.nombre.split('-')[0].trim();
    } else {
      pautasSecuenciaStr = 'SM1';
    }
  }

  const rawMarca = v.marca || detalles.marca || '';
  const rawMod = v.modelo || detalles.modelo || '';
  const inferredMarca = (!rawMarca && rawMod && rawMod.includes('/')) ? rawMod.split('/')[0].trim() : rawMarca;
  const pureModelo = obtenerSoloModelo(rawMod, inferredMarca);

  const rawFechaAct = v.fecha_actualizacion_km || detalles.fecha_actualizacion_km || v.updated_at || v.created_at;
  const parsedFechaAct = rawFechaAct ? new Date(rawFechaAct) : new Date();

  return {
    id: v.id,
    numeroInterno: v.numero_interno?.toString() || '',
    patente: v.patente || '',
    kilometrajeActual: kmsActuales,
    fechaActualizacionKm: !isNaN(parsedFechaAct.getTime()) ? parsedFechaAct : new Date(),
    intervaloMantencionKm: kmInterv,
    kmPromedioDia: v.km_promedio_dia || detalles.kmPromedioDia || 0,
    kmUltimaMantencion: kmUltMant,
    fechaUltimaMantencion: fechaUltMant ? new Date(fechaUltMant) : null,
    tipoUltimaPauta: pautasSecuenciaStr,
    pautasSecuencia,
    marca: inferredMarca,
    modelo: pureModelo !== '--' ? pureModelo : (rawMod || ''),
    ano: v.anio || v.ano || detalles.ano || detalles.anio || '',
    chasis: v.chasis || detalles.chasis || '',
    motor: v.motor || detalles.motor || '',
    norma: v.norma_euro || v.norma || detalles.norma_euro || detalles.norma || '',
    aplicacion: v.aplicacion || detalles.aplicacion || '',
    tipoAceite: v.tipo_aceite || v.tipoAceite || detalles.tipo_aceite || detalles.tipoAceite || '',
    fecha_matriculacion: v.fecha_matriculacion || detalles.fecha_matriculacion || '',
    detalles,
    intervaloMantenimiento: kmInterv,
    tipoIntervalo: v.tipo_intervalo || 'KM',
    factorConversionHoras: v.factor_conversion_horas || null,
    en_operacion_activa: v.en_operacion_activa !== false && v.estado !== 'DE_BAJA' && detalles?.activo !== false,
    estado: v.estado || 'OPERATIVO'
  };
}
