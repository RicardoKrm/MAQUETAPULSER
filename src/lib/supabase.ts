import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://lafhpegjexgbjoxdqxxw.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_2H9RF-gipot9S7pre2NPOQ_2KnywGqP';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://example.supabase.co') {
  console.warn('Faltan las variables de entorno de Supabase. Algunas funcionalidades pueden fallar.');
}

const rawSupabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Inactividad y Reset Automático del Sandbox Demo:
 * Si el usuario pasa 15 minutos sin interactuar (sin mover el mouse, clics ni teclas),
 * se limpian automáticamente todas las claves 'sandbox_' de sessionStorage y se recarga
 * la página para volver a los valores originales de la base de datos de Gaval Demo TMS.
 */
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutos
let inactivityTimer: any = null;

function resetInactivityTimer() {
  if (typeof window === 'undefined') return;
  if (inactivityTimer) clearTimeout(inactivityTimer);

  inactivityTimer = setTimeout(() => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('sandbox_')) {
          keysToRemove.push(key);
        }
      }
      if (keysToRemove.length > 0) {
        keysToRemove.forEach(k => sessionStorage.removeItem(k));
        console.info('[Sandbox Demo] Tiempo de inactividad alcanzado. Restaurando valores originales.');
        window.location.reload();
      }
    } catch (e) {}
  }, INACTIVITY_TIMEOUT_MS);
}

if (typeof window !== 'undefined') {
  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'].forEach(evt => {
    window.addEventListener(evt, resetInactivityTimer, { passive: true });
  });
  resetInactivityTimer();
}

/**
 * Almacenamiento de Sandbox Local en sessionStorage:
 * - Persiste las manipulaciones de datos durante toda la sesión del usuario/prospecto.
 * - Evita que un auto-refresh o cambio de pestaña revierta los cambios realizados en demo.
 * - Se reinicia automáticamente cuando el usuario cierra la pestaña o navegador.
 */
interface SessionStore {
  updates: Record<string, any>;
  inserts: any[];
  deletes: string[];
}

function getSessionTableStore(table: string): SessionStore {
  if (typeof window === 'undefined' || !window.sessionStorage) {
    return { updates: {}, inserts: [], deletes: [] };
  }
  try {
    const raw = window.sessionStorage.getItem(`sandbox_${table}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { updates: {}, inserts: [], deletes: [] };
}

function saveSessionTableStore(table: string, store: SessionStore) {
  if (typeof window === 'undefined' || !window.sessionStorage) return;
  try {
    window.sessionStorage.setItem(`sandbox_${table}`, JSON.stringify(store));
  } catch (e) {}
}

function applySessionToRows(table: string, data: any): any {
  if (!data) return data;
  const store = getSessionTableStore(table);
  
  if (Array.isArray(data)) {
    // 1. Filtrar registros eliminados en esta sesión
    let result = data.filter((r: any) => {
      const key = String(r.id || r.numero_interno || r.patente || '');
      const contratoKey = r.contrato_id ? String(r.contrato_id) : null;
      return !store.deletes.includes(key) && (!contratoKey || !store.deletes.includes(contratoKey));
    });

    // 2. Fusionar actualizaciones de la sesión
    result = result.map((r: any) => {
      const idKey = r.id ? String(r.id) : null;
      const patKey = r.patente ? String(r.patente) : null;
      const numKey = r.numero_interno ? String(r.numero_interno) : null;

      const patch = (idKey && store.updates[idKey]) || (patKey && store.updates[patKey]) || (numKey && store.updates[numKey]);
      if (patch) {
        return {
          ...r,
          ...patch,
          detalles: {
            ...(r.detalles || {}),
            ...(patch.detalles || {})
          }
        };
      }
      return r;
    });

    // 3. Añadir registros insertados localmente en esta sesión
    if (store.inserts && store.inserts.length > 0) {
      result = [...result, ...store.inserts];
    }

    return result;
  }

  // Objeto individual (single / maybeSingle)
  if (typeof data === 'object') {
    const idKey = data.id ? String(data.id) : null;
    const patKey = data.patente ? String(data.patente) : null;
    const patch = (idKey && store.updates[idKey]) || (patKey && store.updates[patKey]);
    if (patch) {
      return {
        ...data,
        ...patch,
        detalles: {
          ...(data.detalles || {}),
          ...(patch.detalles || {})
        }
      };
    }
  }

  return data;
}

/**
 * Motor de Sandbox Local para Maqueta Comercial Pulser TMS
 */
function createSandboxBuilder(table: string, op: 'insert' | 'update' | 'upsert' | 'delete', payload: any) {
  let isSingle = false;
  let targetId: string | null = null;

  const builder: any = {
    _table: table,
    _op: op,
    _payload: payload,
    then(onFulfilled: any, onRejected: any) {
      const store = getSessionTableStore(table);

      if (op === 'update' || op === 'upsert') {
        const key = targetId || (payload && (payload.id ? String(payload.id) : (payload.patente ? String(payload.patente) : null)));
        if (key) {
          store.updates[key] = {
            ...(store.updates[key] || {}),
            ...payload
          };
          saveSessionTableStore(table, store);
        }
      } else if (op === 'insert') {
        const toAdd = Array.isArray(payload) ? payload : [payload];
        store.inserts.push(...toAdd);
        saveSessionTableStore(table, store);
      } else if (op === 'delete' && targetId) {
        if (!store.deletes.includes(targetId)) {
          store.deletes.push(targetId);
          saveSessionTableStore(table, store);
        }
      }

      console.info(`🛡️ [Sandbox Demo] Operación "${op.toUpperCase()}" en tabla "${table}" persistida en sessionStorage local.`);

      let resultData = payload;
      if (Array.isArray(payload)) {
        resultData = isSingle ? (payload[0] || null) : payload;
      } else if (payload && typeof payload === 'object') {
        resultData = payload;
      } else {
        resultData = null;
      }

      const response = {
        data: resultData,
        error: null,
        count: Array.isArray(payload) ? payload.length : (payload ? 1 : 0),
        status: 200,
        statusText: 'OK (Sandbox Local)'
      };
      return Promise.resolve(response).then(onFulfilled, onRejected);
    }
  };

  const chainMethods = [
    'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'is', 'in', 'contains', 
    'containedBy', 'rangeGt', 'rangeGte', 'rangeLt', 'rangeLte', 'rangeAdjacent', 
    'overlaps', 'textSearch', 'match', 'not', 'or', 'filter', 'order', 'limit', 
    'range', 'abortSignal', 'select', 'csv'
  ];

  chainMethods.forEach(method => {
    builder[method] = function(...args: any[]) {
      return builder;
    };
  });

  builder.eq = function(column: string, value: any) {
    targetId = String(value);
    return builder;
  };

  builder.single = function() {
    isSingle = true;
    return builder;
  };

  builder.maybeSingle = function() {
    isSingle = true;
    return builder;
  };

  return builder;
}

function wrapQueryBuilder(table: string, qb: any): any {
  return new Proxy(qb, {
    get(target: any, prop: string | symbol) {
      if (prop === 'then') {
        return function(onFulfilled: any, onRejected: any) {
          return target.then((res: any) => {
            if (res && res.data) {
              res.data = applySessionToRows(table, res.data);
            }
            return res;
          }).then(onFulfilled, onRejected);
        };
      }
      const orig = target[prop];
      if (typeof orig === 'function') {
        return function(...args: any[]) {
          const res = orig.apply(target, args);
          // Si el resultado de encadenar (.eq, .order, etc.) es el builder o promesa, envolverlo
          if (res && (typeof res === 'object' || typeof res === 'function')) {
            return wrapQueryBuilder(table, res);
          }
          return res;
        };
      }
      return orig;
    }
  });
}

export const supabase: any = new Proxy(rawSupabase, {
  get(target: any, prop: string | symbol) {
    if (prop === 'from') {
      return (table: string) => {
        const queryBuilder = target.from(table);
        return new Proxy(queryBuilder, {
          get(tableTarget: any, tableProp: string | symbol) {
            if (tableProp === 'insert') {
              return (values: any) => createSandboxBuilder(table, 'insert', values);
            }
            if (tableProp === 'update') {
              return (values: any) => createSandboxBuilder(table, 'update', values);
            }
            if (tableProp === 'upsert') {
              return (values: any) => createSandboxBuilder(table, 'upsert', values);
            }
            if (tableProp === 'delete') {
              return () => createSandboxBuilder(table, 'delete', null);
            }
            if (tableProp === 'select') {
              return (...args: any[]) => {
                const qb = tableTarget.select(...args);
                return wrapQueryBuilder(table, qb);
              };
            }
            const orig = tableTarget[tableProp];
            if (typeof orig === 'function') {
              return orig.bind(tableTarget);
            }
            return orig;
          }
        });
      };
    }
    const orig = target[prop];
    if (typeof orig === 'function') {
      return orig.bind(target);
    }
    return orig;
  }
});

export const logActividad = async (
  modulo: string,
  accion: string,
  detalles: string,
  empresaId?: string,
  usuarioId?: string
) => {
  try {
    console.info(`[Log Actividad Demo] ${modulo} - ${accion}: ${detalles}`);
  } catch (error) {
    console.error("No se pudo registrar la actividad:", error);
  }
};
