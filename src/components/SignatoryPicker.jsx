import React, { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabase';

export default function SignatoryPicker({ value, onChange }) {
  const [signatories, setSignatories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignatories();
  }, []);

  const fetchSignatories = async () => {
    const { data, error } = await supabase
      .from(TABLES.SIGNATORIES)
      .select('*')
      .order('name');

    if (!error && data) {
      setSignatories(data);
    }
    setLoading(false);
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
    cursor: 'pointer',
    width: '100%',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23707a8a' d='M6 8.5L1 3.5h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    transition: 'box-shadow 0.15s',
  };

  if (loading) {
    return (
      <select disabled style={{ ...selectStyle, opacity: 0.5 }}>
        <option>กำลังโหลด...</option>
      </select>
    );
  }

  return (
    <div>
      <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', display: 'block', marginBottom: '8px' }}>
        เลือกผู้ลงนาม
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        style={selectStyle}
        onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--info-ring)'}
        onBlur={(e) => e.target.style.boxShadow = 'none'}
      >
        <option value="">— เลือกผู้ลงนาม —</option>
        {signatories.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} — {s.position}
          </option>
        ))}
      </select>
    </div>
  );
}
