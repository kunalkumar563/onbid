import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { listingService } from '../../services/listing';
import './CreateListing.css';

export default function CreateListing() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    location: '',
    startingBid: '',
    bidIncrement: '',
    duration: '',
    startDate: '',
    startTime: '',
    condition: '',
    dimensions: '',
    brand: '',
    weight: '',
    material: '',
    color: '',
    year: '',
    included: '',
    description: '',
    shippingAvailable: true,
    shippingMethod: '',
    shippingCost: '',
    deliveryTime: '',
    returnsAccepted: '',
    authenticConfirm: true
  });
  
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleToggleShipping = () => {
    setFormData(prev => ({ ...prev, shippingAvailable: !prev.shippingAvailable }));
  };

  const handleAddPhoto = () => {
    if (photoInput && photos.length < 10) {
      setPhotos(prev => [...prev, photoInput]);
      setPhotoInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert("Title is required!");
    if (!formData.startingBid) return alert("Starting bid is required!");
    if (photos.length === 0) return alert("At least one photo URL is required!");
    
    setIsSubmitting(true);
    try {
      const listing = await listingService.create({
        title: formData.title,
        category: (formData.category || "home_garden") as any,
        subCategory: formData.subcategory,
        description: formData.description,
        startingPrice: Number(formData.startingBid),
        auctionDuration: Number(formData.duration) || 7,
        photos: photos,
        sellerLocation: formData.location
      });
      navigate(`/listings/${listing.id}`);
    } catch (err) {
      alert("Error creating listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="seller">
      <div className="create-listing-page">
        
        {/* Top Header */}
        <div className="cl-header-row">
          <div>
            <h1>Create New Listing</h1>
            <p>Complete the details below to list your item for auction.</p>
          </div>
          <div className="cl-header-actions">
            <button type="button" className="cl-btn-secondary" onClick={() => navigate('/my-listings')}>Cancel</button>
            <button type="button" className="cl-btn-secondary">Save as Draft</button>
            <button type="button" className="cl-btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit for Verification"}
            </button>
          </div>
        </div>

        {/* Masonry Layout */}
        <div className="cl-masonry-grid">
          
          {/* Left Column */}
          <div className="cl-col-left">
            
            {/* Card 1 */}
            <div className="cl-card">
              <div className="cl-card-header">
                <div className="cl-step-num">1</div>
                <div className="cl-card-title">
                  <h2>Basic Information</h2>
                  <p>Start with the essential details</p>
                </div>
              </div>

              <div className="cl-form-group">
                <div className="cl-form-label"><span>Item Title</span><span className="req">*</span></div>
                <input type="text" name="title" value={formData.title} onChange={handleChange} className="cl-input" placeholder="e.g. Vintage 1960s Murano Glass Chandelier" required />
              </div>

              <div className="cl-form-row">
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>Category</span><span className="req">*</span></div>
                  <select name="category" value={formData.category} onChange={handleChange} className="cl-input" required>
                    <option value="">Select category</option>
                    <option value="home_garden">Home & Garden</option>
                    <option value="art_collectibles">Art & Collectibles</option>
                    <option value="jewelry_watches">Jewelry & Watches</option>
                    <option value="fashion">Fashion</option>
                  </select>
                </div>
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>Subcategory</span></div>
                  <select name="subcategory" value={formData.subcategory} onChange={handleChange} className="cl-input">
                    <option value="">Select subcategory</option>
                    <option value="Lighting">Lighting</option>
                    <option value="Furniture">Furniture</option>
                  </select>
                </div>
              </div>

              <div className="cl-form-group">
                <div className="cl-form-label"><span>Item Location</span><span className="req">*</span></div>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="cl-input" placeholder="e.g. Mumbai, India" required />
              </div>
            </div>

            {/* Card 2 */}
            <div className="cl-card">
              <div className="cl-card-header">
                <div className="cl-step-num">2</div>
                <div className="cl-card-title">
                  <h2>Auction Settings</h2>
                  <p>Set your pricing and schedule</p>
                </div>
              </div>

              <div className="cl-form-row">
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>Starting Bid (₹)</span><span className="req">*</span></div>
                  <input type="number" name="startingBid" value={formData.startingBid} onChange={handleChange} className="cl-input" placeholder="0" required />
                </div>
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>Bid Increment (₹)</span></div>
                  <input type="number" name="bidIncrement" value={formData.bidIncrement} onChange={handleChange} className="cl-input" placeholder="500" />
                </div>
              </div>

              <div className="cl-form-group">
                <div className="cl-form-label"><span>Auction Duration (Days)</span><span className="req">*</span></div>
                <select name="duration" value={formData.duration} onChange={handleChange} className="cl-input" required>
                  <option value="">Select duration</option>
                  <option value="3">3 Days</option>
                  <option value="5">5 Days</option>
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                </select>
              </div>

              <div className="cl-form-row">
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>Start Date</span></div>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="cl-input" />
                </div>
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>Start Time</span></div>
                  <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} className="cl-input" />
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="cl-card">
              <div className="cl-card-header">
                <div className="cl-step-num">3</div>
                <div className="cl-card-title">
                  <h2>Item Details</h2>
                  <p>Provide specific characteristics</p>
                </div>
              </div>

              <div className="cl-form-row">
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>Condition</span><span className="req">*</span></div>
                  <select name="condition" value={formData.condition} onChange={handleChange} className="cl-input" required>
                    <option value="">Select condition</option>
                    <option value="Mint">Mint / Like New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>Dimensions (LxWxH)</span></div>
                  <input type="text" name="dimensions" value={formData.dimensions} onChange={handleChange} className="cl-input" placeholder="e.g. 80x80x120 cm" />
                </div>
              </div>

              <div className="cl-form-row">
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>Brand</span></div>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="cl-input" placeholder="e.g. Baccarat" />
                </div>
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>Weight</span></div>
                  <input type="text" name="weight" value={formData.weight} onChange={handleChange} className="cl-input" placeholder="e.g. 15 kg" />
                </div>
              </div>

              <div className="cl-form-row">
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>Material</span></div>
                  <input type="text" name="material" value={formData.material} onChange={handleChange} className="cl-input" placeholder="e.g. Crystal, Brass" />
                </div>
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>Color</span></div>
                  <input type="text" name="color" value={formData.color} onChange={handleChange} className="cl-input" placeholder="e.g. Clear, Gold" />
                </div>
              </div>

              <div className="cl-form-row">
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>Year (if known)</span></div>
                  <input type="text" name="year" value={formData.year} onChange={handleChange} className="cl-input" placeholder="e.g. 1980" />
                </div>
                <div className="cl-form-group">
                  <div className="cl-form-label"><span>What's Included</span></div>
                  <input type="text" name="included" value={formData.included} onChange={handleChange} className="cl-input" placeholder="e.g. Chandelier, mounting kit" />
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="cl-card">
              <div className="cl-card-header">
                <div className="cl-step-num">4</div>
                <div className="cl-card-title">
                  <h2>Description</h2>
                  <p>Share the story behind your item</p>
                </div>
              </div>

              <div className="cl-form-group">
                <textarea 
                  name="description"
                  className="cl-input cl-textarea" 
                  style={{minHeight: '200px'}}
                  placeholder="Describe the item's condition, history, unique features..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="cl-col-right">
            
            {/* Card 5 */}
            <div className="cl-card">
              <div className="cl-card-header">
                <div className="cl-step-num">5</div>
                <div className="cl-card-title">
                  <h2>Listing Media</h2>
                  <p>Upload high-quality images</p>
                </div>
              </div>

              <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                <input 
                  type="text" 
                  className="cl-input" 
                  placeholder="Paste image URL here..." 
                  value={photoInput} 
                  onChange={e => setPhotoInput(e.target.value)} 
                />
                <button type="button" onClick={handleAddPhoto} className="cl-btn-secondary" style={{padding: '0 15px'}}>Add</button>
              </div>

              <div className="cl-media-grid" style={{flexWrap: 'wrap'}}>
                {photos.map((p, i) => (
                  <div key={i} className="cl-media-box filled">
                    <img src={p} alt={`Upload ${i}`} onError={(e) => { e.currentTarget.src = '/auctions/art/art-01.png'; }} />
                    {i === 0 && <div className="cl-primary-badge">👑 Primary</div>}
                  </div>
                ))}
                {photos.length < 10 && (
                  <div className="cl-media-box">+</div>
                )}
              </div>
            </div>

            {/* Card 6 */}
            <div className="cl-card">
              <div className="cl-card-header">
                <div className="cl-step-num">6</div>
                <div className="cl-card-title">
                  <h2>Shipping & Returns</h2>
                  <p>Provide shipping information</p>
                </div>
              </div>

              <div className="cl-toggle-row">
                <span style={{fontSize: '14px', fontWeight: 600, color: '#333'}}>Shipping available</span>
                <div className={`cl-toggle ${formData.shippingAvailable ? 'active' : ''}`} onClick={handleToggleShipping}></div>
              </div>

              {formData.shippingAvailable && (
                <>
                  <div className="cl-form-row">
                    <div className="cl-form-group">
                      <div className="cl-form-label"><span>Shipping method</span></div>
                      <select name="shippingMethod" value={formData.shippingMethod} onChange={handleChange} className="cl-input">
                        <option value="">Select method</option>
                        <option value="FedEx">FedEx / DHL</option>
                        <option value="Local Courier">Local Courier</option>
                        <option value="Self Pickup">Self Pickup</option>
                      </select>
                    </div>
                    <div className="cl-form-group">
                      <div className="cl-form-label"><span>Shipping cost (₹)</span></div>
                      <input type="number" name="shippingCost" value={formData.shippingCost} onChange={handleChange} className="cl-input" placeholder="0" />
                    </div>
                  </div>

                  <div className="cl-form-row">
                    <div className="cl-form-group">
                      <div className="cl-form-label"><span>Estimated delivery</span></div>
                      <input type="text" name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} className="cl-input" placeholder="e.g. 3-7 business days" />
                    </div>
                    <div className="cl-form-group">
                      <div className="cl-form-label"><span>Returns accepted</span></div>
                      <select name="returnsAccepted" value={formData.returnsAccepted} onChange={handleChange} className="cl-input">
                        <option value="">Select policy</option>
                        <option value="No Returns">No Returns</option>
                        <option value="14 Days">14 Days</option>
                        <option value="30 Days">30 Days</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Card 7 */}
            <div className="cl-card">
              <div className="cl-card-header">
                <div className="cl-step-num">7</div>
                <div className="cl-card-title">
                  <h2>Authentication & Verification</h2>
                  <p>Build trust with buyers</p>
                </div>
              </div>

              <div className="cl-checkbox-row">
                <input type="checkbox" name="authenticConfirm" checked={formData.authenticConfirm} onChange={handleChange} className="cl-checkbox" />
                <span style={{fontSize: '14px', color: '#333'}}>I confirm that this item is authentic and accurately described.</span>
              </div>

              <div className="cl-form-group">
                <div className="cl-form-label" style={{marginBottom: '10px'}}><span>Upload documents (optional)</span></div>
                <div className="cl-doc-upload" onClick={() => alert('File picker mock opened')}>
                  <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                    <span style={{fontSize: '24px', color: '#2c1a4d'}}>↑</span>
                    <span style={{fontSize: '13px', color: '#666'}}>Upload authentication certificates,<br/>receipts or any supporting documents.</span>
                  </div>
                  <button type="button" className="cl-doc-btn">Choose Files</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
