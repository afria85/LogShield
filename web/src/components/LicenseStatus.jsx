// src/components/LicenseStatus.jsx
import React, { useState } from 'react';
import './LicenseStatus.css';

const LicenseStatus = ({ tier, tierName, usage, onUpgrade }) => {
  const [showLicenseInput, setShowLicenseInput] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');

  const handleActivate = () => {
    // Ini akan dipanggil dari App.jsx via prop
    console.log('Activating license:', licenseKey);
    // Panggil fungsi dari parent
    // onActivateLicense(licenseKey);
    setLicenseKey('');
    setShowLicenseInput(false);
  };

  return (
    <div className="license-status">
      <div className="tier-badge">
        <span className={`tier-dot tier-${tier}`}></span>
        <span className="tier-name">{tierName}</span>
      </div>
      
      {usage && (
        <div className="usage-meter">
          <div className="usage-label">
            Scans: {usage.used} / {usage.limit === Infinity ? 'ì' : usage.limit}
          </div>
          {usage.limit !== Infinity && (
            <div className="usage-bar">
              <div 
                className="usage-fill"
                style={{ width: `${(usage.used / usage.limit) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      )}
      
      <div className="license-actions">
        <button 
          onClick={() => setShowLicenseInput(!showLicenseInput)}
          className="btn-license"
        >
          {showLicenseInput ? 'Cancel' : 'Activate License'}
        </button>
        
        {tier === 'free' && (
          <button 
            onClick={() => onUpgrade('starter')}
            className="btn-upgrade"
          >
            Upgrade
          </button>
        )}
      </div>
      
      {showLicenseInput && (
        <div className="license-input-container">
          <input
            type="text"
            value={licenseKey}
            onChange={(e) => setLicenseKey(e.target.value)}
            placeholder="Enter license key (LS-PRO-XXXX-XXXX-XXXX)"
            className="license-input"
          />
          <button onClick={handleActivate} className="btn-activate">
            Activate
          </button>
        </div>
      )}
    </div>
  );
};

export default LicenseStatus;