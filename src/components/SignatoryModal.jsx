import React, { useState, useEffect } from 'react';
import { supabase, TABLES } from '../lib/supabase';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';

export default function SignatoryModal({ isOpen, onClose, onSaved, editData = null }) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [signatureFile, setSignatureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isDefault, setIsDefault] = useState(false);

  const isEditing = !!editData;

  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      setPosition(editData.position || '');
      setPreviewUrl(editData.signature_url || '');
      setIsDefault(localStorage.getItem('default_signatory_id') === editData.id);
    } else {
      setName('');
      setPosition('');
      setPreviewUrl('');
      setIsDefault(false);
    }
    setSignatureFile(null);
    setError(null);
  }, [editData, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSignatureFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadSignature = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `signatures/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('signatures')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from('signatures')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let signatureUrl = editData?.signature_url || null;

      // Upload new signature image if provided
      if (signatureFile) {
        signatureUrl = await uploadSignature(signatureFile);
      }

      if (isEditing) {
        const { error: updateError } = await supabase
          .from(TABLES.SIGNATORIES)
          .update({ name, position, signature_url: signatureUrl })
          .eq('id', editData.id);

        if (updateError) throw updateError;
        
        if (isDefault) {
          localStorage.setItem('default_signatory_id', editData.id);
        } else if (localStorage.getItem('default_signatory_id') === editData.id) {
          localStorage.removeItem('default_signatory_id');
        }
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        
        const { data: insertedData, error: insertError } = await supabase
          .from(TABLES.SIGNATORIES)
          .insert({ 
            name, 
            position, 
            signature_url: signatureUrl,
            user_id: user.id
          })
          .select('id')
          .single();

        if (insertError) throw insertError;
        
        if (isDefault && insertedData) {
          localStorage.setItem('default_signatory_id', insertedData.id);
        }
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'แก้ไขผู้ลงนาม' : 'เพิ่มผู้ลงนาม'}
    >
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

      <form onSubmit={handleSubmit}>
        <Input
          id="sig-name"
          label="ชื่อ-นามสกุล"
          placeholder="เช่น นายเกม เทพมาก"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="sig-position"
          label="ตำแหน่ง"
          placeholder="เช่น หัวหน้าที่ทำการไปรษณีย์จังหวัดสุโขทัย"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
        />

        {/* Signature Image Upload */}
        <div style={{ marginBottom: 'var(--spacing-md)' }}>
          <label style={{ fontSize: '14px', fontWeight: 500, color: 'var(--theme-ink)', display: 'block', marginBottom: '8px' }}>
            ภาพลายเซ็น
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="file"
              id="signature-upload"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10, top: 0, left: 0
              }}
            />
            <div style={{
              border: '2px dashed var(--theme-border)',
              borderRadius: 'var(--rounded-lg)',
              padding: 'var(--spacing-lg)',
              textAlign: 'center',
              backgroundColor: 'var(--theme-canvas)',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.04)'; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.backgroundColor = 'var(--theme-canvas)'; }}
            >
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🖼️</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--primary)' }}>คลิกเพื่ออัปโหลดลายเซ็น</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>PNG หรือ JPG (แนะนำพื้นหลังโปร่งใส)</div>
            </div>
          </div>
          {previewUrl && (
            <div style={{
              marginTop: 'var(--spacing-sm)',
              padding: 'var(--spacing-md)',
              border: '1px solid var(--theme-border)',
              borderRadius: 'var(--rounded-lg)',
              backgroundColor: 'var(--theme-surface-strong)',
              textAlign: 'center',
            }}>
              <img
                src={previewUrl}
                alt="ตัวอย่างลายเซ็น"
                style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain' }}
              />
            </div>
          )}
        </div>

        {/* Set as Default Checkbox */}
        <div style={{ marginBottom: 'var(--spacing-lg)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="checkbox"
            id="sig-default"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
          />
          <label htmlFor="sig-default" style={{ fontSize: '14px', fontWeight: 500, color: 'var(--theme-ink)', cursor: 'pointer' }}>
            ตั้งเป็นผู้ลงนามเริ่มต้น (Default)
          </label>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end', marginTop: 'var(--spacing-lg)' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid var(--theme-border)',
              borderRadius: 'var(--rounded-md)',
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--theme-ink)',
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              transition: 'background-color 0.15s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--theme-surface-strong)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ยกเลิก
          </button>
          <Button type="submit" disabled={loading}>
            {loading ? 'กำลังบันทึก...' : (isEditing ? 'อัปเดต' : 'บันทึก')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
