import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export interface Company {
  id: string;
  name: string;
  fleetSize: number;
  usersCount: number;
  status: 'Activo' | 'Inactivo';
  joinDate: string;
  razonSocial?: string;
  expirationDate?: string;
}

export interface ExpirationOption {
  value: string;
  label: string;
}

export const initialExpirationOptions: ExpirationOption[] = [
  { value: '6m', label: '6 Meses' },
  { value: '1y', label: '1 Año' },
];

interface CompanyContextType {
  companies: Company[];
  activeCompanyId: string;
  setActiveCompanyId: (id: string) => void;
  activeCompany: Company | undefined;
  currentCompany: Company | undefined;
  addCompany: (company: Omit<Company, 'id'>) => void;
  toggleCompanyStatus: (id: string) => void;
  expirationOptions: ExpirationOption[];
  addExpirationOption: (option: ExpirationOption) => void;
  isSuperAdmin: boolean;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string>(() => {
    const saved = localStorage.getItem('superAdminTenantId');
    return (saved && saved !== '57fa41da-645d-48ba-a671-65a35312d0e9') ? saved : '161a47ac-9c63-435d-ab55-a6163a6805ab';
  });
  const [expirationOptions, setExpirationOptions] = useState<ExpirationOption[]>(initialExpirationOptions);

  const isSuperAdmin = profile?.rol?.nombre === 'Súper Administrador' || profile?.rol?.nombre === 'Super Administrador';

  useEffect(() => {
    const fetchCompanies = async () => {
      // Si es super admin, cargar todas las empresas. Si no, solo la suya (o quizás no necesite cargar la lista completa, pero la cargamos por consistencia)
      if (isSuperAdmin) {
        try {
          const { data, error } = await supabase.from('empresa').select('*').order('nombre', { ascending: true });
          if (data && data.length > 0 && !error) {
            // Filtrar estrictamente Alvimar para mantener Maqueta 100% demo
            const filteredData = data.filter(e => !(e.nombre || '').toLowerCase().includes('alvimar'));
            const mapped: Company[] = filteredData.map(e => ({
              id: e.id,
              name: e.nombre,
              razonSocial: e.razon_social,
              status: e.estado as any,
              joinDate: e.created_at,
              fleetSize: 0,
              usersCount: 0
            }));
            setCompanies(mapped);
            
            // Priorizar por defecto la empresa Demo Gaval
            const gavalComp = mapped.find(c => c.name.toLowerCase().includes('gaval'));
            const defaultDemoId = gavalComp ? gavalComp.id : (mapped[0]?.id || '161a47ac-9c63-435d-ab55-a6163a6805ab');

            if (!activeCompanyId && mapped.length > 0) {
              const savedTenant = localStorage.getItem('superAdminTenantId');
              if (savedTenant && mapped.find(c => c.id === savedTenant && !c.name.toLowerCase().includes('alvimar'))) {
                setActiveCompanyId(savedTenant);
              } else {
                setActiveCompanyId(defaultDemoId);
                localStorage.setItem('superAdminTenantId', defaultDemoId);
              }
            }
          } else {
            const defaultId = '161a47ac-9c63-435d-ab55-a6163a6805ab';
            const fallbackComp: Company = {
              id: defaultId,
              name: 'Gaval Demo TMS',
              razonSocial: 'Gaval Consultora Demo',
              status: 'Activo',
              joinDate: new Date().toISOString(),
              fleetSize: 30,
              usersCount: 5
            };
            setCompanies([fallbackComp]);
            setActiveCompanyId(defaultId);
          }
        } catch (err) {
          console.warn('Error fetching companies, using fallback:', err);
          const defaultId = '161a47ac-9c63-435d-ab55-a6163a6805ab';
          const fallbackComp: Company = {
            id: defaultId,
            name: 'Gaval Demo TMS',
            razonSocial: 'Gaval Consultora Demo',
            status: 'Activo',
            joinDate: new Date().toISOString(),
            fleetSize: 30,
            usersCount: 5
          };
          setCompanies([fallbackComp]);
          setActiveCompanyId(defaultId);
        }
      } else if (profile?.empresa_id && profile.empresa_id !== 'emp-001') {
        try {
          const { data, error } = await supabase.from('empresa').select('*').eq('id', profile.empresa_id).single();
          if (data && !error && !(data.nombre || '').toLowerCase().includes('alvimar')) {
            const comp: Company = {
              id: data.id,
              name: data.nombre,
              razonSocial: data.razon_social,
              status: data.estado as any,
              joinDate: data.created_at,
              fleetSize: 0,
              usersCount: 0
            };
            setCompanies([comp]);
            setActiveCompanyId(comp.id);
          } else {
            const fallbackComp: Company = {
              id: '161a47ac-9c63-435d-ab55-a6163a6805ab',
              name: 'Gaval Demo TMS',
              razonSocial: 'Gaval Consultora Demo',
              status: 'Activo',
              joinDate: new Date().toISOString(),
              fleetSize: 30,
              usersCount: 5
            };
            setCompanies([fallbackComp]);
            setActiveCompanyId(fallbackComp.id);
          }
        } catch (err) {
          console.warn('Error fetching single company, using fallback:', err);
          const fallbackComp: Company = {
            id: '161a47ac-9c63-435d-ab55-a6163a6805ab',
            name: 'Gaval Demo TMS',
            razonSocial: 'Gaval Consultora Demo',
            status: 'Activo',
            joinDate: new Date().toISOString(),
            fleetSize: 30,
            usersCount: 5
          };
          setCompanies([fallbackComp]);
          setActiveCompanyId(fallbackComp.id);
        }
      } else {
        try {
          const { data, error } = await supabase.from('empresa').select('*').order('nombre', { ascending: true });
          if (data && data.length > 0 && !error) {
            const filtered = data.filter(e => !(e.nombre || '').toLowerCase().includes('alvimar'));
            const mapped: Company[] = filtered.map(e => ({
              id: e.id,
              name: e.nombre,
              razonSocial: e.razon_social,
              status: e.estado as any,
              joinDate: e.created_at,
              fleetSize: 0,
              usersCount: 0
            }));
            setCompanies(mapped);
            const gaval = mapped.find(m => m.name.toLowerCase().includes('gaval'));
            setActiveCompanyId(gaval ? gaval.id : (mapped[0]?.id || '161a47ac-9c63-435d-ab55-a6163a6805ab'));
            return;
          }
        } catch (e) {
          console.warn('Error fetching default companies:', e);
        }
        const defaultId = '57fa41da-645d-48ba-a671-65a35312d0e9';
        const fallbackComp: Company = {
          id: defaultId,
          name: 'Imperia',
          status: 'Activo',
          joinDate: new Date().toISOString(),
          fleetSize: 0,
          usersCount: 0
        };
        setCompanies([fallbackComp]);
        setActiveCompanyId(defaultId);
      }
    };

    fetchCompanies();
  }, [profile, isSuperAdmin]); // activeCompanyId removed from deps to prevent reset

  const switchTenant = (id: string) => {
    if (isSuperAdmin) {
      setActiveCompanyId(id);
      localStorage.setItem('superAdminTenantId', id);
    }
  };

  const currentCompany = companies.find(c => c.id === activeCompanyId) || (companies.length > 0 ? companies[0] : undefined);
  const activeCompany = currentCompany; // Alias for legacy code

  const addCompany = (company: Omit<Company, 'id'>) => {
    // Legacy mock function
    const newId = `COMP-${(companies.length + 1).toString().padStart(3, '0')}`;
    setCompanies([...companies, { ...company, id: newId }]);
  };

  const toggleCompanyStatus = (id: string) => {
    // Legacy mock function
    setCompanies(companies.map(c => 
      c.id === id 
        ? { ...c, status: c.status === 'Activo' ? 'Inactivo' : 'Activo' } 
        : c
    ));
  };

  const addExpirationOption = (option: ExpirationOption) => {
    if (!expirationOptions.some(opt => opt.value === option.value)) {
      setExpirationOptions([...expirationOptions, option]);
    }
  };

  return (
    <CompanyContext.Provider value={{ 
      companies, 
      activeCompanyId, 
      setActiveCompanyId: switchTenant, 
      activeCompany, 
      currentCompany,
      addCompany, 
      toggleCompanyStatus, 
      expirationOptions, 
      addExpirationOption,
      isSuperAdmin
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
