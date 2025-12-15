// src/components/PrivacyConsent.jsx
import { useState, useEffect } from 'react';
import { Shield, X, Settings } from 'lucide-react';
import { setAnalyticsConsent, getAnalyticsConsent } from '../lib/analytics';

export default function PrivacyConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah memilih
    const hasConsent = getAnalyticsConsent();
    const hasMadeChoice = localStorage.getItem('analytics_choice_made');
    
    if (!hasMadeChoice) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setAnalyticsConsent(true);
    localStorage.setItem('analytics_choice_made', 'true');
    setShowBanner(false);
  };

  const handleReject = () => {
    setAnalyticsConsent(false);
    localStorage.setItem('analytics_choice_made', 'true');
    setShowBanner(false);
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  if (!showBanner && !showSettings) return null;

  return (
    <>
      {/* Consent Banner */}
      {showBanner && (
        <div className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-md z-50 animate-in slide-in-from-bottom-4">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  Privacy First
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  We use anonymous analytics to improve LogShield. No personal data is collected. Everything happens in your browser.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">No tracking across sites</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">No personal data collection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">All data anonymized</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowBanner(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleAccept}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Accept Anonymous Analytics
              </button>
              
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Reject Analytics
              </button>
              
              <button
                onClick={handleSettings}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Privacy Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Anonymous usage statistics help us improve the tool. We never collect:
                  </p>
                  
                  <ul className="space-y-2 text-sm text-gray-700 mb-4">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                      Personal information
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                      File contents or names
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                      IP addresses
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400"></div>
                      Cross-site tracking data
                    </li>
                  </ul>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Anonymous Analytics</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={getAnalyticsConsent()}
                        onChange={(e) => setAnalyticsConsent(e.target.checked)}
                        className="sr-only"
                        id="analytics-toggle"
                      />
                      <label
                        htmlFor="analytics-toggle"
                        className={`block w-12 h-6 rounded-full cursor-pointer transition-colors ${
                          getAnalyticsConsent() ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`block w-5 h-5 mt-0.5 ml-0.5 rounded-full bg-white transition-transform ${
                          getAnalyticsConsent() ? 'translate-x-6' : ''
                        }`}></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-semibold text-gray-900 mb-2">Your Privacy Rights</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    You can always:
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                      }}
                      className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Clear all local data
                    </button>
                    
                    <button
                      onClick={() => {
                        setAnalyticsConsent(false);
                        localStorage.setItem('analytics_choice_made', 'true');
                        setShowSettings(false);
                      }}
                      className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      Opt out of all analytics
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}