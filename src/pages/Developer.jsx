import React, { useState, useRef } from "react";
import Swal from "sweetalert2";

// --- Data ---
const techStack = [
  { name: "React", desc: "UI Library", icon: "fa-brands fa-react", color: "#61DAFB", animate: "spin-slow" },
  { name: "Vite", desc: "Build Tool", icon: "fa-solid fa-bolt", color: "#646CFF", animate: "pulse-fast" },
  { name: "Supabase", desc: "Database & Auth", icon: "fa-solid fa-database", color: "#3ECF8E", animate: "float-slight" },
  { name: "Canvas API", desc: "Image Processing", icon: "fa-solid fa-palette", color: "#FF6B6B", animate: "wiggle" },
  { name: "html2pdf.js", desc: "PDF Generation", icon: "fa-solid fa-file-pdf", color: "#FCD535", animate: "float-slight" },
  { name: "SweetAlert2", desc: "Dialogs", icon: "fa-solid fa-message", color: "#8a2be2", animate: "pulse-fast" }
];

// --- 3D Tilt Card Component ---
const TiltCard = ({ children, delay = 0, style }) => {
  const cardRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg tilt
    const rotateY = ((x - centerX) / centerX) * 15;

    setRotate({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare({ ...glare, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
        animation: `slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s both`,
        height: "100%",
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`
            : "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
          transition: isHovered
            ? "transform 0.1s ease-out"
            : "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          position: "relative",
          borderRadius: "var(--rounded-xl)",
          backgroundColor: "var(--theme-surface-strong)",
          border: "1px solid var(--theme-border)",
          overflow: "hidden",
          boxShadow: isHovered
            ? "0 20px 40px rgba(0,0,0,0.1), 0 0 20px rgba(252, 213, 53, 0.1)"
            : "0 4px 12px rgba(0,0,0,0.02)",
        }}
      >
        {/* Glare effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}), transparent 60%)`,
            pointerEvents: "none",
            zIndex: 10,
            transition: isHovered ? "none" : "opacity 0.5s ease",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            transform: isHovered ? "translateZ(30px)" : "translateZ(0)",
            transition: "transform 0.2s",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Developer() {
  const [clickCount, setClickCount] = useState(0);

  const handleDeveloperClick = () => {
    const newCount = clickCount + 1;
    if (newCount === 99) {
      document.body.classList.add("crazy-shake");

      Swal.fire({
        title: "⚠️ คำเตือนระบบรวน!",
        text: "หัวหน้าครับ พ่อผมบอกว่ามันทำงานมั่ว อย่าไปเชื่อมันนะครับ!!!",
        icon: "warning",
        confirmButtonColor: "var(--primary)",
        confirmButtonText: "พ่อมึงเซ็นงานกู พ่อมึงก็มั่ว :P",
        background: "var(--theme-canvas)",
        color: "var(--theme-ink)",
        backdrop: `rgba(0, 0, 0, 0.8)`,
      }).then(() => {
        document.body.classList.remove("crazy-shake");
      });
      setClickCount(0);
    } else {
      setClickCount(newCount);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--theme-canvas)",
        position: "relative",
        overflow: "hidden",
        paddingBottom: "120px"
      }}
    >
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(40px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes floatAnim {
          0% { transform: translateY(0px) rotate(0deg); filter: drop-shadow(0 10px 10px rgba(0,0,0,0.1)); }
          50% { transform: translateY(-15px) rotate(2deg); filter: drop-shadow(0 25px 20px rgba(0,0,0,0.15)); }
          100% { transform: translateY(0px) rotate(0deg); filter: drop-shadow(0 10px 10px rgba(0,0,0,0.1)); }
        }
        @keyframes glowPulse {
          0% { box-shadow: 0 0 20px rgba(252,213,53,0.3), inset 0 0 10px rgba(252,213,53,0.2); }
          50% { box-shadow: 0 0 40px rgba(252,213,53,0.5), inset 0 0 20px rgba(252,213,53,0.3); }
          100% { box-shadow: 0 0 20px rgba(252,213,53,0.3), inset 0 0 10px rgba(252,213,53,0.2); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes crazyShake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        @keyframes pulseFast {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes floatSlight {
          0% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
          100% { transform: translateY(0); }
        }
        @keyframes wiggleIcon {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .icon-spin-slow { animation: spinSlow 6s linear infinite; display: inline-block; }
        .icon-pulse-fast { animation: pulseFast 2s ease-in-out infinite; display: inline-block; }
        .icon-float-slight { animation: floatSlight 3s ease-in-out infinite; display: inline-block; }
        .icon-wiggle { animation: wiggleIcon 2s ease-in-out infinite; display: inline-block; }
        .crazy-shake {
          animation: crazyShake 0.4s infinite;
          filter: hue-rotate(90deg) contrast(150%) brightness(1.2);
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
          top: "10%",
          left: "20%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(252,213,53,0.08) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
          filter: "blur(40px)",
          animation: "floatAnim 10s ease-in-out infinite alternate",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(150,150,150,0.05) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
          filter: "blur(50px)",
          animation: "floatAnim 12s ease-in-out infinite alternate-reverse",
        }}
      />

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "80px 24px 0", position: "relative", zIndex: 1 }}>
        
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
            <i className="fa-solid fa-layer-group" style={{ fontSize: '28px' }}></i>
          </div>
          <h1
            style={{
              fontSize: "48px", color: "var(--theme-ink)", marginBottom: "20px",
              letterSpacing: "-0.5px", fontWeight: 700, lineHeight: 1.1,
              fontFamily: "var(--font-family)"
            }}
          >
            Built with precision.<br />
            <span className="gradient-text">Better by Design.</span>
          </h1>
          <p
            style={{
              maxWidth: "540px", margin: "0 auto", lineHeight: 1.6,
              fontSize: "16px", color: "var(--muted)", fontWeight: 400
            }}
          >
            ทีมงานผู้สร้างสรรค์และเทคโนโลยีที่อยู่เบื้องหลังความพรีเมียมของระบบ <strong>CMP-Core</strong> เพื่อยกระดับประสบการณ์การปฏิบัติงานให้เป็นเลิศ
          </p>
        </div>

        {/* ── 2. Support The Developer (QR Promo Card Full-Width) ── */}
        <div style={{ 
          backgroundColor: "var(--theme-surface-strong)",
          borderRadius: "var(--rounded-xl)",
          padding: "56px 48px",
          border: "1px solid var(--theme-border)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.05)",
          position: "relative",
          overflow: "hidden",
          animation: "slideUpFade 0.8s ease both 0.2s",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "48px",
          marginBottom: "80px"
        }}>
          {/* Animated Gradient Border Top */}
          <div
            style={{
              position: "absolute", top: 0, left: 0, right: 0, height: "4px",
              background: "linear-gradient(90deg, #FCD535 0%, #F59E0B 50%, #FCD535 100%)",
              backgroundSize: "200% 100%", animation: "glowPulse 3s infinite",
            }}
          />

          {/* Left Text */}
          <div style={{ flex: "1 1 400px" }}>
            <div style={{
                fontSize: "13px", color: "var(--on-primary)", fontWeight: 800, textTransform: "uppercase",
                letterSpacing: "1px", marginBottom: "20px", backgroundColor: "var(--primary)",
                padding: "6px 16px", borderRadius: "100px", display: "inline-block"
            }}>
              Support the Mission
            </div>
            <h2 style={{ fontSize: "40px", color: "var(--theme-ink)", fontWeight: 700, marginBottom: "16px", lineHeight: 1.2 }}>
              สนับสนุน <br/> ผู้พัฒนา
            </h2>
            <p style={{ fontSize: "16px", color: "var(--muted)", lineHeight: 1.6, fontWeight: 400, maxWidth: "480px" }}>
              การสร้างระบบที่ยอดเยี่ยมต้องใช้ทั้งเวลาและพลังงาน หาก CMP-Core ช่วยยกระดับการปฏิบัติงานและประหยัดเวลาของท่าน 
              ท่านสามารถร่วมสนับสนุนค่ากาแฟและอาหารกลางวันให้กับทีมงานได้ผ่าน QR Code นี้ 💛
            </p>
          </div>

          {/* Right QR */}
          <div style={{ flex: "0 0 auto", margin: "0 auto", position: "relative" }}>
            {/* Ambient background glow for QR */}
            <div style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
                width: "280px", height: "280px", background: "radial-gradient(circle, rgba(252,213,53,0.2) 0%, transparent 60%)",
                filter: "blur(20px)", zIndex: 0, pointerEvents: "none", animation: "glowPulse 4s infinite"
            }} />
            
            <div style={{
                width: "240px", height: "240px", background: "#ffffff", borderRadius: "24px",
                padding: "12px", position: "relative", zIndex: 1,
                boxShadow: "0 20px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(252,213,53,0.2)",
                animation: "floatAnim 6s ease-in-out infinite"
            }}>
              <img
                src="/images/support-qr.png"
                alt="QR Code สำหรับสนับสนุน"
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", borderRadius: "16px" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
              />
              <div style={{
                  position: "absolute", inset: "12px", display: "none", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", background: "rgba(252, 213, 53, 0.05)",
                  color: "rgba(252, 213, 53, 0.6)", fontSize: "13px", fontWeight: 600, textAlign: "center", borderRadius: "16px"
              }}>
                <i className="fa-solid fa-camera" style={{ fontSize: '28px', marginBottom: '8px' }}></i>
                วางไฟล์<br/>support-qr.png<br/>ที่นี่
              </div>
            </div>
          </div>
          
        </div>

        {/* ── 3. The Team Section ── */}
        <div style={{ marginBottom: "80px" }}>
          <h2 style={{ fontSize: "24px", color: "var(--theme-ink)", marginBottom: "32px", textAlign: "center", fontWeight: 600 }}>The Team</h2>
          <div
            style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "32px", maxWidth: "900px", margin: "0 auto"
            }}
          >
            {/* Idea By */}
            <TiltCard delay={0.4}>
              <div
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "48px 32px", height: "100%", position: "relative",
                  background: "linear-gradient(180deg, var(--theme-canvas) 0%, var(--theme-surface-strong) 100%)",
                }}
              >
                <div style={{
                    position: "absolute", top: "20px", width: "180px", height: "180px",
                    background: "conic-gradient(from 0deg, transparent 0%, rgba(252, 213, 53, 0.15) 25%, transparent 50%)",
                    borderRadius: "50%", animation: "spinSlow 10s linear infinite", zIndex: 0, filter: "blur(20px)"
                }} />
                <div style={{
                    width: "140px", height: "140px", display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "40px", animation: "floatAnim 5s ease-in-out infinite", zIndex: 1
                }}>
                  <img src="/images/idea.svg" alt="Idea" style={{ maxWidth: "100%", maxHeight: "100%", filter: "drop-shadow(0 15px 15px rgba(252, 213, 53, 0.15))" }} />
                </div>
                <div style={{ textAlign: "center", marginTop: "auto", zIndex: 1 }}>
                  <div style={{
                      fontSize: "12px", color: "var(--primary)", fontWeight: 800, textTransform: "uppercase",
                      letterSpacing: "1.5px", marginBottom: "16px", backgroundColor: "rgba(252, 213, 53, 0.1)",
                      border: "1px solid rgba(252, 213, 53, 0.2)", padding: "8px 20px", borderRadius: "100px", display: "inline-block"
                  }}>
                    Visionary Concept
                  </div>
                  <div style={{ fontSize: "36px", fontWeight: 900, color: "var(--theme-ink)" }}>ฮ.ฮูก</div>
                </div>
              </div>
            </TiltCard>

            {/* Developed By */}
            <TiltCard delay={0.5}>
              <div
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "48px 32px", height: "100%", position: "relative",
                  background: "linear-gradient(180deg, var(--theme-canvas) 0%, var(--theme-surface-strong) 100%)",
                }}
              >
                <div style={{
                    position: "absolute", top: "20px", width: "180px", height: "180px",
                    background: "conic-gradient(from 0deg, transparent 0%, rgba(200, 200, 200, 0.15) 25%, transparent 50%)",
                    borderRadius: "50%", animation: "spinSlow 8s linear infinite reverse", zIndex: 0, filter: "blur(20px)"
                }} />
                <div style={{
                    width: "140px", height: "140px", display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "40px", animation: "floatAnim 6s ease-in-out infinite 1s", zIndex: 1
                }}>
                  <img src="/images/coder.svg" alt="Coder" style={{ maxWidth: "100%", maxHeight: "100%", filter: "drop-shadow(0 15px 15px rgba(255, 255, 255, 0.05))" }} />
                </div>
                <div style={{ textAlign: "center", marginTop: "auto", zIndex: 1 }}>
                  <div style={{
                      fontSize: "12px", color: "var(--theme-ink)", fontWeight: 800, textTransform: "uppercase",
                      letterSpacing: "1.5px", marginBottom: "16px", backgroundColor: "var(--theme-canvas)",
                      border: "1px solid var(--theme-border)", padding: "8px 20px", borderRadius: "100px", display: "inline-block"
                  }}>
                    Design & Code
                  </div>
                  <div
                    className="gradient-text"
                    onClick={handleDeveloperClick}
                    title={clickCount > 0 ? `เหลืออีก ${99 - clickCount} คลิก...` : "คลิกดูสิ มีความลับซ่อนอยู่"}
                    style={{
                      fontSize: "36px", fontWeight: 900, userSelect: "none", cursor: "pointer",
                      transition: "transform 0.2s, filter 0.2s", position: "relative"
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.filter = "brightness(1.2)"; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.filter = "brightness(1)"; }}
                  >
                    คนทำงานดวด
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* ── 4. Tech Stack Section (Trust Badges) ── */}
        <div style={{ marginBottom: "100px", textAlign: "center" }}>
          <h2 style={{ fontSize: "24px", color: "var(--theme-ink)", marginBottom: "32px", fontWeight: 600 }}>Core Technology</h2>
          <div style={{ 
            display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", maxWidth: "800px", margin: "0 auto"
          }}>
            {techStack.map((tech, i) => (
              <div key={tech.name} style={{
                display: "flex", alignItems: "center", gap: "16px",
                backgroundColor: "var(--theme-surface-strong)",
                padding: "16px 24px", borderRadius: "var(--rounded-lg)",
                border: "1px solid var(--theme-border)",
                animation: `slideUpFade 0.5s ease both ${(i * 0.1) + 0.6}s`,
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default"
              }}
              onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.04)"; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <span style={{ fontSize: "24px", color: tech.color, width: "32px", textAlign: "center" }} className={`icon-${tech.animate}`}>
                  <i className={tech.icon}></i>
                </span>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--theme-ink)", fontFamily: "var(--font-family)" }}>{tech.name}</div>
                  <div style={{ fontSize: "13px", color: "var(--muted)", fontWeight: 500 }}>{tech.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
