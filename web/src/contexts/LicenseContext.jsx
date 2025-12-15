// src/contexts/LicenseContext.jsx
import { createContext, useContext } from 'react';
import { licenseManager } from '../lib/license';

const LicenseContext = createContext(null);

export function LicenseProvider({ children }) {
  // licenseManager sudah singleton, jadi cukup expose
  return (
    <LicenseContext.Provider value={licenseManager}>
      {children}
    </LicenseContext.Provider>
  );
}

export function useLicense() {
  const context = useContext(LicenseContext);
  if (!context) {
    throw new Error('useLicense must be used within a LicenseProvider');
  }
  return context;
}