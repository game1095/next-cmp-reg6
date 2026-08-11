import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Layout({ session, children }) {
  const navigate = useNavigate();
  const userEmail = session?.user?.email || '';

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'row',
      backgroundColor: 'var(--theme-canvas)',
      overflow: 'hidden' // Prevent double scrollbars
    }}>
      {/* ── Left Sidebar ── */}
      <aside className="no-print" style={{
        width: '260px',
        flexShrink: 0,
        backgroundColor: 'var(--theme-surface-strong)', // Solid premium look
        borderRight: '1px solid var(--theme-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 100,
        boxShadow: '4px 0 24px rgba(0,0,0,0.02)'
      }}>
        {/* Top — Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontWeight: 800,
          fontSize: '20px',
          color: 'var(--theme-ink)',
          letterSpacing: '-0.5px',
          padding: '24px',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'var(--primary)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--theme-canvas)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          CMP-Core
        </div>

        {/* Middle — Nav Links */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          padding: '24px 16px',
          flex: 1, // Push the bottom section down
          overflowY: 'auto'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginLeft: '12px', marginBottom: '8px' }}>
            Main Menu
          </span>
          <NavItem to="/" label="ข้อมูลลูกค้า" icon="👥" />
          <NavItem to="/signatories" label="ผู้ลงนาม" icon="✍️" />
          <NavItem to="/guide" label="แนะนำการใช้งาน" icon="📖" />
          <NavItem to="/developer" label="ผู้พัฒนา" icon="✨" />
        </div>

        {/* Bottom — User & Theme & Logout */}
        <div style={{
          padding: '20px 16px',
          borderTop: '1px solid var(--theme-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* User Profile Mini */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            backgroundColor: 'var(--theme-canvas)',
            borderRadius: '12px',
            border: '1px solid var(--theme-border)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: 'var(--primary)', color: 'var(--on-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, flexShrink: 0
            }}>
              {userEmail.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span style={{
                fontSize: '13px',
                color: 'var(--theme-ink)',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {userEmail}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>Admin</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                flex: 1,
                background: 'var(--theme-canvas)',
                border: '1px solid var(--theme-border)',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--theme-ink)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--theme-border)'; e.currentTarget.style.color = 'var(--theme-ink)'; }}
              title={isDark ? "เปลี่ยนเป็นโหมดสว่าง" : "เปลี่ยนเป็นโหมดมืด"}
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            <button
              onClick={handleLogout}
              style={{
                flex: 1,
                background: 'rgba(246, 70, 93, 0.05)',
                border: '1px solid rgba(246, 70, 93, 0.2)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--trading-down)',
                cursor: 'pointer',
                fontFamily: 'var(--font-family)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'rgba(246, 70, 93, 0.1)'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'rgba(246, 70, 93, 0.05)'; }}
              title="ออกจากระบบ"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Page Content ── */}
      <main style={{
        flex: 1,
        height: '100vh',
        overflowY: 'auto',
        backgroundColor: 'var(--theme-canvas)',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '40px 32px',
        }}>
          {children}
        </div>
      </main>
    </div>
  );
}

/** Individual nav tab */
function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      end
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        fontSize: '14px',
        fontWeight: isActive ? 700 : 500,
        color: isActive ? 'var(--primary)' : 'var(--muted)',
        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
        borderRadius: '12px',
        textDecoration: 'none',
        transition: 'all 0.2s ease',
      })}
      className="nav-sidebar-item"
    >
      {({ isActive }) => (
        <>
          <span style={{ 
            fontSize: '18px', 
            filter: isActive ? 'drop-shadow(0 2px 4px rgba(59,130,246,0.3))' : 'grayscale(100%) opacity(0.6)',
            transition: 'all 0.2s ease'
          }}>
            {icon}
          </span>
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
}
