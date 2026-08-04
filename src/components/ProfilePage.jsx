import React, { useState, useEffect } from 'react';

export default function ProfilePage({ user, onSave, onBack }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = true;
    if (!formData.email.trim() || !/^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(formData.email.trim())) {
      nextErrors.email = true;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    await onSave({ name: formData.name.trim(), email: formData.email.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="profile-page panel">
      <div className="panel-head">
        <div>
          <h2>Profile</h2>
          <p className="panel-subtitle">Update your account details and sign-in profile.</p>
        </div>
        <button className="btn btn-ghost btn-sm" type="button" onClick={onBack}>
          ← Back to Dashboard
        </button>
      </div>
      <div className="panel-body">
        <form className="form-grid two" onSubmit={handleSubmit} noValidate>
          <div className={`field ${errors.name ? 'invalid' : ''}`}>
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
            {errors.name && <div className="error-text">Name is required.</div>}
          </div>
          <div className={`field ${errors.email ? 'invalid' : ''}`}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
            />
            {errors.email && <div className="error-text">Enter a valid email address.</div>}
          </div>
          <div className="form-actions" style={{ gridColumn: '1 / -1' }}>
            <button type="submit" className="btn btn-primary">
              Save profile
            </button>
            {saved && <span className="success-text">Profile saved.</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
