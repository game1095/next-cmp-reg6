import React, { useState, useRef, useEffect } from 'react';

export default function PremiumSelect({ options, value, onChange, placeholder, style, disabled, compact = false, menuPosition = 'bottom' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', ...style }}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{
          height: compact ? '36px' : '40px',
          padding: compact ? '0 28px 0 12px' : '0 32px 0 16px',
          backgroundColor: disabled ? '#fafafa' : (isOpen ? '#f5f5f5' : '#ffffff'),
          border: isOpen ? '1px solid #FCD535' : '1px solid #eaecef',
          borderRadius: '6px',
          color: selectedOption ? '#181a20' : '#707a8a',
          fontSize: compact ? '13px' : '14px',
          fontWeight: selectedOption ? 600 : 500,
          fontFamily: 'var(--font-family)',
          display: 'flex',
          alignItems: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          userSelect: 'none',
          boxShadow: isOpen ? '0 0 0 2px rgba(252, 213, 53, 0.2)' : 'none'
        }}
        onMouseOver={(e) => { if (!disabled && !isOpen) e.currentTarget.style.backgroundColor = '#f5f5f5'; }}
        onMouseOut={(e) => { if (!disabled && !isOpen) e.currentTarget.style.backgroundColor = '#ffffff'; }}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <i 
          className="fa-solid fa-chevron-down"
          style={{ 
            position: 'absolute', 
            right: compact ? '12px' : '16px', 
            top: '50%', 
            transform: `translateY(-50%) rotate(${isOpen ? '180deg' : '0'})`, 
            transition: 'transform 0.2s ease',
            color: '#707a8a',
            fontSize: '12px'
          }}
        ></i>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          ...(menuPosition === 'top' ? { bottom: 'calc(100% + 4px)' } : { top: 'calc(100% + 4px)' }),
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          border: '1px solid #eaecef',
          borderRadius: '8px',
          boxShadow: menuPosition === 'top' ? '0 -12px 32px rgba(0, 0, 0, 0.08)' : '0 12px 32px rgba(0, 0, 0, 0.08)',
          zIndex: 9999, // ensures it floats above tables
          maxHeight: '240px',
          overflowY: 'auto',
          padding: '6px',
          animation: 'cardEntrance 0.2s ease-out forwards'
        }}>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                padding: compact ? '8px 12px' : '10px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: compact ? '13px' : '14px',
                color: value === opt.value ? '#181a20' : '#474d57',
                backgroundColor: value === opt.value ? 'rgba(252, 213, 53, 0.15)' : 'transparent',
                transition: 'all 0.15s ease',
                fontWeight: value === opt.value ? 600 : 500,
                fontFamily: 'var(--font-family)',
              }}
              onMouseOver={(e) => { if (value !== opt.value) e.currentTarget.style.backgroundColor = '#fafafa'; }}
              onMouseOut={(e) => { if (value !== opt.value) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
