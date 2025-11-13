'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useProperties, Property } from '@/core/hooks/useProperties';

interface PropertyContextType {
  properties: Property[];
  currentPropertyId: string;
  currentProperty: Property | null;
  switchProperty: (propertyId: string) => void;
  isLoading: boolean;
  error: string | null;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const propertyData = useProperties();

  return (
    <PropertyContext.Provider value={propertyData}>
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertyContext() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
}