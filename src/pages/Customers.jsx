import React, { useState, useEffect, useCallback } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import { flushSync } from 'react-dom';
import html2pdf from 'html2pdf.js';
import Button from '../components/Button';
import PrefixSelector from '../components/PrefixSelector';
import SignatoryPicker from '../components/SignatoryPicker';
import PrintPreview from '../components/PrintPreview';
import { Toast } from '../lib/toast';

// Utility to extract first character for Avatar
const getInitials = (name) => {
  if (!name) return '?';
  return name.trim().charAt(0);
};

// Utility to get a consistent random color based on string
const getAvatarColor = (name) => {
  if (!name) return { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' };
  
  const colors = [
    { bg: 'rgba(59, 130, 246, 0.15)', color: '#2563eb' }, // Blue
    { bg: 'rgba(16, 185, 129, 0.15)', color: '#059669' }, // Emerald
    { bg: 'rgba(245, 158, 11, 0.15)', color: '#d97706' }, // Amber
    { bg: 'rgba(236, 72, 153, 0.15)', color: '#db2777' }, // Pink
    { bg: 'rgba(139, 92, 246, 0.15)', color: '#7c3aed' }, // Purple
    { bg: 'rgba(20, 184, 166, 0.15)', color: '#0d9488' }, // Teal
    { bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626' }, // Red
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export default function Customers({ session }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPDFs, setIsGeneratingPDFs] = useState(false);
  const [pdfProgress, setPdfProgress] = useState({ current: 0, total: 0 });
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
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const clearSelection = () => {
    setSelectedIds(new Set());
    Toast.fire({
      icon: 'info',
      title: 'ยกเลิกการเลือกทั้งหมดแล้ว'
    });
  };

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
    Toast.fire({
      icon: 'success',
      title: `ตั้งค่าคำนำหน้าเป็น "${batchPrefix}" สำเร็จ`
    });
  };

  // Print handler
  const handlePrint = async () => {
    const selectedCustomers = filteredCustomers
      .map((c, index) => ({ ...c, sequence: index + 1 }))
      .filter((c) => selectedIds.has(c.id))
      .map((c) => ({
        ...c,
        prefix: prefixes[c.id] || '',
      }));

    const signatory = signatories.find((s) => s.id === selectedSignatoryId) || null;
    setPrintData({ customers: selectedCustomers, signatory });

    // Mark as printed in Supabase
    try {
      const ids = selectedCustomers.map(c => c.id);
      await supabase.from(TABLES.CUSTOMERS).update({ is_printed: true, printed_at: new Date() }).in('id', ids);
      
      // Update local state
      setCustomers(prev => prev.map(c => ids.includes(c.id) ? { ...c, is_printed: true } : c));
    } catch (e) {
      console.warn("Could not update print status, column might be missing.", e);
    }

    // Give React a tick to render the PrintPreview, then print
    setTimeout(() => window.print(), 200);
  };

  const handleSavePDFs = async () => {
    if (!hasSelection) return;
    setIsGeneratingPDFs(true);

    try {
      const signatory = signatories.find((s) => s.id === selectedSignatoryId) || null;
      
      const selectedCustomers = filteredCustomers
        .map((c, index) => ({ ...c, sequence: index + 1 }))
        .filter((c) => selectedIds.has(c.id))
        .map((c) => ({
          ...c,
          prefix: prefixes[c.id] || '',
        }));

      setPdfProgress({ current: 0, total: selectedCustomers.length });

      for (let i = 0; i < selectedCustomers.length; i++) {
        const customer = selectedCustomers[i];
        
        // Render exactly one customer in the PrintPreview
        flushSync(() => {
          setPrintData({ customers: [customer], signatory });
        });

        // Small delay to ensure images/fonts are rendered
        await new Promise(resolve => setTimeout(resolve, 300));

        const element = document.querySelector('.print-area');
        if (element) {
          const opt = {
            margin:       0,
            filename:     `${customer.customer_name}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
          };
          
          await html2pdf().set(opt).from(element).save();
        }

        // Update database
        try {
          await supabase.from(TABLES.CUSTOMERS).update({ is_printed: true, printed_at: new Date() }).eq('id', customer.id);
          // Update local state
          setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, is_printed: true } : c));
        } catch (e) {
          // Ignore if column doesn't exist yet
        }

        setPdfProgress({ current: i + 1, total: selectedCustomers.length });
      }

      Toast.fire({
        icon: 'success',
        title: `บันทึกไฟล์ PDF สำเร็จ ${selectedCustomers.length} ไฟล์`
      });

    } catch (err) {
      console.error(err);
      Toast.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาดในการสร้าง PDF'
      });
    } finally {
      setIsGeneratingPDFs(false);
      // Reset print data or prepare for next action
      setPrintData(null);
    }
  };

  const allSelected = filteredCustomers.length > 0 && selectedIds.size === filteredCustomers.length;
  const hasSelection = selectedIds.size > 0;

  return (
    <div>
      <div className="no-print" style={{ paddingBottom: hasSelection ? '160px' : '24px' }}>
        {/* ── Page Header ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-lg)',
          flexWrap: 'wrap',
          gap: 'var(--spacing-sm)',
        }}>
          <div style={{ position: 'relative', animation: 'slideUpFade 0.4s ease-out forwards' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 700, // Matches typography.display-sm weight
              letterSpacing: '-0.5px',
              margin: '0 0 12px 0',
              color: 'var(--theme-ink)', // Solid ink color, no gradients
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <span style={{ 
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '44px', height: '44px', borderRadius: 'var(--rounded-lg)',
                backgroundColor: 'var(--primary)', // Binance Yellow
                color: 'var(--on-primary)', // Black on yellow
                fontSize: '22px',
              }}>
                <span style={{ WebkitTextFillColor: 'initial' }}>👥</span>
              </span>
              ข้อมูลลูกค้า
            </h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative', zIndex: 1, marginLeft: '60px', flexWrap: 'wrap' }}>
              {postName && (
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--on-primary)',
                  backgroundColor: 'var(--primary)',
                  padding: '4px 12px',
                  borderRadius: 'var(--rounded-pill)',
                  display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  {postName}
                </span>
              )}
              {postCode && (
                <span style={{
                  fontSize: '14px', color: 'var(--muted)', fontWeight: 500, // BinancePlex for numbers if possible
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <span style={{ opacity: 0.7 }}>📍</span> รหัส {postCode}
                </span>
              )}
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--theme-border)' }} />
              <span style={{
                fontSize: '14px', color: 'var(--theme-ink)', fontWeight: 600,
                backgroundColor: 'var(--theme-surface-strong)', padding: '4px 12px', borderRadius: 'var(--rounded-md)',
                border: '1px solid var(--theme-border)'
              }}>
                {customers.length} รายการ
              </span>
            </div>
          </div>
        </div>

        {/* ── Search Bar & Controls ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <span style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--muted)', fontSize: '14px', pointerEvents: 'none',
              transition: 'all 0.2s'
            }}>🔍</span>
            <input
              type="text"
              placeholder="ค้นหาชื่อลูกค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: '42px',
                padding: '0 36px',
                borderRadius: 'var(--rounded-lg)',
                border: '1px solid var(--theme-border)',
                backgroundColor: 'var(--theme-canvas)',
                color: 'var(--theme-ink)',
                fontSize: '14px',
                fontFamily: 'var(--font-family)',
                outline: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.2)';
                e.target.previousSibling.style.color = 'var(--primary)';
                e.target.previousSibling.style.transform = 'translateY(-50%) scale(1.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--theme-border)';
                e.target.style.boxShadow = 'none';
                e.target.previousSibling.style.color = 'var(--muted)';
                e.target.previousSibling.style.transform = 'translateY(-50%) scale(1)';
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none', color: 'var(--muted)',
                  cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '24px', height: '24px', borderRadius: '50%',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-surface-strong)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>แสดง</span>
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              style={{
                height: '40px',
                padding: '0 32px 0 12px',
                borderRadius: 'var(--rounded-lg)',
                border: '1px solid var(--theme-border)',
                backgroundColor: 'var(--theme-canvas)',
                color: 'var(--theme-ink)',
                fontSize: '14px',
                fontFamily: 'var(--font-family)',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23707a8a' d='M6 8.5L1 3.5h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                outline: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={999999}>ทั้งหมด</option>
            </select>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>รายการ/หน้า</span>
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
          border: '1px solid var(--theme-border)',
          borderRadius: 'var(--rounded-xl)',
          overflow: 'hidden',
          backgroundColor: 'var(--theme-canvas)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.02)',
          transition: 'box-shadow 0.3s ease',
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '48px 48px 1fr 200px',
            alignItems: 'center',
            padding: '16px 16px',
            backgroundColor: 'var(--theme-surface-strong)',
            borderBottom: '1px solid var(--theme-border)',
            fontSize: '12px',
            fontWeight: 700,
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: 'var(--primary)' }}
              />
            </div>
            <div>#</div>
            <div>ชื่อลูกค้า</div>
            <div>คำนำหน้า</div>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} style={{
                    display: 'grid',
                    gridTemplateColumns: '48px 48px 1fr 200px',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderBottom: i < 6 ? '1px solid var(--theme-border)' : 'none',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div className="skeleton" style={{ width: '18px', height: '18px', borderRadius: '4px' }}></div>
                    </div>
                    <div><div className="skeleton" style={{ width: '20px', height: '16px' }}></div></div>
                    <div><div className="skeleton" style={{ width: '60%', height: '16px' }}></div></div>
                    <div><div className="skeleton" style={{ width: '100px', height: '32px', borderRadius: '6px' }}></div></div>
                  </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filteredCustomers.length === 0 && (
            <div style={{ 
              padding: '64px 24px', 
              textAlign: 'center', 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-md)'
            }}>
              <img src="/images/empty.svg" alt="Empty" style={{ width: '160px', height: 'auto', opacity: 0.8 }} />
              <div style={{ color: 'var(--muted)', fontSize: '15px', fontWeight: 500 }}>
                {searchTerm ? 'ไม่พบข้อมูลลูกค้าที่คุณค้นหา' : 'ยังไม่มีข้อมูลลูกค้าในระบบ'}
              </div>
            </div>
          )}

          {/* Rows — clickable to toggle */}
          {paginatedCustomers.map((customer, index) => {
            const globalIndex = startIndex + index;
            const isSelected = selectedIds.has(customer.id);
            const prefix = prefixes[customer.id] || '';
            const avatarColor = getAvatarColor(customer.customer_name);
            return (
              <div
                key={customer.id}
                onClick={() => toggleSelect(customer.id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '48px 48px 1fr 200px',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderBottom: index < paginatedCustomers.length - 1 ? '1px solid var(--theme-border)' : 'none',
                  backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transform: 'translateY(0)',
                  position: 'relative',
                  zIndex: 1
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = isSelected ? 'rgba(59, 130, 246, 0.08)' : 'var(--theme-surface-strong)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.03)';
                  e.currentTarget.style.zIndex = '10';
                  e.currentTarget.style.borderBottomColor = 'transparent';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.zIndex = '1';
                  e.currentTarget.style.borderBottomColor = index < paginatedCustomers.length - 1 ? 'var(--theme-border)' : 'transparent';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    onClick={(e) => e.stopPropagation()}
                    style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: 'var(--primary)', pointerEvents: 'none' }}
                  />
                </div>
                <div style={{ fontSize: '13px', color: 'var(--muted)' }}>{globalIndex + 1}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Dynamic Avatar */}
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    backgroundColor: avatarColor.bg, color: avatarColor.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', fontWeight: 700, flexShrink: 0
                  }}>
                    {getInitials(customer.customer_name)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '14px', color: 'var(--theme-ink)', fontWeight: 500 }}>
                      {customer.customer_name}
                    </span>
                    {prefix && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        padding: '1px 6px',
                        borderRadius: 'var(--rounded-pill)',
                        width: 'fit-content'
                      }}>
                        {prefix}
                      </span>
                    )}
                  </div>
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
                  border: '1px solid var(--theme-border)', borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--theme-canvas)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: currentPage === 1 ? 'var(--muted)' : 'var(--theme-ink)', opacity: currentPage === 1 ? 0.4 : 1,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                }}
              >«</button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 10px', fontSize: '13px', fontFamily: 'var(--font-family)',
                  border: '1px solid var(--theme-border)', borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--theme-canvas)', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  color: currentPage === 1 ? 'var(--muted)' : 'var(--theme-ink)', opacity: currentPage === 1 ? 0.4 : 1,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
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
                        border: p === currentPage ? '1px solid var(--primary)' : '1px solid var(--theme-border)',
                        borderRadius: 'var(--rounded-md)',
                        backgroundColor: p === currentPage ? 'var(--primary)' : 'var(--theme-canvas)',
                        color: p === currentPage ? 'var(--on-primary)' : 'var(--theme-ink)',
                        cursor: 'pointer', transition: 'all 0.15s',
                        boxShadow: p === currentPage ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.04)',
                      }}
                    >{p}</button>
                  )
                )}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '6px 10px', fontSize: '13px', fontFamily: 'var(--font-family)',
                  border: '1px solid var(--theme-border)', borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--theme-canvas)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  color: currentPage === totalPages ? 'var(--muted)' : 'var(--theme-ink)', opacity: currentPage === totalPages ? 0.4 : 1,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                }}
              >›</button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                style={{
                  padding: '6px 10px', fontSize: '13px', fontFamily: 'var(--font-family)',
                  border: '1px solid var(--theme-border)', borderRadius: 'var(--rounded-md)',
                  backgroundColor: 'var(--theme-canvas)', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  color: currentPage === totalPages ? 'var(--muted)' : 'var(--theme-ink)', opacity: currentPage === totalPages ? 0.4 : 1,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                }}
              >»</button>
            </div>
          </div>
        )}

        {/* ── Premium Sticky Action Bar (Glassmorphism & Gradients) ── */}
        {hasSelection && (
          <div style={{
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: '95%',
            maxWidth: '1000px',
            animation: 'slideUpFade 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}>
            <style>{`
              @keyframes slideUpFade {
                from { opacity: 0; transform: translate(-50%, 60px) scale(0.95); }
                to { opacity: 1; transform: translate(-50%, 0) scale(1); }
              }
              @keyframes pulseGlow {
                0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
                70% { box-shadow: 0 0 0 12px rgba(245, 158, 11, 0); }
                100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
              }
              @keyframes shimmerBtn {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
              .premium-action-bar {
                background: var(--theme-canvas);
                border: 1px solid var(--theme-border);
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                border-radius: 24px; /* Sleek floating dock shape */
                padding: 16px 24px;
                display: flex;
                flex-direction: column;
                gap: 16px;
                position: relative;
              }
              /* Dark mode support */
              @media (prefers-color-scheme: dark) {
                .premium-action-bar {
                  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }
              }
              .shimmer-btn {
                background: linear-gradient(110deg, #f59e0b 20%, #fbbf24 40%, #f59e0b 60%);
                background-size: 200% auto;
                color: #fff !important;
                border: none !important;
                text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                transition: transform 0.2s, box-shadow 0.2s;
                border-radius: 100px !important;
                font-weight: 700 !important;
              }
              .shimmer-btn:hover:not(:disabled) {
                animation: shimmerBtn 2s linear infinite;
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
              }
              .btn-outline-glow {
                background: rgba(245, 158, 11, 0.1) !important;
                color: #d97706 !important;
                border: 1px solid rgba(245, 158, 11, 0.3) !important;
                transition: all 0.2s;
                border-radius: 100px !important;
                font-weight: 700 !important;
              }
              .btn-outline-glow:hover:not(:disabled) {
                background: rgba(245, 158, 11, 0.2) !important;
                border-color: rgba(245, 158, 11, 0.6) !important;
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(245, 158, 11, 0.2);
              }
              .premium-divider {
                width: 1px;
                height: 32px;
                background: linear-gradient(to bottom, transparent, var(--theme-border), transparent);
                margin: 0 4px;
              }
            `}</style>

            <div className="premium-action-bar">
              {/* Progress Bar UI */}
              {isGeneratingPDFs && pdfProgress.total > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid var(--theme-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 600, color: 'var(--theme-ink)' }}>
                    <span>กำลังสร้าง PDF...</span>
                    <span>{pdfProgress.current} / {pdfProgress.total}</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--theme-surface-strong)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      backgroundColor: 'var(--primary)', 
                      width: `${(pdfProgress.current / pdfProgress.total) * 100}%`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                flexWrap: 'wrap',
              }}>
                {/* Selection info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '140px' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#fff',
                    fontSize: '14px', fontWeight: 800,
                    animation: 'pulseGlow 2s infinite',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}>
                    {selectedIds.size}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '14px', color: 'var(--theme-ink)', fontWeight: 700 }}>
                      รายการที่เลือก
                    </span>
                    <button
                      onClick={clearSelection}
                      style={{
                        fontSize: '12px', color: 'var(--muted)', background: 'none',
                        border: 'none', cursor: 'pointer', fontFamily: 'var(--font-family)',
                        textDecoration: 'underline', padding: 0, textAlign: 'left',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--trading-down)'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--muted)'}
                    >
                      ยกเลิกทั้งหมด
                    </button>
                  </div>
                </div>

                <div className="premium-divider" />

                {/* Batch prefix */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 600, whiteSpace: 'nowrap' }}>คำนำหน้า:</span>
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
                      height: '36px', padding: '0 16px', fontSize: '13px', fontWeight: 600,
                      fontFamily: 'var(--font-family)',
                      border: '1px solid var(--theme-border)',
                      borderRadius: '100px',
                      backgroundColor: !batchPrefix ? 'var(--theme-canvas)' : 'var(--theme-surface-strong)',
                      color: !batchPrefix ? 'var(--muted)' : 'var(--theme-ink)',
                      cursor: !batchPrefix ? 'not-allowed' : 'pointer',
                      opacity: !batchPrefix ? 0.5 : 1,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s',
                      boxShadow: batchPrefix ? '0 2px 4px rgba(0,0,0,0.02)' : 'none'
                    }}
                    onMouseOver={(e) => { if (batchPrefix) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseOut={(e) => { if (batchPrefix) e.currentTarget.style.transform = 'translateY(0)'; }}
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
                      height: '36px', padding: '0 16px', fontSize: '13px', fontWeight: 600,
                      fontFamily: 'var(--font-family)',
                      border: '1px solid rgba(246, 70, 93, 0.2)',
                      borderRadius: '100px',
                      backgroundColor: 'rgba(246, 70, 93, 0.05)',
                      color: 'var(--trading-down)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { 
                      e.currentTarget.style.backgroundColor = 'rgba(246, 70, 93, 0.1)'; 
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => { 
                      e.currentTarget.style.backgroundColor = 'rgba(246, 70, 93, 0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    ล้างคำนำหน้า
                  </button>
                </div>

                <div className="premium-divider" style={{ display: 'none' }} />

                {/* Signatory + Print */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ width: '220px' }}>
                    <select
                      value={selectedSignatoryId}
                      onChange={(e) => setSelectedSignatoryId(e.target.value)}
                      style={{
                        width: '100%', height: '40px',
                        padding: '0 28px 0 16px',
                        border: '1px solid var(--theme-border)',
                        borderRadius: '100px',
                        fontSize: '13px', fontFamily: 'var(--font-family)', fontWeight: 600,
                        backgroundColor: 'var(--theme-canvas)',
                        color: selectedSignatoryId ? 'var(--theme-ink)' : 'var(--muted)',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23707a8a' d='M6 8.5L1 3.5h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        outline: 'none', cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                      }}
                    >
                      <option value="">— เลือกผู้ลงนาม —</option>
                      {signatories.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                      onClick={handleSavePDFs}
                      disabled={!selectedSignatoryId || isGeneratingPDFs}
                      className="btn-outline-glow"
                      style={{ height: '40px', padding: '0 20px' }}
                    >
                      {isGeneratingPDFs ? 'กำลังสร้าง...' : '⬇️ บันทึกแยก PDF'}
                    </Button>
                    <Button
                      onClick={handlePrint}
                      disabled={!selectedSignatoryId || isGeneratingPDFs}
                      className="shimmer-btn"
                      style={{ height: '40px', padding: '0 24px' }}
                    >
                      🖨️ พิมพ์เอกสาร
                    </Button>
                  </div>
                </div>
              </div>
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
