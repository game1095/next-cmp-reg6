import React from 'react';

export default function HowToGuide() {
  const steps = [
    {
      id: 1,
      title: 'ค้นหาและเลือกลูกค้า',
      description: 'ใช้กล่องค้นหาเพื่อหาชื่อลูกค้าที่ต้องการ และคลิกที่แถวหรือช่องทำเครื่องหมายเพื่อเลือกรายการ (สามารถเลือกได้หลายรายการพร้อมกัน)',
      icon: "fa-solid fa-magnifying-glass",
      color: "#3b82f6"
    },
    {
      id: 2,
      title: 'ตั้งค่าคำนำหน้าชื่อ',
      description: 'กำหนดคำนำหน้าชื่อให้กับลูกค้าแต่ละราย หรือใช้ฟังก์ชัน "ตั้งทั้งหมด" ในแถบด้านล่างเพื่อกำหนดให้ทุกคนที่เลือกไว้ในคลิกเดียว',
      icon: "fa-solid fa-users",
      color: "#2dbdb6"
    },
    {
      id: 3,
      title: 'เลือกผู้มีอำนาจลงนาม',
      description: 'ในแถบเครื่องมือด้านล่างสุด ให้เลือกผู้ที่จะลงนามในเอกสาร (ระบบจะจดจำค่าเริ่มต้นที่คุณเคยตั้งไว้ให้โดยอัตโนมัติ)',
      icon: "fa-solid fa-file-signature",
      color: "#FCD535"
    },
    {
      id: 4,
      title: 'พิมพ์เอกสาร',
      description: 'กดปุ่ม "พิมพ์" ระบบจะสร้างเอกสารจดหมายราชการที่มีขนาดตัวอักษร การจัดหน้า และช่องไฟภาษาไทยที่สวยงาม พร้อมสำหรับสั่งพิมพ์ทันที',
      icon: "fa-solid fa-print",
      color: "#0ecb81"
    }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "var(--theme-canvas)",
      position: "relative",
      overflow: "hidden",
      paddingBottom: "120px"
    }}>
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatAnim {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes glowPulse {
          0% { box-shadow: 0 0 20px rgba(252,213,53,0.3), inset 0 0 10px rgba(252,213,53,0.2); }
          50% { box-shadow: 0 0 40px rgba(252,213,53,0.5), inset 0 0 20px rgba(252,213,53,0.3); }
          100% { box-shadow: 0 0 20px rgba(252,213,53,0.3), inset 0 0 10px rgba(252,213,53,0.2); }
        }
        @keyframes drawLine {
          from { height: 0; }
          to { height: 100%; }
        }
        
        .bg-grid {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(128,128,128,0.15) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(128,128,128,0.15) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 40%, transparent 90%);
          -webkit-mask-image: radial-gradient(circle at center, black 40%, transparent 90%);
        }

        .gradient-text {
          background: linear-gradient(135deg, var(--primary) 0%, #b45309 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }

        .guide-step-container {
          display: flex;
          align-items: stretch;
          position: relative;
          z-index: 1;
          margin-bottom: 40px;
          opacity: 0;
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* The continuous line */
        .timeline-line {
          position: absolute;
          left: 31px;
          top: 64px;
          bottom: -40px; /* extends to the next item */
          width: 2px;
          background: linear-gradient(to bottom, rgba(252, 213, 53, 0.6) 0%, rgba(252, 213, 53, 0.1) 100%);
          transform-origin: top;
          animation: drawLine 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Hide line on last item */
        .guide-step-container:last-child .timeline-line {
          display: none;
        }

        .guide-step-icon-wrapper {
          width: 64px;
          height: 64px;
          flex-shrink: 0;
          border-radius: 50%;
          background-color: var(--theme-canvas);
          border: 2px solid var(--theme-border);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 32px;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
          box-shadow: 0 8px 16px rgba(0,0,0,0.04);
        }

        .guide-step-card {
          flex: 1;
          background-color: var(--theme-surface-strong);
          border: 1px solid var(--theme-border);
          border-radius: var(--rounded-xl);
          padding: 32px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
        }

        .guide-step-container:hover .guide-step-icon-wrapper {
          border-color: var(--primary);
          box-shadow: 0 0 20px rgba(252, 213, 53, 0.2);
          transform: scale(1.1);
        }

        .guide-step-container:hover .guide-step-card {
          transform: translateX(8px);
          border-color: rgba(252, 213, 53, 0.4);
          box-shadow: 0 16px 32px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* Decorative Grid Background */}
      <div
        className="bg-grid"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Spectacular Animated Orbs */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          right: "20%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(252,213,53,0.05) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
          filter: "blur(40px)",
          animation: "floatAnim 10s ease-in-out infinite alternate",
        }}
      />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "80px 24px 0", position: "relative", zIndex: 1 }}>
        
        {/* ── 1. Page Header (Hero Band Style) ── */}
        <div style={{ textAlign: "center", marginBottom: "80px", animation: "slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both" }}>
          <div
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "64px", height: "64px", borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(252,213,53,0.15) 0%, rgba(252,213,53,0.05) 100%)",
              color: "var(--primary)", marginBottom: "24px",
              boxShadow: "0 8px 32px rgba(252,213,53,0.15)", border: "1px solid rgba(252,213,53,0.2)",
            }}
          >
            <i className="fa-solid fa-book-open" style={{ fontSize: "28px" }}></i>
          </div>
          <h1
            style={{
              fontSize: "48px", color: "var(--theme-ink)", marginBottom: "20px",
              letterSpacing: "-0.5px", fontWeight: 700, lineHeight: 1.1,
              fontFamily: "var(--font-family)"
            }}
          >
            How it works.<br />
            <span className="gradient-text">วิธีการออกจดหมาย</span>
          </h1>
          <p
            style={{
              maxWidth: "580px", margin: "0 auto", lineHeight: 1.6,
              fontSize: "16px", color: "var(--muted)", fontWeight: 400
            }}
          >
            เรียนรู้ขั้นตอนการเตรียมเอกสารและสั่งพิมพ์แบบมืออาชีพ ผ่าน 4 ขั้นตอนง่ายๆ ที่ถูกออกแบบมาเพื่อความรวดเร็วและเป็นเลิศ
          </p>
        </div>

        {/* ── 2. The Timeline ── */}
        <div style={{ position: "relative" }}>
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="guide-step-container" 
              style={{ animationDelay: `${0.1 + (index * 0.15)}s` }}
            >
              <div className="timeline-line"></div>
              
              <div className="guide-step-icon-wrapper">
                <i className={step.icon} style={{ fontSize: "24px", color: step.color }}></i>
                <div style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  width: "24px",
                  height: "24px",
                  backgroundColor: "var(--theme-ink)",
                  color: "var(--theme-canvas)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }}>
                  {step.id}
                </div>
              </div>

              <div className="guide-step-card">
                <h3 style={{ 
                  fontSize: "20px", 
                  fontWeight: 700, 
                  color: "var(--theme-ink)", 
                  margin: "0 0 12px 0",
                  fontFamily: "var(--font-family)"
                }}>
                  {step.title}
                </h3>
                <p style={{ 
                  fontSize: "15px", 
                  color: "var(--muted)", 
                  lineHeight: 1.6, 
                  margin: 0,
                  fontWeight: 400
                }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
