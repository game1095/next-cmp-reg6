import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Button from "../components/Button";

const resourceLinks = [
  {
    category: "Other Resources",
    icon: "fa-link",
    links: [
      {
        name: "คู่มือ THP Core",
        url: "https://drive.google.com/drive/folders/163UOLiYvD_q4D5zh_0OvfqjWoDTNApyI",
      },
      {
        name: "เว็บ Omnichannel",
        url: "https://omnichannel.thpcore.com/",
      },
      {
        name: "คู่มือ BOM สำหรับเขต",
        url: "https://docs.google.com/document/d/1AJWg6jSHgiAQy6EbU4NmSuJlY6g5ecPe/edit#heading=h.rg4pxxxh7j1q",
      },
    ],
  },
  {
    category: "การเข้าใช้งานระบบ BOM (สำหรับ CMP)",
    icon: "fa-server",
    links: [
      { name: "60110 ปณ.หนองบัว", url: "https://reg6-bom.thpcore.com/web/login?db=60110" },
      { name: "60220 ปณ.ไพศาลี", url: "https://reg6-bom.thpcore.com/web/login?db=60220" },
      { name: "60170 ปณ.โกรกพระ", url: "https://reg6-bom.thpcore.com/web/login?db=60170" },
      { name: "60240 ปณ.หนองเบน", url: "https://reg6-bom.thpcore.com/web/login?db=60240" },
      { name: "61120 ปณ.ทัพทัน", url: "https://reg6-bom.thpcore.com/web/login?db=61120" },
      { name: "61150 ปณ.สว่างอารมณ์", url: "https://reg6-bom.thpcore.com/web/login?db=61150" },
      { name: "62140 ปณ.สลกบาตร", url: "https://reg6-bom.thpcore.com/web/login?db=62140" },
      { name: "62150 ปณ.ไทรงาม", url: "https://reg6-bom.thpcore.com/web/login?db=62150" },
      { name: "62190 ปณ.ทุ่งทราย", url: "https://reg6-bom.thpcore.com/web/login?db=62190" },
      { name: "62130 ปณ.ขาณุวรลักษบุรี", url: "https://reg6-bom.thpcore.com/web/login?db=62130" },
      { name: "62170 ปณ.ลานกระบือ", url: "https://reg6-bom.thpcore.com/web/login?db=62170" },
      { name: "64210 ปณ.เมืองเก่า", url: "https://reg6-bom.thpcore.com/web/login?db=64210" },
      { name: "64230 ปณ.บ้านใหม่ไชยมงคล", url: "https://reg6-bom.thpcore.com/web/login?db=64230" },
      { name: "64190 ปณ.ท่าชัย", url: "https://reg6-bom.thpcore.com/web/login?db=64190" },
      { name: "64220 ปณ.บ้านสวน", url: "https://reg6-bom.thpcore.com/web/login?db=64220" },
      { name: "65160 ปณ.วัดโบสถ์", url: "https://reg6-bom.thpcore.com/web/login?db=65160" },
      { name: "65180 ปณ.หนองตม", url: "https://reg6-bom.thpcore.com/web/login?db=65180" },
      { name: "64170 ปณ.กงไกรลาศ", url: "https://reg6-bom.thpcore.com/web/login?db=64170" },
      { name: "65220 ปณ.แก่งโสภา", url: "https://reg6-bom.thpcore.com/web/login?db=65220" },
      { name: "65190 ปณ.เนินมะปราง", url: "https://reg6-bom.thpcore.com/web/login?db=65190" },
      { name: "67210 ปณ.วังชมภู", url: "https://reg6-bom.thpcore.com/web/login?db=67210" },
      { name: "67220 ปณ.นาเฉลียง", url: "https://reg6-bom.thpcore.com/web/login?db=67220" },
      { name: "67280 ปณ.แคมป์สน", url: "https://reg6-bom.thpcore.com/web/login?db=67280" },
      { name: "67250 ปณ.ท่าพล", url: "https://reg6-bom.thpcore.com/web/login?db=67250" },
      { name: "67170 ปณ.ศรีเทพ", url: "https://reg6-bom.thpcore.com/web/login?db=67170" },
      { name: "67270 ปณ.เขาค้อ", url: "https://reg6-bom.thpcore.com/web/login?db=67270" },
      { name: "66160 ปณ.สากเหล็ก", url: "https://reg6-bom.thpcore.com/web/login?db=66160" },
      { name: "66170 ปณ.หัวดง", url: "https://reg6-bom.thpcore.com/web/login?db=66170" },
      { name: "67180 ปณ.พุเตย", url: "https://reg6-bom.thpcore.com/web/login?db=67180" },
      { name: "67190 ปณ.ดงขุย", url: "https://reg6-bom.thpcore.com/web/login?db=67190" },
      { name: "66220 ปณ.กำแพงดิน", url: "https://reg6-bom.thpcore.com/web/login?db=66220" },
      { name: "66150 ปณ.ทับคล้อ", url: "https://reg6-bom.thpcore.com/web/login?db=66150" },
      { name: "67240 ปณ.วังโป่ง", url: "https://reg6-bom.thpcore.com/web/login?db=67240" },
      { name: "66230 ปณ.เขาทราย", url: "https://reg6-bom.thpcore.com/web/login?db=66230" },
      { name: "63140 ปณ.แม่ระมาด", url: "https://reg6-bom.thpcore.com/web/login?db=63140" },
      { name: "66190 ปณ.โพธิ์ประทับช้าง", url: "https://reg6-bom.thpcore.com/web/login?db=66190" },
      { name: "66210 ปณ.วังตะกู", url: "https://reg6-bom.thpcore.com/web/login?db=66210" },
      { name: "63150 ปณ.ท่าสองยาง", url: "https://reg6-bom.thpcore.com/web/login?db=63150" },
      { name: "63170 ปณ.อุ้มผาง", url: "https://reg6-bom.thpcore.com/web/login?db=63170" },
      { name: "63180 ปณ.วังเจ้า", url: "https://reg6-bom.thpcore.com/web/login?db=63180" },
      { name: "63120 ปณ.บ้านตาก", url: "https://reg6-bom.thpcore.com/web/login?db=63120" },
      { name: "63130 ปณ.สามเงา", url: "https://reg6-bom.thpcore.com/web/login?db=63130" },
    ],
  },
];

export default function Login() {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showScroll, setShowScroll] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkScrollTop = () => {
      if (window.scrollY > 400) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredLinks = resourceLinks
    .map((section) => ({
      ...section,
      links: section.links.filter((link) =>
        link.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((section) => section.links.length > 0);

  const getShortName = (name) => {
    if (name.includes("Other")) return "คู่มือการใช้งาน และ รวมลิงก์";
    if (name.includes("ระบบ BOM")) return "ระบบ BOM";
    return name;
  };

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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#0b0e11",
        fontFamily: "var(--font-family)",
        color: "#ffffff",
      }}
    >
      <style>{`
        @keyframes cardEntrance {
          0% { opacity: 0; transform: translateY(20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
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
          height: 40px !important;
          padding: 0 24px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          cursor: pointer !important;
        }
        .login-btn-primary:hover:not(:disabled) {
          background-color: #f0b90b !important;
        }
        .premium-input {
          width: 100%; height: 40px; padding: 10px 16px; border-radius: 6px; font-size: 14px;
          background-color: #ffffff; border: 1px solid #eaecef; color: #181a20;
          outline: none; transition: border-color 0.2s ease, box-shadow 0.2s ease;
          font-family: var(--font-family);
        }
        .premium-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        .premium-input::placeholder {
          color: #707a8a;
        }
        .feature-icon-box {
          width: 44px; height: 44px; border-radius: 12px;
          background-color: #1e2329; border: 1px solid #2b3139;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .resource-link-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 24px;
          background-color: #1e2329;
          border: 1px solid #2b3139;
          border-radius: 12px;
          text-decoration: none;
          color: #eaecef;
          font-weight: 500;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }
        .resource-link-card:hover {
          border-color: #2b3139;
          background-color: #2b3139;
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.06);
        }
        .animate-stagger-1 { animation: staggerFadeUp 0.4s ease-out forwards; animation-delay: 0.1s; opacity: 0; }
        .animate-stagger-2 { animation: staggerFadeUp 0.4s ease-out forwards; animation-delay: 0.2s; opacity: 0; }
        .animate-stagger-3 { animation: staggerFadeUp 0.4s ease-out forwards; animation-delay: 0.3s; opacity: 0; }
        .animate-stagger-4 { animation: staggerFadeUp 0.4s ease-out forwards; animation-delay: 0.4s; opacity: 0; }

        /* Layout media queries */
        @media (max-width: 900px) {
          .login-layout-container {
            flex-direction: column !important;
          }
          .login-sidebar {
            flex: none !important;
            height: auto !important;
            position: relative !important;
            border-right: none !important;
            border-bottom: 1px solid #2b3139 !important;
            padding: 40px 24px !important;
          }
          .login-content {
            padding: 40px 24px !important;
          }
          .links-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div
        className="login-layout-container"
        style={{ display: "flex", flexDirection: "column", width: "100%" }}
      >
        {/* Navbar Section */}
        <div
          style={{
            height: "80px",
            padding: "0 48px",
            borderBottom: "1px solid #2b3139",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "rgba(11, 14, 17, 0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#FCD535",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i
                className="fa-solid fa-cube"
                style={{ color: "#181a20", fontSize: "20px" }}
              ></i>
            </div>
            <span
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: "-0.5px",
              }}
            >
              CMP-Core
            </span>
          </div>

          <button
            className="login-btn-primary"
            onClick={() => setShowModal(true)}
            style={{ height: "40px", padding: "0 24px", fontSize: "14px" }}
          >
            <i className="fa-solid fa-right-to-bracket"></i>
            เข้าสู่ระบบ
          </button>
        </div>

        {/* Main Content: Links Content */}
        <div
          style={{
            flex: 1,
            padding: "64px 48px 120px",
            maxWidth: "1440px",
            margin: "0 auto",
            width: "100%",
            backgroundColor: "#0b0e11",
          }}
        >
          <h2
            className="animate-stagger-1"
            style={{
              fontSize: "32px",
              fontWeight: 700,
              marginBottom: "32px",
              color: "#ffffff",
              textAlign: "center",
            }}
          >
            แหล่งข้อมูลและทรัพยากร
          </h2>

          <div
            className="animate-stagger-2"
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            <div
              style={{ position: "relative", width: "100%", maxWidth: "600px" }}
            >
              <i
                className="fa-solid fa-magnifying-glass"
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#707a8a",
                }}
              ></i>
              <input
                type="text"
                placeholder="ค้นหาชื่อที่ทำการ, จังหวัด หรือเอกสาร..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  height: "56px",
                  padding: "0 20px 0 52px",
                  borderRadius: "9999px",
                  border: "1px solid #2b3139",
                  backgroundColor: "#1e2329",
                  color: "#ffffff",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#FCD535";
                  e.target.style.boxShadow =
                    "0 0 0 2px rgba(252, 213, 53, 0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#2b3139";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {filteredLinks.length > 0 && (
            <div
              className="animate-stagger-2"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "12px",
                marginBottom: "64px",
              }}
            >
              {filteredLinks.map((section, idx) => (
                <button
                  key={`chip-${idx}`}
                  onClick={() => {
                    const el = document.getElementById(`section-${idx}`);
                    if (el) {
                      const y =
                        el.getBoundingClientRect().top + window.scrollY - 40;
                      window.scrollTo({ top: y, behavior: "smooth" });
                    }
                  }}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#1e2329",
                    border: "1px solid #2b3139",
                    borderRadius: "9999px",
                    color: "#eaecef",
                    fontSize: "14px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#2b3139";
                    e.currentTarget.style.borderColor = "#FCD535";
                    e.currentTarget.style.color = "#FCD535";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#1e2329";
                    e.currentTarget.style.borderColor = "#2b3139";
                    e.currentTarget.style.color = "#eaecef";
                  }}
                >
                  {getShortName(section.category)}
                </button>
              ))}
            </div>
          )}

          <div
            style={{ display: "flex", flexDirection: "column", gap: "64px" }}
          >
            {filteredLinks.length === 0 && (
              <div
                style={{
                  textAlign: "center",
                  color: "#707a8a",
                  padding: "40px 0",
                }}
              >
                <i
                  className="fa-solid fa-folder-open"
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                    opacity: 0.5,
                  }}
                ></i>
                <p>ไม่พบข้อมูลที่ค้นหา "{searchQuery}"</p>
              </div>
            )}
            {filteredLinks.map((section, idx) => (
              <div
                key={idx}
                id={`section-${idx}`}
                className={`animate-stagger-${Math.min(idx + 2, 4)}`}
              >
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    marginBottom: "24px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid #2b3139",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "#ffffff",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: "#1e2329",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <i
                      className={`fa-solid ${section.icon}`}
                      style={{ color: "#707a8a", fontSize: "14px" }}
                    ></i>
                  </div>
                  {section.category}
                </h3>
                <div
                  className="links-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "24px",
                  }}
                >
                  {section.links.map((link, lidx) => (
                    <a
                      key={lidx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-link-card"
                    >
                      <i
                        className={
                          link.url.includes("drive.google") ||
                          link.url.includes("docs.google")
                            ? "fa-brands fa-google-drive"
                            : link.url.includes("canva")
                              ? "fa-solid fa-pen-nib"
                              : "fa-solid fa-globe"
                        }
                        style={{
                          color:
                            link.url.includes("drive.google") ||
                            link.url.includes("docs.google")
                              ? "#0ecb81"
                              : link.url.includes("canva")
                                ? "#2dbdb6"
                                : "#707a8a",
                          fontSize: "20px",
                          width: "24px",
                          textAlign: "center",
                        }}
                      ></i>
                      <span
                        style={{ flex: 1, fontSize: "14px", lineHeight: "1.4" }}
                      >
                        {link.name}
                      </span>
                      <i
                        className="fa-solid fa-arrow-up-right-from-square"
                        style={{ color: "#707a8a", fontSize: "12px" }}
                      ></i>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            backgroundColor: "#0b0e11",
            padding: "48px 24px",
            textAlign: "center",
            borderTop: "1px solid #2b3139",
          }}
        >
          <div
            style={{
              color: "#707a8a",
              fontSize: "14px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                opacity: 0.8,
              }}
            >
              <i
                className="fa-solid fa-cube"
                style={{ fontSize: "16px", color: "#FCD535" }}
              ></i>
              <span
                style={{
                  fontWeight: 600,
                  color: "#ffffff",
                  letterSpacing: "-0.5px",
                }}
              >
                CMP-Core
              </span>
            </div>
            <p style={{ margin: 0, fontWeight: 500, letterSpacing: "0.2px" }}>
              Better by Design คนทำงานดวด
            </p>
          </div>
        </div>
      </div>

      {/* Login Modal Overlay */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(24, 26, 32, 0.5)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            animation: "fadeIn 0.2s ease-out forwards",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff", // Canvas Light
              borderRadius: "12px", // {rounded.xl}
              padding: "48px 40px",
              width: "100%",
              maxWidth: "420px",
              border: "1px solid #eaecef", // {colors.hairline-on-light}
              boxShadow: "none", // Flat surface per design.md
              position: "relative",
              animation:
                "cardEntrance 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "none",
                border: "none",
                fontSize: "20px",
                color: "#707a8a",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#f5f5f5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

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
                <i
                  className="fa-solid fa-cube"
                  style={{ fontSize: "28px", color: "#181a20" }}
                ></i>
              </div>
            </div>

            {/* Headings */}
            <h2
              style={{
                marginBottom: "8px",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: 700,
                color: "#181a20",
                letterSpacing: "-0.5px",
              }}
            >
              เข้าสู่ระบบ CMP-Core
            </h2>
            <p
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
                <i className="fa-solid fa-circle-exclamation"></i> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin}>
              <div
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
                  <div style={{ position: "relative" }}>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="premium-input"
                      style={{ paddingRight: "48px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        color: "#707a8a",
                        cursor: "pointer",
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i
                        className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                      ></i>
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="login-btn-primary"
                style={{ width: "100%" }}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>{" "}
                    Authenticating...
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        style={{
          position: "fixed",
          bottom: "40px",
          right: "40px",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "#FCD535",
          color: "#181a20",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          cursor: "pointer",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          opacity: showScroll ? 1 : 0,
          transform: showScroll ? "translateY(0)" : "translateY(20px)",
          pointerEvents: showScroll ? "auto" : "none",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 9000,
        }}
        onMouseEnter={(e) => {
          if (showScroll) {
            e.currentTarget.style.backgroundColor = "#f0b90b";
            e.currentTarget.style.transform = "translateY(-4px)";
          }
        }}
        onMouseLeave={(e) => {
          if (showScroll) {
            e.currentTarget.style.backgroundColor = "#FCD535";
            e.currentTarget.style.transform = "translateY(0)";
          }
        }}
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </div>
  );
}
