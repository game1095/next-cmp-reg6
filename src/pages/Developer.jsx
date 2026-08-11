import React, { useState, useRef } from "react";
import Swal from "sweetalert2";

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
          backgroundColor: "var(--theme-canvas)",
          border: "1px solid var(--theme-border)",
          overflow: "hidden",
          boxShadow: isHovered
            ? "0 20px 40px rgba(0,0,0,0.1), 0 0 20px rgba(59,130,246,0.1)"
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
    if (newCount === 9999) {
      document.body.classList.add("crazy-shake");

      Swal.fire({
        title: "⚠️ คำเตือนระบบรวน!",
        text: "หัวหน้าครับ พ่อผมบอกว่ามันทำงานมั่ว อย่าไปเชื่อมันนะครับ!!!",
        icon: "warning",
        confirmButtonColor: "var(--trading-down)",
        confirmButtonText: "พ่อมึงเซ็นงานกู พ่อมึงก็มั่ว :P",
        background: "var(--theme-canvas)",
        color: "var(--theme-ink)",
        backdrop: `rgba(246, 70, 93, 0.4)`,
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "75vh",
        padding: "var(--spacing-xl)",
        position: "relative",
        overflow: "hidden",
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
          0% { box-shadow: 0 0 20px rgba(59,130,246,0.3), inset 0 0 10px rgba(59,130,246,0.2); }
          50% { box-shadow: 0 0 50px rgba(139,92,246,0.5), inset 0 0 20px rgba(139,92,246,0.3); }
          100% { box-shadow: 0 0 20px rgba(59,130,246,0.3), inset 0 0 10px rgba(59,130,246,0.2); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent-purple, #8b5cf6) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        .gradient-text-2 {
          background: linear-gradient(135deg, #f59e0b 0%, #ec4899 100%);
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
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      {/* Spectacular Animated Orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "20%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          zIndex: -1,
          pointerEvents: "none",
          filter: "blur(40px)",
          animation: "floatAnim 10s ease-in-out infinite alternate",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "20%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
          zIndex: -1,
          pointerEvents: "none",
          filter: "blur(50px)",
          animation: "floatAnim 12s ease-in-out infinite alternate-reverse",
        }}
      />

      <div
        style={{
          backgroundColor: "var(--theme-canvas)",
          border: "1px solid var(--theme-border)",
          borderRadius: "24px",
          padding: "48px 40px",
          maxWidth: "800px",
          width: "100%",
          boxShadow: "0 24px 60px rgba(0,0,0,0.05)",
          textAlign: "center",
          position: "relative",
          animation: `slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both`,
        }}
      >
        {/* Animated Gradient Border Top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%)",
            backgroundSize: "200% 100%",
            animation: "glowPulse 3s infinite",
            borderTopLeftRadius: "24px",
            borderTopRightRadius: "24px",
          }}
        />

        <div style={{ marginBottom: "48px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "80px",
              height: "80px",
              borderRadius: "24px",
              background:
                "linear-gradient(135deg, rgba(59,130,246,0.2) 0%, rgba(139,92,246,0.2) 100%)",
              color: "var(--primary)",
              marginBottom: "24px",
              fontSize: "36px",
              boxShadow: "0 8px 32px rgba(59,130,246,0.2)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            👨‍💻
          </div>
          <h1
            className="text-display-sm"
            style={{
              color: "var(--theme-ink)",
              marginBottom: "16px",
              letterSpacing: "-0.5px",
              fontWeight: 800,
            }}
          >
            Meet The <span className="gradient-text">Developer</span>
          </h1>
          <p
            className="text-body-lg text-muted"
            style={{
              maxWidth: "460px",
              margin: "0 auto",
              lineHeight: 1.6,
              fontSize: "16px",
            }}
          >
            ทีมงานผู้สร้างสรรค์และอยู่เบื้องหลังความพรีเมียมของระบบ CMP-Core
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "40px",
          }}
        >
          {/* Idea By */}
          <TiltCard delay={0.2}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "48px 32px",
                height: "100%",
                backgroundColor: "var(--theme-surface-strong)",
                background:
                  "linear-gradient(180deg, var(--theme-canvas) 0%, var(--theme-surface-strong) 100%)",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Spinning background halo */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  width: "180px",
                  height: "180px",
                  background:
                    "conic-gradient(from 0deg, transparent 0%, rgba(245, 158, 11, 0.2) 25%, transparent 50%)",
                  borderRadius: "50%",
                  animation: "spinSlow 10s linear infinite",
                  zIndex: -1,
                  filter: "blur(20px)",
                }}
              />

              <div
                style={{
                  width: "140px",
                  height: "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "40px",
                  animation: "floatAnim 5s ease-in-out infinite",
                }}
              >
                <img
                  src="/images/idea.svg"
                  alt="Idea"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    filter: "drop-shadow(0 15px 15px rgba(245, 158, 11, 0.2))",
                  }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "auto" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#d97706",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    marginBottom: "16px",
                    backgroundColor: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                    padding: "8px 20px",
                    borderRadius: "100px",
                    display: "inline-block",
                  }}
                >
                  Visionary Concept
                </div>
                <div
                  className="gradient-text-2"
                  style={{
                    fontSize: "36px",
                    fontWeight: 900,
                  }}
                >
                  ฮ.ฮูก
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Design & Developed By */}
          <TiltCard delay={0.4}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "48px 32px",
                height: "100%",
                backgroundColor: "var(--theme-surface-strong)",
                background:
                  "linear-gradient(180deg, var(--theme-canvas) 0%, var(--theme-surface-strong) 100%)",
                position: "relative",
                zIndex: 1,
              }}
            >
              {/* Spinning background halo */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  width: "180px",
                  height: "180px",
                  background:
                    "conic-gradient(from 0deg, transparent 0%, rgba(139, 92, 246, 0.2) 25%, transparent 50%)",
                  borderRadius: "50%",
                  animation: "spinSlow 8s linear infinite reverse",
                  zIndex: -1,
                  filter: "blur(20px)",
                }}
              />

              <div
                style={{
                  width: "140px",
                  height: "140px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "40px",
                  animation: "floatAnim 6s ease-in-out infinite 1s",
                }}
              >
                <img
                  src="/images/coder.svg"
                  alt="Coder"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    filter: "drop-shadow(0 15px 15px rgba(139, 92, 246, 0.2))",
                  }}
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "auto" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--accent-purple, #8b5cf6)",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    marginBottom: "16px",
                    backgroundColor: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    padding: "8px 20px",
                    borderRadius: "100px",
                    display: "inline-block",
                  }}
                >
                  Code & Design
                </div>
                <div
                  className="gradient-text"
                  style={{
                    fontSize: "36px",
                    fontWeight: 900,
                    userSelect: "none",
                    cursor: "pointer",
                    transition: "transform 0.2s, filter 0.2s",
                    position: "relative",
                  }}
                  onClick={handleDeveloperClick}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.filter = "brightness(1.2)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.filter = "brightness(1)";
                  }}
                  title={
                    clickCount > 0
                      ? `เหลืออีก ${1000 - clickCount} คลิก...`
                      : "คลิกดูสิ มีความลับซ่อนอยู่"
                  }
                >
                  คนทำงานมั่ว
                </div>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </div>
  );
}
