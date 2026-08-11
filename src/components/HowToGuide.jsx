import React from 'react';

export default function HowToGuide() {
  const steps = [
    {
      id: 1,
      title: 'ค้นหาและเลือกลูกค้า',
      description: 'ใช้กล่องค้นหาเพื่อหาชื่อลูกค้าที่ต้องการ และคลิกที่แถวหรือช่องทำเครื่องหมายเพื่อเลือกรายการ (สามารถเลือกได้หลายรายการพร้อมกัน)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
          <path d="m9 11 1.5 1.5 3-3"></path>
        </svg>
      ),
      color: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)'
    },
    {
      id: 2,
      title: 'ตั้งค่าคำนำหน้าชื่อ',
      description: 'กำหนดคำนำหน้าชื่อ (เช่น คุณ, บริษัท) ให้กับลูกค้าแต่ละราย หรือใช้ฟังก์ชัน "ตั้งทั้งหมด" ในแถบด้านล่างเพื่อกำหนดให้ทุกคนที่เลือกไว้ในคลิกเดียว',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
          <line x1="7" y1="7" x2="7.01" y2="7"></line>
        </svg>
      ),
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)'
    },
    {
      id: 3,
      title: 'เลือกผู้มีอำนาจลงนาม',
      description: 'ในแถบเครื่องมือด้านล่างสุด ให้เลือกผู้ที่จะลงนามในเอกสาร (ระบบจะจดจำค่าเริ่มต้นที่คุณเคยตั้งไว้ให้โดยอัตโนมัติ)',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          <path d="M15 5l3 3"></path>
        </svg>
      ),
      color: '#8b5cf6',
      bg: 'rgba(139, 92, 246, 0.1)'
    },
    {
      id: 4,
      title: 'พิมพ์เอกสาร',
      description: 'กดปุ่ม "พิมพ์" ระบบจะสร้างเอกสารจดหมายราชการที่มีขนาดตัวอักษร การจัดหน้า และช่องไฟภาษาไทยที่สวยงาม พร้อมสำหรับสั่งพิมพ์ทันที',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 6 2 18 2 18 9"></polyline>
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
          <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
      ),
      color: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)'
    }
  ];

  return (
    <div style={{
      padding: 'var(--spacing-xl) 0',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h2 className="text-display-sm" style={{ marginBottom: '8px' }}>วิธีการออกจดหมาย</h2>
        <p className="text-body-md text-muted">
          เรียนรู้ขั้นตอนการจัดเตรียมและพิมพ์เอกสารอย่างถูกต้องใน 4 ขั้นตอนง่ายๆ
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {steps.map((step, index) => (
          <div key={step.id} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--spacing-lg)',
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--canvas-light)',
            border: '1px solid var(--hairline-on-light)',
            borderRadius: 'var(--rounded-xl)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Accent */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, bottom: 0,
              width: '4px',
              backgroundColor: step.color
            }} />
            
            {/* Icon */}
            <div style={{
              flexShrink: 0,
              width: '64px',
              height: '64px',
              borderRadius: 'var(--rounded-xl)',
              backgroundColor: step.bg,
              color: step.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {step.icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: step.color,
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 700
                }}>
                  {step.id}
                </span>
                <h3 className="text-title-md">{step.title}</h3>
              </div>
              <p className="text-body-md text-muted" style={{ lineHeight: 1.6 }}>
                {step.description}
              </p>
            </div>
            
            {/* Connection Line (except last) */}
            {index < steps.length - 1 && (
              <div style={{
                position: 'absolute',
                left: '52px',
                bottom: '-24px',
                width: '2px',
                height: '24px',
                backgroundColor: 'var(--hairline-on-light)',
                zIndex: -1
              }} />
            )}
          </div>
        ))}
      </div>
      
      <div style={{
        marginTop: 'var(--spacing-xl)',
        padding: 'var(--spacing-lg)',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        borderRadius: 'var(--rounded-lg)',
        border: '1px dashed rgba(59, 130, 246, 0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)'
      }}>
        <div style={{ fontSize: '24px' }}>💡</div>
        <div>
          <h4 className="text-title-sm" style={{ color: 'var(--info)' }}>เคล็ดลับ</h4>
          <p className="text-body-sm text-muted">
            หากตัวหนังสือภาษาไทยเรียงช่องไฟไม่สวยขณะสั่งพิมพ์ ให้แน่ใจว่าหน้าต่าง Preview ของเบราว์เซอร์ได้เลือกเครื่องพิมพ์ปลายทางเป็น <strong>"Save as PDF"</strong> หรือเครื่องพิมพ์ขนาด A4 เพื่อให้ระบบจัดหน้าได้สมบูรณ์ที่สุด
          </p>
        </div>
      </div>
    </div>
  );
}
