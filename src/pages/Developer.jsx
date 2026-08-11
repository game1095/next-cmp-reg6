import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Developer() {
  const [clickCount, setClickCount] = useState(0);

  const handleDeveloperClick = () => {
    const newCount = clickCount + 1;
    if (newCount === 5) {
      Swal.fire({
        text: "หัวหน้าครับ พ่อผมบอกว่ามันทำงานมั่ว อย่าไปเชื่อมันนะครับ",
        icon: "warning",
        confirmButtonColor: "#fc3535ff",
        confirmButtonText: "พ่อมึงเซ็นงานกู พ่อมึงก็มั่ว :P",
      });
      setClickCount(0);
    } else {
      setClickCount(newCount);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "var(--spacing-xl)",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--canvas-light)",
          border: "1px solid var(--hairline-on-light)",
          borderRadius: "var(--rounded-xl)",
          padding: "var(--spacing-xl)",
          maxWidth: "700px",
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Decorative Accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, var(--primary) 0%, var(--accent-turquoise) 100%)",
          }}
        />

        <div style={{ marginBottom: "var(--spacing-xl)" }}>
          <h1 className="text-display-sm" style={{ color: "var(--ink)" }}>
            ผู้พัฒนา
          </h1>
          <p className="text-body-md text-muted">
            ทีมงานผู้อยู่เบื้องหลังระบบ CMP-Core
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "var(--spacing-lg)",
          }}
        >
          {/* Idea By */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--spacing-md)",
              padding: "var(--spacing-lg)",
              backgroundColor: "var(--canvas-light)",
              borderRadius: "var(--rounded-lg)",
              border: "1px solid var(--hairline-on-light)",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "160px",
                height: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/images/idea.svg"
                alt="Idea"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--muted)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Idea By
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--ink)",
                }}
              >
                ฮ.ฮูก
              </div>
            </div>
          </div>

          {/* Design & Developed By */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--spacing-md)",
              padding: "var(--spacing-lg)",
              backgroundColor: "var(--canvas-light)",
              borderRadius: "var(--rounded-lg)",
              border: "1px solid var(--hairline-on-light)",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "160px",
                height: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/images/coder.svg"
                alt="Coder"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--muted)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Design & Developed By
              </div>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--ink)",
                  userSelect: "none",
                }}
                onClick={handleDeveloperClick}
              >
                คนทำงานมั่ว
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
