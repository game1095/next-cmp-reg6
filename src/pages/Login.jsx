import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import Button from "../components/Button";

const resourceLinks = [
  {
    category: "รวมลิ้งก์การกรอกข้อมูล cmp แยกตาม จังหวัด",
    icon: "fa-map-location-dot",
    links: [
      {
        name: "ปจ.นครสวรรค์ และที่ทำการในสังกัด",
        url: "https://drive.google.com/drive/folders/16u20kFr-MZUoK1TMcS2NCPEk10F2VJG2?usp=sharing",
      },
      {
        name: "ปจ.อุทัยธานี และที่ทำการในสังกัด",
        url: "https://drive.google.com/drive/folders/1QN0EroC5UEdwxy2f_eTcm6LlNykcepkW?usp=drive_link",
      },
      {
        name: "ปจ.กำแพงเพชร และที่ทำการในสังกัด",
        url: "https://drive.google.com/drive/folders/1DTVyD706bx-qEagJ7HEKMQ4DyNEdZrPg?usp=drive_link",
      },
      {
        name: "ปจ.ตาก และที่ทำการในสังกัด",
        url: "https://drive.google.com/drive/folders/1E0uvfRUq4rlvet6y3teCHosqlCwegstm?usp=drive_link",
      },
      {
        name: "ปจ.สุโขทัย และที่ทำการในสังกัด",
        url: "https://drive.google.com/drive/folders/1u0G_W4EsSy9WxcJhwOMVVdFZBckufRRB?usp=drive_link",
      },
      {
        name: "ปจ.พิษณุโลก และที่ทำการในสังกัด",
        url: "https://drive.google.com/drive/folders/1d-kaVfqPzPdkvYEOq74ejV2D1glhRtX4?usp=drive_link",
      },
      {
        name: "ปจ.พิจิตร และที่ทำการในสังกัด",
        url: "https://drive.google.com/drive/folders/1LQMWOyaXpPEkmzkzV6uhX3zXMqf7UgRx?usp=drive_link",
      },
      {
        name: "ปจ.เพชรบูรณ์ และที่ทำการในสังกัด",
        url: "https://drive.google.com/drive/folders/1VAGG9dORmWwjH7p63hffdcppWYD82-tF?usp=drive_link",
      },
      {
        name: "ศป.พิษณุโลก",
        url: "https://drive.google.com/drive/folders/15fUQ31Io-_vTz29tPXKdxHGX9dPOhq-n?usp=drive_link",
      },
      {
        name: "ปณร./ปณย. (ปจ.พิษณุโลก และ ปจ.พิจิตร)",
        url: "https://drive.google.com/drive/folders/1CUJ_nLsdNI5KUy8dsD_qGZbbLLFqn2ui?usp=drive_link",
      },
    ],
  },
  {
    category: "ที่ทำการ Phase 1 (11 - 15 ส.ค. 2569)",
    icon: "fa-1",
    links: [
      {
        name: "60110 ปณ.หนองบัว",
        url: "https://docs.google.com/spreadsheets/d/1sbgnTyB9iPTgftU9tkFcH6NpNAzfPdRRUEr8dHMmyvo/edit?usp=drive_link",
      },
      {
        name: "60240 ปณ.หนองเบน",
        url: "https://docs.google.com/spreadsheets/d/13kH1M5OWJqSkNL2VdDJISuQsXJPTt5rvk2Y7ot1PANQ/edit?usp=drive_link",
      },
    ],
  },
  {
    category: "ที่ทำการ Phase 2 (17 - 21 ส.ค. 2569)",
    icon: "fa-2",
    links: [
      {
        name: "60170 ปณ.โกรกพระ",
        url: "https://docs.google.com/spreadsheets/d/1-m0b72N5w7XqWncVtqSKuiy8GqNxX0Zfk_PzzeauKtU/edit?usp=drive_link",
      },
      {
        name: "61120 ปณ.ทัพทัน",
        url: "https://docs.google.com/spreadsheets/d/1D28gBeJDu7kH2Na7KnAW8_821MjxjPS0XiDBYAyMXJk/edit?usp=drive_link",
      },
      {
        name: "62130 ปณ.ขาณุวรลักษบุรี",
        url: "https://docs.google.com/spreadsheets/d/19Wu5YrwvyOdTzX07BnGv1zaJ6i1Q4Dl4lAL04ahMFiU/edit?usp=drive_link",
      },
      {
        name: "63120 ปณ.บ้านตาก",
        url: "https://docs.google.com/spreadsheets/d/1X6HnSAnw70WnI3yROdkLp9U_WwuWyyR2_GlAdDXDbL8/edit?usp=drive_link",
      },
      {
        name: "64220 ปณ.บ้านสวน",
        url: "https://docs.google.com/spreadsheets/d/1MZL3YDnbPZucxAKidx-Mta3A_VX65i9Sc4qZ67_4kOk/edit?usp=drive_link",
      },
      {
        name: "64230 ปณ.บ้านใหม่ไชยมงคล",
        url: "https://docs.google.com/spreadsheets/d/1Q3tmsJvVbcGbYX9SZyNWgCtrNoU5up09Q9AYWuVW5-o/edit?usp=drive_link",
      },
      {
        name: "65160 ปณ.วัดโบสถ์",
        url: "https://docs.google.com/spreadsheets/d/1saJelwMv7m54FcbU0SXZvIfStu76ZNIXuS7ft-DlVHA/edit?usp=drive_link",
      },
      {
        name: "65220 ปณ.แก่งโสภา",
        url: "https://docs.google.com/spreadsheets/d/1qi5n2y3TLeXAP3XsgegH8y6F68E5WNuxl_xJYsDgzqM/edit?usp=drive_link",
      },
      {
        name: "66190 ปณ.โพธิ์ประทับช้าง",
        url: "https://docs.google.com/spreadsheets/d/1qOQGqjJ8b8lF_4RigtP1eTl5k25lBFG66rOw0fpuRVc/edit?usp=drive_link",
      },
      {
        name: "67180 ปณ.พุเตย",
        url: "https://docs.google.com/spreadsheets/d/1wc974O_9ku1_AuDwu6oq4kqJiHRKa5J9qBw_p7RLLs8/edit?usp=drive_link",
      },
    ],
  },
  {
    category: "ที่ทำการ Phase 3 (ยังไม่กำหนดเวลา)",
    icon: "fa-3",
    links: [
      {
        name: "60220 ปณ.ไพศาลี",
        url: "https://docs.google.com/spreadsheets/d/1y50sv5xQQ9LgkV4yis5SXmarrbRwD3ucG-zwTq28e9U/edit?usp=drive_link",
      },
      {
        name: "61150 ปณ.สว่างอารมณ์",
        url: "https://docs.google.com/spreadsheets/d/1buTRnOCc8Vjscgwq1kKcDrVqfbwA3XmXe1_jh0twzkw/edit?usp=drive_link",
      },
      {
        name: "62140 ปณ.สลกบาตร",
        url: "https://docs.google.com/spreadsheets/d/1sS_kTzj-FTxvoyFKxtl6ELni7_n14gupQjsBJS_ntVc/edit?usp=drive_link",
      },
      {
        name: "62150 ปณ.ไทรงาม",
        url: "https://docs.google.com/spreadsheets/d/1HqfAho_V1LCD63jRFRpcg8Z1qcEr7584wqDzoAy4bzc/edit?usp=drive_link",
      },
      {
        name: "62170 ปณ.ลานกระบือ",
        url: "https://docs.google.com/spreadsheets/d/1LX7_YA79im99qGCb0gZLpnqYEJ6pX-e9r-nbBxF84Mw/edit?usp=drive_link",
      },
      {
        name: "62190 ปณ.ทุ่งทราย",
        url: "https://docs.google.com/spreadsheets/d/1eAJnv_WqdGIzCEI4WgX_zzMQX3khoqqqDR-zUmb10J8/edit?usp=drive_link",
      },
      {
        name: "63130 ปณ.สามเงา",
        url: "https://docs.google.com/spreadsheets/d/1hdgvMwP0SvsDtTxUKH66USsAF03s-IAsVd_OFVXglt8/edit?usp=drive_link",
      },
      {
        name: "63140 ปณ.แม่ระมาด",
        url: "https://docs.google.com/spreadsheets/d/1KoiAk_duKFnSH-jt7FWZzwLc22Xqp1zLa7ROh-w6E-g/edit?usp=drive_link",
      },
      {
        name: "63150 ปณ.ท่าสองยาง",
        url: "https://docs.google.com/spreadsheets/d/1CqeUriJBCW6CkpS5r9_s4QP-DH6yvqW_iap0O8OXSGw/edit?usp=drive_link",
      },
      {
        name: "63170 ปณ.อุ้มผาง",
        url: "https://docs.google.com/spreadsheets/d/10izSZolsuo3XXv4nJ_hlNNuoA-9V808bZ4lEX4AHVw0/edit?usp=drive_link",
      },
      {
        name: "63180 ปณ.วังเจ้า",
        url: "https://docs.google.com/spreadsheets/d/1WMs_L8c7t-EbHmZdst6d6fZ-Oq_IU4gW-1CL7dBajQY/edit?usp=drive_link",
      },
      {
        name: "64170 ปณ.กงไกรลาศ",
        url: "https://docs.google.com/spreadsheets/d/1jvYsuBe3nu5aH1hMBDK7XYdTiui7nJEJu9mtdbvTGjQ/edit?usp=drive_link",
      },
      {
        name: "64190 ปณ.ท่าชัย",
        url: "https://docs.google.com/spreadsheets/d/1Hp9zB7Pyf26gE1d_-IXRSO0vusldYSRKRMXsk32tR0Q/edit?usp=drive_link",
      },
      {
        name: "64210 ปณ.เมืองเก่า",
        url: "https://docs.google.com/spreadsheets/d/1hZhmrCTclkdlavjWpQFqSNyFyb8AHKfV2OfxQNEowuY/edit?usp=drive_link",
      },
      {
        name: "65180 ปณ.หนองตม",
        url: "https://docs.google.com/spreadsheets/d/1y4wsiXUfWhMaIxcJd2o0S3Ra5zTF63qkxyGXDvCZRyc/edit?usp=drive_link",
      },
      {
        name: "65190 ปณ.เนินมะปราง",
        url: "https://docs.google.com/spreadsheets/d/1vhLGyHiODAjmbLtfnEjK_gl8K7HRe66FJhBQs7qpAKs/edit?usp=drive_link",
      },
      {
        name: "66150 ปณ.ทับคล้อ",
        url: "https://docs.google.com/spreadsheets/d/1_RwwVizwbuvqLyyehM0CdGNGZsV7YNGBwNibOmgVqe4/edit?usp=drive_link",
      },
      {
        name: "66160 ปณ.สากเหล็ก",
        url: "https://docs.google.com/spreadsheets/d/1jMq7NxRXOEPgpxlO79Hnfc3oXk7fpGL1BKXAnskuqrI/edit?usp=drive_link",
      },
      {
        name: "66170 ปณ.หัวดง",
        url: "https://docs.google.com/spreadsheets/d/1uvOE1MxgiABGNF2Rrb2usEP5j40UKE31wjLlrezg7go/edit?usp=drive_link",
      },
      {
        name: "66210 ปณ.วังตะกู",
        url: "https://docs.google.com/spreadsheets/d/1H9OG2f-MWxIZhJ_D_QMP8H2tG3F0yrY_rDbBc4NOHFU/edit?usp=drive_link",
      },
      {
        name: "66220 ปณ.กำแพงดิน",
        url: "https://docs.google.com/spreadsheets/d/1n7DGyR1k93eqEHxlSkzUrEYzET8I1NcWkin-0eRLfKE/edit?usp=drive_link",
      },
      {
        name: "66230 ปณ.เขาทราย",
        url: "https://docs.google.com/spreadsheets/d/1DTSMzijhEdxhvVbr6Mxvutwrz6x2C61A7H55H1zD-_A/edit?usp=drive_link",
      },
      {
        name: "67170 ปณ.ศรีเทพ",
        url: "https://docs.google.com/spreadsheets/d/15wbQNEUjctyRxqvoX8PTnkGUgtawxIumXjEWK0Fd4B4/edit?usp=drive_link",
      },
      {
        name: "67190 ปณ.ดงขุย",
        url: "https://docs.google.com/spreadsheets/d/17qk7HQX3HGIQHPMVOcsUMnsPeNtsGE826B8opfcm6Js/edit?usp=drive_link",
      },
      {
        name: "67210 ปณ.วังชมภู",
        url: "https://docs.google.com/spreadsheets/d/1ejCMHBC6NEaBDl0qj8BUsz-rjzobIBdP7bN-N8_BFi0/edit?usp=drive_link",
      },
      {
        name: "67220 ปณ.นาเฉลียง",
        url: "https://docs.google.com/spreadsheets/d/1Sv-wm1JnyyIO0hJUSemGjzSm9OJf_krxWv94WDt0vVU/edit?usp=drive_link",
      },
      {
        name: "67240 ปณ.วังโป่ง",
        url: "https://docs.google.com/spreadsheets/d/1rSKpoZT5Gets-qQlQkzPnt7ok3N4wZnSnu-t29ipOco/edit?usp=drive_link",
      },
      {
        name: "67250 ปณ.ท่าพล",
        url: "https://docs.google.com/spreadsheets/d/1LbX53leiSwHOAU41uBwKayTeIz5MPy8Px-2hO15y7EI/edit?usp=drive_link",
      },
      {
        name: "67270 ปณ.เขาค้อ",
        url: "https://docs.google.com/spreadsheets/d/1CbPcLNGBfGT5yr2YnhM1sOg7JSRnzE4mYHKv0ux54Eo/edit?usp=drive_link",
      },
      {
        name: "67280 ปณ.แคมป์สน",
        url: "https://docs.google.com/spreadsheets/d/1EyvltjhIfOfhofEcJcrBZU95SMTSVhTxFsDzN_mk0Ro/edit?usp=drive_link",
      },
    ],
  },
  {
    category: "Other Resources",
    icon: "fa-link",
    links: [
      {
        name: "Onboard THP Core ปข.6",
        url: "https://docs.google.com/spreadsheets/d/13YFM1jd4S2K-hGsU1eREXhsuEjIiBB0cEkT__6hHnAc/edit?gid=0#gid=0",
      },
      {
        name: "คู่มือฉบับเต็ม",
        url: "https://www.canva.com/design/DAGvSCLX27Y/Hfkvl7HzZVZH3BPzBX-EQg/view?utlId=h8a95ce3478#16",
      },
      {
        name: "คู่มือฉบับย่อ",
        url: "https://www.canva.com/design/DAHR97wsJaI/rfE2rXx0-ZVcDdgTrfvk7Q/view?utlId=h9ed7a6774c",
      },
      {
        name: "ระบบออกเอกสารภายนอก",
        url: "https://next-cmp-reg6-one.vercel.app/",
      },
      { name: "เว็บ CMP", url: "https://cmp.thailandpost.com/" },
      {
        name: "เว็บ BOM-THP-Core",
        url: "https://reg6-bom.thpcore.com/web/database/selector",
      },
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
    if (name.includes("แยกตาม จังหวัด")) return "รายจังหวัด";
    if (name.includes("Phase 1")) return "Phase 1";
    if (name.includes("Phase 2")) return "Phase 2";
    if (name.includes("Phase 3")) return "Phase 3";
    if (name.includes("Other")) return "คู่มือการใช้งาน และ รวมลิงก์";
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
