import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/auth';

export default function RoleSwitcher() {
  const { role, switchRole, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  const roles: UserRole[] = ["bidder", "seller", "verifier", "auctioneer", "admin"];

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      fontFamily: 'Inter, sans-serif'
    }}>
      {isOpen && (
        <div style={{
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: '10px',
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#666', padding: '5px 10px', textTransform: 'uppercase' }}>Switch Role</div>
          {roles.map(r => (
            <button
              key={r}
              onClick={() => { switchRole(r); setIsOpen(false); }}
              style={{
                padding: '8px 15px',
                background: role === r ? '#4b2ab5' : 'transparent',
                color: role === r ? 'white' : '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: role === r ? 600 : 400,
                textTransform: 'capitalize'
              }}
            >
              {r}
            </button>
          ))}
        </div>
      )}
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: '#4b2ab5',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 20px',
          boxShadow: '0 4px 12px rgba(75, 42, 181, 0.4)',
          cursor: 'pointer',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span>🛠️ Test Mode: <span style={{textTransform: 'capitalize'}}>{role}</span></span>
      </button>
    </div>
  );
}
