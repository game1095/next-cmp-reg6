import React from 'react';

export default function Input({ type = 'text', value, onChange, placeholder, required = false, id, label }) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: 'var(--spacing-md)'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--theme-ink)'
  };

  const inputStyle = {
    backgroundColor: 'var(--theme-canvas)',
    border: '1px solid var(--theme-border)',
    borderRadius: 'var(--rounded-md)',
    padding: '10px 16px',
    height: '40px',
    fontSize: '14px',
    fontFamily: 'var(--font-family)',
    color: 'var(--theme-ink)',
    outline: 'none',
    transition: 'all 0.2s',
    width: '100%'
  };

  return (
    <div style={containerStyle}>
      {label && <label htmlFor={id} style={labelStyle}>{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
        onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = '0 0 0 2px rgba(252, 213, 53, 0.2)'; }}
        onBlur={(e) => { e.target.style.borderColor = 'var(--theme-border)'; e.target.style.boxShadow = 'none'; }}
      />
    </div>
  );
}
