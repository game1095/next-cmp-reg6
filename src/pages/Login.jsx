import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Button from "../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 100;
    const y = (clientY / window.innerHeight) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff", // Canvas Light
        padding: "var(--spacing-md)",
        position: "relative",
        fontFamily: "var(--font-family)",
        color: "#181a20", // Ink
      }}
    >
      <style>{`
        @keyframes cardEntrance {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes staggerFadeUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .login-btn-primary {
          background-color: #FCD535 !important;
          color: #181a20 !important;
          border: none !important;
          border-radius: 6px !important;
          transition: background-color 0.2s ease !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          height: 48px !important;
        }
        .login-btn-primary:hover:not(:disabled) {
          background-color: #f0b90b !important;
        }
        .premium-input {
          width: 100%; height: 48px; padding: 0 16px; border-radius: 6px; font-size: 14px;
          background-color: #f5f5f5; border: 1px solid #eaecef; color: #181a20;
          outline: none; transition: border-color 0.2s ease;
          font-family: var(--font-family);
        }
        .premium-input:focus {
          border-color: #FCD535;
        }
        .premium-input::placeholder {
          color: #707a8a;
        }
        .feature-icon-box {
          width: 44px; height: 44px; border-radius: 12px;
          background-color: #f5f5f5; border: 1px solid #eaecef;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .animate-stagger-1 { animation: staggerFadeUp 0.4s ease-out forwards; animation-delay: 0.1s; opacity: 0; }
        .animate-stagger-2 { animation: staggerFadeUp 0.4s ease-out forwards; animation-delay: 0.2s; opacity: 0; }
        .animate-stagger-3 { animation: staggerFadeUp 0.4s ease-out forwards; animation-delay: 0.3s; opacity: 0; }
        .animate-stagger-4 { animation: staggerFadeUp 0.4s ease-out forwards; animation-delay: 0.4s; opacity: 0; }
      `}</style>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "64px",
          width: "100%",
          maxWidth: "1200px",
          zIndex: 1,
          flexWrap: "wrap",
        }}
      >
        {/* Left Side: Features & Value Proposition */}
        <div style={{ flex: "1 1 500px", padding: "20px" }}>
          <h1
            className="animate-stagger-1"
            style={{
              fontSize: "48px",
              fontWeight: 700,
              color: "#181a20",
              marginBottom: "24px",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
            }}
          >
            ยกระดับการทำงาน
            <br />
            <span style={{ color: "#FCD535" }}>ไปรษณีย์ไทย</span>
          </h1>
          <p
            className="animate-stagger-2"
            style={{
              color: "#707a8a",
              fontSize: "16px",
              marginBottom: "48px",
              lineHeight: 1.6,
              maxWidth: "440px",
            }}
          >
            ระบบจัดการฐานข้อมูลลูกค้าและออกเอกสารราชการอัตโนมัติ
            ที่ออกแบบมาเพื่อความรวดเร็วและแม่นยำ
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            {/* Feature 1 */}
            <div
              className="animate-stagger-2"
              style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}
            >
              <div className="feature-icon-box">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FCD535"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div>
                <div
                  style={{
                    color: "#181a20",
                    fontWeight: 600,
                    fontSize: "16px",
                    marginBottom: "4px",
                  }}
                >
                  ออกเอกสาร & PDF อัตโนมัติ
                </div>
                <div
                  style={{
                    color: "#707a8a",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    maxWidth: "340px",
                  }}
                >
                  สร้างจดหมายราชการและส่งออกเป็น PDF
                  ได้หลายรายการพร้อมกันในคลิกเดียว ตามมาตรฐานที่ถูกต้อง
                </div>
              </div>
            </div>
            {/* Feature 2 */}
            <div
              className="animate-stagger-3"
              style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}
            >
              <div className="feature-icon-box">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FCD535"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div>
                <div
                  style={{
                    color: "#181a20",
                    fontWeight: 600,
                    fontSize: "16px",
                    marginBottom: "4px",
                  }}
                >
                  จัดการข้อมูลลูกค้าครบวงจร
                </div>
                <div
                  style={{
                    color: "#707a8a",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    maxWidth: "340px",
                  }}
                >
                  ระบบค้นหา กรอง
                  และจัดการข้อมูลผู้ใช้บริการจำนวนมากได้อย่างมีประสิทธิภาพและรวดเร็ว
                </div>
              </div>
            </div>
            {/* Feature 3 */}
            <div
              className="animate-stagger-4"
              style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}
            >
              <div className="feature-icon-box">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FCD535"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
                </svg>
              </div>
              <div>
                <div
                  style={{
                    color: "#181a20",
                    fontWeight: 600,
                    fontSize: "16px",
                    marginBottom: "4px",
                  }}
                >
                  ประสบการณ์ใช้งานระดับ Premium
                </div>
                <div
                  style={{
                    color: "#707a8a",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    maxWidth: "340px",
                  }}
                >
                  ดีไซน์ที่สวยงาม ทันสมัย และตอบสนองรวดเร็วในทุกการคลิก
                  ช่วยให้การทำงานไม่น่าเบื่ออีกต่อไป
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Solid Card */}
        <div
          style={{
            flex: "1 1 400px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff", // Canvas Light
              borderRadius: "12px",
              padding: "48px 40px",
              width: "100%",
              maxWidth: "420px",
              border: "1px solid #eaecef", // Hairline on Light
              borderTop: "4px solid #FCD535", // Brand Accent Border
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.05)", // Gentle shadow for Light Mode
              animation: "cardEntrance 0.6s ease-out forwards",
            }}
          >
            {/* Logo Mark */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "32px",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  backgroundColor: "#FCD535",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#181a20"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>

            {/* Headings */}
            <h1
              className="animate-stagger-1"
              style={{
                marginBottom: "8px",
                textAlign: "center",
                fontSize: "28px",
                fontWeight: 700,
                color: "#181a20",
                letterSpacing: "-0.5px",
              }}
            >
              Welcome to CMP-Core
            </h1>
            <p
              className="animate-stagger-2"
              style={{
                marginBottom: "32px",
                textAlign: "center",
                color: "#707a8a",
                fontSize: "14px",
              }}
            >
              Secure access to your postal registry
            </p>

            {/* Error State */}
            {error && (
              <div
                style={{
                  color: "#f6465d",
                  backgroundColor: "rgba(246, 70, 93, 0.1)",
                  border: "1px solid rgba(246, 70, 93, 0.2)",
                  padding: "12px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span>⚠️</span> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin}>
              <div
                className="animate-stagger-3"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  marginBottom: "32px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#181a20",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="e.g. 64000@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="premium-input"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#181a20",
                    }}
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="premium-input"
                  />
                </div>
              </div>

              <div className="animate-stagger-4">
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
                  className="login-btn-primary"
                >
                  {loading ? "Authenticating..." : "Log In"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Signature */}
      <div
        className="animate-stagger-4"
        style={{
          position: "absolute",
          bottom: "32px",
          width: "100%",
          textAlign: "center",
          color: "#707a8a",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: "0.5px",
        }}
      >
        Better by Design{" "}
        <span style={{ color: "#181a20", fontWeight: 700 }}>คนทำงานดวด</span>
      </div>
    </div>
  );
}
