import React, { useState, useEffect, useCallback } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import Button from '../components/Button';
import PrefixSelector from '../components/PrefixSelector';
import SignatoryPicker from '../components/SignatoryPicker';
import PrintPreview from '../components/PrintPreview';

export default function Customers({ session }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Selection state
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Prefix state per customer: { [customerId]: prefixText }
  const [prefixes, setPrefixes] = useState({});

  // Batch prefix
  const [batchPrefix, setBatchPrefix] = useState('');

  // Signatory for printing
  const [selectedSignatoryId, setSelectedSignatoryId] = useState('');
  const [signatories, setSignatories] = useState([]);

  // Print state
  const [printData, setPrintData] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const email = session?.user?.email || '';
  const postCode = session?.user?.user_metadata?.post_code || email.split('@')[0] || '';
  const postName = session?.user?.user_metadata?.post_name || '';

  useEffect(() => {
    fetchCustomers();
    fetchSignatories();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(TABLES.CUSTOMERS)
      .select('*')
      .order('customer_name');

    if (error) {
      setError(error.message);
    } else {
      setCustomers(data || []);
    }
    setLoading(false);
  };

  const fetchSignatories = async () => {
    const { data } = await supabase
      .from(TABLES.SIGNATORIES)
      .select('*')
      .order('name');
    if (data) {
      setSignatories(data);
      if (data.length > 0) {
        const defaultId = localStorage.getItem('default_signatory_id');
        const hasDefault = data.find(s => s.id === defaultId);
        setSelectedSignatoryId(hasDefault ? defaultId : data[0].id);
      }
    }
  };

  // Filter customers by search term
  const filteredCustomers = customers.filter((c) =>
    c.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination computed values
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredCustomers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCustomers.map((c) => c.id)));
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const clearSelection = () => setSelectedIds(new Set());

  // Prefix handlers
  const handlePrefixChange = (customerId, prefix) => {
    setPrefixes((prev) => ({ ...prev, [customerId]: prefix }));
  };

  const applyBatchPrefix = () => {
    if (!batchPrefix) return;
    const next = { ...prefixes };
    selectedIds.forEach((id) => {
      next[id] = batchPrefix;
    });
    setPrefixes(next);
  };

  // Print handler
  const handlePrint = () => {
    const selectedCustomers = filteredCustomers
      .map((c, index) => ({ ...c, sequence: index + 1 }))
      .filter((c) => selectedIds.has(c.id))
      .map((c) => ({
        ...c,
        prefix: prefixes[c.id] || '',
      }));

    const signatory = signatories.find((s) => s.id === selectedSignatoryId) || null;
    setPrintData({ customers: selectedCustomers, signatory });

    // Give React a tick to render the PrintPreview, then print
    setTimeout(() => window.print(), 200);
  };

  const allSelected = filteredCustomers.length > 0 && selectedIds.size === filteredCustomers.length;
  const hasSelection = selectedIds.size > 0;

  return (
    <div>
      <div className="no-print" style={{ paddingBottom: hasSelection ? '100px' : '24px' }}>
        {/* ── Page Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-lg)',
          flexWrap: 'wrap',
          gap: 'var(--spacing-sm)',
        }}>
          <div>
            <h1 className="text-title-lg" style={{ marginBottom: '4px' }}>ข้อมูลลูกค้า</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              {postName && (
                <span style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--on-primary)',
                  backgroundColor: 'var(--primary)',
                  padding: '2px 10px',
                  borderRadius: 'var(--rounded-pill)',
                }}>
                  {postName}
                </span>
              )}
              {postCode && (
                <span className="text-caption text-muted">รหัส {postCode}</span>
              )}
              <span className="text-caption text-muted">
                · {customers.length} รายการ
              </span>
            </div>
          </div>
        </div>

        {/* ── Search Bar ── */}
            <div style={{ marginBottom: 'var(--spacing-md)', maxWidth: '400px' }}>
              <div style={{ position: 'relative' }}>
                <span style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--muted)', fontSize: '14px', pointerEvents: 'none',
            }}>🔍</span>
            <input
              type="text"
              placeholder="ค้นหาชื่อลูกค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: '40px',
                padding: '0 12px 0 36px',
                border: '1px solid var(--hairline-on-light)',
                borderRadius: 'var(--rounded-lg)',
                fontSize: '14px',
                fontFamily: 'var(--font-family)',
                color: 'var(--ink)',
                outline: 'none',
                transition: 'box-shadow 0.15s, border-color 0.15s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--info)';
                e.target.style.boxShadow = '0 0 0 3px var(--info-ring)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--hairline-on-light)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            color: 'var(--trading-down)',
            backgroundColor: 'rgba(246, 70, 93, 0.1)',
            padding: '12px',
            borderRadius: 'var(--rounded-sm)',
            fontSize: '14px',
            marginBottom: 'var(--spacing-md)',
          }}>
            {error}
          </div>
        )}

        {/* ── Data Table ── */}
        <div style={{
          border: '1px solid var(--hairline-on-light)',
          borderRadius: 'var(--rounded-xl)',
          overflow: 'hidden',
          backgroundColor: 'var(--canvas-light)',
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '48px 48px 1fr 200px',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: 'var(--surface-soft-light)',
            borderBottom: '1px solid var(--hairline-on-light)',
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
            </div>
            <div>#</div>
            <div>ชื่อลูกค้า</div>
            <div>คำนำหน้า</div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>
              กำลังโหลดข้อมูล...
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredCustomers.length === 0 && (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>
              {searchTerm ? 'ไม่พบข้อมูลที่ค้นหา' : 'ยังไม่มีข้อมูลลูกค้า'}
            </div>
          )}

          {/* Rows — clickable to toggle */}
          {paginatedCustomers.map((customer, index) => {
            const globalIndex = startIndex + index;
            const isSelected = selectedIds.has(customer.id);
            const prefix = prefixes[customer.id] || '';
            return (
              <div
                key={customer.id}
                onClick={() => toggleSelect(customer.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 48px 1fr 200px',
                  alignItems: 'center',
                  padding: '10px 16px',
                  borderBottom: index < paginatedCustomers.length - 1 ? '1px solid var(--hairline-on-light)' : 'none',
                  backgroundColor: isSelected ? 'rgba(252, 213, 53, 0.08)' : 'transparent',
                  transition: 'background-color 0.1s',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                onMouseOver={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--surface-soft-light)';
                }}
                onMouseOut={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                    style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--primary)', pointerEvents: 'none' }}
                  />
                </div>
                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{globalIndex + 1}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--ink)', fontWeight: 400 }}>
                    {customer.customer_name}
                  </span>
                  {prefix && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--info)',
                      backgroundColor: 'rgba(59, 130, 246, 0.08)',
                      padding: '1px 6px',
                      borderRadius: 'var(--rounded-pill)',
                    }}>
                      {prefix}
                    </span>
                  )}
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <PrefixSelector
                    value={prefix}
                    onChange={(val) => handlePrefixChange(customer.id, val)}
                    compact
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Pagination ── */}
        {filteredCustomers.length > itemsPerPage && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            marginTop: 'var(--spacing-sm)',
          }}>
            <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
              แสดง {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredCustomers.length)} จาก {filteredCustomers.length} รายการ
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 10px', fontSize: '13px', fontFamily: 'var(--font-family)',
                  border: '1px solid var(--hairline-on-light)', borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--canvas-light)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: currentPage === 1 ? 'var(--muted)' : 'var(--ink)', opacity: currentPage === 1 ? 0.4 : 1,
                }}
              >«</button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 10px', fontSize: '13px', fontFamily: 'var(--font-family)',
                  border: '1px solid var(--hairline-on-light)', borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--canvas-light)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: currentPage === 1 ? 'var(--muted)' : 'var(--ink)', opacity: currentPage === 1 ? 0.4 : 1,
                }}
              >‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce((acc, p, i, arr) => {
                  if (i > 0 && p - arr[i - 1] > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`dots-${i}`} style={{ padding: '6px 4px', fontSize: '13px', color: 'var(--muted)' }}>…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      style={{
                        padding: '6px 12px', fontSize: '13px', fontWeight: p === currentPage ? 700 : 400,
                        fontFamily: 'var(--font-family)',
                        border: p === currentPage ? '1px solid var(--primary)' : '1px solid var(--hairline-on-light)',
                        borderRadius: 'var(--rounded-md)',
                        backgroundColor: p === currentPage ? 'var(--primary)' : 'var(--canvas-light)',
                        color: p === currentPage ? 'var(--on-primary)' : 'var(--ink)',
                        cursor: 'pointer', transition: 'all 0.15s',
                      }}
                    >{p}</button>
                  )
                )}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '6px 10px', fontSize: '13px', fontFamily: 'var(--font-family)',
                  border: '1px solid var(--hairline-on-light)', borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--canvas-light)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  color: currentPage === totalPages ? 'var(--muted)' : 'var(--ink)', opacity: currentPage === totalPages ? 0.4 : 1,
                }}
              >›</button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '6px 10px', fontSize: '13px', fontFamily: 'var(--font-family)',
                  border: '1px solid var(--hairline-on-light)', borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--canvas-light)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  color: currentPage === totalPages ? 'var(--muted)' : 'var(--ink)', opacity: currentPage === totalPages ? 0.4 : 1,
                }}
              >»</button>
            </div>
          </div>
        )}

        {/* ── Sticky Action Bar ── */}
        {hasSelection && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--canvas-light)',
            borderTop: '1px solid var(--hairline-on-light)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
            padding: '12px 24px',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            flexWrap: 'wrap',
          }}>
            {/* Selection info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '140px' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: 'var(--primary)', color: 'var(--on-primary)',
                fontSize: '13px', fontWeight: 700,
              }}>
                {selectedIds.size}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: 500 }}>
                รายการที่เลือก
              </span>
              <button
                onClick={clearSelection}
                style={{
                  fontSize: '12px', color: 'var(--muted)', background: 'none',
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--font-family)',
                  textDecoration: 'underline',
                }}
              >
                ยกเลิก
              </button>
            </div>

            <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--hairline-on-light)' }} />

            {/* Batch prefix */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500, whiteSpace: 'nowrap' }}>คำนำหน้า:</span>
              <div style={{ width: '160px' }}>
                <PrefixSelector
                  value={batchPrefix}
                  onChange={setBatchPrefix}
                  compact
                />
              </div>
              <button
                onClick={applyBatchPrefix}
                disabled={!batchPrefix}
                style={{
                  height: '32px', padding: '0 12px', fontSize: '12px', fontWeight: 600,
                  fontFamily: 'var(--font-family)',
                  border: '1px solid var(--hairline-on-light)',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--canvas-light)',
                  color: !batchPrefix ? 'var(--muted)' : 'var(--ink)',
                  cursor: !batchPrefix ? 'not-allowed' : 'pointer',
                  opacity: !batchPrefix ? 0.5 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                ตั้งทั้งหมด
              </button>
              <button
                onClick={() => {
                  const next = { ...prefixes };
                  selectedIds.forEach((id) => { next[id] = ''; });
                  setPrefixes(next);
                }}
                style={{
                  height: '32px', padding: '0 12px', fontSize: '12px', fontWeight: 600,
                  fontFamily: 'var(--font-family)',
                  border: '1px solid var(--hairline-on-light)',
                  borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--canvas-light)',
                  color: 'var(--trading-down)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                ไม่มีคำนำหน้า
              </button>
            </div>

            <div style={{ width: '1px', height: '28px', backgroundColor: 'var(--hairline-on-light)' }} />

            {/* Signatory + Print */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
              <div style={{ width: '220px' }}>
                <select
                  value={selectedSignatoryId}
                  onChange={(e) => setSelectedSignatoryId(e.target.value)}
                  style={{
                    width: '100%', height: '36px',
                    padding: '0 28px 0 12px',
                    border: '1px solid var(--hairline-on-light)',
                    borderRadius: 'var(--rounded-md)',
                    fontSize: '13px', fontFamily: 'var(--font-family)',
                    color: selectedSignatoryId ? 'var(--ink)' : 'var(--muted)',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23707a8a' d='M6 8.5L1 3.5h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 8px center',
                    outline: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="">— เลือกผู้ลงนาม —</option>
                  {signatories.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <Button
                onClick={handlePrint}
                disabled={!selectedSignatoryId}
              >
                🖨️ พิมพ์ ({selectedIds.size})
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Print Preview (hidden, shown only during print) ── */}
      {printData && (
        <PrintPreview
          customers={printData.customers}
          signatory={printData.signatory}
          postCode={postCode}
          postName={postName}
        />
      )}
    </div>
  );
}
