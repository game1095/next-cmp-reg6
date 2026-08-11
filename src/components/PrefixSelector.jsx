import React, { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabase';

let cachedPrefixes = null;
let fetchPromise = null;

export default function PrefixSelector({ value, onChange, compact = false }) {
  const [prefixes, setPrefixes] = useState(cachedPrefixes || []);
  const [loading, setLoading] = useState(!cachedPrefixes);

  useEffect(() => {
    if (cachedPrefixes) return;

    const loadData = async () => {
      if (!fetchPromise) {
        fetchPromise = supabase
          .from(TABLES.TITLE_PREFIXES)
          .select('*')
          .order('prefix_text');
      }
      
      const { data, error } = await fetchPromise;
      if (!error && data) {
        cachedPrefixes = data;
        setPrefixes(data);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  const selectStyle = {
    backgroundColor: 'var(--canvas-light)',
    border: '1px solid var(--hairline-on-light)',
    borderRadius: 'var(--rounded-md)',
    padding: compact ? '4px 24px 4px 8px' : '10px 32px 10px 16px',
    height: compact ? '32px' : '40px',
    fontSize: compact ? '13px' : '14px',
    fontFamily: 'var(--font-family)',
    color: value ? 'var(--ink)' : 'var(--muted)',
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23707a8a' d='M6 8.5L1 3.5h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
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
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      style={selectStyle}
      onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px var(--info-ring)'}
      onBlur={(e) => e.target.style.boxShadow = 'none'}
    >
      <option value="">ไม่ระบุ</option>
      {prefixes.map((p) => (
        <option key={p.id} value={p.prefix_text}>
          {p.prefix_text}
        </option>
      ))}
    </select>
  );
}
