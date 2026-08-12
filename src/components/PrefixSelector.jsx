import React, { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import PremiumSelect from './PremiumSelect';

let cachedPrefixes = null;
let fetchPromise = null;

export default function PrefixSelector({ value, onChange, compact = false, menuPosition = 'bottom' }) {
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

  if (loading) {
    return (
      <PremiumSelect
        options={[{ label: 'กำลังโหลด...', value: '' }]}
        value=""
        onChange={() => {}}
        disabled={true}
        compact={compact}
        menuPosition={menuPosition}
      />
    );
  }

  const options = [
    { label: 'ไม่ระบุ', value: '' },
    ...prefixes.map(p => ({ label: p.prefix_text, value: p.prefix_text }))
  ];

  return (
    <PremiumSelect
      options={options}
      value={value || ''}
      onChange={onChange}
      placeholder="ไม่ระบุ"
      compact={compact}
      menuPosition={menuPosition}
    />
  );
}
