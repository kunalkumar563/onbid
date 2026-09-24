import re

content = """import { useState, useRef } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import './BidderDashboard.css';

export default function KYC() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'pending' | 'verified'>('pending');

  const [formData, setFormData] = useState({
    panNumber: '',
    aadhaarNumber: '',
  });

  const [panFile, setPanFile] = useState<File | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);

  const panInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'pan' | 'aadhaar') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'pan') setPanFile(e.target.files[0]);
      if (type === 'aadhaar') setAadhaarFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call for KYC upload
    setTimeout(() => {
      setLoading(false);
      setStatus('verified');
      setStep(3);
    }, 2500);
  };

  return (
    <DashboardLayout role="bidder">
      <div className="bidder-page">
        <div className="bidder-header-row">
          <div>
            <h1>KYC Verification</h1>
            <p>Verify your identity to unlock live bidding and selling.</p>
          </div>
        </div>

        <div className="bidder-section" style={{ maxWidth: '700px', padding: '40px' }}>
          {status === 'verified' ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>✅</div>
              <h2 style={{ color: '#2e7d32', marginBottom: '10px' }}>Verification Successful!</h2>
              <p style={{ color: '#666', fontSize: '15px' }}>
                Your PAN and Aadhaar documents have been successfully verified. 
                You can now participate in live premium auctions.
              </p>
              <button 
                className="b-btn b-btn-primary" 
                style={{ marginTop: '30px' }}
                onClick={() => window.location.href = '/dashboard/bidder/auctions'}
              >
                Go to Live Auctions
              </button>
            </div>
          ) : (
            <>
              {/* Stepper */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', background: '#eee', zIndex: 0 }} />
                
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= 1 ? '#1f1525' : '#eee', color: step >= 1 ? 'white' : '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                  <div style={{ fontSize: '12px', marginTop: '8px', color: step >= 1 ? '#1f1525' : '#999', fontWeight: 500 }}>Personal Info</div>
                </div>
                
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step >= 2 ? '#1f1525' : '#eee', color: step >= 2 ? 'white' : '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                  <div style={{ fontSize: '12px', marginTop: '8px', color: step >= 2 ? '#1f1525' : '#999', fontWeight: 500 }}>Document Upload</div>
                </div>
              </div>

              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#333' }}>PAN Card Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. ABCDE1234F" 
                      style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px' }}
                      value={formData.panNumber}
                      onChange={(e) => setFormData({...formData, panNumber: e.target.value.toUpperCase()})}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#333' }}>Aadhaar Card Number</label>
                    <input 
                      type="text" 
                      placeholder="12-digit Aadhaar Number" 
                      style={{ width: '100%', padding: '12px 15px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '15px' }}
                      value={formData.aadhaarNumber}
                      onChange={(e) => setFormData({...formData, aadhaarNumber: e.target.value})}
                    />
                  </div>
                  <button 
                    className="b-btn b-btn-primary" 
                    style={{ marginTop: '10px' }}
                    onClick={() => setStep(2)}
                    disabled={formData.panNumber.length < 10 || formData.aadhaarNumber.length < 12}
                  >
                    Next Step →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  {/* PAN Upload */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#333' }}>Upload PAN Card (Front)</label>
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      ref={panInputRef} 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleFileChange(e, 'pan')} 
                    />
                    <div 
                      onClick={() => panInputRef.current?.click()}
                      style={{ border: panFile ? '2px solid #4b2ab5' : '2px dashed #ddd', borderRadius: '8px', padding: '30px', textAlign: 'center', background: panFile ? '#f0edfc' : '#fafafa', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      {panFile ? (
                        <>
                          <div style={{ fontSize: '24px', marginBottom: '10px' }}>✅</div>
                          <p style={{ margin: 0, fontSize: '14px', color: '#4b2ab5', fontWeight: 600 }}>{panFile.name}</p>
                          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>Click to change file</p>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '24px', marginBottom: '10px' }}>📄</div>
                          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Click to upload or drag and drop</p>
                          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>JPG, PNG or PDF (Max. 5MB)</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Aadhaar Upload */}
                  <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#333' }}>Upload Aadhaar Card (Front & Back)</label>
                    <input 
                      type="file" 
                      accept="image/*,.pdf" 
                      ref={aadhaarInputRef} 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleFileChange(e, 'aadhaar')} 
                    />
                    <div 
                      onClick={() => aadhaarInputRef.current?.click()}
                      style={{ border: aadhaarFile ? '2px solid #4b2ab5' : '2px dashed #ddd', borderRadius: '8px', padding: '30px', textAlign: 'center', background: aadhaarFile ? '#f0edfc' : '#fafafa', cursor: 'pointer', transition: 'all 0.2s' }}
                    >
                      {aadhaarFile ? (
                        <>
                          <div style={{ fontSize: '24px', marginBottom: '10px' }}>✅</div>
                          <p style={{ margin: 0, fontSize: '14px', color: '#4b2ab5', fontWeight: 600 }}>{aadhaarFile.name}</p>
                          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>Click to change file</p>
                        </>
                      ) : (
                        <>
                          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🖼️</div>
                          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Click to upload or drag and drop</p>
                          <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#999' }}>JPG, PNG or PDF (Max. 5MB)</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <button 
                      className="b-btn" 
                      style={{ flex: 1, background: '#f5f5f5', color: '#333' }}
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </button>
                    <button 
                      className="b-btn b-btn-primary" 
                      style={{ flex: 2 }}
                      onClick={handleSubmit}
                      disabled={loading || !panFile || !aadhaarFile}
                    >
                      {loading ? 'Uploading & Verifying...' : 'Submit for Verification'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
"""

with open('apps/web/src/pages/dashboard/bidder/KYC.tsx', 'w') as f:
    f.write(content)

