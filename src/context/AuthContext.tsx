import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, logActividad } from '../lib/supabase';

export interface AuthProfile {
  id: string;
  auth_user_id: string;
  empresa_id: string;
  rol_id: string;
  nombre: string;
  rut: string;
  email: string;
  estado: string;
  cargo?: string;
  panel_inicio?: string;
  cambio_clave_pendiente?: boolean;
  rol?: {
    nombre: string;
    tipo: string;
    permisos: any;
  };
  empresa?: {
    nombre: string;
    rut: string;
  };
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: AuthProfile | null;
  signOut: () => Promise<void>;
  setLocalSession: (email: string, nombre?: string, panelInicio?: string) => void;
  loading: boolean;
}

const LOCAL_SESSION_KEY = 'pulser_local_session_data';

export const createMockSession = (email: string = 'admin@pulser.cl', nombre: string = 'Administrador General', panelInicio: string = '/dashboard'): { session: Session; user: User; profile: AuthProfile } => {
  const userId = `user-local-${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
  const formattedName = nombre || 'Administrador General';
  
  const user: User = {
    id: userId,
    app_metadata: { provider: 'email' },
    user_metadata: { full_name: formattedName },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: email,
    phone: '+56 9 8765 4321',
    role: 'authenticated',
    updated_at: new Date().toISOString()
  };

  const session: Session = {
    access_token: `mock-token-${Date.now()}`,
    token_type: 'bearer',
    expires_in: 36000000,
    refresh_token: `mock-refresh-${Date.now()}`,
    user: user,
    expires_at: Math.floor(Date.now() / 1000) + 36000000
  };

  const profile: AuthProfile = {
    id: `prof-${userId}`,
    auth_user_id: userId,
    empresa_id: '57fa41da-645d-48ba-a671-65a35312d0e9',
    rol_id: 'rol-admin',
    nombre: formattedName,
    rut: '14.285.901-3',
    email: email,
    estado: 'ACTIVO',
    cargo: 'Súper Administrador',
    panel_inicio: panelInicio,
    cambio_clave_pendiente: false,
    rol: {
      nombre: 'Súper Administrador',
      tipo: 'SUPER_ADMIN',
      permisos: { all: true }
    },
    empresa: {
      nombre: 'Imperia SpA',
      rut: '76.785.260-6'
    }
  };

  return { session, user, profile };
};

const defaultMockSession = createMockSession();

const AuthContext = createContext<AuthContextType>({
  session: defaultMockSession.session,
  user: defaultMockSession.user,
  profile: defaultMockSession.profile,
  signOut: async () => {},
  setLocalSession: () => {},
  loading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(defaultMockSession.session);
  const [user, setUser] = useState<User | null>(defaultMockSession.user);
  const [profile, setProfile] = useState<AuthProfile | null>(defaultMockSession.profile);
  const [loading, setLoading] = useState(false);

  const setLocalSession = (email: string, nombre?: string, panelInicio: string = '/dashboard') => {
    const mockData = { email, nombre, panel_inicio: panelInicio };
    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockData));
    const { session: mockS, user: mockU, profile: mockP } = createMockSession(email, nombre, panelInicio);
    setSession(mockS);
    setUser(mockU);
    setProfile(mockP);
  };

  const loadProfile = async (userId: string, email?: string) => {
    try {
      let query = supabase
        .from('usuario_aplicacion')
        .select(`
          *,
          rol:rol_id(nombre, tipo, permisos),
          empresa:empresa_id(nombre, rut)
        `);

      if (email) {
        query = query.or(`auth_user_id.eq.${userId},email.eq.${email}`);
      } else {
        query = query.eq('auth_user_id', userId);
      }

      const { data, error } = await query.limit(1).single();
        
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        if (Array.isArray(data.rol)) data.rol = data.rol[0];
        if (Array.isArray(data.empresa)) data.empresa = data.empresa[0];
        setProfile(data);
      }
    } catch (error) {
      console.warn('Error cargando perfil desde Supabase:', error);
    }
  };

  useEffect(() => {
    // Check if there is a local fallback session stored
    const storedLocal = localStorage.getItem(LOCAL_SESSION_KEY);
    if (storedLocal) {
      try {
        const parsed = JSON.parse(storedLocal);
        const { session: mockS, user: mockU, profile: mockP } = createMockSession(parsed.email, parsed.nombre, parsed.panel_inicio);
        setSession(mockS);
        setUser(mockU);
        setProfile(mockP);
        setLoading(false);
        return;
      } catch (e) {
        console.warn('Error parseando local session:', e);
        localStorage.removeItem(LOCAL_SESSION_KEY);
      }
    }

    // Obtener sesión activa de Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        setUser(session.user);
        loadProfile(session.user.id, session.user.email).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const storedLocal = localStorage.getItem(LOCAL_SESSION_KEY);
      if (storedLocal) return; // conserve local session if active

      setSession(session);
      setUser(session?.user || null);
      if (session?.user?.id) {
        loadProfile(session.user.id, session.user.email).finally(() => setLoading(false));
      } else {
        setSession(defaultMockSession.session);
        setUser(defaultMockSession.user);
        setProfile(defaultMockSession.profile);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    localStorage.removeItem(LOCAL_SESSION_KEY);
    const mock = createMockSession();
    setSession(mock.session);
    setUser(mock.user);
    setProfile(mock.profile);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, signOut, setLocalSession, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

