import React, { useState, useEffect } from "react";
import { supabase, TABLES } from "../lib/supabase";
import Modal from "./Modal";
import Button from "./Button";
import Input from "./Input";

const removeImageBackground = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Make pixels with high luminance (white/light gray) transparent
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        
        // Advanced Signature Extraction with Anti-aliasing preservation
        const darkThreshold = 50;   // Core ink pixels (fully opaque)
        const lightThreshold = 100; // Shadows & paper background (fully transparent)
        
        if (luminance >= lightThreshold) {
          data[i + 3] = 0; // Transparent
        } else if (luminance <= darkThreshold) {
          data[i + 3] = 255; // Opaque
        } else {
          // Smooth alpha transition for the edges of the ink
          const alphaRatio = 1 - ((luminance - darkThreshold) / (lightThreshold - darkThreshold));
          data[i + 3] = Math.round(255 * alphaRatio);
        }
      }

      ctx.putImageData(imageData, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".png"), {
            type: "image/png",
          });
          resolve(newFile);
        } else {
          reject(new Error("Failed to create blob from canvas"));
        }
      }, "image/png");
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

export default function SignatoryModal({
  isOpen,
  onClose,
  onSaved,
  editData = null,
}) {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [signatureFile, setSignatureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const [isDefault, setIsDefault] = useState(false);

  const isEditing = !!editData;

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setPosition(editData.position || "");
      setAddress(editData.address || "");
      setTel(editData.tel || "");
      setPreviewUrl(editData.signature_url || "");
      setIsDefault(
        localStorage.getItem("default_signatory_id") === editData.id,
      );
    } else {
      setName("");
      setPosition("");
      setAddress("");
      setTel("");
      setPreviewUrl("");
      setIsDefault(false);
    }
    setSignatureFile(null);
    setError(null);
  }, [editData, isOpen]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsProcessingImage(true);
        setError(null);
        const processedFile = await removeImageBackground(file);
        setSignatureFile(processedFile);
        setPreviewUrl(URL.createObjectURL(processedFile));
      } catch (err) {
        console.error("Image processing error:", err);
        setError("ไม่สามารถประมวลผลพื้นหลังรูปภาพได้");
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const uploadSignature = async (file) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `signatures/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("signatures")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage
      .from("signatures")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isEditing && !signatureFile) {
        throw new Error("กรุณาอัปโหลดภาพลายเซ็น");
      }

      let signatureUrl = editData?.signature_url || null;

      // Upload new signature image if provided
      if (signatureFile) {
        signatureUrl = await uploadSignature(signatureFile);
      }

      if (isEditing) {
        const { error: updateError } = await supabase
          .from(TABLES.SIGNATORIES)
          .update({ name, position, address, tel, signature_url: signatureUrl })
          .eq("id", editData.id);

        if (updateError) throw updateError;

        if (isDefault) {
          localStorage.setItem("default_signatory_id", editData.id);
        } else if (
          localStorage.getItem("default_signatory_id") === editData.id
        ) {
          localStorage.removeItem("default_signatory_id");
        }
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data: insertedData, error: insertError } = await supabase
          .from(TABLES.SIGNATORIES)
          .insert({
            name,
            position,
            address,
            tel,
            signature_url: signatureUrl,
            user_id: user.id,
          })
          .select("id")
          .single();

        if (insertError) throw insertError;

        if (isDefault && insertedData) {
          localStorage.setItem("default_signatory_id", insertedData.id);
        }
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "แก้ไขผู้ลงนาม" : "เพิ่มผู้ลงนาม"}
      width="640px"
    >
      {error && (
        <div
          style={{
            color: "var(--trading-down)",
            backgroundColor: "rgba(246, 70, 93, 0.1)",
            padding: "12px",
            borderRadius: "var(--rounded-sm)",
            fontSize: "14px",
            marginBottom: "var(--spacing-md)",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 var(--spacing-md)" }}>
          <Input
            id="sig-name"
            label="ชื่อ-นามสกุล"
            placeholder="นายทดสอบ สวัสดีครับ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            id="sig-position"
            label="ตำแหน่ง"
            placeholder="หัวหน้าไปรษณีย์ทดสอบ"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
          />
          <Input
            id="sig-address"
            label="ที่อยู่"
            placeholder="123 หมู่ 4 ต.ทดสอบ อ.ทดสอบ จ.ทดสอบ 12345"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <Input
            id="sig-tel"
            label="เบอร์โทรศัพท์"
            placeholder="02-123-4567, 081-234-5678"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            required
          />
        </div>

        {/* Signature Image Upload */}
        <div style={{ marginBottom: "var(--spacing-md)" }}>
          <label
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--theme-ink)",
              display: "block",
              marginBottom: "8px",
            }}
          >
            ภาพลายเซ็น
            {!isEditing && <span style={{ color: 'var(--trading-down)', marginLeft: '4px' }}>*</span>}
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="file"
              id="signature-upload"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
                zIndex: 10,
                top: 0,
                left: 0,
              }}
            />
            <div
              style={{
                border: "2px dashed var(--theme-border)",
                borderRadius: "var(--rounded-lg)",
                padding: "32px 24px",
                textAlign: "center",
                backgroundColor: "var(--theme-canvas)",
                transition: "all 0.2s ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "var(--primary)";
                e.currentTarget.style.backgroundColor =
                  "rgba(252, 213, 53, 0.05)";
                e.currentTarget.style.color = "var(--primary)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "var(--theme-border)";
                e.currentTarget.style.backgroundColor = "var(--theme-canvas)";
                e.currentTarget.style.color = "var(--muted)";
              }}
            >
              {isProcessingImage ? (
                <>
                  <div
                    className="spinner"
                    style={{
                      width: "32px",
                      height: "32px",
                      border: "3px solid var(--theme-border)",
                      borderTopColor: "var(--primary)",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                      marginBottom: "8px",
                    }}
                  />
                  <style>
                    {`
                      @keyframes spin {
                        to { transform: rotate(360deg); }
                      }
                    `}
                  </style>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--theme-ink)" }}>
                    กำลังลบพื้นหลังอัตโนมัติ...
                  </div>
                </>
              ) : (
                <>
                  <div style={{ color: "inherit", transition: "color 0.2s ease" }}>
                    <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: '32px' }}></i>
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--theme-ink)",
                    }}
                  >
                    คลิกเพื่ออัปโหลดลายเซ็น
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                    PNG หรือ JPG (ลบพื้นหลังขาวอัตโนมัติ)
                  </div>
                </>
              )}
            </div>
          </div>
          {previewUrl && (
            <div
              style={{
                marginTop: "var(--spacing-sm)",
                padding: "var(--spacing-md)",
                border: "1px solid var(--theme-border)",
                borderRadius: "var(--rounded-lg)",
                backgroundColor: "var(--theme-surface-strong)",
                textAlign: "center",
              }}
            >
              <img
                src={previewUrl}
                alt="ตัวอย่างลายเซ็น"
                style={{
                  maxWidth: "200px",
                  maxHeight: "100px",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
        </div>

        {/* Set as Default Checkbox */}
        <div style={{ marginBottom: "var(--spacing-lg)" }}>
          <label
            htmlFor="sig-default"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              padding: "12px 16px",
              borderRadius: "var(--rounded-md)",
              border: "1px solid var(--theme-border)",
              backgroundColor: isDefault
                ? "rgba(252, 213, 53, 0.05)"
                : "var(--theme-canvas)",
              transition: "all 0.2s ease",
              borderColor: isDefault ? "var(--primary)" : "var(--theme-border)",
            }}
            onMouseOver={(e) => {
              if (!isDefault)
                e.currentTarget.style.backgroundColor =
                  "var(--theme-surface-strong)";
            }}
            onMouseOut={(e) => {
              if (!isDefault)
                e.currentTarget.style.backgroundColor = "var(--theme-canvas)";
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "4px",
                border: isDefault ? "none" : "2px solid var(--muted)",
                backgroundColor: isDefault ? "var(--primary)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              {isDefault && (
                <i className="fa-solid fa-check" style={{ fontSize: '12px', color: 'var(--on-primary)' }}></i>
              )}
            </div>
            <input
              type="checkbox"
              id="sig-default"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              style={{ display: "none" }}
            />
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--theme-ink)",
              }}
            >
              ตั้งเป็นผู้ลงนามเริ่มต้น (Default)
            </span>
          </label>
        </div>

        <div
          style={{
            display: "flex",
            gap: "var(--spacing-sm)",
            justifyContent: "flex-end",
            marginTop: "var(--spacing-lg)",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid var(--theme-border)",
              borderRadius: "var(--rounded-md)",
              padding: "10px 20px",
              height: "40px",
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--theme-ink)",
              cursor: "pointer",
              fontFamily: "var(--font-family)",
              transition: "all 0.15s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor =
                "var(--theme-surface-strong)";
              e.currentTarget.style.borderColor = "var(--muted)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.borderColor = "var(--theme-border)";
            }}
          >
            ยกเลิก
          </button>
          <Button type="submit" disabled={loading}>
            {loading ? "กำลังบันทึก..." : isEditing ? "อัปเดต" : "บันทึก"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
