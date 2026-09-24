import re

content = """import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './BidderDashboard.css';

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Settings State
  const [settings, setSettings] = useState({
    language: 'English (India)',
    currency: 'INR',
    theme: 'light',
    emailNotifications: true,
    smsNotifications: true,
    marketingEmails: false,
  });

  // Load from localStorage on mount (mock persistence)
  useEffect(() => {
    const saved = localStorage.getItem('onbid_user_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    setLoading(true);
    // Simulate API save / Save to localStorage
    setTimeout(() => {
      localStorage.setItem('onbid_user_settings', JSON.stringify(settings));
      setLoading(false);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  const toggleSwitch = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const Switch = ({ isActive, onClick }: { isActive: boolean, onClick: () => void }) => (
    <div 
      onClick={onClick}
      style={{
        width: '40px', height: '22px', 
        background: isActive ? '#4b2ab5' : '#ccc', 
        borderRadius: '11px', position: 'relative',
        cursor: 'pointer', transition: 'background 0.3s'
      }}
    >
      <div style={{
        width: '18px', height: '18px', background: 'white', borderRadius: '50%', 
        position: 'absolute', top: '2px', left: isActive ? '20px' : '2px',
        transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }}></div>
    </div>
  );

  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>Settings</h1>
            <p>Customise your experience.</p>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '40px'}}>
          <div style={{width: '250px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{padding: '12px 15px', background: '#e0e0e0', borderRadius: '8px', fontWeight: 600, fontSize: '14px'}}>⚙ General</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🔔 Notifications</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🔒 Privacy</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🛡️ Security</div>
            </div>
          </div>
          
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '30px'}}>
            <div className="bidder-section" style={{margin: 0}}>
              <h3 style={{marginTop: 0, marginBottom: '25px', fontSize: '16px'}}>General Settings</h3>
              
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Language</label>
                <select 
                  className="b-btn" 
                  style={{width: '100%', maxWidth: '400px', padding: '10px 15px', background: '#fafafa'}}
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                >
                  <option value="English (India)">English (India)</option>
                  <option value="English (US)">English (US)</option>
                  <option value="Hindi">Hindi (हिंदी)</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                </select>
              </div>
              
              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Currency</label>
                <select 
                  className="b-btn" 
                  style={{width: '100%', maxWidth: '400px', padding: '10px 15px', background: '#fafafa'}}
                  value={settings.currency}
                  onChange={(e) => setSettings({...settings, currency: e.target.value})}
                >
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                </select>
              </div>
              
              <div style={{marginBottom: '30px'}}>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Theme</label>
                <div style={{display: 'flex', gap: '10px'}}>
                  <button 
                    className={settings.theme === 'light' ? "b-btn b-btn-primary" : "b-btn"} 
                    style={{padding: '8px 20px', borderRadius: '20px', background: settings.theme === 'light' ? '#4b2ab5' : 'transparent'}}
                    onClick={() => setSettings({...settings, theme: 'light'})}
                  >Light</button>
                  <button 
                    className={settings.theme === 'dark' ? "b-btn b-btn-primary" : "b-btn"} 
                    style={{padding: '8px 20px', borderRadius: '20px', background: settings.theme === 'dark' ? '#4b2ab5' : 'transparent'}}
                    onClick={() => setSettings({...settings, theme: 'dark'})}
                  >Dark</button>
                </div>
              </div>
              
              <h3 style={{marginTop: '40px', marginBottom: '25px', fontSize: '16px', borderTop: '1px solid #f0ebf5', paddingTop: '30px'}}>Notifications</h3>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0ebf5'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>Email Notifications</div>
                  <div style={{fontSize: '12px', color: '#888'}}>Receive updates about your bids and orders</div>
                </div>
                <Switch isActive={settings.emailNotifications} onClick={() => toggleSwitch('emailNotifications')} />
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0ebf5'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>SMS Notifications</div>
                  <div style={{fontSize: '12px', color: '#888'}}>Important alerts via SMS</div>
                </div>
                <Switch isActive={settings.smsNotifications} onClick={() => toggleSwitch('smsNotifications')} />
              </div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', marginBottom: '20px'}}>
                <div>
                  <div style={{fontWeight: 600, fontSize: '14px', color: '#1a1025'}}>Marketing Emails</div>
                  <div style={{fontSize: '12px', color: '#888'}}>Receive news and offers</div>
                </div>
                <Switch isActive={settings.marketingEmails} onClick={() => toggleSwitch('marketingEmails')} />
              </div>

              {message && <div style={{color: 'green', marginBottom: '15px', fontWeight: 500}}>{message}</div>}

              <button 
                className="b-btn b-btn-primary" 
                onClick={handleSave} 
                disabled={loading}
              >
                {loading ? 'Saving Settings...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
"""

with open('apps/web/src/pages/dashboard/bidder/Settings.tsx', 'w') as f:
    f.write(content)

