import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'public-anon-key';

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'https://example.supabase.co') {
  console.warn('Faltan las variables de entorno de Supabase. Algunas funcionalidades pueden fallar.');
}

const rawSupabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Motor de Sandbox Local para Maqueta Comercial Pulser TMS:
 * - Operaciones SELECT: Pasan directamente a la base de datos central en Supabase (Solo Lectura).
 * - Operaciones INSERT / UPDATE / UPSERT / DELETE: Son interceptadas y simuladas con éxito localmente,
 *   sin enviar modificaciones ni borrados a la base de datos maestra.
 * - Esto garantiza que múltiples clientes puedan probar y jugar con la plataforma simultáneamente
 *   sin generar conflictos ni alterar los datos de origen de Pulser Gaval Demo.
 */
function createSandboxBuilder(table: string, op: 'insert' | 'update' | 'upsert' | 'delete', payload: any) {
  let isSingle = false;
  const builder: any = {
    _table: table,
    _op: op,
    _payload: payload,
    then(onFulfilled: any, onRejected: any) {
      let resultData = payload;
      if (Array.isArray(payload)) {
        resultData = isSingle ? (payload[0] || null) : payload;
      } else if (payload && typeof payload === 'object') {
        resultData = payload;
      } else {
        resultData = null;
      }

      console.info(`🛡️ [Sandbox Demo] Operación "${op.toUpperCase()}" en tabla "${table}" simulada localmente (Base de datos central protegida).`);

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
    'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'like', 'ilike', 'is', 'in', 'contains', 
    'containedBy', 'rangeGt', 'rangeGte', 'rangeLt', 'rangeLte', 'rangeAdjacent', 
    'overlaps', 'textSearch', 'match', 'not', 'or', 'filter', 'order', 'limit', 
    'range', 'abortSignal', 'select', 'csv'
  ];

  chainMethods.forEach(method => {
    builder[method] = function(...args: any[]) {
      return builder;
    };
  });

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
