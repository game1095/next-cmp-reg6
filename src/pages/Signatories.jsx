import React, { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import Button from '../components/Button';
import SignatoryModal from '../components/SignatoryModal';
import Swal from 'sweetalert2';

export default function Signatories() {
  const [signatories, setSignatories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

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
    const result = await Swal.fire({
      title: 'ลบผู้ลงนาม?',
      text: "คุณจะไม่สามารถกู้คืนข้อมูลและลายเซ็นนี้ได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--trading-down)',
      cancelButtonColor: 'var(--muted)',
      confirmButtonText: 'ลบข้อมูล',
      cancelButtonText: 'ยกเลิก',
      background: 'var(--theme-canvas)',
      color: 'var(--theme-ink)',
    });

    if (!result.isConfirmed) return;

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
      fetchSignatories();
      Swal.fire({
        icon: 'success',
        title: 'ลบสำเร็จ',
        showConfirmButton: false,
        timer: 1500,
        background: 'var(--theme-canvas)',
        color: 'var(--theme-ink)',
      });
    }
  };

  const handleSetDefault = (id) => {
    localStorage.setItem('default_signatory_id', id);
    setDefaultId(id);
  };

  return (
    <div>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 'var(--spacing-md)',
        }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              border: '1px solid var(--theme-border)',
              borderRadius: 'var(--rounded-xl)',
              padding: 'var(--spacing-lg)',
              backgroundColor: 'var(--theme-canvas)'
            }}>
              <div className="skeleton" style={{ height: '80px', borderRadius: 'var(--rounded-lg)', marginBottom: 'var(--spacing-md)' }}></div>
              <div className="skeleton" style={{ width: '60%', height: '24px', marginBottom: '8px' }}></div>
              <div className="skeleton" style={{ width: '40%', height: '16px', marginBottom: 'var(--spacing-md)' }}></div>
              <div className="skeleton" style={{ height: '32px', borderRadius: 'var(--rounded-md)' }}></div>
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && signatories.length === 0 && (
        <div style={{
          padding: '64px 24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-md)',
          border: '1px dashed var(--theme-border)',
          borderRadius: 'var(--rounded-xl)',
          backgroundColor: 'var(--theme-surface-strong)',
        }}>
          <i className="fa-solid fa-file-signature" style={{ fontSize: '64px', color: 'var(--theme-border-strong)', opacity: 0.5, marginBottom: '8px' }}></i>
          <div style={{ color: 'var(--muted)', fontSize: '15px', fontWeight: 500 }}>
            ยังไม่มีผู้มีอำนาจลงนามในระบบ
          </div>
          <Button onClick={handleAdd}>+ เพิ่มผู้ลงนามเลย</Button>
        </div>
      )}

      {/* ── Card Grid ── */}
      {!loading && signatories.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 'var(--spacing-md)',
        }}>
          {signatories.map((sig, index) => {
            const isDefault = defaultId === sig.id;
            return (
            <div
              key={sig.id}
              className="animate-fade-up"
              style={{
                border: isDefault ? '2px solid var(--primary)' : '1px solid var(--theme-border)',
                borderRadius: 'var(--rounded-xl)',
                padding: 'var(--spacing-lg)',
                backgroundColor: isDefault ? 'rgba(252, 213, 53, 0.05)' : 'var(--theme-canvas)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative',
                animationDelay: `${index * 0.05}s`,
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.boxShadow = isDefault ? '0 12px 24px rgba(252, 213, 53, 0.15)' : '0 12px 24px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
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
                  backgroundColor: 'var(--theme-surface-strong)',
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
                  backgroundColor: 'var(--theme-surface-strong)',
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
              <h3 className="text-title-sm" style={{ marginBottom: '4px', color: 'var(--theme-ink)' }}>{sig.name}</h3>
              <p className="text-body-md text-muted" style={{ marginBottom: 'var(--spacing-md)' }}>
                {sig.position}
              </p>

              {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                  {!isDefault && (
                    <button
                      onClick={() => handleSetDefault(sig.id)}
                      style={{
                        padding: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--theme-ink)',
                        backgroundColor: 'rgba(252, 213, 53, 0.15)',
                        border: 'none',
                        borderRadius: 'var(--rounded-md)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        transition: 'background-color 0.15s',
                        marginBottom: '4px'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(252, 213, 53, 0.25)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(252, 213, 53, 0.15)'}
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
                        color: 'var(--theme-ink)',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--theme-border)',
                        borderRadius: 'var(--rounded-md)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-family)',
                        transition: 'background-color 0.15s',
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-surface-strong)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(sig.id)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--trading-down)',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--theme-border)',
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
