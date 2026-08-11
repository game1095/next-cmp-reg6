import React, { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import Button from '../components/Button';
import SignatoryModal from '../components/SignatoryModal';

export default function Signatories() {
  const [signatories, setSignatories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  // Default signatory state
  const [defaultId, setDefaultId] = useState(localStorage.getItem('default_signatory_id'));

  useEffect(() => {
    fetchSignatories();
  }, []);

  const fetchSignatories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(TABLES.SIGNATORIES)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setSignatories(data || []);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleEdit = (signatory) => {
    setEditData(signatory);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from(TABLES.SIGNATORIES)
      .delete()
      .eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      if (defaultId === id) {
        localStorage.removeItem('default_signatory_id');
        setDefaultId(null);
      }
      setDeleteId(null);
      fetchSignatories();
    }
  };

  const handleSetDefault = (id) => {
    localStorage.setItem('default_signatory_id', id);
    setDefaultId(id);
  };

  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 'var(--spacing-lg)',
      }}>
        <div>
          <h1 className="text-title-lg" style={{ marginBottom: '4px' }}>ผู้มีอำนาจลงนาม</h1>
          <p className="text-caption text-muted">
            จัดการข้อมูลผู้ลงนามและลายเซ็นสำหรับเอกสาร
          </p>
        </div>
        <Button onClick={handleAdd}>+ เพิ่มผู้ลงนาม</Button>
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

      {/* ── Loading ── */}
      {loading && (
        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>
          กำลังโหลด...
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && signatories.length === 0 && (
        <div style={{
          padding: 'var(--spacing-xxl)',
          textAlign: 'center',
          border: '2px dashed var(--hairline-on-light)',
          borderRadius: 'var(--rounded-xl)',
          color: 'var(--muted)',
        }}>
          <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-sm)' }}>✍️</div>
          <p className="text-title-sm" style={{ marginBottom: '4px', color: 'var(--ink)' }}>
            ยังไม่มีผู้ลงนาม
          </p>
          <p className="text-body-md text-muted">
            เพิ่มผู้มีอำนาจลงนามเพื่อใช้ในการออกเอกสาร
          </p>
        </div>
      )}

      {/* ── Card Grid ── */}
      {!loading && signatories.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 'var(--spacing-md)',
        }}>
          {signatories.map((sig) => {
            const isDefault = defaultId === sig.id;
            return (
            <div
              key={sig.id}
              style={{
                border: isDefault ? '2px solid var(--primary)' : '1px solid var(--hairline-on-light)',
                borderRadius: 'var(--rounded-xl)',
                padding: 'var(--spacing-lg)',
                backgroundColor: isDefault ? 'rgba(0, 102, 255, 0.02)' : 'var(--canvas-light)',
                transition: 'box-shadow 0.15s, border-color 0.15s',
                position: 'relative',
              }}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              {isDefault && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20px',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  ★ ค่าเริ่มต้น
                </div>
              )}
              {/* Signature image */}
              {sig.signature_url ? (
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--surface-soft-light)',
                  borderRadius: 'var(--rounded-lg)',
                  marginBottom: 'var(--spacing-md)',
                  textAlign: 'center',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img
                    src={sig.signature_url}
                    alt={`ลายเซ็น ${sig.name}`}
                    style={{ maxWidth: '180px', maxHeight: '80px', objectFit: 'contain' }}
                  />
                </div>
              ) : (
                <div style={{
                  padding: 'var(--spacing-md)',
                  backgroundColor: 'var(--surface-soft-light)',
                  borderRadius: 'var(--rounded-lg)',
                  marginBottom: 'var(--spacing-md)',
                  textAlign: 'center',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--muted)',
                  fontSize: '13px',
                }}>
                  ยังไม่มีลายเซ็น
                </div>
              )}

              {/* Info */}
              <h3 className="text-title-sm" style={{ marginBottom: '4px' }}>{sig.name}</h3>
              <p className="text-body-md text-muted" style={{ marginBottom: 'var(--spacing-md)' }}>
                {sig.position}
              </p>

              {/* Actions */}
              {deleteId === sig.id ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)',
                  padding: 'var(--spacing-sm)',
                  backgroundColor: 'rgba(246, 70, 93, 0.06)',
                  borderRadius: 'var(--rounded-md)',
                }}>
                  <span style={{ fontSize: '13px', color: 'var(--trading-down)', flex: 1 }}>ยืนยันการลบ?</span>
                  <button
                    onClick={() => handleDelete(sig.id)}
                    style={{
                      padding: '4px 12px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'white',
                      backgroundColor: 'var(--trading-down)',
                      border: 'none',
                      borderRadius: 'var(--rounded-sm)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-family)',
                    }}
                  >
                    ลบ
                  </button>
                  <button
                    onClick={() => setDeleteId(null)}
                    style={{
                      padding: '4px 12px',
                      fontSize: '13px',
                      color: 'var(--muted)',
                      backgroundColor: 'transparent',
                      border: '1px solid var(--hairline-on-light)',
                      borderRadius: 'var(--rounded-sm)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-family)',
                    }}
                  >
                    ยกเลิก
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                  {!isDefault && (
                    <button
                      onClick={() => handleSetDefault(sig.id)}
                      style={{
                        padding: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--primary)',
                        backgroundColor: 'rgba(0, 102, 255, 0.06)',
                        border: 'none',
                        borderRadius: 'var(--rounded-md)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        transition: 'background-color 0.15s',
                        marginBottom: '4px'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 102, 255, 0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 102, 255, 0.06)'}
                    >
                      ★ ตั้งเป็นค่าเริ่มต้น
                    </button>
                  )}
                  <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                    <button
                      onClick={() => handleEdit(sig)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--ink)',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--hairline-on-light)',
                        borderRadius: 'var(--rounded-md)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-strong-light)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => setDeleteId(sig.id)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--trading-down)',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--hairline-on-light)',
                        borderRadius: 'var(--rounded-md)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(246, 70, 93, 0.04)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              )}
            </div>
            );
          })}
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      <SignatoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchSignatories}
        editData={editData}
      />
    </div>
  );
}
