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
  
  // En Maqueta Demo restringir ESTRICTAMENTE a Gaval Demo TMS
  // Ningún cliente o prospecto podrá ver los nombres de otras empresas ni clientes reales
  const gavalDemoCompany: Company = {
    id: '161a47ac-9c63-435d-ab55-a6163a6805ab',
    name: 'Gaval Demo TMS',
    razonSocial: 'Gaval Consultora Demo SpA',
    status: 'Activo',
    joinDate: '2026-01-01',
    fleetSize: 30,
    usersCount: 5
  };

  const [companies, setCompanies] = useState<Company[]>([gavalDemoCompany]);
  const [activeCompanyId, setActiveCompanyId] = useState<string>('161a47ac-9c63-435d-ab55-a6163a6805ab');
  const [expirationOptions, setExpirationOptions] = useState<ExpirationOption[]>(initialExpirationOptions);

  const isSuperAdmin = true;

  useEffect(() => {
    localStorage.setItem('superAdminTenantId', '161a47ac-9c63-435d-ab55-a6163a6805ab');
    setCompanies([gavalDemoCompany]);
    setActiveCompanyId('161a47ac-9c63-435d-ab55-a6163a6805ab');
  }, []);

  const switchTenant = (id: string) => {
    setActiveCompanyId('161a47ac-9c63-435d-ab55-a6163a6805ab');
    localStorage.setItem('superAdminTenantId', '161a47ac-9c63-435d-ab55-a6163a6805ab');
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
