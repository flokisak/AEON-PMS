import { useState, useEffect } from 'react';

export interface Property {
  id: string;
  name: string;
  type: 'hotel' | 'resort' | 'motel' | 'hostel' | 'apartment' | 'vacation_rental' | 'service';
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  totalRooms: number;
  currency: string;
  timezone: string;
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

export interface PropertySettings {
  id: string;
  propertyId: string;
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicy: string;
  petPolicy: 'allowed' | 'not_allowed' | 'fee';
  smokingPolicy: 'allowed' | 'not_allowed' | 'designated_areas';
  parkingAvailable: boolean;
  wifiAvailable: boolean;
  breakfastIncluded: boolean;
  gymAvailable: boolean;
  poolAvailable: boolean;
  spaAvailable: boolean;
  restaurantAvailable: boolean;
  roomServiceAvailable: boolean;
  conciergeAvailable: boolean;
  twentyFourHourFrontDesk: boolean;
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentPropertyId, setCurrentPropertyId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load properties from localStorage on mount
  useEffect(() => {
    const loadProperties = () => {
      try {
        const stored = localStorage.getItem('properties');
        const currentId = localStorage.getItem('currentPropertyId');
        
        if (stored) {
          const parsedProperties = JSON.parse(stored);
          setProperties(parsedProperties);
        } else {
          // Initialize with default property
          const defaultProperty: Property = {
            id: 'prop-1',
            name: 'AEON Hotel',
            type: 'hotel',
            address: '123 Main St',
            city: 'Prague',
            country: 'Czech Republic',
            phone: '+420 123 456 789',
            email: 'info@aeonhotel.com',
            website: 'https://aeonhotel.com',
            totalRooms: 100,
            currency: 'CZK',
            timezone: 'Europe/Prague',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setProperties([defaultProperty]);
          localStorage.setItem('properties', JSON.stringify([defaultProperty]));
        }
        
        if (currentId) {
          setCurrentPropertyId(currentId);
        } else if (stored) {
          const parsedProperties = JSON.parse(stored);
          if (parsedProperties.length > 0) {
            setCurrentPropertyId(parsedProperties[0].id);
          }
        } else {
          setCurrentPropertyId('prop-1');
        }
      } catch (err) {
        setError('Failed to load properties');
      } finally {
        setIsLoading(false);
      }
    };

    loadProperties();
  }, []);

  const saveProperties = (updatedProperties: Property[]) => {
    localStorage.setItem('properties', JSON.stringify(updatedProperties));
    setProperties(updatedProperties);
  };

  const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProperty: Property = {
      ...propertyData,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedProperties = [...properties, newProperty];
    saveProperties(updatedProperties);
    return newProperty;
  };

  const updateProperty = (id: string, updates: Partial<Omit<Property, 'id' | 'createdAt'>>) => {
    const updatedProperties = properties.map(prop => 
      prop.id === id 
        ? { ...prop, ...updates, updatedAt: new Date().toISOString() }
        : prop
    );
    saveProperties(updatedProperties);
  };

  const deleteProperty = (id: string) => {
    if (properties.length <= 1) {
      throw new Error('Cannot delete the last property');
    }
    
    const updatedProperties = properties.filter(prop => prop.id !== id);
    saveProperties(updatedProperties);
    
    // If deleting current property, switch to first available
    if (currentPropertyId === id && updatedProperties.length > 0) {
      switchProperty(updatedProperties[0].id);
    }
  };

  const switchProperty = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      setCurrentPropertyId(propertyId);
      localStorage.setItem('currentPropertyId', propertyId);
      
      // Trigger custom event for property change
      window.dispatchEvent(new CustomEvent('propertyChanged', { 
        detail: { propertyId, property } 
      }));
    }
  };

  const getCurrentProperty = (): Property | null => {
    return properties.find(p => p.id === currentPropertyId) || null;
  };

  const getPropertySettings = (propertyId: string): PropertySettings | null => {
    try {
      const stored = localStorage.getItem(`property-settings-${propertyId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const savePropertySettings = (propertyId: string, settings: Omit<PropertySettings, 'id' | 'propertyId'>) => {
    const propertySettings: PropertySettings = {
      id: `settings-${Date.now()}`,
      propertyId,
      ...settings
    };
    localStorage.setItem(`property-settings-${propertyId}`, JSON.stringify(propertySettings));
    return propertySettings;
  };

  return {
    properties,
    currentPropertyId,
    currentProperty: getCurrentProperty(),
    isLoading,
    error,
    addProperty,
    updateProperty,
    deleteProperty,
    switchProperty,
    getPropertySettings,
    savePropertySettings
  };
}