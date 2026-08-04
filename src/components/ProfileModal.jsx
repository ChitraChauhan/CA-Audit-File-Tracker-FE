import React, { useState, useEffect } from 'react';

export default function ProfileModal({ isOpen, user, onClose, onSave }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    } else {
      setFormData({ name: '', email: '' });
    }
    setErrors({});
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: false }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = true;
    if (!formData.email.trim() || !/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      newErrors.email = true;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ name: formData.name.trim(), email: formData.email.trim() });
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal modal-medium">
        <div className="modal-header">
          <h3>Profile</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} id="profileForm">
            <div className="form-grid two">
              <div className={`field ${errors.name ? 'invalid' : ''}`}>
                <label>Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                />
                <div className="error-text">Name is required</div>
              </div>
              <div className={`field ${errors.email ? 'invalid' : ''}`}>
                <label>Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                />
                <div className="error-text">Enter a valid email</div>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSubmit}>
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}
