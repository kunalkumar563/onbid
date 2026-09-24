import re

with open('apps/web/src/pages/dashboard/bidder/MyAccount.tsx', 'r') as f:
    content = f.read()

new_content = """import { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api/client';
import './BidderDashboard.css';

export default function MyAccount() {
  const { user, refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: 'Jaipur, Rajasthan, India'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        address: 'Jaipur, Rajasthan, India'
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.post('/auth/me', {
        fullName: formData.fullName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        // address: formData.address // Mocked for now
      });
      await refreshUser();
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>My Account</h1>
            <p>Manage your profile and personal information.</p>
          </div>
        </div>
        
        <div style={{display: 'flex', gap: '40px'}}>
          <div style={{width: '250px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div style={{padding: '12px 15px', background: '#4b2ab5', color: 'white', borderRadius: '8px', fontWeight: 600, fontSize: '14px'}}>👤 Profile</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>🔔 Notifications</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>💳 Payment Methods</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>📍 Addresses</div>
              <div style={{padding: '12px 15px', color: '#666', borderRadius: '8px', fontWeight: 500, fontSize: '14px', cursor: 'pointer'}}>⚙️ Preferences</div>
            </div>
          </div>
          
          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '30px'}}>
            <div className="bidder-section" style={{margin: 0}}>
              <h3 style={{marginTop: 0, marginBottom: '25px', fontSize: '16px'}}>Profile Information</h3>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px'}}>
                <div style={{width: '60px', height: '60px', borderRadius: '50%', background: '#4b2ab5', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px'}}>
                  {user?.fullName?.substring(0, 2).toUpperCase() || 'U'}
                </div>
                <button className="b-btn">Upload Photo</button>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="b-btn" style={{width: '100%', cursor: 'text', background: '#fafafa', textAlign: 'left'}} />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Email Address (Cannot be changed)</label>
                  <input type="email" name="email" value={formData.email} disabled className="b-btn" style={{width: '100%', cursor: 'not-allowed', background: '#eee', textAlign: 'left'}} />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="b-btn" style={{width: '100%', cursor: 'text', background: '#fafafa', textAlign: 'left'}} />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '12px', fontWeight: 600, color: '#444', marginBottom: '8px'}}>Date of Birth</label>
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="b-btn" style={{width: '100%', cursor: 'text', background: '#fafafa', textAlign: 'left'}} />
                </div>
              </div>
              
              {message && <div style={{color: message.includes('Failed') ? 'red' : 'green', marginBottom: '15px', fontWeight: 500}}>{message}</div>}

              <button 
                className="b-btn b-btn-primary" 
                onClick={handleSaveProfile} 
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
            
            <div className="bidder-section" style={{margin: 0}}>
              <h3 style={{marginTop: 0, marginBottom: '25px', fontSize: '16px'}}>Saved Addresses</h3>
              <div style={{border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{flex: 1, marginRight: '20px'}}>
                  <div style={{fontWeight: 600, fontSize: '14px', marginBottom: '5px'}}>Home</div>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} style={{fontSize: '13px', color: '#666', border: 'none', background: 'transparent', width: '100%', outline: 'none', padding: '5px 0'}} />
                </div>
                <button className="b-btn-link">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
"""

with open('apps/web/src/pages/dashboard/bidder/MyAccount.tsx', 'w') as f:
    f.write(new_content)

