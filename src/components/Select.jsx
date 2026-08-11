import React from 'react';

export default function Select({ value, onChange, options, placeholder = 'เลือก...', id, label, fullWidth = false, disabled = false }) {
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: fullWidth ? '100%' : 'auto',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--ink)',
  };

  const selectStyle = {
    backgroundColor: 'var(--canvas-light)',
    border: '1px solid var(--hairline-on-light)',
    borderRadius: 'var(--rounded-md)',
    padding: '10px 32px 10px 16px',
    height: '40px',
    fontSize: '14px',
    fontFamily: 'var(--font-family)',
    color: value ? 'var(--ink)' : 'var(--muted)',
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23707a8a' d='M6 8.5L1 3.5h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    transition: 'box-shadow 0.2s',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <div style={containerStyle}>
      {label && <label htmlFor={id} style={labelStyle}>{label}</label>}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={selectStyle}
        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--info-ring)'}
        onBlur={(e) => e.target.style.boxShadow = 'none'}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
