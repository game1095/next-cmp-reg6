import React, { useEffect, useRef } from 'react';

export default function Modal({ isOpen, onClose, title, children, width = '480px' }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-md)',
        animation: 'fadeIn 0.15s ease-out',
      }}
    >
      <div style={{
        backgroundColor: 'var(--theme-canvas)',
        borderRadius: 'var(--rounded-xl)',
        width: '100%',
        maxWidth: width,
        maxHeight: '90vh',
        overflow: 'auto',
        animation: 'slideUp 0.2s ease-out',
        boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--theme-border)',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: 'var(--theme-ink)' }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--muted)',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--rounded-md)',
              transition: 'all 0.15s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--theme-surface-strong)'; e.currentTarget.style.color = 'var(--theme-ink)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--muted)'; }}
          >
            <i className="fa-solid fa-xmark" style={{ fontSize: '14px' }}></i>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 'var(--spacing-lg)' }}>
          {children}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
