import React from 'react';

export default function HowToGuide() {
  const steps = [
    {
      id: 1,
      title: 'ค้นหาและเลือกลูกค้า',
      description: 'ใช้กล่องค้นหาเพื่อหาชื่อลูกค้าที่ต้องการ และคลิกที่แถวหรือช่องทำเครื่องหมายเพื่อเลือกรายการ (สามารถเลือกได้หลายรายการพร้อมกัน)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
          <path d="m9 11 1.5 1.5 3-3"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: 'ตั้งค่าคำนำหน้าชื่อ',
      description: 'กำหนดคำนำหน้าชื่อให้กับลูกค้าแต่ละราย หรือใช้ฟังก์ชัน "ตั้งทั้งหมด" ในแถบด้านล่างเพื่อกำหนดให้ทุกคนที่เลือกไว้ในคลิกเดียว',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
      )
    },
    {
      id: 3,
      title: 'เลือกผู้มีอำนาจลงนาม',
      description: 'ในแถบเครื่องมือด้านล่างสุด ให้เลือกผู้ที่จะลงนามในเอกสาร (ระบบจะจดจำค่าเริ่มต้นที่คุณเคยตั้งไว้ให้โดยอัตโนมัติ)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          <path d="M15 5l3 3"></path>
        </svg>
      )
    },
    {
      id: 4,
      title: 'พิมพ์เอกสาร',
      description: 'กดปุ่ม "พิมพ์" ระบบจะสร้างเอกสารจดหมายราชการที่มีขนาดตัวอักษร การจัดหน้า และช่องไฟภาษาไทยที่สวยงาม พร้อมสำหรับสั่งพิมพ์ทันที',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
      )
    }
  ];

  return (
    <div style={{
      padding: 'var(--spacing-2xl) 0',
      maxWidth: '800px',
      margin: '0 auto',
      fontFamily: 'var(--font-family)'
    }}>
      <style>{`
        @keyframes staggerFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineGrow {
          from { height: 0; opacity: 0; }
          to { height: 32px; opacity: 1; }
        }
        .animate-item {
          opacity: 0;
          animation: staggerFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-line {
          opacity: 0;
          animation: lineGrow 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .guide-step-card {
          display: flex;
          align-items: flex-start;
          gap: 24px;
          padding: 24px;
          background-color: var(--theme-canvas);
          border: 1px solid var(--theme-border);
          border-radius: 16px;
          position: relative;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .guide-step-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
          border-color: var(--primary);
        }
        
        .guide-step-icon {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background-color: var(--theme-surface-strong);
          color: var(--theme-ink);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .guide-step-card:hover .guide-step-icon {
          background-color: var(--primary);
          color: var(--on-primary);
          transform: scale(1.05);
        }

        .guide-step-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background-color: var(--theme-surface-strong);
          color: var(--theme-ink);
          font-size: 12px;
          font-weight: 700;
          margin-right: 12px;
          transition: all 0.3s ease;
        }

        .guide-step-card:hover .guide-step-number {
          background-color: var(--primary);
          color: var(--on-primary);
        }
      `}</style>

      {/* Hero Header */}
      <div className="animate-item" style={{ textAlign: 'center', marginBottom: '48px', animationDelay: '0.1s' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 700, 
          letterSpacing: '-0.5px',
          color: 'var(--theme-ink)', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <span style={{ 
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '44px', height: '44px', borderRadius: '12px',
            backgroundColor: 'var(--primary)',
            color: 'var(--on-primary)',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          </span>
          วิธีการออกจดหมาย
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: 'var(--muted)', 
          maxWidth: '500px', 
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          เรียนรู้ขั้นตอนการเตรียมเอกสารและสั่งพิมพ์แบบมืออาชีพ ผ่าน 4 ขั้นตอนง่ายๆ ที่ถูกออกแบบมาเพื่อความรวดเร็ว
        </p>
      </div>

      {/* Steps Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', position: 'relative' }}>
        {steps.map((step, index) => (
          <div key={step.id} style={{ position: 'relative' }}>
            <div className="animate-item guide-step-card" style={{ animationDelay: `${0.1 + (index + 1) * 0.1}s` }}>
              
              {/* Icon */}
              <div className="guide-step-icon">
                {step.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="guide-step-number">{step.id}</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--theme-ink)', margin: 0 }}>
                    {step.title}
                  </h3>
                </div>
                <p style={{ fontSize: '15px', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
                  {step.description}
                </p>
              </div>
            </div>

            {/* Connection Line */}
            {index < steps.length - 1 && (
              <div className="animate-line" style={{
                position: 'absolute',
                left: '52px',
                bottom: '-32px',
                width: '2px',
                height: '32px',
                backgroundColor: 'var(--theme-border)',
                transform: 'translateX(-50%)',
                zIndex: 0,
                animationDelay: `${0.3 + (index + 1) * 0.1}s`
              }} />
            )}
          </div>
        ))}
      </div>
      
    </div>
  );
}
