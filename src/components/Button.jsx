import React from 'react';

export default function Button({ children, type = 'button', onClick, className = '', disabled = false, fullWidth = false }) {
  const baseStyle = {
    backgroundColor: disabled ? 'var(--primary-disabled)' : 'var(--primary)',
    color: disabled ? 'var(--muted)' : 'var(--on-primary)',
    fontFamily: 'var(--font-family)',
    fontSize: '14px',
    fontWeight: '600',
    lineHeight: '1',
    padding: '12px 24px',
    height: '40px',
    borderRadius: 'var(--rounded-md)',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled}
      className={className}
      style={baseStyle}
      onMouseOver={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = 'var(--primary-active)';
      }}
      onMouseOut={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = 'var(--primary)';
      }}
    >
      {children}
    </button>
  );
}
